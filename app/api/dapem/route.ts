import { serializeForApi } from "@/components/utils/PembiayaanUtil";
import { getSession } from "@/libs/Auth";
import { IDapem } from "@/libs/IInterfaces";
import prisma from "@/libs/Prisma";
import {
  EDapemStatus,
  EDocStatus,
  ESubmissionStatus,
  Prisma,
} from "@prisma/client";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import {
  AOInclude,
  GetUserSession,
  ORDapem,
  WheresDapem,
} from "../utils/wheres";

export const GET = async (request: NextRequest) => {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const {
    page = "1",
    limit = "50",
    search,
    dropping_status,
    nominatif,
    slik_status,
    verif_status,
    approv_status,
    jenisPembiayaanId,
    produkPembiayaanId,
    sumdanId,
    document_status,
    guarantee_status,
    takeover_status,
    mutasi_status,
    cash_status,
    flagging_status,
    currmonth,
    backdate,
    agentFrontingId,
    payOfficeId,
    insuranceId,
    includes,
  } = params;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const session = await getSession();
  if (!session)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });
  const user = await GetUserSession(session);
  if (!user)
    return NextResponse.json({ data: [], status: 200 }, { status: 200 });

  const whereFunc = WheresDapem(user);
  const where: Prisma.DapemWhereInput = {
    ...(search && ORDapem(search)),
    ...(dropping_status
      ? dropping_status === "final"
        ? { dropping_status: { in: ["DISETUJUI", "PROSES", "LUNAS"] } }
        : {
            dropping_status: dropping_status as EDapemStatus,
          }
      : {}),
    ...(nominatif && { dropping_status: { in: ["DISETUJUI", "LUNAS"] } }),
    ...(cash_status && {
      cash_status: cash_status as EDapemStatus,
    }),
    ...(slik_status
      ? slik_status === "all"
        ? { slik_status: { not: null } }
        : { slik_status: slik_status as ESubmissionStatus }
      : {}),

    ...(verif_status
      ? verif_status === "all"
        ? { verif_status: { not: null } }
        : { verif_status: verif_status as ESubmissionStatus }
      : {}),

    ...(approv_status
      ? approv_status === "all"
        ? { approv_status: { not: null } }
        : { approv_status: approv_status as ESubmissionStatus }
      : {}),
    ...(jenisPembiayaanId && { jenisPembiayaanId: jenisPembiayaanId }),
    ...(sumdanId && { ProdukPembiayaan: { sumdanId: sumdanId } }),
    ...(produkPembiayaanId && {
      ProdukPembiayaan: { id: produkPembiayaanId },
    }),
    ...(document_status && {
      document_status: document_status as EDocStatus,
    }),
    ...(guarantee_status && {
      guarantee_status: guarantee_status as EDocStatus,
    }),
    ...(mutasi_status && { mutasi_status: mutasi_status as EDapemStatus }),
    ...(takeover_status && {
      takeover_status: takeover_status as EDapemStatus,
    }),
    ...(flagging_status && {
      flagging_status: flagging_status as EDapemStatus,
    }),
    ...(agentFrontingId && { agentFrontingId: agentFrontingId }),
    ...(payOfficeId && { payOfficeId: payOfficeId }),
    ...(insuranceId && { insuranceId: insuranceId }),
    ...(backdate
      ? {
          created_at: {
            gte: moment(backdate.split(",")[0]).toDate(),
            lte: moment(backdate.split(",")[1]).toDate(),
          },
        }
      : currmonth
        ? {
            created_at: {
              gte: moment().startOf("month").toDate(),
              lte: moment().endOf("month").toDate(),
            },
          }
        : {}),
    ...whereFunc,
    status: true,
  };

  const [data, total] = await Promise.all([
    // prisma.dapem.findMany({
    //   where,
    //   skip: skip,
    //   take: parseInt(limit),
    //   orderBy: {
    //     created_at: "desc",
    //   },
    //   select: {
    //     id: true,
    //     plafond: true,
    //     tenor: true,
    //     margin_type: true,
    //     c_margin: true,
    //     c_margin_sumdan: true,
    //     rounded: true,
    //     rounded_sumdan: true,
    //     verif_status: true,
    //     slik_status: true,
    //     approv_status: true,
    //     verif_desc: true,
    //     slik_desc: true,
    //     approv_desc: true,
    //     dropping_status: true,
    //     no_contract: true,
    //     date_contract: true,
    //     file_contract: true,
    //     prev_payoffice: true,
    //     created_at: true,
    //     updated_at: true,
    //     nopen: true,
    //     c_ned: true,
    //     takeover_from: true,
    //     ProdukPembiayaan: {
    //       select: {
    //         id: true,
    //         name: true,
    //         Sumdan: {
    //           select: {
    //             id: true,
    //             name: true,
    //             code: true,
    //           },
    //         },
    //       },
    //     },
    //     User: {
    //       select: { id: true, fullname: true, nip: true },
    //     },
    //     AO: {
    //       select: {
    //         id: true,
    //         fullname: true,
    //         Cabang: {
    //           select: {
    //             id: true,
    //             name: true,
    //             Area: { select: { id: true, name: true } },
    //           },
    //         },
    //       },
    //     },
    //     AOCabang: {
    //       select: {
    //         id: true,
    //         fullname: true,
    //         Cabang: {
    //           select: {
    //             id: true,
    //             name: true,
    //             Area: { select: { id: true, name: true } },
    //           },
    //         },
    //       },
    //     },
    //     AOArea: {
    //       select: {
    //         id: true,
    //         fullname: true,
    //         Cabang: {
    //           select: {
    //             id: true,
    //             name: true,
    //             Area: { select: { id: true, name: true } },
    //           },
    //         },
    //       },
    //     },
    //     PayOffice: { select: { id: true, name: true } },
    //     JenisPembiayaan: {
    //       select: {
    //         id: true,
    //         name: true,
    //         status_mutasi: true,
    //         status_takeover: true,
    //       },
    //     },
    //     AgentFronting: { select: { id: true, name: true, code: true } },
    //     Debitur: { select: { nopen: true, fullname: true } },
    //     Dropping: { select: { created_at: true, process_at: true } },
    //   },
    // }),
    prisma.dapem.findMany({
      where,
      skip: skip,
      take: parseInt(limit),
      orderBy: {
        created_at: "desc",
      },
      include: {
        // ...(includes && {
        Debitur: true,
        ProdukPembiayaan: {
          include: {
            Sumdan: {
              select: {
                name: true,
                code: true,
                dsr: true,
                logo: true,
                sk_date: true,
                sk_no: true,
                contract_date: true,
                contract_no: true,
                contract_no2: true,
                address: true,
              },
            },
          },
        },
        PayOffice: { select: { name: true, code: true, logo: true } },
        JenisPembiayaan: {
          select: { name: true, status_mutasi: true, status_takeover: true },
        },
        // Angsurans: true,
        ...(includes && {
          Angsurans: {
            select: { id: true },
            where: { date_paid: { not: null } },
          },
        }),
        User: AOInclude(),
        AO: AOInclude(),
        AOCabang: AOInclude(),
        AOArea: AOInclude(),
        Dropping: true,
        // }),
        AgentFronting: { select: { code: true, name: true, pic: true } },
      },
    }),
    prisma.dapem.count({ where }),
  ]);

  return NextResponse.json(
    {
      data,
      total,
      status: 200,
    },
    { status: 200 },
  );
};

export const POST = async (req: NextRequest) => {
  const data: IDapem = await req.json();
  const {
    id,
    Debitur,
    User,
    AO,
    AOCabang,
    AOArea,
    ProdukPembiayaan,
    JenisPembiayaan,
    Berkas,
    Jaminan,
    Angsurans,
    Dropping,
    Pelunasan,
    AgentFronting,
    PayOffice,
    Insurance,
    ...saved
  } = data;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.debitur.upsert({
        where: { nopen: Debitur.nopen },
        update: Debitur,
        create: Debitur,
      });
      const dapemId = await generateDapemId();
      await tx.dapem.create({ data: { ...saved, id: dapemId } });
      return true;
    });
    return NextResponse.json(
      { msg: "Data berhasil ditambahkan", status: 200 },
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
export const PUT = async (req: NextRequest) => {
  const data: IDapem = await req.json();
  const {
    id,
    Debitur,
    User,
    AO,
    AOCabang,
    AOArea,
    ProdukPembiayaan,
    JenisPembiayaan,
    Berkas,
    Jaminan,
    Angsurans,
    Dropping,
    Pelunasan,
    AgentFronting,
    PayOffice,
    Insurance,
    ...saved
  } = data;
  try {
    const prevDapem = await prisma.dapem.findUnique({ where: { id } });
    if (!prevDapem)
      return NextResponse.json(
        { msg: "Not Found", status: 404 },
        { status: 404 },
      );
    await prisma.$transaction(async (tx) => {
      if (prevDapem.nopen !== Debitur.nopen) {
        const findSameWithNewNopen = await tx.debitur.findUnique({
          where: { nopen: Debitur.nopen },
        });
        if (!findSameWithNewNopen) {
          await tx.debitur.update({
            where: { nopen: prevDapem.nopen },
            data: Debitur,
          });
        } else {
          await tx.debitur.update({
            where: { nopen: Debitur.nopen },
            data: Debitur,
          });
        }
      } else {
        await tx.debitur.upsert({
          where: { nopen: Debitur.nopen },
          update: Debitur,
          create: Debitur,
        });
      }
      await tx.dapem.update({ where: { id }, data: { ...saved } });
      return true;
    });
    return NextResponse.json(
      { msg: "Data berhasil ditambahkan", status: 200 },
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

export const PATCH = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { msg: "Not Found", status: 404 },
      { status: 404 },
    );

  const find = await prisma.dapem.findUnique({
    where: { id },
    include: {
      Debitur: true,
      ProdukPembiayaan: { include: { Sumdan: true } },
      JenisPembiayaan: true,
      User: {
        include: {
          Cabang: {
            include: {
              Area: true,
            },
          },
        },
      },
      AO: {
        include: {
          Cabang: {
            include: {
              Area: true,
            },
          },
        },
      },
      AOCabang: {
        include: {
          Cabang: {
            include: {
              Area: true,
            },
          },
        },
      },
      AOArea: {
        include: {
          Cabang: {
            include: {
              Area: true,
            },
          },
        },
      },
      Berkas: true,
      Jaminan: true,
      Angsurans: true,
      Dropping: true,
      Pelunasan: true,
      AgentFronting: true,
      PayOffice: true,
      Insurance: true,
    },
  });
  if (!find)
    return NextResponse.json(
      { msg: "Not Found", status: 404 },
      { status: 404 },
    );

  return NextResponse.json(
    { data: serializeForApi(find), status: 200 },
    { status: 200 },
  );
};

export const DELETE = async (req: NextRequest) => {
  const id = req.nextUrl.searchParams.get("id");
  if (!id)
    return NextResponse.json(
      { msg: "Not Found", status: 404 },
      { status: 404 },
    );
  try {
    await prisma.dapem.update({ where: { id }, data: { status: false } });
    return NextResponse.json({ msg: "Berhasil", status: 200 }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Internal Server Error", status: 500 },
      { status: 500 },
    );
  }
};

export async function generateDapemId() {
  const prefix = `P`;
  const padLength = 6;
  const lastRecord = await prisma.dapem.count({});
  return `${prefix}${String(lastRecord + 1).padStart(padLength, "0")}`;
}
