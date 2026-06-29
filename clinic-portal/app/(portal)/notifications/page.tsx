'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatDatetime } from '@/lib/utils';
import { Bell, CheckCheck } from 'lucide-react';

type Notification = { id: string; title: string; message: string; isRead: boolean; createdAt: string; type: string };

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);

  function load() {
    api.get('/api/notifications').then(r => setNotifs(r.data.data ?? r.data ?? [])).catch(() => {});
  }

  useEffect(() => { load(); }, []);

  async function markAll() {
    await api.post('/api/notifications/mark-all-read').catch(() => {});
    load();
  }

  async function markOne(id: string) {
    await api.patch(`/api/notifications/${id}/read`).catch(() => {});
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  const unread = notifs.filter(n => !n.isRead).length;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
          {unread > 0 && <p className="text-sm text-gray-500 mt-0.5">{unread} belum dibaca</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:underline">
            <CheckCheck size={15} /> Tandai semua
          </button>
        )}
      </div>

      {notifs.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <Bell size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Tidak ada notifikasi.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => (
            <button key={n.id} onClick={() => markOne(n.id)} className={`w-full text-left p-4 rounded-2xl border transition-colors ${n.isRead ? 'bg-white border-gray-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? 'bg-gray-300' : 'bg-emerald-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDatetime(n.createdAt)}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
