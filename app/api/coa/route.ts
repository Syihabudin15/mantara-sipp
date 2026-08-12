import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import prisma from "@/libs/Prisma";
import { AccountType, CategoryOfAccount } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const page = request.nextUrl.searchParams.get("page") || "1";
  const limit = request.nextUrl.searchParams.get("limit") || "50";
  const search = request.nextUrl.searchParams.get("search");
  const type = request.nextUrl.searchParams.get("type");
  const level = request.nextUrl.searchParams.get("level");

  const take = parseInt(limit);
  const skip = (parseInt(page) - 1) * take;

  const whereCondition = {
    ...(search && {
      OR: [{ id: { contains: search } }, { name: { contains: search } }],
    }),
    ...(type && { type: type as AccountType }),
    ...(level && { parentId: { not: null } }),
  };

  // Gunakan $transaction untuk mengambil total baris dan data secara paralel
  const [total, find] = await prisma.$transaction([
    prisma.categoryOfAccount.count({ where: whereCondition }),
    prisma.categoryOfAccount.findMany({
      where: whereCondition,
      skip: skip,
      take: take,
      orderBy: { id: "asc" }, // WAJIB: Agar Tree Terurut
      include: { Childrens: true, Parent: true },
    }),
  ]);

  return NextResponse.json(
    { data: serializeForApi(find), total, status: 200 },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const payload = await req.json();

  // Pisahkan field relasi agar tidak masuk ke Prisma data
  const { Childrens, Parent, JournalDetails, ...validData } = payload;

  const find = await prisma.categoryOfAccount.findFirst({
    where: { id: validData.id },
  });

  if (find) {
    return NextResponse.json(
      { msg: "ID atau No Akun sudah digunakan!", status: 400 },
      { status: 400 },
    );
  }

  try {
    // Gunakan validData
    await prisma.categoryOfAccount.create({ data: validData });
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
  const payload = await req.json();
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { msg: "Parameter ID wajib dikirim!", status: 400 },
      { status: 400 },
    );
  }

  // Pisahkan field relasi agar tidak masuk ke Prisma data
  const { Childrens, Parent, JournalDetails, ...validData } = payload;

  if (validData.parentId === id) {
    return NextResponse.json(
      {
        msg: "Akun tidak boleh menjadi parent untuk dirinya sendiri!",
        status: 400,
      },
      { status: 400 },
    );
  }

  const find = await prisma.categoryOfAccount.findFirst({
    where: { id: validData.id },
  });

  if (id !== validData.id && find) {
    return NextResponse.json(
      { msg: "ID atau No Akun sudah digunakan!", status: 400 },
      { status: 400 },
    );
  }

  try {
    // Gunakan validData
    await prisma.categoryOfAccount.update({ where: { id }, data: validData });
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

  // Hapus hardcode "1"
  if (!id) {
    return NextResponse.json(
      { msg: "ID atau No Akun tidak ditemukan!", status: 404 },
      { status: 404 },
    );
  }

  try {
    // Include Childrens untuk dicek
    const find = await prisma.categoryOfAccount.findFirst({
      where: { id },
      include: { JournalDetails: true, Childrens: true },
    });

    if (!find) {
      return NextResponse.json(
        { msg: "Data COA tidak ditemukan!", status: 404 },
        { status: 404 },
      );
    }

    if (find.JournalDetails.length !== 0) {
      return NextResponse.json(
        {
          msg: "COA ini memiliki journal yang terhubung. Tidak dapat menghapus data!",
          status: 400,
        },
        { status: 400 },
      );
    }

    // Validasi tambahan: Jangan hapus jika punya sub-akun
    if (find.Childrens && find.Childrens.length !== 0) {
      return NextResponse.json(
        {
          msg: "COA ini memiliki Sub-Akun. Hapus atau pindahkan Sub-Akun terlebih dahulu!",
          status: 400,
        },
        { status: 400 },
      );
    }

    await prisma.categoryOfAccount.delete({
      where: { id },
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
