import moment from "moment";
import { IDapem } from "@/libs/IInterfaces";
import {
  GetDetailDapem,
  GetFullAge,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";

moment.locale("id");

const generateMCC = (record: IDapem) => {
  const { year, month, day } = GetFullAge(
    record.Debitur.birthdate,
    record.date_contract || record.created_at,
  );
  const detail = GetDetailDapem(record);
  const produkPembiayaans =
    record.ProdukPembiayaan?.Sumdan?.ProdukPembiayaans || [];
  const jenisPembiayaan = record.JenisPembiayaan?.name?.toLowerCase() || "";

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
        .bg-white { background: white; }
        .text-gray-800 { color: #1f2937; }
        .leading-relaxed { line-height: 1.625; }
        .p-4 { padding: 16px; }
        .p-2 { padding: 8px; }
        .mt-4 { margin-top: 16px; }
        .flex { display: flex; }
        .flex-1 { flex: 1; }
        .items-end { align-items: flex-end; }
        .gap-2 { gap: 8px; }
        .gap-4 { gap: 16px; }
        .border { border: 1px solid #000; }
        .border-gray-800 { border-color: #1f2937; }
        .text-lg { font-size: 18px; }
        .font-bold { font-weight: bold; }
        .text-center { text-align: center; }
        .bg-gray-800 { background: #1f2937; }
        .text-slate-100 { color: #f1f5f9; }
        .py-2 { padding-top: 8px; padding-bottom: 8px; }
        .w-4 { width: 16px; }
        .w-40 { width: 160px; }
        .h-4 { height: 16px; }
        .h-96 { height: 384px; }

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

        ${record.ProdukPembiayaan.Sumdan.logo ? `<img src="${record.ProdukPembiayaan.Sumdan.logo}" style="width: 30%" />` : ""}
        <div class="border border-gray-800">
            <div class="text-lg text-center font-bold bg-gray-800 text-slate-100 py-2">LEMBAR KEPUTUSAN KOMITE KREDIT</div>
            <div class="p-2">
                <div class="flex gap-2">
                    <p class="w-4">1.</p>
                    <p class="w-40">NAMA DEBITUR</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">${record.Debitur.fullname}</div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">2.</p>
                    <p class="w-40">USIA</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">${year} Tahun ${month} Bulan ${day} Hari</div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">3.</p>
                    <p class="w-40">NOTAS/NOPEN</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">${record.nopen}</div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">4.</p>
                    <p class="w-40">INSTANSI</p>
                    <p class="w-4">:</p>
                    <div class="flex-1 flex gap-4">
                        <div class="flex gap-2">
                            <div class="w-4 h-4 border-gray-800">${record.Debitur.group_skep === "PT. ASABRI" ? "✓" : ""}</div>
                            <p>ASABRI</p>
                        </div>
                        <div class="flex gap-2">
                            <div class="w-4 h-4 border-gray-800">${record.Debitur.group_skep === "PT. TASPEN" ? "✓" : ""}</div>
                            <p>TASPEN</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">5.</p>
                    <p class="w-40">JENIS PINJAMAN</p>
                    <p class="w-4">:</p>
                    <div class="flex-1 flex gap-4">
                    ${produkPembiayaans
                      .map(
                        (p) => `
                        <div class="flex gap-2">
                            <div class="w-4 h-4 border-gray-800">${record.produkPembiayaanId === p.id ? "✓" : ""}</div>
                            <p>${p.name.toUpperCase()}</p>
                        </div>
                        `,
                      )
                      .join("")}
                        
                    </div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">6.</p>
                    <p class="w-40">STATUS PEMBIAYAAN</p>
                    <p class="w-4">:</p>
                    <div class="flex-1 flex gap-4">
                        <div class="flex gap-2">
                            <div class="w-4 h-4 border-gray-800">${jenisPembiayaan.includes("tangan") ? "✓" : ""}</div>
                            <p>SK DITANGAN</p>
                        </div>
                        <div class="flex gap-2">
                            <div class="w-4 h-4 border-gray-800">${jenisPembiayaan.includes("mutasi") ? "✓" : ""}</div>
                            <p>MUTASI</p>
                        </div>
                        <div class="flex gap-2">
                            <div class="w-4 h-4 border border-gray-800">${jenisPembiayaan.includes("over") ? "✓" : ""}</div>
                            <p>TAKE OVER</p>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">7.</p>
                    <p class="w-40">NOMINAL PLAFOND</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">Rp. ${IDRFormat(record.plafond)}</div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">8.</p>
                    <p class="w-40">JANGKA WAKTU</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">${record.tenor} Bulan</div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">9.</p>
                    <p class="w-40">MARGIN EFEKTIF</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">${(record.c_margin + record.c_margin_sumdan).toFixed(2)}%PER BULAN</div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">10.</p>
                    <p class="w-40">GAJI BERSIH PER BULAN</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">Rp. ${IDRFormat(record.Debitur.salary)}</div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">11.</p>
                    <p class="w-40">KEWAJIBAN PER BULAN</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">Rp. ${IDRFormat(detail.angsuran)}</div>
                </div>
                <div class="flex gap-2">
                    <p class="w-4">12.</p>
                    <p class="w-40">SISA GAJI PER BULAN</p>
                    <p class="w-4">:</p>
                    <div class="flex-1">Rp. ${IDRFormat(record.Debitur.salary - detail.angsuran)}</div>
                </div>
            </div>
            <div class="text-lg text-center font-bold bg-gray-800 text-slate-100 py-2 mt-4">ANALISA SLIK + VERIFIKASI CHECKLIST DOKUMEN</div>
            <div class="flex items-end">
                <div class="flex-1 h-44 border-r border-gray-700"></div>
                <div class="w-40 text-center">CREDIT OFFICER</div>
            </div>
            <div class="text-lg text-center font-bold bg-gray-800 text-slate-100 py-2">KEPUTUSAN KOMITE CREDIT</div>
            <div class="flex items-end">
                <div class="flex-1 h-44 border-r border-gray-700"></div>
                <div class="w-40 text-center">KABAG KREDIT</div>
            </div>
        </div>

    </body>
  </html>
  `;

  return html;
};

export const printMCC = (record: IDapem, printWindow?: Window) => {
  const htmlContent = generateMCC(record);

  const w = printWindow || window.open("", "_blank");
  if (!w) {
    alert("Popup diblokir. Mohon izinkan popup dari situs ini.");
    return;
  }

  w.document.title = "MCC - " + (record.Debitur.fullname || record.nopen || "");
  w.focus();
  w.document.open();
  w.document.write(htmlContent);
  w.document.close();
  setTimeout(() => {
    w.focus();
    w.print();
  }, 500);
};
