'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import {
  Search, ShoppingCart, Trash2, Plus, Minus, CreditCard,
  Banknote, Receipt, CheckCircle, X, Package, Clock, BarChart3,
  RefreshCw, ChevronUp, Pencil, ArrowUpDown, AlertTriangle, Save,
} from 'lucide-react';

type Medicine = {
  id: string; code: string; name: string; genericName?: string;
  category?: string; unit: string; price: number; isActive?: boolean;
  productStocks?: Array<{ quantity: number; branchId: string; minStock: number }>;
};
type Stock = {
  id: string; quantity: number; minStock: number;
  medicine: Medicine;
  branch: { id: string; name: string };
};
type CartItem = { medicine: Medicine; quantity: number };
type Transaction = {
  id: string; transactionNo: string; totalAmount: number; paidAmount: number;
  changeAmount: number; paymentMethod: string; createdAt: string;
  items: Array<{ medicine: { name: string; unit: string }; quantity: number; unitPrice: number; subtotal: number }>;
  cashier: { name: string };
  patient?: { name: string; medicalNumber: string } | null;
};

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

// ── Medicine Modal (Add / Edit) ───────────────────────────────────────────────
const CATEGORIES = ['Obat Keras', 'Obat Bebas', 'Suplemen', 'Antibiotik', 'Analgesik', 'Vitamin', 'Antasida', 'Lainnya'];
const UNITS = ['tablet', 'kapsul', 'botol', 'sachet', 'ampul', 'tube', 'strip', 'pcs', 'ml', 'gram'];

function MedicineModal({ medicine, onClose, onDone }: {
  medicine: Medicine | null; onClose: () => void; onDone: () => void;
}) {
  const isEdit = !!medicine;
  const [form, setForm] = useState({
    code: medicine?.code ?? '',
    name: medicine?.name ?? '',
    genericName: medicine?.genericName ?? '',
    category: medicine?.category ?? '',
    unit: medicine?.unit ?? 'tablet',
    price: medicine?.price ? String(medicine.price) : '',
    isActive: medicine?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k: keyof typeof form, v: string | boolean) {
    setForm(p => ({ ...p, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const price = parseInt(form.price);
    if (!form.code || !form.name || !form.unit || !price) {
      setError('Kode, nama, satuan, dan harga wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        code: form.code.trim(),
        name: form.name.trim(),
        genericName: form.genericName.trim() || undefined,
        category: form.category || undefined,
        unit: form.unit,
        price,
        isActive: form.isActive,
      };
      if (isEdit) {
        await api.patch(`/api/pharmacy/medicines/${medicine!.id}`, payload);
      } else {
        await api.post('/api/pharmacy/medicines', payload);
      }
      onDone();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal menyimpan.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">{isEdit ? 'Edit Obat' : 'Tambah Obat Baru'}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{isEdit ? 'Ubah data obat yang sudah ada' : 'Tambahkan obat ke katalog'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          {error && (
            <div className="px-3 py-2.5 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kode Obat *</label>
              <input value={form.code} onChange={e => set('code', e.target.value)} required
                placeholder="OBT-001"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Satuan *</label>
              <select value={form.unit} onChange={e => set('unit', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Obat *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} required
              placeholder="Paracetamol 500mg"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Generik</label>
            <input value={form.genericName} onChange={e => set('genericName', e.target.value)}
              placeholder="Acetaminophen"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kategori</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">-- Pilih --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Harga (Rp) *</label>
              <input type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} required
                placeholder="15000"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {isEdit && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('isActive', !form.isActive)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${form.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm font-medium text-slate-700">Obat aktif (tampil di kasir)</span>
            </label>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium">
              Batal
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl flex items-center justify-center gap-1.5">
              <Save size={14} /> {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Obat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Stock Adjust Modal ────────────────────────────────────────────────────────
function StockModal({ medicines, branchId, stock, onClose, onDone }: {
  medicines: Medicine[];
  branchId: string;
  stock: Stock | null; // null = new IN
  onClose: () => void;
  onDone: () => void;
}) {
  const [medicineId, setMedicineId] = useState(stock?.medicine.id ?? '');
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [qty, setQty] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const q = parseInt(qty);
    if (!medicineId || !q || q <= 0) { setError('Pilih obat dan masukkan jumlah > 0.'); return; }
    setSaving(true);
    try {
      await api.post('/api/pharmacy/stock/adjust', {
        medicineId,
        branchId,
        quantity: type === 'OUT' ? -q : q,
        type,
        reason: reason.trim() || undefined,
      });
      onDone();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900">{stock ? 'Sesuaikan Stok' : 'Tambah Stok'}</h3>
            {stock && <p className="text-xs text-slate-400 mt-0.5">{stock.medicine.name}</p>}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          {error && <div className="px-3 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">{error}</div>}

          {!stock && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pilih Obat *</label>
              <select value={medicineId} onChange={e => setMedicineId(e.target.value)} required
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">-- Pilih obat --</option>
                {medicines.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
              </select>
            </div>
          )}

          {stock && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Package size={16} className="text-slate-400" />
              <div>
                <div className="text-sm font-semibold text-slate-800">{stock.medicine.name}</div>
                <div className="text-xs text-slate-400">Stok saat ini: <span className="font-bold text-slate-700">{stock.quantity} {stock.medicine.unit}</span></div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jenis</label>
            <div className="grid grid-cols-2 gap-2">
              {(['IN', 'OUT'] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`py-2.5 text-sm font-semibold rounded-xl border transition-colors ${
                    type === t
                      ? t === 'IN' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-red-600 border-red-600 text-white'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}>
                  {t === 'IN' ? '+ Stok Masuk' : '- Stok Keluar'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah *</label>
            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} required
              placeholder="Masukkan jumlah..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Keterangan</label>
            <input value={reason} onChange={e => setReason(e.target.value)}
              placeholder="Pengadaan dari distributor, retur, dll..."
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium">Batal</button>
            <button type="submit" disabled={saving}
              className={`flex-1 py-2.5 text-sm font-bold text-white rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 ${type === 'OUT' ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              <Save size={14} /> {saving ? '...' : type === 'IN' ? 'Tambah Stok' : 'Kurangi Stok'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Receipt Modal ─────────────────────────────────────────────────────────────
function ReceiptModal({ transaction, onClose }: { transaction: Transaction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="text-center p-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={28} className="text-emerald-600" />
          </div>
          <h2 className="font-bold text-slate-900 text-lg">Transaksi Berhasil!</h2>
          <p className="text-slate-500 text-sm mt-1">{transaction.transactionNo}</p>
        </div>
        <div className="p-5 space-y-3">
          <div className="space-y-1.5">
            {transaction.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-700">{item.medicine.name} <span className="text-slate-400">×{item.quantity}</span></span>
                <span className="font-medium text-slate-900">{fmt(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5">
            <div className="flex justify-between text-sm font-bold text-slate-900">
              <span>Total</span><span>{fmt(transaction.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Bayar ({transaction.paymentMethod})</span><span>{fmt(transaction.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-emerald-700">
              <span>Kembalian</span><span>{fmt(transaction.changeAmount)}</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 text-center mt-2">
            {new Date(transaction.createdAt).toLocaleString('id-ID')} · Kasir: {transaction.cashier.name}
          </div>
        </div>
        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors">
            Transaksi Baru
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cart Panel ────────────────────────────────────────────────────────────────
function CartPanel({
  cart, total, paid, paidStr, change, payMethod, processing,
  setPaidStr, setPayMethod, updateQty, removeFromCart, setCart, checkout
}: {
  cart: CartItem[]; total: number; paid: number; paidStr: string;
  change: number; payMethod: 'CASH' | 'TRANSFER' | 'QRIS' | 'CARD';
  processing: boolean;
  setPaidStr: (v: string) => void;
  setPayMethod: (m: 'CASH' | 'TRANSFER' | 'QRIS' | 'CARD') => void;
  updateQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  setCart: (v: CartItem[]) => void;
  checkout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="font-bold text-slate-900 flex items-center gap-2">
          <ShoppingCart size={17} /> Keranjang
          {cart.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">{cart.length}</span>
          )}
        </h2>
        {cart.length > 0 && (
          <button onClick={() => setCart([])} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
            <Trash2 size={13} /> Kosongkan
          </button>
        )}
      </div>
      <div className="divide-y divide-slate-100 overflow-y-auto flex-1 min-h-0">
        {cart.length === 0 ? (
          <div className="py-10 text-center text-slate-300">
            <ShoppingCart size={32} className="mx-auto mb-2" />
            <p className="text-sm">Keranjang kosong</p>
          </div>
        ) : cart.map(item => (
          <div key={item.medicine.id} className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">{item.medicine.name}</div>
              <div className="text-xs text-slate-400">{fmt(item.medicine.price)} / {item.medicine.unit}</div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => { if (item.quantity === 1) removeFromCart(item.medicine.id); else updateQty(item.medicine.id, -1); }} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                <Minus size={12} />
              </button>
              <span className="w-7 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
              <button onClick={() => updateQty(item.medicine.id, 1)} className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                <Plus size={12} />
              </button>
            </div>
            <div className="text-sm font-bold text-slate-900 w-20 text-right">{fmt(item.medicine.price * item.quantity)}</div>
          </div>
        ))}
      </div>
      <div className="p-4 space-y-3 border-t border-slate-100 flex-shrink-0">
        <div className="flex justify-between items-center text-lg font-bold text-slate-900">
          <span>Total</span><span className="text-emerald-700">{fmt(total)}</span>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Metode Bayar</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['CASH', 'TRANSFER', 'QRIS', 'CARD'] as const).map(m => (
              <button key={m} onClick={() => setPayMethod(m)} className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold rounded-xl border transition-colors ${payMethod === m ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                {m === 'CASH' && <Banknote size={14} />}
                {m === 'CARD' && <CreditCard size={14} />}
                {m === 'TRANSFER' && <Receipt size={14} />}
                {m === 'QRIS' && <BarChart3 size={14} />}
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah Bayar</label>
          <input type="number" inputMode="numeric" value={paidStr} onChange={e => setPaidStr(e.target.value)}
            placeholder={`Min. ${fmt(total)}`}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {payMethod === 'CASH' && total > 0 && (
            <div className="grid grid-cols-3 gap-1.5 mt-2">
              {[total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map(v => (
                  <button key={v} onClick={() => setPaidStr(String(v))} className="text-xs py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700 font-medium">
                    {fmt(v)}
                  </button>
                ))}
            </div>
          )}
        </div>
        {paid > 0 && (
          <div className={`flex justify-between text-sm font-semibold px-3 py-2 rounded-xl ${change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
            <span>Kembalian</span>
            <span>{change >= 0 ? fmt(change) : '— kurang'}</span>
          </div>
        )}
        <button onClick={checkout} disabled={cart.length === 0 || paid < total || processing}
          className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors">
          {processing ? 'Memproses...' : `Bayar ${cart.length > 0 ? fmt(total) : ''}`}
        </button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function PosPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [medSearch, setMedSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [paidStr, setPaidStr] = useState('');
  const [payMethod, setPayMethod] = useState<'CASH' | 'TRANSFER' | 'QRIS' | 'CARD'>('CASH');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<Transaction | null>(null);
  const [recentTrx, setRecentTrx] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<{ totalTransactions: number; totalRevenue: number } | null>(null);
  const [tab, setTab] = useState<'kasir' | 'riwayat' | 'obat' | 'stok'>('kasir');
  const [cartOpen, setCartOpen] = useState(false);
  const [editMedicine, setEditMedicine] = useState<Medicine | null | 'new'>('new' as any);
  const [showMedModal, setShowMedModal] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [loadingMed, setLoadingMed] = useState(false);
  const [loadingStock, setLoadingStock] = useState(false);

  const user = getUser();
  const searchRef = useRef<HTMLInputElement>(null);
  const branchId = user?.branchId ?? '';
  const isSuper = user?.role === 'SUPER_ADMIN';

  const loadMedicines = useCallback(async () => {
    const data = await api.get('/api/pharmacy/medicines', { params: { branchId: branchId || undefined } })
      .then(r => r.data ?? []).catch(() => []);
    setMedicines(data);
  }, [branchId]);

  const loadAllMedicines = useCallback(async () => {
    setLoadingMed(true);
    const data = await api.get('/api/pharmacy/medicines')
      .then(r => r.data ?? []).catch(() => []);
    setMedicines(data);
    setLoadingMed(false);
  }, []);

  const loadStocks = useCallback(async () => {
    setLoadingStock(true);
    const url = isSuper ? '/api/pharmacy/stock/global' : '/api/pharmacy/stock';
    const data = await api.get(url, { params: { branchId: isSuper ? undefined : (branchId || undefined) } })
      .then(r => r.data ?? []).catch(() => []);
    setStocks(data);
    setLoadingStock(false);
  }, [branchId, isSuper]);

  const loadRecent = useCallback(async () => {
    const [trx, sum] = await Promise.all([
      api.get('/api/pos/transactions', { params: { branchId: branchId || undefined, limit: 20 } }).then(r => r.data ?? []).catch(() => []),
      api.get('/api/pos/summary', { params: { branchId: branchId || undefined } }).then(r => r.data).catch(() => null),
    ]);
    setRecentTrx(trx);
    setSummary(sum);
  }, [branchId]);

  useEffect(() => { loadMedicines(); loadRecent(); }, [loadMedicines, loadRecent]);
  useEffect(() => { if (tab === 'obat') loadAllMedicines(); }, [tab, loadAllMedicines]);
  useEffect(() => { if (tab === 'stok') loadStocks(); }, [tab, loadStocks]);

  const filtered = medicines.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || (m.genericName ?? '').toLowerCase().includes(q);
  });

  const filteredMed = medicines.filter(m =>
    !medSearch || m.name.toLowerCase().includes(medSearch.toLowerCase()) || m.code.toLowerCase().includes(medSearch.toLowerCase())
  );

  const filteredStock = stocks.filter(s =>
    !stockSearch || s.medicine.name.toLowerCase().includes(stockSearch.toLowerCase()) || s.medicine.code.toLowerCase().includes(stockSearch.toLowerCase())
  );

  function getStock(m: Medicine) {
    if (!m.productStocks?.length) return 0;
    const s = branchId ? m.productStocks.find(s => s.branchId === branchId) : m.productStocks[0];
    return s?.quantity ?? 0;
  }

  function addToCart(med: Medicine) {
    const stock = getStock(med);
    setCart(prev => {
      const existing = prev.find(i => i.medicine.id === med.id);
      if (existing) {
        if (existing.quantity >= stock) return prev;
        return prev.map(i => i.medicine.id === med.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      if (stock <= 0) return prev;
      return [...prev, { medicine: med, quantity: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(i => {
      if (i.medicine.id !== id) return i;
      const newQ = i.quantity + delta;
      return newQ <= 0 ? i : { ...i, quantity: newQ };
    }));
  }

  function removeFromCart(id: string) {
    setCart(prev => prev.filter(i => i.medicine.id !== id));
  }

  const total = cart.reduce((s, i) => s + i.medicine.price * i.quantity, 0);
  const paid = parseFloat(paidStr) || 0;
  const change = paid - total;

  async function checkout() {
    if (cart.length === 0 || paid < total) return;
    setProcessing(true);
    try {
      const res = await api.post('/api/pos/transactions', {
        branchId: branchId || undefined,
        items: cart.map(i => ({ medicineId: i.medicine.id, quantity: i.quantity, unitPrice: i.medicine.price })),
        paidAmount: paid, paymentMethod: payMethod,
      });
      setReceipt(res.data);
      setCart([]);
      setPaidStr('');
      setCartOpen(false);
      loadMedicines();
      loadRecent();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Transaksi gagal');
    } finally { setProcessing(false); }
  }

  const cartProps = { cart, total, paid, paidStr, change, payMethod, processing, setPaidStr, setPayMethod, updateQty, removeFromCart, setCart, checkout };

  const TABS = [
    { key: 'kasir', label: 'Kasir', icon: ShoppingCart },
    { key: 'riwayat', label: 'Riwayat', icon: Clock },
    { key: 'obat', label: 'Katalog Obat', icon: Package },
    { key: 'stok', label: 'Kelola Stok', icon: ArrowUpDown },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Kasir / POS" />

      <div className="p-3 sm:p-4 lg:p-6">
        {/* Tabs + summary */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="flex gap-2 flex-wrap">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-xl transition-colors ${tab === key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
          {summary && (
            <div className="flex items-center gap-3 text-xs text-slate-500 ml-auto">
              <span className="flex items-center gap-1"><BarChart3 size={13} /> {summary.totalTransactions} trx</span>
              <span className="font-semibold text-emerald-700 text-sm">{fmt(summary.totalRevenue)}</span>
            </div>
          )}
        </div>

        {/* ── KASIR TAB ── */}
        {tab === 'kasir' && (
          <>
            <div className="lg:grid lg:grid-cols-5 lg:gap-5">
              <div className="lg:col-span-3 space-y-3 pb-24 lg:pb-0">
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Cari obat (nama / kode)..."
                    className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {filtered.slice(0, 24).map(m => {
                    const stock = getStock(m);
                    const inCart = cart.find(i => i.medicine.id === m.id)?.quantity ?? 0;
                    const outOfStock = stock <= 0;
                    return (
                      <button key={m.id} onClick={() => addToCart(m)} disabled={outOfStock}
                        className={`text-left p-3 sm:p-4 rounded-xl border transition-all active:scale-95 ${outOfStock ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' : inCart > 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'}`}>
                        <div className="flex items-start justify-between mb-1">
                          <Package size={15} className={inCart > 0 ? 'text-emerald-600' : 'text-slate-400'} />
                          {inCart > 0 && <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">{inCart}</span>}
                        </div>
                        <div className="font-semibold text-slate-900 text-xs sm:text-sm leading-tight line-clamp-2">{m.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{m.code}</div>
                        <div className="mt-2 flex items-center justify-between gap-1">
                          <span className="text-xs sm:text-sm font-bold text-emerald-700 leading-none">{fmt(m.price)}</span>
                          <span className={`text-[9px] sm:text-[10px] font-medium px-1 sm:px-1.5 py-0.5 rounded-full flex-shrink-0 ${outOfStock ? 'bg-red-100 text-red-600' : stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                            {outOfStock ? 'Habis' : `${stock}`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div className="col-span-2 sm:col-span-3 py-16 text-center text-slate-400">
                      <Package size={32} className="mx-auto mb-2 text-slate-200" />
                      <p className="text-sm">Obat tidak ditemukan</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden lg:block lg:col-span-2">
                <div className="bg-white rounded-2xl border border-slate-200 sticky top-6 max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
                  <CartPanel {...cartProps} />
                </div>
              </div>
            </div>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white border-t border-slate-200 shadow-lg">
              {cart.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-2 text-slate-400 text-sm">
                  <ShoppingCart size={16} /> Keranjang kosong — pilih obat
                </div>
              ) : (
                <button onClick={() => setCartOpen(true)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-sm transition-colors active:scale-95">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">{cart.length}</span>
                    Lihat Keranjang
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{fmt(total)}</span>
                    <ChevronUp size={16} />
                  </div>
                </button>
              )}
            </div>
            {cartOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
                <div className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh]">
                  <div className="flex items-center justify-between px-4 pt-3 pb-0 flex-shrink-0">
                    <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
                  </div>
                  <button onClick={() => setCartOpen(false)} className="absolute top-3 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <X size={16} />
                  </button>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <CartPanel {...cartProps} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── RIWAYAT TAB ── */}
        {tab === 'riwayat' && (
          <div className="space-y-3 pb-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-500">{recentTrx.length} transaksi terakhir</p>
              <button onClick={loadRecent} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                <RefreshCw size={14} />
              </button>
            </div>
            {recentTrx.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <Clock size={36} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Belum ada transaksi.</p>
              </div>
            ) : recentTrx.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm">{t.transactionNo}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {new Date(t.createdAt).toLocaleString('id-ID')} · {t.cashier.name}
                      {t.patient && ` · ${t.patient.name}`}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {t.items.map((item, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {item.medicine.name} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-emerald-700 text-sm">{fmt(t.totalAmount)}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.paymentMethod}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── KATALOG OBAT TAB ── */}
        {tab === 'obat' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={medSearch} onChange={e => setMedSearch(e.target.value)} placeholder="Cari obat..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <button onClick={loadAllMedicines} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => { setSelectedMed(null); setShowMedModal(true); }}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
              >
                <Plus size={15} /> Tambah Obat
              </button>
            </div>

            {loadingMed ? (
              <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Obat</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Kategori</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Satuan</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Harga</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMed.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                        <Package size={32} className="mx-auto mb-2 text-slate-200" />
                        Belum ada obat
                      </td></tr>
                    ) : filteredMed.map(m => (
                      <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900">{m.name}</div>
                          <div className="text-xs text-slate-400 font-mono">{m.code}{m.genericName && ` · ${m.genericName}`}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          {m.category ? (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{m.category}</span>
                          ) : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600 text-sm">{m.unit}</td>
                        <td className="px-4 py-3.5 text-right font-bold text-emerald-700">{fmt(m.price)}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.isActive !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {m.isActive !== false ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => { setSelectedMed(m); setShowMedModal(true); }}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <Pencil size={11} /> Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── KELOLA STOK TAB ── */}
        {tab === 'stok' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={stockSearch} onChange={e => setStockSearch(e.target.value)} placeholder="Cari obat di stok..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
              <button onClick={loadStocks} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
                <RefreshCw size={14} />
              </button>
              <button
                onClick={() => { setSelectedStock(null); setShowStockModal(true); }}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
              >
                <Plus size={15} /> Tambah Stok
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Jenis', value: stocks.length, color: 'text-slate-900' },
                { label: 'Stok Menipis', value: stocks.filter(s => s.quantity <= s.minStock).length, color: stocks.filter(s => s.quantity <= s.minStock).length > 0 ? 'text-red-600' : 'text-slate-900' },
                { label: 'Total Unit', value: stocks.reduce((s, x) => s + x.quantity, 0), color: 'text-emerald-700' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {loadingStock ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Obat</th>
                      {isSuper && <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Cabang</th>}
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Harga</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Stok</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStock.length === 0 ? (
                      <tr><td colSpan={isSuper ? 6 : 5} className="text-center py-12 text-slate-400 text-sm">
                        <Package size={32} className="mx-auto mb-2 text-slate-200" />
                        Belum ada stok
                      </td></tr>
                    ) : filteredStock.map(s => {
                      const isLow = s.quantity <= s.minStock;
                      return (
                        <tr key={s.id} className={`hover:bg-slate-50 transition-colors ${isLow ? 'bg-red-50/30' : ''}`}>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-slate-900">{s.medicine.name}</div>
                            <div className="text-xs text-slate-400 font-mono">{s.medicine.code} · {s.medicine.unit}</div>
                          </td>
                          {isSuper && (
                            <td className="px-4 py-3.5">
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{s.branch.name}</span>
                            </td>
                          )}
                          <td className="px-4 py-3.5 text-right font-semibold text-emerald-700">{fmt(s.medicine.price)}</td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`font-bold ${isLow ? 'text-red-600' : 'text-slate-900'}`}>{s.quantity}</span>
                            <span className="text-slate-400 text-xs ml-1">/{s.minStock}</span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${isLow ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                              {isLow && <AlertTriangle size={9} />}
                              {isLow ? 'Menipis' : 'Aman'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => { setSelectedStock(s); setShowStockModal(true); }}
                              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <ArrowUpDown size={11} /> Sesuaikan
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {receipt && <ReceiptModal transaction={receipt} onClose={() => { setReceipt(null); searchRef.current?.focus(); }} />}

      {showMedModal && (
        <MedicineModal
          medicine={selectedMed}
          onClose={() => setShowMedModal(false)}
          onDone={() => { loadAllMedicines(); loadMedicines(); }}
        />
      )}

      {showStockModal && (
        <StockModal
          medicines={medicines}
          branchId={branchId}
          stock={selectedStock}
          onClose={() => setShowStockModal(false)}
          onDone={() => { loadStocks(); loadMedicines(); }}
        />
      )}
    </div>
  );
}
