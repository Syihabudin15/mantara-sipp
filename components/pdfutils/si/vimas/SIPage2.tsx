import { IDropping } from "@/libs/IInterfaces";
import moment from "moment";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
moment.locale("id");

export const SIPage2Vima = (record: IDropping) => {
  const dapem = record.Dapems[0];
  const detail = GetDetailDapem(dapem);
  const ao = dapem.AO || dapem.AOCabang || dapem.AOArea;

  return `
    <div class="page-header flex items-center mb-6 border-b pb-4">
      <div class="flex-1 flex items-center">
        <img src="${process.env.NEXT_PUBLIC_APP_LOGO}" alt="Logo" class="h-16 mr-4" />
        <div class="font-bold">
          <p>KOPERASI</p>
          <p>MANTARA</p>
        </div>
      </div>
      <div class="flex-1 text-center">
        <p class="font-bold text-lg">LAMPIRAN STANDING INSTRUCTION</p>
        <p class="">${record.id}</p>
      </div>
      <div class="flex-1"></div>
    </div>

    <div class="mt-10"></div>

    <p class="text-right">${process.env.NEXT_PUBLIC_APP_COMPANY_CITY}, ${moment(record.created_at).format("DD-MM-YYYY")}</p>
    <div class="border">
      ${[
        { key: "Nama Debitur", value: dapem.Debitur.fullname },
        {
          key: "Tempat, Tanggal Lahir",
          value: `${dapem.Debitur.birthplace || " "}, ${moment(dapem.Debitur.birthdate).format("DD MMMM YYYY")}`,
        },
        { key: "Nomor PK", value: dapem.no_contract || "" },
        {
          key: "Plafon Pembiayaan",
          classStyle: "font-bold",
          value: `Rp. ${IDRFormat(dapem.plafond)}`,
        },
        { key: "Administrasi", value: `Rp. ${IDRFormat(detail.administrasi)}` },
        { key: "Asuransi", value: `Rp. ${IDRFormat(detail.asuransi)}` },
        {
          key: "Tata Laksana",
          value: `Rp. ${IDRFormat(detail.tatalaksana + detail.provisi)}`,
        },
        {
          key: "Provisi",
          value: `Rp. ${IDRFormat(detail.detail.adm_sumdan + detail.detail.provisi_sumdan)}`,
        },
        {
          key: "Pembukaan Tabungan",
          value: `Rp. ${IDRFormat(dapem.c_account_sumdan)}`,
        },
        {
          key: `Blokir Angsuran di muka ${dapem.c_blokir} Angsuran`,
          value: `Rp. ${IDRFormat(dapem.c_blokir * detail.angsuran)}`,
        },
        {
          key: "Nominal Pelunasan",
          value: `Rp. ${IDRFormat(dapem.c_takeover)}`,
        },
        {
          key: "Nominal Diterima",
          classStyle: "font-bold",
          value: `Rp. ${IDRFormat(detail.tb)}`,
        },
        { key: "No. Rekening", value: "" },
        { key: "Cabang", value: ao?.Cabang.name },
        { key: "Jangka Waktu", value: `${dapem.tenor} Bulan` },
        {
          key: "Tanggal Akad Sesuai PK",
          value: moment(dapem.date_contract).format("DD MMMM YYYY"),
        },
        { key: "Keterangan", value: dapem.JenisPembiayaan.name },
      ]
        .map(
          (r, i) => `
          <div class="flex border-b ${r.classStyle ? r.classStyle : ""}">
            <p class="w-10 border-r text-center p-1">${i + 1}</p>
            <p class="flex-1 border-r p-1">${r.key}</p>
            <p class="flex-1 p-1">${r.value}</p>
          </div>
        `,
        )
        .join("")}
    </div>
    

    <div class="my-5 flex justify-around gap-10 items-end text-center">
      <div class="flex-1"></div>
      <div class="flex-1">
        <p>Hormat kami,</p>
        <div class="h-28"></div>
        <p class="w-full border-b">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
        <p>${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
      </div>
    </div>
`;
};
