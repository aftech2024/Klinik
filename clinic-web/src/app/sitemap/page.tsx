import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export const metadata = { title: "Peta Situs (Sitemap) — aftech Klinik" };

const PAGES = [
  { label: "Beranda Utama", href: "/" },
  { label: "Tentang aftech Klinik", href: "/about" },
  { label: "Daftar Layanan Medis", href: "/services" },
  { label: "Cari Dokter Spesialis", href: "/doctors" },
  { label: "Lokasi Cabang Klinik", href: "/branches" },
  { label: "Artikel & Edukasi", href: "/articles" },
  { label: "Promo & Diskon", href: "/promotions" },
  { label: "Tanya Jawab (FAQ)", href: "/faq" },
  { label: "Hubungi Call Center", href: "/contact" },
  { label: "Reservasi Janji Temu", href: "/booking" },
  { label: "Masuk Akun Portal", href: "/login" },
  { label: "Daftar Pasien Baru", href: "/register" },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-[#CCFBF1] rounded-2xl flex items-center justify-center text-[#0D9488]">
            <Compass size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A]">Peta Situs</h1>
            <p className="text-sm text-gray-500">Navigasi cepat ke seluruh halaman platform aftech Klinik</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {PAGES.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="p-4 rounded-2xl border border-gray-100 hover:border-[#0D9488] hover:bg-[#F0FDFA] transition-all flex items-center justify-between font-bold text-[#134E4A] group"
            >
              <span>{label}</span>
              <ArrowRight size={16} className="text-[#0D9488] group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
