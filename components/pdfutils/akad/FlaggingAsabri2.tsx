import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { ListNonStyle, ListStyle } from "../utils";
// import { GetDetailDapem } from "@/components/utils/PembiayaanUtil";
moment.locale("id");

export const FLaggingAsabri2 = (record: IDapem) => {
  // const angsuran = GetDetailDapem(record).angsuran;

  return `
  
  <div class="flex justify-between gap-8 items-center -mt-10" >
    <div class="flex-1">
      <img src="${record.PayOffice.logo}" alt="${record.PayOffice.name + ` Logo`}" class="h-16 mr-4"/>
    </div>
  </div>

  <p class="font-bold text-lg text-center mt-2">SURAT PERNYATAAN DEBITUR</p>
  
  <div class="my-2">
    <p>Yang bertandatangan di bawah ini  :</p>
  ${ListStyle(
    [
      `${ListNonStyle([{ key: "Nama PNS / Pensiunan", value: record.Debitur.fullname, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([{ key: "Nomor Induk Kependudukan", value: record.Debitur.nik, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([{ key: "TUK/NRP/NIP/NPP/NOTAS", value: record.Debitur.nopen, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([{ key: "Tempat & Tanggal Lahir", value: `${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}`, valuStyle: "border-b border-dashed border-gray-700" }])}`,
      `${ListNonStyle([
        {
          key: "Alamat Lengkap",
          value: record.Debitur.address,
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "Kelurahan",
          value: record.Debitur.ward,
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "Kecamatan",
          value: record.Debitur.district,
          valuStyle: "border-b border-dashed border-gray-700",
        },
        {
          key: "Kabupaten/Kodya",
          value: `
        <div class="flex gap-2">
          <div class="w-56 border-b border-dashed border-gray-700">${record.Debitur.city}</div>
          <div class="flex-1 flex gap-2">
            <div class="w-28">Kode Pos</div>
            <div class="w-2">:</div>
            <div class="flex-1 border-b border-dashed border-gray-700">${record.Debitur.pos_code || ""}</div>
          </div>
        </div>
        `,
        },
        {
          key: "Provinsi",
          value: `
        <div class="flex gap-2">
          <div class="w-56 border-b border-dashed border-gray-700">${record.Debitur.province || ""}</div>
          <div class="flex-1 flex gap-2">
            <div class="w-28">No. Handphone</div>
            <div class="w-2">:</div>
            <div class="flex-1 border-b border-dashed border-gray-700">${record.Debitur.phone || ""}</div>
          </div>
        </div>
        `,
        },
      ])}
      
      `,
    ],
    "lower",
  )}
  </div>

  <div class="my-2">
    <p>Sehubungan dengan saya mengajukan fasilitas Kredit ...................................... pada Bank Mandiri Taspen , Kantor Cabang ............................. dengan perjanjian Kredit nomor ${record.no_contract || ".........................................................."} maka dengan ini Saya menyatakan:</p>
    ${ListStyle(
      [
        `Memberi kuasa kepada Bank Mandiri Taspen Kantor Cabang ............................. untuk dapat melakukan pengecekan Manfaat THT dan Pensiun saya pada PT. ASABRI (Persero) selama saya menjadi Nasabah pada Bank Mandiri Taspen`,
        `Dalam hal pengajuan fasilitas Kredit saya diterima, maka pembayaran manfaat:
        <div class="flex gap-8">
          <div class="flex gap-2 items-center">
            <div class="w-5 h-5 border border-gray-700"></div>
            Tabungan Hari Tua (THT)
          </div>
          <div class="flex gap-2 items-center">
            <div class="w-5 h-5 border border-gray-700"></div>
            Pensiun
          </div>
        </div>
        yang saya terima dari PT ASABRI (Persero), agar dibayarkan melalui rekening saya Nomor .................................................. atas Nama ................................................................. pada BANK MANDIRI TASPEN,  Kantor Cabang ........................................................... <span class="font-bold">sampai dengan Pembiayaan saya lunas/pada saat saya memasuki masa pensiun</span> (*) yaitu Tanggal ............ Bulan ............ Tahun ............ sampai dengan Tanggal ............ Bulan ............ Tahun ............
        `,
      ],
      "number",
    )}
    <p class="mt-2">Demikian surat pernyataan dan kuasa ini saya buat, untuk dipergunakan sebagaimana mestinya.</p>

  <div class="my-2 flex  p-2">
    <div class="flex-1 ">
      <p class="font-bold">Catatan :</p>
      ${ListStyle(
        [
          `Lembar 1 untuk PT ASABRI (Persero)`,
          `Lembar 2 untuk Bank Mandiri Taspen`,
          `Lembar 3 untuk Debitur`,
          `Lembar 4 untuk arsip `,
        ],
        "number",
      )}
    </div>
    <div class="flex-1 px-10">
      <p>Yang menyatakan</p>
      <div class="h-28 flex text-center flex-col items-center justify-center text-xs opacity-70">
        <p>Materai</p>
        <p>(Sesuai Ketentuan)</p>
      </div>
      <div class="border-b border-dashed text-center border-gray-700 font-bold flex justify-between">
        <p>(</p>
        <p class="flex-1 text-center">${record.Debitur.fullname}</p>
        <p>)</p>
      </div>
      <p class="text-center">Nama Terang & Tanda Tangan</p>
    </div>
  </div>

  <div class="text-xs">
    <p class="font-bold">Catatan : </p>
    <ul class="list-item list-none list-inside">
      <li>Lembar 1 untuk ${record.Debitur.group_skep} (PERSERO)</li>
      <li>Lembar 2 untuk ${record.PayOffice.name}</li>
      <li>Lembar 3 untuk Debitur</li>
      <li>Lembar 4 untuk Arsip </li>
    </ul>
    <p>(*) coret yang tidak perlu (sesuai jenis Flagging</p>
  </div>

`;
};
