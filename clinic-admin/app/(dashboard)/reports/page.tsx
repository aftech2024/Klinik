'use client';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import api from '@/lib/api';
import { formatRupiah } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type TopDoctor = { doctor: { user: { name: string }; specialty: string }; count: number };
type RevenueData = { period: string; revenue: number };

const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportsPage() {
  const [topDoctors, setTopDoctors] = useState<TopDoctor[]>([]);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);

  useEffect(() => {
    api.get('/api/reports/top-doctors').then(r => setTopDoctors(r.data ?? [])).catch(() => {});
    api.get('/api/reports/revenue-summary').then(r => setRevenue(r.data.data ?? [])).catch(() => {});
  }, []);

  const doctorData = topDoctors.map(d => ({ name: d.doctor.user.name, count: d.count }));

  return (
    <div>
      <Header title="Laporan" />
      <div className="p-8 space-y-6">
        {/* Revenue Chart */}
        {revenue.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-6">Pendapatan per Periode</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000000).toFixed(0)}jt`} />
                <Tooltip formatter={(v: unknown) => formatRupiah(Number(v))} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top Doctors */}
        {doctorData.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-6">Dokter Terbanyak Pasien</h3>
              <div className="space-y-4">
                {topDoctors.slice(0, 8).map((d, i) => (
                  <div key={d.doctor.user.name} className="flex items-center gap-3">
                    <div className="w-6 text-sm font-bold text-slate-400">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{d.doctor.user.name}</div>
                      <div className="text-xs text-slate-500">{d.doctor.specialty}</div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600">{d.count}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-6">Distribusi Pasien</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={doctorData.slice(0, 5)} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${(name ?? '').split(' ')[0]} ${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                    {doctorData.slice(0, 5).map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
