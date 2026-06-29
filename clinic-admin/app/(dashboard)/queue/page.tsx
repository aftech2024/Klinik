'use client';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { RefreshCw, ArrowRight } from 'lucide-react';

type Queue = { id: string; queueNumber: number; patient: { user: { name: string } }; status: string; doctor: { user: { name: string } } | null; estimatedTime: string | null };
type Branch = { id: string; name: string };
type Stats = { waiting: number; serving: number; completed: number };

const STATUS_COLORS: Record<string, string> = {
  WAITING: 'bg-amber-100 text-amber-700',
  SERVING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  SKIPPED: 'bg-slate-100 text-slate-500',
};

export default function QueuePage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState('');
  const [queues, setQueues] = useState<Queue[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get('/api/branches').then(r => {
      const list = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      setBranches(list);
      if (list[0]) setBranchId(list[0].id);
    }).catch(() => {});
  }, []);

  const loadQueue = useCallback(() => {
    if (!branchId) return;
    api.get(`/api/queue/branch/${branchId}`).then(r => setQueues(r.data ?? [])).catch(() => {});
    api.get(`/api/queue/stats/${branchId}`).then(r => setStats(r.data)).catch(() => {});
  }, [branchId]);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  async function callNext() {
    if (!branchId) return;
    await api.post(`/api/queue/call-next`, { branchId }).catch(() => {});
    loadQueue();
  }

  return (
    <div>
      <Header title="Antrian" />
      <div className="p-8">
        {/* Branch selector */}
        <div className="flex items-center gap-4 mb-6">
          <select value={branchId} onChange={e => setBranchId(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <button onClick={loadQueue} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"><RefreshCw size={16} /></button>
          <button onClick={callNext} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700">
            <ArrowRight size={16} /> Panggil Berikutnya
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Menunggu', value: stats.waiting, color: 'text-amber-600' },
              { label: 'Dilayani', value: stats.serving, color: 'text-blue-600' },
              { label: 'Selesai', value: stats.completed, color: 'text-emerald-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-2xl p-5 border border-slate-200 text-center">
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
                <div className="text-sm text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Queue table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['No. Antrian', 'Pasien', 'Dokter', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queues.map(q => (
                <tr key={q.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-2xl font-bold text-emerald-600 w-24">#{q.queueNumber}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{q.patient?.user?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{q.doctor?.user?.name ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[q.status] ?? 'bg-slate-100 text-slate-500'}`}>{q.status}</span>
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
