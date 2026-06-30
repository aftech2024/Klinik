import Link from "next/link";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string | null;
  bio: string | null;
  experience: number;
  isActive: boolean;
  slug: string;
};

async function fetchDoctors(): Promise<Doctor[]> {
  try {
    const res = await fetch(`${API_BASE}/api/doctors?limit=4`, {
      next: { revalidate: 300 }, // revalidate every 5 minutes
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 4) : (data.data ?? []).slice(0, 4);
  } catch {
    return [];
  }
}

export default async function DoctorsSection() {
  const doctors = await fetchDoctors();

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
            <div key={doc.id} className="doctor-card animate-in" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="doctor-card-img">
                {doc.photoUrl ? (
                  <Image
                    src={doc.photoUrl}
                    alt={doc.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                    👨‍⚕️
                  </div>
                )}
              </div>
              <div className="doctor-card-body">
                <div className="doctor-card-name">{doc.name}</div>
                <div className="doctor-card-specialty">{doc.specialty}</div>
                {doc.experience > 0 && (
                  <div className="doctor-card-info">
                    <span>🏅</span>
                    <span>{doc.experience} tahun pengalaman</span>
                  </div>
                )}
                <div className="doctor-card-info">
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: doc.isActive ? "#12B76A" : "#F04438",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ color: doc.isActive ? "#12B76A" : "#F04438" }}>
                    {doc.isActive ? "Tersedia Hari Ini" : "Tidak Tersedia"}
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
