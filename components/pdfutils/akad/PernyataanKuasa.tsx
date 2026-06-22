import { IDRFormat } from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListNonStyle, ListStyle, NumberToWordsID } from "../utils";
moment.locale("id");

export const PernyataanKuasa = (record: IDapem) => {
  return `
  ${Header("SURAT PERNYATAAN DAN KUASA", record.no_contract, undefined, undefined, undefined)}
  
  <div class="my-4">
    <p>Saya yang bertanda tangan dibawah ini :</p>
  ${ListNonStyle([
    {
      key: "Nama Lengkap",
      value: record.Debitur.fullname,
    },
    {
      key: "Nomor KTP",
      value: record.Debitur.nik,
    },
    {
      key: "TUK/NRP/NIP/NOTAS",
      value: record.nopen,
    },
    {
      key: "Alamat",
      value: `${record.Debitur.address}, ${record.Debitur.ward}, ${record.Debitur.district}, ${record.Debitur.city}, ${record.Debitur.province} ${record.Debitur.pos_code}`,
    },
    {
      key: "Nomor Handphone",
      value: record.Debitur.phone,
    },
  ])}
  </div>

  <div class="my-8">
    <p>Dengan ini saya menyatakan hal-hal sebagai berikut :</p>
    ${ListStyle(
      [
        `Bahwa telah menerima fasilitas kredit pensiun dari <span class="font-bold">${record.ProdukPembiayaan.Sumdan.name}</span> (selanjutnya disebut “Pemberi Kredit”) <span class="font-bold">Rp. ${IDRFormat(record.plafond)},- ( ${NumberToWordsID(record.plafond)} Rupiah )</span> sebagaimana tersebut dalam Perjanjian Kredit No. <span class="font-bold">${record.no_contract}</span>`,
        `Bahwa untuk menjamin kelancaran pembayaran angsuran kredit saya menggunakan uang pensiun yang kantor bayarnya sudah dan /atau akan dilakukan melalui ${record.PayOffice.name} ${record.PayOffice.code ? `(${record.PayOffice.code})` : ""} sebagai jaminan kredit tersebut menunjuk pada butir 1 (satu) di atas.`,
        `Bahwa saya menjamin sisa uang pensiun saya saat ini dan seterusnya yang menerima sampai dengan kredit tersebut di atas lunas, benar benar cukup jumlahnya untuk dipotong berdasarkan angsuran yang ditetapkan oleh Pemberi Kredit.`,
        `Bahwa fasilitas kredit yang saya terima tersebut di atas, sepenuhnya saya pergunakan untuk kepentingan saya pribadi.`,
      ],
      "number",
    )}
    <p class="mt-2">Berdasarkan hal-hal tersebut di atas, dengan ini saya memberi kuasa dengan hak subsitusi kepada :</p>
    <div class="my-8 font-bold text-lg text-center">
      <p>${record.PayOffice.name} ${record.PayOffice.code ? `(${record.PayOffice.code})` : ""} selaku kantor bayar utang pensiun saya</p>
      <p>------------------------------------------------- KHUSUS -------------------------------------------------</p>
    </div>

    <p>Untuk dari atas nama Pemberi Kuasa melakukan tindakan-tindakan sebagai berikut :</p>
    ${ListStyle(
      [
        `Memotong uang pensiunan (manfaat pensiun) saya setiap bulan sampai dengan kredit saya lunas sejumlah angsuran yangditetapkan oleh Pemberi Kredit.`,
        `Menyetorkan hasil potongan uang pensiun tersebut ke rekening yang di tunjuk Pemberi Kredit untuk melakukan pembayaran angsuran kredit saya sebagaimana tersebut pada butir 1 (satu) diatas.`,
        `Melakukan tindakan-tindakan lainnya yang dianggap penting dan berguna untuk terlaksananya kuasa ini.`,
      ],
      "lower",
    )}

    <p clas="mt-2">Surat kuasa ini tidak dapat dicabut kembali oleh ketentuan Undang - Undang yang mengakhiri pemberian kuasa sebagaimana ditentukan dalam pasal 1813 Kitab Undang - Undang Hukum Perdata maupun oleh sebab-sebab apapun juga, dan kuasa ini berlaku sampai dengan kredit tersebut di atas dinyatakan lunas oleh Pemberi Kredit.</p>
    <p class="mt-2">Demikian Surat Pernyataan dan Kuasa ini dibuat dalam keadaan sadar dan tanpa paksaan dari pihak manapun, untuk dapat dipergunakan sebagaimana mestinya.</p>
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
