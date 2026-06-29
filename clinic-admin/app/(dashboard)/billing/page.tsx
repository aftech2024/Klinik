'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { formatRupiah, formatDate } from '@/lib/utils';

type Billing = { id: string; invoiceNo: string; patient: { user: { name: string } }; totalAmount: number; status: string; dueDate: string | null; paidAt: string | null };

const STATUS_COLORS: Record<string, string> = {
  UNPAID: 'bg-red-100 text-red-700',
  PARTIAL: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
};

export default function BillingPage() {
  const [bills, setBills] = useState<Billing[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const q = status ? `?status=${status}` : '';
    api.get(`/api/billing${q}`).then(r => setBills(r.data.data ?? [])).catch(() => {});
  }, [status]);

  return (
    <div>
      <Header title="Billing & Pembayaran" />
      <div className="p-8">
        <div className="flex gap-2 mb-6">
          {['', 'UNPAID', 'PARTIAL', 'PAID'].map(s => (
            <button key={s} onClick={() => setStatus(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${status === s ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300'}`}>
              {s || 'Semua'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['No. Invoice', 'Pasien', 'Total', 'Jatuh Tempo', 'Dibayar', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bills.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-mono text-slate-700">{b.invoiceNo}</td>
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{b.patient?.user?.name ?? '—'}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">{formatRupiah(b.totalAmount)}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{b.dueDate ? formatDate(b.dueDate) : '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{b.paidAt ? formatDate(b.paidAt) : '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[b.status] ?? 'bg-slate-100 text-slate-500'}`}>{b.status}</span>
                  </td>
                </tr>
              ))}
              {bills.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 text-sm">Tidak ada data billing.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
