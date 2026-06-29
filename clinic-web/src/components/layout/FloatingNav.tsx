"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Home, Zap, HeartPulse, Info, UserCheck, MessageSquareQuote, MapPin, Smartphone } from "lucide-react";

const SECTIONS = [
  { id: "home", label: "Beranda", icon: Home },
  { id: "quick", label: "Cara Kerja", icon: Zap },
  { id: "services", label: "Layanan", icon: HeartPulse },
  { id: "about", label: "Tentang", icon: Info },
  { id: "doctors", label: "Dokter", icon: UserCheck },
  { id: "testimonials", label: "Testimoni", icon: MessageSquareQuote },
  { id: "branches", label: "Cabang", icon: MapPin },
  { id: "cta", label: "Apps & Konsultasi", icon: Smartphone },
];

export default function FloatingNav() {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState("home");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveId(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  if (pathname !== "/") return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2.5 bg-white/80 backdrop-blur-md p-2 rounded-full border border-gray-200/80 shadow-2xl transition-all">
      {SECTIONS.map(({ id, label, icon: Icon }) => {
        const isActive = activeId === id;
        const isHovered = hoveredId === id;

        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`group relative flex items-center gap-2 rounded-full transition-all duration-300 ${
              isActive
                ? "bg-gradient-to-r from-[#0D9488] to-[#0F766E] text-white px-3.5 py-2 shadow-lg shadow-teal-500/25 scale-105"
                : "p-2.5 text-gray-400 hover:text-[#0D9488] hover:bg-[#F0FDFA]"
            }`}
            aria-label={label}
          >
            <Icon size={16} className="flex-shrink-0 transition-transform group-hover:scale-110" />
            
            {(isActive || isHovered) && (
              <span className={`text-xs font-bold whitespace-nowrap transition-all duration-300 overflow-hidden ${
                isActive ? "text-white max-w-[100px] opacity-100" : "absolute right-full mr-3 px-3 py-1.5 bg-[#134E4A] text-white rounded-xl shadow-md pointer-events-none"
              }`}>
                {label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
