'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { FileText, Search, Plus } from 'lucide-react';

type Record = {
  id: string; subjective?: string; assessment?: string; diagnosis?: string[];
  createdAt: string;
  patient: { name: string; medicalNumber: string };
  doctor: { name: string };
  appointment: { appointmentDate: string };
};

export default function DoctorMedicalRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/doctors/me').then(r => {
      const docId = r.data.id;
      api.get('/api/appointments').then(res => {
        const appts = Array.isArray(res.data) ? res.data : res.data.data ?? [];
        const ids = appts.map((a: any) => a.medicalRecord?.id).filter(Boolean);
        Promise.all(ids.map((rid: string) => api.get(`/api/medical-records/${rid}`).then(r => r.data).catch(() => null)))
          .then(results => setRecords(results.filter(Boolean)));
      }).catch(() => {});
    }).catch(() => {});
  }, []);

  const filtered = records.filter(r =>
    r.patient?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rekam Medis</h1>
          <p className="text-gray-500 text-sm mt-1">Riwayat rekam medis pasien</p>
        </div>
        <Link href="/doctor/appointments"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2">
          <Plus size={16} /> Buat Baru
        </Link>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Cari pasien..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div className="space-y-3">
        {filtered.length > 0 ? filtered.map(r => (
          <Link key={r.id} href={`/doctor/medical-records/${r.id}`} className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{r.patient?.name}</p>
                <p className="text-xs text-gray-500">RM: {r.patient?.medicalNumber}</p>
                <p className="text-xs text-gray-400 mt-1">{r.appointment?.appointmentDate?.slice(0, 10)}</p>
              </div>
              {r.assessment && (
                <div className="hidden sm:block text-right text-sm text-gray-600 max-w-[200px] truncate">
                  {r.assessment}
                </div>
              )}
            </div>
          </Link>
        )) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <FileText size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Belum ada rekam medis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
