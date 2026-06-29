'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { RefreshCw, Clock, MapPin, Stethoscope, Calendar, Megaphone } from 'lucide-react';

type QueueEntry = {
  id: string;
  queueNumber: number;
  status: string;
  appointment: {
    id: string;
    appointmentNo: string;
    appointmentDate: string;
    appointmentTime: string;
    doctor: { name: string; specialty: string } | null;
    branch: { name: string } | null;
  };
};

const STATUS_MAP: Record<string, { label: string; color: string; ring: string; hint: string }> = {
  WAITING:     { label: 'Menunggu', color: 'text-amber-600 bg-amber-50', ring: 'ring-amber-200', hint: 'Harap menunggu di ruang tunggu.' },
  CALLED:      { label: 'Dipanggil!', color: 'text-blue-600 bg-blue-50', ring: 'ring-blue-300', hint: 'Segera menuju ruang periksa.' },
  IN_PROGRESS: { label: 'Sedang Dilayani', color: 'text-emerald-600 bg-emerald-50', ring: 'ring-emerald-300', hint: 'Anda sedang dalam pemeriksaan.' },
  COMPLETED:   { label: 'Selesai', color: 'text-slate-500 bg-slate-50', ring: 'ring-slate-200', hint: 'Pemeriksaan telah selesai.' },
  SKIPPED:     { label: 'Terlewat', color: 'text-red-500 bg-red-50', ring: 'ring-red-200', hint: 'Antrian terlewat. Hubungi resepsionis.' },
};

const today = new Date();
today.setHours(0, 0, 0, 0);

function isActiveToday(q: QueueEntry) {
  const d = new Date(q.appointment.appointmentDate);
  d.setHours(0, 0, 0, 0);
  return d.getTime() === today.getTime() && ['WAITING', 'CALLED', 'IN_PROGRESS'].includes(q.status);
}

export default function QueuePage() {
  const [queues, setQueues] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/api/queue/my').then(r => setQueues(Array.isArray(r.data) ? r.data : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // auto-refresh active queue every 30s
  useEffect(() => {
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, [load]);

  const active = queues.filter(isActiveToday);
  const upcoming = queues.filter(q => !isActiveToday(q) && q.status !== 'COMPLETED' && q.status !== 'SKIPPED');
  const history = queues.filter(q => q.status === 'COMPLETED' || q.status === 'SKIPPED');

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Antrian Saya</h1>
          <p className="text-sm text-gray-400 mt-0.5">Nomor antrian & status real-time</p>
        </div>
        <button onClick={load} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && queues.length === 0 ? (
        <div className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
      ) : queues.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
          <Clock size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm font-medium">Belum ada antrian.</p>
          <Link href="/booking/new" className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
            Buat Booking
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ACTIVE — hero card */}
          {active.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Megaphone size={12} /> Antrian Aktif Hari Ini
              </p>
              {active.map(q => {
                const st = STATUS_MAP[q.status];
                return (
                  <div key={q.id} className={`bg-white rounded-2xl border-2 border-emerald-200 ring-4 ${st.ring} ring-opacity-30 overflow-hidden mb-3`}>
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-6 text-center">
                      <p className="text-emerald-50 text-xs font-semibold uppercase tracking-widest mb-1">Nomor Antrian Anda</p>
                      <p className="text-white text-7xl font-black leading-none">{q.queueNumber}</p>
                      <span className={`inline-block mt-3 text-sm px-4 py-1.5 rounded-full font-semibold bg-white ${st.color.split(' ')[0]}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-gray-500 text-center mb-4">{st.hint}</p>
                      <div className="space-y-2 text-sm">
                        <Row icon={<Stethoscope size={13} />} label="Dokter" value={q.appointment.doctor?.name ?? '—'} />
                        <Row icon={<MapPin size={13} />} label="Cabang" value={q.appointment.branch?.name ?? '—'} />
                        <Row icon={<Clock size={13} />} label="Jadwal" value={`${q.appointment.appointmentTime} WIB`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* UPCOMING */}
          {upcoming.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Antrian Mendatang</p>
              <div className="space-y-3">
                {upcoming.map(q => <QueueCard key={q.id} q={q} />)}
              </div>
            </div>
          )}

          {/* HISTORY */}
          {history.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Riwayat</p>
              <div className="space-y-3">
                {history.map(q => <QueueCard key={q.id} q={q} muted />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400 flex items-center gap-1.5">{icon} {label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function QueueCard({ q, muted }: { q: QueueEntry; muted?: boolean }) {
  const st = STATUS_MAP[q.status] ?? { label: q.status, color: 'text-gray-600 bg-gray-50' };
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 ${muted ? 'opacity-70' : ''}`}>
      <div className="text-center flex-shrink-0 w-14">
        <div className="text-[10px] text-gray-400 uppercase font-medium">No.</div>
        <div className={`text-3xl font-black leading-none ${muted ? 'text-gray-400' : 'text-emerald-600'}`}>{q.queueNumber}</div>
      </div>
      <div className="border-l border-gray-100 self-stretch" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{q.appointment.doctor?.name ?? '—'}</p>
        <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1"><Calendar size={11} />{q.appointment.appointmentDate?.slice(0, 10)}</span>
          <span className="flex items-center gap-1"><Clock size={11} />{q.appointment.appointmentTime}</span>
        </p>
      </div>
      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${st.color}`}>{st.label}</span>
    </div>
  );
}
