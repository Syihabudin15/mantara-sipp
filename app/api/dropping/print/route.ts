import { GetRoman, serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IDropping } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { Prisma } from "@prisma/client";
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
  const user = await prisma.user.findFirst({ where: { id: session.user.id } });
  if (!user)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );

  const where: Prisma.SumdanWhereInput = {
    ...(search && {
      ProdukPembiayaan: {
        some: {
          Dapem: {
            some: {
              OR: [
                { no_contract: { contains: search } },
                {
                  Debitur: {
                    OR: [
                      { fullname: { contains: search } },
                      { nopen: { contains: search } },
                      { no_skep: { contains: search } },
                      { name_skep: { contains: search } },
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    }),
    ...(user.sumdanId && { id: user.sumdanId }),
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
                dropping_status: "PROSES",
                droppingId: null,
                video_contract: { not: null },
                file_contract: { not: null },
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
  const data: IDropping = await req.json();

  try {
    const { Sumdan, Dapems, ...saved } = data;
    await prisma.$transaction(async (tx) => {
      const drop = await tx.dropping.create({ data: saved });
      for (const dpm of Dapems) {
        await tx.dapem.update({
          where: { id: dpm.id },
          data: { droppingId: drop.id },
        });
      }
      return true;
    });

    return NextResponse.json(
      {
        msg: "Data SI Pencairan berhasil dicetak. mohon cek di menu List Dropping",
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
  const count = await prisma.dropping.count({ where: { sumdanId: id } });
  const sumdan = await prisma.sumdan.findFirst({ where: { id } });
  if (!sumdan)
    return NextResponse.json(
      { msg: "Id tidak ditemukan!", status: 400 },
      { status: 400 },
    );

  const nomor = `${String(count + 1).padStart(3, "0")}/${process.env.NEXT_PUBLIC_APP_CODE_FILE}/SI-${sumdan.code.replace("BPR", "").replace(" ", "").replace("BANK", "")}/${GetRoman(new Date().getMonth() + 1)}/${new Date().getFullYear()}`;

  return NextResponse.json({ data: nomor, status: 200 }, { status: 200 });
};
