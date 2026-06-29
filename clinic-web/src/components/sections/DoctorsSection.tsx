import Link from "next/link";

const doctors = [
  {
    name: "dr. Sarah Wijaya, Sp.PD",
    specialty: "Penyakit Dalam",
    patients: "2.400+",
    badge: "Senior",
    slug: "dr-sarah-wijaya",
    photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&q=80&fit=crop",
    available: true,
  },
  {
    name: "dr. Budi Santoso, Sp.A",
    specialty: "Anak (Pediatri)",
    patients: "1.800+",
    badge: "Expert",
    slug: "dr-budi-santoso",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&q=80&fit=crop",
    available: true,
  },
  {
    name: "dr. Rina Hartati, Sp.OG",
    specialty: "Kebidanan & Kandungan",
    patients: "3.100+",
    badge: "Senior",
    slug: "dr-rina-hartati",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&q=80&fit=crop&face",
    available: false,
  },
  {
    name: "drg. Putri Lestari",
    specialty: "Gigi & Mulut",
    patients: "1.200+",
    badge: "Specialist",
    slug: "drg-putri-lestari",
    photo: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&q=80&fit=crop",
    available: true,
  },
];

export default function DoctorsSection() {
  return (
    <section id="doctors" className="section-doctors">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Tim Medis</span>
          <h2 className="section-title">Meet Our Qualified Doctors</h2>
          <p className="section-desc">
            Dokter-dokter terbaik kami siap memberikan penanganan medis profesional dengan penuh ketulusan dan dedikasi.
          </p>
        </div>

        <div className="doctors-grid">
          {doctors.map((doc, i) => (
            <div key={doc.slug} className="doctor-card animate-in" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="doctor-card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={doc.photo} alt={doc.name} />
                <span className="doctor-card-badge">{doc.badge}</span>
              </div>
              <div className="doctor-card-body">
                <div className="doctor-card-name">{doc.name}</div>
                <div className="doctor-card-specialty">{doc.specialty}</div>
                <div className="doctor-card-info">
                  <span>👥</span>
                  <span>{doc.patients} Pasien</span>
                </div>
                <div className="doctor-card-info">
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: doc.available ? "#12B76A" : "#F04438",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: doc.available ? "#12B76A" : "#F04438" }}>
                    {doc.available ? "Tersedia Hari Ini" : "Tidak Tersedia"}
                  </span>
                </div>
                <div className="doctor-card-actions">
                  <Link href={`/booking?doctor=${doc.slug}`} className="btn-book-sm">
                    Book Now
                  </Link>
                  <Link href={`/doctors/${doc.slug}`} className="btn-profile-sm">
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-cta-link">
          <Link href="/doctors" className="btn-see-all">
            Lihat Semua Dokter →
          </Link>
        </div>
      </div>
    </section>
  );
}
