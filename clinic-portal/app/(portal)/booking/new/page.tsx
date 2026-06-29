'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { CheckCircle, Stethoscope, MapPin, Calendar } from 'lucide-react';

type BranchRef = { branch: { id: string; name: string; city: string } };
type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  branches: BranchRef[];
};
type Branch = { id: string; name: string; city: string };

const STEPS = ['Dokter & Cabang', 'Jadwal', 'Konfirmasi'];
const TIMES = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

function initials(name: string) {
  return name.replace(/^dr[g]?\.\s*/i, '').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function PortalBookingPage() {
  const [step, setStep] = useState(0);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [form, setForm] = useState({ doctorId: '', branchId: '', date: '', time: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/doctors?limit=100')
      .then(r => setDoctors(Array.isArray(r.data) ? r.data : (r.data.data ?? [])))
      .catch(() => {});
  }, []);

  const selectedDoctor = doctors.find(d => d.id === form.doctorId);
  const filteredBranches: Branch[] = selectedDoctor
    ? selectedDoctor.branches.map(b => b.branch)
    : [];
  const selectedBranch = filteredBranches.find(b => b.id === form.branchId);

  function selectDoctor(id: string) {
    setForm(f => ({ ...f, doctorId: id, branchId: '' }));
  }

  function canNext() {
    if (step === 0) return !!form.doctorId && !!form.branchId;
    if (step === 1) return !!form.date && !!form.time;
    return true;
  }

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/api/appointments', {
        doctorId: form.doctorId,
        branchId: form.branchId,
        appointmentDate: form.date,
        appointmentTime: form.time,
        notes: form.notes || undefined,
      });
      setDone(true);
    } catch {
      setError('Gagal membuat booking. Coba lagi.');
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  if (done) {
    return (
      <div className="p-6 max-w-md mx-auto text-center mt-12">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil!</h2>
        <p className="text-gray-500 text-sm mb-2">
          Appointment dengan <strong>{selectedDoctor?.name}</strong> di <strong>{selectedBranch?.name}</strong> telah didaftarkan.
        </p>
        <p className="text-gray-400 text-xs mb-6">{form.date} · {form.time}</p>
        <button
          onClick={() => { setStep(0); setDone(false); setForm({ doctorId: '', branchId: '', date: '', time: '', notes: '' }); }}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
        >
          Booking Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Booking Appointment</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i <= step ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
              {i < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className={`ml-2 text-xs hidden sm:block ${i <= step ? 'text-emerald-600 font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        {/* Step 0: Doctor + Branch */}
        {step === 0 && (
          <div className="p-6 space-y-6">
            {/* Doctor pick */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Stethoscope size={12} /> Pilih Dokter
              </p>
              {doctors.length === 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {doctors.map(d => (
                    <button
                      key={d.id}
                      onClick={() => selectDoctor(d.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${form.doctorId === d.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200 hover:bg-gray-50'}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${form.doctorId === d.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {initials(d.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{d.name}</p>
                        <p className="text-xs text-emerald-600">{d.specialty}</p>
                      </div>
                      {form.doctorId === d.id && <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Branch pick — only show after doctor selected */}
            {form.doctorId && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <MapPin size={12} /> Pilih Cabang
                  <span className="text-gray-300 font-normal normal-case tracking-normal">(lokasi dokter ini)</span>
                </p>
                {filteredBranches.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">Dokter ini belum memiliki cabang terdaftar.</p>
                ) : (
                  <div className="space-y-2">
                    {filteredBranches.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setForm(f => ({ ...f, branchId: b.id }))}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${form.branchId === b.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-200'}`}
                      >
                        <MapPin size={15} className={form.branchId === b.id ? 'text-emerald-500' : 'text-gray-400'} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                          <p className="text-xs text-gray-500">{b.city}</p>
                        </div>
                        {form.branchId === b.id && <CheckCircle size={15} className="text-emerald-500 ml-auto" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 1: Date + Time */}
        {step === 1 && (
          <div className="p-6 space-y-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={12} /> Jadwal Kunjungan
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tanggal</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                min={today}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Waktu</label>
              <div className="grid grid-cols-4 gap-2">
                {TIMES.map(t => (
                  <button
                    key={t}
                    onClick={() => setForm(f => ({ ...f, time: t }))}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.time === t ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-700 hover:border-emerald-300'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Keluhan <span className="text-gray-400 font-normal">(opsional)</span></label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="Jelaskan keluhan Anda..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Confirm */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Ringkasan Booking</h3>
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
            )}
            <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
              {[
                ['Dokter', selectedDoctor?.name ?? '—'],
                ['Spesialitas', selectedDoctor?.specialty ?? '—'],
                ['Cabang', selectedBranch ? `${selectedBranch.name} (${selectedBranch.city})` : '—'],
                ['Tanggal', form.date || '—'],
                ['Waktu', form.time || '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-gray-500 flex-shrink-0">{label}</span>
                  <span className="font-medium text-gray-900 text-right">{value}</span>
                </div>
              ))}
              {form.notes && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-500 text-xs mb-1">Keluhan</p>
                  <p className="text-gray-700">{form.notes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between px-6 py-4 border-t border-gray-100">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
              Kembali
            </button>
          ) : <div />}
          {step < STEPS.length - 1 ? (
            <button
              disabled={!canNext()}
              onClick={() => setStep(s => s + 1)}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Lanjut
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
