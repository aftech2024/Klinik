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

const GREEN = '#3DB549';

function fmt(n: number | string) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(n));
}

const today = new Date().toISOString().split('T')[0];

const INPUT_STYLE: React.CSSProperties = {
  background: '#f8fafc', border: '1px solid #e2e8f0',
  borderRadius: 12, padding: '8px 14px',
  fontSize: '0.8rem', color: '#334155', outline: 'none',
};

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
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto' }} className="scrollbar-hide">

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Riwayat Transaksi</h1>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 3 }}>Semua transaksi POS</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari no. / kasir..."
            style={{ ...INPUT_STYLE, paddingLeft: 32, width: 200 }}
            onFocus={e => { e.target.style.borderColor = GREEN; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
          />
        </div>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} style={INPUT_STYLE}
          onFocus={e => { e.target.style.borderColor = GREEN; }}
          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
        />
        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>–</span>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} style={INPUT_STYLE}
          onFocus={e => { e.target.style.borderColor = GREEN; }}
          onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
        />
        <button onClick={load} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          <RefreshCw size={14} />
        </button>

        {/* Summary chip */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '8px 14px' }}>
          <BarChart3 size={14} style={{ color: GREEN }} />
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{filtered.length} trx</span>
          <span style={{ fontWeight: 700, color: GREEN }}>{fmt(totalRevenue)}</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ height: 72, background: '#f1f5f9', borderRadius: 16, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20, padding: 48, textAlign: 'center' }}>
          <Clock size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Belum ada transaksi.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(t => (
            <div key={t.id} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <button
                onClick={() => setExpanded(p => p === t.id ? null : t.id)}
                style={{ width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{t.transactionNo}</span>
                    <span style={{ fontSize: '0.7rem', background: '#f1f5f9', color: '#64748b', padding: '2px 8px', borderRadius: 999 }}>{t.paymentMethod}</span>
                    {t.patient && <span style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#3b82f6', padding: '2px 8px', borderRadius: 999 }}>{t.patient.name}</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 3 }}>
                    {new Date(t.createdAt).toLocaleString('id-ID')} · {t.cashier.name}
                    {t.branch && ` · ${t.branch.name}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: GREEN }}>{fmt(t.totalAmount)}</div>
                    {Number(t.changeAmount) > 0 && <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Kembalian {fmt(t.changeAmount)}</div>}
                  </div>
                  {expanded === t.id
                    ? <ChevronUp size={16} style={{ color: '#94a3b8' }} />
                    : <ChevronDown size={16} style={{ color: '#94a3b8' }} />
                  }
                </div>
              </button>

              {expanded === t.id && (
                <div style={{ padding: '12px 20px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {t.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#475569' }}>
                        {item.medicine.name} <span style={{ color: '#94a3b8' }}>×{item.quantity} @ {fmt(item.unitPrice)}</span>
                      </span>
                      <span style={{ color: '#1e293b', fontWeight: 600 }}>{fmt(item.subtotal)}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700, color: GREEN }}>
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
