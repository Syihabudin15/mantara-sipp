import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/Prisma";
import { getSession, signIn, signOut } from "@/libs/Auth";
import { IPermission, IUser } from "@/libs/IInterfaces";

export const POST = async (req: NextRequest) => {
  const credential = await req.json();
  if (!credential || !credential.username || !credential.password) {
    return NextResponse.json(
      { msg: "Mohon lengkapi username & password!", status: 404 },
      { status: 404 },
    );
  }

  try {
    const find = await prisma.user.findUnique({
      where: { username: credential.username },
      select: {
        id: true,
        username: true,
        fullname: true,
        email: true,
        phone: true,
        target: true,
        status: true,
        created_at: true,
        updated_at: true,
        roleId: true,
        sumdanId: true,
        cabangId: true,
        agentFrontingId: true,
        pkwt_status: true,
        position: true,
        nip: true,
        nik: true,
        password: true,
        Sumdan: { select: { name: true } },
        Cabang: { select: { name: true, Area: { select: { name: true } } } },
        Role: true,
      },
    });
    if (!find) {
      return NextResponse.json(
        { msg: "Username atau password salah!", status: 401 },
        { status: 401 },
      );
    }
    const comparePass = await bcrypt.compare(
      credential.password,
      find.password,
    );
    if (!comparePass) {
      return NextResponse.json(
        { msg: "Username atau password salah!", status: 401 },
        { status: 401 },
      );
    }

    const {
      id,
      roleId,
      sumdanId,
      cabangId,
      agentFrontingId,
      username,
      fullname,
      email,
      phone,
      target,
      status,
      created_at,
      updated_at,
      position,
      nip,
      nik,
      Role,
      Sumdan,
      Cabang,
    } = find;
    await signIn({
      id,
      roleId,
      sumdanId,
      cabangId,
      agentFrontingId,
      username,
      fullname,
      email,
      phone,
      target,
      status,
      created_at,
      updated_at,
      position,
      nip,
      nik,
      Role,
      sumdan: Sumdan ? Sumdan.name : null,
      cabang: Cabang.name || "",
      area: Cabang.Area.name || "",
    } as IUser);
    const access = JSON.parse(Role.permission) as IPermission[];
    if (access.some((a) => a.path === "/dashboard")) {
      return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
    }
    return NextResponse.json({ msg: "OK", status: 201 }, { status: 201 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export const GET = async () => {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { msg: "Unauthorize", status: 401 },
      { status: 401 },
    );
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        fullname: true,
        email: true,
        phone: true,
        target: true,
        status: true,
        roleId: true,
        sumdanId: true,
        cabangId: true,
        agentFrontingId: true,
        pkwt_status: true,
        position: true,
        nip: true,
        nik: true,
        created_at: true,
        updated_at: true,
        Role: true,
        Cabang: { select: { name: true, Area: { select: { name: true } } } },
        Sumdan: { select: { name: true } },
      },
    });
    if (!user) {
      await signOut();
      return NextResponse.json(
        { msg: "Unauthorize", status: 401 },
        { status: 401 },
      );
    }
    const { Cabang, Sumdan, ...datauser } = user;
    return NextResponse.json(
      {
        data: {
          ...datauser,
          cabang: Cabang.name,
          area: Cabang.Area.name,
          sumdan: Sumdan?.name,
        },
        status: 200,
        msg: "OK",
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
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { msg: "Unauthorize", status: 401 },
        { status: 401 },
      );
    }
    await signOut();
    return NextResponse.json({ msg: "OK", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};
