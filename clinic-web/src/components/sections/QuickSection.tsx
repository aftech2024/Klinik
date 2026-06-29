import { UserCheck, Calendar, Award } from "lucide-react";

const quickItems = [
  {
    icon: UserCheck,
    title: "Find Doctor",
    desc: "Temukan dokter terbaik sesuai spesialisasi dan cabang klinik yang Anda inginkan dengan mudah.",
  },
  {
    icon: Calendar,
    title: "Schedule Appointment",
    desc: "Jadwalkan janji temu dengan dokter pilihan Anda kapan saja dan di mana saja secara online.",
  },
  {
    icon: Award,
    title: "Get Your Solution",
    desc: "Dapatkan solusi kesehatan terbaik dari dokter berpengalaman kami di seluruh cabang aftech Klinik.",
  },
];

export default function QuickSection() {
  return (
    <section id="quick" className="section-quick">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-tag">Cara Kerja</span>
          <h2 className="section-title">Quick Solution For Scheduling<br />With Doctor</h2>
          <p className="section-desc">
            Proses pemesanan yang mudah dan cepat. Cukup 3 langkah untuk mendapatkan layanan kesehatan terbaik.
          </p>
        </div>

        <div className="quick-cards">
          {quickItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="quick-card animate-in group" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="quick-card-icon text-[#0D9488] group-hover:text-white transition-colors">
                  <Icon size={32} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
