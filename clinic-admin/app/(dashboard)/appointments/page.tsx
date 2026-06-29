'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { formatDatetime } from '@/lib/utils';

type Appointment = { id: string; patient: { user: { name: string } }; doctor: { user: { name: string }; specialty: string }; branch: { name: string }; scheduledAt: string; status: string; type: string };

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  NO_SHOW: 'bg-slate-100 text-slate-500',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const q = new URLSearchParams({ page: String(page), limit: '20', ...(status ? { status } : {}) });
    api.get(`/api/appointments?${q}`).then(r => { setAppointments(r.data.data ?? []); setTotal(r.data.total ?? 0); }).catch(() => {});
  }, [page, status]);

  return (
    <div>
      <Header title="Manajemen Appointment" />
      <div className="p-8">
        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${status === s ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
              {s || 'Semua'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Pasien', 'Dokter', 'Cabang', 'Jadwal', 'Tipe', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.map(a => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{a.patient?.user?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    <div>{a.doctor?.user?.name ?? '—'}</div>
                    <div className="text-xs text-slate-400">{a.doctor?.specialty}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{a.branch?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{formatDatetime(a.scheduledAt)}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{a.type}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[a.status] ?? 'bg-slate-100 text-slate-500'}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada data appointment.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
