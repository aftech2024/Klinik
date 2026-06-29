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
    // Super admin without active branch → pick branch first
    if (u?.role === 'SUPER_ADMIN' && !getActiveBranchId()) {
      router.replace('/branch-select');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-[#0a0f1e]">
      <POSSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
