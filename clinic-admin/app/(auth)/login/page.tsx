'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/auth/login', form);
      const ALLOWED = ['ADMIN', 'SUPER_ADMIN', 'DOCTOR'];
      if (!ALLOWED.includes(data.user?.role)) {
        setError('Akses ditolak: bukan admin');
        return;
      }
      setToken(data.accessToken);
      if (data.refreshToken) localStorage.setItem('admin_refresh', data.refreshToken);
      setUser(data.user);
      router.push('/dashboard');
    } catch {
      setError('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT: photo panel ── */}
      <div
        className="hidden lg:flex flex-col justify-end relative overflow-hidden"
        style={{ flex: '0 0 50%' }}
      >
        {/* Doctor photo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=900&q=80&fit=crop')`,
          }}
        />
        {/* Blue-teal gradient overlay — matches reference */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(74,122,168,0.35) 0%, rgba(45,95,138,0.70) 60%, rgba(30,72,110,0.88) 100%)',
          }}
        />

        {/* Brand + tagline at bottom */}
        <div className="relative z-10 px-10 pb-12">
          {/* Logo pill */}
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {/* Stethoscope icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              aftech <span style={{ opacity: 0.85 }}>Klinik</span>
            </span>
          </div>
          <h2 className="text-white font-bold text-2xl leading-snug mb-2">
            Empowering Healthcare,<br />One Click at a Time.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Kelola klinik, dokter, dan pasien Anda<br />dari satu dashboard terpadu.
          </p>
        </div>
      </div>

      {/* ── RIGHT: form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-8 sm:px-16">
        <div className="w-full max-w-[380px]">

          {/* Logo — mobile only */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">aftech Klinik</span>
          </div>

          {/* Desktop logo top */}
          <div className="hidden lg:flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
            </div>
            <span className="font-bold text-slate-800">aftech Klinik</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Login</h1>
          <p className="text-slate-400 text-sm mb-8">Log in to your account.</p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Enter your email"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ '--tw-ring-color': '#3B6FA0' } as React.CSSProperties}
                onFocus={e => { e.target.style.borderColor = '#3B6FA0'; e.target.style.boxShadow = '0 0 0 3px rgba(59,111,160,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                  onFocus={e => { e.target.style.borderColor = '#3B6FA0'; e.target.style.boxShadow = '0 0 0 3px rgba(59,111,160,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <span className="text-sm font-medium cursor-pointer" style={{ color: '#3B6FA0' }}>
                  Forgot Password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all mt-2"
              style={{
                background: loading ? '#7ba3c4' : '#3B6FA0',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(59,111,160,0.3)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2D5F8A'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#3B6FA0'; }}
            >
              {loading ? 'Memverifikasi...' : 'Log In'}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-slate-400 mt-8">
            Butuh akses?{' '}
            <span className="font-semibold cursor-pointer" style={{ color: '#3B6FA0' }}>
              Hubungi Super Admin
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
