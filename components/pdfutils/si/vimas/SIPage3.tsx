import { IDropping } from "@/libs/IInterfaces";
import moment from "moment";
import { IDRFormat } from "@/components/utils/PembiayaanUtil";
moment.locale("id");

export const SIPage3Vima = (record: IDropping) => {
  const dapem = record.Dapems[0];

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
        <p class="font-bold text-lg">DATA DEBITUR</p>
      </div>
      <div class="flex-1"></div>
    </div>

    <div class="mt-10"></div>

    <div class="border">
      ${[
        { key: "Nama Debitur", value: dapem.Debitur.fullname },
        {
          key: "Tempat, Tanggal Lahir",
          value: `${dapem.Debitur.birthplace}, ${moment(dapem.Debitur.birthdate).format("DD MMMM YYYY")}`,
        },
        { key: "No. KTP / NIK", value: dapem.Debitur.nik },
        { key: "No. Tlp/HP", value: dapem.Debitur.phone },
        { key: "No. Pensiun", value: dapem.Debitur.nopen },
        { key: "No. SK / SKEP", value: dapem.Debitur.no_skep },
        { key: "Nomor PK", value: dapem.no_contract },
        {
          key: "Plafon Pembiayaan",
          classStyle: "font-bold",
          value: `Rp. ${IDRFormat(dapem.plafond)}`,
        },
        { key: "Pengelola", value: dapem.Debitur.group_skep },
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
`;
};
