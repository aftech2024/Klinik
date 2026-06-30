'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, ChevronDown, LogOut, ShieldCheck, Building2, Settings, CheckCheck, Info, Calendar, Megaphone } from 'lucide-react';
import { clearToken, getUser, type AdminUser } from '@/lib/auth';
import api from '@/lib/api';

type Notif = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'baru saja';
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

function NotifIcon({ type }: { type: string }) {
  if (type === 'appointment') return <Calendar size={14} className="text-blue-500" />;
  if (type === 'promo') return <Megaphone size={14} className="text-purple-500" />;
  return <Info size={14} className="text-slate-400" />;
}

export default function Header({ title }: { title: string }) {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [userOpen, setUserOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setUser(getUser()); }, []);

  const fetchNotifs = useCallback(async () => {
    try {
      const data = await api.get('/api/notifications').then(r => r.data ?? []);
      setNotifs(data);
    } catch (err: any) {
      // 401 = token invalid/expired — interceptor handles logout, stop polling
      if (err?.response?.status === 401) return;
      // other errors: silent ignore
    }
  }, []);

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 120000); // 2 min instead of 1
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function markRead(id: string) {
    await api.patch(`/api/notifications/${id}/read`).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  async function markAllRead() {
    setLoading(true);
    await api.patch('/api/notifications/read-all').catch(() => {});
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    setLoading(false);
  }

  function handleLogout() {
    clearToken();
    localStorage.removeItem('admin_refresh');
    router.push('/login');
  }

  const isSuper = user?.role === 'SUPER_ADMIN';
  const initials = user ? (user.name || user.email).slice(0, 2).toUpperCase() : 'AD';
  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{title}</h1>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

        {/* Bell */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => { setBellOpen(v => !v); setUserOpen(false); }}
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Notifikasi</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    disabled={loading}
                    className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
                  >
                    <CheckCheck size={13} /> Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifs.length === 0 ? (
                  <div className="py-10 text-center text-slate-400">
                    <Bell size={28} className="mx-auto mb-2 text-slate-200" />
                    <p className="text-sm">Tidak ada notifikasi</p>
                  </div>
                ) : notifs.slice(0, 20).map(n => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex gap-3 ${!n.isRead ? 'bg-blue-50/60' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!n.isRead ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <NotifIcon type={n.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm leading-tight ${!n.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {n.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</div>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserOpen(v => !v); setBellOpen(false); }}
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
            <ChevronDown size={14} className={`text-slate-400 transition-transform hidden sm:block ${userOpen ? 'rotate-180' : ''}`} />
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
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
                <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${isSuper ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                  {isSuper ? <ShieldCheck size={12} /> : <Building2 size={12} />}
                  {isSuper ? 'Super Admin' : 'Admin Klinik'}
                </div>
                {!isSuper && user?.branch && (
                  <div className="mt-2 text-xs text-slate-500">
                    <span className="font-medium text-slate-700">{user.branch.name}</span>
                    {user.branch.city && <span> · {user.branch.city}</span>}
                  </div>
                )}
              </div>

              <div className="p-2 space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setUserOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                >
                  <Settings size={15} className="text-slate-400" /> Pengaturan
                </Link>
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
