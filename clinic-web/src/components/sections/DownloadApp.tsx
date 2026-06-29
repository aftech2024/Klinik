import { Badge } from "@/components/ui/badge";
import { Smartphone, Bell, Calendar, FileText } from "lucide-react";

const FEATURES = [
  { icon: Calendar, text: "Booking appointment kapan saja" },
  { icon: Bell, text: "Notifikasi antrian real-time" },
  { icon: FileText, text: "Akses rekam medis digital" },
  { icon: Smartphone, text: "Konsultasi online (segera hadir)" },
];

export default function DownloadApp() {
  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-700 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-4">
                Mobile App
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Kesehatan di Genggaman Anda
              </h2>
              <p className="text-emerald-100 leading-relaxed">
                Download aplikasi aftech Klinik dan nikmati kemudahan booking dokter, cek antrian, dan akses rekam medis Anda kapan saja, di mana saja.
              </p>
            </div>

            <ul className="space-y-3">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-emerald-100">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-emerald-300" />
                  </div>
                  <span className="text-sm">{text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <div className="text-xs opacity-70">Download di</div>
                  <div className="font-semibold text-sm">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-900 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" aria-hidden>
                  <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.36.6 1.24 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
                </svg>
                <div>
                  <div className="text-xs opacity-70">Download di</div>
                  <div className="font-semibold text-sm">Google Play</div>
                </div>
              </a>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="w-64 h-96 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Smartphone size={64} className="text-white/40 mx-auto" />
                <p className="text-emerald-200 text-sm">App Preview</p>
                <p className="text-emerald-300 text-xs">Segera Hadir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
