import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { User, Award, ArrowLeft, Calendar } from "lucide-react";
import { btn } from "@/lib/utils";

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doctor;
  try { doctor = await api.doctor(slug); } catch { return notFound(); }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-800 to-teal-700 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-6 text-sm">
            <ArrowLeft size={16} /> Semua Dokter
          </Link>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              {doctor.photoUrl ? (
                <Image src={doctor.photoUrl} alt={doctor.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={40} className="text-white/60" />
                </div>
              )}
            </div>
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-2">{doctor.specialty}</Badge>
              <h1 className="text-3xl font-bold text-white">{doctor.name}</h1>
              <div className="flex items-center gap-1 text-emerald-200 mt-1">
                <Award size={14} /> <span className="text-sm">{doctor.experience} tahun pengalaman</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang Dokter</h2>
          <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
        </div>

        <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Booking dengan {doctor.name}</h3>
          <p className="text-gray-500 mb-6">Pilih jadwal yang tersedia dan dapatkan pelayanan terbaik.</p>
          <Link href={`/booking?doctor=${doctor.slug}`} className={btn("primary", "lg")}>
            <Calendar size={18} /> Booking Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
