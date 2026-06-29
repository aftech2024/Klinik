'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { FileText, ChevronDown, Pill } from 'lucide-react';

type PrescriptionItem = { id: string; name: string; dosage: string; quantity: number; notes?: string };
type Record = { id: string; visitDate: string; doctor: { user: { name: string }; specialty: string }; subjective: string | null; objective: string | null; assessment: string | null; plan: string | null; diagnosis: string | null; prescriptions?: PrescriptionItem[] };

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    api.get('/api/medical-records/my').then(r => setRecords(r.data ?? [])).catch(() => {});
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rekam Medis</h1>

      {records.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-gray-100 text-center">
          <FileText size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada rekam medis.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => setExpanded(expanded === r.id ? null : r.id)} className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 text-sm">{r.doctor?.user?.name ?? '—'}</div>
                  <div className="text-xs text-gray-500">{r.doctor?.specialty} · {formatDate(r.visitDate)}</div>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded === r.id ? 'rotate-180' : ''}`} />
              </button>
              {expanded === r.id && (
                <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-3">
                  {r.diagnosis && <div><span className="text-xs font-semibold text-gray-500 uppercase">Diagnosis</span><p className="text-sm text-gray-700 mt-1">{r.diagnosis}</p></div>}
                  {r.subjective && <div><span className="text-xs font-semibold text-gray-500 uppercase">Keluhan</span><p className="text-sm text-gray-700 mt-1">{r.subjective}</p></div>}
                  {r.assessment && <div><span className="text-xs font-semibold text-gray-500 uppercase">Assessment</span><p className="text-sm text-gray-700 mt-1">{r.assessment}</p></div>}
                  {r.plan && <div><span className="text-xs font-semibold text-gray-500 uppercase">Rencana</span><p className="text-sm text-gray-700 mt-1">{r.plan}</p></div>}
                  {r.prescriptions && r.prescriptions.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1"><Pill size={12} /> Resep Obat</span>
                      <div className="mt-2 space-y-2">
                        {r.prescriptions.map((rx, i) => (
                          <div key={rx.id} className="bg-blue-50 rounded-xl px-3 py-2.5 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{rx.name}</p>
                              <p className="text-xs text-gray-500">{rx.dosage} · {rx.quantity} buah</p>
                            </div>
                            {rx.notes && <span className="text-xs text-gray-400">{rx.notes}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
