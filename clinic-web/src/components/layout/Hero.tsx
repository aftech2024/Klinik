import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, Users, MapPin } from "lucide-react";
import { CLINIC_NAME, CLINIC_TAGLINE, BOOKING_URL, STATS } from "@/lib/constants";
import { btn } from "@/lib/utils";

const TRUST_BADGES = [
  { icon: ShieldCheck, text: "Dokter Terverifikasi" },
  { icon: Clock, text: "Buka 7 Hari" },
  { icon: Users, text: "100K+ Pasien" },
  { icon: MapPin, text: "11 Cabang" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-teal-300 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30 hover:bg-emerald-500/20">
              ✦ Klinik Kesehatan Terpercaya
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {CLINIC_NAME}
              </h1>
              <p className="text-xl text-emerald-100 leading-relaxed max-w-lg">
                {CLINIC_TAGLINE}. Dokter spesialis berpengalaman, fasilitas modern, dan booking online yang mudah.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={BOOKING_URL} className={btn("primary", "lg", "bg-white text-emerald-800 hover:bg-emerald-50")}>
                Booking Appointment
              </Link>
              <Link href="/doctors" className={btn("outline", "lg")}>
                Cari Dokter
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TRUST_BADGES.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center gap-2 bg-white/10 rounded-xl p-3 text-center"
                >
                  <Icon size={20} className="text-emerald-300" />
                  <span className="text-white text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h3 className="text-white font-semibold text-lg mb-6">aftech Klinik dalam Angka</h3>
              <div className="grid grid-cols-2 gap-6">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">{value}</div>
                    <div className="text-emerald-200 text-sm">{label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-2xl">
                <p className="text-emerald-100 text-sm text-center">
                  "Kesehatan Anda adalah prioritas kami. Dengan teknologi modern dan dokter terpercaya, kami siap melayani Anda 24/7."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full fill-white">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
