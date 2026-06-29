'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { MapPin, Phone } from 'lucide-react';

type Branch = { id: string; name: string; address: string; city: string; phone: string; email: string; isActive: boolean };

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    api.get('/api/branches').then(r => setBranches(Array.isArray(r.data) ? r.data : r.data.data ?? [])).catch(() => {});
  }, []);

  return (
    <div>
      <Header title="Manajemen Cabang" />
      <div className="p-8">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Nama Cabang', 'Alamat', 'Kota', 'Telepon', 'Email', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {branches.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{b.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{b.address}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{b.city}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{b.phone}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{b.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {b.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
