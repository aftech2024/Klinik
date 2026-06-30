'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { getUser, getActiveBranchId } from '@/lib/auth';
import { Package, AlertTriangle, Search, RefreshCw, ArrowUpDown, X } from 'lucide-react';

type Stock = {
  id: string; quantity: number; minStock: number;
  medicine: { id: string; code: string; name: string; unit: string; price: number; category?: string; genericName?: string };
  branch: { id: string; name: string };
};

const GREEN = '#3DB549';

function fmt(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0',
  borderRadius: 12, padding: '10px 14px',
  fontSize: '0.85rem', color: '#334155', outline: 'none',
};

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
        medicineId: stock.medicine.id, branchId: stock.branch.id,
        quantity: type === 'OUT' ? -q : q, type, reason,
      });
      onDone(); onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal.');
    } finally { setSaving(false); }
  }

  if (user?.role === 'CASHIER') return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 20, width: '100%', maxWidth: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>Sesuaikan Stok</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '3px 0 0' }}>{stock.medicine.name}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, fontSize: '0.8rem', color: '#ef4444' }}>{error}</div>}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Stok saat ini:</span>
            <span style={{ fontWeight: 700, color: '#1e293b' }}>{stock.quantity} {stock.medicine.unit}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(['IN', 'OUT'] as const).map(t => (
              <button key={t} onClick={() => setType(t)} style={{
                padding: '10px', fontSize: '0.85rem', fontWeight: 600, borderRadius: 12,
                border: '1px solid',
                borderColor: type === t ? (t === 'OUT' ? '#ef4444' : GREEN) : '#e2e8f0',
                background: type === t ? (t === 'OUT' ? '#fef2f2' : '#f0fdf4') : '#fff',
                color: type === t ? (t === 'OUT' ? '#ef4444' : GREEN) : '#64748b',
                cursor: 'pointer',
              }}>
                {t === 'IN' ? '+ Masuk' : '− Keluar'}
              </button>
            ))}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Jumlah</label>
            <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} style={INPUT_STYLE}
              onFocus={e => { e.target.style.borderColor = GREEN; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Keterangan</label>
            <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Stok masuk dari distributor..." style={INPUT_STYLE}
              onFocus={e => { e.target.style.borderColor = GREEN; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
            />
          </div>
        </div>
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}>Batal</button>
          <button onClick={submit} disabled={saving} style={{ flex: 1, padding: '11px', fontSize: '0.85rem', fontWeight: 700, color: '#fff', background: GREEN, border: 'none', borderRadius: 12, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
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
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto' }} className="scrollbar-hide">

      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Stok Obat</h1>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 3 }}>{isSuper ? 'Semua cabang' : 'Klinik ini'}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { value: stocks.length, label: 'Jenis Obat', color: '#1e293b', bg: '#fff', border: '#f1f5f9' },
          { value: low, label: 'Stok Menipis', color: low > 0 ? '#ef4444' : '#1e293b', bg: low > 0 ? '#fef2f2' : '#fff', border: low > 0 ? '#fecaca' : '#f1f5f9' },
          { value: stocks.reduce((s, x) => s + x.quantity, 0), label: 'Total Unit', color: '#1e293b', bg: '#fff', border: '#f1f5f9' },
        ].map((stat, i) => (
          <div key={i} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 16, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari obat..."
            style={{ ...{ width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '9px 14px 9px 32px', fontSize: '0.8rem', color: '#334155', outline: 'none' } }}
            onFocus={e => { e.target.style.borderColor = GREEN; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
          />
        </div>
        <button onClick={() => setLowOnly(p => !p)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: '0.8rem', fontWeight: 600, padding: '9px 16px', borderRadius: 12,
          border: '1px solid', cursor: 'pointer',
          borderColor: lowOnly ? '#ef4444' : '#e2e8f0',
          background: lowOnly ? '#fef2f2' : '#fff',
          color: lowOnly ? '#ef4444' : '#64748b',
        }}>
          <AlertTriangle size={13} /> Menipis
        </button>
        <button onClick={load} style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => <div key={i} style={{ height: 52, background: '#f1f5f9', borderRadius: 12 }} />)}
        </div>
      ) : stocks.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20, padding: 48, textAlign: 'center' }}>
          <Package size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Belum ada stok.</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ textAlign: 'left', padding: '12px 20px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Obat</th>
                {isSuper && <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Cabang</th>}
                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Harga</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Stok</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Status</th>
                {canAdjust && <th style={{ textAlign: 'right', padding: '12px 16px', fontSize: '0.7rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {stocks.map((s, idx) => {
                const isLow = s.quantity <= s.minStock;
                return (
                  <tr key={s.id} style={{
                    borderBottom: idx < stocks.length - 1 ? '1px solid #f8fafc' : 'none',
                    background: isLow ? '#fff7f7' : '#fff',
                  }}>
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{s.medicine.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.medicine.code} · {s.medicine.unit}</div>
                    </td>
                    {isSuper && (
                      <td style={{ padding: '13px 16px' }}>
                        <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 999 }}>{s.branch.name}</span>
                      </td>
                    )}
                    <td style={{ padding: '13px 16px', fontWeight: 600, color: GREEN }}>{fmt(s.medicine.price)}</td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                      <span style={{ fontWeight: 700, color: isLow ? '#ef4444' : '#1e293b' }}>{s.quantity}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>/{s.minStock}</span>
                    </td>
                    <td style={{ padding: '13px 16px', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                        background: isLow ? '#fef2f2' : '#f0fdf4',
                        color: isLow ? '#ef4444' : GREEN,
                      }}>
                        {isLow && <AlertTriangle size={9} />}
                        {isLow ? 'Menipis' : 'Aman'}
                      </span>
                    </td>
                    {canAdjust && (
                      <td style={{ padding: '13px 16px', textAlign: 'right' }}>
                        <button onClick={() => setAdjusting(s)} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: '0.75rem', fontWeight: 600,
                          padding: '6px 12px', borderRadius: 8,
                          background: '#f0fdf4', border: 'none', cursor: 'pointer',
                          color: GREEN,
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                          onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
                        >
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
