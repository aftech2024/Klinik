'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Calendar, ListOrdered, FileText, Users, ArrowRight, Clock, Activity } from 'lucide-react';

type DoctorProfile = {
  id: string; name: string; specialty: string; slug: string;
  photoUrl?: string; bio?: string; experience?: number;
  branches: { branch: { id: string; name: string; city: string } }[];
};

type Appointment = {
  id: string; appointmentNo: string; appointmentDate: string; appointmentTime: string; status: string;
  patient: { id: string; name: string; medicalNumber: string };
  branch: { name: string };
};

type QueueItem = {
  id: string; queueNumber: number; status: string;
  appointment: { patient: { name: string } };
};

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [stats, setStats] = useState({ todayCount: 0, completedCount: 0, pendingCount: 0 });

  useEffect(() => {
    api.get('/api/doctors/me').then(r => {
      setDoctor(r.data);
      const branchId = r.data.branches?.[0]?.branch?.id;
      if (branchId) {
        api.get(`/api/appointments?branchId=${branchId}&date=${new Date().toISOString().slice(0, 10)}`).then(res => {
          const list = Array.isArray(res.data) ? res.data : [];
          setAppointments(list);
          setStats({
            todayCount: list.length,
            completedCount: list.filter((a: Appointment) => a.status === 'COMPLETED').length,
            pendingCount: list.filter((a: Appointment) => a.status === 'PENDING' || a.status === 'CONFIRMED').length,
          });
        }).catch(() => {});
        api.get(`/api/queue/${branchId}`).then(res => {
          setQueue(Array.isArray(res.data) ? res.data.filter((q: QueueItem) => q.status === 'WAITING').slice(0, 5) : []);
        }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Activity size={20} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Halo, {doctor?.name ?? 'Dokter'}</h1>
            <p className="text-gray-500 text-sm">{doctor?.specialty ?? ''}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Appointment Hari Ini', value: stats.todayCount, color: 'bg-emerald-500' },
          { label: 'Selesai', value: stats.completedCount, color: 'bg-blue-500' },
          { label: 'Menunggu', value: stats.pendingCount, color: 'bg-amber-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center mb-3`}>
              <Clock size={18} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Appointment Hari Ini</h2>
            <Link href="/doctor/appointments" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
              Semua <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {appointments.length > 0 ? appointments.slice(0, 5).map(a => (
              <Link key={a.id} href={`/doctor/appointments/${a.id}`} className="block bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{a.patient?.name ?? '-'}</p>
                    <p className="text-xs text-gray-500">{a.appointmentTime} · {a.branch?.name}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    a.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                    a.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                    a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{a.status}</span>
                </div>
              </Link>
            )) : (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center text-gray-400 text-sm">
                Tidak ada appointment hari ini.
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Antrian Menunggu</h2>
            <Link href="/doctor/queue" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
              Kelola <ArrowRight size={13} />
            </Link>
          </div>
          <div className="space-y-3">
            {queue.length > 0 ? queue.map(q => (
              <div key={q.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-amber-700 text-sm">#{q.queueNumber}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{q.appointment?.patient?.name ?? '-'}</p>
                  <p className="text-xs text-gray-500">Menunggu dipanggil</p>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center text-gray-400 text-sm">
                Antrian kosong.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/doctor/appointments', label: 'Appointment', icon: Calendar },
          { href: '/doctor/queue', label: 'Antrian', icon: ListOrdered },
          { href: '/doctor/medical-records', label: 'Rekam Medis', icon: FileText },
          { href: '/doctor/patients', label: 'Pasien', icon: Users },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center gap-3 text-center group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Icon size={22} className="text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
