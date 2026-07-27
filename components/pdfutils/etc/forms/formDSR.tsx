import { Header, ListStyle } from "../../utils";

export const FormDSR = () => {
  return `
    <div>
      ${Header("SURAT PERNYATAN", "PERMOHONAN PEMOTONGAN GAJI DIATAS 70%", undefined, process.env.NEXT_PUBLIC_APP_LOGO, undefined)}
      <p class="mt-3">Yang bertanda tangan dibawah ini.</p>
      <div class="my-5 flex flex-col gap-2">
        <div class="flex gap-3">
          <p class="w-4">1. </p>
          <div class="w-40">Nama Penerima Pensiun</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <p class="w-4">2. </p>
          <div class="w-40">Tempat dan Tanggal Lahir</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
          <div class="w-2">,</div>
          <div class="w-6 border-b border-gray-600"></div>
          <div class="w-2">/</div>
          <div class="w-6 border-b border-gray-600"></div>
          <div class="w-2">/</div>
          <div class="w-10 border-b border-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <p class="w-4">3. </p>
          <div class="w-40">Alamat Lengkap</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <p class="w-4"></p>
          <div class="w-40">Kelurahan</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <p class="w-4"></p>
          <div class="w-40">Kecamatan</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <p class="w-4"></p>
          <div class="w-40">Kabupaten / Kota</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <p class="w-4"></p>
          <div class="w-40">Provinsi</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <p class="w-4">4. </p>
          <div class="w-40">No. Telepon dan HP</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
        </div>
        <div class="flex gap-3">
          <p class="w-4">5. </p>
          <div class="w-40">Nama Bank</div>
          <div class="w-4">:</div>
          <div class="flex-1 border-b border-gray-600"></div>
          <div class="">No Rekening :</div>
          <div class="flex-1 border-b border-gray-600"></div>
        </div>
      </div>
      <div class="my-4">
        ${ListStyle(
          [
            `Sehubungan dengan kebutuhan pembiayaan yang harus saya penuhi saat ini, dengan ini saya mengajukan permohonan kepada KOPERASI ${process.env.NEXT_PUBLIC_APP_SHORTNAME} agar diberikan fasilitas pembiayaan dengan mekanisme pemotongan manfaat pensiun yang mengakibatkan besarnya angsuran melebihi 70% (tujuh puluh persen) dari Take Home Pay (THP) atau manfaat pensiun yang saya terima setiap bulan`,
            `Dengan ini saya memberikan kuasa dan persetujuan kepada KOPERASI ${process.env.NEXT_PUBLIC_APP_SHORTNAME} untuk melakukan pemotongan manfaat pensiun saya setiap bulan, termasuk pemotongan yang melebihi 70% (tujuh puluh persen) dari manfaat pensiun atau Take Home Pay (THP), sebagai pembayaran angsuran atas fasilitas pembiayaan yang saya peroleh sesuai dengan perjanjian pembiayaan yang telah disepakati.`,
            `Dengan ini saya menyatakan bahwa saya memiliki sumber penghasilan lain di luar manfaat pensiun yang saya terima setiap bulan, sehingga kebutuhan hidup sehari-hari saya tetap dapat terpenuhi meskipun dilakukan pemotongan manfaat pensiun sebagaimana dimaksud dalam surat pernyataan ini.`,
          ],
          "number",
        )}
      </div>
      <p class="my-2">
        Demikian Surat Pernyataan dan Permohonan ini saya buat dengan sebenar-benarnya, dalam keadaan sadar, tanpa adanya paksaan, tekanan, maupun pengaruh dari pihak mana pun, untuk dipergunakan sebagaimana mestinya.
      </p>

      <div class="flex gap-4 justify-end font-bold text-center mt-10">
        <div class="w-60">
          <p>_________________,_______ /_______ /__________</p>
          <p>Pemohon</p>
          <div class="h-36 flex justify-center items-center">
            <p class="text-xs opacity-70">Materai</p>
          </div>
          <p class="h-5">( ____________________________________ )</p>
          <p class="h-32">DEBITUR</p>
        </div>
      </div>
    </div>
  `;
};
