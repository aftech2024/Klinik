'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { FileText, Send, AlertCircle, Plus, Trash2, Pill, Search } from 'lucide-react';

type Medicine = {
  id: string; code: string; name: string; genericName?: string; unit: string; price: number;
  productStocks?: { quantity: number }[];
};

type Prescription = {
  medicineId: string; name: string; dosage: string; quantity: number; notes?: string;
};

function NewMedicalRecordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const patientName = searchParams.get('patientName') ?? '';

  const [form, setForm] = useState({
    subjective: '', objective: '', assessment: '', plan: '', diagnosis: '', notes: '',
  });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medSearch, setMedSearch] = useState('');
  const [showMedPicker, setShowMedPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/api/pharmacy/medicines').then(r => setMedicines(Array.isArray(r.data) ? r.data : [])).catch(() => {});
  }, []);

  const filteredMeds = medicines.filter(m =>
    m.name.toLowerCase().includes(medSearch.toLowerCase()) ||
    m.genericName?.toLowerCase().includes(medSearch.toLowerCase())
  );

  const addPrescription = (med: Medicine) => {
    setPrescriptions(prev => [...prev, { medicineId: med.id, name: med.name, dosage: '', quantity: 1, notes: '' }]);
    setShowMedPicker(false);
    setMedSearch('');
  };

  const updatePrescription = (index: number, field: keyof Prescription, value: string | number) => {
    setPrescriptions(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const removePrescription = (index: number) => {
    setPrescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentId) { setError('Appointment tidak valid.'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/api/medical-records', {
        appointmentId,
        subjective: form.subjective || null,
        objective: form.objective || null,
        assessment: form.assessment || null,
        plan: form.plan || null,
        diagnosis: form.diagnosis ? form.diagnosis.split(',').map((d: string) => d.trim()).filter(Boolean) : [],
        prescriptions: prescriptions.length > 0 ? prescriptions : undefined,
        notes: form.notes || null,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan rekam medis');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center py-20">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rekam Medis Tersimpan!</h2>
        <p className="text-gray-500 mb-6">Data rekam medis {patientName} dan resep obat berhasil disimpan.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => router.push('/doctor/appointments')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-5 rounded-xl transition-colors text-sm">Kembali ke Appointment</button>
          <button onClick={() => router.push('/doctor/medical-records')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors text-sm">Lihat Semua Rekam Medis</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 mb-4">&larr; Kembali</button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <FileText size={20} className="text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rekam Medis Baru</h1>
          <p className="text-gray-500 text-sm">Pasien: {patientName}</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-5">
          <h2 className="font-semibold text-gray-900">Subjective (S)</h2>
          <textarea rows={3} value={form.subjective} onChange={e => setForm(f => ({ ...f, subjective: e.target.value }))}
            placeholder="Keluhan utama, riwayat penyakit, dsb."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />

          <h2 className="font-semibold text-gray-900">Objective (O)</h2>
          <textarea rows={3} value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))}
            placeholder="Tanda vital, hasil pemeriksaan fisik, dsb."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />

          <h2 className="font-semibold text-gray-900">Assessment (A)</h2>
          <textarea rows={3} value={form.assessment} onChange={e => setForm(f => ({ ...f, assessment: e.target.value }))}
            placeholder="Diagnosis kerja, analisis, dsb."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />

          <h2 className="font-semibold text-gray-900">Plan (P)</h2>
          <textarea rows={3} value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
            placeholder="Rencana terapi, follow-up, dsb."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />

          <div>
            <h2 className="font-semibold text-gray-900 mb-2">Diagnosis</h2>
            <input type="text" value={form.diagnosis} onChange={e => setForm(f => ({ ...f, diagnosis: e.target.value }))}
              placeholder="Pisahkan dengan koma (contoh: Hipertensi, Diabetes)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>

        {/* Prescriptions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Pill size={18} className="text-blue-500" /> Resep Obat
            </h2>
            <button type="button" onClick={() => setShowMedPicker(true)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center gap-1.5">
              <Plus size={15} /> Tambah Obat
            </button>
          </div>

          {showMedPicker && (
            <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="relative mb-3">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={medSearch} onChange={e => setMedSearch(e.target.value)} autoFocus
                  placeholder="Cari obat..." className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredMeds.map(m => (
                  <button key={m.id} type="button" onClick={() => addPrescription(m)}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.genericName ? `${m.genericName} · ` : ''}{m.unit}</p>
                    </div>
                    {m.productStocks && m.productStocks[0] && (
                      <span className="text-xs text-gray-400">Stok: {m.productStocks[0].quantity}</span>
                    )}
                  </button>
                ))}
                {filteredMeds.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-3">Obat tidak ditemukan</p>
                )}
              </div>
            </div>
          )}

          {prescriptions.length > 0 ? (
            <div className="space-y-3">
              {prescriptions.map((rx, i) => (
                <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-gray-900 text-sm">{rx.name}</p>
                    <button type="button" onClick={() => removePrescription(i)}
                      className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dosis</label>
                      <input type="text" value={rx.dosage} onChange={e => updatePrescription(i, 'dosage', e.target.value)}
                        placeholder="Contoh: 3x1/hari" className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Jumlah</label>
                      <input type="number" min={1} value={rx.quantity} onChange={e => updatePrescription(i, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Catatan</label>
                      <input type="text" value={rx.notes ?? ''} onChange={e => updatePrescription(i, 'notes', e.target.value)}
                        placeholder="Optional" className="w-full bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">Belum ada resep obat. Klik "Tambah Obat" untuk meresepkan.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-2">Catatan Tambahan</h2>
          <textarea rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="Catatan lain-lain..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
          ) : (
            <><Send size={16} /> Simpan Rekam Medis & Resep Obat</>
          )}
        </button>
      </form>
    </div>
  );
}

export default function NewMedicalRecord() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-400">Memuat...</div>}>
      <NewMedicalRecordForm />
    </Suspense>
  );
}
