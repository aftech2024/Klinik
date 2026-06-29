import { FileText } from "lucide-react";

export const metadata = { title: "Syarat & Ketentuan — aftech Klinik" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xl">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-[#CCFBF1] rounded-2xl flex items-center justify-center text-[#0D9488]">
            <FileText size={24} />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#134E4A]">Syarat & Ketentuan Layanan</h1>
            <p className="text-sm text-gray-500">Berlaku untuk seluruh pasien dan pengguna portal aftech Klinik</p>
          </div>
        </div>
        <div className="space-y-6 text-gray-600 leading-relaxed text-sm sm:text-base">
          <p>
            Dengan mengakses dan menggunakan sistem pendaftaran online aftech Klinik, Anda menyetujui syarat dan ketentuan operasional pelayanan medis kami di bawah ini.
          </p>
          <h2 className="text-lg font-bold text-[#134E4A]">1. Reservasi Janji Temu</h2>
          <p>
            Pasien diharapkan hadir di cabang klinik minimal 15 menit sebelum waktu konsultasi yang telah dijadwalkan untuk proses verifikasi data antrian.
          </p>
          <h2 className="text-lg font-bold text-[#134E4A]">2. Pembatalan Jadwal</h2>
          <p>
            Pembatalan atau perubahan jam konsultasi dapat dilakukan melalui Portal Pasien atau menghubungi Call Center minimal 2 jam sebelum jadwal pemeriksaan.
          </p>
          <h2 className="text-lg font-bold text-[#134E4A]">3. Layanan Kegawatdaruratan (IGD)</h2>
          <p>
            Pendaftaran online ditujukan untuk rawat jalan / konsultasi reguler. Untuk kondisi kritis atau darurat medis, harap langsung menuju IGD terdekat atau hubungi hotline ambulans 119.
          </p>
        </div>
      </div>
    </div>
  );
}
