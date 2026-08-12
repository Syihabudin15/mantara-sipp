import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { IJournalEntry } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const page = request.nextUrl.searchParams.get("page") || "1";
  const limit = request.nextUrl.searchParams.get("limit") || "50";
  const search = request.nextUrl.searchParams.get("search");
  const coaId = request.nextUrl.searchParams.get("coaId");
  const backdate = request.nextUrl.searchParams.get("backdate");

  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  // Jadikan 1 variabel agar tidak duplikat untuk findMany dan count
  const whereCondition: any = {
    ...(search && {
      JournalDetails: {
        some: {
          desciption: { contains: search }, // Catatan: Typo 'desciption' dari skema Anda
        },
      },
    }),
    ...(coaId && {
      JournalDetails: { some: { categoryOfAccountId: coaId } },
    }),
    ...(backdate && {
      date: {
        gte: moment(backdate.split(",")[0]).startOf("day").toDate(),
        // PERBAIKAN: Gunakan endOf("day") agar mencakup jam 23:59:59 pada tanggal akhir
        lte: moment(backdate.split(",")[1]).endOf("day").toDate(),
      },
    }),
  };

  try {
    // PERBAIKAN: Gunakan $transaction agar count dan fetch berjalan paralel (lebih cepat)
    const [total, find] = await prisma.$transaction([
      prisma.journalEntry.count({ where: whereCondition }),
      prisma.journalEntry.findMany({
        where: whereCondition,
        skip: skip,
        take: take,
        orderBy: { date: "desc" }, // Lebih masuk akal mengurutkan jurnal berdasarkan tanggal terbaru
        include: {
          JournalDetails: {
            include: {
              CategoryOfAccount: true,
              User: true, // PERBAIKAN: Sertakan User agar tampil di Frontend
            },
          },
        },
      }),
    ]);

    return NextResponse.json(
      { data: serializeForApi(find), total, status: 200 },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { msg: "Error fetching data", status: 500 },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  const data: IJournalEntry = await req.json();
  const { id, JournalDetails, ...saved } = data;

  try {
    await prisma.$transaction(async (tx) => {
      const genId = await generateJurnalId(tx); // Pass transaction
      const jurnal = await tx.journalEntry.create({
        data: { id: genId, ...saved },
      });

      const newList = JournalDetails.map((d, i) => {
        const { JournalEntry, CategoryOfAccount, User, ...entry } = d;
        return {
          ...entry,
          id: generateTXId(jurnal.id, i),
          journalEntryId: genId,
        };
      });

      await tx.journalDetail.createMany({ data: newList });
    });

    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: IJournalEntry = await req.json();
  const { id, JournalDetails, ...saved } = data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.journalEntry.update({
        where: { id },
        data: saved,
      });

      // Hapus semua detail lama
      await tx.journalDetail.deleteMany({ where: { journalEntryId: id } });

      // Masukkan detail baru yang diedit
      const newList = JournalDetails.map((d, i) => {
        const { JournalEntry, CategoryOfAccount, User, ...entry } = d;
        return {
          ...entry,
          id: generateTXId(id, i),
          journalEntryId: id,
        };
      });
      await tx.journalDetail.createMany({ data: newList });
    });

    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { msg: "ID Not found", status: 404 },
      { status: 404 },
    );
  }

  try {
    // PERBAIKAN: Bungkus proses hapus dengan transaction agar Atomik (Tidak terhapus setengah)
    await prisma.$transaction([
      prisma.journalDetail.deleteMany({ where: { journalEntryId: id } }),
      prisma.journalEntry.delete({ where: { id } }),
    ]);

    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { msg: "Error deleting data", status: 500 },
      { status: 500 },
    );
  }
};

// PERBAIKAN: Menerima instance context database (tx) agar tidak keluar dari Transaction scope saat proses POST
async function generateJurnalId(dbCtx: any = prisma) {
  const prefix = `TX`;
  const padLength = 4;

  const lastRecord = await dbCtx.journalEntry.findFirst({
    orderBy: { date: "desc" },
    select: { id: true },
  });

  if (!lastRecord) {
    return `${prefix}${String(1).padStart(padLength, "0")}`;
  }

  const currentNumber = parseInt(lastRecord.id.replace(prefix, ""), 10);
  return `${prefix}${String((Number.isNaN(currentNumber) ? 0 : currentNumber) + 1).padStart(padLength, "0")}`;
}

function generateTXId(jurnalId: string, ind: number) {
  const padLength = 3;
  return `${jurnalId}${String(ind).padStart(padLength, "0")}`;
}
