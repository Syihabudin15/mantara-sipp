import {
  GetDapem,
  GetDetailDapem,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { ListNonStyle, NumberToWordsID } from "../../utils";
moment.locale("id");

export const PPPerdana = (record: IDapem) => {
  const detail = GetDetailDapem(record);
  const angsuran = detail.angsuran;
  const angsuranSumdan = detail.detail.angsuran_sumdan;
  const admAngsuran = angsuran - angsuranSumdan;
  const city = (record.city || record.Debitur.city)
    ?.toLocaleLowerCase()
    .replace("kabupaten", "")
    .replace("kota", "")
    .toUpperCase();
  const date_contract = moment(record.date_contract);

  return `

  <div>
    <p>${city}, ${date_contract.format("DD-MM-YYYY")}</p>
    <p>${record.no_contract || "________________________"}</p>
  </div>

  <div class="my-4 font-bold">
    <p>Kepada Yth,</p>
    <p>Bapak/Ibu</p>
  </div>
  <div class="mt-2 flex gap-8">
    <p>Perihal</p>
    <p>:</p>
    <p class="font-bold">Persetujuan Pemberian Kredit</p>
  </div>

  <div class="mb-8 mt-4">
    <p class="mb-2">Menunjuk Surat Saudara/Saudari tanggal ${moment(record.date_contract).format("DD-MM-YYYY")} perihal permohonan kredit, dengan ini kami beritahukan :</p>

    <div class="flex gap-2">
      <p class="w-4">1.</p>
      <p class="w-80">Plafond Kredit</p>
      <p class="w-4">:</p>
      <div class="flex gap-8 ">
        <p class="w-10">Rp.</p>
        <p class="w-28 text-right">${IDRFormat(record.plafond)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">2.</p>
      <p class="w-80">Jangka Waktu</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10"></p>
        <p class="w-28 text-right">${record.tenor} Bulan</p>
      </div>
    </div>
    <div class="flex gap-2 mb-5">
      <p class="w-4">3.</p>
      <p class="w-80">Suku Bunga</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10"></p>
        <p class="w-28 text-right">${record.c_margin + record.c_margin_sumdan}% Efektif p.a</p>
      </div>
    </div>

    <div class="flex gap-2">
      <p class="w-4">4.</p>
      <p class="w-80">Provisi Kredit</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(detail.detail.adm_sumdan + detail.detail.provisi_sumdan)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">5.</p>
      <p class="w-80">Biaya Administrasi Kredit</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(detail.administrasi)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">6.</p>
      <p class="w-80">Asuransi Jiwa</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(detail.asuransi)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">7.</p>
      <p class="w-80">Materai</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(record.c_stamp)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">8.</p>
      <p class="w-80">Total Biaya</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(detail.detail.adm_sumdan + detail.detail.provisi_sumdan + detail.administrasi + detail.asuransi + record.c_stamp + detail.angsuran * record.c_blokir)}</p>
      </div>
    </div>
    <div class="flex gap-2 mt-5">
      <p class="w-4">9.</p>
      <p class="w-80">Angsuran Per bulan</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(angsuranSumdan)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">10.</p>
      <p class="w-80">Biaya Administrasi Angsuran</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(admAngsuran)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">11.</p>
      <p class="w-80">Total Angsuran Perbulan</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(detail.angsuran)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">12.</p>
      <p class="w-80">Angsuran dibayar dimuka</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(detail.angsuran * record.c_blokir)}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">13.</p>
      <p class="w-80">Total Penerimaan</p>
      <p class="w-4">:</p>
      <div class="flex gap-8">
      <p class="w-10">Rp. </p>
        <p class="w-28 text-right">${IDRFormat(record.plafond - (detail.detail.adm_sumdan + detail.detail.provisi_sumdan + detail.administrasi + detail.asuransi + record.c_stamp + detail.angsuran * record.c_blokir))}</p>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">14.</p>
      <p class="w-80">Cara Pembayaran</p>
      <p class="w-4">:</p>
      <div class="flex-1">Manfaat pensiun Saudara/i setiap bulan dipotong sebesar Rp. ${IDRFormat(detail.angsuran)} ( ${NumberToWordsID(detail.angsuran)} Rupiah )</div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">15.</p>
      <p class="w-80">Jaminan</p>
      <p class="w-4">:</p>
      <div class="flex-1">
        <div class="flex gap-2">
          <p class="w-4">a.</p>
          <p>Menyerahkan Asli Surat Pernyataan Kuasa Potong Gaji dari Debitur atas nama ${record.Debitur.fullname}</p>
        </div>
        <div class="flex gap-2">
          <p class="w-4">b.</p>
          <p>Menyerahkan Asli Surat Keputusan (SK) Pensiunan Nomor ${record.Debitur.no_skep} Tertanggal ${moment(record.Debitur.date_skep).format("DD-MM-YYYY")}</p>
        </div>
        <div class="flex gap-2">
          <p class="w-4">c.</p>
          <p>Menyerahkan Asli Surat Pernyataan Kesehatan atau Bukti Kepersertaan Asuransi Jiwa Kredit atas nama ${record.Debitur.fullname}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <p class="w-4">16.</p>
      <p class="w-80">Pelunasan dipercepat</p>
      <p class="w-4">:</p>
      <div class="flex-1">Untuk jangka waktu > 1 tahun dikenakan denda pelunasan 1% (dikecualikan untuk Top Up tidak dikenakan denda) Untuk jangka waktu < 1 tahun tidak diperkenankan dilakukan pelunasan dipercepat</div>
    </div>
  </div>

  <p>Demikian, dan apabila Saudara setuju dengan ketentuan diatas, maka sebagai bukti persetujuan, saudara diminta untuk menandatangani surat ini diatas material Rp. 10.000,- dan selanjutnya mengembalikan kepada kami.</p>

  <div class="my-5 flex justify-around gap-10 items-end text-center">
    <div class="w-80">
      <p>${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>PT. BPR DAYA PERDANA NUSANTARA</p>
      <div class="h-28"></div>
      <p class="w-full border-b font-bold"></p>
    </div>
    <div class="w-80">
      <p>${record.Debitur.city?.toLocaleLowerCase().replace("kota", "").replace("kabupaten", "").toUpperCase()}, ${moment(record.date_contract).format("DD-MM-YYYY")}</p>
      <p>Debitur,</p>
      <div class="h-28"></div>
      <p class="w-full border-b font-bold">${record.Debitur.fullname}</p>
    </div>
  </div>

`;
};
