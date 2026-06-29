import { api, type Promotion } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";

export const metadata = { title: "Promo & Diskon — aftech Klinik" };

const ACCENTS = [
  { grad: "from-emerald-500 to-teal-500", badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  { grad: "from-blue-500 to-indigo-500", badge: "bg-blue-50 text-blue-700", dot: "bg-blue-500" },
  { grad: "from-violet-500 to-purple-500", badge: "bg-violet-50 text-violet-700", dot: "bg-violet-500" },
  { grad: "from-amber-500 to-orange-400", badge: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  { grad: "from-rose-500 to-pink-500", badge: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
];

function daysLeft(endDate: string) {
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
  if (diff <= 0) return "Berakhir hari ini";
  if (diff <= 7) return `${diff} hari lagi`;
  return null;
}

export default async function PromotionsPage() {
  let promotions: Promotion[] = [];
  try { promotions = await api.promotions(); } catch { promotions = []; }

  const [featured, ...rest] = promotions;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-teal-400 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-300 blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-2 rounded-full mb-5 border border-white/20">
            <Tag size={14} /> Penawaran Eksklusif
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">Hemat Lebih Banyak</h1>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto">Promo dan diskon spesial aftech Klinik untuk Anda dan keluarga.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Featured card */}
        {featured && (
          <div className="mb-8">
            <Link
              href={`/promotions/${featured.slug}`}
              className="group relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col sm:flex-row gap-6 p-8 sm:p-10"
            >
              <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10" />
              <div className="absolute bottom-0 left-32 w-40 h-40 rounded-full bg-black/5" />

              <div className="flex-1 relative z-10 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                    Promo Unggulan
                  </span>
                  {daysLeft(featured.endDate) && (
                    <span className="bg-red-500/80 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock size={10} /> {daysLeft(featured.endDate)}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{featured.title}</h2>
                <p className="text-emerald-100 leading-relaxed max-w-lg">{featured.description}</p>
                <div className="text-emerald-200 text-sm">
                  Berlaku s/d {new Date(featured.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              <div className="flex items-end sm:items-center relative z-10">
                <div className="bg-white text-emerald-700 font-bold px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 group-hover:gap-3 transition-all whitespace-nowrap">
                  Klaim Promo <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((promo, i) => {
              const accent = ACCENTS[(i + 1) % ACCENTS.length];
              const urgency = daysLeft(promo.endDate);
              const endStr = new Date(promo.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

              return (
                <Link
                  key={promo.id}
                  href={`/promotions/${promo.slug}`}
                  className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${accent.grad}`} />
                  <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-5 bg-gradient-to-br from-gray-900 to-gray-700" />

                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${accent.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                        Diskon Spesial
                      </div>
                      {urgency && (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full font-medium flex items-center gap-1 flex-shrink-0">
                          <Clock size={10} /> {urgency}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-emerald-600 transition-colors">
                        {promo.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{promo.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-400">s/d {endStr}</span>
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Lihat <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {promotions.length === 0 && (
          <div className="text-center py-20 text-gray-400">Belum ada promo tersedia.</div>
        )}
      </div>
    </div>
  );
}
