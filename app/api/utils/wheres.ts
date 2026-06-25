import { Cabang, Prisma, Role, User } from "@prisma/client";

interface UserWhere extends User {
  Cabang: Cabang;
  Role: Role;
}

export const WheresDapem = (user: UserWhere) => {
  const where: Prisma.DapemWhereInput = {
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
      aoId: user.id,
      aoCabangId: user.id,
      aoAreaId: user.id,
      userId: user.id,
    }),
    ...(user.sumdanId && { ProdukPembiayaan: { sumdanId: user.sumdanId } }),
    ...(user.agentFrontingId && { agentFrontingId: user.agentFrontingId }),
  };
  return where;
};

export const ORDapem = (search: string) => {
  const where: Prisma.DapemWhereInput = {
    OR: [
      { id: { contains: search } },
      { no_contract: { contains: search } },
      { Dropping: { id: { contains: search } } },
      {
        Debitur: {
          OR: [
            { fullname: { contains: search } },
            { nopen: { contains: search } },
            { no_skep: { contains: search } },
            { name_skep: { contains: search } },
            { account_number: { contains: search } },
          ],
        },
      },
    ],
  };
  return where;
};
