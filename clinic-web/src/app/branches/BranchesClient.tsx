"use client";

import { useState } from "react";
import type { Branch } from "@/lib/api";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowRight, Search, Building2 } from "lucide-react";

export default function BranchesClient({ branches }: { branches: Branch[] }) {
  const [selectedCity, setSelectedCity] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const cities = ["Semua", ...Array.from(new Set(branches.map(b => b.city))).sort()];

  const filteredBranches = branches.filter(b => {
    const matchesCity = selectedCity === "Semua" || b.city === selectedCity;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div>
      {/* Search and City Filter Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 -mt-10 relative z-20 max-w-5xl mx-auto mb-16">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama klinik atau alamat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {cities.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCity(c)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCity === c
                    ? "bg-[#0D9488] text-white shadow-md shadow-teal-600/20 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Branches Grid */}
      {filteredBranches.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-800 mb-1">Cabang Tidak Ditemukan</h3>
          <p className="text-gray-500 text-sm">Coba kata kunci pencarian atau pilih kota lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBranches.map(branch => {
            const hours = branch.operatingHours?.weekday;
            return (
              <div
                key={branch.id}
                className="group bg-white rounded-3xl p-7 border border-gray-100 hover:border-[#0D9488] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-[#F0FDFA] group-hover:bg-[#0D9488] flex items-center justify-center transition-colors duration-300 flex-shrink-0">
                      <Building2 size={24} className="text-[#0D9488] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#134E4A] group-hover:text-[#0D9488] transition-colors line-clamp-1">
                        {branch.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-0.5 rounded-full inline-block mt-1">
                        {branch.city}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3.5 mb-6 text-sm text-gray-600">
                    <div className="flex items-start gap-3">
                      <MapPin size={18} className="text-[#0D9488] flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{branch.address}, {branch.city}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-[#0D9488] flex-shrink-0" />
                      <span className="font-medium text-gray-800">{branch.phone}</span>
                    </div>
                    {hours && (
                      <div className="flex items-center gap-3">
                        <Clock size={18} className="text-[#0D9488] flex-shrink-0" />
                        <span>Senin–Jumat: {hours.open}–{hours.close}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {branch.facilities.slice(0, 3).map(f => (
                      <span key={f} className="text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-xl">
                        {f}
                      </span>
                    ))}
                    {branch.facilities.length > 3 && (
                      <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded-xl">
                        +{branch.facilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center gap-3">
                  <Link
                    href={`/booking?branch=${branch.id}`}
                    className="flex-1 bg-[#0D9488] hover:bg-[#0F766E] text-white text-center py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    Buat Janji Di Sini
                  </Link>
                  <Link
                    href={`/branches/${branch.slug}`}
                    className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center"
                    title="Detail Cabang"
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
