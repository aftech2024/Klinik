'use client';
import { useEffect, useState } from "react";
import Link from "next/link";
import DoctorPhoto from "@/components/DoctorPhoto";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type Doctor = {
  id: string; name: string; specialty: string;
  photoUrl: string | null; bio: string | null;
  experience: number; isActive: boolean; slug: string;
};

// Fallback shown while loading or on fetch error
const FALLBACK: Doctor[] = [
  { id: '1', name: 'dr. Sarah Wijaya, Sp.PD', specialty: 'Penyakit Dalam', photoUrl: null, bio: null, experience: 12, isActive: true, slug: 'dr-sarah-wijaya' },
  { id: '2', name: 'dr. Budi Santoso, Sp.A', specialty: 'Anak (Pediatri)', photoUrl: null, bio: null, experience: 8, isActive: true, slug: 'dr-budi-santoso' },
  { id: '3', name: 'dr. Rina Hartati, Sp.OG', specialty: 'Kebidanan & Kandungan', photoUrl: null, bio: null, experience: 15, isActive: false, slug: 'dr-rina-hartati' },
  { id: '4', name: 'drg. Putri Lestari', specialty: 'Gigi & Mulut', photoUrl: null, bio: null, experience: 6, isActive: true, slug: 'drg-putri-lestari' },
];

export default function DoctorsSection() {
  const [doctors, setDoctors] = useState<Doctor[]>(FALLBACK);

  useEffect(() => {
    fetch(`${API_BASE}/api/doctors?limit=4`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const list: Doctor[] = Array.isArray(data) ? data : (data.data ?? []);
        if (list.length > 0) setDoctors(list.slice(0, 4));
      })
      .catch(() => {});
  }, []);

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
                <div className="doctor-card-info">
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: doc.isActive ? '#12B76A' : '#F04438', display: 'inline-block' }} />
                  <span style={{ color: doc.isActive ? '#12B76A' : '#F04438' }}>
                    {doc.isActive ? 'Tersedia Hari Ini' : 'Tidak Tersedia'}
                  </span>
                </div>
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
