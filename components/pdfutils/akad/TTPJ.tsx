import { IDapem } from "@/libs/IInterfaces";
import moment from "moment";
moment.locale("id");

export const TTPJ = (record: IDapem) => {
  return `
  <div class="flex items-center justify-between border-b pb-2" style="margin-top: -20px">
    <div class="flex-1">
      <img src="${record.ProdukPembiayaan.Sumdan.logo}" alt="Logo" class="h-16 mr-4" />
    </div>
    <div class="flex-1 text-center">
      <h2 class="text-center text-xl font-semibold mb-2 ">TANDA TERIMA PENYERAHAN JAMINAN</h2>
      <p class="text-center ">${record.no_contract}</p>
    </div>
    <div class="flex-1"></div>
  </div>
  
  <div class="flex justify-between gap-8 items-center">
    <div class="flex-1">
      <div class="flex gap-2">
        <p class="w-32">Nama Lengkap</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.fullname}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">NIP / Nopen</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.nopen}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Instansi</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.group_skep}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Loket Bayar</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.PayOffice.name}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Alamat</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward} KECAMATAN ${record.Debitur.district}, ${record.Debitur.city} ${record.Debitur.province} ${record.Debitur.pos_code}</p>
      </div>
    </div>
    <div class="w-[30%]">
      <div class="flex gap-2">
        <p class="w-32">Nomor SKEP</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.no_skep}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Tanggal SKEP</p>
        <p class="w-4">:</p>
        <p class="flex-1">${moment(record.Debitur.date_skep).format("DD-MM-YYYY")}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Nama SKEP</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.name_skep}</p>
      </div>
    </div>
  </div>

  <div class="my-2 text-center">
    <p class="my-2">Diserahkan Tanggal</p>
    <div class="flex gap-10 justify-around items-end">
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-b font-bold">${record.Debitur.fullname}</p>
        <p>DEBITUR</p>
      </div>
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-t">Kepala Unit Layanan</p>
      </div>
    </div>
  </div>
  <div class="text-center">
    <p class="my-2">Dikembalikan Tanggal</p>
    <div class="flex gap-10 justify-around my-8 items-end">
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-b">${record.Debitur.fullname}</p>
        <p>DEBITUR</p>
      </div>
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-t">Kepala Unit Layanan</p>
      </div>
    </div>
  </div>
  
  <div class="border-t border-dashed my-4"></div>
  
  <div class="flex items-center justify-between border-b pb-2">
    <div class="flex-1">
      <img src="${record.ProdukPembiayaan.Sumdan.logo}" alt="Logo" class="h-16 mr-4" />
    </div>
    <div class="flex-1 text-center">
      <h2 class="text-center text-xl font-semibold mb-2 ">TANDA TERIMA PENYERAHAN JAMINAN</h2>
      <p class="text-center ">${record.no_contract}</p>
    </div>
    <div class="flex-1"></div>
  </div>
  
  <div class="flex justify-between gap-8 items-center">
    <div class="flex-1">
      <div class="flex gap-2">
        <p class="w-32">Nama Lengkap</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.fullname}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">NIP / Nopen</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.nopen}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Instansi</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.group_skep}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Loket Bayar</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.PayOffice.name}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Alamat</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.address}, KELURAHAN ${record.Debitur.ward} KECAMATAN ${record.Debitur.district}, ${record.Debitur.city} ${record.Debitur.province} ${record.Debitur.pos_code}</p>
      </div>
    </div>
    <div class="w-[30%]">
      <div class="flex gap-2">
        <p class="w-32">Nomor SKEP</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.no_skep}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Tanggal SKEP</p>
        <p class="w-4">:</p>
        <p class="flex-1">${moment(record.Debitur.date_skep).format("DD-MM-YYYY")}</p>
      </div>
      <div class="flex gap-2">
        <p class="w-32">Nama SKEP</p>
        <p class="w-4">:</p>
        <p class="flex-1">${record.Debitur.name_skep}</p>
      </div>
    </div>
  </div>

  <div class="my-2 text-center">
    <p class="my-2">Diserahkan Tanggal</p>
    <div class="flex gap-10 justify-around items-end">
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-b">${record.Debitur.fullname}</p>
        <p>DEBITUR</p>
      </div>
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-t">Kepala Unit Layanan</p>
      </div>
    </div>
  </div>
  <div class="text-center">
    <p class="my-2">Dikembalikan Tanggal</p>
    <div class="flex gap-10 justify-around my-8 items-end">
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-b font-bold">${record.Debitur.fullname}</p>
        <p>DEBITUR</p>
      </div>
      <div class="flex-1">
        <div class="h-12"></div>
        <p class="border-t">Kepala Unit Layanan</p>
      </div>
    </div>
  </div>
`;
};
