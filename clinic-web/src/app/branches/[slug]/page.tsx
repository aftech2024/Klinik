import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowLeft, Calendar, CheckCircle } from "lucide-react";
import { btn } from "@/lib/utils";

export default async function BranchDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let branch;
  try { branch = await api.branch(slug); } catch { return notFound(); }

  const hours = branch.operatingHours;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-emerald-800 to-teal-700 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/branches" className="inline-flex items-center gap-2 text-emerald-200 hover:text-white mb-6 text-sm">
            <ArrowLeft size={16} /> Semua Cabang
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{branch.name}</h1>
          <div className="flex items-center gap-2 text-emerald-200">
            <MapPin size={16} /> {branch.address}, {branch.city}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4">Kontak</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600"><Phone size={16} className="text-emerald-500" /> {branch.phone}</div>
              <div className="flex items-center gap-3 text-gray-600"><Mail size={16} className="text-emerald-500" /> {branch.email}</div>
              <div className="flex items-start gap-3 text-gray-600"><MapPin size={16} className="text-emerald-500 mt-0.5" /> {branch.address}, {branch.city}</div>
            </div>
          </div>

          {/* Facilities */}
          {branch.facilities.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-4">Fasilitas</h2>
              <div className="grid grid-cols-2 gap-3">
                {branch.facilities.map(f => (
                  <div key={f} className="flex items-center gap-2 text-gray-600 text-sm">
                    <CheckCircle size={16} className="text-emerald-500" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hours + CTA */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={16} className="text-emerald-500" /> Jam Operasional</h2>
            <div className="space-y-3 text-sm">
              {hours?.weekday && <div className="flex justify-between"><span className="text-gray-500">Senin–Jumat</span><span className="font-medium">{hours.weekday.open}–{hours.weekday.close}</span></div>}
              {hours?.saturday && <div className="flex justify-between"><span className="text-gray-500">Sabtu</span><span className="font-medium">{hours.saturday.open}–{hours.saturday.close}</span></div>}
              {hours?.sunday && <div className="flex justify-between"><span className="text-gray-500">Minggu</span><span className="font-medium">{hours.sunday.open}–{hours.sunday.close}</span></div>}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center">
            <h3 className="font-bold text-gray-900 mb-2">Booking di Cabang Ini</h3>
            <p className="text-gray-500 text-sm mb-4">Pilih dokter dan jadwal yang tersedia.</p>
            <Link href={`/booking?branch=${branch.slug}`} className={btn("primary", "md", "w-full justify-center")}>
              <Calendar size={16} /> Booking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
