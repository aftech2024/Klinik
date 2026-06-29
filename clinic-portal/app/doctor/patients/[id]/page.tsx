'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { User, Calendar, MapPin, FileText, Activity, Phone, Mail } from 'lucide-react';

type Patient = {
  id: string; name: string; medicalNumber: string; gender?: string;
  dateOfBirth?: string; phone?: string; address?: string; city?: string;
  bloodType?: string; allergies?: string[];
};

type MedicalRecord = {
  id: string; assessment?: string; diagnosis?: string[]; createdAt: string;
  doctor: { name: string };
  appointment: { appointmentDate: string };
};

type Appointment = {
  id: string; appointmentDate: string; appointmentTime: string; status: string;
  doctor: { name: string; specialty: string };
  branch: { name: string };
};

export default function PatientDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/patients/${id}`).then(r => setPatient(r.data)).catch(() => router.push('/doctor/patients'));
    api.get(`/api/medical-records/patient/${id}`).then(r => setRecords(Array.isArray(r.data) ? r.data : r.data.data ?? [])).catch(() => {});
    api.get(`/api/appointments`).then(r => {
      const list = Array.isArray(r.data) ? r.data : r.data.data ?? [];
      setAppointments(list.slice(0, 5));
    }).catch(() => {});
  }, [id]);

  if (!patient) return <div className="p-6 text-center text-gray-400">Memuat...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-4">&larr; Kembali</button>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User size={28} className="text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-sm text-gray-500">RM: {patient.medicalNumber}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5 text-sm">
          {patient.gender && (
            <div>
              <p className="text-gray-400 text-xs">Jenis Kelamin</p>
              <p className="text-gray-900 font-medium">{patient.gender === 'MALE' ? 'Laki-laki' : 'Perempuan'}</p>
            </div>
          )}
          {patient.dateOfBirth && (
            <div>
              <p className="text-gray-400 text-xs">Tanggal Lahir</p>
              <p className="text-gray-900 font-medium">{patient.dateOfBirth?.slice(0, 10)}</p>
            </div>
          )}
          {patient.bloodType && (
            <div>
              <p className="text-gray-400 text-xs">Gol. Darah</p>
              <p className="text-gray-900 font-medium">{patient.bloodType}</p>
            </div>
          )}
          {patient.city && (
            <div>
              <p className="text-gray-400 text-xs">Kota</p>
              <p className="text-gray-900 font-medium">{patient.city}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={16} className="text-purple-500" /> Rekam Medis
          </h2>
          <div className="space-y-3">
            {records.length > 0 ? records.map(r => (
              <div key={r.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-sm font-medium text-gray-900">{r.assessment ?? 'Tidak ada assessment'}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span>{r.appointment?.appointmentDate?.slice(0, 10)}</span>
                  <span>·</span>
                  <span>{r.doctor?.name}</span>
                </div>
                {r.diagnosis && r.diagnosis.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {r.diagnosis.map((d, i) => (
                      <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{d}</span>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-400 text-sm">
                Belum ada rekam medis.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-emerald-500" /> Appointment Terakhir
          </h2>
          <div className="space-y-3">
            {appointments.length > 0 ? appointments.map(a => (
              <div key={a.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{a.doctor?.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    a.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                    a.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'
                  }`}>{a.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{a.appointmentDate?.slice(0, 10)} {a.appointmentTime} · {a.branch?.name}</p>
              </div>
            )) : (
              <div className="bg-white rounded-xl p-6 border border-gray-100 text-center text-gray-400 text-sm">
                Belum ada appointment.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
