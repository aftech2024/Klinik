import Link from "next/link";
import { api, type Promotion } from "@/lib/api";
import { ArrowRight, Clock } from "lucide-react";

const ACCENTS = [
  { from: "from-emerald-500", to: "to-teal-500", badge: "bg-emerald-500", soft: "bg-emerald-50 text-emerald-700" },
  { from: "from-blue-500", to: "to-indigo-500", badge: "bg-blue-500", soft: "bg-blue-50 text-blue-700" },
  { from: "from-violet-500", to: "to-purple-500", badge: "bg-violet-500", soft: "bg-violet-50 text-violet-700" },
  { from: "from-amber-500", to: "to-orange-400", badge: "bg-amber-500", soft: "bg-amber-50 text-amber-700" },
];

function daysLeft(endDate: string) {
  const diff = Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);
  if (diff <= 0) return "Berakhir hari ini";
  if (diff <= 7) return `${diff} hari lagi`;
  return null;
}

function PromotionCard({ promo, index }: { promo: Promotion; index: number }) {
  const accent = ACCENTS[index % ACCENTS.length];
  const endStr = new Date(promo.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  const urgency = daysLeft(promo.endDate);

  return (
    <Link
      href={`/promotions/${promo.slug}`}
      className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* Gradient band */}
      <div className={`h-1.5 bg-gradient-to-r ${accent.from} ${accent.to}`} />

      {/* Decorative circle */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${accent.from} ${accent.to} opacity-[0.07]`} />

      <div className="p-6 flex flex-col flex-1 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${accent.soft}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${accent.badge}`} />
            Promo Spesial
          </div>
          {urgency && (
            <div className="flex items-center gap-1 text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full flex-shrink-0">
              <Clock size={10} /> {urgency}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-emerald-600 transition-colors">
            {promo.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
            {promo.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">s/d {endStr}</span>
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
            Lihat Promo <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ promo }: { promo: Promotion }) {
  const urgency = daysLeft(promo.endDate);
  const endStr = new Date(promo.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Link
      href={`/promotions/${promo.slug}`}
      className="group relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 col-span-full lg:col-span-2 p-8 flex flex-col justify-between min-h-48"
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
      <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-white/5" />

      <div className="relative z-10 space-y-3">
        {urgency && (
          <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Clock size={11} /> {urgency}
          </div>
        )}
        <h3 className="text-2xl font-bold text-white leading-tight max-w-md">{promo.title}</h3>
        <p className="text-emerald-100 text-sm leading-relaxed max-w-lg line-clamp-2">{promo.description}</p>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-6">
        <span className="text-emerald-200 text-xs">Berlaku s/d {endStr}</span>
        <div className="flex items-center gap-2 bg-white text-emerald-700 font-semibold text-sm px-4 py-2 rounded-full group-hover:gap-3 transition-all">
          Klaim Sekarang <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}

export default async function PromotionsSection() {
  let promotions: Promotion[] = [];
  try { promotions = await api.promotions(); } catch { promotions = []; }

  if (promotions.length === 0) return null;

  const [featured, ...rest] = promotions;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider mb-2">Penawaran Terbatas</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Promo Spesial untuk Anda</h2>
          </div>
          <Link href="/promotions" className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 font-medium transition-colors">
            Semua promo <ArrowRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <FeaturedCard promo={featured} />
          {rest.slice(0, 4).map((promo, i) => (
            <PromotionCard key={promo.id} promo={promo} index={i + 1} />
          ))}
        </div>

        <div className="sm:hidden text-center mt-8">
          <Link href="/promotions" className="inline-flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
            Lihat Semua Promo <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
