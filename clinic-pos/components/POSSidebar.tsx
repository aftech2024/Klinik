'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Clock, Package, ArrowLeftRight } from 'lucide-react';

type NavItem = { href: string; label: string; icon: typeof LayoutDashboard };

const NAV: NavItem[] = [
  { href: '/terminal', label: 'Kasir', icon: LayoutDashboard },
  { href: '/history', label: 'Riwayat', icon: Clock },
  { href: '/inventory', label: 'Stok Obat', icon: Package },
  { href: '/transfers', label: 'Transfer', icon: ArrowLeftRight },
];

export default function POSSidebar() {
  const path = usePathname();

  return (
    <aside className="w-[72px] bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 flex-shrink-0 shadow-sm z-10">

      {/* Brand */}
      <div className="flex justify-center pt-5 pb-4 border-b border-slate-100">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #3DB549 0%, #2EA43A 100%)',
            boxShadow: '0 4px 12px rgba(61,181,73,0.30)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3v18M3 12h18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1.5 px-2 pt-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all"
              style={active ? {
                background: 'linear-gradient(135deg, #3DB549 0%, #2EA43A 100%)',
                boxShadow: '0 4px 12px rgba(61,181,73,0.28)',
                color: '#fff',
              } : { color: '#94a3b8' }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f1f5f9'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = ''; }}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
