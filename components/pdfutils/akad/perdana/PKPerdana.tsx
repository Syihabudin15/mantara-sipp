import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import { NumberToWordsID } from "../../utils";
import moment from "moment";
moment.locale("id");

export const PKPerdana = (record: IDapem) => {
  const detail = GetDetailDapem(record);
  const angsuran = detail.angsuran;
  const angsuranSumdan = detail.detail.angsuran_sumdan;
  const admAngsuran = angsuran - angsuranSumdan;
  const date_contract = moment(record.date_contract);

  return `
  <div class="border-b border-gray-700 pb-2">
    <img src="/images/perdana-logo.png" alt="Perdana Logo" width="150" />
  </div>

  <div class="text-center py-2 border-b border-gray-700 mb-4">
    <p class="font-bold">PERJANJIAN KREDIT</p>
    <p>antara</p>
    <p class="font-bold">PT BANK PEREKONOMIAN RAKYAT DAYA PERDANA NUSANTARA</p>
    <p>antara</p>
    <p class="font-bold">${record.Debitur.fullname}</p>
    <p>Nomor: ${record.no_contract || "________________________"}</p>
  </div>
  
  <p>Perjanjian Kredit ini (Selanjutnya disebut <span class="font-bold">"Perjanjian Kredit"</span>) di buat pada hari <span class="font-bold">${date_contract.format("dddd")}</span>, tanggal <span class="font-bold">${date_contract.format("DD MMMM YYYY")}</span>, antara :</p>
  <div class="my-2 ml-2 flex gap-2">
    <div class="w-5">I.</div>
    <div class="flex-1">
      <div class="flex gap-2">
        <p class="w-52">Nama</p>
        <p class="w-4">:</p>
        <p class="flex-1">H ARIEF FIRMANSYAH</p>
      </div>
      <div class="flex gap-2">
        <p class="w-52">Jabatan</p>
        <p class="w-4">:</p>
        <p class="flex-1">Ketua Koperasi</p>
      </div>
      <p>Dalam hal ini bertindak untuk dan atas nama Pemberi Kuasa PT Bank Perekonomian Rakyat Daya Perdana Nusantara, berdasarkan surat kuasa yang diberikan oleh Direktur PT Bank Perekonomian Rakyat Daya Perdana Nusantara kepada Koperasi *** Nomor <span class="font-bold">${record.ProdukPembiayaan.Sumdan.sk_no || "________________"}</span>.</p>
      <p>Untuk selanjutnya disebut <span class="font-bold">BANK</span>.</p>
    </div>
  </div>
  <div class="my-2 ml-2 flex gap-2">
    <div class="w-5">II.</div>
    <div class="flex-1">
      <div class="flex gap-2">
        <p class="w-52">Nama</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.fullname}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-52">Tempat dan Tanggal Lahir</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-52">Alamat Sesuai KTP</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward}, KECAMATAN ${record.Debitur.district}, ${record.Debitur.city}, ${record.Debitur.province} ${record.Debitur.pos_code || ""}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-52">Alamat Sesuai Domisili</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.address || record.Debitur.address}, KELURAHAN ${record.ward || record.Debitur.ward}, KECAMATAN ${record.district || record.Debitur.district}, ${record.city || record.Debitur.city}, ${record.province || record.Debitur.province} ${record.pos_code || record.Debitur.pos_code || ""}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-52">Nomor Telepon</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.phone}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-52">NIK</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.nik}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-52">Nama dan Nomor Telepon Keluarga yang dapat dihubungi</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.aw_name || record.f_name} / ${record.aw_phone || record.f_phone}</p>
      </div>
      <p>Untuk selanjutnya disebut <span class="font-bold">DEBITUR</span>.</p>
    </div>
  </div>

  <p><span class="font-bold">BANK</span> dan <span class="font-bold">DEBITUR</span> selanjutnya secara bersama-sama disebut <span class="font-bold">PARA PIHAK</span> dan secara sendiri-sendiri disebut <span class="font-bold">PIHAK</span>.</p>

  <div class="my-4">
    <p>PARA PIHAK menerangkan terlebih dahulu sebagai berikut :</p>
    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">BANK merupakan pengelola dana pinjaman bagi DEBITUR.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <div class="flex-1">
        <p>Bahwa guna keperluan usahanya, DEBITUR yang telah mengajukan permohonan pinjaman atau kredit yakni sebagaimana:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="">Surat Permohonan atau Pengajuan Pinjaman secara tertulis yang diajukan DEBITUR kepada BANK Nomor ${record.id.replace("P", "")} tertanggal ${moment(record.created_at).format("DD-MM-YYYY")}.</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="">Surat Persetujuan Permohonan Kredit secara tertulis dari BANK Nomor ......................................... tertanggal ........................ dengan ketentuan pokok yang telah disetujui DEBITUR.</p>
        </div>
      </div>
    </div>
    <p>Dengan ini PARA PIHAK telah sepakat untuk mengadakan dan menandatangani Perjanjian ini berdasarkan ketentuan dan syarat-syarat sebagai berikut:</p>
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 1</p>
      <p>JENIS DAN DEFINISI PINJAMAN</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">“Kredit Purnabhakti” adalah fasilitas kredit yang diberikan oleh BANK kepada DEBITUR yang berstatus sebagai penerima manfaat pensiun (pensiunan), baik pensiun pegawai negeri, TNI/Polri yang sah, dengan sumber pembayaran angsuran berasal dari penghasilan pensiun DEBITUR.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p class="">“Manfaat Pensiun” adalah hak pembayaran pensiun bulanan yang diterima DEBITUR melalui instansi pembayar pensiun.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p class="">“Pinjaman” adalah sejumlah dana yang diberikan oleh BANK kepada DEBITUR berdasarkan Perjanjian Kredit ini, yang wajib dikembalikan oleh DEBITUR kepada BANK sesuai dengan jangka waktu, suku bunga, biaya-biaya, dan ketentuan lain sebagaimana diatur dalam Perjanjian Kredit ini dan/atau dokumen pendukungnya.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">4.</p>
      <p class="">“Tujuan Pinjaman” adalah untuk keperluan konsumtif DEBITUR yang bersifat sah dan tidak bertentangan dengan peraturan perundang-undangan yang berlaku, termasuk namun tidak terbatas pada kebutuhan pribadi, keluarga, kesehatan, perbaikan tempat tinggal, atau keperluan lain yang dinyatakan dan disetujui oleh BANK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">5.</p>
      <p class="">“Jangka Waktu Kredit” adalah periode waktu terhitung sejak tanggal pencairan Pinjaman sampai dengan tanggal berakhirnya kewajiban pembayaran Pinjaman oleh DEBITUR sebagaimana ditetapkan dalam Perjanjian Kredit ini.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">6.</p>
      <p class="">“Suku Bunga Kredit” adalah tingkat bunga yang dikenakan BANK atas Pinjaman yang diberikan kepada DEBITUR, yang besaran dan cara perhitungannya ditetapkan dalam Perjanjian Kredit ini dan/atau perubahannya.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">7.</p>
      <p class="">“Angsuran” adalah kewajiban pembayaran secara berkala oleh DEBITUR kepada BANK yang terdiri dari pokok Pinjaman, bunga, dan/atau kewajiban lain sesuai dengan Perjanjian Kredit ini.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">8.</p>
      <p class="">“Instansi Pembayar Pensiun” adalah PT Taspen (Persero) dan/atau PT Asabri (Persero).</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">9.</p>
      <p class="">“Surat Keterangan Pensiun” dan/atau “SK Pensiun” adalah dokumen resmi yang diterbitkan oleh Instansi Pembayar Pensiun yang menerangkan status hak pensiun, termasuk namun tidak terbatas pada pensiun pegawai, pensiun janda/duda, dan/atau pensiun anak yatim piatu, yang menjadi dasar agunan dan sumber pembayaran kewajiban DEBITUR berdasarkan Perjanjian ini.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">10.</p>
      <p class="">“Sumber Pembayaran Angsuran” adalah manfaat pensiun yang diterima DEBITUR secara berkala dari instansi/lembaga pengelola dana pensiun, yang berdasarkan persetujuan DEBITUR dapat dijadikan dasar pemotongan atau pembayaran angsuran kepada BANK sesuai ketentuan yang berlaku.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">11.</p>
      <p class="">“Cidera Janji” adalah setiap keadaan sebagaimana diatur dalam Pasal 10 Perjanjian ini.</p>
    </div>
    
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 2</p>
      <p>FASILITAS DAN RINCIAN PINJAMAN</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">Atas permohonan DEBITUR, BANK setuju untuk memberikan fasilitas kredit kepada DEBITUR dengan ketentuan sebagai berikut:</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">a.</p>
      <p class="w-96">Jenis Fasilitas</p>
      <p class="w-4">:</p>
      <p class="w-full">Kredit Multi Guna</p>
    </div>
    
    <div class="flex gap-2 ml-9">
      <p class="w-4">b.</p>
      <p class="w-96">Bentuk Fasilitas</p>
      <p class="w-4">:</p>
      <p class="w-full">Installment</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">c.</p>
      <p class="w-96">Pokok Pinjaman</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(record.plafond)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">d.</p>
      <p class="w-96">Jangka Waktu</p>
      <p class="w-4">:</p>
      <p class="w-full">${record.tenor} Bulan</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">e.</p>
      <p class="w-96">Suku Bunga</p>
      <p class="w-4">:</p>
      <p class="w-full">${record.c_margin + record.c_margin_sumdan} Efektif p.a</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">f.</p>
      <p class="w-96">Biaya Provisi</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(detail.detail.adm_sumdan + detail.detail.provisi_sumdan)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">g.</p>
      <p class="w-96">Biaya Administrasi Kredit</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(detail.administrasi)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">h.</p>
      <p class="w-96">Biaya Asuransi Jiwa Kredit</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(detail.asuransi)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">i.</p>
      <p class="w-96">Biaya Tatalaksana</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(detail.tatalaksana + detail.provisi + record.c_account_sumdan)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">j.</p>
      <p class="w-96">Angsuran Dibayar Dimuka</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(detail.angsuran * record.c_blokir)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">k.</p>
      <p class="w-96">Total Penerimaan</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(detail.tb)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">l.</p>
      <p class="w-96">Angsuran Perbulan</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(angsuranSumdan)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">m.</p>
      <p class="w-96">Biaya Administrasi Angsuran</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(admAngsuran)}</p>
    </div>
    <div class="flex gap-2 ml-9">
      <p class="w-4">n.</p>
      <p class="w-96">Kewajiban Perbulan</p>
      <p class="w-4">:</p>
      <p class="w-full">Rp. ${IDRFormat(detail.angsuran)}</p>
    </div>    
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p class="">Kredit digunakan untuk keperluan konsumtif dan tidak bertentangan dengan peraturan perundang-undangan.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p class="">Dalam hal terjadi perubahan suku bunga yang menambah biaya DEBITUR sebagaimana dimaksud pada Pasal 1 ayat (1) huruf d, maka perubahan tersebut akan disampaikan secara tertulis oleh BANK kepada DEBITUR.</p>
    </div>
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 3</p>
      <p>PENCAIRAN KREDIT</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">Pencairan fasilitas kredit oleh BANK kepada DEBITUR hanya dapat dilakukan setelah DEBITUR memenuhi seluruh persyaratan administratif, hukum, dan persyaratan lain sebagaimana ditetapkan oleh BANK sesuai dengan ketentuan peraturan perundang-undangan yang berlaku serta kebijakan internal BANK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p class="">BANK berhak untuk menunda dan/atau membatalkan pencairan fasilitas kredit, baik sebagian maupun seluruhnya, apabila berdasarkan hasil verifikasi dan/atau penilaian BANK ditemukan adanya ketidaksesuaian data, ketidaklengkapan dokumen, atau kondisi lain yang menurut pertimbanagan BANK dapat menimbulkan risiko hukum, risiko kredit, dan/atau risiko operasional.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p class="">Penundaan dan/atau pembatalan pencairan fasilitas kredit sebagaimana dimaksud pada ayat (2) tidak dapat dianggap sebagai cidera janji (wanprestasi) oleh BANK dan tidak menimbulkan kewajiban apapun bagi BANK untuk memberikan ganti rugi kepada DEBITUR.</p>
    </div>
    
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 4</p>
      <p>JANGKA WAKTU KREDIT</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">Perjanjian ini berlaku selama ${record.tenor} bulan terhitung sejak penandatanganan Perjanjian ini hingga berakhir selunas-lunasnya pada tanggal ${moment(record.date_contract).add(record.tenor, "month").format("DD-MM-YYYY")}.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p class="">DEBITUR dengan ini menyatakan sanggup membayar secara bulanan angsuran sebesar Rp ${IDRFormat(detail.angsuran)} (${NumberToWordsID(detail.angsuran)}) rupiah) sesuai jadwal angsuran yang telah disepakati PARA PIHAK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p class="">Apabila pembayaran kewajiban yang harus dilakukan DEBITUR kepada BANK jatuh tempo bukan pada hari kerja, maka pembayaran harus dilakukan 1(satu) hari kerja sebelumnya.</p>
    </div>
    
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 5</p>
      <p>BUNGA, BIAYA, DAN DENDA</p>
    </div>
    
    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">DEBITUR wajib membayar bunga atas fasilitas kredit yang diterimanya sesuai dengan tingkat bunga, metode perhitungan, dan ketentuan sebagaimana diatur dalam Pasal 2 Perjanjian ini.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p class="">Dalam hal DEBITUR terlambat atau lalai memenuhi kewajiban pembayaran angsuran pokok dan/atau bunga, BANK berhak mengenakan denda keterlambatan sebesar 0,5% (nol koma lima persen) kali jumlah tunggakan kali hari lamanya menunggak.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p class="">Seluruh biaya yang timbul sehubungan dengan pelaksanaan Perjanjian ini, termasuk namun tidak terbatas pada biaya administrasi, biaya provisi, biaya asuransi jiwa kredit, serta biaya lain yang berkaitan dengan pelaksanaan dari Perjanjian ini sepenuhnya menjadi tanggung jawab DEBITUR.</p>
    </div>

  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 6</p>
      <p>MEKANISME PEMBAYARAN</p>
    </div>
    
    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">Pembayaran angsuran atas fasilitas kredit dilakukan melalui pemotongan langsung atas manfaat pensiun yang diterima oleh DEBITUR melalui Instansi Pembayar Pensiun, sesuai dengan ketentuan kerja sama dan/atau pengaturan yang berlaku.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p class="">Dengan ditandatanganinya Perjanjian ini, DEBITUR dengan ini memberikan kuasa kepada BANK yang tidak dapat dicabut kembali (irrevocable power of attorney) selama seluruh kewajiban DEBITUR berdasarkan Perjanjian ini belum dilunasi sepenuhnya, untuk melakukan pendebetan rekening DEBITUR dan/atau penagihan atas manfaat pensiun guna pembayaran angsuran pokok, bunga, denda, dan/atau kewajiban lainnya kepada BANK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p class="">Dalam hal karena sebab apapun pemotongan manfaat pensiun sebagaimana dimaksud pada ayat (1) tidak terlaksana atau tidak mencukupi, maka DEBITUR wajib melakukan pembayaran secara langsung kepada BANK sesuai jadwal pembayaran yang telah ditetapkan, tanpa memerlukan pemberitahuan, penagihan, atau peringatan terlebih dahulu dari BANK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">4.</p>
      <p class="">Kegagalan DEBITUR untuk melakukan pembayaran langsung sebagaimana dimaksud pada ayat (3) merupakan cidera janji (wanprestasi) dan memberikan hak kepada BANK untuk mengambil tindakan sesuai dengan ketentuan Perjanjian ini dan peraturan perundang-undangan yang berlaku.</p>
    </div>

  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 7</p>
      <p>PELUNASAN DIPERCEPAT</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">DEBITUR berhak melakukan pelunasan dipercepat atas seluruh atau sebagian sisa kewajiban kredit sebelum berakhirnya jangka waktu Perjanjian, dengan persetujuan tertulis terlebih dahulu dari BANK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <div class="flex-1">
        <p>Pelunasan dipercepat hanya dapat dilakukan setelah DEBITUR:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="">menyampaikan permohonan tertulis kepada BANK; dan</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="">memperoleh persetujuan tertulis dari BANK yang diberikan berdasarkan pertimbangan dan kebijakan BANK.</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <div class="flex-1">
        <p>Dalam hal pelunasan dipercepat disetujui oleh BANK, DEBITUR wajib melunasi:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="">seluruh sisa pokok pinjaman;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="">bunga berjalan sampai dengan tanggal pelunasan;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">c.</p>
          <p class="">denda keterlambatan (jika ada);</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">d.</p>
          <p class="">biaya penalti pelunasan dipercepat sebesar 1% dari sisa baki debet.</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">e.</p>
          <p class="">biaya-biaya lain yang timbul sehubungan dengan pelunasan dipercepat tersebut.</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">4.</p>
      <p class="">Pelunasan dipercepat tidak menghapus kewajiban DEBITUR untuk memenuhi seluruh ketentuan lain dalam Perjanjian ini yang telah timbul sebelum tanggal pelunasan efektif.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">5.</p>
      <p class="">Pelunasan dipercepat dinyatakan efektif dan sah setelah seluruh kewajiban DEBITUR sebagaimana dimaksud dalam ayat (3) Pasal ini telah diterima secara efektif oleh BANK.</p>
    </div>

  </div>
  
  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 8</p>
      <p>AGUNAN</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">Sebagai jaminan atas pemenuhan seluruh kewajiban DEBITUR berdasarkan Perjanjian ini, DEBITUR menyerahkan kepada BANK Surat Keterangan Pensiun (SK Pensiun) milik DEBITUR berikut hak manfaat pensiun yang melekat padanya, sepanjang diperkenankan oleh ketentuan peraturan perundang-undangan yang berlaku.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <div class="flex-1">
        <p>SK Pensiun sebagaimana dimaksud pada ayat (1) diidentifikasi dan dirinci sebagai berikut:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="w-42">Nomor SK Pensiun</p>
          <p class="w-4">:</p>
          <p class="">${record.Debitur.no_skep}</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="w-42">Tanggal Terbit SK Pensiun</p>
          <p class="w-4">:</p>
          <p class="">${moment(record.Debitur.date_skep).format("DD-MM-YYYY")}</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">c.</p>
          <p class="w-42">Nama Pensiunan</p>
          <p class="w-4">:</p>
          <p class="">${record.Debitur.name_skep}</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">d.</p>
          <p class="w-42">Instansi Penerbit</p>
          <p class="w-4">:</p>
          <p class="">${record.Debitur.publisher_skep}</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p class="">DEBITUR menyatakan dan menjamin bahwa SK Pensiun sebagaimana dirinci pada ayat (2) adalah sah, masih berlaku, dan benar milik DEBITUR, serta hak manfaat pensiun yang melekat padanya tidak sedang dijaminkan, dialihkan, dibebani, atau disengketakan dengan pihak lain dalam bentuk apapun.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">4.</p>
      <p class="">Penyerahan SK Pensiun dan hak manfaat pensiun sebagaimana dimaksud dalam Pasal ini dilakukan sebagai jaminan pelunasan kewajiban pembayaran, dan tidak merupakan pengalihan hak kepemilikan atas manfaat pensiun tersebut kepada BANK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">5.</p>
      <p class="">Ketentuan mengenai agunan sebagaimana dimaksud dalam Pasal ini merupakan bagian yang tidak terpisahkan dan mempunyai kekuatan hukum yang sama dengan ketentuan lainnya dalam Perjanjian ini.</p>
    </div>
    
  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 9</p>
      <p>PERNYATAAN DAN JAMINAN DEBITUR</p>
    </div>

    <p>DEBITUR dengan ini menyatakan dan menjamin kepada BANK bahwa :</p>
    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p class="">DEBITUR adalah subjek hukum yang cakap dan berwenang secara hukum untuk menandatangani dan melaksanakan Perjanjian ini serta seluruh kewajiban yang timbul daripadanya.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p class="">Seluruh data, keterangan, dan dokumen yang disampaikan oleh DEBITUR kepada BANK sehubungan dengan pengajuan dan pelaksanaan fasilitas kredit adalah benar, lengkap, sah, dan tidak menyesatkan, serta sesuai dengan keadaan yang sebenarnya.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p class="">Hak manfaat pensiun yang melekat pada DEBITUR, termasuk namun tidak terbatas pada Surat Keterangan Pensiun (SK Pensiun), tidak sedang dan/atau tidak pernah menjadi objek sengketa, sita, blokir, jaminan, atau pembebanan dalam bentuk apapun kepada pihak lain.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">4.</p>
      <p class="">DEBITUR tidak berada dalam keadaan pailit, tidak sedang mengajukan atau diajukan permohonan Penundaan Kewajiban Pembayaran Utang (PKPU), serta tidak berada dalam keadaan lain yang menurut hukum dapat menghambat atau mempengaruhi pelaksanaan kewajiban DEBITUR berdasarkan Perjanjian ini.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">5.</p>
      <p class="">Pernyataan dan jaminan sebagaimana dimaksud dalam Pasal ini tetap berlaku dan dianggap diulang pada setiap saat selama Perjanjian ini masih berlaku, sampai dengan seluruh kewajiban DEBITUR kepada BANK dinyatakan lunas sepenuhnya.</p>
    </div>

  </div>

  <div class="my-7">
    <div class="my-3 text-center font-bold">
      <p>PASAL 10</p>
      <p>KEWAJIBAN DAN LARANGAN DEBITUR</p>
    </div>
    
    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <div class="flex-1">
        <p>DEBITUR wajib untuk:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="">membayar seluruh kewajiban pembayaran angsuran pokok, bunga, denda, dan/atau kewajiban lainnya kepada BANK secara tepat waktu sesuai dengan ketentuan Perjanjian ini;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="">menjaga dan memastikan keabsahan status pensiun serta keberlakuan hak manfaat pensiun selama Perjanjian ini masih berlaku;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">c.</p>
          <p class="">memberitahukan secara tertulis kepada BANK setiap perubahan data, termasuk namun tidak terbatas pada perubahan alamat, status kependudukan, status pensiun, dan/atau data lain yang relevan; dan</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">d.</p>
          <p class="">memberikan akses informasi kepada BANK, termasuk akses kepada data dan/atau dokumen yang diperlukan, sepanjang diminta secara wajar dan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <div class="flex-1">
        <p>Selama Perjanjian ini masih berlaku dan seluruh kewajiban DEBITUR kepada BANK belum dilunasi sepenuhnya, DEBITUR dilarang untuk:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="">mengalihkan, menyerahkan, atau melepaskan hak manfaat pensiun kepada pihak mana pun;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="">menjaminkan, membebani, atau menjadikan objek jaminan hak manfaat pensiun kepada pihak lain dalam bentuk apa pun; dan</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">c.</p>
          <p class="">mengubah instansi pembayar pensiun, mekanisme pembayaran manfaat pensiun, dan/atau rekening penerimaan manfaat pensiun tanpa persetujuan tertulis terlebih dahulu dari BANK.</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p>Pelanggaran terhadap ketentuan dalam Pasal ini merupakan cidera janji (wanprestasi) dan memberikan hak kepada BANK untuk mengambil tindakan sesuai dengan ketentuan Perjanjian ini dan peraturan perundang-undangan yang berlaku.</p>
    </div>

  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 11</p>
      <p>PERISTIWA CIDERA JANJI</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <div class="flex-1">
        <p>Cidera Janji (Wanprestasi) dinyatakan terjadi apabila DEBITUR melakukan atau mengalami salah satu atau lebih peristiwa sebagai berikut:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="">DEBITUR lalai atau menunggak dalam memenuhi kewajiban pembayaran angsuran pokok dan/atau bunga sesuai dengan jadwal pembayaran yang ditetapkan dalam Perjanjian ini;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="">manfaat pensiun yang menjadi dasar mekanisme pembayaran angsuran terhenti, ditangguhkan, berkurang secara signifikan, atau tidak dapat dipotong karena sebab apapun yang mengakibatkan tidak terpenuhinya kewajiban pembayaran kepada BANK;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">c.</p>
          <p class="">DEBITUR meninggal dunia, kecuali ditentukan lain berdasarkan ketentuan pelunasan melalui ahli waris dan/atau program asuransi jiwa kredit sebagaimana diatur dalam Perjanjian ini atau perjanjian terkait lainnya;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">d.</p>
          <p class="">pernyataan dan/atau jaminan DEBITUR sebagaimana diatur dalam Perjanjian ini ternyata tidak benar, tidak lengkap, atau menyesatkan, baik sebagian maupun seluruhnya.</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p>Terjadinya salah satu Peristiwa Cidera Janji sebagaimana dimaksud pada ayat (1) memberikan hak kepada BANK, tanpa memerlukan persetujuan atau pemberitahuan terlebih dahulu kepada DEBITUR, untuk melakukan tindakan-tindakan yang dianggap perlu sesuai dengan ketentuan Perjanjian ini dan peraturan perundang-undangan yang berlaku.</p>
    </div>
    
  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 12</p>
      <p>AKIBAT HUKUM CIDERA JANJI</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <div class="flex-1">
        <p>Dalam hal terjadi Cidera Janji (Wanprestasi) sebagaimana dimaksud dalam Pasal 10 Perjanjian ini, maka BANK, tanpa mengurangi hak-hak lainnya berdasarkan Perjanjian ini dan/atau peraturan perundang-undangan yang berlaku, berhak untuk:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="">menyatakan seluruh sisa kewajiban DEBITUR seketika dan sekaligus jatuh tempo serta dapat ditagih (acceleration clause), tanpa memerlukan persetujuan atau pemberitahuan terlebih dahulu kepada DEBITUR;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="">mengakhiri Perjanjian ini secara sepihak, dengan pemberitahuan tertulis kepada DEBITUR;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">c.</p>
          <p class="">melakukan penagihan, termasuk namun tidak terbatas pada pendebetan rekening, penagihan manfaat pensiun, dan/atau upaya penagihan lainnya sesuai dengan ketentuan Perjanjian ini;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">d.</p>
          <p class="">menunjuk dan/atau menggunakan jasa pihak ketiga untuk melakukan penagihan dan/atau tindakan lain yang diperlukan, sepanjang dilakukan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p>Pelaksanaan hak-hak BANK sebagaimana dimaksud pada ayat (1) dapat dilakukan tanpa memerlukan persetujuan terlebih dahulu dari DEBITUR dan tanpa memerlukan putusan pengadilan, sepanjang hal tersebut diperbolehkan oleh hukum dan tidak bertentangan dengan ketentuan peraturan perundang-undangan yang berlaku.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p>Seluruh biaya yang timbul sehubungan dengan pelaksanaan tindakan BANK akibat terjadinya Cidera Janji, termasuk biaya penagihan dan biaya pihak ketiga, menjadi tanggung jawab DEBITUR dan dapat dibebankan kepada DEBITUR sesuai dengan ketentuan Perjanjian ini.</p>
    </div>

  </div>


  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 13</p>
      <p>BERAKHIRNYA PERJANJIAN</p>
    </div>

    
    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p>Perjanjian ini berakhir secara otomatis setelah seluruh kewajiban DEBITUR kepada BANK, baik berupa pokok, bunga, denda, biaya, dan/atau kewajiban lainnya, telah dilunasi sepenuhnya dan dinyatakan selesai oleh BANK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p>BANK berhak untuk mengakhiri Perjanjian ini secara sepihak sebelum jangka waktu Perjanjian berakhir, dengan pemberitahuan tertulis kepada DEBITUR, dalam hal terjadi Cidera Janji dan/atau berdasarkan pertimbangan BANK sesuai dengan ketentuan Perjanjian ini dan peraturan perundang-undangan yang berlaku.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p>Pengakhiran Perjanjian sebagaimana dimaksud pada ayat (2) tidak menghapuskan kewajiban DEBITUR yang telah timbul sebelum tanggal pengakhiran, dan seluruh kewajiban tersebut tetap wajib dipenuhi oleh DEBITUR.</p>
    </div>

  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 14</p>
      <p>KUASA-KUASA</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <div class="flex-1">
        <p>Dengan ditandatanganinya Perjanjian ini, DEBITUR dengan ini memberikan kuasa kepada BANK yang tidak dapat dicabut kembali (irrevocable power of attorney) selama seluruh kewajiban DEBITUR berdasarkan Perjanjian ini belum dilunasi sepenuhnya, untuk dan atas nama DEBITUR melakukan tindakan-tindakan sebagai berikut:</p>
        <div class="flex gap-2 ml-3">
          <p class="w-4">a.</p>
          <p class="">melakukan pendebetan rekening DEBITUR yang terdapat pada BANK dan/atau bank lain yang ditunjuk, guna pembayaran angsuran pokok, bunga, denda, biaya, dan/atau kewajiban lainnya kepada BANK;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">b.</p>
          <p class="">melakukan penagihan dan/atau pemotongan manfaat pensiun yang menjadi hak DEBITUR melalui instansi pembayar pensiun sesuai dengan ketentuan yang berlaku;</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-4">c.</p>
          <p class="">melakukan pengurusan administrasi yang berkaitan dengan pelaksanaan fasilitas kredit ini, termasuk namun tidak terbatas pada korespondensi, permintaan data, dan tindakan administratif lain yang diperlukan.</p>
        </div>
      </div>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p>Kuasa sebagaimana dimaksud pada ayat (1) diberikan sebagai bagian yang tidak terpisahkan dari Perjanjian ini, dan tidak berakhir karena sebab apapun, termasuk namun tidak terbatas pada berakhirnya jangka waktu Perjanjian, kecuali setelah seluruh kewajiban DEBITUR kepada BANK dinyatakan lunas sepenuhnya.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p>Pelaksanaan kuasa oleh BANK sebagaimana dimaksud dalam Pasal ini dilakukan sepanjang diperbolehkan oleh hukum dan sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.</p>
    </div>

  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 15</p>
      <p>KEADAAN KAHAR (FORCE MAJEURE)</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p>Yang dimaksud dengan Force Majeure adalah setiap peristiwa di luar kemampuan dan kendali Para Pihak yang secara langsung menghalangi pelaksanaan sebagian atau seluruh kewajiban berdasarkan Perjanjian ini, termasuk namun tidak terbatas pada bencana alam, perang, huru-hara, kebakaran, wabah penyakit, kebijakan pemerintah, dan/atau keadaan lain yang sejenis.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p>Force Majeure tidak termasuk ketidakmampuan keuangan DEBITUR, kesulitan ekonomi, perubahan kondisi keuangan pribadi, atau alasan lain yang bersifat subjektif dari DEBITUR.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p>Pihak yang mengalami Force Majeure wajib memberitahukan secara tertulis kepada pihak lainnya dalam jangka waktu yang wajar sejak terjadinya Force Majeure, dengan melampirkan bukti pendukung yang relevan.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">4.</p>
      <p>Selama masa Force Majeure, kewajiban Para Pihak dapat ditangguhkan sejauh terhalang oleh Force Majeure tersebut, tanpa menghapus kewajiban pembayaran DEBITUR yang telah jatuh tempo sebelum terjadinya Force Majeure, kecuali ditentukan lain secara tertulis oleh BANK.</p>
    </div>

  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 16</p>
      <p>KERAHASIAAN DAN DATA</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p>DEBITUR dengan ini menyetujui dan memberikan persetujuan kepada BANK untuk mengumpulkan, menggunakan, mengungkapkan, dan/atau memproses data pribadi DEBITUR yang diperoleh sehubungan dengan Perjanjian ini sepanjang diperlukan untuk kepentingan analisis kredit, pelaksanaan Perjanjian, penagihan, audit, pelaporan kepada regulator, serta pemenuhan kewajiban BANK berdasarkan peraturan perundang-undangan yang berlaku.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p>BANK wajib menjaga kerahasiaan data DEBITUR sesuai dengan ketentuan peraturan perundang-undangan yang berlaku dan hanya mengungkapkan data tersebut kepada pihak yang berwenang dan/atau pihak lain yang diperbolehkan oleh hukum.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p>Persetujuan sebagaimana dimaksud dalam Pasal ini tetap berlaku selama Perjanjian ini masih berjalan dan setelah Perjanjian berakhir, sepanjang diwajibkan oleh ketentuan peraturan perundang-undangan yang berlaku.</p>
    </div>

  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 17</p>
      <p>PENYELESAIAN SENGKETA DAN DOMISILI</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p>Untuk segala akibat hukum yang timbul dari Perjanjian ini, Para Pihak dengan ini memilih domisili hukum yang tetap dan umum di Pengadilan Negeri yang meliputi wilayah hukum tempat kedudukan BANK.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p>Ketentuan pemilihan domisili hukum sebagaimana dimaksud pada ayat (1) tidak mengurangi hak BANK untuk mengajukan gugatan, permohonan, dan/atau upaya hukum lainnya pada pengadilan atau forum hukum lain yang berwenang sesuai dengan ketentuan peraturan perundang-undangan yang berlaku.</p>
    </div>

  </div>

  <div class="my-8">
    <div class="my-3 text-center font-bold">
      <p>PASAL 18</p>
      <p>KETENTUAN LAIN-LAIN</p>
    </div>

    <div class="flex gap-2 ml-3">
      <p class="w-4">1.</p>
      <p>Para Pihak dengan ini sepakat untuk mengesampingkan ketentuan Pasal 1266 dan Pasal 1267 Kitab Undang-Undang Hukum Perdata, sepanjang dipersyaratkan adanya putusan pengadilan untuk pengakhiran Perjanjian ini.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">2.</p>
      <p>Setiap perubahan, penambahan, dan/atau pengakhiran terhadap Perjanjian ini hanya sah dan mengikat apabila dibuat secara tertulis dan ditandatangani oleh Para Pihak atau pihak yang sah mewakilinya.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">3.</p>
      <p>Apabila terdapat satu atau lebih ketentuan dalam Perjanjian ini yang menjadi tidak sah, batal, atau tidak dapat dilaksanakan berdasarkan putusan pengadilan atau ketentuan peraturan perundang-undangan, maka ketentuan lainnya tetap sah, berlaku, dan mengikat Para Pihak.</p>
    </div>
    <div class="flex gap-2 ml-3">
      <p class="w-4">4.</p>
      <p>DEBITUR dengan ini menyatakan dan mengakui bahwa DEBITUR telah membaca, memahami, dan mengetahui seluruh isi Perjanjian ini, termasuk namun tidak terbatas pada hak dan kewajiban yang timbul daripadanya, serta menandatangani Perjanjian ini tanpa adanya paksaan, tekanan, atau pengaruh dari pihak manapun.</p>
    </div>
    <p>Perjanjian ini dibuat rangkap dua, bermaterai cukup, dan mempunyai kekuatan hukum yang sama.</p>

  </div>


  <div class="mt-10">
    <div class="flex justify-between gap-6 items-end">
      <div class="flex-1 text-center">
        <p class="font-bold">PT BANK PEREKONOMIAN RAKYAT</p>
        <p class="font-bold">DAYA PERDANA NUSANTARA</p>
        <div class="h-28 flex items-center justify-center opacity-50">
        </div>
        <div>
          <p class="w-full border-b">H ARIEF FIRMANSYAH</p>
        </div>
      </div>
      <div class="flex-1 text-center">
        <p class="font-bold">DEBITUR</p>
        <div class="h-28 flex items-center justify-center opacity-50">
          <p >Materai 10.000</p>
        </div>
        <div>
          <p class="w-full border-b">${record.Debitur.fullname}</p>
        </div>
      </div>
    </div>
  </div>
`;
};
