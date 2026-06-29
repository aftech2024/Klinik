'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { FileText, User, Calendar, Pill } from 'lucide-react';

type PrescriptionItem = {
  id: string; name: string; dosage: string; quantity: number; notes?: string; prescribedAt: string;
};

type MedicalRecord = {
  id: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  diagnosis?: string[];
  vitalSigns?: any;
  prescriptions?: PrescriptionItem[];
  notes?: string;
  createdAt: string;
  patient: { id: string; name: string; medicalNumber: string };
  doctor: { name: string; specialty: string };
  appointment: { appointmentDate: string; appointmentTime: string };
};

export default function MedicalRecordDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/medical-records/${id}`).then(r => setRecord(r.data)).catch(() => router.push('/doctor/medical-records'));
  }, [id]);

  if (!record) return <div className="p-6 text-center text-gray-400">Memuat...</div>;

  const sections = [
    { label: 'Subjective (S)', value: record.subjective, color: 'bg-blue-50 border-blue-100' },
    { label: 'Objective (O)', value: record.objective, color: 'bg-green-50 border-green-100' },
    { label: 'Assessment (A)', value: record.assessment, color: 'bg-amber-50 border-amber-100' },
    { label: 'Plan (P)', value: record.plan, color: 'bg-purple-50 border-purple-100' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-4">&larr; Kembali</button>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <FileText size={22} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Rekam Medis</h1>
            <p className="text-sm text-gray-500">{record.patient?.name} · {record.patient?.medicalNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Calendar size={13} /> {record.appointment?.appointmentDate?.slice(0, 10)}</span>
          <span>{record.appointment?.appointmentTime}</span>
          <span>·</span>
          <span>{record.doctor?.name}</span>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-5 border ${color}`}>
            <h3 className="font-semibold text-gray-900 text-sm mb-2">{label}</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{value || <span className="text-gray-400 italic">Tidak diisi</span>}</p>
          </div>
        ))}
      </div>

      {record.diagnosis && record.diagnosis.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mt-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Diagnosis</h3>
          <div className="flex flex-wrap gap-2">
            {record.diagnosis.map((d, i) => (
              <span key={i} className="text-sm bg-red-50 text-red-700 px-3 py-1 rounded-full font-medium">{d}</span>
            ))}
          </div>
        </div>
      )}

      {record.prescriptions && record.prescriptions.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mt-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
            <Pill size={16} className="text-blue-500" /> Resep Obat ({record.prescriptions.length})
          </h3>
          <div className="space-y-3">
            {record.prescriptions.map((rx, i) => (
              <div key={rx.id} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 text-sm">{i + 1}. {rx.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div><span className="text-xs text-gray-500 block">Dosis</span><span className="text-gray-800 font-medium">{rx.dosage || '-'}</span></div>
                  <div><span className="text-xs text-gray-500 block">Jumlah</span><span className="text-gray-800 font-medium">{rx.quantity}</span></div>
                  {rx.notes && <div><span className="text-xs text-gray-500 block">Catatan</span><span className="text-gray-800">{rx.notes}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {record.notes && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 mt-4">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">Catatan Tambahan</h3>
          <p className="text-sm text-gray-700">{record.notes}</p>
        </div>
      )}
    </div>
  );
}
