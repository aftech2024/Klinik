"use client";
import Link from "next/link";
import { CalendarCheck, Stethoscope, Play } from "lucide-react";

export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        {/* LEFT: Content */}
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Layanan Kesehatan Terpercaya
          </div>

          <h1 className="hero-title">
            Special Care and{" "}
            <span className="highlight">Best Treatment</span>{" "}
            <span className="inline-block align-middle ml-1">
              <Stethoscope size={38} className="text-[#0D9488] inline-block animate-pulse" />
            </span>
          </h1>

          <p className="hero-desc">
            aftech Klinik hadir dengan 11 cabang, 50+ dokter spesialis, dan
            teknologi modern untuk memberikan pelayanan kesehatan terbaik bagi
            Anda dan keluarga.
          </p>

          <div className="hero-actions">
            <Link href="/booking" className="btn-primary-hero flex items-center gap-2">
              <CalendarCheck size={20} className="shrink-0 text-white" />
              <span>Book Appointment</span>
            </Link>
            <Link href="/services" className="btn-secondary-hero flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center text-[#0D9488]">
                <Play size={12} className="fill-current ml-0.5" />
              </span>
              <span>Lihat Layanan</span>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">11+</span>
              <span className="hero-stat-label">Cabang Klinik</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">50+</span>
              <span className="hero-stat-label">Dokter Spesialis</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">25K+</span>
              <span className="hero-stat-label">Pasien Puas</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Visual (Cutout Doctor & Floating Elements blended into background) */}
        {/* RIGHT: Visual (Cutout Doctor & Floating Elements blended into background) */}
        <div className="hero-visual relative">
          {/* Cyan blur background glow exactly as requested */}
          <div className="absolute left-8 top-24 -z-10 h-40 w-40 rounded-full bg-cyan-300/40 blur-3xl" />
          <div className="absolute right-8 bottom-20 -z-10 h-48 w-48 rounded-full bg-teal-300/30 blur-3xl" />

          {/* Floating geometric spheres matching Picture 1 style */}
          <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0F766E] shadow-lg animate-bounce pointer-events-none" style={{ top: '18%', left: '4%', animationDuration: '4s' }} />
          <div className="absolute w-6 h-6 rounded-full border-3 border-[#14B8A6] bg-transparent pointer-events-none" style={{ top: '32%', left: '28%' }} />
          <div className="absolute w-10 h-10 rounded-full bg-[#2DD4BF] shadow-md pointer-events-none" style={{ bottom: '28%', right: '2%' }} />
          <div className="absolute w-5 h-5 rounded-full bg-[#0D9488] pointer-events-none" style={{ top: '15%', right: '15%' }} />

          {/* Doctor Cutout Figure */}
          <div className="hero-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/female.png"
              alt="Dokter aftech Klinik"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
