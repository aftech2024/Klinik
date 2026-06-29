'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import { ShieldCheck, Building2, Mail, X, UserPlus, Power, MapPin, Clock } from 'lucide-react';

type Branch = { id: string; name: string; city: string };
type ClinicAdmin = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  managedBranch: Branch | null;
};

function initials(s: string) {
  return s.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function AddAdminModal({ branches, onClose, onCreated }: { branches: Branch[]; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', branchId: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submit() {
    setError('');
    if (!form.name || !form.email || !form.branchId) { setError('Nama, email, klinik wajib diisi.'); return; }
    setSaving(true);
    try {
      await api.post('/api/admins', {
        name: form.name, email: form.email,
        password: form.password || undefined, branchId: form.branchId,
      });
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal menambah admin klinik.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center"><ShieldCheck size={18} className="text-amber-600" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">Tambah Admin Klinik</h3>
              <p className="text-xs text-slate-400">Admin mengelola satu klinik</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Klinik yang Dikelola *</label>
            <select value={form.branchId} onChange={e => set('branchId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
              <option value="">-- Pilih klinik --</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Admin *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Budi Admin" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Login *</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="admin.klinik@aftech.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password <span className="text-slate-300 normal-case">(default: admin123456)</span></label>
            <input type="text" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Kosongkan untuk default" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl transition-colors">
            {saving ? 'Menyimpan...' : 'Tambah Admin'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ClinicAdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<ClinicAdmin[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [allowed, setAllowed] = useState(true);

  // Guard: super admin only
  useEffect(() => {
    const u = getUser();
    if (u && u.role !== 'SUPER_ADMIN') { setAllowed(false); router.replace('/dashboard'); }
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    const [ad, br] = await Promise.all([
      api.get('/api/admins').then(r => r.data ?? []).catch(() => []),
      api.get('/api/branches').then(r => Array.isArray(r.data) ? r.data : (r.data.data ?? [])).catch(() => []),
    ]);
    setAdmins(ad);
    setBranches(br);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(a: ClinicAdmin) {
    await api.patch(`/api/admins/${a.id}/active`, { isActive: !a.isActive }).catch(() => {});
    setAdmins(prev => prev.map(x => x.id === a.id ? { ...x, isActive: !x.isActive } : x));
  }

  if (!allowed) return null;

  // Branches that already have an admin (for context)
  const managedBranchIds = new Set(admins.map(a => a.managedBranch?.id).filter(Boolean));
  const unmanaged = branches.filter(b => !managedBranchIds.has(b.id));

  return (
    <div>
      <Header title="Admin Klinik" />
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-slate-500 text-sm">{admins.length} admin klinik terdaftar</p>
            {unmanaged.length > 0 && (
              <p className="text-xs text-amber-600 mt-0.5">{unmanaged.length} klinik belum punya admin</p>
            )}
          </div>
          <button onClick={() => setAdding(true)} className="inline-flex items-center gap-1.5 text-sm bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors">
            <UserPlus size={15} /> Tambah Admin Klinik
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : admins.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <ShieldCheck size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Belum ada admin klinik.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {admins.map(a => (
              <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${a.isActive ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-300'}`}>
                    {initials(a.name || a.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{a.name || '—'}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate"><Mail size={10} /> {a.email}</p>
                    {a.managedBranch ? (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                        <Building2 size={11} /> {a.managedBranch.name}
                      </div>
                    ) : (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full"><MapPin size={11} /> Tanpa klinik</div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleActive(a)}
                    title={a.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${a.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                  >
                    <Power size={14} />
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-medium ${a.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {a.isActive ? '● Aktif' : '○ Nonaktif'}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleDateString('id-ID') : 'Belum login'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {adding && <AddAdminModal branches={branches} onClose={() => setAdding(false)} onCreated={load} />}
    </div>
  );
}
