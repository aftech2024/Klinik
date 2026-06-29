import { api, type Service } from "@/lib/api";
import Link from "next/link";
import { Stethoscope, ArrowRight, ShieldCheck, HeartPulse, Activity } from "lucide-react";

export const metadata = { title: "Layanan Kami — aftech Klinik" };

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  General: <Stethoscope className="text-[#0D9488]" size={24} />,
  Specialist: <HeartPulse className="text-[#0D9488]" size={24} />,
  Preventive: <ShieldCheck className="text-[#0D9488]" size={24} />,
  Diagnostic: <Activity className="text-[#0D9488]" size={24} />,
};

export default async function ServicesPage() {
  let services: Service[] = [];
  try { services = await api.services(); } catch { services = []; }

  const categories = [...new Set(services.map(s => s.category))];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-[#0F766E] via-[#0D9488]/60 to-[#F0FDFA] pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-widest border border-white/20 mb-5">Layanan Kami</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Layanan Kesehatan <span className="text-[#CCFBF1]">Komprehensif</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Temukan berbagai perawatan medis terbaik yang ditangani langsung oleh tim dokter spesialis berpengalaman dengan teknologi diagnostik modern.
          </p>
        </div>
      </div>

      {/* Services Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map((cat) => (
          <div key={cat} className="mb-16 last:mb-0">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] flex items-center justify-center shadow-sm">
                {CATEGORY_ICONS[cat] ?? <Stethoscope className="text-[#0D9488]" size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#134E4A]">{cat}</h2>
                <p className="text-sm text-gray-500">Pilihan layanan untuk kategori {cat.toLowerCase()}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.filter(s => s.category === cat).map(service => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group bg-white rounded-3xl p-7 border border-gray-100 hover:border-[#0D9488] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-14 h-14 bg-[#F0FDFA] group-hover:bg-[#0D9488] rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300">
                      <Stethoscope size={24} className="text-[#0D9488] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-bold text-[#134E4A] group-hover:text-[#0D9488] mb-3 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[#0D9488] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                    <span>Selengkapnya</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Bottom CTA Card */}
        <div className="mt-20 rounded-3xl bg-gradient-to-r from-[#134E4A] to-[#0D9488] p-10 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl sm:text-4xl font-extrabold mb-4 relative z-10">
            Butuh Konsultasi Mengenai Layanan Kami?
          </h3>
          <p className="text-teal-100 max-w-2xl mx-auto mb-8 relative z-10 text-lg">
            Hubungi tim medis kami atau jadwalkan pertemuan langsung dengan dokter pilihan Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            <Link
              href="/booking"
              className="bg-white text-[#134E4A] hover:bg-teal-50 px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              📅 Buat Janji Temu
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white/80 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              💬 Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
