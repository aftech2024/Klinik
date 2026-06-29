"use client";
import { useState } from "react";
import { CheckCircle2, Smartphone, Send, Star, ShieldAlert, Clock, Sparkles } from "lucide-react";

export default function CTABannerSection() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "Praktek Umum",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: "", phone: "", service: "Praktek Umum", message: "" });
    }, 1000);
  };

  return (
    <section id="cta" className="relative bg-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-gray-900">

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Mobile App Download */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 text-xs font-bold uppercase tracking-wider text-[#0D9488]">
              <Sparkles size={14} /> Aplikasi Mobile Resmi aftech
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-gray-900">
              Layanan Kesehatan Medis <br />
              <span className="text-[#0D9488] underline decoration-[#14B8A6] decoration-4 underline-offset-8">Dalam Genggaman</span>
            </h2>

            <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl">
              Unduh aplikasi mudah alih aftech Klinik untuk membuat janji temu dokter tanpa antrean, berkonsultasi video 24/7, serta mengakses riwayat rekam medis digital keluarga Anda secara aman.
            </p>

            {/* Feature Highlights */}
            <div className="space-y-4 pt-2">
              {[
                "Daftar antrean online real-time dari rumah",
                "Riwayat rekam medis & resep obat terpadu 100% aman",
                "Notifikasi jadwal dokter & pengingat konsumsi obat",
              ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm sm:text-base text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[#0D9488] shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* App Store / Google Play Buttons */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              {/* iOS Store Button */}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Mengunduh aplikasi iOS aftech Klinik dari App Store..."); }}
                className="flex items-center gap-3.5 bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl border border-white/20 shadow-xl hover:scale-105 transition-all group"
              >
                <svg className="w-8 h-8 fill-current group-hover:text-[#CCFBF1] transition-colors" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.35c.64-.78 1.08-1.86.96-2.94-.92.04-2.04.62-2.69 1.39-.58.68-1.09 1.79-.95 2.85 1.03.08 2.05-.52 2.68-1.3" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-gray-400 font-medium">Download on the</div>
                  <div className="text-base font-bold tracking-wide">App Store</div>
                </div>
              </a>

              {/* Android Play Store Button */}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); alert("Mengunduh aplikasi Android aftech Klinik dari Google Play..."); }}
                className="flex items-center gap-3.5 bg-black hover:bg-gray-900 text-white px-6 py-3.5 rounded-2xl border border-white/20 shadow-xl hover:scale-105 transition-all group"
              >
                <svg className="w-7 h-7 fill-current group-hover:text-[#14B8A6] transition-colors" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.996 1.996 0 0 1-.61-1.43V3.244c0-.56.23-1.07.61-1.43zM15.208 13.415l2.072 2.072-12.213 7.051 10.141-9.123zM18.667 11.41l3.056 1.765a1.5 1.5 0 0 1 0 2.598l-3.056 1.765-1.458-1.458 1.458-4.67zM15.208 10.585L5.067 1.462l12.213 7.051-2.072 2.072z" />
                </svg>
                <div className="text-left leading-tight">
                  <div className="text-[10px] text-gray-400 font-medium">GET IT ON</div>
                  <div className="text-base font-bold tracking-wide">Google Play</div>
                </div>
              </a>
            </div>

            {/* Rating Badge */}
            <div className="pt-2 flex items-center gap-3 text-sm text-gray-500">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="font-semibold text-gray-800">4.9/5 Rating</span>
              <span>•</span>
              <span>50,000+ Unduhan</span>
            </div>
          </div>

          {/* Right Column: Consultation Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-8 sm:p-10 text-gray-900 shadow-xl relative overflow-hidden border border-gray-200">
              {/* Subtle top decoration bar */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#14B8A6] via-[#0D9488] to-[#0F766E]" />

              {submitted ? (
                <div className="py-12 text-center space-y-5">
                  <div className="w-16 h-16 bg-teal-100 text-[#0D9488] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Permintaan Konsultasi Terkirim!</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                    Terima kasih telah menghubungi kami. Tim dokter atau staf customer care aftech Klinik akan menghubungi Anda melalui WhatsApp/Telepon dalam waktu <span className="font-semibold text-[#0D9488]">kurang dari 15 menit</span>.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#0D9488] hover:bg-[#0F766E] text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    Kirim Permintaan Lainnya
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0D9488] bg-teal-50 px-3 py-1 rounded-full">
                      Konsultasi Langsung
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
                      Hubungi Tim Medis Kami
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Isi formulir di bawah ini untuk konsultasi cepat atau pertanyaan seputar keluhan medis Anda.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Budi Santoso"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          No. WhatsApp / HP
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0812-xxxx-xxxx"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                          Layanan Medis
                        </label>
                        <select
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
                        >
                          <option value="Praktek Umum">Praktek Umum</option>
                          <option value="Gigi & Mulut">Gigi & Mulut</option>
                          <option value="Anak & Pediatri">Anak & Pediatri</option>
                          <option value="Laboratorium">Laboratorium</option>
                          <option value="Medical Check Up">Medical Check Up</option>
                          <option value="Vaksinasi">Vaksinasi</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                        Keluhan / Pertanyaan
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Jelaskan keluhan atau pertanyaan Anda secara singkat..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 bg-gradient-to-r from-[#0D9488] to-[#0F766E] hover:from-[#0F766E] hover:to-[#134E4A] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-base group"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Mengirim Permintaan...</span>
                        </>
                      ) : (
                        <>
                          <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                          <span>Kirim Permintaan Konsultasi</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Clock size={14} className="text-[#0D9488]" />
                    <span>Respon cepat aktif setiap hari (08:00 - 22:00 WIB)</span>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
