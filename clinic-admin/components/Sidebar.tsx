'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Stethoscope, MapPin, CalendarDays, ListOrdered, Receipt, BarChart3, Settings, LogOut, ChevronRight, ShieldCheck, Building2, Package, ShoppingCart, UserCog } from 'lucide-react';
import { clearToken, getUser, type AdminUser } from '@/lib/auth';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

// Super Admin — global control across all clinics
const SUPER_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clinic-admins', label: 'Admin Klinik', icon: ShieldCheck },
  { href: '/cashiers', label: 'Kasir POS', icon: UserCog },
  { href: '/branches', label: 'Cabang / Klinik', icon: MapPin },
  { href: '/doctors', label: 'Semua Dokter', icon: Stethoscope },
  { href: '/patients', label: 'Pasien', icon: Users },
  { href: '/appointments', label: 'Appointment', icon: CalendarDays },
  { href: '/billing', label: 'Billing', icon: Receipt },
  { href: '/inventory', label: 'Inventori', icon: Package },
  { href: '/pos', label: 'Kasir / POS', icon: ShoppingCart },
  { href: '/reports', label: 'Laporan Global', icon: BarChart3 },
  { href: '/settings', label: 'Pengaturan', icon: Settings },
];

// Clinic Admin — scoped to their own clinic only
const CLINIC_NAV: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard Klinik', icon: LayoutDashboard },
  { href: '/doctors', label: 'Dokter Klinik', icon: Stethoscope },
  { href: '/appointments', label: 'Appointment', icon: CalendarDays },
  { href: '/queue', label: 'Antrian', icon: ListOrdered },
  { href: '/patients', label: 'Pasien', icon: Users },
  { href: '/billing', label: 'Billing', icon: Receipt },
  { href: '/cashiers', label: 'Kasir POS', icon: UserCog },
  { href: '/inventory', label: 'Inventori', icon: Package },
  { href: '/pos', label: 'Kasir / POS', icon: ShoppingCart },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const [user, setUserState] = useState<AdminUser | null>(null);

  useEffect(() => { setUserState(getUser()); }, []);

  function handleLogout() {
    clearToken();
    localStorage.removeItem('admin_refresh');
    router.push('/login');
  }

  const isSuper = user?.role === 'SUPER_ADMIN';
  const nav = isSuper ? SUPER_NAV : CLINIC_NAV;

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-lg">aftech</span>
          <span className="text-white font-bold text-lg">Klinik</span>
        </div>
        {/* Role badge */}
        <div className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md ${isSuper ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
          {isSuper ? <ShieldCheck size={12} /> : <Building2 size={12} />}
          {isSuper ? 'Super Admin' : 'Admin Klinik'}
        </div>
        {/* Clinic name for scoped admin */}
        {!isSuper && user?.branch && (
          <div className="mt-2 text-xs text-slate-400 leading-tight">
            <div className="text-white font-medium truncate">{user.branch.name}</div>
            <div className="text-slate-500">{user.branch.city}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors group ${active ? 'bg-emerald-600/20 text-emerald-400 border-r-2 border-emerald-500' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Icon size={17} className={active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'} />
              {label}
              {active && <ChevronRight size={13} className="ml-auto text-emerald-500" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-800">
        {user && (
          <div className="flex items-center gap-2.5 px-2 pb-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user.name || user.email).slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm text-white font-medium truncate">{user.name || 'Admin'}</div>
              <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 w-full rounded-lg transition-colors">
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </aside>
  );
}
