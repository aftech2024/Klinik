'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Search, UserPlus } from 'lucide-react';

type Patient = { id: string; user: { name: string; email: string; phone: string | null }; dateOfBirth: string | null; gender: string | null; medicalRecordNo: string };

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = new URLSearchParams({ page: String(page), limit: '20', ...(search ? { search } : {}) });
    api.get(`/api/patients?${q}`).then(r => { setPatients(r.data.data ?? []); setTotal(r.data.total ?? 0); }).catch(() => {});
  }, [page, search]);

  return (
    <div>
      <Header title="Manajemen Pasien" />
      <div className="p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Cari nama / email..." />
          </div>
          <span className="text-sm text-slate-500">{total} pasien</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['No. Rekam Medis', 'Nama', 'Email', 'HP', 'Tgl. Lahir', 'Jenis Kelamin'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-mono text-slate-600">{p.medicalRecordNo}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{p.user.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{p.user.email}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{p.user.phone ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{p.dateOfBirth ? formatDate(p.dateOfBirth) : '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{p.gender ?? '—'}</td>
                </tr>
              ))}
              {patients.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada data pasien.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 20 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
