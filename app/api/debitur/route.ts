import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import prisma from "@/libs/Prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const {
    page = "1",
    limit = "50",
    search,
    address,
    group_skep,
    payOfficeId,
    aktif,
  } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const session = await getSession();

  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { Role: true, Cabang: true },
  });
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const where: Prisma.DebiturWhereInput = {
    ...(search && {
      OR: [
        { nopen: { contains: search } },
        { fullname: { contains: search } },
        { account_number: { contains: search } },
        { no_skep: { contains: search } },
      ],
    }),
    ...(address && {
      OR: [
        { address: { contains: address } },
        { ward: { contains: address } },
        { district: { contains: address } },
        { city: { contains: address } },
        { province: { contains: address } },
        { pos_code: { contains: address } },
      ],
    }),
    ...(group_skep && { group_skep: group_skep }),
    ...(payOfficeId && { payOfficeId: payOfficeId }),
    ...(user.sumdanId && {
      Dapems: { some: { ProdukPembiayaan: { sumdanId: user.sumdanId } } },
    }),
    ...(aktif && {
      Dapems: {
        some: {
          dropping_status: {
            in: ["LUNAS", "DISETUJUI", "PROSES"],
          },
          status: true,
        },
      },
    }),
  };
  const [data, total] = await Promise.all([
    prisma.debitur.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      include: {
        Dapems: {
          where: {
            dropping_status: {
              in: ["LUNAS", "DISETUJUI", "PROSES"],
            },
            status: true,
            ...(user.sumdanId && {
              ProdukPembiayaan: { sumdanId: user.sumdanId },
            }),
            ...(user.Role.data_status === "AREA" && {
              AO: { Cabang: { areaId: user.Cabang.areaId } },
              AOCabang: { Cabang: { areaId: user.Cabang.areaId } },
              AOArea: { Cabang: { areaId: user.Cabang.areaId } },
              User: { Cabang: { areaId: user.Cabang.areaId } },
            }),
            ...(user.Role.data_status === "CABANG" && {
              AO: { cabangId: user.cabangId },
              AOCabang: { cabangId: user.cabangId },
              AOArea: { cabangId: user.cabangId },
              User: { cabangId: user.cabangId },
            }),
            ...(user.Role.data_status === "USER" && {
              AO: { id: user.id },
              AOCabang: { id: user.id },
              AOArea: { id: user.id },
              User: { id: user.id },
            }),
          },
          include: {
            ProdukPembiayaan: { include: { Sumdan: true } },
            JenisPembiayaan: true,
            AO: { include: { Cabang: { include: { Area: true } } } },
            AOCabang: { include: { Cabang: { include: { Area: true } } } },
            AOArea: { include: { Cabang: { include: { Area: true } } } },
            Angsurans: true,
          },
        },
        PayOffice: true,
      },
      orderBy: {
        Dapems: {
          _count: "desc",
        },
      },
    }),
    prisma.debitur.count({ where }),
  ]);

  return NextResponse.json({
    status: 200,
    data: serializeForApi(data),
    total: total,
  });
};

export const PATCH = async (request: NextRequest) => {
  const nopen = request.nextUrl.searchParams.get("nopen");
  if (!nopen) {
    return NextResponse.json(
      { status: 400, msg: "Tidak ada nopen dalam parameter!" },
      { status: 400 },
    );
  }

  const find = await prisma.debitur.findFirst({
    where: { nopen: nopen },
  });
  if (!find) {
    return NextResponse.json(
      { status: 404, msg: "Debitur dengan nopen tersebut tidak ditemukan!" },
      { status: 404 },
    );
  }
  return NextResponse.json(
    { status: 200, msg: "OK", data: serializeForApi(find) },
    { status: 200 },
  );
};
