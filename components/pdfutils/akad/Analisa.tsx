import {
  GetAngsuran,
  GetDapem,
  GetFullAge,
  IDRFormat,
} from "@/components/utils/PembiayaanUtil";
import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
import { Header, ListNonStyle } from "../utils";

export const AnalisaPerhitungan = (record: IDapem) => {
  const age = GetFullAge(
    record.Debitur.birthdate,
    record.date_contract || record.created_at,
  );
  const angsuran = GetAngsuran(
    record.plafond,
    record.tenor,
    record.c_margin + record.c_margin_sumdan,
    record.margin_type,
    record.rounded,
  ).angsuran;

  const dapem = GetDapem(record);

  return `
  ${Header("ANALISA PEMBIAYAAN", record.no_contract, undefined, process.env.NEXT_PUBLIC_APP_LOGO, record.ProdukPembiayaan.Sumdan.logo)}
  
  <div class="mt-4 flex gap-4">
    <div class="flex-1">
      ${ListNonStyle([
        { key: "Nama Pemohon", value: record.Debitur.fullname },
        { key: "Nomor Pensiun", value: record.nopen },
        {
          key: "Tempat Tangal Lahir",
          value: `${record.Debitur.birthplace}, ${moment(record.Debitur.birthdate).format("DD-MM-YYYY")}`,
        },
        { key: "Jenis Pembiayaan", value: record.JenisPembiayaan.name },
        { key: "Produk Pembiayaan", value: record.ProdukPembiayaan.name },
        {
          key: "Gaji Pensiun",
          value: IDRFormat(record.Debitur.salary),
          currency: true,
        },
      ])}
      
    </div>
    <div class="flex-1">
    ${ListNonStyle([
      {
        key: "Tanggal Akad",
        value: moment(record.date_contract).format("DD-MM-YYYY"),
      },
      {
        key: "Usia Pemohon",
        value: `${age.year} Tahun ${age.month} Bulan ${age.day} Hari`,
      },
      {
        key: "Est Tanggal Lunas",
        value: moment(record.date_contract)
          .add(record.tenor, "month")
          .format("DD/MM/YYYY"),
      },
      { key: "Plafond", value: IDRFormat(record.plafond), currency: true },
      {
        key: "Jangka Waktu",
        value: `${record.tenor} Bulan`,
      },
    ])}
    </div>
  </div>

  <div class="my-4 flex gap-4">
    <div class="flex-1">
      ${ListNonStyle([
        {
          key: "Suku Bunga",
          value: `${(record.c_margin + record.c_margin_sumdan).toFixed(2)}% /Tahun`,
        },
        {
          key: "Angsuran Perbulan",
          value: IDRFormat(angsuran),
          currency: true,
        },
        {
          key: "Sisa Gaji",
          value: IDRFormat(record.Debitur.salary - angsuran),
          currency: true,
        },
        {
          key: "Debt Service Ratio",
          value: `${((angsuran / record.Debitur.salary) * 100).toFixed(2)}% / ${record.ProdukPembiayaan.Sumdan.dsr.toFixed(2)}%`,
        },
      ])}
    </div>
    <div class="flex-1">
    ${ListNonStyle([
      {
        key: "SPV/MOC/KORWIL",
        value: `${record.AO.fullname} (${record.AO.nip})`,
      },
      {
        key: "Unit Pelayanan",
        value: `${record.AO.Cabang.name} - ${record.AO.Cabang.Area.name}`,
      },
      { key: "Admin", value: record.CreatedBy.fullname },
    ])}
    </div>
  </div>
  

  <div class="my-10">
    <p class="font-bold text-lg mb-2">Rincian Pembiayaan :</p>
    <div class="flex gap-4 items-end">
      <div class="flex-1">
        ${ListNonStyle([
          {
            key: "Biaya Administrasi",
            value: IDRFormat(
              record.plafond * ((record.c_adm + record.c_adm_sumdan) / 100),
            ),
            currency: true,
          },
          {
            key: "Biaya Asuransi",
            value: IDRFormat(record.plafond * (record.c_insurance / 100)),
            currency: true,
          },
          {
            key: "Biaya Tatalaksana",
            value: IDRFormat(record.c_gov),
            currency: true,
          },
          {
            key: "Biaya Buka Rekening",
            value: IDRFormat(record.c_account),
            currency: true,
          },
          {
            key: "Biaya Provisi",
            value: IDRFormat(
              record.plafond *
                ((record.c_provisi + record.c_provisi_sumdan) / 100),
            ),
            currency: true,
          },
          {
            key: "Biaya Flagging",
            value: IDRFormat(record.c_infomation),
            currency: true,
          },
          {
            key: "Biaya Materai",
            value: IDRFormat(record.c_stamp),
            currency: true,
          },
          {
            key: "Biaya Mutasi",
            value: IDRFormat(record.c_mutasi),
            currency: true,
          },
          {
            key: "Total Biaya",
            value: IDRFormat(dapem.biaya),
            currency: true,
            classStyle: "border-t border-dashed font-bold",
          },
        ])}
      </div>

      <div class="flex-1 ">
      ${ListNonStyle([
        {
          key: "Terima Kotor",
          value: IDRFormat(record.plafond - dapem.biaya),
          currency: true,
        },
        {
          key: "Blokir Angsuran",
          value: IDRFormat(dapem.blok),
          currency: true,
        },
        {
          key: "BPP",
          value: IDRFormat(record.c_bpp),
          currency: true,
        },
        {
          key: "Nominal Takeover",
          value: IDRFormat(record.c_takeover),
          currency: true,
        },
        {
          key: "Terima Bersih",
          value: IDRFormat(dapem.tb),
          currency: true,
          classStyle: "border-t border-dashed font-bold",
        },
      ])}
      </div>
    </div>
  </div>
  
  <div class="mt-5 italic">
    <p>Informasi Lainnya : </p>
    <ul style="list-style-type: disc;">
      ${record.JenisPembiayaan.status_takeover ? `<li>Instansi takeover ke <span class="font-bold">${record.takeover_from}</span> dengan estimasi pelaksanaan tanggal <span class="font-bold">${moment(record.takeover_date).format("DD MMMM YYYY")}</span></li>` : ""}
      ${record.JenisPembiayaan.status_mutasi ? `<li>Akan dilakukan mutasi kantor bayar gaji pensiun dari <span class="font-bold">${record.mutasi_from} ke ${record.mutasi_to}</span>` : ""}
    </ul>
  </div>
`;
};
