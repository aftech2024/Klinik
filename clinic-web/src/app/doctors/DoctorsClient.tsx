"use client";

import { useState } from "react";
import type { Doctor } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { Award, ArrowRight, Calendar, Search } from "lucide-react";

export default function DoctorsClient({ doctors }: { doctors: Doctor[] }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const specialties = ["Semua", ...Array.from(new Set(doctors.map(d => d.specialty))).sort()];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === "Semua" || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div>
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 -mt-10 relative z-20 max-w-5xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama dokter atau spesialis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
            />
          </div>

          {/* Specialty Filter Chips */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {specialties.map(s => (
              <button
                key={s}
                onClick={() => setSelectedSpecialty(s)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedSpecialty === s
                    ? "bg-[#0D9488] text-white shadow-md shadow-teal-600/20 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <div className="text-4xl mb-4">🩺</div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Dokter Tidak Ditemukan</h3>
          <p className="text-gray-500 text-sm">Coba kata kunci pencarian atau filter spesialisasi lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#0D9488] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 bg-gradient-to-br from-[#F0FDFA] to-[#CCFBF1]/50 overflow-hidden">
                  {doc.photoUrl ? (
                    <Image
                      src={doc.photoUrl}
                      alt={doc.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      👨‍⚕️
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#0D9488] shadow-sm">
                    {doc.specialty}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#134E4A] group-hover:text-[#0D9488] transition-colors mb-2">
                    {doc.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {doc.bio || `Dokter spesialis ${doc.specialty} berpengalaman memberikan diagnosis dan perawatan tepat.`}
                  </p>
                  
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-medium bg-gray-50 px-3 py-2 rounded-xl w-fit">
                    <Award size={14} className="text-[#0D9488]" />
                    <span>{doc.experience} Tahun Pengalaman</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center gap-3">
                <Link
                  href={`/booking?doctor=${doc.slug}`}
                  className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] text-white text-center py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Calendar size={16} /> Book Now
                </Link>
                <Link
                  href={`/doctors/${doc.slug}`}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center"
                  title="Lihat Profil"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
