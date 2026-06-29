'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
  Calendar, Clock, MapPin, Stethoscope, Plus, RefreshCw,
  CheckCircle, XCircle, AlertCircle, Hash
} from 'lucide-react';

type Appointment = {
  id: string;
  appointmentNo: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string | null;
  doctor: { name: string; specialty: string; photoUrl: string | null };
  branch: { name: string };
  service: { name: string } | null;
};

type QueueEntry = {
  id: string;
  queueNumber: number;
  status: string;
  appointment: { id: string };
};

const APPT_STATUS: Record<string, { label: string; icon: React.ReactNode; chip: string }> = {
  PENDING:   { label: 'Menunggu', icon: <Clock size={13} />, chip: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'Dikonfirmasi', icon: <CheckCircle size={13} />, chip: 'bg-blue-100 text-blue-700' },
  COMPLETED: { label: 'Selesai', icon: <CheckCircle size={13} />, chip: 'bg-emerald-100 text-emerald-700' },
  CANCELLED: { label: 'Dibatalkan', icon: <XCircle size={13} />, chip: 'bg-red-100 text-red-700' },
};

const QUEUE_STATUS: Record<string, { label: string; color: string }> = {
  WAITING:     { label: 'Menunggu', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  CALLED:      { label: 'Dipanggil!', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  IN_PROGRESS: { label: 'Sedang dilayani', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  COMPLETED:   { label: 'Selesai', color: 'text-slate-500 bg-slate-50 border-slate-200' },
  SKIPPED:     { label: 'Terlewat', color: 'text-red-500 bg-red-50 border-red-200' },
};

function initials(name: string) {
  return name.replace(/^dr[g]?\.\s*/i, '').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

const today = new Date();
today.setHours(0, 0, 0, 0);

function isToday(iso: string) {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === today.getTime();
}

function isFuture(iso: string) {
  return new Date(iso) >= today;
}

type Tab = 'upcoming' | 'past';

export default function BookingListPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queueMap, setQueueMap] = useState<Record<string, QueueEntry>>({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('upcoming');

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/appointments/my'),
      api.get('/api/queue/my').catch(() => ({ data: [] })),
    ]).then(([aRes, qRes]) => {
      setAppointments(Array.isArray(aRes.data) ? aRes.data : []);
      const qm: Record<string, QueueEntry> = {};
      for (const q of (qRes.data ?? [])) {
        if (q.appointment?.id) qm[q.appointment.id] = q;
      }
      setQueueMap(qm);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const upcoming = appointments.filter(a => isFuture(a.appointmentDate) && a.status !== 'CANCELLED');
  const past = appointments.filter(a => !isFuture(a.appointmentDate) || a.status === 'CANCELLED');
  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Saya</h1>
          <p className="text-sm text-gray-400 mt-0.5">Riwayat dan jadwal appointment</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <RefreshCw size={15} />
          </button>
          <Link
            href="/booking/new"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus size={15} />
            Booking Baru
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {(['upcoming', 'past'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t === 'upcoming' ? `Mendatang (${upcoming.length})` : `Riwayat (${past.length})`}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : shown.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">
            {tab === 'upcoming' ? 'Belum ada appointment mendatang.' : 'Belum ada riwayat appointment.'}
          </p>
          {tab === 'upcoming' && (
            <Link href="/booking/new" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
              <Plus size={14} /> Buat Booking Sekarang
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map(a => {
            const st = APPT_STATUS[a.status] ?? { label: a.status, icon: <AlertCircle size={13} />, chip: 'bg-gray-100 text-gray-600' };
            const queue = queueMap[a.id];
            const todayAppt = isToday(a.appointmentDate);
            const qs = queue ? (QUEUE_STATUS[queue.status] ?? QUEUE_STATUS.WAITING) : null;

            return (
              <div key={a.id} className={`bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md ${todayAppt && queue ? 'border-emerald-200' : 'border-gray-100'}`}>
                {/* Today badge */}
                {todayAppt && (
                  <div className="bg-emerald-600 px-4 py-1.5 flex items-center gap-2">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider">● Hari Ini</span>
                    {queue && (
                      <span className={`ml-auto text-xs font-semibold px-2.5 py-0.5 rounded-full border ${qs?.color}`}>
                        {qs?.label}
                      </span>
                    )}
                  </div>
                )}

                <div className="p-5">
                  <div className="flex gap-4">
                    {/* Doctor avatar */}
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 text-sm font-bold flex-shrink-0">
                      {initials(a.doctor?.name ?? '?')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{a.doctor?.name ?? '—'}</p>
                          <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                            <Stethoscope size={11} /> {a.doctor?.specialty}
                          </p>
                        </div>
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${st.chip}`}>
                          {st.icon} {st.label}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          {formatDate(a.appointmentDate)}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-gray-400" />
                          {a.appointmentTime} WIB
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <MapPin size={12} className="text-gray-400" />
                          {a.branch?.name ?? '—'}
                        </div>
                        {a.service && (
                          <div className="flex items-center gap-1.5 col-span-2">
                            <Stethoscope size={12} className="text-gray-400" />
                            {a.service.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Queue number — prominent if today */}
                  {queue && (
                    <div className={`mt-4 rounded-xl border p-4 flex items-center gap-4 ${qs?.color ?? 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      <div className="flex-shrink-0">
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-0.5 flex items-center gap-1">
                          <Hash size={10} /> Nomor Antrian
                        </div>
                        <div className="text-4xl font-black leading-none">{queue.queueNumber}</div>
                      </div>
                      <div className="border-l border-current opacity-20 self-stretch" />
                      <div className="flex-1 text-xs opacity-80">
                        <p className="font-semibold text-sm">{qs?.label}</p>
                        {queue.status === 'CALLED' && <p className="mt-0.5">Segera menuju poli!</p>}
                        {queue.status === 'WAITING' && <p className="mt-0.5">Harap menunggu di ruang tunggu.</p>}
                        {queue.status === 'IN_PROGRESS' && <p className="mt-0.5">Anda sedang dalam pemeriksaan.</p>}
                      </div>
                    </div>
                  )}

                  {/* Appointment number + notes footer */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-mono">{a.appointmentNo}</span>
                    {a.notes && (
                      <span className="text-xs text-gray-400 truncate max-w-[200px]" title={a.notes}>
                        📝 {a.notes}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
