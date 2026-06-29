'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { getUser, getActiveBranchId } from '@/lib/auth';
import { ArrowRight, CheckCircle, XCircle, Clock, Plus, X, RefreshCw, Package } from 'lucide-react';

type Medicine = { id: string; name: string; unit: string };
type Branch = { id: string; name: string; city: string };
type Transfer = {
  id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; quantity: number; notes?: string; createdAt: string;
  medicine: Medicine; fromBranch: Branch; toBranch: Branch;
  requestedBy: { name: string }; approvedBy?: { name: string } | null;
};

const STATUS_COLOR = { PENDING: 'bg-amber-900/50 text-amber-400', APPROVED: 'bg-emerald-900/50 text-emerald-400', REJECTED: 'bg-red-900/50 text-red-400' };
const STATUS_LABEL = { PENDING: 'Menunggu', APPROVED: 'Disetujui', REJECTED: 'Ditolak' };

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md text-white">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h3 className="font-semibold">Request Transfer Stok</h3>
            <p className="text-xs text-slate-400">Perlu persetujuan Super Admin</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-800 flex items-center justify-center text-slate-500"><X size={15} /></button>
        </div>
        <div className="p-5 space-y-4">
          {error && <div className="px-3 py-2 bg-red-900/50 text-red-300 text-sm rounded-xl">{error}</div>}
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Obat</label>
            <select value={form.medicineId} onChange={e => set('medicineId', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">-- Pilih obat --</option>
              {medicines.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Dari Cabang</label>
            <select value={form.fromBranchId} onChange={e => set('fromBranchId', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">-- Pilih cabang asal --</option>
              {branches.filter(b => b.id !== form.toBranchId).map(b => <option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Ke Cabang</label>
            {isAdmin ? (
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-300">
                {branches.find(b => b.id === myBranchId)?.name ?? 'Klinik Anda'}
              </div>
            ) : (
              <select value={form.toBranchId} onChange={e => set('toBranchId', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">-- Pilih cabang tujuan --</option>
                {branches.filter(b => b.id !== form.fromBranchId).map(b => <option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}
              </select>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Jumlah</label>
              <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-1.5">Catatan</label>
              <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Alasan..." className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl">Batal</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl">
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
    setTransfers(t);
    setMedicines(m);
    setBranches(b);
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
    <div className="p-5 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Transfer Stok</h1>
          <p className="text-slate-400 text-sm mt-0.5">Join inventory antar cabang</p>
        </div>
        <div className="flex items-center gap-2">
          {pending > 0 && isSuper && (
            <div className="flex items-center gap-1.5 bg-amber-900/30 border border-amber-800 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-xl">
              <Clock size={13} /> {pending} menunggu
            </div>
          )}
          <button onClick={load} className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-700 text-slate-400 hover:text-white">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => setRequesting(true)} className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold">
            <Plus size={14} /> Request
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />)}</div>
      ) : transfers.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <ArrowRight size={36} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Belum ada request transfer.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transfers.map(t => {
            const busy = processing === t.id;
            return (
              <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white text-sm">{t.medicine.name}</span>
                      <span className="text-xs text-slate-400">{t.quantity} {t.medicine.unit}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[t.status]}`}>
                        {STATUS_LABEL[t.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-400">
                      <span className="text-slate-300">{t.fromBranch.name}</span>
                      <ArrowRight size={12} />
                      <span className="text-slate-300">{t.toBranch.name}</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t.requestedBy.name} · {new Date(t.createdAt).toLocaleDateString('id-ID')}
                      {t.notes && ` · "${t.notes}"`}
                    </div>
                  </div>
                  {isSuper && t.status === 'PENDING' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => reject(t.id)} disabled={busy} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border border-red-800 text-red-400 hover:bg-red-900/30 disabled:opacity-50">
                        <XCircle size={12} /> Tolak
                      </button>
                      <button onClick={() => approve(t.id)} disabled={busy} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-600 disabled:opacity-50">
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
