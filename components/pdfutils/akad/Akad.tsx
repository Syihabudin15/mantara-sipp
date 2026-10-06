import moment from "moment";
import { AnalisaPerhitungan } from "./Analisa";
import { IDapem } from "@/libs/IInterfaces";
import { JadwalAngsuran } from "./KartuAngsuran";
import { PersetujuanPencairan } from "./PersetujuanPencairan";
import { BPK } from "./BPK";
import { SPK } from "./SPK";
import { FLagging } from "./Flagging";
import { PernyataanKuasa } from "./PernyataanKuasa";
import { TTPJ } from "./TTPJ";
import { DocChecklist1 } from "./DC1";
import { DocChecklist2 } from "./DC2";
import { PK } from "./PK";
import { FormDSR } from "../etc/forms/formDSR";
import { FLaggingAsabri } from "./FlaggingAsabri";
import { FLaggingAsabri2 } from "./FlaggingAsabri2";
import { PKPerdana } from "./perdana/PKPerdana";
import { PPPerdana } from "./perdana/PPPerdana";

moment.locale("id");

const generateContractHtml = (record: IDapem) => {
  const handleGroupSKEP = () => {
    switch (record.Debitur.group_skep) {
      case "PT. TASPEN":
        return `<div class="page text-justify" style="font-size: 12px;">
        ${FLagging(record)}
      </div>`;
      case "TASPEN":
        return `<div class="page text-justify" style="font-size: 12px;">
        ${FLagging(record)}
      </div>`;
      case "PT. ASABRI":
        return `
        <div  
          class="page page-break text-justify border border-gray-700 p-2"
          style="font-size: 12px; padding-top: -20px; margin-top: -30px;"
        >
          ${FLaggingAsabri(record)}
        </div>
        <div class="page text-justify" style="font-size: 12px;">
        ${FLaggingAsabri2(record)}
        </div>`;
      case "ASABRI":
        return `
        <div class="page page-break text-justify border border-gray-700 p-2" style="font-size: 12px; padding-top: -30px; margin-top: -30px;">
          ${FLaggingAsabri(record)}
        </div>
        <div class="page page-break text-justify" style="font-size: 12px; ">
        ${FLaggingAsabri2(record)}
        </div>`;
      default:
        return `
        <div class="page text-justify" style="font-size: 12px; ">
          ${FLagging(record)}
        </div>
        `;
    }
  };

  const handlePK = () => {
    switch (record.ProdukPembiayaan.Sumdan.code) {
      case "PERDANA":
        return `<div class="page text-justify" style="font-family: 'Courier New', Courier, monospace;font-size: 12px; margin-top: -20px; padding-top: -20px;">
        ${PKPerdana(record)}
      </div>`;
      case "VIMA":
        return `<div class="page text-justify" style="font-size: 12px;">
        ${PK(record)}
      </div>`;
      default:
        return `<div class="page text-justify" style="font-size: 12px;">
        ${PK(record)}
      </div>`;
    }
  };
  const handleSPK = () => {
    switch (record.ProdukPembiayaan.Sumdan.code) {
      case "PERDANA":
        return `<div class="page text-justify" style="font-size: 12px; margin-top: -20px; padding-top: -20px;">
        ${PPPerdana(record)}
      </div>`;
      case "VIMA":
        return `<div class="page text-justify" style="font-size: 12px;">
        ${PersetujuanPencairan(record)}
      </div>`;
      default:
        return `<div class="page text-justify" style="font-size: 12px;">
        ${PersetujuanPencairan(record)}
      </div>`;
    }
  };

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
          margin: 10mm;
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
              padding-top: 70px;    /* ruang untuk header */
              page-break-after: always;
              line-height: 17px;
            }
            .page-invalid {
              position: relative;
              min-height: 95vh;    /* atau height A4 jika untuk print */
              page-break-after: always;
              line-height: 17px;
              margin:0mm;
            }
    
            .page .page-header {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              padding: 5px;
              text-align: center;
              background: white;
              border-bottom: 1px solid #ccc;
            }
          }
      </style>
    </head>
    <body class="bg-white text-gray-800 leading-relaxed p-4 max-w-200">

      <div class="page" style="font-size: 12px;">
        ${AnalisaPerhitungan(record)}
      </div>

      <div class="page" style="font-size: 11px;">
        ${JadwalAngsuran(record, "DEBITUR")}
      </div>
      <div class="page" style="font-size: 11px;">
        ${JadwalAngsuran(record, record.ProdukPembiayaan.Sumdan.name)}
      </div>
      ${handlePK()}
      ${handleSPK()}
      <div class="page text-justify" style="font-size: 12px;">
        ${BPK(record)}
      </div>
      <div class="page text-justify" style="font-size: 12px;">
        ${SPK(record)}
      </div>
      <div class="page text-justify" style="font-size: 12px;">
        ${PernyataanKuasa(record)}
      </div>
      ${handleGroupSKEP()}
      <div class="page page-break text-justify" style="font-size: 11px;">
        ${TTPJ(record)}
      </div>
      <div class="page page-break text-justify" style="font-size: 11px;">
        ${FormDSR()}
      </div>
      <div class="page text-justify" style="font-size: 11px;">
        ${DocChecklist1(record)}
      </div>
      <div class="page text-justify" style="font-size: 11px;">
        ${DocChecklist2(record)}
      </div>
      
    </body>
  </html>
  `;

  return html;
};

export const printContract = (record: IDapem) => {
  const htmlContent = generateContractHtml(record);

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
