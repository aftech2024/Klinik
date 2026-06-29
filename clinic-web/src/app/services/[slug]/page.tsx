import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Stethoscope, ArrowLeft, Calendar } from "lucide-react";
import { btn } from "@/lib/utils";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let service;
  try { service = await api.service(slug); } catch { return notFound(); }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-800 to-teal-700 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/services" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-6 text-sm">
            <ArrowLeft size={16} /> Semua Layanan
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Stethoscope size={28} className="text-white" />
            </div>
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-2">{service.category}</Badge>
              <h1 className="text-3xl font-bold text-white">{service.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang Layanan Ini</h2>
          <p className="text-gray-600 leading-relaxed">{service.description}</p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Siap Booking {service.name}?</h3>
          <p className="text-gray-500 mb-6">Booking sekarang dan dapatkan pelayanan terbaik dari dokter kami.</p>
          <Link href={`/booking?service=${service.slug}`} className={btn("primary", "lg")}>
            <Calendar size={18} /> Booking Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
