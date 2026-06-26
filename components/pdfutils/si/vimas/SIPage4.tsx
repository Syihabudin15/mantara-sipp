import { ICashDesc, IDapem, IDropping } from "@/libs/IInterfaces";
import moment from "moment";
import { GetDetailDapem, IDRFormat } from "@/components/utils/PembiayaanUtil";
import { ListNonStyle, NumberToWordsID } from "../../utils";
moment.locale("id");

export const SIPage4Vima = (
  record: IDropping,
  dapem: IDapem,
  cash: ICashDesc,
  firstdata: boolean,
) => {
  const detail = GetDetailDapem(dapem);
  const blok =
    (detail.angsuran - detail.detail.angsuran_sumdan) * dapem.c_blokir;
  const tb = detail.biayakop + blok;

  return `
    <div class="page-header flex items-center mb-4 border-b pb-2">
      <div class="flex-1 flex items-center">
        <img src="${process.env.NEXT_PUBLIC_APP_LOGO}" alt="Logo" class="h-16 mr-4" />
        <div class="font-bold">
          <p>KOPERASI</p>
          <p>MANTARA</p>
        </div>
      </div>
      <div class="flex-1 text-center">
        <p class="font-bold text-lg">DATA DEBITUR</p>
      </div>
      <div class="flex-1"></div>
    </div>

    <div class="mt-2"></div>

    <p>Saya yang bertanda tangan dibawah ini :</p>
    ${ListNonStyle([
      { key: "Nama", value: dapem.Debitur.fullname },
      { key: "No. Identitas", value: dapem.Debitur.nik },
      {
        key: "Alamat",
        value: `${dapem.Debitur.address}, KELURAHAN ${dapem.Debitur.ward}, KECAMATAN ${dapem.Debitur.district}, KOTA/KABUPATEN ${dapem.Debitur.city}, PROVINSI ${dapem.Debitur.province} ${dapem.Debitur.pos_code}`,
      },
    ])}
    <p class="my-1">Selanjutnya disebut sebagai <span class="font-bold">"PIHAK PERTAMA"</span></p>

    ${ListNonStyle([
      { key: "Nama", value: dapem.ProdukPembiayaan.Sumdan.name },
      { key: "Alamat", value: dapem.ProdukPembiayaan.Sumdan.address },
    ])}
    <p class="my-1">Selanjutnya disebut sebagai <span class="font-bold">"PIHAK KEDUA"</span></p>

    <p class="my-1 font-bold text-center">========================= KHUSUS =========================</p>
    <p>Untuk dan atas nama "PIHAK PERTAMA" melakukan transfer dan pemindah bukuan hasil pencairan pinjaman pensiun dari rekening :</p>

    ${ListNonStyle([
      { key: "No. Rekening", value: "" },
      { key: "Nama", value: dapem.Debitur.fullname },
      { key: "Nama Bank", value: dapem.ProdukPembiayaan.Sumdan.name },
    ])}

    <div class="my-2">
      <div class="flex gap-2 font-bold">
        <p class="w-4">1.</p>
        <p class="flex-1">Transfer ke Rekening Tujuan : </p>
      </div>
      <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">No. Rekening : </p>
        <p class="w-4">:</p>
        <p class="w-40">${dapem.Debitur.account_number}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">Atas Nama : </p>
        <p class="w-4">:</p>
        <p class="w-40">${dapem.Debitur.fullname}</p>
        </div>
        <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">Uang Sejumlah :</p>
        <p class="w-4">:</p>
        <div class="w-28 flex justify-between gap-2">
          <p class="w-4">Rp. </p>
          <p class="w-28 flex-1 text-right">${IDRFormat(cash.amount)}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">Keterangan : </p>
        <p class="w-4">:</p>
        <p class="flex-1 italic">${cash.desc}</p>
      </div>
    </div>

    ${
      firstdata
        ? `
      <div class="my-2">
      <div class="flex gap-2 font-bold">
        <p class="w-4">2.</p>
        <p class="flex-1">Pindah Buku Rekening Tujuan  : </p>
      </div>
      <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">No. Rekening : </p>
        <p class="w-4">:</p>
        <p class="w-40">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NUMBER}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">Atas Nama : </p>
        <p class="w-4">:</p>
        <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NAME}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">Nama Bank : </p>
        <p class="w-4">:</p>
        <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_BANK}</p>
        </div>
        <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">Uang Sejumlah :</p>
        <p class="w-4">:</p>
        <div class="w-28 flex justify-between gap-2">
          <p class="w-4">Rp. </p>
          <p class="w-28 text-right">${IDRFormat(tb)}</p>
        </div>
      </div>
      <div class="flex gap-2">
        <p class="w-4"></p>
        <p class="w-44">Terbilang : </p>
        <p class="w-4">:</p>
        <p class="flex-1 italic">${NumberToWordsID(tb)} Rupiah</p>
      </div>
    </div>

    ${
      dapem.c_takeover > 0
        ? `
      <div class="my-2">
        <div class="flex gap-2 font-bold">
          <p class="w-4">3.</p>
          <p class="w-60">Take Over (T.O) : </p>
          <p class="w-4">:</p>
          <p class="w-40"></>
        </div>
        <div class="flex gap-2">
          <p class="w-4"></p>
          <p class="w-44">No. Rekening : </p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NUMBER}</p>
        </div>
        <div class="flex gap-2">
          <p class="w-4"></p>
          <p class="w-44">Atas Nama : </p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_NAME}</p>
        </div>
        <div class="flex gap-2">
          <p class="w-4"></p>
          <p class="w-44">Nama Bank : </p>
          <p class="w-4">:</p>
          <p class="flex-1">${process.env.NEXT_PUBLIC_APP_COMPANY_ACCOUNT_BANK}</p>
          </div>
        <div class="flex gap-2">
          <p class="w-4"></p>
          <p class="w-44">Uang Sejumlah :</p>
          <p class="w-4">:</p>
          <div class="w-28 flex justify-between gap-2">
            <p class="w-4">Rp. </p>
            <p class="w-28 text-right">${IDRFormat(dapem.c_takeover)}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <p class="w-4"></p>
          <p class="w-44">Terbilang : </p>
          <p class="w-4">:</p>
          <p class="flex-1 italic">${NumberToWordsID(dapem.c_takeover)} Rupiah</p>
        </div>
      </div>
      `
        : ""
    }
      `
        : ""
    }

    <div class="my-2">
      <p >Biaya transfer atau pemindah bukuan harap dibebankan ke rekening pihak pertama. Standing Instruction ini (SI) akan berakhir pada saat maksud pemberian kuasa ini telah terpenuhi.</p>
      <p >Demikian Standing Instruction (SI) ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
    </div>

    <div class="my-5 flex justify-around gap-10 items-end text-center">
      <div class="flex-1 flex flex-col justify-end text-center">
        <p>${process.env.NEXT_PUBLIC_APP_COMPANY_CITY}, ${moment(record.created_at).format("DD-MM-YYYY")}</p>

        <div class="h-28 flex items-center justify-center opacity-50">
          <p>Materai 10.000</p>
        </div>

        <div class="h-10">
          <p class="w-full border-b">${dapem.Debitur.fullname}</p>
        </div>
      </div>

      <div class="flex-1 flex flex-col justify-end text-center">
        <p>Dibuat Oleh,</p>
        <p>${process.env.NEXT_PUBLIC_APP_COMPANY_NAME}</p>

        <div class="h-28"></div>

        <div class="h-10">
          <p class="w-full border-b">${process.env.NEXT_PUBLIC_APP_SI_NAME}</p>
          <p>${process.env.NEXT_PUBLIC_APP_SI_POSITION}</p>
        </div>
      </div>
    </div>
`;
};
