import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import prisma from "@/libs/Prisma";
import { Prisma, SumdanAgentFronting } from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const page = request.nextUrl.searchParams.get("page") || "1";
  const limit = request.nextUrl.searchParams.get("limit") || "50";
  const search = request.nextUrl.searchParams.get("search");
  const backdate = request.nextUrl.searchParams.get("backdate");
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where: Prisma.AgentFrontingWhereInput = {
    ...(search && {
      OR: [
        { id: { contains: search } },
        { name: { contains: search } },
        { code: { contains: search } },
      ],
    }),
  };
  const find = await prisma.agentFronting.findMany({
    where: where,
    skip: skip,
    take: parseInt(limit),
    include: {
      SumdanAgentFronting: {
        include: { Sumdan: { include: { ProdukPembiayaan: true } } },
      },
      User: { include: { Cabang: { include: { Area: true } } } },
      Dapem: {
        where: {
          ...(backdate && {
            created_at: {
              gte: moment(backdate.split(",")[0]).toDate(),
              lte: moment(backdate.split(",")[1]).toDate(),
            },
          }),
        },
      },
    },
  });
  const total = await prisma.agentFronting.count({ where });

  return NextResponse.json(
    { data: serializeForApi(find), total, status: 200 },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const find = await prisma.agentFronting.findFirst({
    where: { id: data.id },
  });
  if (find)
    return NextResponse.json(
      { msg: "ID sudah digunakan!", status: 400 },
      { status: 400 },
    );
  try {
    const genId = await generateId();
    const { id, SumdanAgentFronting, User, Dapem, ...saved } = data;
    await prisma.$transaction(async (tx) => {
      const agent = await tx.agentFronting.create({
        data: { id: genId, ...saved },
      });
      await tx.sumdanAgentFronting.createMany({
        data: SumdanAgentFronting.map((s: SumdanAgentFronting) => ({
          sumdanId: s.sumdanId,
          agentFrontingId: agent.id,
        })),
      });
      return true;
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
  const data = await req.json();
  const find = await prisma.agentFronting.findFirst({
    where: { id: data.id },
  });
  if (!find)
    return NextResponse.json(
      { msg: "ID atau No Akun sudah digunakan!", status: 400 },
      { status: 400 },
    );

  try {
    const { id, SumdanAgentFronting, User, Dapem, ...saved } = data;
    await prisma.$transaction(async (tx) => {
      const agent = await tx.agentFronting.update({
        where: { id: id },
        data: saved,
      });
      await tx.sumdanAgentFronting.deleteMany({
        where: { agentFrontingId: data.id },
      });
      await tx.sumdanAgentFronting.createMany({
        data: SumdanAgentFronting.map((s: SumdanAgentFronting) => ({
          sumdanId: s.sumdanId,
          agentFrontingId: agent.id,
        })),
      });
      return true;
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
  const id = req.nextUrl.searchParams.get("id") || "1";
  if (!id)
    return NextResponse.json(
      { msg: "ID tidak ditemukan!", status: 404 },
      { status: 404 },
    );
  try {
    await prisma.agentFronting.delete({
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

export async function generateId() {
  const prefix = `AGENT`;
  const padLength = 2;
  const lastRecord = await prisma.agentFronting.count({});
  return `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;
}
