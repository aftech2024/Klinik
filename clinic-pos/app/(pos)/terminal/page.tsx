'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import api from '@/lib/api';
import { getUser, getActiveBranchId } from '@/lib/auth';
import {
  Search, Trash2, Plus, Minus, X, CheckCircle2,
  Banknote, CreditCard, Smartphone, Building2,
  Package, Bell, Calendar,
  AlertCircle, Printer, ChevronRight,
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

const GREEN = '#3DB549';

function fmt(n: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));
}
function fmtShort(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}rb`;
  return String(n);
}

// ── Receipt Modal ─────────────────────────────────────────────────────────────
function ReceiptModal({ trx, onClose }: { trx: Transaction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xs">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10"
          style={{ background: GREEN, boxShadow: `0 4px 16px ${GREEN}40` }}>
          <CheckCircle2 size={24} className="text-white" />
        </div>
        <div className="bg-white rounded-2xl pt-8 overflow-hidden shadow-2xl">
          <div className="text-center px-6 pb-4 border-b border-dashed border-slate-200">
            <div className="font-bold text-base text-slate-800">aftech Klinik</div>
            {trx.branch && <div className="text-slate-500 text-xs mt-0.5">{trx.branch.name}</div>}
            <div className="text-slate-400 text-xs mt-1">{new Date(trx.createdAt).toLocaleString('id-ID')}</div>
            <div className="mt-2 font-mono text-xs text-slate-500 bg-slate-50 rounded px-2 py-1 inline-block">{trx.transactionNo}</div>
          </div>
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
          <div className="px-6 py-4 space-y-2 border-b border-dashed border-slate-200">
            <div className="flex justify-between text-sm text-slate-600"><span>Subtotal</span><span>{fmt(trx.totalAmount)}</span></div>
            <div className="flex justify-between font-bold text-base text-slate-900">
              <span>TOTAL</span><span style={{ color: GREEN }}>{fmt(trx.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Bayar ({trx.paymentMethod})</span><span>{fmt(trx.paidAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-blue-600">
              <span>Kembalian</span><span>{fmt(trx.changeAmount)}</span>
            </div>
          </div>
          <div className="px-6 py-3 text-center">
            <div className="text-xs text-slate-400">Kasir: {trx.cashier.name}</div>
            <div className="text-xs text-slate-300 mt-1">Terima kasih atas kunjungan Anda</div>
            <div className="flex justify-center gap-px mt-3 mb-1">
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-sm" style={{ width: i % 3 === 0 ? 3 : 1, height: 24 + (i % 4) * 4 }} />
              ))}
            </div>
          </div>
          <div className="p-4 bg-slate-50 flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-white font-medium">
              <Printer size={14} /> Print
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 text-white font-bold rounded-xl text-sm" style={{ background: GREEN }}>
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
  const [orderNum, setOrderNum] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);

  const [user, setUserState] = useState<ReturnType<typeof getUser>>(null);
  const [branchId, setBranchId] = useState('');

  useEffect(() => {
    const u = getUser();
    setUserState(u);
    setBranchId(getActiveBranchId() ?? u?.branchId ?? '');
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

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const firstName = user?.name?.split(' ')[0] ?? 'Kasir';
  const roleLabel = user?.role === 'CASHIER' ? 'Kasir' : user?.role === 'ADMIN' ? 'Admin' : 'Super Admin';
  const initials = user ? (user.name || user.email || 'U').slice(0, 2).toUpperCase() : 'U';

  const quickAmounts = total > 0
    ? Array.from(new Set([
        total,
        Math.ceil(total / 5000) * 5000,
        Math.ceil(total / 10000) * 10000,
        Math.ceil(total / 50000) * 50000,
        Math.ceil(total / 100000) * 100000,
      ].filter(v => v >= total))).slice(0, 4)
    : [];

  /* ── JSX ── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f1f5f9', flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Hi, {firstName}, ini transaksi hari ini!
          </h1>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0' }}>{today}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {summary && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{summary.totalTransactions} transaksi</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: GREEN }}>{fmt(summary.totalRevenue)}</div>
            </div>
          )}

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
              <Bell size={18} />
            </button>
            <span style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
          </div>

          {/* User */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Hi, I&apos;m {roleLabel}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b' }}>{user?.name || 'User'}</div>
            </div>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
              {initials}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT: Products */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid #f1f5f9' }}>

          {/* Search + tabs */}
          <div style={{ padding: '16px 24px 12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <h2 style={{ flex: 1, fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Pilih Produk</h2>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari produk..."
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, paddingLeft: 32, paddingRight: 16, paddingTop: 8, paddingBottom: 8, fontSize: '0.8rem', color: '#334155', width: 200, outline: 'none' }}
                  onFocus={e => { e.target.style.borderColor = GREEN; e.target.style.background = '#fff'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: '0.8rem', color: '#475569' }}>
                <Calendar size={13} /><span>Hari Ini</span>
              </div>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }} className="scrollbar-hide">
              {categories.map(c => {
                const count = c === 'Semua' ? medicines.length : medicines.filter(m => m.category === c).length;
                const active = category === c;
                return (
                  <button key={c} onClick={() => setCategory(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: 600, flexShrink: 0,
                      background: active ? GREEN : '#f1f5f9',
                      color: active ? '#fff' : '#64748b',
                      transition: 'all 0.15s',
                    }}>
                    {c}
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: active ? 'rgba(255,255,255,0.25)' : '#e2e8f0', color: active ? '#fff' : '#64748b' }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product grid */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 20px' }} className="scrollbar-hide">
            {filtered.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 180, color: '#94a3b8' }}>
                <Package size={36} style={{ marginBottom: 12, color: '#cbd5e1' }} />
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{search ? `"${search}" tidak ditemukan` : 'Belum ada stok obat'}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
                {filtered.map(m => {
                  const stock = stockOf(m);
                  const inCart = cart.find(i => i.medicine.id === m.id)?.quantity ?? 0;
                  const out = stock <= 0;
                  const low = !out && stock <= 5;

                  return (
                    <button key={m.id} onClick={() => addToCart(m)} disabled={out}
                      style={{
                        textAlign: 'left', border: 'none', cursor: out ? 'not-allowed' : 'pointer',
                        borderRadius: 16, padding: 16,
                        background: inCart > 0 ? '#f0fdf4' : '#fff',
                        boxShadow: inCart > 0
                          ? `0 0 0 2px ${GREEN}, 0 4px 12px rgba(61,181,73,0.12)`
                          : '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px #f1f5f9',
                        opacity: out ? 0.45 : 1,
                        transition: 'all 0.15s',
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', lineHeight: 1.35, flex: 1, paddingRight: 8 }}>{m.name}</div>
                        <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#94a3b8', flexShrink: 0 }}>#{m.code}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: '#94a3b8', marginBottom: 12 }}>
                        <Package size={11} />
                        <span>{m.unit}</span>
                        {m.category && <><span>·</span><span>{m.category}</span></>}
                      </div>
                      <div style={{ borderTop: '1px dashed #e2e8f0', marginBottom: 12 }} />
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: GREEN }}>{fmt(m.price)}</div>
                        <div style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 999, background: out ? '#fee2e2' : low ? '#fef3c7' : '#f1f5f9', color: out ? '#ef4444' : low ? '#d97706' : '#64748b' }}>
                          {out ? 'Habis' : low ? `⚠ ${stock}` : `stok ${stock}`}
                        </div>
                      </div>
                      {inCart > 0 && (
                        <div style={{ marginTop: 8, fontSize: '0.72rem', fontWeight: 600, color: GREEN, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={12} /> {inCart}× ditambahkan
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Cart + Payment */}
        <div style={{ width: 360, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>

          {/* Cart header */}
          <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #e2e8f0', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Order #{String(orderNum).padStart(3, '0')}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginTop: 2 }}>
                  {cart.length === 0
                    ? <span style={{ color: '#cbd5e1' }}>Keranjang kosong</span>
                    : <span>{cart.length} item · <span style={{ color: GREEN }}>{fmt(total)}</span></span>
                  }
                </div>
              </div>
              {cart.length > 0 && (
                <button onClick={() => { setCart([]); setPaidStr(''); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={12} /> Hapus
                </button>
              )}
            </div>
          </div>

          {/* Cart items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px', minHeight: 0 }} className="scrollbar-hide">
            {cart.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 100, color: '#cbd5e1' }}>
                <Package size={26} style={{ marginBottom: 8 }} />
                <p style={{ fontSize: '0.75rem', margin: 0 }}>Klik produk untuk menambahkan</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cart.map((item, idx) => (
                  <div key={item.medicine.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 12, background: '#fff', border: '1px solid #f1f5f9' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: '#f1f5f9', color: '#64748b', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{idx + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.medicine.name}</div>
                      <div style={{ fontSize: '0.7rem', color: GREEN }}>{fmt(item.medicine.price)} <span style={{ color: '#94a3b8' }}>/{item.medicine.unit}</span></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button onClick={() => updateQty(item.medicine.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Minus size={10} /></button>
                      <input type="number" value={item.quantity} onChange={e => setQty(item.medicine.id, parseInt(e.target.value) || 0)}
                        style={{ width: 28, textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', background: 'none', border: 'none', outline: 'none' }} />
                      <button onClick={() => updateQty(item.medicine.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}><Plus size={10} /></button>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', width: 64, textAlign: 'right', flexShrink: 0 }}>{fmt(item.medicine.price * item.quantity)}</div>
                    <button onClick={() => setCart(p => p.filter(i => i.medicine.id !== item.medicine.id))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: 0, display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#cbd5e1')}>
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment panel */}
          <div style={{ flexShrink: 0, borderTop: '1px solid #e2e8f0' }}>

            {/* Total bar */}
            <div style={{ padding: '12px 20px', background: '#f0fdf4', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Total Bayar</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: GREEN }}>{fmt(total)}</span>
            </div>

            {/* Pay methods */}
            <div style={{ padding: '12px 16px 8px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {PAY_METHODS.map(({ key, label, icon: Icon }) => {
                const active = payMethod === key;
                return (
                  <button key={key} onClick={() => setPayMethod(key as typeof payMethod)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                      padding: '10px 4px', borderRadius: 12,
                      border: active ? 'none' : '1px solid #e2e8f0',
                      background: active ? GREEN : '#fff',
                      color: active ? '#fff' : '#64748b',
                      cursor: 'pointer', transition: 'all 0.15s',
                      boxShadow: active ? `0 4px 12px ${GREEN}30` : 'none',
                    }}>
                    <Icon size={16} />
                    <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Input + numpad */}
            <div style={{ padding: '0 16px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Display */}
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Rp</span>
                  <span style={{ flex: 1, textAlign: 'right', fontSize: '1.1rem', fontWeight: 700, color: paidStr ? '#1e293b' : '#cbd5e1' }}>
                    {paidStr ? parseInt(paidStr).toLocaleString('id-ID') : '0'}
                  </span>
                </div>
                <button onClick={() => setPaidStr('')}
                  style={{ width: 40, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#94a3b8'; }}>
                  <X size={13} />
                </button>
              </div>

              {/* Quick amounts */}
              {quickAmounts.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                  {quickAmounts.map(v => (
                    <button key={v} onClick={() => setPaidStr(String(v))}
                      style={{ padding: '6px 4px', fontSize: '0.7rem', fontWeight: 700, borderRadius: 8, border: '1px solid', borderColor: paid === v ? GREEN : '#e2e8f0', background: paid === v ? `${GREEN}15` : '#fff', color: paid === v ? GREEN : '#64748b', cursor: 'pointer' }}>
                      {fmtShort(v)}
                    </button>
                  ))}
                </div>
              )}

              {/* Numpad */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {NUMPAD.map(k => (
                  <button key={k} onClick={() => numpadPress(k)}
                    style={{ padding: '10px 0', borderRadius: 10, border: '1px solid', borderColor: k === '⌫' ? '#fde68a' : '#e2e8f0', background: k === '⌫' ? '#fffbeb' : '#fff', color: k === '⌫' ? '#d97706' : '#1e293b', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.1s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = k === '⌫' ? '#fef3c7' : '#f8fafc'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = k === '⌫' ? '#fffbeb' : '#fff'; }}>
                    {k}
                  </button>
                ))}
              </div>

              {/* Change */}
              {paid > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 12, background: change >= 0 ? '#eff6ff' : '#fef2f2', border: `1px solid ${change >= 0 ? '#bfdbfe' : '#fecaca'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {change < 0 && <AlertCircle size={13} style={{ color: '#ef4444' }} />}
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: change >= 0 ? '#3b82f6' : '#ef4444' }}>
                      {change >= 0 ? 'Kembalian' : 'Kurang'}
                    </span>
                  </div>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: change >= 0 ? '#3b82f6' : '#ef4444' }}>{fmt(Math.abs(change))}</span>
                </div>
              )}

              {/* Pay button */}
              <button onClick={checkout} disabled={!canPay || processing}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
                  background: canPay && !processing ? GREEN : '#e2e8f0',
                  color: canPay && !processing ? '#fff' : '#94a3b8',
                  fontWeight: 800, fontSize: '0.9rem',
                  cursor: canPay && !processing ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: canPay && !processing ? `0 4px 16px ${GREEN}35` : 'none',
                  transition: 'all 0.15s',
                }}>
                {processing ? (
                  <>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                    Memproses...
                  </>
                ) : canPay ? (
                  <> Bayar {fmt(total)} <ChevronRight size={18} /> </>
                ) : cart.length === 0 ? 'Pilih item terlebih dahulu' : 'Jumlah bayar kurang'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {receipt && <ReceiptModal trx={receipt} onClose={() => { setReceipt(null); searchRef.current?.focus(); }} />}
    </div>
  );
}
