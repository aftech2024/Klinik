'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User, Save } from 'lucide-react';

type Profile = { name: string; email: string; phone: string | null; dateOfBirth: string | null; gender: string | null; address: string | null };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ name: '', email: '', phone: '', dateOfBirth: '', gender: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/api/auth/me').then(r => {
      const u = r.data;
      setProfile({ name: u.name ?? '', email: u.email ?? '', phone: u.phone ?? '', dateOfBirth: u.patient?.dateOfBirth?.split('T')[0] ?? '', gender: u.patient?.gender ?? '', address: u.patient?.address ?? '' });
    }).catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await api.patch('/api/auth/me', profile).catch(() => {});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 flex items-center gap-4 border-b border-gray-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
            <User size={28} className="text-emerald-600" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-lg">{profile.name}</div>
            <div className="text-gray-500 text-sm">{profile.email}</div>
          </div>
        </div>

        <form onSubmit={save} className="p-6 space-y-5">
          {[
            { key: 'name', label: 'Nama Lengkap', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'No. HP', type: 'tel' },
            { key: 'dateOfBirth', label: 'Tanggal Lahir', type: 'date' },
            { key: 'address', label: 'Alamat', type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input
                type={type}
                value={profile[key as keyof Profile] ?? ''}
                onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Kelamin</label>
            <select value={profile.gender ?? ''} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">-- Pilih --</option>
              <option value="MALE">Laki-laki</option>
              <option value="FEMALE">Perempuan</option>
            </select>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl text-sm hover:bg-emerald-700 disabled:opacity-50">
              <Save size={15} /> {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            {saved && <span className="text-sm text-emerald-600">Profil tersimpan!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
