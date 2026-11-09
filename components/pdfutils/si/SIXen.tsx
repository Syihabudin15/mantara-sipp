import moment from "moment";
import { IDropping } from "@/libs/IInterfaces";
import { Header } from "../utils";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";

moment.locale("id");

const generateSI = (record: IDropping) => {
  const hasProvisi = record.Dapems.some((d) => d.c_provisi_sumdan !== 0);
  const isXen = record.Sumdan.code.toLowerCase().includes("xen");
  const details = record.Dapems.map((d) => ({
    ...d,
    d_detailDapem: GetDetailDapem(d),
    d_blokTab: isXen ? d.plafond * (1 / 100) : 0,
    d_provisi: d.plafond * (d.c_provisi_sumdan / 100),
    d_adm: d.plafond * (d.c_adm_sumdan / 100),
    dropping:
      d.plafond -
      (d.plafond * (d.c_adm_sumdan / 100) +
        d.plafond * (d.c_provisi_sumdan / 100) +
        d.c_account_sumdan +
        d.c_blokir * GetDetailDapem(d).detail.angsuran_sumdan +
        (isXen ? d.plafond * (1 / 100) : 0)),
  }));
  const drop = record.Dapems.reduce((acc, curr) => {
    const angsuran = GetDetailDapem(curr).detail.angsuran_sumdan;
    const blokir = curr.c_blokir * angsuran;
    const adm = curr.plafond * (curr.c_adm_sumdan / 100);
    const provisi = curr.plafond * (curr.c_provisi_sumdan / 100);
    const account = curr.c_account_sumdan;
    const bloktab = isXen ? curr.plafond * (1 / 100) : 0;
    const dropping =
      curr.plafond - (adm + provisi + account + blokir + bloktab);
    return acc + dropping;
  }, 0);
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
      ${Header("PERMOHONAN DROPPING DANA PENCAIRAN", record.id, undefined, process.env.NEXT_PUBLIC_APP_LOGO, record.Sumdan.logo)}

      <div class="my-4">
        <div class="flex gap-3">
          <p class="w-44">No</p>
          <p class="w-4">:</p>
          <p class="flex-1">${record.id}</p>
        </div>
        <div class="flex gap-3">
          <p class="w-44">Lampiran</p>
          <p class="w-4">:</p>
          <p class="flex-1">1 Lembar</p>
        </div>
        <div class="flex gap-3">
          <p class="w-44">Perihal</p>
          <p class="w-4">:</p>
          <p class="flex-1">Permohonan Dropping Dana Pencairan Pembiayaan Pensiun</p>
        </div>
      </div>

      <div class="mt-4">
        <p>Kepada Yth</p>
        <p class="font-bold">Direktur ${record.Sumdan.name}</p>
        <p>Di tempat</p>
      </div>
      <div class="mt-2">
        <p>Sehubungan dengan telah disetujuinya pembiayaan pensiun oleh Komite Bank, bersama ini kami menyampaikan permohonan kepada ${record.Sumdan.name} untuk melakukan dropping dana pencairan pembiayaan dengan rincian sebagai berikut :</p>
        
        <div class="mt-4 flex gap-2 ml-3">
          <p class="w-44">Jumlah Debitur</p>
          <p class="w-4">:</p>
          <p class="flex-1">${record.Dapems.length}</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-44">Jumlah Plafond</p>
          <p class="w-4">:</p>
          <p class="flex-1">Rp. ${IDRFormat(record.Dapems.reduce((acc, curr) => acc + curr.plafond, 0))}</p>
        </div>
        <div class="mb-4 flex gap-2 ml-3">
          <p class="w-44">Jumlah Dropping</p>
          <p class="w-4">:</p>
          <p class="flex-1">Rp. ${IDRFormat(drop)}</p>
        </div>

        <p>Sehubungan dengan hal tersebut, kami menginstruksikan kepada ${record.Sumdan.name} untuk melakukan pencairan (dropping) dana sebesar tersebut di atas ke rekening berikut :</p>

        <div class="mt-4 flex gap-2 ml-3">
          <p class="w-44">Nama Rekening</p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NAME}</p>
        </div>
        <div class="flex gap-2 ml-3">
          <p class="w-44">Nomor Rekening</p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NUMBER}</p>
        </div>
        <div class="mb-4 flex gap-2 ml-3">
          <p class="w-44">Bank</p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_BANK}</p>
        </div>

        <p>Instruksi ini dibuat berdasarkan persetujuan Komite Bank dan menjadi dasar pelaksanaan pencairan dana.</p>
        <p>Demikian Standing Instruction ini kami sampaikan untuk dapat diproses sebagaimana mestinya. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>
      </div>

      <div class="mt-20 flex justify-end">
        <div class="w-96 text-center">
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_CITY}, ${moment(record.created_at).format("DD-MM-YYYY")}</p>
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_NAME?.toUpperCase()}</p>
          <div class="h-28"></div>
          <p class="border-b">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
          <p>${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
        </div>
      </div>

    </div>

    <div class="page" style="font-size: 12px;">
      ${Header("LAMPIRAN PERMOHONAN DROPPING", record.id, undefined, process.env.NEXT_PUBLIC_APP_LOGO, record.Sumdan.logo)}


      <div class="mt-20">
        <table class="w-full border-collapse border border-gray-400 border-dashed text-sm mb-4">
          <thead>
            <tr class="bg-gray-200">
              <th class="border border-gray-400 border-dashed p-1">NO</th>
              <th class="border border-gray-400 border-dashed p-1">Debitur</th>
              <th class="border border-gray-400 border-dashed p-1">Plafond</th>
              <th class="border border-gray-400 border-dashed p-1">Adm Bank</th>
              ${hasProvisi ? `<th class="border border-gray-400 border-dashed p-1">Provisi Bank</th>` : ""}
              <th class="border border-gray-400 border-dashed p-1">Buka Tabungan</th>
              <th class="border border-gray-400 border-dashed p-1">Blokir Angsuran</th>
              ${isXen ? `<th class="border border-gray-400 border-dashed p-1">Blokir Tabungan Debitur</th>` : ""}
              <th class="border border-gray-400 border-dashed p-1">Dropping</th>
            </tr>
          </thead>
          <tbody>
            ${details
              .map(
                (r, i) => `
              <tr>
                <td class="border border-gray-400 border-dashed p-1 text-center">${i + 1}</td>
                <td class="border border-gray-400 border-dashed p-1">
                  <div>
                    ${r.Debitur.fullname}
                  </div>
                  <div class="text-xs opacity-70">
                    ${r.Debitur.nopen}
                  </div>
                </td>
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.plafond)}</td>
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.d_adm)}</td>
                ${hasProvisi ? `<td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.d_provisi)}</td>` : ""}
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.c_account_sumdan)}</td>
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.c_blokir * r.d_detailDapem.detail.angsuran_sumdan)}</td>
                ${isXen ? `<td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.d_blokTab)}</td>` : ""}
                <td class="border border-gray-400 border-dashed p-1 text-right">${IDRFormat(r.dropping)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr class="bg-gray-100 font-semibold italic">
              <td
                colspan="2"
                class="border border-gray-400 p-2 text-center border-dashed"
              >
                JUMLAH
              </td>
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(record.Dapems.reduce((acc, curr) => acc + curr.plafond, 0))}
              </td>
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(details.reduce((acc, curr) => acc + curr.d_adm, 0))}
              </td>
              ${
                hasProvisi
                  ? `<td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(details.reduce((acc, curr) => acc + curr.d_provisi, 0))}
              </td>`
                  : ""
              }
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(record.Dapems.reduce((acc, curr) => acc + curr.c_account_sumdan, 0))}
              </td>
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(details.reduce((acc, curr) => acc + curr.c_blokir * curr.d_detailDapem.detail.angsuran_sumdan, 0))}
              </td>
              ${
                isXen
                  ? `<td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(record.Dapems.reduce((acc, curr) => acc + curr.plafond * (1 / 100), 0))}
              </td>`
                  : ""
              }
              <td class="border border-gray-400 p-2 text-right border-dashed">
                ${IDRFormat(details.reduce((acc, curr) => acc + curr.dropping, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="mt-20 flex justify-end">
        <div class="w-96 text-center">
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_CITY}, ${moment(record.created_at).format("DD-MM-YYYY")}</p>
          <p>${process.env.NEXT_PUBLIC_APP_COMPANY_NAME?.toUpperCase()}</p>
          <div class="h-28"></div>
          <p class="border-b">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
          <p>${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
        </div>
      </div>
    </div>

    </body>
  </html>
  `;

  return html;
};

export const printSIXen = (record: IDropping) => {
  const htmlContent = generateSI(record);

  const w = window.open("", "_blank");
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
