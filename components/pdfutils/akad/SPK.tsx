import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListNonStyle, NumberToWordsID } from "../utils";
moment.locale("id");

export const SPK = (record: IDapem) => {
  const angsuran = GetDetailDapem(record).angsuran;

  return `
  ${Header("SURAT PERNYATAAN KESANGGUPAN (SPK)", record.no_contract, undefined, record.ProdukPembiayaan.Sumdan.logo, undefined)}
  
  <div class="my-4">
    <p>Yang bertanda tangan dibawah ini :</p>
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
      key: "Nomor Pensiun",
      value: record.nopen,
    },
    {
      key: "Alamat",
      value: `${record.Debitur.address}, ${record.Debitur.ward}, ${record.Debitur.district}, ${record.Debitur.city}, ${record.Debitur.province} ${record.Debitur.pos_code}`,
    },
  ])}
  </div>

  <div class="my-8">
    <p>Dengan ini menyatakan bahwa saya bersedia untuk mengikuti kebijakan ${record.PayOffice.name} (Persero) yaitu membayar biaya NED (DAPEM) ${record.Debitur.group_skep} (Persero) sebesar Rp. ${IDRFormat(record.c_ned)},- ( ${NumberToWordsID(record.c_ned)} Rupiah ) setiap bulannya selama masa pinjaman saya di ${process.env.NEXT_PUBLIC_APP_COMPANY_NAME} (${process.env.NEXT_PUBLIC_APP_SHORTNAME}) berakhir tanggal ${moment(
      record.date_contract || record.created_at,
    )
      .add(record.tenor, "month")
      .format(
        "DD-MM-YYYY",
      )}. Adapun cara pembayaran adalah dengan menambahkan pada angsuran setiap bulan saya di ${process.env.NEXT_PUBLIC_APP_COMPANY_NAME} (${process.env.NEXT_PUBLIC_APP_SHORTNAME}) yaitu <span class="font-bold">Rp. ${IDRFormat(angsuran)} ( ${NumberToWordsID(angsuran)} Rupiah )</span> setiap bulan yang sudah di tambah biaya NED tersebut.</p>

    <p class="mt-2">Demikian Surat Pernyataan Kesanggupan (SPK) ini dibuat dalam keadaan sadar dan tanpa paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana mestinya.</p>
  </div>

  <div class="my-5 flex justify-around gap-10 items-end text-center">
    <div class="flex-1"></div>
    <div class="flex-1">
      <p>${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>Diterima Oleh</p>
      <div class="h-28 flex text-xs flex-col items-center justify-center opacity-70">
        <p>Materai</p>
        <p>Rp. 10.000</p>
      </div>
      <p class="border-b font-bold">${record.Debitur.fullname}</p>
      <p>DEBITUR</p>
    </div>
  </div>

`;
};
