'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getUser, setActiveBranch, isLoggedIn } from '@/lib/auth';
import { Building2, MapPin, ShoppingCart, ChevronRight } from 'lucide-react';

type Branch = { id: string; name: string; city: string; address: string; phone?: string; isActive: boolean };

export default function BranchSelectPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.replace('/login'); return; }
    const u = getUser();
    // Non-super admins don't need to pick a branch
    if (u && u.role !== 'SUPER_ADMIN') { router.replace('/terminal'); return; }

    api.get('/api/branches').then(r => {
      const data = Array.isArray(r.data) ? r.data : (r.data.data ?? []);
      setBranches(data.filter((b: Branch) => b.isActive));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [router]);

  function selectBranch(b: Branch) {
    setActiveBranch(b.id, { id: b.id, name: b.name, city: b.city });
    router.push('/terminal');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Pilih Klinik</h1>
          <p className="text-slate-400 text-sm mt-1">Operasikan POS untuk klinik mana?</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {branches.map(b => (
              <button
                key={b.id}
                onClick={() => selectBranch(b)}
                className="w-full bg-slate-900 border border-slate-800 hover:border-emerald-600 rounded-2xl p-5 text-left flex items-center gap-4 transition-all group hover:bg-slate-900/80"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-900/50 group-hover:bg-emerald-600 flex items-center justify-center transition-colors flex-shrink-0">
                  <Building2 size={20} className="text-emerald-400 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white">{b.name}</div>
                  <div className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {b.city}
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-600 group-hover:text-emerald-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
