import { ShieldCheck, Users, Award, Heart, Clock, CheckCircle2, Building2, Stethoscope } from "lucide-react";
import { STATS } from "@/lib/constants";
import Link from "next/link";

export const metadata = { title: "Tentang Kami — aftech Klinik" };

const VALUES = [
  { icon: Heart, title: "Pelayanan dengan Hati", desc: "Setiap pasien diperlakukan layaknya keluarga sendiri dengan penuh empati dan ketulusan." },
  { icon: ShieldCheck, title: "Privasi & Keamanan", desc: "Data rekam medis terintegrasi dengan standar keamanan enkripsi tertinggi untuk melindungi privasi Anda." },
  { icon: Award, title: "Standar Medis Terbaik", desc: "Didukung oleh dokter spesialis tersertifikasi dan peralatan diagnostik berteknologi modern." },
  { icon: Clock, title: "Layanan Siaga 24/7", desc: "Layanan kegawatdaruratan dan konsultasi siap melayani kebutuhan medis Anda kapan pun." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-[#0F766E] via-[#0D9488]/60 to-[#F0FDFA] pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-widest border border-white/20 mb-5">Profil Klinik</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Melayani Kesehatan <span className="text-[#CCFBF1]">Indonesia</span> Sejak 2010
          </h1>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            aftech Klinik adalah jaringan ekosistem kesehatan digital modern yang menghadirkan transformasi pelayanan medis bermutu tinggi, transparan, dan terintegrasi dari ujung ke ujung.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 mb-20">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl sm:text-5xl font-extrabold text-[#0D9488] mb-2 tracking-tight">{value}</div>
                <div className="text-gray-500 font-semibold text-sm sm:text-base">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-[#F0FDFA] to-white rounded-3xl p-8 sm:p-10 border border-[#CCFBF1] shadow-lg relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0D9488]/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] bg-[#CCFBF1] px-3 py-1 rounded-full mb-6 inline-block">Tujuan Kami</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] mb-4">Misi aftech Klinik</h2>
              <p className="text-gray-600 leading-relaxed text-base">
                Menyelenggarakan pelayanan kesehatan yang holistik, berpusat pada keselamatan pasien, dan ramah teknologi. Kami senantiasa mengembangkan inovasi medis agar pengobatan menjadi lebih presisi, efisien, dan bersahabat bagi setiap keluarga.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-teal-100/60 flex items-center gap-2 text-sm font-semibold text-[#134E4A]">
              <CheckCircle2 size={18} className="text-[#0D9488]" /> Berkomitmen pada keselamatan pasien
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#134E4A] to-[#0D9488] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-900 bg-teal-200 px-3 py-1 rounded-full mb-6 inline-block">Cita-Cita Kami</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-4">Visi aftech Klinik</h2>
              <p className="text-teal-100 leading-relaxed text-base">
                Menjadi barometer institusi pelayanan kesehatan digital terdepan di Indonesia yang dipercaya lintas generasi, serta menjadi pelopor terintegrasi antara klinik fisik dan layanan konsultasi digital.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-sm font-semibold text-teal-100">
              <CheckCircle2 size={18} className="text-teal-300" /> Tersebar di 11+ cabang strategis
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="section-tag mb-3">Nilai Inti</span>
          <h2 className="text-3xl font-extrabold text-[#134E4A]">Prinsip Pelayanan Kami</h2>
          <p className="text-gray-500 mt-2">Fondasi yang mendasari setiap interaksi dan tindakan medis di seluruh cabang aftech Klinik.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-[#0D9488] hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-between group">
              <div>
                <div className="w-16 h-16 bg-[#F0FDFA] group-hover:bg-[#0D9488] rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors duration-300 shadow-sm">
                  <Icon size={28} className="text-[#0D9488] group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-lg text-[#134E4A] group-hover:text-[#0D9488] transition-colors mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#F0FDFA] border border-[#CCFBF1] p-10 sm:p-14 text-center flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-left max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] mb-2">Ingin Bergabung Sebagai Pasien atau Dokter?</h3>
            <p className="text-gray-600 text-sm sm:text-base">Rasakan kemudahan registrasi janji temu online atau hubungi kami untuk informasi karir medis.</p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Link href="/booking" className="bg-[#0D9488] hover:bg-[#0F766E] text-white px-8 py-4 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all">
              📅 Booking Antrian
            </Link>
            <Link href="/branches" className="bg-white hover:bg-gray-50 text-[#134E4A] border border-gray-200 px-6 py-4 rounded-2xl font-bold transition-all">
              🏥 Lihat Lokasi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
