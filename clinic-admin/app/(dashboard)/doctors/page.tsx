'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { getUser, type AdminUser } from '@/lib/auth';
import { Stethoscope, MapPin, Award, X, Plus, Trash2, Building2, UserPlus, Camera } from 'lucide-react';


type BranchRef = { id: string; name: string; city: string };
type DoctorBranch = { branch: BranchRef };
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  isActive: boolean;
  licenseNumber: string | null;
  photoUrl: string | null;
  bio: string | null;
  branches: DoctorBranch[];
};

function initials(name: string) {
  return name.replace(/^dr[g]?\.\s*/i, '').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function ManageBranchesModal({
  doctor,
  allBranches,
  onClose,
  onUpdated,
}: {
  doctor: Doctor;
  allBranches: BranchRef[];
  onClose: () => void;
  onUpdated: (d: Doctor) => void;
}) {
  const [current, setCurrent] = useState<DoctorBranch[]>(doctor.branches);
  const [adding, setAdding] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const assignedIds = current.map(b => b.branch.id);
  const available = allBranches.filter(b => !assignedIds.includes(b.id));

  async function add() {
    if (!adding) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/doctors/${doctor.id}/branches`, { branchId: adding });
      setCurrent(res.data.branches ?? current);
      onUpdated({ ...doctor, branches: res.data.branches ?? current });
      setAdding('');
    } finally { setLoading(false); }
  }

  async function remove(branchId: string) {
    setLoading(true);
    try {
      const res = await api.post(`/api/doctors/${doctor.id}/branches/remove`, { branchId });
      setCurrent(res.data.branches ?? current.filter(b => b.branch.id !== branchId));
      onUpdated({ ...doctor, branches: res.data.branches ?? current.filter(b => b.branch.id !== branchId) });
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
            <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
              <Stethoscope size={10} />{doctor.specialty}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Cabang Terdaftar</p>
            {current.length === 0 ? (
              <p className="text-sm text-slate-400 italic">Belum ada cabang</p>
            ) : (
              <div className="space-y-2">
                {current.map(b => (
                  <div key={b.branch.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Building2 size={14} className="text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{b.branch.name}</p>
                        <p className="text-xs text-slate-400">{b.branch.city}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => remove(b.branch.id)}
                      disabled={loading}
                      className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {available.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Tambah Cabang</p>
              <div className="flex gap-2">
                <select
                  value={adding}
                  onChange={e => setAdding(e.target.value)}
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Pilih cabang --</option>
                  {available.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                  ))}
                </select>
                <button
                  onClick={add}
                  disabled={!adding || loading}
                  className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function AddDoctorModal({
  user,
  allBranches,
  onClose,
  onCreated,
}: {
  user: AdminUser | null;
  allBranches: BranchRef[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const isSuper = user?.role === 'SUPER_ADMIN';
  const [form, setForm] = useState({
    name: '', specialty: '', email: '', password: '',
    licenseNumber: '', experience: '', bio: '',
    branchId: isSuper ? '' : (user?.branchId ?? ''),
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function set(k: keyof typeof form, v: string) { setForm(p => ({ ...p, [k]: v })); }

  async function submit() {
    setError('');
    if (!form.name || !form.specialty || !form.email) { setError('Nama, spesialitas, email wajib diisi.'); return; }
    if (isSuper && !form.branchId) { setError('Pilih klinik untuk dokter ini.'); return; }
    setSaving(true);
    try {
      await api.post('/api/doctors', {
        name: form.name,
        specialty: form.specialty,
        email: form.email,
        password: form.password || undefined,
        licenseNumber: form.licenseNumber || undefined,
        experience: form.experience ? Number(form.experience) : undefined,
        bio: form.bio || undefined,
        ...(isSuper ? { branchId: form.branchId } : {}),
      });
      onCreated();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal menambah dokter.');
    } finally {
      setSaving(false);
    }
  }

  const lockedBranch = !isSuper ? allBranches.find(b => b.id === user?.branchId) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center"><UserPlus size={18} className="text-emerald-600" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">Tambah Dokter</h3>
              <p className="text-xs text-slate-400">Akun dokter dibuat otomatis</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-500"><X size={16} /></button>
        </div>

        <div className="p-6 space-y-4">
          {error && <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>}

          {/* Clinic */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Klinik</label>
            {isSuper ? (
              <select value={form.branchId} onChange={e => set('branchId', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">-- Pilih klinik --</option>
                {allBranches.map(b => <option key={b.id} value={b.id}>{b.name} ({b.city})</option>)}
              </select>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
                <Building2 size={14} className="text-emerald-600" />
                <span className="text-sm font-medium text-slate-800">{lockedBranch?.name ?? 'Klinik Anda'}</span>
                <span className="text-xs text-slate-400 ml-auto">terkunci</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Nama Dokter *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="dr. Budi Santoso, Sp.A" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Spesialitas *</label>
              <input value={form.specialty} onChange={e => set('specialty', e.target.value)} placeholder="Anak" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Pengalaman (thn)</label>
              <input type="number" value={form.experience} onChange={e => set('experience', e.target.value)} placeholder="5" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Login *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="dokter@klinik.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password <span className="text-slate-300 normal-case">(default: dokter123456)</span></label>
              <input type="text" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Kosongkan untuk default" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">No. SIP</label>
              <input value={form.licenseNumber} onChange={e => set('licenseNumber', e.target.value)} placeholder="SIP-123/2024" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Bio</label>
              <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={2} placeholder="Deskripsi singkat..." className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Batal</button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors">
            {saving ? 'Menyimpan...' : 'Tambah Dokter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [allBranches, setAllBranches] = useState<BranchRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [managing, setManaging] = useState<Doctor | null>(null);
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [uploading, setUploading] = useState<string | null>(null); // doctorId being uploaded
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetRef = useRef<string | null>(null); // doctorId for pending upload

  useEffect(() => { setUser(getUser()); }, []);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const doctorId = uploadTargetRef.current;
    if (!file || !doctorId) return;
    e.target.value = '';

    setUploading(doctorId);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data: uploaded } = await api.post('/api/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const photoUrl = uploaded.url; // full Supabase Storage public URL
      await api.patch(`/api/doctors/${doctorId}`, { photoUrl });
      setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, photoUrl } : d));
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Gagal upload foto.');
    } finally {
      setUploading(null);
      uploadTargetRef.current = null;
    }
  }

  function triggerPhotoUpload(doctorId: string) {
    uploadTargetRef.current = doctorId;
    fileInputRef.current?.click();
  }

  const load = useCallback(async () => {
    const u = getUser();
    // Clinic admin sees only their clinic's doctors; super admin sees all
    const doctorsUrl = u?.role === 'ADMIN' && u.branchId
      ? `/api/doctors?limit=100&branchId=${u.branchId}`
      : '/api/doctors?limit=100';
    const [dr, br] = await Promise.all([
      api.get(doctorsUrl).then(r => Array.isArray(r.data) ? r.data : (r.data.data ?? [])),
      api.get('/api/branches').then(r => Array.isArray(r.data) ? r.data : (r.data.data ?? [])),
    ]);
    setDoctors(dr);
    setAllBranches(br);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const isSuper = user?.role === 'SUPER_ADMIN';

  function handleUpdated(updated: Doctor) {
    setDoctors(prev => prev.map(d => d.id === updated.id ? { ...d, branches: updated.branches } : d));
    if (managing?.id === updated.id) setManaging(prev => prev ? { ...prev, branches: updated.branches } : null);
  }

  return (
    <div>
      {/* Hidden file input for photo upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handlePhotoUpload}
      />
      <Header title="Manajemen Dokter" />
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="text-slate-500 text-sm">{doctors.length} dokter terdaftar</p>
            {!isSuper && user?.branch && (
              <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1">
                <Building2 size={11} /> Klinik {user.branch.name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {doctors.filter(d => d.isActive).length} Aktif
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {doctors.filter(d => !d.isActive).length} Nonaktif
            </span>
            <button
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              <UserPlus size={15} /> Tambah Dokter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-full mt-3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {doctors.map(d => (
              <div key={d.id} className="bg-white rounded-2xl border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0 group/avatar">
                      <button
                        onClick={() => triggerPhotoUpload(d.id)}
                        disabled={uploading === d.id}
                        title="Klik untuk ganti foto"
                        className="w-14 h-14 rounded-2xl overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                      >
                        {d.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={d.photoUrl} alt={d.name} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                            <span className="text-white font-bold text-base">{initials(d.name)}</span>
                          </div>
                        )}
                        {/* Camera overlay on hover */}
                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${uploading === d.id ? 'opacity-100' : 'opacity-0 group-hover/avatar:opacity-100'}`}>
                          {uploading === d.id
                            ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            : <Camera size={16} className="text-white" />
                          }
                        </div>
                      </button>
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${d.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug">{d.name}</h3>
                      <p className="text-emerald-600 text-xs font-medium mt-0.5 flex items-center gap-1">
                        <Stethoscope size={11} />{d.specialty}
                      </p>
                      {d.licenseNumber && (
                        <p className="text-slate-400 text-xs mt-0.5">SIP: {d.licenseNumber}</p>
                      )}
                    </div>
                  </div>

                  {d.bio && (
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-4">{d.bio}</p>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                      <Award size={11} className="text-amber-500" />
                      <span>{d.experience} thn</span>
                    </div>
                    {d.branches.slice(0, 2).map((b, i) => (
                      <div key={i} className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                        <MapPin size={11} className="text-slate-400" />
                        <span className="truncate max-w-[72px]">{b.branch.city}</span>
                      </div>
                    ))}
                    {d.branches.length > 2 && (
                      <span className="text-xs text-slate-400">+{d.branches.length - 2}</span>
                    )}
                  </div>
                </div>

                <div className={`px-6 py-3 border-t border-slate-100 flex items-center justify-between ${d.isActive ? 'bg-emerald-50/50' : 'bg-slate-50/50'}`}>
                  <span className={`text-xs font-medium ${d.isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {d.isActive ? '● Tersedia' : '○ Nonaktif'}
                  </span>
                  <button
                    onClick={() => setManaging(d)}
                    className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Building2 size={11} />
                    Kelola Cabang ({d.branches.length})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {managing && (
        <ManageBranchesModal
          doctor={managing}
          allBranches={allBranches}
          onClose={() => setManaging(null)}
          onUpdated={handleUpdated}
        />
      )}

      {adding && (
        <AddDoctorModal
          user={user}
          allBranches={allBranches}
          onClose={() => setAdding(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}
