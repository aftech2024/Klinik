'use client';
import { useEffect } from 'react';

export default function LoginRedirect() {
  useEffect(() => {
    window.location.href = 'http://localhost:3000/login';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Mengalihkan ke halaman login...</p>
      </div>
    </div>
  );
}
