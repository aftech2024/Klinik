'use client';
import { useEffect } from 'react';

export default function TokenPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t');
    const r = params.get('r');
    const u = params.get('u');
    const redirect = params.get('redirect') ?? '/login';
    if (t) {
      localStorage.setItem('portal_token', t);
      if (r) localStorage.setItem('portal_refresh', r);
      if (u) {
        try { localStorage.setItem('portal_user', decodeURIComponent(u)); } catch {}
      }
      window.location.replace(redirect);
    } else {
      window.location.replace('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Masuk ke portal...</p>
      </div>
    </div>
  );
}
