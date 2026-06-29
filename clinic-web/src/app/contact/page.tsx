import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from "lucide-react";
import { CLINIC_PHONE, CLINIC_EMAIL } from "@/lib/constants";

export const metadata = { title: "Hubungi Kami — aftech Klinik" };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-[#0F766E] via-[#0D9488]/60 to-[#F0FDFA] pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/20 text-white text-xs font-bold rounded-full uppercase tracking-widest border border-white/20 mb-5">Layanan Konsumen</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Hubungi <span className="text-[#CCFBF1]">Tim aftech Klinik</span>
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            Punya pertanyaan seputar jadwal dokter, layanan medis, atau kemitraan? Tim layanan pelanggan kami siap membantu Anda 24/7.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Contact Information Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl">
              <h2 className="text-2xl font-bold text-[#134E4A] mb-6 flex items-center gap-2">
                <MessageSquare className="text-[#0D9488]" />
                Informasi Kontak
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Telepon Call Center", value: CLINIC_PHONE, href: `tel:${CLINIC_PHONE}`, sub: "Aktif setiap hari 07:00 - 21:00" },
                  { icon: Mail, label: "Email Resmi", value: CLINIC_EMAIL, href: `mailto:${CLINIC_EMAIL}`, sub: "Balasan cepat dalam 24 jam" },
                  { icon: MapPin, label: "Kantor Pusat Operasional", value: "Jl. Sudirman No. 123, Kebayoran Baru, Jakarta Selatan", href: null, sub: "Gedung aftech Healthcare Center" },
                  { icon: Clock, label: "Jam Operasional Klinik", value: "Senin – Minggu: 07.00 – 21.00 WIB", href: null, sub: "IGD & Layanan Darurat 24 Jam" },
                ].map(({ icon: Icon, label, value, href, sub }) => (
                  <div key={label} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-[#F0FDFA] transition-colors border border-transparent hover:border-[#CCFBF1]">
                    <div className="w-12 h-12 bg-[#CCFBF1] rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <Icon size={20} className="text-[#0D9488]" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</div>
                      {href ? (
                        <a href={href} className="text-[#134E4A] font-bold text-base hover:text-[#0D9488] transition-colors block">{value}</a>
                      ) : (
                        <div className="text-[#134E4A] font-bold text-base">{value}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick FAQ Box */}
            <div className="bg-gradient-to-br from-[#134E4A] to-[#0D9488] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="font-bold text-xl mb-2">Butuh Bantuan Darurat?</h3>
              <p className="text-teal-100 text-sm leading-relaxed mb-6">
                Untuk kondisi darurat medis (Emergency Ambulans), silakan hubungi hotline langsung kami bebas pulsa.
              </p>
              <a
                href="tel:119"
                className="inline-flex items-center gap-2 bg-white text-[#134E4A] font-bold px-6 py-3 rounded-xl text-sm shadow-md hover:bg-teal-50 transition-colors"
              >
                🚨 Hotline Darurat 119
              </a>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A] mb-2">Kirim Pesan Langsung</h2>
              <p className="text-gray-500 text-sm">
                Sampaikan kritik, saran, atau pertanyaan Anda. Tim kami akan segera merespons ke alamat email Anda.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#134E4A] mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#134E4A] mb-2">Alamat Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#134E4A] mb-2">Nomor Telepon / WhatsApp</label>
                  <input
                    type="tel"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
                    placeholder="08123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#134E4A] mb-2">Subjek Pesan</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all">
                    <option value="Informasi Layanan">Informasi Layanan & Booking</option>
                    <option value="Keluhan Pasien">Keluhan & Saran Pelayanan</option>
                    <option value="Kemitraan">Kerja Sama & Kemitraan Bisnis</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#134E4A] mb-2">Isi Pesan Anda</label>
                <textarea
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white resize-none transition-all"
                  placeholder="Tuliskan secara detail apa yang ingin Anda tanyakan..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base"
              >
                <Send size={18} /> Kirim Pesan Sekarang
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
