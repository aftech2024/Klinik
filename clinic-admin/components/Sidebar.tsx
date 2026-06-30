'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Stethoscope, MapPin, CalendarDays, ListOrdered, Receipt, BarChart3, ChevronRight, ShieldCheck, Building2, Package, ShoppingCart, UserCog } from 'lucide-react';
import { getUser, type AdminUser } from '@/lib/auth';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

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
];

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

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const path = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => { setUser(getUser()); }, []);

  const isSuper = user?.role === 'SUPER_ADMIN';
  const nav = isSuper ? SUPER_NAV : CLINIC_NAV;

  return (
    <aside className={`
      w-64 bg-slate-900 text-slate-300 flex flex-col h-screen flex-shrink-0
      fixed inset-y-0 left-0 z-50 transition-transform duration-300
      lg:relative lg:translate-x-0 lg:z-auto
      ${open ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold text-lg">aftech</span>
          <span className="text-white font-bold text-lg">Klinik</span>
          {onClose && (
            <button onClick={onClose} className="ml-auto lg:hidden w-7 h-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="1" y1="1" x2="13" y2="13" /><line x1="13" y1="1" x2="1" y2="13" />
              </svg>
            </button>
          )}
        </div>
        <div className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-md ${isSuper ? 'bg-amber-500/15 text-amber-400' : 'bg-emerald-500/15 text-emerald-400'}`}>
          {isSuper ? <ShieldCheck size={12} /> : <Building2 size={12} />}
          {isSuper ? 'Super Admin' : 'Admin Klinik'}
        </div>
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
              onClick={onClose}
              className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors group ${active ? 'bg-emerald-600/20 text-emerald-400 border-r-2 border-emerald-500' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Icon size={17} className={active ? 'text-emerald-400' : 'text-slate-500 group-hover:text-white'} />
              {label}
              {active && <ChevronRight size={13} className="ml-auto text-emerald-500" />}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
