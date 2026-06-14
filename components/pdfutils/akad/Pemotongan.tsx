import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListStyle } from "../utils";

export const Pemotongan = (record: IDapem) => {
  return `
  ${Header("SURAT PERNYATAAN DEBITUR", `PEMOTONGAN GAJI DIATAS 70%`, undefined, undefined, undefined)}
  
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

  <p class="mt-6">Sehubungan dengan saya memerlukan dana yang cukup besar, maka dengan ini saya menyatakan bahwa :</p>

  <div class="ml-1">
  ${ListStyle(
    [
      `<div>
        <p>Bersedia membayar angsuran pembiayaan kepada ${process.env.NEXT_PUBLIC_APP_FULLNAME} dengan jumlah diata 70% dari gaji pensiun yang saya terima setiap bulan. Pengambilan keputusan ini didasari karena beberapa hal antara lain :</p>
        <div>
          ${ListStyle(
            [
              "Saya memiliki penghasilan tetap dari usaha diluar gaji pensiun;",
              "Saya mendapat tunjangan dari keluarga (anak-anak) setiap bulan yang jumlahnya dapat menutupi kekurangan jika sisa gaji pensiun tidak mencukupi untuk kebutuhan sehari-hari.",
            ],
            "lower-alpha",
          )}
        </div>
      </div>`,
      `Saya bertanggung jawab atas pengambilan sisa gaji saya setiap bulannya di Kantor Bayar Gaji yang ditunjuk oleh ${process.env.NEXT_PUBLIC_APP_FULLNAME}.`,
    ],
    "number",
  )}
  </div>
  <p class="mt-2">
    Demikian surat pernyataan ini saya buat atas kesadaran penuh tanpa paksaan pihak manapun.
  </p>

  <div class="flex gap-10 justify-around mt-5 items-end text-center">
    <div class="flex-1">
      <p>${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <div class="h-28"></div>
      <p class="border-b">${record.Debitur.fullname}</p>
      <p>DEBITUR</p>
    </div>
    <div class="flex-1">
      <div class="h-28"></div>
      <p class="border-t">SPV Kantor Layanan</p>
    </div>
  </div>

`;
};
