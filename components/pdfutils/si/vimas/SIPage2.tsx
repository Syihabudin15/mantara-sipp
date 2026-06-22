import { IDropping } from "@/libs/IInterfaces";
import moment from "moment";
import { GetAngsuran, IDRFormat } from "@/components/utils/PembiayaanUtil";
moment.locale("id");

export const SIPage2Vima = (record: IDropping) => {
  const dapem = record.Dapems[0];
  const angs = GetAngsuran(
    dapem.plafond,
    dapem.tenor,
    dapem.c_margin + dapem.c_margin_sumdan,
    dapem.margin_type,
    dapem.rounded,
    dapem.c_ned,
  ).angsuran;
  const angsSumdan = GetAngsuran(
    dapem.plafond,
    dapem.tenor,
    dapem.c_margin_sumdan,
    dapem.margin_type,
    dapem.rounded,
  ).angsuran;
  const admAngsuran = Math.ceil(angs - angsSumdan);

  const adm =
    dapem.plafond * ((dapem.c_adm + dapem.c_adm_mitra + dapem.c_adm_ff) / 100);
  const provisi =
    dapem.plafond *
    ((dapem.c_fee_ao +
      dapem.c_fee_cabang +
      dapem.c_fee_area +
      dapem.c_fee_bpp +
      dapem.c_fee_bpb) /
      100);
  const asuransi = dapem.plafond * (dapem.c_insurance / 100);
  const tatalaksana =
    dapem.c_gov +
    dapem.c_flagging +
    dapem.c_infomation +
    dapem.c_stamp +
    dapem.c_bop +
    dapem.c_mutasi;
  const biaya = adm + provisi + asuransi + tatalaksana + dapem.c_account;
  const tb = dapem.plafond - (biaya + dapem.c_takeover);
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
          value: `${dapem.Debitur.birthplace}, ${moment(dapem.Debitur.birthdate).format("DD MMMM YYYY")}`,
        },
        { key: "Nomor PK", value: dapem.no_contract },
        {
          key: "Plafon Pembiayaan",
          classStyle: "font-bold",
          value: `Rp. ${IDRFormat(dapem.plafond)}`,
        },
        { key: "Administrasi", value: `Rp. ${IDRFormat(adm)}` },
        { key: "Asuransi", value: `Rp. ${IDRFormat(asuransi)}` },
        { key: "Tata Laksana", value: `Rp. ${IDRFormat(tatalaksana)}` },
        { key: "Provisi", value: `Rp. ${IDRFormat(provisi)}` },
        {
          key: "Pembukaan Tabungan",
          value: `Rp. ${IDRFormat(dapem.c_account)}`,
        },
        {
          key: `Blokir Angsuran di muka ${dapem.c_blokir} Angsuran`,
          value: `Rp. ${IDRFormat(dapem.c_blokir * admAngsuran)}`,
        },
        {
          key: "Nominal Pelunasan",
          value: `Rp. ${IDRFormat(dapem.c_takeover)}`,
        },
        {
          key: "Nominal Diterima",
          classStyle: "font-bold",
          value: `Rp. ${IDRFormat(tb)}`,
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
        <p class="border-b">${process.env.NEXT_PUBLIC_APP_AKAD_NAME}</p>
        <p>${process.env.NEXT_PUBLIC_APP_AKAD_POSITION}</p>
      </div>
    </div>
`;
};
