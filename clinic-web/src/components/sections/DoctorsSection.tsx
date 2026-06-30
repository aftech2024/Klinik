import Link from "next/link";
import DoctorPhoto from "@/components/DoctorPhoto";
import { api } from "@/lib/api";

export default async function DoctorsSection() {
  let doctors: Awaited<ReturnType<typeof api.doctors>> = [];
  try { doctors = await api.doctors(); } catch { doctors = []; }
  const shown = doctors.slice(0, 4);

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
          {shown.map((doc, i) => (
            <div key={doc.id} className="doctor-card animate-in" style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="doctor-card-img">
                <DoctorPhoto photoUrl={doc.photoUrl} name={doc.name} />
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
                <div className="doctor-card-actions">
                  <Link href={`/booking?doctor=${doc.slug}`} className="btn-book-sm">Book Now</Link>
                  <Link href={`/doctors/${doc.slug}`} className="btn-profile-sm">Profile</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-cta-link">
          <Link href="/doctors" className="btn-see-all">Lihat Semua Dokter →</Link>
        </div>
      </div>
    </section>
  );
}
