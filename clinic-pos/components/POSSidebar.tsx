'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingCart, Clock, Package, ArrowLeftRight,
  LogOut, Building2, ShieldCheck, User, ChevronDown, ChevronRight
} from 'lucide-react';
import { getUser, getActiveBranchId, clearAuth, clearActiveBranch, type PosUser } from '@/lib/auth';

type NavItem = { href: string; label: string; icon: typeof ShoppingCart };

const NAV: NavItem[] = [
  { href: '/terminal', label: 'Kasir', icon: ShoppingCart },
  { href: '/history', label: 'Riwayat', icon: Clock },
  { href: '/inventory', label: 'Stok Obat', icon: Package },
  { href: '/transfers', label: 'Transfer', icon: ArrowLeftRight },
];

const ROLE_META: Record<string, { label: string; color: string; icon: typeof ShieldCheck }> = {
  SUPER_ADMIN: { label: 'Super Admin', color: 'text-amber-400', icon: ShieldCheck },
  ADMIN: { label: 'Admin', color: 'text-emerald-400', icon: Building2 },
  CASHIER: { label: 'Kasir', color: 'text-sky-400', icon: User },
};

export default function POSSidebar() {
  const path = usePathname();
  const router = useRouter();
  const [user, setUserState] = useState<PosUser | null>(null);

  useEffect(() => { setUserState(getUser()); }, []);

  function logout() { clearAuth(); router.push('/login'); }
  function switchBranch() { clearActiveBranch(); router.push('/branch-select'); }

  const roleMeta = user ? (ROLE_META[user.role] ?? ROLE_META.CASHIER) : ROLE_META.CASHIER;
  const RoleIcon = roleMeta.icon;
  const branchName = user?.branch?.name ?? null;
  const branchCity = user?.branch?.city ?? null;

  return (
    <aside className="w-[72px] hover:w-52 bg-[#080d1a] border-r border-slate-800/60 flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300 group/sidebar overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-slate-800/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-600/20">
            <ShoppingCart size={18} className="text-white" />
          </div>
          <div className="overflow-hidden">
            <div className="text-white font-bold text-sm whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              aftech <span className="text-emerald-400">POS</span>
            </div>
            <div className="text-slate-500 text-[10px] whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              Sistem Kasir
            </div>
          </div>
        </div>
      </div>

      {/* Branch info (expanded only) */}
      <div className="px-3 py-3 border-b border-slate-800/60 flex-shrink-0 overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-800/60 flex items-center justify-center flex-shrink-0">
            <Building2 size={16} className="text-slate-400" />
          </div>
          <div className="flex-1 min-w-0 overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
            {branchName ? (
              <>
                <div className="text-xs font-semibold text-white truncate">{branchName}</div>
                {branchCity && <div className="text-[10px] text-slate-500">{branchCity}</div>}
                {user?.role === 'SUPER_ADMIN' && (
                  <button onClick={switchBranch} className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 mt-0.5">
                    Ganti <ChevronDown size={10} />
                  </button>
                )}
              </>
            ) : (
              <div className="text-xs text-slate-500">Tidak ada klinik</div>
            )}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 mx-2 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 ${
                active
                  ? 'bg-emerald-600/20 text-emerald-400'
                  : 'text-slate-500 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Icon size={18} className={`flex-shrink-0 ${active ? 'text-emerald-400' : ''}`} />
              <span className="whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 flex-1">
                {label}
              </span>
              {active && (
                <ChevronRight size={12} className="flex-shrink-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200 text-emerald-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-slate-800/60 p-3 flex-shrink-0">
        {user && (
          <div className="flex items-center gap-2.5 mb-2 px-0.5">
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user.name || user.email).slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              <div className="text-xs font-semibold text-white truncate">{user.name || 'User'}</div>
              <div className={`flex items-center gap-1 text-[10px] font-medium ${roleMeta.color}`}>
                <RoleIcon size={9} /> {roleMeta.label}
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-slate-500 hover:bg-red-950/40 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <span className="text-xs font-medium whitespace-nowrap overflow-hidden opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}
