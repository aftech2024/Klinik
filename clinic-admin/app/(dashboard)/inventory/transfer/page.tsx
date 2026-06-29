'use client';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { ArrowRight, Package, CheckCircle, XCircle, Clock, Plus, X, RefreshCw } from 'lucide-react';

type Medicine = { id: string; name: string; unit: string };
type Branch = { id: string; name: string; city: string };
type Transfer = {
  id: string; status: 'PENDING' | 'APPROVED' | 'REJECTED';
  quantity: number; notes?: string; createdAt: string;
  medicine: { id: string; name: string; unit: string };
  fromBranch: { id: string; name: string; city: string };
  toBranch: { id: string; name: string; city: string };
  requestedBy: { id: string; name: string };
  approvedBy?: { id: string; name: string } | null;
};

const STATUS_COLORS = {
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  REJECTED: 'bg-red-100 text-red-700',
};
const STATUS_ICON = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
};
const STATUS_LABEL = { PENDING: 'Menunggu', APPROVED: 'Disetujui', REJECTED: 'Ditolak' };

function RequestTransferModal({
  medicines, branches, myBranchId, onClose, onDone,
}: { medicines: Medicine[]; branches: Branch[]; myBranchId: string | null; onClose: () => void; onDone: () => void }) {
  const [form, setForm] = useState({
    medicineId: '', fromBranchId: '', toBranchId: myBranchId ?? '', quantity: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = !!myBranchId;

  function set(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submit() {
    setError('');
    if (!form.medicineId || !form.fromBranchId || !form.toBranchId || !form.quantity) {
      setError('Semua field wajib diisi.'); return;
    }
    if (form.fromBranchId === form.toBranchId) { setError('Cabang asal dan tujuan tidak boleh sama.'); return; }
    setSaving(true);
    try {
      await api.post('/api/pharmacy/transfers', {
        medicineId: form.medicineId,
        fromBranchId: form.fromBranchId,
        toBranchId: form.toBranchId,
        quantity: parseInt(form.quantity),
        notes: form.notes || undefined,
      });
      onDone(); onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal membuat permintaan transfer.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center"><ArrowRight size={18} className="text-blue-600" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">Request Transfer Stok</h3>
              <p className="text-xs text-slate-400">Perlu persetujuan Super Admin</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Obat</label>
            <select value={form.medicineId} onChange={e => set('medicineId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Pilih obat --</option>
              {medicines.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Cabang Asal (kirim dari)</label>
            <select value={form.fromBranchId} onChange={e => set('fromBranchId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Pilih cabang asal --</option>
              {branches.filter(b => b.id !== form.toBranchId).map(b => <option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Cabang Tujuan (terima di)</label>
            {isAdmin ? (
              <div className="w-full border border-slate-100 rounded-xl px-3 py-2.5 text-sm bg-slate-50 text-slate-600">
                {branches.find(b => b.id === myBranchId)?.name ?? myBranchId} (klinik Anda)
              </div>
            ) : (
              <select value={form.toBranchId} onChange={e => set('toBranchId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Pilih cabang tujuan --</option>
                {branches.filter(b => b.id !== form.fromBranchId).map(b => <option key={b.id} value={b.id}>{b.name} — {b.city}</option>)}
              </select>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Jumlah</label>
            <input type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="0" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Catatan</label>
            <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Alasan transfer..." className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Batal</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl">
            {saving ? 'Mengirim...' : 'Kirim Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StockTransferPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const user = getUser();
  const isSuper = user?.role === 'SUPER_ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, m, b] = await Promise.all([
        api.get('/api/pharmacy/transfers', { params: { status: statusFilter || undefined } }).then(r => r.data ?? []),
        api.get('/api/pharmacy/medicines').then(r => r.data ?? []),
        api.get('/api/branches').then(r => Array.isArray(r.data) ? r.data : (r.data.data ?? [])),
      ]);
      setTransfers(t);
      setMedicines(m);
      setBranches(b);
    } finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(id: string) {
    setProcessing(id);
    try {
      await api.patch(`/api/pharmacy/transfers/${id}/approve`);
      setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t));
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Gagal menyetujui transfer');
    } finally { setProcessing(null); }
  }

  async function handleReject(id: string) {
    setProcessing(id);
    try {
      await api.patch(`/api/pharmacy/transfers/${id}/reject`);
      setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'REJECTED' } : t));
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Gagal menolak transfer');
    } finally { setProcessing(null); }
  }

  const pending = transfers.filter(t => t.status === 'PENDING').length;

  return (
    <div>
      <Header title="Transfer Stok" />
      <div className="p-6 lg:p-8 space-y-6">

        {/* Header stats */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {pending > 0 && (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <Clock size={15} className="text-amber-600" />
                <span className="text-sm font-semibold text-amber-700">{pending} menunggu persetujuan</span>
              </div>
            )}
            <div className="flex gap-2">
              {['', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${statusFilter === s ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  {s || 'Semua'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
              <RefreshCw size={15} />
            </button>
            <button onClick={() => setRequesting(true)} className="inline-flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors">
              <Plus size={15} /> Request Transfer
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : transfers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <ArrowRight size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Belum ada transfer stok.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transfers.map(t => {
              const StatusIcon = STATUS_ICON[t.status];
              const busy = processing === t.id;
              return (
                <div key={t.id} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Package size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{t.medicine.name}</h3>
                        <span className="text-xs text-slate-400">{t.quantity} {t.medicine.unit}</span>
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[t.status]}`}>
                          <StatusIcon size={10} /> {STATUS_LABEL[t.status]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-500">
                        <span className="font-medium text-slate-700">{t.fromBranch.name}</span>
                        <ArrowRight size={13} className="text-slate-400" />
                        <span className="font-medium text-slate-700">{t.toBranch.name}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>Diminta: {t.requestedBy.name}</span>
                        {t.approvedBy && <span>· {t.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}: {t.approvedBy.name}</span>}
                        {t.notes && <span>· "{t.notes}"</span>}
                        <span>· {new Date(t.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    {isSuper && t.status === 'PENDING' && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleReject(t.id)}
                          disabled={busy}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <XCircle size={13} /> Tolak
                        </button>
                        <button
                          onClick={() => handleApprove(t.id)}
                          disabled={busy}
                          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <CheckCircle size={13} /> {busy ? '...' : 'Setujui'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {requesting && (
        <RequestTransferModal
          medicines={medicines}
          branches={branches}
          myBranchId={user?.branchId ?? null}
          onClose={() => setRequesting(false)}
          onDone={load}
        />
      )}
    </div>
  );
}
