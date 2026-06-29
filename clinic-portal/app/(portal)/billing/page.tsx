'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatRupiah, formatDate } from '@/lib/utils';
import { Receipt } from 'lucide-react';

type Bill = { id: string; invoiceNo: string; totalAmount: number; status: string; dueDate: string | null; paidAt: string | null; appointment: { doctor: { user: { name: string } } } | null };

const STATUS_COLORS: Record<string, string> = {
  UNPAID: 'bg-red-100 text-red-700',
  PARTIAL: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
};

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    api.get('/api/billing/my').then(r => setBills(r.data.data ?? r.data ?? [])).catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tagihan Saya</h1>

      {bills.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <Receipt size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Tidak ada tagihan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bills.map(b => (
            <div key={b.id} className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-900 text-sm font-mono">{b.invoiceNo}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{b.appointment?.doctor?.user?.name ?? '—'}</div>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[b.status] ?? 'bg-gray-100 text-gray-500'}`}>{b.status}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
                <div className="text-gray-500">
                  {b.dueDate ? `Jatuh tempo: ${formatDate(b.dueDate)}` : b.paidAt ? `Dibayar: ${formatDate(b.paidAt)}` : ''}
                </div>
                <div className="font-bold text-gray-900 text-base">{formatRupiah(b.totalAmount)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
