import {
  GetAngsuran,
  GetDapem,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListNonStyle, NumberToWordsID } from "../utils";
moment.locale("id");

export const BPK = (record: IDapem) => {
  const angsuran = GetAngsuran(
    record.plafond,
    record.tenor,
    record.c_margin + record.c_margin_sumdan,
    record.margin_type,
    record.rounded,
    record.c_ned,
  ).angsuran;
  const angsSumdan = GetAngsuran(
    record.plafond,
    record.tenor,
    record.c_margin_sumdan,
    record.margin_type,
    record.rounded_sumdan,
  ).angsuran;
  const admAngsuran = Math.ceil(angsuran - angsSumdan);
  const dapem = GetDapem(record);
  const ao = record.AO || record.AOCabang || record.AOArea;

  return `
  ${Header("BUKTI PENCAIRAN KREDIT (BPK)", record.no_contract, undefined, record.ProdukPembiayaan.Sumdan.logo, undefined)}
  
  <div class="my-4">
  ${ListNonStyle([
    {
      key: "Nama Lengkap",
      value: record.Debitur.fullname,
    },
    {
      key: "Nomor Pensiun",
      value: record.nopen,
    },
    {
      key: "Kantor Bayar",
      value: record.PayOffice.name,
    },
    {
      key: "Instansi",
      value: record.Debitur.group_skep,
    },
    {
      key: "Kantor Pelayanan",
      value: `${ao?.Cabang.name} - ${ao?.Cabang.Area.name}`,
    },
  ])}
  </div>

  <div class="my-8">
    <p class="mb-2">Menyatakan telah menerima dana atas Fasilitas Kredit dari ${record.ProdukPembiayaan.Sumdan.name} dengan rincian sebagai berikut :</p>
    ${ListNonStyle([
      {
        key: "Plafond Kredit",
        value: IDRFormat(record.plafond),
        currency: true,
      },
      {
        key: "Jangka Waktu",
        value: `${record.tenor} Bulan`,
      },
      {
        key: "Suku Bunga",
        value: `${record.c_margin + record.c_margin_sumdan}% Efektif p.a`,
      },
      {
        key: "Biaya Administrasi",
        value: IDRFormat(
          record.plafond *
            ((record.c_adm_sumdan +
              record.c_adm +
              record.c_adm_mitra +
              record.c_adm_ff) /
              100),
        ),
        currency: true,
      },
      {
        key: "Biaya Provisi",
        value: IDRFormat(
          record.plafond *
            ((record.c_provisi_sumdan +
              record.c_fee_ao +
              record.c_fee_cabang +
              record.c_fee_area +
              record.c_fee_bpp +
              record.c_fee_bpb) /
              100),
        ),
        currency: true,
      },
      {
        key: "Biaya Tatalaksana",
        value: IDRFormat(
          record.c_gov +
            record.c_flagging +
            record.c_infomation +
            record.c_stamp +
            record.c_mutasi +
            record.c_bop,
        ),
        currency: true,
      },
      {
        key: "Biaya Asuransi",
        value: IDRFormat(record.plafond * (record.c_insurance / 100)),
        currency: true,
      },
      {
        key: "Biaya Buka Rekening",
        value: IDRFormat(record.c_account + record.c_account_sumdan),
        currency: true,
      },
      {
        key: `Total Potongan`,
        value: IDRFormat(
          record.plafond - (dapem.biaya + record.c_blokir * angsuran),
        ),
        currency: true,
        classStyle: "border-t font-bold",
      },
    ])}
    <div class="mt-4"></div>
    ${ListNonStyle([
      {
        key: "Biaya Pelunasan",
        value: IDRFormat(record.c_takeover),
        currency: true,
      },
      {
        key: `Angsuran Dimuka (${record.c_blokir}x)`,
        value: IDRFormat(record.c_blokir * angsuran),
        currency: true,
      },
      {
        key: `Penerimaan Bersih`,
        value: IDRFormat(dapem.tb),
        currency: true,
        classStyle: "border-t font-bold",
      },
      {
        key: ``,
        value: `(${NumberToWordsID(dapem.tb)} Rupiah )`,
        classStyle: "font-bold",
      },
    ])}
    <div class="mt-4"></div>
    ${ListNonStyle([
      {
        key: "Jatuh Tempo",
        value: moment(record.date_contract || record.created_at)
          .add(record.tenor, "month")
          .format("DD-MM-YYYY"),
      },
      {
        key: `Angsuran`,
        value: IDRFormat(angsSumdan),
        currency: true,
      },
      {
        key: `Biaya Adm Angsuran`,
        value: IDRFormat(admAngsuran),
        currency: true,
      },
      {
        key: `Total Angsuran`,
        value: IDRFormat(angsuran),
        currency: true,
        classStyle: "border-t font-bold",
      },
      {
        key: ``,
        value: `(${NumberToWordsID(angsuran)} Rupiah)`,
        classStyle: " font-bold",
      },
    ])}
    <div class="mt-4"></div>
    ${ListNonStyle([
      {
        key: "Jaminan",
        value: `Nomor SKEP : ${record.Debitur.no_skep}, Tanggal SKEP : ${moment(record.Debitur.date_skep).format("DD-MM/YYYY")}, A.n : ${record.Debitur.name_skep}`,
        classStyle: "font-bold",
      },
    ])}
  </div>

  <div class="my-5 flex justify-around gap-10 items-end text-center">
    <div class="flex-1"></div>
    <div class="flex-1">
      <p>${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>Diterima Oleh</p>
      <div class="h-28"></div>
      <p class="border-b">${record.Debitur.fullname}</p>
      <p>DEBITUR</p>
    </div>
  </div>
  <div class="my-5 flex justify-around gap-10 items-end text-center">
    <div class="flex-1">
      <p>Diproses oleh</p>
      <div class="h-28"></div>
      <p class="border-b font-bold">${ao?.fullname}</p>
      <p>${ao?.position}</p>
    </div>
    <div class="flex-1">
      <p>Diperiksa oleh</p>
      <div class="h-28"></div>
      <p class="border-b font-bold">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
      <p>${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
    </div>
    <div class="flex-1">
      <p>Diotorisasi oleh</p>
      <div class="h-28"></div>
      <p class="border-b font-bold">${process.env.NEXT_PUBLIC_APP_OPS_NAME || ""}</p>
      <p>${process.env.NEXT_PUBLIC_APP_OPS_NAME || ""}</p>
    </div>
  </div>

`;
};
