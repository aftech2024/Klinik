'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { Save } from 'lucide-react';

type Setting = { key: string; value: unknown; group: string };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/api/settings').then(r => setSettings(r.data ?? [])).catch(() => {});
  }, []);

  async function save() {
    setSaving(true);
    const body = Object.fromEntries(settings.map(s => [s.key, s.value]));
    await api.post('/api/settings/bulk', body).catch(() => {});
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const groups = [...new Set(settings.map(s => s.group))];

  return (
    <div>
      <Header title="Pengaturan" />
      <div className="p-8 max-w-3xl">
        <div className="space-y-6">
          {groups.map(group => (
            <div key={group} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">{group}</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {settings.filter(s => s.group === group).map(s => (
                  <div key={s.key} className="px-6 py-4 flex items-center gap-4">
                    <label className="text-sm text-slate-700 w-48 flex-shrink-0">{s.key}</label>
                    <input
                      value={typeof s.value === 'string' ? s.value : JSON.stringify(s.value)}
                      onChange={e => setSettings(prev => prev.map(x => x.key === s.key ? { ...x, value: e.target.value } : x))}
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl text-sm transition-colors disabled:opacity-50">
            <Save size={16} /> {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
          {saved && <span className="text-sm text-emerald-600">Tersimpan!</span>}
        </div>
      </div>
    </div>
  );
}
