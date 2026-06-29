'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { UserPlus } from 'lucide-react';

export default function PortalRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/register', { ...form, role: 'PATIENT' });
      localStorage.setItem('portal_token', data.accessToken);
      if (data.refreshToken) localStorage.setItem('portal_refresh', data.refreshToken);
      if (data.user) localStorage.setItem('portal_user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Gagal mendaftar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Akun</h1>
          <p className="text-gray-500 mt-1 text-sm">Portal Pasien aftech Klinik</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}
            {[
              { key: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama lengkap Anda' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'email@contoh.com' },
              { key: 'phone', label: 'No. HP', type: 'tel', placeholder: '08xxxxxxxxxx' },
              { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 karakter' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <input type={type} required value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2">
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-emerald-600 font-medium hover:underline">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
