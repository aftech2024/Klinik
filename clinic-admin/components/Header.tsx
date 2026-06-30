'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ChevronDown, LogOut, ShieldCheck, Building2 } from 'lucide-react';
import { clearToken, getUser, type AdminUser } from '@/lib/auth';

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setUser(getUser()); }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleLogout() {
    clearToken();
    localStorage.removeItem('admin_refresh');
    router.push('/login');
  }

  const isSuper = user?.role === 'SUPER_ADMIN';
  const initials = user ? (user.name || user.email).slice(0, 2).toUpperCase() : 'AD';

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{title}</h1>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-semibold text-slate-800 leading-tight">{user?.name || 'Admin'}</div>
              <div className={`text-[10px] font-medium ${isSuper ? 'text-amber-500' : 'text-emerald-600'}`}>
                {isSuper ? 'Super Admin' : 'Admin Klinik'}
              </div>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform hidden sm:block ${open ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              {/* User info */}
              <div className="px-4 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Admin'}</div>
                    <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                  </div>
                </div>
                {/* Role badge */}
                <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${isSuper ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {isSuper ? <ShieldCheck size={12} /> : <Building2 size={12} />}
                  {isSuper ? 'Super Admin' : 'Admin Klinik'}
                </div>
                {/* Branch for scoped admin */}
                {!isSuper && user?.branch && (
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{user.branch.name}</span>
                    {user.branch.city && <span> · {user.branch.city}</span>}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                >
                  <LogOut size={15} /> Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
