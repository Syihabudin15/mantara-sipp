// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Glow Effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] left-[50%] h-[500px] w-[500px] -translate-x-[50%] rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="max-w-md space-y-6 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        {/* Icon Orang Tua / Cari Data */}
        <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.601Z"
            />
          </svg>
        </div>

        {/* Text Status */}
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-emerald-600 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-bold text-slate-800">
            Data atau Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Maaf, berkas, data pembiayaan, atau halaman aplikasi pensiun yang
            Anda cari tidak ada atau telah dipindahkan.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/profile"
            className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/10 transition-all hover:bg-emerald-700 hover:scale-[1.01] active:scale-[0.99]"
          >
            Kembali ke Halaman Aman
          </Link>
        </div>
      </div>
    </div>
  );
}
