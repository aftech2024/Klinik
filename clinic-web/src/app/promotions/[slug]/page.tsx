import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import { btn } from "@/lib/utils";

export default async function PromotionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let promos;
  try { promos = await api.promotions(); } catch { return notFound(); }
  const promo = promos.find(p => p.slug === slug);
  if (!promo) return notFound();

  const start = new Date(promo.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const end = new Date(promo.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const diff = Math.ceil((new Date(promo.endDate).getTime() - Date.now()) / 86400000);
  const urgency = diff <= 0 ? "Berakhir hari ini" : diff <= 7 ? `${diff} hari lagi` : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/promotions" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-600 mb-8 text-sm font-medium transition-colors">
          <ArrowLeft size={15} /> Semua Promo
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Banner */}
          <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-10 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-10 w-28 h-28 rounded-full bg-black/10" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                  <Tag size={11} /> Promo Spesial
                </span>
                {urgency && (
                  <span className="bg-red-500/80 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Clock size={10} /> {urgency}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{promo.title}</h1>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Validity */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl mb-6">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar size={16} className="text-emerald-600" />
              </div>
              <div className="text-sm">
                <div className="text-gray-400 text-xs font-medium">Periode Promo</div>
                <div className="font-semibold text-gray-900">{start} — {end}</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Detail Penawaran</h2>
              <p className="text-gray-700 leading-relaxed">{promo.description}</p>
            </div>

            <Link href="/booking" className={btn("primary", "lg", "w-full justify-center")}>
              Manfaatkan Promo Ini
            </Link>
            <p className="text-center text-xs text-gray-400 mt-3">*Syarat dan ketentuan berlaku</p>
          </div>
        </div>
      </div>
    </div>
  );
}
