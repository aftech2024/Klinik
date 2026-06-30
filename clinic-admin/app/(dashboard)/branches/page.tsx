'use client';
import { useCallback, useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import {
  MapPin, Phone, Mail, Plus, Pencil, Trash2, X, Check,
  Stethoscope, ChevronRight, Building2, Clock, Wifi, Car,
  FlaskConical, BookOpen, Search, UserPlus, UserMinus, AlertTriangle
} from 'lucide-react';

type OperatingHours = {
  weekday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
};

type Branch = {
  id: string; name: string; slug: string; address: string;
  city: string; province?: string; phone?: string; email?: string;
  facilities: string[]; operatingHours?: OperatingHours;
  latitude?: number; longitude?: number;
  isActive: boolean; sortOrder: number;
  doctors?: Array<{ doctor: { id: string; name: string; specialty: string; slug: string } }>;
};

type Doctor = { id: string; name: string; specialty: string; slug: string };

const FACILITY_OPTIONS = ['Parking', 'Pharmacy', 'Laboratory', 'WiFi', 'Prayer Room', 'Ambulance', 'ICU'];

const FACILITY_ICON: Record<string, React.ReactNode> = {
  Parking: <Car size={12} />,
  Pharmacy: <FlaskConical size={12} />,
  Laboratory: <FlaskConical size={12} />,
  WiFi: <Wifi size={12} />,
  'Prayer Room': <BookOpen size={12} />,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

const DEFAULT_HOURS: OperatingHours = {
  weekday: { open: '07:00', close: '21:00' },
  saturday: { open: '07:00', close: '17:00' },
  sunday: { open: '08:00', close: '14:00' },
};

// ─── Branch Modal (Create / Edit) ─────────────────────────────────────────────
function BranchModal({
  branch, onClose, onSaved,
}: {
  branch?: Branch | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!branch;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: branch?.name ?? '',
    slug: branch?.slug ?? '',
    address: branch?.address ?? '',
    city: branch?.city ?? '',
    province: branch?.province ?? '',
    phone: branch?.phone ?? '',
    email: branch?.email ?? '',
    latitude: branch?.latitude?.toString() ?? '',
    longitude: branch?.longitude?.toString() ?? '',
    sortOrder: branch?.sortOrder?.toString() ?? '0',
    facilities: branch?.facilities ?? [] as string[],
    hours: branch?.operatingHours ?? DEFAULT_HOURS,
  });

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function toggleFacility(f: string) {
    set('facilities', form.facilities.includes(f)
      ? form.facilities.filter(x => x !== f)
      : [...form.facilities, f]
    );
  }

  function setHour(day: keyof OperatingHours, key: 'open' | 'close', val: string) {
    set('hours', { ...form.hours, [day]: { ...form.hours[day], [val === val ? key : key]: val } });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.slug || !form.address || !form.city) {
      setError('Nama, slug, alamat, dan kota wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        address: form.address,
        city: form.city,
        province: form.province || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        sortOrder: parseInt(form.sortOrder) || 0,
        facilities: form.facilities,
        operatingHours: form.hours,
      };
      if (isEdit) {
        await api.patch(`/api/branches/${branch!.id}`, payload);
      } else {
        await api.post('/api/branches', payload);
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Gagal menyimpan cabang.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="font-bold text-slate-900 text-lg">{isEdit ? 'Edit Cabang' : 'Tambah Cabang Baru'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertTriangle size={15} /> {error}
            </div>
          )}

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Cabang *</label>
              <input
                value={form.name}
                onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)); }}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="aftech Klinik Jakarta Selatan"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Slug *</label>
              <input
                value={form.slug}
                onChange={e => set('slug', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                placeholder="aftech-klinik-jakarta-selatan"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Telepon</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="021-5551234" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Alamat *</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Jl. Sudirman No. 123" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kota *</label>
              <input value={form.city} onChange={e => set('city', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Jakarta Selatan" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Provinsi</label>
              <input value={form.province} onChange={e => set('province', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="DKI Jakarta" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="cabang@aftechklinik.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Urutan tampil</label>
              <input type="number" value={form.sortOrder} onChange={e => set('sortOrder', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Latitude</label>
              <input type="number" step="any" value={form.latitude} onChange={e => set('latitude', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="-6.2297" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Longitude</label>
              <input type="number" step="any" value={form.longitude} onChange={e => set('longitude', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="106.8295" />
            </div>
          </div>

          {/* Facilities */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Fasilitas</label>
            <div className="flex flex-wrap gap-2">
              {FACILITY_OPTIONS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFacility(f)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${form.facilities.includes(f) ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                >
                  {form.facilities.includes(f) && <Check size={11} />}
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Operating hours */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-2">Jam Operasional</label>
            <div className="space-y-2">
              {([['weekday', 'Senin – Jumat'], ['saturday', 'Sabtu'], ['sunday', 'Minggu']] as const).map(([day, label]) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-xs text-slate-600 w-28 flex-shrink-0">{label}</span>
                  <input type="time" value={form.hours[day].open}
                    onChange={e => setHour(day, 'open', e.target.value)}
                    className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <span className="text-slate-400 text-xs">–</span>
                  <input type="time" value={form.hours[day].close}
                    onChange={e => setHour(day, 'close', e.target.value)}
                    className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            Batal
          </button>
          <button onClick={submit} disabled={saving} className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl transition-colors">
            {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Cabang'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Branch Detail Drawer ─────────────────────────────────────────────────────
function BranchDetail({
  branch, allDoctors, onClose, onEdit, onDeactivate, onRefresh,
}: {
  branch: Branch;
  allDoctors: Doctor[];
  onClose: () => void;
  onEdit: () => void;
  onDeactivate: () => void;
  onRefresh: () => void;
}) {
  const [search, setSearch] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const branchDoctorIds = new Set(branch.doctors?.map(d => d.doctor.id) ?? []);

  async function assignDoctor(doc: Doctor) {
    setAssigning(true);
    try {
      await api.post(`/api/doctors/${doc.id}/branches`, { branchId: branch.id });
      onRefresh();
    } catch { /* silent */ } finally { setAssigning(false); }
  }

  async function removeDoctor(docId: string) {
    setRemoving(docId);
    try {
      await api.post(`/api/doctors/${docId}/branches/remove`, { branchId: branch.id });
      onRefresh();
    } catch { /* silent */ } finally { setRemoving(null); }
  }

  const available = allDoctors.filter(d =>
    !branchDoctorIds.has(d.id) &&
    (search === '' || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  const hours = branch.operatingHours;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="font-bold text-slate-900 text-base leading-tight">{branch.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
              <MapPin size={11} /> {branch.city}{branch.province ? `, ${branch.province}` : ''}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
            <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600">
              <Pencil size={14} />
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500">
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Info */}
          <div className="px-5 py-4 space-y-2 border-b border-slate-100">
            {branch.address && <div className="flex gap-2 text-sm text-slate-600"><MapPin size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />{branch.address}</div>}
            {branch.phone && <div className="flex gap-2 text-sm text-slate-600"><Phone size={14} className="text-slate-400 flex-shrink-0" />{branch.phone}</div>}
            {branch.email && <div className="flex gap-2 text-sm text-slate-600"><Mail size={14} className="text-slate-400 flex-shrink-0" />{branch.email}</div>}
            <div className="flex items-center gap-2 pt-1">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${branch.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                {branch.isActive ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>

          {/* Facilities */}
          {branch.facilities?.length > 0 && (
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2">Fasilitas</p>
              <div className="flex flex-wrap gap-1.5">
                {branch.facilities.map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {FACILITY_ICON[f]} {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Operating hours */}
          {hours && (
            <div className="px-5 py-4 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1"><Clock size={12} /> Jam Operasional</p>
              <div className="space-y-1.5">
                {([['weekday', 'Senin – Jumat'], ['saturday', 'Sabtu'], ['sunday', 'Minggu']] as const).map(([day, label]) => (
                  <div key={day} className="flex justify-between text-xs">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-700">
                      {hours[day]?.open === 'Tutup' ? 'Tutup' : `${hours[day]?.open} – ${hours[day]?.close}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctors in this branch */}
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1">
              <Stethoscope size={12} /> Dokter di Cabang Ini ({branch.doctors?.length ?? 0})
            </p>
            {branch.doctors?.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Belum ada dokter.</p>
            ) : (
              <div className="space-y-2">
                {branch.doctors?.map(({ doctor }) => (
                  <div key={doctor.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{doctor.name}</div>
                      <div className="text-xs text-slate-500">{doctor.specialty}</div>
                    </div>
                    <button
                      onClick={() => removeDoctor(doctor.id)}
                      disabled={removing === doctor.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 disabled:opacity-40 flex-shrink-0"
                      title="Lepas dari cabang"
                    >
                      {removing === doctor.id ? '…' : <UserMinus size={13} />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assign doctor */}
          <div className="px-5 py-4">
            <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1">
              <UserPlus size={12} /> Tambahkan Dokter
            </p>
            <div className="relative mb-3">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama / spesialisasi..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {available.length === 0 ? (
              <p className="text-xs text-slate-400 italic">{search ? 'Dokter tidak ditemukan.' : 'Semua dokter sudah ditambahkan.'}</p>
            ) : (
              <div className="space-y-1.5">
                {available.slice(0, 10).map(doc => (
                  <div key={doc.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors">
                    <div>
                      <div className="text-xs font-medium text-slate-900">{doc.name}</div>
                      <div className="text-[10px] text-slate-500">{doc.specialty}</div>
                    </div>
                    <button
                      onClick={() => assignDoctor(doc)}
                      disabled={assigning}
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 disabled:opacity-40 flex-shrink-0"
                    >
                      <UserPlus size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deactivate */}
        <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
          {confirmDeactivate ? (
            <div className="space-y-2">
              <p className="text-xs text-red-600 font-medium text-center">
                {branch.isActive ? 'Nonaktifkan cabang ini?' : 'Aktifkan kembali cabang ini?'}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmDeactivate(false)} className="flex-1 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl">
                  Batal
                </button>
                <button onClick={() => { onDeactivate(); setConfirmDeactivate(false); }}
                  className="flex-1 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl">
                  Ya, lanjutkan
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setConfirmDeactivate(true)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl transition-colors ${branch.isActive ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'}`}>
              {branch.isActive ? <><Trash2 size={15} /> Nonaktifkan Cabang</> : <><Check size={15} /> Aktifkan Cabang</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editBranch, setEditBranch] = useState<Branch | null>(null);
  const [detailBranch, setDetailBranch] = useState<Branch | null>(null);

  const loadBranches = useCallback(async () => {
    setLoading(true);
    try {
      const [br, docs] = await Promise.all([
        api.get('/api/branches').then(r => Array.isArray(r.data) ? r.data : r.data.data ?? []),
        api.get('/api/doctors?limit=100').then(r => Array.isArray(r.data) ? r.data : r.data.data ?? []),
      ]);
      setBranches(br);
      setAllDoctors(docs);
      if (detailBranch) {
        const updated = br.find((b: Branch) => b.id === detailBranch.id);
        // fetch detail with doctors
        if (updated) {
          const detail = await api.get(`/api/branches/${updated.slug}`).then(r => r.data).catch(() => null);
          setDetailBranch(detail ?? updated);
        }
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }, [detailBranch?.id]);

  useEffect(() => { loadBranches(); }, []);

  async function openDetail(branch: Branch) {
    const detail = await api.get(`/api/branches/${branch.slug}`).then(r => r.data).catch(() => branch);
    setDetailBranch(detail);
  }

  async function handleDeactivate() {
    if (!detailBranch) return;
    await api.delete(`/api/branches/${detailBranch.id}`).catch(() => {});
    setDetailBranch(null);
    loadBranches();
  }

  function openEdit() {
    setEditBranch(detailBranch);
    setShowModal(true);
    setDetailBranch(null);
  }

  const filtered = branches.filter(b =>
    search === '' ||
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Header title="Manajemen Cabang" />
      <div className="p-4 sm:p-6">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama cabang atau kota..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          <button
            onClick={() => { setEditBranch(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex-shrink-0"
          >
            <Plus size={16} /> Tambah Cabang
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Total Cabang', value: branches.length },
            { label: 'Aktif', value: branches.filter(b => b.isActive).length },
            { label: 'Nonaktif', value: branches.filter(b => !b.isActive).length },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Branch cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
            <Building2 size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">{search ? 'Cabang tidak ditemukan.' : 'Belum ada cabang.'}</p>
            {!search && (
              <button onClick={() => { setEditBranch(null); setShowModal(true); }}
                className="mt-4 text-sm text-emerald-600 font-semibold hover:underline">
                + Tambah cabang pertama
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(b => (
              <button
                key={b.id}
                onClick={() => openDetail(b)}
                className={`text-left bg-white rounded-2xl border transition-all hover:shadow-md active:scale-95 ${b.isActive ? 'border-slate-200 hover:border-emerald-300' : 'border-slate-100 opacity-60'}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Building2 size={18} className="text-emerald-600" />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${b.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {b.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{b.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                    <MapPin size={11} /> {b.city}{b.province ? `, ${b.province}` : ''}
                  </div>
                  <div className="space-y-1">
                    {b.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Phone size={11} className="text-slate-400" /> {b.phone}
                      </div>
                    )}
                    {b.email && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail size={11} className="text-slate-400" /> {b.email}
                      </div>
                    )}
                  </div>
                  {b.facilities?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-slate-100">
                      {b.facilities.slice(0, 3).map(f => (
                        <span key={f} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{f}</span>
                      ))}
                      {b.facilities.length > 3 && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">+{b.facilities.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Lihat detail & dokter</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {showModal && (
        <BranchModal
          branch={editBranch}
          onClose={() => { setShowModal(false); setEditBranch(null); }}
          onSaved={() => loadBranches()}
        />
      )}

      {/* Detail drawer */}
      {detailBranch && (
        <BranchDetail
          branch={detailBranch}
          allDoctors={allDoctors}
          onClose={() => setDetailBranch(null)}
          onEdit={openEdit}
          onDeactivate={handleDeactivate}
          onRefresh={async () => {
            const detail = await api.get(`/api/branches/${detailBranch.slug}`).then(r => r.data).catch(() => null);
            if (detail) setDetailBranch(detail);
          }}
        />
      )}
    </div>
  );
}
