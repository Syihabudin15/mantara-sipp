import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IDropping } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import { Prisma } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  const limit = req.nextUrl.searchParams.get("limit") || "50";
  const search = req.nextUrl.searchParams.get("search") || "";
  const sumdanId = req.nextUrl.searchParams.get("sumdanId") || "";
  const status = req.nextUrl.searchParams.get("status");
  const backdate = req.nextUrl.searchParams.get("backdate");
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { Role: true, Cabang: true },
  });
  if (!user)
    return NextResponse.json(
      { data: [], total: 0, status: 200 },
      { status: 200 },
    );

  const where: Prisma.DroppingWhereInput = {
    ...(search && {
      OR: [
        { id: { contains: search } },
        {
          Dapems: {
            some: {
              OR: [
                { no_contract: { contains: search } },
                { id: { contains: search } },
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
      ],
    }),
    ...(sumdanId && { sumdanId: sumdanId }),
    ...(backdate && {
      created_at: {
        gte: moment(backdate.split(",")[0]).toDate(),
        lte: moment(backdate.split(",")[1]).toDate(),
      },
    }),
    ...(user.sumdanId && { sumdanId: user.sumdanId }),
    ...(status && { status: status === "true" ? true : false }),
    ...(user.Role.data_status === "AREA" && {
      Dapems: {
        some: {
          AO: { Cabang: { areaId: user.Cabang.areaId } },
          AOCabang: { Cabang: { areaId: user.Cabang.areaId } },
          AOArea: { Cabang: { areaId: user.Cabang.areaId } },
          User: { Cabang: { areaId: user.Cabang.areaId } },
        },
      },
    }),
    ...(user.Role.data_status === "CABANG" && {
      Dapems: {
        some: {
          AO: { cabangId: user.cabangId },
          AOCabang: { cabangId: user.cabangId },
          AOArea: { cabangId: user.cabangId },
          User: { cabangId: user.cabangId },
        },
      },
    }),
    ...(user.Role.data_status === "USER" && {
      Dapems: {
        some: {
          AO: { id: user.id },
          AOCabang: { id: user.id },
          AOArea: { id: user.id },
          User: { id: user.id },
        },
      },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.dropping.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        created_at: "desc",
      },
      include: {
        Sumdan: true,
        Dapems: {
          include: {
            Debitur: true,
            ProdukPembiayaan: { include: { Sumdan: true } },
            JenisPembiayaan: true,
            AO: { include: { Cabang: { include: { Area: true } } } },
            AOCabang: { include: { Cabang: { include: { Area: true } } } },
            AOArea: { include: { Cabang: { include: { Area: true } } } },
            User: { include: { Cabang: { include: { Area: true } } } },
            PayOffice: true,
            Insurance: true,
          },
        },
      },
    }),
    await prisma.dropping.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: serializeForApi(data),
    total: total,
  });
};

export const PUT = async (req: NextRequest) => {
  const data: IDropping = await req.json();

  try {
    const { Dapems, Sumdan, ...saved } = data;
    await prisma.$transaction(async (tx) => {
      await tx.dropping.update({ where: { id: data.id }, data: saved });
      for (const dpm of Dapems) {
        const {
          ProdukPembiayaan,
          JenisPembiayaan,
          AO,
          AOCabang,
          AOArea,
          User,
          Debitur,
          Angsurans,
          Berkas,
          Jaminan,
          Dropping,
          Pelunasan,
          AgentFronting,
          PayOffice,
          Insurance,
          ...dpmData
        } = dpm;
        await prisma.dapem.update({
          where: { id: dpm.id },
          data: {
            ...dpmData,
            takeover_status: JenisPembiayaan.status_takeover
              ? "DRAFT"
              : "DISETUJUI",
            mutasi_status: JenisPembiayaan.status_mutasi
              ? "DRAFT"
              : "DISETUJUI",
          },
        });
      }
    });
    return NextResponse.json(
      {
        msg: "Data Pencairan berhasil diperbarui.",
        status: 200,
      },
      { status: 200 },
    );
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
  if (!id)
    return NextResponse.json(
      { status: 404, msg: "Not found!" },
      { status: 404 },
    );

  const find = await prisma.dropping.findFirst({
    where: { id },
    include: { Dapems: true },
  });
  if (find) {
    await prisma.$transaction(async (tx) => {
      await tx.dapem.updateMany({
        where: { droppingId: id },
        data: { droppingId: null },
      });
      await tx.dropping.delete({ where: { id } });
      return true;
    });
  }

  return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
};
