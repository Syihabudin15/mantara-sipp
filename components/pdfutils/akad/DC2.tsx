import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header } from "../utils";
import { GetAngsuran, IDRFormat } from "@/components/utils/PembiayaanUtil";
moment.locale("id");

export const DocChecklist2 = (record: IDapem) => {
  const angsuran = GetAngsuran(
    record.plafond,
    record.tenor,
    record.c_margin + record.c_margin_sumdan,
    record.margin_type,
    record.rounded,
    record.c_ned,
  ).angsuran;

  const ao = record.AO || record.AOCabang || record.AOArea;

  return `
  ${Header("", "", undefined, record.ProdukPembiayaan.Sumdan.logo, undefined)}

  <div class="flex gap-8 item-center justify-between">
    <div class="flex-1 border my-4 w-96">
      <p class="border-b p-2 bg-slate-100 text-center">${ao?.Cabang.name} - ${record.ProdukPembiayaan.name}</p>
      <div class="flex border-b">
        <p class="border-r w-32 p-1">NAMA DEBITUR</p>
        <p class="p-1">${record.Debitur.fullname}</p>
      </div>
      <div class="flex border-b">
        <p class="border-r w-32 p-1">NO. SKEP</p>
        <p class="p-1">${record.Debitur.no_skep}</p>
      </div>
      <div class="flex border-b">
      <p class="border-r w-32 p-1">PEMBIAYAAN</p>
      <p class="p-1">Rp. ${IDRFormat(record.plafond)}</p>
      </div>
      <div class="flex border-b">
        <p class="border-r w-32 p-1">JANGKA WAKTU</p>
        <p class="p-1">${record.tenor} Bulan</p>
      </div>
      <div class="flex border-b">
        <p class="border-r w-32 p-1">ANGSURAN</p>
        <p class="p-1">Rp. ${IDRFormat(angsuran)}</p>
      </div>
      <div class="flex border-b">
        <p class="border-r w-32 p-1">JATUH TEMPO</p>
        <p class="p-1">${moment(record.date_contract).add(record.tenor, "month").format("DD-MM-YYYY")}</p>
      </div>
      <div class="flex border-b">
        <p class="border-r w-32 p-1">STATUS PEMBIAYAAN</p>
        <p class="p-1">${record.JenisPembiayaan.name}</p>
      </div>
      <div class="flex border-b">
        <p class="border-r w-32 p-1">NO. AKAD</p>
        <p class="p-1">${record.no_contract}</p>
      </div>
    </div>
    <div class="flex-1 font-bold text-center flex flex-col justify-center">
      <p class="text-lg">${process.env.NEXT_PUBLIC_APP_COMPANY_NAME}</p>
      <p>DOKUMEN CHECKLIST BERKAS JAMINAN</p>
      <p>(${record.ProdukPembiayaan.Sumdan.name})</p>
    </div>
  </div>

  <div class="mt-5">
    <table class="w-full border-collapse border border-slate-400 text-xs">
      <thead class="bg-slate-100 uppercase font-bold text-center">
        <tr>
          <th rowspan="2" class="border border-slate-400 p-2 w-8">NO</th>
          <th rowspan="2" class="border border-slate-400 p-2 w-80">SUSUNAN<br>ISI MAP BERKAS</th>
          <th rowspan="2" class="border border-slate-400 p-2 w-8">KETERANGAN</th>
          <th  class="border border-slate-400 p-1 text-[10px]">ADM KANTOR <br />LAYANAN</th>
          <th  class="border border-slate-400 p-1 text-[10px]">MITRA PUSAT</th>
          <th  class="border border-slate-400 p-1 text-[10px]">BPR</th>
        </tr>
      </thead>
      <tbody class="text-slate-700">
        ${listBerkas
          .map(
            (d, i) => `
          <tr>
          <td class="border border-slate-400 p-1 text-center font-semibold">${i + 1}</td>
          <td class="border border-slate-400 p-1">${d}</td>
          <td class="border border-slate-400 p-1 text-center">ASLI</td>
          <td class="border border-slate-400"></td>
          <td class="border border-slate-400"></td>
          <td class="border border-slate-400"></td>
        </tr>
          `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="flex gap-8 text-center mt-8 items-end">
    <div class="flex-2">
      <p>Telah diperiksa:Lengkap/ Tidak*</p>
      <p>Yang menyiapkan,</p>
      <div class="h-28"></div>
      <p class="border-b">${record.User.fullname}</p>
      <p>Admin Kantor Layanan</p>
    </div>
    <div class="flex-1">
      <p>Telah diperiksa ulang:Lengkap/ Tidak*</p> 
      <p>Yang menerima dan memeriksa</p> 
      <div class="flex gap-6">
        <div class="flex-1">
          <div class="h-28"></div>
          <p class="border-b"></p>
          <p>SPV/Manager Verifikasi</p>
        </div>
        <div class="flex-1">
          <div class="h-28"></div>
          <p class="border-b"></p>
          <p>SPV/Manager Verifikasi</p>
        </div>
      </div>
    </div>
  </div>
`;
};

const listBerkas = [
  "SK ASLI PENSIUN",
  "SURAT KUASA PEMOTONGAN GAJI",
  "SURAT KETERANGAN GAJI DARI PT. POS INDONESIA",
  "SURAT PERNYATAAN LAINNYA (JIKA DIPERLUKAN)",
  "AKAD PERJANJIAN KREDIT",
  "TANDA TERIMA PENYERAHAN JAMINAN (TTPJ)",
  "SURAT PERNYATAAN BERSEDIA DIPOTONG ANGSURAN",
];
