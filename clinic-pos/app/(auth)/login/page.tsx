'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Space_Grotesk } from 'next/font/google';
import api from '@/lib/api';
import { setToken, setRefresh, setUser } from '@/lib/auth';
import { Eye, EyeOff } from 'lucide-react';

const sg = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '700'] });

// Ambient feed — simulated real transactions (Indonesian clinic context)
const FEED_ROWS = [
  { time: '07:02', item: 'Paracetamol 500mg ×4', amount: 'Rp 12.000', method: 'CASH' },
  { time: '07:11', item: 'Amoxicillin 500mg ×6', amount: 'Rp 36.000', method: 'QRIS' },
  { time: '07:19', item: 'Antasida DOEN ×2', amount: 'Rp 9.000', method: 'CASH' },
  { time: '07:33', item: 'Vitamin C 500mg ×10', amount: 'Rp 18.000', method: 'TRANSFER' },
  { time: '07:44', item: 'Cetirizine 10mg ×5', amount: 'Rp 22.500', method: 'QRIS' },
  { time: '07:58', item: 'Omeprazole 20mg ×7', amount: 'Rp 31.500', method: 'CARD' },
  { time: '08:06', item: 'Ibuprofen 400mg ×3', amount: 'Rp 13.500', method: 'CASH' },
  { time: '08:17', item: 'OBH Combi ×1', amount: 'Rp 14.000', method: 'QRIS' },
  { time: '08:29', item: 'Metformin 500mg ×14', amount: 'Rp 28.000', method: 'CASH' },
  { time: '08:41', item: 'Betamethasone ×2', amount: 'Rp 16.000', method: 'TRANSFER' },
  { time: '08:55', item: 'Paracetamol 500mg ×8', amount: 'Rp 24.000', method: 'CASH' },
  { time: '09:03', item: 'Cetirizine 10mg ×3', amount: 'Rp 13.500', method: 'QRIS' },
  { time: '09:12', item: 'Omeprazole 20mg ×5', amount: 'Rp 22.500', method: 'CASH' },
  { time: '09:24', item: 'Amoxicillin 500mg ×9', amount: 'Rp 54.000', method: 'QRIS' },
  { time: '09:37', item: 'Vitamin C 500mg ×6', amount: 'Rp 10.800', method: 'CARD' },
  { time: '09:49', item: 'Ibuprofen 400mg ×5', amount: 'Rp 22.500', method: 'CASH' },
];

const METHOD_COLOR: Record<string, string> = {
  CASH: 'text-[#00C9A7]',
  QRIS: 'text-[#C8A56A]',
  TRANSFER: 'text-[#7C9FD4]',
  CARD: 'text-[#A78BFA]',
};

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

  // Duplicate feed for seamless loop
  const feedDouble = [...FEED_ROWS, ...FEED_ROWS];

  return (
    <div className={`${sg.className} min-h-screen flex bg-[#06091A]`}>

      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex flex-col relative overflow-hidden"
        style={{ flex: '0 0 56%' }}
      >
        {/* Animated gradient base */}
        <div
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: 'linear-gradient(135deg, #06091A 0%, #081628 35%, #0A1E3A 55%, #06091A 100%)',
          }}
        />

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />

        {/* Scrolling transaction feed (behind everything) */}
        <div className="absolute inset-0 overflow-hidden" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)' }}>
          <div className="animate-feed" style={{ willChange: 'transform' }}>
            {feedDouble.map((row, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-10 py-2.5 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.03)' }}
              >
                <span className="font-mono text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.2)', minWidth: '2.75rem' }}>
                  {row.time}
                </span>
                <span className="flex-1 text-xs truncate" style={{ color: 'rgba(255,255,255,0.18)' }}>
                  {row.item}
                </span>
                <span className="font-mono text-xs tabular-nums" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {row.amount}
                </span>
                <span className={`text-[10px] font-semibold uppercase tracking-wider w-14 text-right ${METHOD_COLOR[row.method]}`} style={{ opacity: 0.4 }}>
                  {row.method}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Giant POS outline mark — the signature */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{ zIndex: 2 }}
        >
          <div
            style={{
              fontSize: 'clamp(9rem, 22vw, 19rem)',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(0,201,167,0.22)',
              textShadow: '0 0 120px rgba(0,201,167,0.06)',
              userSelect: 'none',
              lineHeight: 1,
              paddingLeft: '0.22em',
            }}
          >
            POS
          </div>
        </div>

        {/* Top-left logotype */}
        <div className="relative z-10 p-8 flex items-center gap-2.5 flex-shrink-0">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,201,167,0.15)', border: '1px solid rgba(0,201,167,0.25)' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3h12M1 7h12M1 11h12M4 1v12M10 1v12" stroke="#00C9A7" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ color: '#E4ECF8', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.01em' }}>
            aftech <span style={{ color: '#00C9A7' }}>Klinik</span>
          </span>
        </div>

        {/* Bottom meta */}
        <div className="relative z-10 mt-auto p-8 pb-10 flex-shrink-0">
          <div
            className="text-xs font-semibold uppercase tracking-[0.25em] mb-2"
            style={{ color: '#C8A56A' }}
          >
            Sistem Kasir
          </div>
          <div
            className="text-3xl font-bold leading-tight"
            style={{ color: '#E4ECF8', letterSpacing: '-0.02em' }}
          >
            Selamat memulai<br />
            <span style={{ color: 'rgba(228,236,248,0.45)' }}>shift hari ini.</span>
          </div>
          <div
            className="mt-6 flex items-center gap-1.5 text-xs"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#00C9A7', animation: 'pulse-ring 2.4s ease-in-out infinite' }}
            />
            Sistem aktif · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10"
        style={{ background: '#0C1428', borderLeft: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <div
            className="inline-flex items-center gap-2 mb-1"
          >
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#E4ECF8' }}>
              aftech <span style={{ color: '#00C9A7' }}>POS</span>
            </span>
          </div>
          <p style={{ color: 'rgba(228,236,248,0.4)', fontSize: '0.8rem' }}>Sistem Kasir Klinik</p>
        </div>

        <div className="w-full max-w-[360px] animate-fade-up">
          {/* Header */}
          <div className="mb-8">
            <div
              className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: '#C8A56A' }}
            >
              Masuk ke POS
            </div>
            <h1
              className="text-2xl font-bold"
              style={{ color: '#E4ECF8', letterSpacing: '-0.02em', lineHeight: 1.25 }}
            >
              Selamat datang kembali
            </h1>
            <p
              className="mt-1.5 text-sm"
              style={{ color: 'rgba(228,236,248,0.45)' }}
            >
              Khusus kasir, admin klinik &amp; super admin.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#FCA5A5',
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{ color: 'rgba(228,236,248,0.5)' }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="kasir@aftechklinik.com"
                required
                className="w-full px-4 py-3 text-sm rounded-xl transition-all outline-none"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#E4ECF8',
                  caretColor: '#00C9A7',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(0,201,167,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,201,167,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-semibold mb-2 uppercase tracking-wider"
                style={{ color: 'rgba(228,236,248,0.5)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 text-sm rounded-xl transition-all outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#E4ECF8',
                    caretColor: '#00C9A7',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(0,201,167,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,201,167,0.08)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'rgba(228,236,248,0.35)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(228,236,248,0.7)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(228,236,248,0.35)')}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
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
                  background: loading ? 'rgba(0,201,167,0.4)' : '#00C9A7',
                  color: loading ? 'rgba(255,255,255,0.6)' : '#06091A',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 24px rgba(0,201,167,0.25)',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#00B896'; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#00C9A7'; }}
                onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.985)'; }}
                onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border-2 inline-block"
                      style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite' }}
                    />
                    Memverifikasi...
                  </span>
                ) : (
                  'Masuk ke POS →'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div
            className="mt-8 pt-6 text-center text-xs"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              color: 'rgba(228,236,248,0.2)',
            }}
          >
            aftech Klinik · Sistem Kasir Internal
          </div>
        </div>
      </div>
    </div>
  );
}
