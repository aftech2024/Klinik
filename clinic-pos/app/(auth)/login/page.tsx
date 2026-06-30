'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Space_Grotesk } from 'next/font/google';
import api from '@/lib/api';
import { setToken, setRefresh, setUser } from '@/lib/auth';
import { Eye, EyeOff, ShoppingCart, Package, TrendingUp, Zap, AlertCircle, Mail, Lock } from 'lucide-react';

const sg = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const TICKER = [
  { item: 'Paracetamol 500mg ×4', amount: 'Rp 12.000', method: 'CASH',     color: '#00C9A7' },
  { item: 'Amoxicillin 500mg ×6', amount: 'Rp 36.000', method: 'QRIS',     color: '#C8A56A' },
  { item: 'Antasida DOEN ×2',     amount: 'Rp 9.000',  method: 'CASH',     color: '#00C9A7' },
  { item: 'Vitamin C 500mg ×10',  amount: 'Rp 18.000', method: 'TRANSFER', color: '#7C9FD4' },
  { item: 'Cetirizine 10mg ×5',   amount: 'Rp 22.500', method: 'QRIS',     color: '#C8A56A' },
  { item: 'Omeprazole 20mg ×7',   amount: 'Rp 31.500', method: 'CARD',     color: '#A78BFA' },
  { item: 'Ibuprofen 400mg ×3',   amount: 'Rp 13.500', method: 'CASH',     color: '#00C9A7' },
  { item: 'OBH Combi ×1',         amount: 'Rp 14.000', method: 'QRIS',     color: '#C8A56A' },
  { item: 'Metformin 500mg ×14',  amount: 'Rp 28.000', method: 'CASH',     color: '#00C9A7' },
  { item: 'Betamethasone ×2',     amount: 'Rp 16.000', method: 'TRANSFER', color: '#7C9FD4' },
];

const STATS = [
  { icon: ShoppingCart, label: 'Transaksi Hari Ini', value: '147', sub: '+12 dari kemarin',  accent: '#00C9A7' },
  { icon: TrendingUp,   label: 'Revenue',            value: 'Rp 4,2jt', sub: '↑ 8% minggu ini', accent: '#C8A56A' },
  { icon: Package,      label: 'Stok Obat',          value: '312 SKU', sub: '8 hampir habis',  accent: '#7C9FD4' },
];

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

  const doubled = [...TICKER, ...TICKER];

  return (
    <div className={`${sg.className} min-h-screen flex overflow-hidden`} style={{ background: '#050A18' }}>

      {/* ── BACKGROUND ORBS ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Orb 1 — teal */}
        <div
          className="animate-orb-1 absolute rounded-full"
          style={{
            width: 600, height: 600,
            top: '-15%', left: '-10%',
            background: 'radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Orb 2 — blue */}
        <div
          className="animate-orb-2 absolute rounded-full"
          style={{
            width: 500, height: 500,
            bottom: '-10%', left: '30%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        {/* Orb 3 — purple */}
        <div
          className="animate-orb-3 absolute rounded-full"
          style={{
            width: 400, height: 400,
            top: '20%', right: '-5%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col relative z-10" style={{ flex: '0 0 54%' }}>
        {/* Top logo */}
        <div className="px-10 pt-10 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#00C9A7,#00A88C)', boxShadow: '0 0 20px rgba(0,201,167,0.3)' }}
          >
            <Zap size={17} fill="#050A18" color="#050A18" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#E4ECF8', letterSpacing: '-0.01em' }}>
            aftech <span style={{ color: '#00C9A7' }}>Klinik</span>
          </span>
        </div>

        {/* Main copy */}
        <div className="px-10 mt-16 animate-slide-right">
          <div
            className="text-xs font-semibold uppercase tracking-[0.3em] mb-4"
            style={{ color: '#C8A56A' }}
          >
            ● Sistem POS Aktif
          </div>
          <h1
            className="font-bold leading-[1.12] mb-6"
            style={{ fontSize: 'clamp(2.6rem, 4.5vw, 3.8rem)', color: '#E4ECF8', letterSpacing: '-0.03em' }}
          >
            Kasir lebih cepat,<br />
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #00C9A7 0%, #7C9FD4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              transaksi lebih mudah.
            </span>
          </h1>
          <p style={{ color: 'rgba(228,236,248,0.45)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 380 }}>
            Kelola penjualan obat, pantau stok, dan catat setiap transaksi secara real-time di seluruh cabang aftech Klinik.
          </p>
        </div>

        {/* Stats cards */}
        <div className="px-10 mt-10 grid grid-cols-3 gap-3">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="animate-stat rounded-2xl p-4 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `rgba(${s.accent === '#00C9A7' ? '0,201,167' : s.accent === '#C8A56A' ? '200,165,106' : '124,159,212'},0.15)` }}
              >
                <s.icon size={15} style={{ color: s.accent }} />
              </div>
              <div className="font-bold text-lg leading-none mb-1" style={{ color: '#E4ECF8' }}>{s.value}</div>
              <div className="text-[10px] font-medium" style={{ color: 'rgba(228,236,248,0.4)' }}>{s.label}</div>
              <div className="text-[9px] mt-1" style={{ color: s.accent, opacity: 0.7 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Live transaction ticker */}
        <div className="mt-8 flex-1 min-h-0 relative overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)' }}>
          <div className="animate-ticker">
            {doubled.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-4 mx-10 px-4 py-2.5 rounded-xl mb-1.5"
                style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.025)' : 'transparent' }}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: row.color, opacity: 0.7 }}
                />
                <span className="flex-1 text-xs truncate" style={{ color: 'rgba(228,236,248,0.5)' }}>
                  {row.item}
                </span>
                <span className="font-mono text-xs font-semibold tabular-nums" style={{ color: 'rgba(228,236,248,0.6)' }}>
                  {row.amount}
                </span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider w-12 text-right"
                  style={{ color: row.color }}
                >
                  {row.method}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom date */}
        <div className="px-10 py-8 flex items-center gap-2 text-xs" style={{ color: 'rgba(228,236,248,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full animate-blink flex-shrink-0" style={{ background: '#00C9A7' }} />
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* ── RIGHT / FORM PANEL ── */}
      <div
        className="flex-1 relative z-10 flex flex-col items-center justify-center p-6 sm:p-10"
        style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <div className="inline-flex items-center gap-2.5 mb-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#00C9A7,#00A88C)', boxShadow: '0 0 16px rgba(0,201,167,0.3)' }}
            >
              <Zap size={14} fill="#050A18" color="#050A18" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#E4ECF8' }}>
              aftech <span style={{ color: '#00C9A7' }}>POS</span>
            </span>
          </div>
          <p style={{ color: 'rgba(228,236,248,0.35)', fontSize: '0.8rem' }}>Sistem Kasir Klinik</p>
        </div>

        {/* Glass form card */}
        <div
          className="w-full max-w-[380px] animate-fade-up rounded-3xl p-8"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
          }}
        >
          {/* Card header */}
          <div className="mb-7">
            <div
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] mb-4 px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.2)', color: '#00C9A7' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-blink" />
              Masuk ke POS
            </div>
            <h2
              className="font-bold leading-tight mb-2"
              style={{ fontSize: '1.6rem', color: '#E4ECF8', letterSpacing: '-0.025em' }}
            >
              Selamat datang
            </h2>
            <p style={{ color: 'rgba(228,236,248,0.4)', fontSize: '0.85rem' }}>
              Khusus kasir, admin klinik & super admin.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                color: '#FCA5A5',
              }}
            >
              <AlertCircle size={15} className="flex-shrink-0" /> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(228,236,248,0.4)' }}>
                Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(228,236,248,0.25)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="kasir@aftechklinik.com"
                  required
                  className="w-full pl-11 pr-4 py-3 text-sm rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#E4ECF8',
                    caretColor: '#00C9A7',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(0,201,167,0.45)';
                    e.target.style.background = 'rgba(0,201,167,0.04)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,201,167,0.07)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(228,236,248,0.4)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(228,236,248,0.25)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3 text-sm rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#E4ECF8',
                    caretColor: '#00C9A7',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(0,201,167,0.45)';
                    e.target.style.background = 'rgba(0,201,167,0.04)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,201,167,0.07)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1 rounded-lg"
                  style={{ color: 'rgba(228,236,248,0.3)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(228,236,248,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(228,236,248,0.3)')}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all relative overflow-hidden"
                style={{
                  background: loading
                    ? 'rgba(0,201,167,0.35)'
                    : 'linear-gradient(135deg, #00C9A7 0%, #00A88C 100%)',
                  color: loading ? 'rgba(255,255,255,0.5)' : '#050A18',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 8px 32px rgba(0,201,167,0.28)',
                  letterSpacing: '0.03em',
                }}
                onMouseEnter={e => {
                  if (!loading) e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,201,167,0.4)';
                }}
                onMouseLeave={e => {
                  if (!loading) e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,201,167,0.28)';
                }}
                onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.984)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border-2 inline-block"
                      style={{ borderColor: 'rgba(255,255,255,0.25)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }}
                    />
                    Memverifikasi...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Masuk ke POS
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Role chips */}
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] text-center font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(228,236,248,0.2)' }}>
              Akses untuk
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[
                { label: 'Super Admin', color: '#C8A56A' },
                { label: 'Admin Klinik', color: '#7C9FD4' },
                { label: 'Kasir', color: '#00C9A7' },
              ].map(r => (
                <span
                  key={r.label}
                  className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: `rgba(${r.color === '#C8A56A' ? '200,165,106' : r.color === '#7C9FD4' ? '124,159,212' : '0,201,167'},0.1)`,
                    border: `1px solid ${r.color}30`,
                    color: r.color,
                  }}
                >
                  {r.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-[11px] text-center" style={{ color: 'rgba(228,236,248,0.15)' }}>
          aftech Klinik · Sistem Internal · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
