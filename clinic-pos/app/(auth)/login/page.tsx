'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Space_Grotesk } from 'next/font/google';
import api from '@/lib/api';
import { setToken, setRefresh, setUser } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

const sg = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function PosLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { accessToken, refreshToken, user } = res.data;
      if (!['SUPER_ADMIN', 'ADMIN', 'CASHIER'].includes(user.role)) {
        setError('Akun ini tidak memiliki akses ke sistem POS.');
        return;
      }
      setToken(accessToken);
      setRefresh(refreshToken);
      setUser({ id: user.id, name: user.name, email: user.email, role: user.role, branchId: user.branchId ?? null, branch: user.branch ?? null });
      router.replace(user.role === 'SUPER_ADMIN' && !user.branchId ? '/branch-select' : '/terminal');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Email atau password salah.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${sg.className} min-h-screen flex`}>

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
        {/* Blue overlay matching reference */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(74,122,168,0.25) 0%, rgba(45,95,138,0.65) 55%, rgba(28,68,108,0.90) 100%)',
          }}
        />

        {/* Brand + tagline */}
        <div className="relative z-10 px-10 pb-12">
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {/* Pill / POS icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">
              aftech <span style={{ opacity: 0.85 }}>Klinik</span>
            </span>
          </div>
          <h2 className="text-white font-bold text-2xl leading-snug mb-2">
            Empowering Healthcare,<br />One Click at a Time:
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.65 }}>
            Your Health, Your Records, Your Control.
          </p>
        </div>
      </div>

      {/* ── RIGHT: form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-white px-8 sm:px-14">
        <div className="w-full max-w-[380px]">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(59,111,160,0.1)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B6FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <line x1="12" y1="12" x2="12" y2="16" />
                <line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">aftech Klinik</span>
          </div>

          {/* Heading */}
          <h1 className="text-[2rem] font-bold text-slate-900 mb-1 leading-tight">Login</h1>
          <p className="text-slate-400 text-sm mb-8">Log in to your account.</p>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                onFocus={e => { e.target.style.borderColor = '#3B6FA0'; e.target.style.boxShadow = '0 0 0 3px rgba(59,111,160,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 pr-12 text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
                  onFocus={e => { e.target.style.borderColor = '#3B6FA0'; e.target.style.boxShadow = '0 0 0 3px rgba(59,111,160,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <div className="text-right mt-2">
                <span className="text-sm font-medium" style={{ color: '#3B6FA0' }}>
                  Forgot Password?
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-sm font-bold text-white transition-all mt-1"
              style={{
                background: loading ? '#7ba3c4' : '#3B6FA0',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(59,111,160,0.28)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2D5880'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#3B6FA0'; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 inline-block" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }} />
                  Memverifikasi...
                </span>
              ) : 'Log In'}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-sm text-slate-400 mt-8">
            Khusus{' '}
            <span className="font-semibold text-slate-600">Kasir</span>,{' '}
            <span className="font-semibold text-slate-600">Admin Klinik</span> &amp;{' '}
            <span className="font-semibold text-slate-600">Super Admin</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
