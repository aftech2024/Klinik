'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Stethoscope, ArrowLeft } from 'lucide-react';

export default function DokterLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', form);
      localStorage.setItem('portal_token', data.accessToken);
      if (data.refreshToken) localStorage.setItem('portal_refresh', data.refreshToken);
      if (data.user) localStorage.setItem('portal_user', JSON.stringify(data.user));
      router.push('/doctor/dashboard');
    } catch {
      setError('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-blue-300/70 hover:text-blue-200 mb-6 transition-colors">
          <ArrowLeft size="16" /> Kembali
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/20">
            <Stethoscope size={28} className="text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-white">Portal Dokter</h1>
          <p className="text-blue-200/80 mt-1.5 text-sm">Masuk ke akun dokter aftech Klinik</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-400/20 text-red-300 text-sm rounded-xl px-4 py-3 text-center">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="email@contoh.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-white hover:bg-blue-50 text-blue-800 font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
                  Memverifikasi...
                </span>
              ) : 'Masuk sebagai Dokter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
