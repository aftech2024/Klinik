'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Calendar, Search } from 'lucide-react';

type Appointment = {
  id: string; appointmentNo: string; appointmentDate: string; appointmentTime: string; status: string;
  patient: { id: string; name: string; medicalNumber: string };
  branch: { name: string };
  queue?: { queueNumber: number };
};

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('TODAY');

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter === 'TODAY') params.set('date', new Date().toISOString().slice(0, 10));
    api.get(`/api/appointments?${params}`).then(r => {
      const list = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      setAppointments(list);
    }).catch(() => {});
  }, [filter]);

  const statusClass = (s: string) => {
    const map: Record<string, string> = {
      PENDING: 'bg-gray-100 text-gray-600',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      CHECKED_IN: 'bg-indigo-100 text-indigo-700',
      IN_PROGRESS: 'bg-amber-100 text-amber-700',
      COMPLETED: 'bg-emerald-100 text-emerald-700',
      CANCELLED: 'bg-red-100 text-red-600',
      NO_SHOW: 'bg-red-100 text-red-600',
    };
    return map[s] ?? 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment</h1>
          <p className="text-gray-500 text-sm mt-1">Daftar appointment pasien</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['TODAY', 'ALL'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${filter === f ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >{f === 'TODAY' ? 'Hari Ini' : 'Semua'}</button>
        ))}
      </div>

      <div className="space-y-3">
        {appointments.length > 0 ? appointments.map(a => (
          <Link key={a.id} href={`/doctor/appointments/${a.id}`} className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{a.patient?.name ?? '-'}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusClass(a.status)}`}>{a.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span>{a.appointmentDate?.slice(0, 10)} {a.appointmentTime}</span>
                  <span>·</span>
                  <span>{a.branch?.name}</span>
                  {a.queue?.queueNumber && <><span>·</span><span className="font-medium text-amber-600">Antrian #{a.queue.queueNumber}</span></>}
                </div>
              </div>
            </div>
          </Link>
        )) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <Search size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Tidak ada appointment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
