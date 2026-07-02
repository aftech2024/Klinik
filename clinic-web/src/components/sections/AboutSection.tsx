import Link from "next/link";
import { Stethoscope, Building2, CalendarClock, FlaskConical, ArrowRight, ShieldCheck, Star } from "lucide-react";

const FEATURES = [
  { icon: Stethoscope, title: "Dokter Berpengalaman", desc: "50+ dokter spesialis dengan pengalaman bertahun-tahun di bidangnya masing-masing." },
  { icon: Building2, title: "11 Cabang Strategis", desc: "Cabang tersebar di berbagai kota untuk memudahkan akses layanan kesehatan Anda." },
  { icon: CalendarClock, title: "Booking Online 24/7", desc: "Jadwalkan janji temu kapan saja melalui website atau aplikasi mobile kami." },
  { icon: FlaskConical, title: "Fasilitas Lengkap", desc: "Laboratorium, farmasi, dan peralatan medis modern di setiap cabang klinik." },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-about">
      <div className="section-inner">
        <div className="about-grid">
          {/* Visual */}
          <div className="about-visual">
            <div className="about-visual-glow" />
            <div className="about-image-main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80"
                alt="Dokter aftech Klinik sedang memeriksa pasien"
              />
            </div>
            <div className="about-image-accent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80"
                alt="Fasilitas klinik modern"
              />
            </div>

            <div className="about-badge about-badge-stat">
              <div className="about-badge-icon"><ShieldCheck size={20} /></div>
              <div>
                <div className="about-badge-num">25K+</div>
                <div className="about-badge-label">Pasien Terlayani</div>
              </div>
            </div>

            <div className="about-badge about-badge-rating">
              <div className="about-badge-stars">
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <span>4.9</span>
              </div>
              <div className="about-badge-label">Rating Pasien</div>
            </div>
          </div>

          {/* Content */}
          <div className="about-content">
            <span className="section-tag" style={{ width: "fit-content" }}>Tentang Kami</span>
            <h2 className="about-heading">
              Solusi Kesehatan Modern,<br />
              <span className="about-heading-accent">Dalam Satu Platform</span>
            </h2>
            <p className="about-lead">
              aftech Klinik adalah platform kesehatan digital yang mengintegrasikan seluruh
              proses operasional klinik — dari booking, antrean, hingga rekam medis — untuk
              memberikan layanan berkualitas tinggi dengan teknologi terkini.
            </p>

            <div className="about-features">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="about-feature">
                  <div className="about-feature-icon">
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <div className="about-feature-text">
                    <h4>{title}</h4>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className="btn-outline-teal">
              Pelajari Lebih Lanjut <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
