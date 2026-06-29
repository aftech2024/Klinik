'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Stethoscope, MapPin, Calendar, Award, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type DoctorProfile = {
  id: string; name: string; specialty: string; slug: string;
  licenseNumber?: string; photoUrl?: string; bio?: string; experience?: number;
  createdAt: string;
  branches: { branch: { id: string; name: string; city: string } }[];
  schedules: {
    id: string; dayOfWeek: string; startTime: string; endTime: string;
    branch: { id: string; name: string };
  }[];
};

const DAY_MAP: Record<string, string> = {
  MONDAY: 'Senin', TUESDAY: 'Selasa', WEDNESDAY: 'Rabu',
  THURSDAY: 'Kamis', FRIDAY: 'Jumat', SATURDAY: 'Sabtu', SUNDAY: 'Minggu',
};

export default function DoctorProfile() {
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    api.get('/api/doctors/me').then(r => setDoctor(r.data)).catch(() => {});
  }, []);

  if (!doctor) return <div className="p-6 text-center text-gray-400">Memuat...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Dokter</h1>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Stethoscope size={28} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
            <p className="text-emerald-600 font-medium text-sm">{doctor.specialty}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Informasi Umum</h3>
            <div className="space-y-3 text-sm">
              {doctor.licenseNumber && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Award size={16} className="text-gray-400" />
                  <span>SIP: {doctor.licenseNumber}</span>
                </div>
              )}
              {doctor.experience && (
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{doctor.experience} tahun pengalaman</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={16} className="text-gray-400" />
                <span>Bergabung sejak {formatDate(doctor.createdAt)}</span>
              </div>
            </div>
          </div>

          {doctor.bio && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Bio</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{doctor.bio}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" /> Praktek di
            </h3>
            <div className="space-y-2">
              {doctor.branches.map(({ branch }) => (
                <div key={branch.id} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span>{branch.name} ({branch.city})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={16} className="text-emerald-500" /> Jadwal Praktek
          </h3>
          <div className="space-y-3">
            {doctor.schedules.length > 0 ? doctor.schedules.map(s => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{DAY_MAP[s.dayOfWeek] ?? s.dayOfWeek}</p>
                  <p className="text-xs text-gray-500">{s.branch.name}</p>
                </div>
                <span className="text-sm text-emerald-600 font-medium">{s.startTime} - {s.endTime}</span>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada jadwal.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
