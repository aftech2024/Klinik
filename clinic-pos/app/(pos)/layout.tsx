'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import POSSidebar from '@/components/POSSidebar';
import { isLoggedIn, getActiveBranchId, getUser } from '@/lib/auth';

export default function PosLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }
    const u = getUser();
    if (u?.role === 'SUPER_ADMIN' && !getActiveBranchId()) {
      router.replace('/branch-select');
    }
  }, [router]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F2F3F7' }}>
      {/* Decorative circles — Sakma Studio style */}
      <div style={{
        position: 'fixed', top: -120, right: -120,
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(61,181,73,0.12)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: -100, right: 80,
        width: 280, height: 280, borderRadius: '50%',
        background: 'rgba(61,181,73,0.08)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', bottom: -60, left: 80,
        width: 180, height: 180, borderRadius: '50%',
        background: 'rgba(61,181,73,0.07)', pointerEvents: 'none', zIndex: 0,
      }} />

      <POSSidebar />
      <main className="flex-1 py-4 pr-4 overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ height: '100%', background: '#fff', borderRadius: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
