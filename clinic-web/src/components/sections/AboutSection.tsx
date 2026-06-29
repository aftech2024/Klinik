import Link from "next/link";

export default function AboutSection() {
  return (
    <section id="about" className="section-about">
      <div className="section-inner">
        <div className="about-grid">
          {/* Visual */}
          <div className="about-visual">
            <div className="about-image-main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80"
                alt="Dokter aftech Klinik sedang memeriksa pasien"
              />
            </div>
            <div className="about-image-accent">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&q=80"
                alt="Fasilitas klinik modern"
              />
            </div>
            <div className="about-stat-card">
              <div className="stat-num">25K+</div>
              <div className="stat-label">Pasien Terlayani</div>
            </div>
          </div>

          {/* Content */}
          <div className="about-content">
            <span className="section-tag" style={{ width: "fit-content" }}>Tentang Kami</span>
            <h2>
              Appointment For Your<br />
              <span style={{ color: "#0D9488" }}>Problem Solution</span>
            </h2>
            <p>
              aftech Klinik adalah platform kesehatan digital modern yang mengintegrasikan
              seluruh proses operasional klinik. Kami hadir untuk memudahkan pasien mendapatkan
              layanan kesehatan berkualitas tinggi dengan teknologi terkini.
            </p>

            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">🩺</div>
                <div className="about-feature-text">
                  <h4>Dokter Berpengalaman</h4>
                  <p>50+ dokter spesialis dengan pengalaman bertahun-tahun di bidangnya masing-masing.</p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">🏥</div>
                <div className="about-feature-text">
                  <h4>11 Cabang Strategis</h4>
                  <p>Cabang tersebar di berbagai kota untuk memudahkan akses layanan kesehatan Anda.</p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">📱</div>
                <div className="about-feature-text">
                  <h4>Booking Online 24/7</h4>
                  <p>Jadwalkan janji temu kapan saja melalui website atau aplikasi mobile kami.</p>
                </div>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">🔬</div>
                <div className="about-feature-text">
                  <h4>Fasilitas Lengkap</h4>
                  <p>Laboratorium, farmasi, dan peralatan medis modern di setiap cabang klinik.</p>
                </div>
              </div>
            </div>

            <Link href="/about" className="btn-outline-teal">
              Explore More →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
