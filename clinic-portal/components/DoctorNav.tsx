'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Calendar, ListOrdered, FileText, Users, User, LogOut, Stethoscope } from 'lucide-react';

const NAV = [
  { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctor/appointments', label: 'Appointment', icon: Calendar },
  { href: '/doctor/queue', label: 'Antrian', icon: ListOrdered },
  { href: '/doctor/medical-records', label: 'Rekam Medis', icon: FileText },
  { href: '/doctor/patients', label: 'Pasien', icon: Users },
  { href: '/doctor/profile', label: 'Profil', icon: User },
];

export default function DoctorNav() {
  const path = usePathname();
  const router = useRouter();

  function logout() {
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_refresh');
    localStorage.removeItem('portal_user');
    router.push('/login');
  }

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 h-screen sticky top-0 flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Stethoscope size={20} className="text-emerald-600" />
            <span className="text-emerald-600 font-bold text-lg">aftech</span>
            <span className="font-bold text-lg"> Klinik</span>
          </div>
          <div className="text-gray-400 text-xs mt-0.5">Portal Dokter</div>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path === href;
            return (
              <Link key={href} href={href} className={`flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors ${active ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                <Icon size={17} className={active ? 'text-emerald-600' : 'text-gray-400'} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 px-3 py-2 w-full rounded-lg hover:bg-red-50 transition-colors">
            <LogOut size={15} /> Keluar
          </button>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex items-center justify-around py-2 px-4">
        {NAV.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${active ? 'text-emerald-600' : 'text-gray-400'}`}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
