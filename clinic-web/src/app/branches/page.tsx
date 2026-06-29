import { api, type Branch } from "@/lib/api";
import BranchesClient from "./BranchesClient";

export const metadata = { title: "Lokasi Cabang — aftech Klinik" };

export default async function BranchesPage() {
  let branches: Branch[] = [];
  try { branches = await api.branches(); } catch { branches = []; }

  const cities = [...new Set(branches.map(b => b.city))];

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-[#0F766E] via-[#0D9488]/60 to-[#F0FDFA] pt-32 pb-28 px-4 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-widest border border-white/20 mb-5">Jaringan Klinik Kami</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            {branches.length || 11} Cabang Tersebar di <span className="text-[#CCFBF1]">Indonesia</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Kunjungi cabang aftech Klinik terdekat di kota Anda. Fasilitas medis modern dan tenaga profesional siap melayani Anda di {cities.length || 6} kota besar.
          </p>
        </div>
      </div>

      {/* Interactive Client Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BranchesClient branches={branches} />
      </div>
    </div>
  );
}
