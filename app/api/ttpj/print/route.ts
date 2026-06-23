import { GetRoman, serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IDocument } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const search = req.nextUrl.searchParams.get("search");

  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { Cabang: true, Role: true },
  });
  if (!user)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );

  const where: Prisma.SumdanWhereInput = {
    ...(search && {
      ProdukPembiayaan: {
        some: {
          Dapems: {
            some: {
              Debitur: {
                OR: [
                  { fullname: { contains: search } },
                  { nopen: { contains: search } },
                  { no_skep: { contains: search } },
                  { name_skep: { contains: search } },
                  { account_number: { contains: search } },
                  { phone: { contains: search } },
                ],
              },
            },
          },
        },
      },
    }),
    ...(user.sumdanId && { id: user.sumdanId }),
    ...(user.Role.data_status === "AREA" && {
      ProdukPembiayaans: {
        some: {
          Dapems: {
            some: {
              AO: { Cabang: { areaId: user.Cabang.areaId } },
              AOCabang: { Cabang: { areaId: user.Cabang.areaId } },
              AOArea: { Cabang: { areaId: user.Cabang.areaId } },
              User: { Cabang: { areaId: user.Cabang.areaId } },
            },
          },
        },
      },
    }),
    ...(user.Role.data_status === "CABANG" && {
      ProdukPembiayaans: {
        some: {
          Dapems: {
            some: {
              AO: { cabangId: user.cabangId },
              AOCabang: { cabangId: user.cabangId },
              AOArea: { cabangId: user.cabangId },
              User: { cabangId: user.cabangId },
            },
          },
        },
      },
    }),
    ...(user.Role.data_status === "USER" && {
      ProdukPembiayaans: {
        some: {
          Dapems: {
            some: {
              AO: { id: user.id },
              AOCabang: { id: user.id },
              AOArea: { id: user.id },
              User: { id: user.id },
            },
          },
        },
      },
    }),
    status: true,
  };

  const [data, total] = await Promise.all([
    prisma.sumdan.findMany({
      where,
      include: {
        ProdukPembiayaans: {
          include: {
            Dapems: {
              include: {
                Debitur: true,
                JenisPembiayaan: true,
                ProdukPembiayaan: { include: { Sumdan: true } },
              },
              where: {
                dropping_status: { in: ["DISETUJUI", "LUNAS"] },
                jaminanId: null,
              },
              orderBy: { created_at: "desc" },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip: skip,
      take: parseInt(limit),
    }),
    prisma.sumdan.count({ where }),
  ]);

  const newData = data.map((d) => ({
    ...d,
    Dapems: d.ProdukPembiayaans.flatMap((pd) => pd.Dapems),
  }));

  return NextResponse.json({
    status: 200,
    data: serializeForApi(newData),
    total: total,
  });
};

export const POST = async (req: NextRequest) => {
  const data: IDocument = await req.json();

  try {
    const { Sumdan, Dapems, ...saved } = data;
    await prisma.$transaction(async (tx) => {
      const drop = await tx.jaminan.create({ data: saved });
      for (const dpm of Dapems) {
        await tx.dapem.update({
          where: { id: dpm.id },
          data: { jaminanId: drop.id, guarantee_status: "DELIVERY" },
        });
      }
      return true;
    });

    return NextResponse.json(
      {
        msg: "Data Penyerahan Jaminan berhasil dicetak. mohon cek di menu List TTPJ",
        status: 200,
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error!", status: 500 },
      { status: 500 },
    );
  }
};

export const PATCH = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id") || "id";
  const { created_at } = await req.json();
  const count = await prisma.jaminan.count({ where: { sumdanId: id } });
  const sumdan = await prisma.sumdan.findFirst({ where: { id } });
  if (!sumdan)
    return NextResponse.json(
      { msg: "Id tidak ditemukan!", status: 400 },
      { status: 400 },
    );

  const nomor = `${String(count + 1).padStart(3, "0")}/${process.env.NEXT_PUBLIC_APP_CODE_FILE}/TTPJ-${sumdan.code.replace("BPR", "").replace("BANK", "").replace(" ", "")}/${GetRoman(moment(created_at || new Date()).month() + 1)}/${moment(created_at || new Date()).year()}`;

  return NextResponse.json({ data: nomor, status: 200 }, { status: 200 });
};
