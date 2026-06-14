import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListStyle } from "../utils";

export const Flagging = (record: IDapem) => {
  return `
  ${Header("SURAT PERNYATAAN DEBITUR", `MITRA KERJA ${record.mutasi_to || record.mutasi_from}`, undefined, undefined, undefined)}
  
  <p>Yang bertanda tangan dibawah ini :</p>

  <div class="ml-4">
    <div class="flex gap-2">
      <p class="w-52">Nama Pensiunan</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.fullname}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Nomor NIK</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nik}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Tempat/Tanggal Lahir</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Pekerjaan</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.job}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">No Telepon</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.phone}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">NIP / NRP / NOPEN</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.nopen}</p>
    </div>
    <div class="flex gap-2">
      <p class="w-52">Alamat</p>
      <p class="w-4">:</p>
      <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward} KECAMATAN ${record.Debitur.district}, ${record.Debitur.city} ${record.Debitur.province} ${record.Debitur.pos_code}</p>
    </div>
  </div>

  <p class="mt-6">Sehubungan dengan saya telah mengambil fasilitas kredit pembiayaan pensiun pada ${process.env.NEXT_PUBLIC_APP_FULLNAME} mitra kerja dari ${record.mutasi_to || record.mutasi_from} dengan perjanjian kredit nomor ${record.no_contract}, maka dengan ini saya menyatakan bahwa :</p>

  <div class="ml-1">
  ${ListStyle(
    [
      `Pada saat penerimaan pembayaran Manfaat Tabungan Hari Tua (THT) dan/atau Pensiun saya setiap bulan dari PT. ${record.Debitur.group_skep} (PERSERO), agar dibayarkan melalui rekening saya nomor: ${record.Debitur.account_number || "....................................."} atasnama ${record.Debitur.fullname} pada ${record.mutasi_to || record.mutasi_from} sampai dengan kredit saya lunas;`,
      `Memberi kuasa kepada ${record.mutasi_to || record.mutasi_from} untuk melakukan pengecekan data kepesertaan saya dan sekaligus untuk mendaftarkan Flagging data saya pada PT. ${record.Debitur.group_skep} (PERSERO) selama jangka waktu kredit yang telah disetujui, yaitu dari tanggal ${moment(record.date_contract).format("DD-MM-YYYY")} (${moment(record.date_contract).format("DDDD MMMM YYYY")}) sampai dengan tanggal ${moment(record.date_contract).add(record.tenor, "month").format("DD-MM-YYYY")} (${moment(record.date_contract).add(record.tenor, "month").format("DDDD MMMM YYYY")}).`,
    ],
    "number",
  )}
  </div>
  <p class="mt-2">
    Demikian surat pernyataan dan kuasa ini saya buat atas kesadaran penuh tanpa paksaan pihak manapun.
  </p>

  <div class="flex gap-10 justify-around mt-5 items-center">
    <div class="flex-1 italic">
      <p>Catatan :</p>
      ${ListStyle(
        [
          `Lembar 1 untuk PT ${record.Debitur.group_skep} (PERSERO)`,
          `Lembar 2 untuk ${record.mutasi_to || record.mutasi_from}`,
          `Lembar 3 untuk Debitur`,
          `Lembar 4 untuk Arsip`,
        ],
        "number",
      )}
    </div>
    <div class="flex-1 text-center">
      <p>${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>Yang menyatakan,</p>
      <div class="h-28">
        <p class="mt-10">Materai</p>
      </div>
      <p class="border-b">${record.Debitur.fullname}</p>
    </div>
  </div>

`;
};
