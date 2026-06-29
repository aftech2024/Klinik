'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { getActiveBranchId, getUser } from '@/lib/auth';
import { Clock, Search, ChevronDown, ChevronUp, RefreshCw, BarChart3 } from 'lucide-react';

type Transaction = {
  id: string; transactionNo: string; totalAmount: number; paidAmount: number;
  changeAmount: number; paymentMethod: string; createdAt: string;
  items: Array<{ medicine: { name: string; unit: string }; quantity: number; unitPrice: number; subtotal: number }>;
  cashier: { name: string; email: string };
  patient?: { name: string; medicalNumber: string } | null;
  branch: { name: string };
};

function fmt(n: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));
}

const today = new Date().toISOString().split('T')[0];

export default function HistoryPage() {
  const [trxs, setTrxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const branchId = getActiveBranchId() ?? getUser()?.branchId ?? '';

  const load = useCallback(async () => {
    setLoading(true);
    const data = await api.get('/api/pos/transactions', {
      params: { branchId: branchId || undefined, from, to, limit: 100 },
    }).then(r => r.data ?? []).catch(() => []);
    setTrxs(data);
    setLoading(false);
  }, [branchId, from, to]);

  useEffect(() => { load(); }, [load]);

  const filtered = trxs.filter(t =>
    !search ||
    t.transactionNo.toLowerCase().includes(search.toLowerCase()) ||
    (t.patient?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    t.cashier.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = filtered.reduce((s, t) => s + Number(t.totalAmount), 0);

  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Riwayat Transaksi</h1>
        <p className="text-slate-400 text-sm mt-0.5">Semua transaksi POS</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari no. / kasir..." className="bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-600" />
        </div>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <span className="text-slate-500 text-sm">–</span>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600">
          <RefreshCw size={14} />
        </button>
        <div className="ml-auto flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2">
          <BarChart3 size={14} className="text-emerald-500" />
          <span className="text-sm text-slate-400">{filtered.length} trx</span>
          <span className="font-bold text-emerald-400">{fmt(totalRevenue)}</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-slate-900 rounded-2xl animate-pulse border border-slate-800" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
          <Clock size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Belum ada transaksi.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(p => p === t.id ? null : t.id)}
                className="w-full px-5 py-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-sm font-semibold text-white">{t.transactionNo}</span>
                    <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{t.paymentMethod}</span>
                    {t.patient && <span className="text-xs bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded-full">{t.patient.name}</span>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {new Date(t.createdAt).toLocaleString('id-ID')} · {t.cashier.name}
                    {t.branch && ` · ${t.branch.name}`}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 flex items-center gap-3">
                  <div>
                    <div className="font-bold text-emerald-400">{fmt(t.totalAmount)}</div>
                    {Number(t.changeAmount) > 0 && <div className="text-xs text-slate-500">Kembalian {fmt(t.changeAmount)}</div>}
                  </div>
                  {expanded === t.id ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </div>
              </button>
              {expanded === t.id && (
                <div className="px-5 pb-4 border-t border-slate-800 pt-3 space-y-1.5">
                  {t.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-300">{item.medicine.name} <span className="text-slate-500">×{item.quantity} @ {fmt(item.unitPrice)}</span></span>
                      <span className="text-white font-medium">{fmt(item.subtotal)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-800 pt-1.5 flex justify-between text-sm font-bold text-emerald-400">
                    <span>Total</span><span>{fmt(t.totalAmount)}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
