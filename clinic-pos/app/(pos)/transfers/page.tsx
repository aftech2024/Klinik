'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { getUser, getActiveBranchId } from '@/lib/auth';
import { ArrowRight, CheckCircle, XCircle, Clock, Plus, X, RefreshCw, Package } from 'lucide-react';
import POSUserMenu from '@/components/POSUserMenu';

type Medicine = { id: string; name: string; unit: string };
type Branch = { id: string; name: string; city: string };
type Transfer = {
  id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; quantity: number; notes?: string; createdAt: string;
  medicine: Medicine; fromBranch: Branch; toBranch: Branch;
  requestedBy: { name: string }; approvedBy?: { name: string } | null;
};

const GREEN = '#3DB549';

const STATUS_STYLE = {
  PENDING: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  APPROVED: { bg: '#f0fdf4', color: GREEN, border: '#bbf7d0' },
  REJECTED: { bg: '#fef2f2', color: '#ef4444', border: '#fecaca' },
};
const STATUS_LABEL = { PENDING: 'Menunggu', APPROVED: 'Disetujui', REJECTED: 'Ditolak' };

const INPUT_STYLE: React.CSSProperties = {
  width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0',
  borderRadius: 12, padding: '10px 14px',
  fontSize: '0.85rem', color: '#334155', outline: 'none',
};
const SELECT_STYLE: React.CSSProperties = {
  ...{} as React.CSSProperties,
  width: '100%', background: '#f8fafc', border: '1px solid #e2e8f0',
  borderRadius: 12, padding: '10px 14px',
  fontSize: '0.85rem', color: '#334155', outline: 'none',
};

function RequestModal({ medicines, branches, myBranchId, onClose, onDone }: {
  medicines: Medicine[]; branches: Branch[]; myBranchId: string | null;
  onClose: () => void; onDone: () => void;
}) {
  const [form, setForm] = useState({ medicineId: '', fromBranchId: '', toBranchId: myBranchId ?? '', quantity: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = !!myBranchId;

  function set(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submit() {
    setError('');
    if (!form.medicineId || !form.fromBranchId || !form.toBranchId || !form.quantity) { setError('Semua field wajib.'); return; }
    if (form.fromBranchId === form.toBranchId) { setError('Cabang asal ≠ tujuan.'); return; }
    setSaving(true);
    try {
      await api.post('/api/pharmacy/transfers', { ...form, quantity: parseInt(form.quantity), notes: form.notes || undefined });
      onDone(); onClose();
    } catch (e: any) { setError(e?.response?.data?.message ?? 'Gagal.'); } finally { setSaving(false); }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontWeight: 700, color: '#1e293b', margin: 0 }}>Request Transfer Stok</h3>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '3px 0 0' }}>Perlu persetujuan Super Admin</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, fontSize: '0.8rem', color: '#ef4444' }}>{error}</div>}

          {[
            { label: 'Obat', field: 'medicineId', type: 'select', options: medicines.map(m => ({ value: m.id, label: `${m.name} (${m.unit})` })), placeholder: '-- Pilih obat --' },
            { label: 'Dari Cabang', field: 'fromBranchId', type: 'select', options: branches.filter(b => b.id !== form.toBranchId).map(b => ({ value: b.id, label: `${b.name} — ${b.city}` })), placeholder: '-- Pilih cabang asal --' },
          ].map(({ label, field, options, placeholder }) => (
            <div key={field}>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</label>
              <select value={(form as any)[field]} onChange={e => set(field as keyof typeof form, e.target.value)} style={SELECT_STYLE}
                onFocus={e => { e.target.style.borderColor = GREEN; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}>
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Ke Cabang</label>
            {isAdmin ? (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 14px', fontSize: '0.85rem', color: '#64748b' }}>
                {branches.find(b => b.id === myBranchId)?.name ?? 'Klinik Anda'}
              </div>
            ) : (
              <select value={form.toBranchId} onChange={e => set('toBranchId', e.target.value)} style={SELECT_STYLE}
                onFocus={e => { e.target.style.borderColor = GREEN; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}>
                <option value="">-- Pilih cabang tujuan --</option>
                {branches.filter(b => b.id !== form.fromBranchId).map(b => <option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}
              </select>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Jumlah</label>
              <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} style={INPUT_STYLE}
                onFocus={e => { e.target.style.borderColor = GREEN; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Catatan</label>
              <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Alasan..." style={INPUT_STYLE}
                onFocus={e => { e.target.style.borderColor = GREEN; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
              />
            </div>
          </div>
        </div>
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 600 }}>Batal</button>
          <button onClick={submit} disabled={saving} style={{ flex: 1, padding: '11px', fontSize: '0.85rem', fontWeight: 700, color: '#fff', background: '#3b82f6', border: 'none', borderRadius: 12, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? '...' : 'Kirim Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const user = getUser();
  const branchId = getActiveBranchId() ?? user?.branchId ?? '';
  const isSuper = user?.role === 'SUPER_ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    const [t, m, b] = await Promise.all([
      api.get('/api/pharmacy/transfers').then(r => r.data ?? []).catch(() => []),
      api.get('/api/pharmacy/medicines').then(r => r.data ?? []).catch(() => []),
      api.get('/api/branches').then(r => Array.isArray(r.data) ? r.data : (r.data.data ?? [])).catch(() => []),
    ]);
    setTransfers(t); setMedicines(m); setBranches(b);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function approve(id: string) {
    setProcessing(id);
    try {
      await api.patch(`/api/pharmacy/transfers/${id}/approve`);
      setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t));
    } catch (e: any) { alert(e?.response?.data?.message ?? 'Gagal'); } finally { setProcessing(null); }
  }

  async function reject(id: string) {
    setProcessing(id);
    try {
      await api.patch(`/api/pharmacy/transfers/${id}/reject`);
      setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'REJECTED' } : t));
    } catch (e: any) { alert(e?.response?.data?.message ?? 'Gagal'); } finally { setProcessing(null); }
  }

  const pending = transfers.filter(t => t.status === 'PENDING').length;

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto' }} className="scrollbar-hide">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Transfer Stok</h1>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: 3 }}>Perpindahan inventori antar cabang</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {pending > 0 && isSuper && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fffbeb', border: '1px solid #fde68a', color: '#d97706', fontSize: '0.75rem', fontWeight: 600, padding: '6px 12px', borderRadius: 10 }}>
              <Clock size={13} /> {pending} menunggu
            </div>
          )}
          <button onClick={load} style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setRequesting(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, padding: '9px 16px', borderRadius: 12, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(59,130,246,0.25)' }}>
            <Plus size={14} /> Request
          </button>
          <div style={{ width: 1, height: 28, background: '#e2e8f0', margin: '0 4px' }} />
          <POSUserMenu />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ height: 76, background: '#f1f5f9', borderRadius: 16 }} />)}
        </div>
      ) : transfers.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20, padding: 48, textAlign: 'center' }}>
          <ArrowRight size={36} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>Belum ada request transfer.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {transfers.map(t => {
            const busy = processing === t.id;
            const statusStyle = STATUS_STYLE[t.status];
            return (
              <div key={t.id} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Package size={18} style={{ color: '#3b82f6' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.875rem' }}>{t.medicine.name}</span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{t.quantity} {t.medicine.unit}</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5, fontSize: '0.8rem', color: '#64748b' }}>
                      <span style={{ color: '#1e293b', fontWeight: 500 }}>{t.fromBranch.name}</span>
                      <ArrowRight size={12} />
                      <span style={{ color: '#1e293b', fontWeight: 500 }}>{t.toBranch.name}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 3 }}>
                      {t.requestedBy.name} · {new Date(t.createdAt).toLocaleDateString('id-ID')}
                      {t.notes && ` · "${t.notes}"`}
                    </div>
                  </div>

                  {isSuper && t.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => reject(t.id)} disabled={busy} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, padding: '7px 12px', borderRadius: 10, border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1 }}>
                        <XCircle size={12} /> Tolak
                      </button>
                      <button onClick={() => approve(t.id)} disabled={busy} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, padding: '7px 12px', borderRadius: 10, border: 'none', background: GREEN, color: '#fff', cursor: busy ? 'not-allowed' : 'pointer', opacity: busy ? 0.6 : 1, boxShadow: `0 4px 12px ${GREEN}30` }}>
                        <CheckCircle size={12} /> {busy ? '...' : 'Setujui'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {requesting && (
        <RequestModal
          medicines={medicines} branches={branches}
          myBranchId={user?.role !== 'SUPER_ADMIN' ? (branchId || null) : null}
          onClose={() => setRequesting(false)} onDone={load}
        />
      )}
    </div>
  );
}
