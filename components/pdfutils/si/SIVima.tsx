import moment from "moment";
import { ICashDesc, IDropping } from "@/libs/IInterfaces";
import { SIPage1Vima } from "./vimas/SIPage1";
import { SIPage2Vima } from "./vimas/SIPage2";
import { SIPage3Vima } from "./vimas/SIPage3";
import { SIPage4Vima } from "./vimas/SIPage4";

moment.locale("id");

const generateSI = (record: IDropping) => {
  const dto = record.Dapems[0];
  const cashs = JSON.parse(dto.cash_desc || "[]") as ICashDesc[];

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
          @bottom-center {
            content: "Halaman " counter(page) " dari " counter(pages);
            font-family: Cambria, Georgia, 'Times New Roman', Times, serif;
            font-size: 9px;
          }
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
      ${SIPage1Vima(record)}
    </div>
    <div class="page" style="font-size: 12px;">
      ${SIPage2Vima(record)}
    </div>
    <div class="page" style="font-size: 12px;">
      ${SIPage3Vima(record)}
    </div>
    ${cashs
      .map(
        (c, i) => `
      <div class="page" style="font-size: 12px;">
        ${SIPage4Vima(record, dto, c, i === 0)}
      </div>
      `,
      )
      .join("")}

    </body>
  </html>
  `;

  return html;
};

export const printSIVima = (record: IDropping) => {
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
