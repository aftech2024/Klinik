'use client';
import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { ListOrdered, Phone, User, Clock } from 'lucide-react';

type QueueItem = {
  id: string; queueNumber: number; status: string; calledAt?: string;
  appointment: {
    id: string;
    patient: { id: string; name: string };
    appointmentTime: string;
  };
};

export default function DoctorQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [active, setActive] = useState<QueueItem | null>(null);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<string | null>(null);

  const fetchQueue = useCallback(async (bid: string) => {
    const res = await api.get(`/api/queue/${bid}`).catch(() => null);
    if (res?.data) {
      const list = Array.isArray(res.data) ? res.data : [];
      setQueue(list);
      const inProg = list.find((q: QueueItem) => q.status === 'IN_PROGRESS');
      setActive(inProg ?? null);
    }
  }, []);

  useEffect(() => {
    api.get('/api/doctors/me').then(r => {
      const doc = r.data;
      setDoctorId(doc.id);
      const bid = doc.branches?.[0]?.branch?.id;
      if (bid) {
        setBranchId(bid);
        fetchQueue(bid);
      }
    }).catch(() => {});
  }, [fetchQueue]);

  const callNext = async () => {
    if (!branchId) return;
    await api.post(`/api/queue/${branchId}/call-next`).catch(() => {});
    fetchQueue(branchId);
  };

  const updateStatus = async (queueId: string, status: string) => {
    await api.patch(`/api/queue/${queueId}/status`, { status }).catch(() => {});
    if (branchId) fetchQueue(branchId);
  };

  const waiting = queue.filter(q => q.status === 'WAITING');
  const called = queue.filter(q => q.status === 'CALLED');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Antrian Pasien</h1>
      <p className="text-gray-500 text-sm mb-6">Kelola antrian pasien hari ini</p>

      {active && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">Sedang Ditangani</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{active.appointment?.patient?.name}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1"><Clock size={14} /> Antrian #{active.queueNumber}</span>
                <span>{active.appointment?.appointmentTime}</span>
              </div>
            </div>
            <button onClick={() => updateStatus(active.id, 'COMPLETED')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition-colors">
              Selesai
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Menunggu ({waiting.length})</h2>
            <button onClick={callNext}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors flex items-center gap-2">
              <Phone size={14} /> Panggil
            </button>
          </div>
          <div className="space-y-2">
            {waiting.length > 0 ? waiting.map(q => (
              <div key={q.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-gray-700 text-sm">#{q.queueNumber}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{q.appointment?.patient?.name}</p>
                    <p className="text-xs text-gray-500">{q.appointment?.appointmentTime}</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-400 text-sm">
                Tidak ada antrian.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Dipanggil ({called.length})</h2>
          <div className="space-y-2">
            {called.length > 0 ? called.map(q => (
              <div key={q.id} className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-blue-700 text-sm">#{q.queueNumber}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{q.appointment?.patient?.name}</p>
                    <p className="text-xs text-gray-500">Dipanggil</p>
                  </div>
                </div>
                <button onClick={() => updateStatus(q.id, 'IN_PROGRESS')}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors">
                  Proses
                </button>
              </div>
            )) : (
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-400 text-sm">
                Belum ada yang dipanggil.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
