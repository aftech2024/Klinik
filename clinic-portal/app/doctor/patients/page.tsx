'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Users, Search, User } from 'lucide-react';

type Patient = {
  id: string; name: string; medicalNumber: string; gender?: string; phone?: string;
  dateOfBirth?: string; city?: string;
};

export default function DoctorPatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    api.get(`/api/patients?${params}`).then(r => {
      setPatients(Array.isArray(r.data) ? r.data : r.data.data ?? []);
    }).catch(() => {});
  }, [search]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Pasien</h1>
        <p className="text-gray-500 text-sm mt-1">Cari dan lihat data pasien</p>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Cari pasien..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      </div>

      <div className="space-y-3">
        {patients.length > 0 ? patients.map(p => (
          <Link key={p.id} href={`/doctor/patients/${p.id}`} className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{p.name}</p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                  <span>RM: {p.medicalNumber}</span>
                  {p.gender && <><span>·</span><span>{p.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</span></>}
                  {p.city && <><span>·</span><span>{p.city}</span></>}
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <Users size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Tidak ada data pasien.</p>
          </div>
        )}
      </div>
    </div>
  );
}
