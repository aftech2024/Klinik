import Link from "next/link";
import { Stethoscope, Smile, Baby, HeartPulse, Activity, Syringe, FlaskConical, ClipboardCheck, ArrowRight } from "lucide-react";

const services = [
  { icon: Stethoscope, name: "Praktek Umum", desc: "Konsultasi kesehatan umum untuk seluruh anggota keluarga", slug: "general-practice" },
  { icon: Smile, name: "Gigi & Mulut", desc: "Perawatan gigi lengkap oleh dokter gigi berpengalaman", slug: "dental" },
  { icon: Baby, name: "Anak (Pediatri)", desc: "Layanan khusus kesehatan anak dari bayi hingga remaja", slug: "pediatrics" },
  { icon: HeartPulse, name: "Kebidanan & Kandungan", desc: "Pemeriksaan kehamilan, USG, dan kesehatan reproduksi", slug: "obstetrics-gynecology" },
  { icon: Activity, name: "Penyakit Dalam", desc: "Penanganan diabetes, hipertensi, dan gangguan metabolik", slug: "internal-medicine" },
  { icon: Syringe, name: "Vaksinasi", desc: "Program vaksinasi lengkap untuk anak dan dewasa", slug: "vaccination" },
  { icon: FlaskConical, name: "Laboratorium", desc: "Pemeriksaan laboratorium lengkap dan hasil cepat", slug: "laboratory" },
  { icon: ClipboardCheck, name: "Medical Check Up", desc: "Paket pemeriksaan kesehatan menyeluruh Basic–Premium", slug: "medical-check-up" },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-services">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Layanan Kami</span>
          <h2 className="section-title">Layanan Kesehatan Lengkap</h2>
          <p className="section-desc">
            Kami menyediakan berbagai layanan kesehatan komprehensif yang ditangani oleh dokter-dokter terbaik dan berpengalaman.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.slug} className="service-card animate-in group" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="service-icon text-[#0D9488] group-hover:text-white transition-colors">
                  <Icon size={28} />
                </div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
                <Link href={`/services/${s.slug}`} className="service-link flex items-center gap-1">
                  Selengkapnya <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
