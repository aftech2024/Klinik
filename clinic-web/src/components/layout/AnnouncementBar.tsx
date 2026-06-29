"use client";
import { useState } from "react";
import Link from "next/link";
import { X, Megaphone } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 flex items-center justify-center gap-3 relative">
      <Megaphone size={12} className="text-emerald-400 flex-shrink-0" />
      <span className="text-slate-300">
        Diskon 30% Medical Check Up Premium — Berlaku s/d 31 Desember 2026.{" "}
        <Link href="/promotions" className="text-emerald-400 font-semibold hover:text-emerald-300 underline underline-offset-2">
          Lihat Promo
        </Link>
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
        aria-label="Tutup pengumuman"
      >
        <X size={13} />
      </button>
    </div>
  );
}
