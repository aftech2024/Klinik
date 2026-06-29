'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { getUser, getActiveBranchId } from '@/lib/auth';
import {
  Search, Trash2, Plus, Minus, X, CheckCircle2,
  Banknote, CreditCard, Smartphone, Building2,
  Package, Clock, TrendingUp, ChevronRight,
  AlertCircle, Printer
} from 'lucide-react';

type Medicine = {
  id: string; code: string; name: string; unit: string; price: number; category?: string;
  productStocks?: Array<{ quantity: number; branchId: string }>;
};
type CartItem = { medicine: Medicine; quantity: number };
type Transaction = {
  id: string; transactionNo: string; totalAmount: number; paidAmount: number;
  changeAmount: number; paymentMethod: string; createdAt: string;
  items: Array<{ medicine: { name: string; unit: string }; quantity: number; unitPrice: number; subtotal: number }>;
  cashier: { name: string };
  branch?: { name: string; address?: string };
};

const PAY_METHODS = [
  { key: 'CASH', label: 'Tunai', icon: Banknote },
  { key: 'QRIS', label: 'QRIS', icon: Smartphone },
  { key: 'TRANSFER', label: 'Transfer', icon: Building2 },
  { key: 'CARD', label: 'Kartu', icon: CreditCard },
] as const;

const NUMPAD = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '000', '0', '⌫'] as const;

function fmt(n: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));
}

function fmtShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return String(n);
}

// ── Receipt Modal (thermal style) ────────────────────────────────────────────
function ReceiptModal({ trx, onClose }: { trx: Transaction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xs">
        {/* Success animation ring */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 z-10">
          <CheckCircle2 size={24} className="text-white" />
        </div>

        {/* Receipt paper */}
        <div className="bg-white rounded-2xl pt-8 overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="text-center px-6 pb-4 border-b border-dashed border-slate-200">
            <div className="text-slate-800 font-bold text-base">aftech Klinik</div>
            {trx.branch && <div className="text-slate-500 text-xs mt-0.5">{trx.branch.name}</div>}
            <div className="text-slate-400 text-xs mt-1">{new Date(trx.createdAt).toLocaleString('id-ID')}</div>
            <div className="mt-2 font-mono text-xs text-slate-500 bg-slate-50 rounded px-2 py-1 inline-block">{trx.transactionNo}</div>
          </div>

          {/* Items */}
          <div className="px-6 py-4 space-y-2 border-b border-dashed border-slate-200">
            {trx.items.map((it, i) => (
              <div key={i} className="flex justify-between text-sm text-slate-700">
                <div className="flex-1 min-w-0 pr-2">
                  <div className="font-medium truncate">{it.medicine.name}</div>
                  <div className="text-xs text-slate-400">{it.quantity} × {fmt(it.unitPrice)}</div>
                </div>
                <div className="font-semibold text-slate-900 flex-shrink-0">{fmt(it.subtotal)}</div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-6 py-4 space-y-2 border-b border-dashed border-slate-200">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Subtotal</span><span>{fmt(trx.totalAmount)}</span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate-900">
              <span>TOTAL</span><span className="text-emerald-600">{fmt(trx.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Bayar ({trx.paymentMethod})</span><span>{fmt(trx.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-blue-600">
              <span>Kembalian</span><span>{fmt(trx.changeAmount)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 text-center">
            <div className="text-xs text-slate-400">Kasir: {trx.cashier.name}</div>
            <div className="text-xs text-slate-300 mt-1">Terima kasih atas kunjungan Anda</div>
            {/* Barcode decoration */}
            <div className="flex justify-center gap-px mt-3 mb-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="bg-slate-300 rounded-sm" style={{ width: i % 3 === 0 ? 3 : 1, height: 24 + (i % 4) * 4 }} />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 bg-slate-50 flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-white font-medium">
              <Printer size={14} /> Print
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm">
              Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Terminal ─────────────────────────────────────────────────────────────
export default function TerminalPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [paidStr, setPaidStr] = useState('');
  const [payMethod, setPayMethod] = useState<'CASH' | 'QRIS' | 'TRANSFER' | 'CARD'>('CASH');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<Transaction | null>(null);
  const [summary, setSummary] = useState<{ totalTransactions: number; totalRevenue: number } | null>(null);
  const [clock, setClock] = useState('');
  const [orderNum, setOrderNum] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);

  const [user, setUserState] = useState<ReturnType<typeof getUser>>(null);
  const [branchId, setBranchId] = useState('');
  const branchName = user?.branch?.name ?? 'Klinik';

  useEffect(() => {
    const u = getUser();
    setUserState(u);
    setBranchId(getActiveBranchId() ?? u?.branchId ?? '');
  }, []);

  // Real-time clock
  useEffect(() => {
    function tick() {
      setClock(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const loadMedicines = useCallback(async () => {
    const data = await api.get('/api/pharmacy/medicines', { params: { branchId: branchId || undefined } })
      .then(r => r.data ?? []).catch(() => []);
    setMedicines(data);
  }, [branchId]);

  const loadSummary = useCallback(async () => {
    const s = await api.get('/api/pos/summary', { params: { branchId: branchId || undefined } })
      .then(r => r.data).catch(() => null);
    setSummary(s);
  }, [branchId]);

  useEffect(() => { loadMedicines(); loadSummary(); }, [loadMedicines, loadSummary]);

  // Categories
  const categories = ['Semua', ...Array.from(new Set(medicines.map(m => m.category).filter(Boolean) as string[]))];

  const filtered = medicines.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'Semua' || m.category === category;
    return matchSearch && matchCat;
  });

  function stockOf(m: Medicine) {
    if (!m.productStocks?.length) return 0;
    const s = branchId ? m.productStocks.find(s => s.branchId === branchId) : m.productStocks[0];
    return s?.quantity ?? 0;
  }

  function addToCart(med: Medicine) {
    const stock = stockOf(med);
    if (stock <= 0) return;
    setCart(prev => {
      const ex = prev.find(i => i.medicine.id === med.id);
      if (ex) {
        if (ex.quantity >= stock) return prev;
        return prev.map(i => i.medicine.id === med.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { medicine: med, quantity: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.flatMap(i => {
      if (i.medicine.id !== id) return [i];
      const q = i.quantity + delta;
      return q <= 0 ? [] : [{ ...i, quantity: q }];
    }));
  }

  function setQty(id: string, val: number) {
    if (val <= 0) { setCart(prev => prev.filter(i => i.medicine.id !== id)); return; }
    setCart(prev => prev.map(i => i.medicine.id === id ? { ...i, quantity: val } : i));
  }

  function numpadPress(key: string) {
    if (key === '⌫') { setPaidStr(p => p.slice(0, -1)); return; }
    if (key === 'C' || key === 'CLR') { setPaidStr(''); return; }
    setPaidStr(p => {
      const next = p + key;
      return parseInt(next) > 999_999_999 ? p : next;
    });
  }

  const total = cart.reduce((s, i) => s + i.medicine.price * i.quantity, 0);
  const paid = parseInt(paidStr) || 0;
  const change = paid - total;
  const canPay = cart.length > 0 && paid >= total;

  async function checkout() {
    if (!canPay || processing) return;
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
      setOrderNum(n => n + 1);
      loadMedicines();
      loadSummary();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Transaksi gagal');
    } finally { setProcessing(false); }
  }

  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  // Quick cash amounts
  const quickAmounts = total > 0
    ? Array.from(new Set([total, Math.ceil(total / 5000) * 5000, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000, Math.ceil(total / 100000) * 100000].filter(v => v >= total))).slice(0, 4)
    : [];

  return (
    <div className="flex flex-col h-screen bg-[#0a0f1e]">

      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <header className="flex items-center px-5 py-3 bg-[#0d1424] border-b border-slate-800/60 gap-4 flex-shrink-0">
        {/* Branch */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center flex-shrink-0">
            <Building2 size={14} className="text-emerald-400" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{branchName}</div>
            <div className="text-[11px] text-slate-500">{user?.name ?? 'Kasir'}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-slate-800 mx-1 flex-shrink-0" />

        {/* Date + Clock */}
        <div className="flex items-center gap-3 text-slate-400">
          <div className="text-xs hidden md:block">{today}</div>
          <div className="flex items-center gap-1.5 bg-slate-800/60 rounded-lg px-3 py-1.5">
            <Clock size={12} className="text-emerald-400" />
            <span className="font-mono text-sm font-semibold text-white tabular-nums">{clock}</span>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Session stats */}
        {summary && (
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/40 rounded-xl px-4 py-2 border border-slate-700/50">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="text-xs text-slate-400">{summary.totalTransactions} transaksi</span>
              <div className="w-px h-4 bg-slate-700" />
              <span className="text-sm font-bold text-emerald-400">{fmt(summary.totalRevenue)}</span>
            </div>
          </div>
        )}

        {/* Order badge */}
        <div className="flex items-center gap-2 bg-emerald-600/10 border border-emerald-600/20 rounded-xl px-3 py-2 flex-shrink-0">
          <span className="text-xs text-emerald-400 font-medium">Order</span>
          <span className="text-sm font-bold text-emerald-300">#{String(orderNum).padStart(3, '0')}</span>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Products ────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-800/60">

          {/* Search + Filter */}
          <div className="px-5 pt-4 pb-3 space-y-3 flex-shrink-0">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                ref={searchRef}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama / kode obat..."
                className="w-full bg-slate-900/80 border border-slate-700/60 text-white rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 placeholder-slate-600 transition-all"
              />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full flex-shrink-0 transition-all ${
                    category === c
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60 border border-slate-700/60'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          <div className="flex-1 overflow-y-auto px-5 pb-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-600">
                <Package size={36} className="mb-3 text-slate-700" />
                <p className="text-sm">{search ? `"${search}" tidak ditemukan` : 'Belum ada stok obat'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                {filtered.map(m => {
                  const stock = stockOf(m);
                  const inCart = cart.find(i => i.medicine.id === m.id)?.quantity ?? 0;
                  const out = stock <= 0;
                  const low = !out && stock <= 5;

                  return (
                    <button
                      key={m.id}
                      onClick={() => addToCart(m)}
                      disabled={out}
                      className={`relative rounded-2xl p-4 text-left transition-all duration-150 group ${
                        out
                          ? 'bg-slate-900/30 border border-slate-800/40 opacity-40 cursor-not-allowed'
                          : inCart > 0
                            ? 'bg-gradient-to-br from-emerald-950/80 to-emerald-900/40 border-2 border-emerald-500/60 shadow-lg shadow-emerald-900/30'
                            : 'bg-slate-900/60 border border-slate-800/60 hover:border-slate-600/60 hover:bg-slate-800/60 hover:shadow-lg hover:shadow-slate-900/50'
                      }`}
                    >
                      {/* Badge: in-cart qty */}
                      {inCart > 0 && (
                        <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-md shadow-emerald-500/40">
                          {inCart}
                        </div>
                      )}
                      {/* Badge: low stock */}
                      {low && !out && (
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400 shadow-sm shadow-amber-400/60" />
                      )}

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                        inCart > 0 ? 'bg-emerald-500/20' : 'bg-slate-800/60'
                      }`}>
                        <Package size={16} className={inCart > 0 ? 'text-emerald-400' : 'text-slate-500'} />
                      </div>

                      <div className="text-sm font-semibold text-white leading-snug line-clamp-2 min-h-[2.5rem]">{m.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{m.code}</div>

                      <div className="mt-3 flex items-end justify-between">
                        <div>
                          <div className="text-base font-bold text-emerald-400">{fmt(m.price)}</div>
                          <div className="text-[10px] text-slate-500">/{m.unit}</div>
                        </div>
                        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          out ? 'bg-red-950 text-red-400 border border-red-900/60'
                          : low ? 'bg-amber-950 text-amber-400 border border-amber-900/60'
                          : 'bg-slate-800 text-slate-500'
                        }`}>
                          {out ? '✕ Habis' : low ? `⚠ ${stock}` : stock}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Order + Payment ────────────────────────────────── */}
        <div className="w-[380px] flex-shrink-0 flex flex-col bg-[#0d1424]">

          {/* Order header */}
          <div className="px-5 pt-4 pb-3 border-b border-slate-800/60 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Order Saat Ini</div>
                <div className="text-lg font-bold text-white mt-0.5 flex items-center gap-2">
                  {cart.length === 0 ? (
                    <span className="text-slate-600">Keranjang kosong</span>
                  ) : (
                    <span>{cart.length} item · <span className="text-emerald-400">{fmt(total)}</span></span>
                  )}
                </div>
              </div>
              {cart.length > 0 && (
                <button onClick={() => { setCart([]); setPaidStr(''); }} className="flex items-center gap-1 text-xs text-red-500/80 hover:text-red-400 transition-colors">
                  <Trash2 size={12} /> Hapus
                </button>
              )}
            </div>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-700">
                <Package size={28} className="mb-2" />
                <p className="text-xs">Klik produk untuk menambahkan</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {cart.map((item, idx) => (
                  <div key={item.medicine.id} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 border border-slate-800/40 group transition-all">
                    {/* Index */}
                    <div className="w-5 h-5 rounded-md bg-slate-800 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </div>
                    {/* Name + price */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">{item.medicine.name}</div>
                      <div className="text-xs text-emerald-400">{fmt(item.medicine.price)} <span className="text-slate-500">/{item.medicine.unit}</span></div>
                    </div>
                    {/* Qty controls */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => updateQty(item.medicine.id, -1)} className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <Minus size={10} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => setQty(item.medicine.id, parseInt(e.target.value) || 0)}
                        className="w-8 text-center text-sm font-bold text-white bg-transparent focus:outline-none"
                      />
                      <button onClick={() => updateQty(item.medicine.id, 1)} className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                        <Plus size={10} />
                      </button>
                    </div>
                    {/* Subtotal */}
                    <div className="text-sm font-bold text-white w-16 text-right flex-shrink-0">{fmt(item.medicine.price * item.quantity)}</div>
                    {/* Remove */}
                    <button onClick={() => setCart(p => p.filter(i => i.medicine.id !== item.medicine.id))} className="opacity-0 group-hover:opacity-100 ml-1 text-slate-600 hover:text-red-400 transition-all flex-shrink-0">
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Payment panel ──────────────────────────────────────── */}
          <div className="flex-shrink-0 border-t border-slate-800/60">

            {/* Total bar */}
            <div className="px-5 py-3 bg-gradient-to-r from-emerald-950/60 to-emerald-900/20 border-b border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-medium">Total Bayar</span>
                <span className="text-2xl font-bold text-emerald-400 tabular-nums">{fmt(total)}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="px-4 pt-3 pb-2 grid grid-cols-4 gap-2">
              {PAY_METHODS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setPayMethod(key as typeof payMethod)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all text-center ${
                    payMethod === key
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-[10px] font-semibold">{label}</span>
                </button>
              ))}
            </div>

            {/* Paid display + numpad */}
            <div className="px-4 pb-3 space-y-3">
              {/* Paid amount display */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span className="text-slate-500 text-sm">Rp</span>
                  <span className="flex-1 text-right text-xl font-bold tabular-nums text-white">
                    {paidStr ? parseInt(paidStr).toLocaleString('id-ID') : <span className="text-slate-700">0</span>}
                  </span>
                </div>
                <button onClick={() => setPaidStr('')} className="w-10 h-10 flex-shrink-0 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-500 hover:text-red-400 hover:border-red-800/60 transition-colors">
                  <X size={14} />
                </button>
              </div>

              {/* Quick amounts */}
              {quickAmounts.length > 0 && (
                <div className="grid grid-cols-4 gap-1.5">
                  {quickAmounts.map(v => (
                    <button
                      key={v}
                      onClick={() => setPaidStr(String(v))}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        paid === v
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-emerald-600/50 hover:text-emerald-400'
                      }`}
                    >
                      {fmtShort(v)}
                    </button>
                  ))}
                </div>
              )}

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-1.5">
                {NUMPAD.map(k => (
                  <button
                    key={k}
                    onClick={() => numpadPress(k)}
                    className={`py-3 rounded-xl font-bold text-base transition-all active:scale-95 ${
                      k === '⌫'
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-900/40 hover:bg-amber-900/60 col-span-1'
                        : 'bg-slate-800/60 text-white border border-slate-700/40 hover:bg-slate-700/60'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>

              {/* Change */}
              {paid > 0 && (
                <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border ${
                  change >= 0
                    ? 'bg-blue-950/40 border-blue-900/40'
                    : 'bg-red-950/40 border-red-900/40'
                }`}>
                  <div className="flex items-center gap-2">
                    {change < 0 && <AlertCircle size={14} className="text-red-400" />}
                    <span className={`text-sm font-medium ${change >= 0 ? 'text-blue-300' : 'text-red-400'}`}>
                      {change >= 0 ? 'Kembalian' : 'Kurang'}
                    </span>
                  </div>
                  <span className={`text-lg font-bold tabular-nums ${change >= 0 ? 'text-blue-300' : 'text-red-400'}`}>
                    {fmt(Math.abs(change))}
                  </span>
                </div>
              )}

              {/* Pay button */}
              <button
                onClick={checkout}
                disabled={!canPay || processing}
                className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                  canPay && !processing
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/20 active:scale-[0.99]'
                    : 'bg-slate-800/60 text-slate-600 cursor-not-allowed border border-slate-700/40'
                }`}
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : canPay ? (
                  <>
                    Bayar {fmt(total)}
                    <ChevronRight size={18} />
                  </>
                ) : cart.length === 0 ? (
                  'Pilih item terlebih dahulu'
                ) : (
                  'Jumlah bayar kurang'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {receipt && <ReceiptModal trx={receipt} onClose={() => { setReceipt(null); searchRef.current?.focus(); }} />}
    </div>
  );
}
