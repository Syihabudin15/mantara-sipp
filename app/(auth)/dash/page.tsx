"use client";
import { useUser } from "@/components/UserContext";

export default function PensionWelcomeDashboard() {
  const user = useUser();
  return (
    <div className="min-h-screen bg-slate-50/50 p-6 sm:p-10 flex flex-col justify-between">
      {/* Top Header / Greeting */}
      <div className="max-w-7xl mx-auto w-full mb-6">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight sm:text-3xl">
          Selamat Datang, {user?.fullname || ""}👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Sistem Pembiayaan Pensiun siap digunakan. Silakan pilih menu di
          navigasi samping untuk memulai.
        </p>
      </div>

      {/* Main Informational Component */}
      <main className="max-w-5xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center my-8 p-8 bg-white rounded-2xl border border-slate-100 shadow-sm">
        {/* Decorative Icon Wrapper */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-emerald-100 rounded-full blur-xl opacity-50 scale-150" />
          <div className="relative bg-linear-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-10.5h16.5M2.25 22.5h19.5M4.5 10.5v10.5m15-10.5v10.5M12 3v7m0 0-3-3m3 3 3-3"
              />
            </svg>
          </div>
        </div>

        {/* Text Contents */}
        <div className="max-w-2xl space-y-3 mb-10">
          <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
            Sistem Pembiayaan Pensiun
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Platform ini mendukung otomatisasi dan pengelolaan fasilitas
            pembiayaan bagi para pensiunan. Multi-skema pendanaan telah
            terintegrasi untuk fleksibilitas likuiditas dan manajemen risiko
            yang optimal.
          </p>
        </div>

        {/* The 3 Core Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          {/* Scheme 1: Dana Internal */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Dana Internal
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pembiayaan penuh menggunakan portofolio dan likuiditas internal
              lembaga. Seluruh keuntungan dan risiko dikelola secara mandiri
              oleh sistem.
            </p>
          </div>

          {/* Scheme 2: Channeling */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Skema Channeling
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Penyaluran pembiayaan yang bersumber dari dana mitra/bank penyerah
              modal. Lembaga bertindak sebagai pengelola administrasi dan teknis
              operasional.
            </p>
          </div>

          {/* Scheme 3: Fronting */}
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              Skema Fronting
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inisiasi pembiayaan awal menggunakan neraca internal sebelum
              dialihkan secara penuh atau sebagian kepada mitra institusi
              finansial strategis.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <div className="max-w-7xl mx-auto w-full text-center">
        <p className="text-xs text-slate-400">
          Gunakan menu navigasi untuk mengelola data master, simulasi
          kalkulator, atau memproses persetujuan berkas.
        </p>
      </div>
    </div>
  );
}
