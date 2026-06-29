'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Calendar, ListOrdered, FileText, Receipt, ArrowRight, Bell } from 'lucide-react';

type Appointment = { id: string; doctor: { name: string; specialty: string }; branch: { name: string }; appointmentDate: string; appointmentTime: string; status: string };
type Notification = { id: string; title: string; message: string; isRead: boolean; createdAt: string };

export default function PortalDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    api.get('/api/auth/me').then(r => setName(r.data.name ?? 'Pasien')).catch(() => {});
    api.get('/api/appointments/my').then(r => setAppointments(Array.isArray(r.data) ? r.data.slice(0, 3) : [])).catch(() => {});
    api.get('/api/notifications?limit=3').then(r => setNotifications(r.data.data ?? [])).catch(() => {});
  }, []);

  const QUICK_LINKS = [
    { href: '/booking/new', label: 'Booking Baru', icon: Calendar, color: 'bg-emerald-500' },
    { href: '/queue', label: 'Antrian Saya', icon: ListOrdered, color: 'bg-blue-500' },
    { href: '/medical-records', label: 'Rekam Medis', icon: FileText, color: 'bg-purple-500' },
    { href: '/billing', label: 'Tagihan', icon: Receipt, color: 'bg-amber-500' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Halo, {name}! 👋</h1>
        <p className="text-gray-500 mt-1">Selamat datang di portal pasien aftech Klinik.</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {QUICK_LINKS.map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center gap-3 text-center group">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
              <Icon size={22} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600">{label}</span>
          </Link>
        ))}
      </div>

      {/* Upcoming appointments */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Appointment Mendatang</h2>
          <Link href="/booking" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">Semua <ArrowRight size={13} /></Link>
        </div>
        <div className="space-y-3">
          {appointments.length > 0 ? appointments.map(a => (
            <div key={a.id} className="bg-white rounded-2xl p-5 border border-gray-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">{a.doctor?.name ?? '—'}</p>
                <p className="text-xs text-gray-500">{a.doctor?.specialty} · {a.appointmentDate?.slice(0, 10)} {a.appointmentTime}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' : a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {a.status}
              </span>
            </div>
          )) : (
            <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400 text-sm">Belum ada appointment.</div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notifications.filter(n => !n.isRead).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={16} className="text-gray-600" />
            <h2 className="font-semibold text-gray-900">Notifikasi</h2>
          </div>
          <div className="space-y-2">
            {notifications.filter(n => !n.isRead).map(n => (
              <div key={n.id} className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <p className="text-sm font-medium text-gray-900">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
