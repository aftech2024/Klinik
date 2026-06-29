'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import {
  Search, ShoppingCart, Trash2, Plus, Minus, CreditCard,
  Banknote, Receipt, CheckCircle, X, Package, Clock, BarChart3, RefreshCw
} from 'lucide-react';

type Medicine = {
  id: string; code: string; name: string; genericName?: string;
  category?: string; unit: string; price: number;
  productStocks?: Array<{ quantity: number; branchId: string }>;
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
          {/* Items */}
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

export default function PosPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [paidStr, setPaidStr] = useState('');
  const [payMethod, setPayMethod] = useState<'CASH' | 'TRANSFER' | 'QRIS' | 'CARD'>('CASH');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<Transaction | null>(null);
  const [recentTrx, setRecentTrx] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<{ totalTransactions: number; totalRevenue: number } | null>(null);
  const [tab, setTab] = useState<'kasir' | 'riwayat'>('kasir');
  const user = getUser();
  const searchRef = useRef<HTMLInputElement>(null);

  const branchId = user?.branchId ?? '';

  const loadMedicines = useCallback(async () => {
    const data = await api.get('/api/pharmacy/medicines', { params: { branchId: branchId || undefined } })
      .then(r => r.data ?? []).catch(() => []);
    setMedicines(data);
  }, [branchId]);

  const loadRecent = useCallback(async () => {
    const [trx, sum] = await Promise.all([
      api.get('/api/pos/transactions', { params: { branchId: branchId || undefined, limit: 20 } }).then(r => r.data ?? []).catch(() => []),
      api.get('/api/pos/summary', { params: { branchId: branchId || undefined } }).then(r => r.data).catch(() => null),
    ]);
    setRecentTrx(trx);
    setSummary(sum);
  }, [branchId]);

  useEffect(() => { loadMedicines(); loadRecent(); }, [loadMedicines, loadRecent]);

  const filtered = medicines.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || (m.genericName ?? '').toLowerCase().includes(q);
  });

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
    if (cart.length === 0) return;
    if (paid < total) return;
    setProcessing(true);
    try {
      const res = await api.post('/api/pos/transactions', {
        branchId: branchId || undefined,
        items: cart.map(i => ({ medicineId: i.medicine.id, quantity: i.quantity, unitPrice: i.medicine.price })),
        paidAmount: paid,
        paymentMethod: payMethod,
      });
      setReceipt(res.data);
      setCart([]);
      setPaidStr('');
      loadMedicines();
      loadRecent();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Transaksi gagal');
    } finally { setProcessing(false); }
  }

  function closeReceipt() {
    setReceipt(null);
    searchRef.current?.focus();
  }

  return (
    <div>
      <Header title="Kasir / POS" />
      <div className="p-4 lg:p-6">

        {/* Tab toggle */}
        <div className="flex gap-2 mb-5">
          {([['kasir', 'Kasir', ShoppingCart], ['riwayat', 'Riwayat', Clock]] as const).map(([key, label, Icon]) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${tab === key ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
          {summary && (
            <div className="ml-auto flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><BarChart3 size={14} /> {summary.totalTransactions} trx hari ini</span>
              <span className="font-semibold text-emerald-700">{fmt(summary.totalRevenue)}</span>
            </div>
          )}
        </div>

        {tab === 'kasir' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Product panel */}
            <div className="lg:col-span-3 space-y-4">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari obat (nama / kode)..."
                  className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filtered.slice(0, 24).map(m => {
                  const stock = getStock(m);
                  const inCart = cart.find(i => i.medicine.id === m.id)?.quantity ?? 0;
                  const outOfStock = stock <= 0;
                  return (
                    <button
                      key={m.id}
                      onClick={() => addToCart(m)}
                      disabled={outOfStock}
                      className={`text-left p-4 rounded-xl border transition-all ${outOfStock ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' : inCart > 0 ? 'bg-emerald-50 border-emerald-300 hover:border-emerald-400' : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm'}`}
                    >
                      <div className="flex items-start justify-between mb-1.5">
                        <Package size={16} className={inCart > 0 ? 'text-emerald-600' : 'text-slate-400'} />
                        {inCart > 0 && (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">{inCart}</span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-900 text-sm leading-tight line-clamp-2">{m.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{m.code}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-bold text-emerald-700">{fmt(m.price)}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${outOfStock ? 'bg-red-100 text-red-600' : stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                          {outOfStock ? 'Habis' : `${stock} ${m.unit}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="col-span-3 py-16 text-center text-slate-400">
                    <Package size={32} className="mx-auto mb-2 text-slate-200" />
                    <p className="text-sm">Obat tidak ditemukan</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cart panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 sticky top-6">
                {/* Cart header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <h2 className="font-bold text-slate-900 flex items-center gap-2">
                    <ShoppingCart size={17} /> Keranjang
                    {cart.length > 0 && <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">{cart.length}</span>}
                  </h2>
                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                      <Trash2 size={13} /> Kosongkan
                    </button>
                  )}
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="py-10 text-center text-slate-300">
                      <ShoppingCart size={32} className="mx-auto mb-2" />
                      <p className="text-sm">Keranjang kosong</p>
                    </div>
                  ) : cart.map(item => (
                    <div key={item.medicine.id} className="px-5 py-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 truncate">{item.medicine.name}</div>
                        <div className="text-xs text-slate-400">{fmt(item.medicine.price)} / {item.medicine.unit}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => { if (item.quantity === 1) removeFromCart(item.medicine.id); else updateQty(item.medicine.id, -1); }} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                          <Minus size={11} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                        <button onClick={() => updateQty(item.medicine.id, 1)} className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                          <Plus size={11} />
                        </button>
                      </div>
                      <div className="text-sm font-bold text-slate-900 w-20 text-right">{fmt(item.medicine.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                {/* Summary + Payment */}
                <div className="p-5 space-y-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                    <span>Total</span><span className="text-emerald-700">{fmt(total)}</span>
                  </div>

                  {/* Payment method */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Metode Bayar</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['CASH', 'TRANSFER', 'QRIS', 'CARD'] as const).map(m => (
                        <button key={m} onClick={() => setPayMethod(m)} className={`flex items-center gap-1.5 py-2 text-xs font-semibold rounded-xl border justify-center transition-colors ${payMethod === m ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                          {m === 'CASH' && <Banknote size={13} />}
                          {m === 'CARD' && <CreditCard size={13} />}
                          {m === 'TRANSFER' && <Receipt size={13} />}
                          {m === 'QRIS' && <BarChart3 size={13} />}
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paid amount */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah Bayar</label>
                    <input
                      type="number"
                      value={paidStr}
                      onChange={e => setPaidStr(e.target.value)}
                      placeholder={`Min. ${fmt(total)}`}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {/* Quick amounts */}
                    {payMethod === 'CASH' && total > 0 && (
                      <div className="grid grid-cols-3 gap-1.5 mt-2">
                        {[total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000].filter((v, i, a) => a.indexOf(v) === i).map(v => (
                          <button key={v} onClick={() => setPaidStr(String(v))} className="text-xs py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-700 font-medium">
                            {fmt(v)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Change */}
                  {paid > 0 && (
                    <div className={`flex justify-between text-sm font-semibold px-3 py-2 rounded-xl ${change >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                      <span>Kembalian</span>
                      <span>{change >= 0 ? fmt(change) : '— kurang'}</span>
                    </div>
                  )}

                  <button
                    onClick={checkout}
                    disabled={cart.length === 0 || paid < total || processing}
                    className="w-full py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
                  >
                    {processing ? 'Memproses...' : `Bayar ${cart.length > 0 ? fmt(total) : ''}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Riwayat tab */
          <div className="space-y-4">
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
              <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
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
                    <div className="font-bold text-emerald-700">{fmt(t.totalAmount)}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{t.paymentMethod}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {receipt && <ReceiptModal transaction={receipt} onClose={closeReceipt} />}
    </div>
  );
}
