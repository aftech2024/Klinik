import Link from "next/link";
import { api, type Branch } from "@/lib/api";
import { Building2, MapPin, Phone, Clock, ArrowRight } from "lucide-react";

const fallbackBranches = [
  {
    name: "aftech Klinik Jakarta Selatan",
    city: "Jakarta Selatan",
    address: "Jl. Sudirman No. 123, Kebayoran Baru",
    phone: "021-5551234",
    hours: "Senin–Jumat 07.00–21.00",
    slug: "aftech-klinik-jakarta-selatan",
  },
  {
    name: "aftech Klinik Bekasi",
    city: "Bekasi",
    address: "Jl. Ahmad Yani No. 45, Bekasi Timur",
    phone: "021-5552345",
    hours: "Senin–Jumat 07.00–21.00",
    slug: "aftech-klinik-bekasi",
  },
  {
    name: "aftech Klinik Tangerang",
    city: "Tangerang",
    address: "Jl. MH Thamrin No. 78, Tangerang Kota",
    phone: "021-5553456",
    hours: "Senin–Sabtu 08.00–20.00",
    slug: "aftech-klinik-tangerang",
  },
  {
    name: "aftech Klinik Depok",
    city: "Depok",
    address: "Jl. Margonda Raya No. 200, Depok",
    phone: "021-5554567",
    hours: "Senin–Jumat 07.00–21.00",
    slug: "aftech-klinik-depok",
  },
  {
    name: "aftech Klinik Bogor",
    city: "Bogor",
    address: "Jl. Pajajaran No. 55, Bogor Tengah",
    phone: "0251-8551234",
    hours: "Senin–Sabtu 08.00–20.00",
    slug: "aftech-klinik-bogor",
  },
  {
    name: "aftech Klinik Bandung",
    city: "Bandung",
    address: "Jl. Dago No. 88, Bandung Kota",
    phone: "022-5551234",
    hours: "Senin–Jumat 08.00–20.00",
    slug: "aftech-klinik-bandung",
  },
];

function formatHours(hours?: Branch["operatingHours"]) {
  if (!hours || !hours.weekday) return "Senin–Jumat 07.00–21.00";
  return `Senin–Jumat ${hours.weekday.open}–${hours.weekday.close}`;
}

export default async function BranchesSection() {
  let displayBranches = fallbackBranches;
  try {
    const data = await api.branches();
    if (Array.isArray(data) && data.length > 0) {
      displayBranches = data.map((b) => ({
        name: b.name,
        city: b.city || "Indonesia",
        address: b.address,
        phone: b.phone || "021-5550000",
        hours: formatHours(b.operatingHours),
        slug: b.slug,
      }));
    }
  } catch {
    // Gunakan fallback data jika server belum merespon
  }

  return (
    <section id="branches" className="section-branches">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Lokasi Kami</span>
          <h2 className="section-title">Cabang Klinik di Seluruh Indonesia</h2>
          <p className="section-desc">
            Terhubung langsung dengan data cabang dari menu Admin. Kami hadir untuk memastikan layanan kesehatan terbaik mudah dijangkau.
          </p>
        </div>

        <div className="branches-grid">
          {displayBranches.map((b, i) => (
            <div key={b.slug || i} className="branch-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="branch-card-header">
                <div className="branch-icon">
                  <Building2 size={24} className="transition-colors" />
                </div>
                <div>
                  <h3>{b.name}</h3>
                  <div className="branch-card-city">{b.city}</div>
                </div>
              </div>

              <div className="branch-info">
                <div className="branch-info-row">
                  <span className="branch-info-icon">
                    <MapPin size={16} />
                  </span>
                  <span>{b.address}</span>
                </div>
                <div className="branch-info-row">
                  <span className="branch-info-icon">
                    <Phone size={16} />
                  </span>
                  <span>{b.phone}</span>
                </div>
                <div className="branch-info-row">
                  <span className="branch-info-icon">
                    <Clock size={16} />
                  </span>
                  <span>{b.hours}</span>
                </div>
              </div>

              <Link href={`/branches/${b.slug}`} className="btn-branch flex items-center justify-center gap-1.5">
                Lihat Detail <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        <div className="section-cta-link">
          <Link href="/branches" className="btn-see-all flex items-center justify-center gap-2 mx-auto">
            Lihat Semua Cabang <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
