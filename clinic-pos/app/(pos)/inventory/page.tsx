'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { getUser, getActiveBranchId } from '@/lib/auth';
import { Package, AlertTriangle, Search, RefreshCw, ArrowUpDown } from 'lucide-react';

type Stock = {
  id: string; quantity: number; minStock: number;
  medicine: { id: string; code: string; name: string; unit: string; price: number; category?: string; genericName?: string };
  branch: { id: string; name: string };
};

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function AdjustModal({ stock, onClose, onDone }: { stock: Stock; onClose: () => void; onDone: () => void }) {
  const [qty, setQty] = useState('');
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const user = getUser();

  async function submit() {
    setError('');
    const q = parseInt(qty);
    if (!q || q <= 0) { setError('Jumlah harus > 0'); return; }
    setSaving(true);
    try {
      await api.post('/api/pharmacy/stock/adjust', {
        medicineId: stock.medicine.id,
        branchId: stock.branch.id,
        quantity: type === 'OUT' ? -q : q,
        type, reason,
      });
      onDone(); onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal.');
    } finally { setSaving(false); }
  }

  // CASHIER: read-only, no adjust
  const isReadOnly = user?.role === 'CASHIER';
  if (isReadOnly) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm text-white">
        <div className="p-5 border-b border-slate-800">
          <h3 className="font-semibold">Sesuaikan Stok</h3>
          <p className="text-sm text-slate-400 mt-0.5">{stock.medicine.name}</p>
        </div>
        <div className="p-5 space-y-4">
          {error && <div className="px-3 py-2 bg-red-900/50 text-red-300 text-sm rounded-xl">{error}</div>}
          <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-xl">
            <span className="text-slate-400 text-sm">Stok saat ini:</span>
            <span className="font-bold">{stock.quantity} {stock.medicine.unit}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['IN', 'OUT'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} className={`py-2 text-sm font-semibold rounded-xl border transition-colors ${type === t ? (t === 'OUT' ? 'bg-red-600 border-red-600 text-white' : 'bg-emerald-600 border-emerald-600 text-white') : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
                {t === 'IN' ? '+ Masuk' : '- Keluar'}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Jumlah</label>
            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Keterangan</label>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Stok masuk dari distributor..." className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl">Batal</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl">
            {saving ? '...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [adjusting, setAdjusting] = useState<Stock | null>(null);
  const user = getUser();
  const branchId = getActiveBranchId() ?? user?.branchId ?? '';
  const isSuper = user?.role === 'SUPER_ADMIN';
  const canAdjust = user?.role !== 'CASHIER';

  const load = useCallback(async () => {
    setLoading(true);
    const url = isSuper ? '/api/pharmacy/stock/global' : '/api/pharmacy/stock';
    const data = await api.get(url, { params: { branchId: isSuper ? undefined : (branchId || undefined), search: search || undefined } })
      .then(r => r.data ?? []).catch(() => []);
    setStocks(lowOnly ? data.filter((s: Stock) => s.quantity <= s.minStock) : data);
    setLoading(false);
  }, [isSuper, branchId, search, lowOnly]);

  useEffect(() => { load(); }, [load]);

  const low = stocks.filter(s => s.quantity <= s.minStock).length;

  return (
    <div className="p-5 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Stok Obat</h1>
        <p className="text-slate-400 text-sm mt-0.5">{isSuper ? 'Semua cabang' : 'Klinik ini'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-2xl font-bold text-white">{stocks.length}</div>
          <div className="text-xs text-slate-500 mt-0.5">Jenis Obat</div>
        </div>
        <div className={`rounded-2xl border p-4 ${low > 0 ? 'bg-red-900/20 border-red-800' : 'bg-slate-900 border-slate-800'}`}>
          <div className={`text-2xl font-bold ${low > 0 ? 'text-red-400' : 'text-white'}`}>{low}</div>
          <div className={`text-xs mt-0.5 ${low > 0 ? 'text-red-500' : 'text-slate-500'}`}>Stok Menipis</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-2xl font-bold text-white">{stocks.reduce((s, x) => s + x.quantity, 0)}</div>
          <div className="text-xs text-slate-500 mt-0.5">Total Unit</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari obat..." className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-600" />
        </div>
        <button onClick={() => setLowOnly(p => !p)} className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl border font-medium transition-colors ${lowOnly ? 'bg-red-600 border-red-600 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-600'}`}>
          <AlertTriangle size={14} /> Menipis
        </button>
        <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:text-white">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />)}</div>
      ) : stocks.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Package size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Belum ada stok.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Obat</th>
                {isSuper && <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Cabang</th>}
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Harga</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Stok</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                {canAdjust && <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {stocks.map(s => {
                const isLow = s.quantity <= s.minStock;
                return (
                  <tr key={s.id} className={`hover:bg-slate-800/40 transition-colors ${isLow ? 'bg-red-900/10' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-white">{s.medicine.name}</div>
                      <div className="text-xs text-slate-500">{s.medicine.code} · {s.medicine.unit}</div>
                    </td>
                    {isSuper && <td className="px-4 py-3.5"><span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-full">{s.branch.name}</span></td>}
                    <td className="px-4 py-3.5 text-emerald-400 font-medium">{fmt(s.medicine.price)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`font-bold ${isLow ? 'text-red-400' : 'text-white'}`}>{s.quantity}</span>
                      <span className="text-slate-500 text-xs ml-1">/{s.minStock}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isLow ? 'bg-red-900/60 text-red-400' : 'bg-emerald-900/60 text-emerald-400'}`}>
                        {isLow && <AlertTriangle size={9} />}
                        {isLow ? 'Menipis' : 'Aman'}
                      </span>
                    </td>
                    {canAdjust && (
                      <td className="px-4 py-3.5 text-right">
                        <button onClick={() => setAdjusting(s)} className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-900/30 hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg font-medium">
                          <ArrowUpDown size={11} /> Sesuaikan
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {adjusting && <AdjustModal stock={adjusting} onClose={() => setAdjusting(null)} onDone={load} />}
    </div>
  );
}
