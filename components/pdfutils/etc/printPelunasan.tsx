import moment from "moment";
import { IPelunasan } from "@/libs/IInterfaces";
import { Header, ListNonStyle } from "../utils";
import { IDRFormat } from "@/components/utils/PembiayaanUtil";

moment.locale("id");

const generatePelunasan = (records: IPelunasan) => {
  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }

        html, body {
          height: 100%;
          font-family: Cambria, Georgia, 'Times New Roman', Times, serif;
          font-size: 14px;
          text-align: justify;
        }

        /* Pemisah halaman */
        .page-break {
          page-break-before: always;
          break-before: page;
          display: block;
          height: 0;
          border: none;
        }
          @media print {
            .page {
              position: relative;
              min-height: 95vh;    /* atau height A4 jika untuk print */
              padding-top: 80px;    /* ruang untuk header */
              page-break-after: always;
            }
    
            .page .page-header {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              padding: 10px;
              text-align: center;
              background: white;
              border-bottom: 1px solid #ccc;
            }
          }
      </style>
    </head>
    <body class="bg-white text-gray-800 leading-relaxed p-4 max-w-200">

    <div class="page" style="font-size: 12px;">
      ${Header("PERMOHONAN PELUNASAN", `${records.Dapem.Debitur.fullname}`, undefined, process.env.NEXT_PUBLIC_APP_LOGO, records.Dapem.ProdukPembiayaan.Sumdan.logo)}
      ${ListNonStyle([
        { key: "No", value: `${records.id}/${records.dapemId}` },
        { key: "Lampiran", value: "-" },
        { key: "Perihal", value: `Permohonan Pelunasan ${records.type}` },
      ])}

      <div class="my-5">
        <p>Kepata Yth</p>
        <p class="font-bold">Direktur ${records.Dapem.ProdukPembiayaan.Sumdan.name}</p>
        <p>Di Tempat</p>
      </div>

      <p>Dengan hormat,</p>
      <p>Terimakasih kami ucapkan atas kerjasama yang telah terjalin selama ini antara ${process.env.NEXT_PUBLIC_APP_FULLNAME} dengan ${records.Dapem.ProdukPembiayaan.Sumdan.name}.</p>
      <p>Sehubungan dengan adanya fasilitas pembiayaan yang telah diberikan kepada debitur ${process.env.NEXT_PUBLIC_APP_FULLNAME}, bersama ini kami menyampaikan permohonan untuk melakukan pelunasan pembiayaan atas debitur dengan data sebagai berikut :</p>

      <div class="ml-5 my-3">
      ${ListNonStyle([
        { key: "Nama debitur", value: records.Dapem.Debitur.fullname },
        { key: "Nomor Pensiun", value: records.Dapem.Debitur.nopen },
        {
          key: "Perjanjian Kredit",
          value: `${records.Dapem.no_contract}, Tertanggal ${moment(records.Dapem.date_contract).format("DD-MM-YYYY")}`,
        },
        {
          key: "Tanggal Realisasi",
          value: moment(records.Dapem.Dropping?.process_at).format(
            "DD-MM-YYYY",
          ),
        },
        { key: "Tipe Pelunasan", value: records.type },
      ])}
      </div>

      <p>Sehubungan dengan hal tersebut, kami mohon kepada ${records.Dapem.ProdukPembiayaan.Sumdan.name} untuk dapat menyampaikan rincian perhitungan sisa kewajiban (pokok, bunga/margin berjalan, denda apabila ada, serta biaya administrasi lainnya) sampai dengan tanggal pelunasan yang ditentukan.</p>
      <p>Selanjutnya, setelah kami menerima rincian tersebut, pembayaran pelunasan akan kami lakukan sesuai dengan ketentuan yang berlaku.</p>
      <p>Demikian permohonan ini kami sampaikan. Atas perhatian dan kerja sama yang baik, kami ucapkan terima kasih.</p>

      <div class="mt-10 flex justify-end">
        <div class="w-52 text-center">
          <p>BANDUNG, ${moment(records.created_at).format("DD-MM-YYYY")}</p>
          <p>${process.env.NEXT_PUBLIC_APP_FULLNAME}</p>
          <div class="h-28"></div>
          <p class="border-b">${process.env.NEXT_PUBLIC_APP_AKAD_NAME}</p>
          <p>${process.env.NEXT_PUBLIC_APP_AKAD_POSITION}</p>
        </div>
      </div>

    </div>

    <div class="page" style="font-size: 12px;">
      ${Header("RINCIAN PELUNASAN", `${records.id}/${records.Dapem.no_contract}`, undefined, process.env.NEXT_PUBLIC_APP_LOGO, records.Dapem.ProdukPembiayaan.Sumdan.logo)}
      <div class="my-5 pb-2 border-b border-dashed">
        ${ListNonStyle([
          { key: "Nama Debitur", value: records.Dapem.Debitur.fullname },
          { key: "Nomor Pensiun", value: records.Dapem.Debitur.nopen },
          {
            key: "Nomor PK",
            value: `${records.Dapem.no_contract}, Tertanggal ${moment(records.Dapem.date_contract).format("DD-MM-YYYY")}`,
          },
          { key: "Nomor SKEP", value: records.Dapem.Debitur.no_skep },
          { key: "Plafond", value: IDRFormat(records.Dapem.plafond) },
          { key: "Jangka Waktu", value: `${records.Dapem.tenor} Bulan` },
        ])}
      </div>

      <div>
        <p class="font-bold my-1">Rincian Pelunasan </p>
        ${ListNonStyle([
          {
            key: "Tanggal Pelunasan",
            value: moment(records.created_at).format("DD-MM-YYYY"),
          },
          {
            key: "Tipe Pelunasan",
            value: records.type,
          },
          {
            key: "Keterangan",
            value: records.desc,
          },
          {
            key: "Angsuran Ke",
            value: `${
              records.Dapem.Angsuran.filter((d) => d.date_paid !== null).sort(
                (a, b) => b.counter - a.counter,
              )[0].counter
            } / ${records.Dapem.tenor} Bulan`,
          },
          {
            key: "Sisa Pokok",
            value: IDRFormat(records.amount),
          },
          {
            key: "Penalty",
            value: IDRFormat(records.penalty),
          },
          {
            key: "Nominal Pelunasan",
            value: IDRFormat(records.penalty + records.amount),
          },
        ])}
      </div>

      <div class="mt-10 flex justify-around items-end">
        <div class="w-60 text-center">
          <p>Diproses oleh</p>
          <p class="h-2"></p>
          <div class="h-28"></div>
          <p class="border-b">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
          <p >${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
        </div>
        <div class="w-60 text-center">
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_CITY}, ${moment(records.created_at).format("DD-MM-YYYY")}</p>
          <p>Menyetujui</p>
          <div class="h-28"></div>
          <p class="border-b">${records.Dapem.Debitur.fullname}</p>
          <p>DEBITUR</p>
        </div>
      </div>
    </div>

    </body>
  </html>
  `;

  return html;
};

export const printPelunasan = (record: IPelunasan) => {
  const htmlContent = generatePelunasan(record);

  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) {
    alert("Popup diblokir. Mohon izinkan popup dari situs ini.");
    return;
  }

  w.document.open();
  w.document.write(htmlContent);
  w.document.close();
  w.onload = function () {
    setTimeout(() => {
      w.print();
    }, 200);
  };
};
