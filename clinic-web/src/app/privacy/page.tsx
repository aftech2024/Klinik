import { ShieldCheck } from "lucide-react";

export const metadata = { title: "Kebijakan Privasi — aftech Klinik" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-[#CCFBF1] rounded-2xl flex items-center justify-center text-[#0D9488]">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A]">Kebijakan Privasi</h1>
            <p className="text-sm text-gray-500">Terakhir diperbarui: Juni 2026</p>
          </div>
        </div>
        <div className="space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
          <p>
            Di <strong>aftech Klinik</strong>, kami sangat menjaga kerahasiaan dan keamanan data pribadi serta rekam medis elektronik Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi medis pasien.
          </p>
          <h2 className="text-lg font-bold text-[#134E4A]">1. Pengumpulan Data Informasi</h2>
          <p>
            Kami mengumpulkan informasi yang Anda berikan saat mendaftar antrian secara online maupun fisik, termasuk nama, nomor telepon, alamat email, dan riwayat keluhan medis.
          </p>
          <h2 className="text-lg font-bold text-[#134E4A]">2. Penggunaan Data Rekam Medis</h2>
          <p>
            Data medis semata-mata digunakan oleh tim dokter spesialis dan tenaga kesehatan kami untuk keperluan diagnosis, perawatan, pemberian resep obat, serta pemantauan riwayat kesehatan pasien di Portal Pasien.
          </p>
          <h2 className="text-lg font-bold text-[#134E4A]">3. Keamanan Enkripsi Data</h2>
          <p>
            Seluruh komunikasi data antara aplikasi pasien dan server pusat kami dilindungi dengan enkripsi tingkat tinggi (SSL/TLS) standar perbankan dan kesehatan digital Indonesia.
          </p>
        </div>
      </div>
    </div>
  );
}
