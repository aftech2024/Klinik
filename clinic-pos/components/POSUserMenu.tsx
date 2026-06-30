'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Settings, LogOut, ChevronDown, ShieldCheck, Building2, User } from 'lucide-react';
import { getUser, clearAuth, clearActiveBranch, type PosUser } from '@/lib/auth';

const GREEN = '#3DB549';

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', color: '#d97706', bg: '#fffbeb' },
  ADMIN:       { label: 'Admin Klinik', color: '#16a34a', bg: '#f0fdf4' },
  CASHIER:     { label: 'Kasir',        color: '#0284c7', bg: '#f0f9ff' },
};

export default function POSUserMenu() {
  const [open, setOpen] = useState(false);
  const [user, setUserState] = useState<PosUser | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => { setUserState(getUser()); }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function logout() {
    clearAuth();
    router.push('/login');
  }

  if (!user) return null;

  const initials = (user.name || user.email || 'U').slice(0, 2).toUpperCase();
  const roleMeta = ROLE_META[user.role] ?? ROLE_META.CASHIER;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}
      >
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
            Hi, I&apos;m {roleMeta.label}
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
            {user.name || 'User'}
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: '#dcfce7', color: '#16a34a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 700,
        }}>
          {initials}
        </div>
        <ChevronDown size={14} style={{ color: '#94a3b8', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          width: 220, background: '#fff',
          borderRadius: 16, border: '1px solid #f1f5f9',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          zIndex: 100, overflow: 'hidden',
        }}>
          {/* User info */}
          <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.875rem' }}>{user.name}</div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{user.email}</div>
            <span style={{
              display: 'inline-block', marginTop: 6,
              fontSize: '0.68rem', fontWeight: 700,
              padding: '3px 10px', borderRadius: 999,
              background: roleMeta.bg, color: roleMeta.color,
            }}>
              {roleMeta.label}
            </span>
            {user.branch?.name && (
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>
                {user.branch.name}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ padding: '6px 0' }}>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', fontSize: '0.85rem', fontWeight: 500,
                color: '#475569', textDecoration: 'none',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <Settings size={16} style={{ color: '#94a3b8' }} />
              Pengaturan
            </Link>
            <button
              onClick={logout}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 16px', fontSize: '0.85rem', fontWeight: 500,
                color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer',
                textAlign: 'left', transition: 'background 0.1s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
