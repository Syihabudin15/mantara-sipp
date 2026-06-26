import { IDropping } from "@/libs/IInterfaces";
import { ListNonStyle } from "../../utils";
import moment from "moment";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
moment.locale("id");

export const SIPage1Vima = (record: IDropping) => {
  const dapem = record.Dapems[0];
  const detail = GetDetailDapem(dapem);
  return `
  <div>
     <div class="page-header flex items-center mb-6 border-b pb-4">
      <img src="${process.env.NEXT_PUBLIC_APP_LOGO}" alt="Logo" class="h-16 mr-4" />
      <div class="font-bold">
        <p>KOPERASI</p>
        <p>MANTARA</p>
      </div>
    </div>

    <div class="my-3">
      ${ListNonStyle([
        { key: "Nomor Cetak Surat SI", value: record.id },
        {
          key: "Perihal",
          value:
            "Permohonan Pencairan Fasilitas Kredit dan Standing Instruction",
        },
      ])}
    </div>

    <div class="mb-2">
      <p>Kepada Yth,</p>
      <p>${record.Sumdan.name}</p>
      <p>${record.Sumdan.address}</p>
    </div>

    <div>
      <p>Dengan hormat,</p>
      <p>Sehubungan dengan perjanjian Kerja Sama dalam rangka pemberian fasilitas kredit channelling antara ${record.Sumdan.name} dengan ${process.env.NEXT_PUBLIC_APP_COMPANY_NAME}, dengan ini kami mohon agar dapat diproses pencairan kredit dan alikasi sebagai berikut :</p>

      <div class="my-2 ml-6">
        ${ListNonStyle([
          {
            key: "Pada Tanggal",
            value: moment(record.created_at).format("DD MMMM YYYY"),
          },
          {
            key: "Nama Debitur",
            value: dapem.Debitur.fullname,
          },
          {
            key: "Plafon Pembiayaan",
            value: IDRFormat(dapem.plafond),
            currency: true,
          },
          {
            key: "Keterangan",
            value: dapem.ProdukPembiayaan.name,
          },
          {
            key: `Provisi ${dapem.c_provisi_sumdan + dapem.c_adm_sumdan}%`,
            value: IDRFormat(
              detail.detail.adm_sumdan + detail.detail.provisi_sumdan,
            ),
            currency: true,
            classStyle: "font-bold",
          },
          {
            key: `Pembukaan Tabungan`,
            value: IDRFormat(dapem.c_account_sumdan),
            currency: true,
            classStyle: "font-bold",
          },
          {
            key: `Blokir Angsuran ${dapem.c_blokir} Bulan`,
            value: IDRFormat(detail.detail.angsuran_sumdan * dapem.c_blokir),
            currency: true,
            classStyle: "font-bold",
          },
        ])}
      </div>

      <p class="mt-4">Selanjutnya kami mohon :</p>
        <div class="ml-6">
          <div class="flex gap-2 font-bold">
            <p class="w-44">Blokir Angsuran ${dapem.c_blokir} Bulan</p>
            <p class="w-4">:</p>
            <div class="w-28 flex justify-between gap-2">
              <p class="w-4">Rp. </p>
              <p class="w-4 flex-1 text-right">${IDRFormat(dapem.c_blokir * (detail.angsuran - detail.detail.angsuran_sumdan))}</p>
            </div>
          </div>
          <div class="flex gap-2 font-bold">
            <p class="w-44">Total Biaya</p>
            <p class="w-4">:</p>
            <div class="w-28 flex justify-between gap-2">
              <p class="w-4">Rp. </p>
              <p class="w-4 flex-1 text-right">${IDRFormat(detail.biayakop)}</p>
            </div>
          </div>
          <div class="flex gap-2 ml-2">
            <p class="w-4">A. </p>
            <p class="w-36">Asuransi</p>
            <p class="w-4">:</p>
            <div class="w-28 flex justify-between gap-2">
              <p class="w-4">Rp. </p>
              <p class="w-4 flex-1 text-right">${IDRFormat(detail.asuransi)}</p>
            </div>
          </div>
          <div class="flex gap-2 ml-2">
            <p class="w-4">B. </p>
            <p class="w-36">Administrasi</p>
            <p class="w-4">:</p>
            <div class="w-28 flex justify-between gap-2">
              <p class="w-4">Rp. </p>
              <p class="w-4 flex-1 text-right">${IDRFormat(detail.detail.adm + detail.detail.adm_ff + detail.detail.adm_mita)}</p>
            </div>
          </div>
          <div class="flex gap-2 ml-2">
            <p class="w-4">C. </p>
            <p class="w-36">Tatalaksana</p>
            <p class="w-4">:</p>
            <div class="w-28 flex justify-between gap-2">
              <p class="w-4">Rp. </p>
              <p class="w-4 flex-1 text-right">${IDRFormat(detail.detail.fee_ao + detail.detail.fee_cabang + detail.detail.fee_area + detail.detail.fee_bpb + detail.detail.fee_bpp + dapem.c_account)}</p>
            </div>
          </div>
          <div class="flex gap-2 font-bold">
            <p class="w-44">Total Dropping</p>
            <p class="w-4">:</p>
            <div class="w-28 flex justify-between gap-2">
              <p class="w-4">Rp. </p>
              <p class="w-4 flex-1 text-right">${IDRFormat(detail.biayakop + dapem.c_blokir * (detail.angsuran - detail.detail.angsuran_sumdan))}</p>
            </div>
          </div>
        </div>
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
  </div>
`;
};
