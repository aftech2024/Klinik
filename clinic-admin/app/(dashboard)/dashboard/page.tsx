'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { getUser, type AdminUser } from '@/lib/auth';
import {
  Users, CalendarDays, DollarSign, Stethoscope,
  TrendingUp, TrendingDown, CalendarCheck, Clock,
  ShieldCheck, Building2, MapPin, ListOrdered, ArrowRight, Plus,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';

type Kpi = {
  totalPatients: number;
  totalDoctors: number;
  appointmentsToday: number;
  appointmentsMonth: number;
  revenueMonth: number;
};
type ChartPoint = { date: string; count: number; revenue: number };

function StatCard({
  label, value, sub, icon: Icon, accent, trend,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; accent: string; trend?: 'up' | 'down' | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={20} className="text-white" />
        </div>
        {trend === 'up' && <TrendingUp size={14} className="text-emerald-500" />}
        {trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="text-sm text-slate-500 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-11 h-11 bg-slate-200 rounded-xl" />
        <div className="w-4 h-4 bg-slate-200 rounded" />
      </div>
      <div className="h-7 bg-slate-200 rounded w-24 mb-2" />
      <div className="h-4 bg-slate-200 rounded w-32" />
    </div>
  );
}

const TODAY = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export default function DashboardPage() {
  const [kpi, setKpi] = useState<Kpi | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => { setUser(getUser()); }, []);

  useEffect(() => {
    Promise.all([
      api.get('/api/reports/dashboard').then(r => setKpi(r.data)).catch(() => {}),
      api.get('/api/reports/appointment-stats').then(r => setChartData(r.data.data ?? [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const isSuper = user?.role === 'SUPER_ADMIN';

  const cards = kpi ? [
    {
      label: 'Total Pasien', value: kpi.totalPatients.toLocaleString('id-ID'),
      sub: 'Pasien terdaftar', icon: Users, accent: 'bg-blue-500', trend: 'up' as const,
    },
    {
      label: 'Total Dokter', value: kpi.totalDoctors.toLocaleString('id-ID'),
      sub: 'Dokter aktif', icon: Stethoscope, accent: 'bg-violet-500', trend: null,
    },
    {
      label: 'Appointment Hari Ini', value: kpi.appointmentsToday.toLocaleString('id-ID'),
      sub: `${kpi.appointmentsMonth} bulan ini`, icon: CalendarCheck, accent: 'bg-emerald-500', trend: 'up' as const,
    },
    {
      label: 'Pendapatan Bulan Ini', value: formatRupiah(kpi.revenueMonth),
      sub: 'Revenue bulanan', icon: DollarSign, accent: 'bg-amber-500', trend: 'up' as const,
    },
  ] : [];

  return (
    <div>
      <Header title="Dashboard" />
      <div className="p-6 lg:p-8 space-y-8">

        {/* Welcome bar — role-aware */}
        <div className={`rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isSuper ? 'bg-gradient-to-r from-amber-900 via-slate-900 to-slate-800' : 'bg-gradient-to-r from-emerald-800 via-slate-900 to-slate-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${isSuper ? 'bg-amber-500/20' : 'bg-emerald-500/20'}`}>
              {isSuper ? <ShieldCheck size={22} className="text-amber-400" /> : <Building2 size={22} className="text-emerald-400" />}
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">
                {user?.name ? `Halo, ${user.name} 👋` : 'Selamat datang kembali 👋'}
              </h2>
              <p className="text-slate-300 text-sm mt-0.5">
                {isSuper
                  ? 'Super Admin · kontrol global semua klinik'
                  : user?.branch
                    ? `Admin Klinik · ${user.branch.name}, ${user.branch.city}`
                    : 'Admin Klinik'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
            <Clock size={14} className="text-slate-300" />
            <span className="text-slate-200 text-sm whitespace-nowrap">{TODAY}</span>
          </div>
        </div>

        {/* Role-specific quick actions */}
        {isSuper ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/clinic-admins" className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-amber-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center"><ShieldCheck size={20} className="text-amber-600" /></div>
              <div className="flex-1"><div className="font-semibold text-slate-900 text-sm">Kelola Admin Klinik</div><div className="text-xs text-slate-400">Tambah admin tiap klinik</div></div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-amber-500" />
            </Link>
            <Link href="/branches" className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-emerald-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center"><MapPin size={20} className="text-emerald-600" /></div>
              <div className="flex-1"><div className="font-semibold text-slate-900 text-sm">Kelola Klinik</div><div className="text-xs text-slate-400">Cabang & lokasi</div></div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500" />
            </Link>
            <Link href="/doctors" className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-violet-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center"><Stethoscope size={20} className="text-violet-600" /></div>
              <div className="flex-1"><div className="font-semibold text-slate-900 text-sm">Semua Dokter</div><div className="text-xs text-slate-400">Lintas klinik</div></div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-violet-500" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/doctors" className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-emerald-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center"><Plus size={20} className="text-emerald-600" /></div>
              <div className="flex-1"><div className="font-semibold text-slate-900 text-sm">Tambah Dokter</div><div className="text-xs text-slate-400">Untuk klinik Anda</div></div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500" />
            </Link>
            <Link href="/queue" className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center"><ListOrdered size={20} className="text-blue-600" /></div>
              <div className="flex-1"><div className="font-semibold text-slate-900 text-sm">Antrian Hari Ini</div><div className="text-xs text-slate-400">Kelola antrian klinik</div></div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500" />
            </Link>
            <Link href="/appointments" className="group bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:border-violet-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center"><CalendarDays size={20} className="text-violet-600" /></div>
              <div className="flex-1"><div className="font-semibold text-slate-900 text-sm">Appointment</div><div className="text-xs text-slate-400">Jadwal klinik Anda</div></div>
              <ArrowRight size={16} className="text-slate-300 group-hover:text-violet-500" />
            </Link>
          </div>
        )}

        {/* KPI cards */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Ringkasan</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : cards.map(c => <StatCard key={c.label} {...c} />)}
          </div>
        </div>

        {/* Quick stats row */}
        {kpi && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Appointment Bulan Ini', value: kpi.appointmentsMonth, icon: CalendarDays, color: 'text-emerald-600' },
              { label: 'Rata-rata per Hari', value: Math.round(kpi.appointmentsMonth / 30), icon: TrendingUp, color: 'text-blue-600' },
              { label: 'Pasien per Dokter', value: kpi.totalDoctors ? Math.round(kpi.totalPatients / kpi.totalDoctors) : 0, icon: Users, color: 'text-violet-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
                <s.icon size={18} className={s.color} />
                <div>
                  <div className="text-xl font-bold text-slate-900">{s.value.toLocaleString('id-ID')}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Charts */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Grafik 30 Hari Terakhir</h3>
          {chartData.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Jumlah Appointment</h4>
                    <p className="text-xs text-slate-400 mt-0.5">30 hari terakhir</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }} />
                    <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Pendapatan</h4>
                    <p className="text-xs text-slate-400 mt-0.5">30 hari terakhir</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      formatter={(v: unknown) => formatRupiah(Number(v))}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <TrendingUp size={20} className="text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm font-medium">Belum ada data grafik</p>
              <p className="text-slate-400 text-xs mt-1">Data akan muncul setelah ada appointment</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
