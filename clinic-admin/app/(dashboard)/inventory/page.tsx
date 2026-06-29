'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import {
  Package, Search, AlertTriangle, Plus, X, ArrowUpDown,
  ArrowRight, RefreshCw, ChevronDown, Eye
} from 'lucide-react';

type Medicine = {
  id: string; code: string; name: string; genericName?: string;
  category?: string; unit: string; price: number; isActive: boolean;
};
type Stock = {
  id: string; medicineId: string; branchId: string;
  quantity: number; minStock: number;
  medicine: Medicine;
  branch: { id: string; name: string; city?: string };
};
type Branch = { id: string; name: string; city: string };

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

function AddMedicineModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ code: '', name: '', genericName: '', category: '', unit: 'tablet', price: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submit() {
    setError('');
    if (!form.code || !form.name || !form.price) { setError('Kode, nama, dan harga wajib diisi.'); return; }
    setSaving(true);
    try {
      await api.post('/api/pharmacy/medicines', { ...form, price: parseFloat(form.price) });
      onCreated(); onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal menyimpan obat.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center"><Package size={18} className="text-emerald-600" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">Tambah Obat</h3>
              <p className="text-xs text-slate-400">Tambah ke katalog obat global</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-3.5">
          {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kode *</label>
              <input value={form.code} onChange={e => set('code', e.target.value)} placeholder="OBT001" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Satuan *</label>
              <select value={form.unit} onChange={e => set('unit', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {['tablet', 'kapsul', 'botol', 'ampul', 'sachet', 'tube', 'pcs'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Obat *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Paracetamol 500mg" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Generik</label>
            <input value={form.genericName} onChange={e => set('genericName', e.target.value)} placeholder="Paracetamol" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
              <input value={form.category} onChange={e => set('category', e.target.value)} placeholder="Analgesik" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Harga Satuan *</label>
              <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="2500" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors">
            {saving ? 'Menyimpan...' : 'Simpan Obat'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdjustStockModal({ stock, onClose, onDone }: { stock: Stock; onClose: () => void; onDone: () => void }) {
  const [qty, setQty] = useState('');
  const [type, setType] = useState<'IN' | 'OUT' | 'ADJUSTMENT'>('IN');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    setError('');
    const q = parseInt(qty);
    if (!q || q <= 0) { setError('Jumlah harus > 0'); return; }
    setSaving(true);
    const quantity = type === 'OUT' ? -q : q;
    try {
      await api.post('/api/pharmacy/stock/adjust', {
        medicineId: stock.medicineId,
        branchId: stock.branchId,
        quantity, type, reason,
      });
      onDone(); onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal adjust stok.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900">Sesuaikan Stok</h3>
            <p className="text-xs text-slate-400 truncate max-w-[220px]">{stock.medicine.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          {error && <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
            <span className="text-sm text-slate-600">Stok saat ini:</span>
            <span className="font-bold text-slate-900">{stock.quantity} {stock.medicine.unit}</span>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tipe</label>
            <div className="grid grid-cols-3 gap-2">
              {(['IN', 'OUT', 'ADJUSTMENT'] as const).map(t => (
                <button key={t} onClick={() => setType(t)} className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${type === t ? (t === 'OUT' ? 'bg-red-600 text-white border-red-600' : 'bg-emerald-600 text-white border-emerald-600') : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  {t === 'IN' ? 'Stok Masuk' : t === 'OUT' ? 'Stok Keluar' : 'Koreksi'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah</label>
            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="0" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Keterangan</label>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Stok masuk dari distributor..." className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Batal</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl">
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [addingMed, setAddingMed] = useState(false);
  const [adjustStock, setAdjustStock] = useState<Stock | null>(null);
  const [user] = useState(() => getUser());
  const isSuper = user?.role === 'SUPER_ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (isSuper) {
        const [s, b] = await Promise.all([
          api.get('/api/pharmacy/stock/global', { params: { search: search || undefined } }).then(r => r.data ?? []),
          api.get('/api/branches').then(r => Array.isArray(r.data) ? r.data : (r.data.data ?? [])),
        ]);
        setStocks(lowOnly ? s.filter((st: Stock) => st.quantity <= st.minStock) : s);
        setBranches(b);
      } else {
        const s = await api.get('/api/pharmacy/stock', { params: { search: search || undefined, lowStock: lowOnly } }).then(r => r.data ?? []);
        setStocks(s);
      }
    } finally { setLoading(false); }
  }, [isSuper, search, lowOnly]);

  useEffect(() => { load(); }, [load]);

  const lowCount = stocks.filter(s => s.quantity <= s.minStock).length;

  return (
    <div>
      <Header title="Inventori Obat" />
      <div className="p-6 lg:p-8 space-y-6">

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <div className="text-2xl font-bold text-slate-900">{stocks.length}</div>
            <div className="text-xs text-slate-500 mt-0.5">{isSuper ? 'Total Entri Stok' : 'Jenis Obat'}</div>
          </div>
          <div className={`rounded-2xl border p-4 ${lowCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
            <div className={`text-2xl font-bold ${lowCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>{lowCount}</div>
            <div className={`text-xs mt-0.5 ${lowCount > 0 ? 'text-red-500' : 'text-slate-500'}`}>Stok Menipis</div>
          </div>
          {!isSuper && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-2xl font-bold text-slate-900">{stocks.reduce((s, x) => s + x.quantity, 0)}</div>
              <div className="text-xs text-slate-500 mt-0.5">Total Unit</div>
            </div>
          )}
          {isSuper && (
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-2xl font-bold text-slate-900">{branches.length}</div>
              <div className="text-xs text-slate-500 mt-0.5">Cabang</div>
            </div>
          )}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between">
            <div className="text-xs text-slate-500">Aksi Cepat</div>
            <Link href="/inventory/transfer" className="text-xs text-emerald-600 font-semibold flex items-center gap-1 hover:underline mt-1">
              <ArrowRight size={12} /> Transfer Stok
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari obat..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          <button
            onClick={() => setLowOnly(p => !p)}
            className={`inline-flex items-center gap-1.5 text-sm px-4 py-2.5 rounded-xl border font-medium transition-colors ${lowOnly ? 'bg-red-600 text-white border-red-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            <AlertTriangle size={14} /> Stok Menipis
          </button>
          <button onClick={load} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setAddingMed(true)}
            className="inline-flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors"
          >
            <Plus size={15} /> Tambah Obat
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : stocks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Package size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Belum ada data stok.</p>
            <p className="text-slate-400 text-xs mt-1">Tambah obat ke katalog lalu sesuaikan stok.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Obat</th>
                    {isSuper && <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cabang</th>}
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Harga</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    {!isSuper && <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stocks.map(s => {
                    const low = s.quantity <= s.minStock;
                    return (
                      <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${low ? 'bg-red-50/30' : ''}`}>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-slate-900">{s.medicine.name}</div>
                          <div className="text-xs text-slate-400">{s.medicine.code} · {s.medicine.unit}</div>
                        </td>
                        {isSuper && (
                          <td className="px-4 py-3.5">
                            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{s.branch.name}</span>
                          </td>
                        )}
                        <td className="px-4 py-3.5 text-slate-500 text-xs">{s.medicine.category || '—'}</td>
                        <td className="px-4 py-3.5 text-slate-700 font-medium">{fmt(s.medicine.price)}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`font-bold ${low ? 'text-red-600' : 'text-slate-900'}`}>{s.quantity}</span>
                          <span className="text-slate-400 text-xs ml-1">/ min {s.minStock}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${low ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {low && <AlertTriangle size={10} />}
                            {low ? 'Menipis' : 'Aman'}
                          </span>
                        </td>
                        {!isSuper && (
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => setAdjustStock(s)}
                              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <ArrowUpDown size={12} /> Sesuaikan
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {addingMed && <AddMedicineModal onClose={() => setAddingMed(false)} onCreated={load} />}
      {adjustStock && <AdjustStockModal stock={adjustStock} onClose={() => setAdjustStock(null)} onDone={load} />}
    </div>
  );
}
