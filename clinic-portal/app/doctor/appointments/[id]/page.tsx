'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Calendar, Clock, MapPin, User, FileText, Activity } from 'lucide-react';

type Appointment = {
  id: string; appointmentNo: string; appointmentDate: string; appointmentTime: string; status: string; notes?: string;
  patient: { id: string; name: string; medicalNumber: string; dateOfBirth?: string; gender?: string; user?: { phone?: string } };
  branch: { name: string; address: string; city: string };
  doctor: { id: string; name: string; specialty: string };
  queue?: { queueNumber: number; status: string };
  medicalRecord?: { id: string };
};

export default function AppointmentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [appt, setAppt] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/appointments/${id}`).then(r => setAppt(r.data)).catch(() => router.push('/doctor/appointments'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6 text-center text-gray-400">Memuat...</div>;
  if (!appt) return <div className="p-6 text-center text-gray-400">Appointment tidak ditemukan.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-4">&larr; Kembali</button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Detail Appointment</h2>
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                appt.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                appt.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700' :
                appt.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                'bg-gray-100 text-gray-600'
              }`}>{appt.status}</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={16} className="text-gray-400" />
                <span>{appt.appointmentDate?.slice(0, 10)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={16} className="text-gray-400" />
                <span>{appt.appointmentTime}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={16} className="text-gray-400" />
                <span>{appt.branch?.name} - {appt.branch?.city}</span>
              </div>
              {appt.queue && (
                <div className="flex items-center gap-3">
                  <Activity size={16} className="text-amber-500" />
                  <span className="font-medium text-amber-700">Antrian #{appt.queue.queueNumber} ({appt.queue.status})</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-900 mb-3">Data Pasien</h2>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <User size={16} className="text-gray-400" />
                <span className="font-medium text-gray-900">{appt.patient?.name}</span>
              </div>
              <p className="text-gray-500 ml-7">No. RM: {appt.patient?.medicalNumber}</p>
              {appt.patient?.dateOfBirth && (
                <p className="text-gray-500 ml-7">Tgl Lahir: {appt.patient.dateOfBirth?.slice(0, 10)}</p>
              )}
              {appt.patient?.gender && (
                <p className="text-gray-500 ml-7">Jenis Kelamin: {appt.patient.gender === 'MALE' ? 'Laki-laki' : appt.patient.gender === 'FEMALE' ? 'Perempuan' : appt.patient.gender}</p>
              )}
              {appt.patient?.user?.phone && (
                <p className="text-gray-500 ml-7">No. Telp: {appt.patient.user.phone}</p>
              )}
            </div>
          </div>

          {appt.notes && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-3">Catatan Pasien</h2>
              <p className="text-sm text-gray-600">{appt.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {appt.status !== 'COMPLETED' && appt.status !== 'CANCELLED' && (
            <button
              onClick={() => router.push(`/doctor/medical-records/new?appointmentId=${appt.id}&patientId=${appt.patient.id}&patientName=${appt.patient.name}`)}
              className="w-full flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors justify-center text-sm"
            >
              <FileText size={16} />
              Buat Rekam Medis
            </button>
          )}

          {(() => { const mr = appt.medicalRecord; return mr ? (
            <button
              onClick={() => router.push(`/doctor/medical-records/${mr.id}`)}
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors justify-center text-sm"
            >
              <FileText size={16} />
              Lihat Rekam Medis
            </button>
          ) : null; })()}

          <button
            onClick={() => router.push(`/doctor/patients/${appt.patient.id}`)}
            className="w-full flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-xl transition-colors justify-center text-sm"
          >
            <User size={16} />
            Profil Pasien
          </button>
        </div>
      </div>
    </div>
  );
}
