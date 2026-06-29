'use client';
import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { User, Building2, Mail, X, UserPlus, Power, Clock, ExternalLink } from 'lucide-react';

type Branch = { id: string; name: string; city: string };
type Cashier = {
  id: string; name: string; email: string; isActive: boolean;
  createdAt: string; lastLoginAt: string | null;
  managedBranch: Branch | null;
};

function initials(s: string) {
  return s.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function AddCashierModal({ branches, myBranchId, onClose, onCreated }: {
  branches: Branch[]; myBranchId: string | null; onClose: () => void; onCreated: () => void;
}) {
  const [form, setForm] = useState({ name: '', email: '', password: '', branchId: myBranchId ?? '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = !!myBranchId;

  function set(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submit() {
    setError('');
    if (!form.name || !form.email || !form.branchId) { setError('Nama, email, klinik wajib diisi.'); return; }
    setSaving(true);
    try {
      await api.post('/api/cashiers', { ...form, password: form.password || undefined });
      onCreated(); onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal menambah kasir.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center"><User size={18} className="text-blue-600" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">Tambah Kasir</h3>
              <p className="text-xs text-slate-400">Akses POS per klinik</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"><X size={16} /></button>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Klinik *</label>
            {isAdmin ? (
              <div className="w-full border border-slate-100 rounded-xl px-3 py-2.5 text-sm bg-slate-50 text-slate-600">
                {branches.find(b => b.id === myBranchId)?.name ?? 'Klinik Anda'} (terkunci)
              </div>
            ) : (
              <select value={form.branchId} onChange={e => set('branchId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">-- Pilih klinik --</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}
              </select>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Kasir *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Siti Kasir" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Login *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="kasir@klinik.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password <span className="text-slate-300 normal-case">(default: kasir123456)</span></label>
            <input type="text" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Kosongkan untuk default" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-colors">
            {saving ? 'Menyimpan...' : 'Tambah Kasir'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CashiersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const user = getUser();
  const isSuper = user?.role === 'SUPER_ADMIN';

  const load = useCallback(async () => {
    setLoading(true);
    const [c, b] = await Promise.all([
      api.get('/api/cashiers').then(r => r.data ?? []).catch(() => []),
      api.get('/api/branches').then(r => Array.isArray(r.data) ? r.data : (r.data.data ?? [])).catch(() => []),
    ]);
    setCashiers(c);
    setBranches(b);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(c: Cashier) {
    await api.patch(`/api/cashiers/${c.id}/active`, { isActive: !c.isActive }).catch(() => {});
    setCashiers(prev => prev.map(x => x.id === c.id ? { ...x, isActive: !x.isActive } : x));
  }

  return (
    <div>
      <Header title="Kelola Kasir" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-slate-500 text-sm">{cashiers.length} kasir terdaftar</p>
            <p className="text-xs text-slate-400 mt-0.5">Login POS di <span className="font-mono text-blue-600">localhost:3004</span></p>
          </div>
          <div className="flex gap-2">
            <a
              href="http://localhost:3004"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm border border-slate-200 text-slate-600 hover:border-slate-300 px-4 py-2 rounded-xl font-medium transition-colors"
            >
              <ExternalLink size={14} /> Buka POS
            </a>
            <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
              <UserPlus size={15} /> Tambah Kasir
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : cashiers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <User size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Belum ada kasir.</p>
            <p className="text-slate-400 text-xs mt-1">Tambah kasir agar bisa login ke sistem POS.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cashiers.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${c.isActive ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-slate-300'}`}>
                    {initials(c.name || c.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{c.name || '—'}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate"><Mail size={10} /> {c.email}</p>
                    {c.managedBranch ? (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                        <Building2 size={11} /> {c.managedBranch.name}
                      </div>
                    ) : (
                      <div className="mt-2 text-xs text-slate-400">Tanpa klinik</div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(c)}
                    title={c.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${c.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    <Power size={14} />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-medium ${c.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {c.isActive ? '● Aktif' : '○ Nonaktif'}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleDateString('id-ID') : 'Belum login'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {adding && <AddCashierModal branches={branches} myBranchId={user?.branchId ?? null} onClose={() => setAdding(false)} onCreated={load} />}
    </div>
  );
}
