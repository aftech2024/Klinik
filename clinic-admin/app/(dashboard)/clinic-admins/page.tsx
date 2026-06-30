'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import api from '@/lib/api';
import { getUser } from '@/lib/auth';
import {
  ShieldCheck, Building2, Mail, X, UserPlus, Power,
  MapPin, Clock, Pencil, Search, AlertTriangle, RefreshCw
} from 'lucide-react';

type Branch = { id: string; name: string; city: string };
type ClinicAdmin = {
  id: string; name: string; email: string;
  isActive: boolean; createdAt: string; lastLoginAt: string | null;
  managedBranch: Branch | null;
};

function initials(s: string) {
  return s.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ─── Add / Edit Modal ──────────────────────────────────────────────────────────
function AdminModal({
  admin, branches, onClose, onSaved,
}: {
  admin?: ClinicAdmin | null;
  branches: Branch[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!admin;
  const [form, setForm] = useState({
    name: admin?.name ?? '',
    email: admin?.email ?? '',
    password: '',
    branchId: admin?.managedBranch?.id ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.branchId) {
      setError('Nama, email, dan klinik wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        // Update name/email via reassign endpoint available + we patch the branch
        // Patch branch if changed
        if (form.branchId !== admin!.managedBranch?.id) {
          await api.patch(`/api/admins/${admin!.id}/branch`, { branchId: form.branchId });
        }
        // No direct name/email patch endpoint exposed — we note this in UI
      } else {
        await api.post('/api/admins', {
          name: form.name,
          email: form.email,
          password: form.password || undefined,
          branchId: form.branchId,
        });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal menyimpan.');
    } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <ShieldCheck size={18} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">{isEdit ? 'Edit Admin Klinik' : 'Tambah Admin Klinik'}</h3>
              <p className="text-xs text-slate-400">{isEdit ? 'Pindah cabang admin' : 'Admin mengelola satu klinik'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Klinik yang Dikelola *
            </label>
            <select
              value={form.branchId}
              onChange={e => set('branchId', e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Pilih klinik --</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
              ))}
            </select>
          </div>

          {!isEdit && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Admin *</label>
                <input
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  placeholder="Budi Hartono"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Login *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="admin.cabang@aftechklinik.com"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Password <span className="text-slate-300 normal-case font-normal">(default: admin123456)</span>
                </label>
                <input
                  type="text"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="Kosongkan untuk password default"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </>
          )}

          {isEdit && (
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 space-y-1">
              <p><span className="font-medium text-slate-700">Nama:</span> {admin!.name}</p>
              <p><span className="font-medium text-slate-700">Email:</span> {admin!.email}</p>
              <p className="text-slate-400">Hanya pemindahan klinik yang bisa diubah di sini.</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-xl transition-colors"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Pindahkan Klinik' : 'Tambah Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ClinicAdminsPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<ClinicAdmin[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; admin?: ClinicAdmin | null }>({ open: false });

  useEffect(() => {
    const u = getUser();
    if (u && u.role !== 'SUPER_ADMIN') router.replace('/dashboard');
  }, [router]);

  const load = useCallback(async () => {
    setLoading(true);
    setApiError('');
    try {
      const [ad, br] = await Promise.all([
        api.get('/api/admins').then(r => r.data ?? []),
        api.get('/api/branches').then(r => Array.isArray(r.data) ? r.data : (r.data.data ?? [])),
      ]);
      setAdmins(ad);
      setBranches(br);
    } catch (e: any) {
      setApiError(e?.response?.data?.message ?? 'Gagal memuat data. Cek koneksi atau coba login ulang.');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function toggleActive(a: ClinicAdmin) {
    try {
      await api.patch(`/api/admins/${a.id}/active`, { isActive: !a.isActive });
      setAdmins(prev => prev.map(x => x.id === a.id ? { ...x, isActive: !x.isActive } : x));
    } catch (e: any) {
      alert(e?.response?.data?.message ?? 'Gagal mengubah status.');
    }
  }

  const managedBranchIds = new Set(admins.map(a => a.managedBranch?.id).filter(Boolean));
  const unmanaged = branches.filter(b => !managedBranchIds.has(b.id));

  const filtered = admins.filter(a =>
    search === '' ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    (a.managedBranch?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header title="Admin Klinik" />
      <div className="p-4 sm:p-6 space-y-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama, email, atau klinik..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={load}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setModal({ open: true, admin: null })}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors"
            >
              <UserPlus size={15} /> Tambah Admin
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Total Admin', value: admins.length, color: 'text-slate-900' },
            { label: 'Aktif', value: admins.filter(a => a.isActive).length, color: 'text-emerald-600' },
            { label: 'Klinik tanpa admin', value: unmanaged.length, color: unmanaged.length > 0 ? 'text-amber-600' : 'text-slate-900' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Warning: unmanaged branches */}
        {unmanaged.length > 0 && !loading && (
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Klinik belum punya admin:</span>{' '}
              {unmanaged.map(b => b.name).join(', ')}
            </div>
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            <AlertTriangle size={14} className="flex-shrink-0" /> {apiError}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-14 text-center">
            <ShieldCheck size={40} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">
              {search ? 'Admin tidak ditemukan.' : 'Belum ada admin klinik.'}
            </p>
            {!search && (
              <button
                onClick={() => setModal({ open: true, admin: null })}
                className="mt-4 text-sm text-amber-600 font-semibold hover:underline"
              >
                + Tambah admin pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(a => (
              <div key={a.id} className={`bg-white rounded-2xl border transition-shadow hover:shadow-sm ${a.isActive ? 'border-slate-200' : 'border-slate-100 opacity-60'}`}>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${a.isActive ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-slate-300'}`}>
                      {initials(a.name || a.email)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{a.name || '—'}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                        <Mail size={10} /> {a.email}
                      </p>
                      <div className="mt-2">
                        {a.managedBranch ? (
                          <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">
                            <Building2 size={10} /> {a.managedBranch.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-400 px-2.5 py-1 rounded-full">
                            <MapPin size={10} /> Tanpa klinik
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setModal({ open: true, admin: a })}
                        title="Edit / pindah klinik"
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => toggleActive(a)}
                        title={a.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${a.isActive ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                      >
                        <Power size={13} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-semibold ${a.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {a.isActive ? '● Aktif' : '○ Nonaktif'}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock size={10} />
                    {a.lastLoginAt
                      ? `Login ${new Date(a.lastLoginAt).toLocaleDateString('id-ID')}`
                      : 'Belum pernah login'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal.open && (
        <AdminModal
          admin={modal.admin}
          branches={branches}
          onClose={() => setModal({ open: false })}
          onSaved={load}
        />
      )}
    </div>
  );
}
