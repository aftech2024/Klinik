"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, User, MapPin, Stethoscope, Search } from "lucide-react";

export default function QuickBooking() {
  const [form, setForm] = useState({ service: "", doctor: "", branch: "", date: "" });

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <section className="relative -mt-8 z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
          <Search size={20} className="text-emerald-600" />
          Booking Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Stethoscope size={11} /> Layanan
            </label>
            <select
              value={form.service}
              onChange={handleChange("service")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
            >
              <option value="">Pilih Layanan</option>
              <option value="general-practice">Praktek Umum</option>
              <option value="dental">Gigi & Mulut</option>
              <option value="pediatrics">Anak</option>
              <option value="obstetrics-gynecology">Kebidanan</option>
              <option value="internal-medicine">Penyakit Dalam</option>
              <option value="medical-check-up">Medical Check Up</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <User size={11} /> Dokter
            </label>
            <select
              value={form.doctor}
              onChange={handleChange("doctor")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
            >
              <option value="">Semua Dokter</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <MapPin size={11} /> Cabang
            </label>
            <select
              value={form.branch}
              onChange={handleChange("branch")}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
            >
              <option value="">Semua Cabang</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Calendar size={11} /> Tanggal
            </label>
            <input
              type="date"
              value={form.date}
              onChange={handleChange("date")}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50"
            />
          </div>

          <div className="flex items-end">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold">
              Cari Jadwal
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
