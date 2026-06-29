const testimonials = [
  {
    name: "Ibu Ratna Dewi",
    role: "Pasien Umum",
    text: "Pelayanan di aftech Klinik sangat memuaskan. Dokternya ramah dan profesional. Proses booking juga sangat mudah melalui aplikasi.",
    rating: 5,
    initials: "RD",
  },
  {
    name: "Bapak Ahmad Fauzi",
    role: "Pasien Medical Check Up",
    text: "Saya sangat terbantu dengan sistem antrian online. Tidak perlu menunggu lama. Dokter juga menjelaskan hasil pemeriksaan dengan sangat detail.",
    rating: 5,
    initials: "AF",
  },
  {
    name: "Ibu Siti Aminah",
    role: "Pasien Vaksinasi",
    text: "Klinik yang bersih dan modern. Fasilitas lengkap dan harga terjangkau. Sudah menjadi klinik langganan seluruh keluarga kami selama 3 tahun.",
    rating: 5,
    initials: "SA",
  },
  {
    name: "Bapak Rudi Hermawan",
    role: "Pasien Spesialis",
    text: "Medical check up di sini sangat thorough. Hasil lab cepat keluar dan dokter langsung memberikan penjelasan yang mudah dimengerti.",
    rating: 4,
    initials: "RH",
  },
  {
    name: "dr. Maya Kusuma",
    role: "Pasien Umum",
    text: "Sebagai tenaga medis, saya terkesan dengan standar kebersihan dan profesionalisme staf di aftech Klinik. Highly recommended!",
    rating: 5,
    initials: "MK",
  },
  {
    name: "Ibu Dewi Sartika",
    role: "Pasien Anak",
    text: "Dokter anaknya sangat sabar dan ramah. Anak saya yang biasanya takut ke dokter, jadi tidak takut lagi setelah berobat di sini.",
    rating: 5,
    initials: "DS",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-testimonials">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Testimonial</span>
          <h2 className="section-title">What Customers Say About Us</h2>
          <p className="section-desc">
            Kepuasan pasien adalah prioritas kami. Berikut adalah pengalaman nyata dari pasien-pasien kami.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="testimonial-stars">
                {Array.from({ length: 5 }, (_, idx) => (
                  <span key={idx} style={{ color: idx < t.rating ? "#F79009" : "#E5E7EB" }}>★</span>
                ))}
              </div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-author-name">{t.name}</div>
                  <div className="testimonial-author-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
