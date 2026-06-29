"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, User, MapPin, Stethoscope, CheckCircle, LogIn, AlertCircle, LayoutDashboard, UserCircle, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { PORTAL_URL } from "@/lib/constants";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type Service = { id: string; name: string; slug?: string; description?: string };
type BranchRef = { branch: { id: string; name: string; city: string } };
type Doctor = { id: string; name: string; slug?: string; specialty: string; experience: number; branches: BranchRef[] };
type Branch = { id: string; name: string; city: string };
type UserInfo = { name: string; email: string };

const STEPS = ["Pilih Layanan", "Dokter & Cabang", "Waktu Kunjungan", "Konfirmasi"];
const TIMES = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "18:00", "19:00"];

function getUser(): UserInfo | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("portal_token");
  const raw = localStorage.getItem("portal_user");
  if (!token || !raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function BookingForm() {
  const searchParams = useSearchParams();
  const paramService = searchParams.get("service");
  const paramDoctor = searchParams.get("doctor");
  const paramBranch = searchParams.get("branch");

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ serviceId: "", serviceName: "", doctorId: "", doctorName: "", branchId: "", branchName: "", date: "", time: "", notes: "" });
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [loggedUser, setLoggedUser] = useState<UserInfo | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookError, setBookError] = useState("");

  useEffect(() => { setLoggedUser(getUser()); }, []);

  useEffect(() => {
    fetch(`${API}/api/services`).then(r => r.json()).then(d => setServices(Array.isArray(d) ? d : (d.data ?? []))).catch(() => {});
    fetch(`${API}/api/doctors?limit=100`).then(r => r.json()).then(d => setDoctors(Array.isArray(d) ? d : (d.data ?? []))).catch(() => {});
  }, []);

  // Handle URL parameters for auto-selection
  useEffect(() => {
    if (paramService && services.length > 0) {
      const s = services.find(x => x.slug === paramService || x.id === paramService);
      if (s) {
        setForm(prev => ({ ...prev, serviceId: s.id, serviceName: s.name }));
      }
    }
  }, [paramService, services]);

  useEffect(() => {
    if (paramDoctor && doctors.length > 0) {
      const doc = doctors.find(x => x.slug === paramDoctor || x.id === paramDoctor);
      if (doc) {
        setForm(prev => ({ ...prev, doctorId: doc.id, doctorName: doc.name, serviceId: prev.serviceId || "general", serviceName: prev.serviceName || "Konsultasi Dokter Spesialis" }));
        if (doc.branches.length === 1) {
          const br = doc.branches[0].branch;
          setForm(prev => ({ ...prev, branchId: br.id, branchName: `${br.name} (${br.city})` }));
        }
        setStep(1);
      }
    }
  }, [paramDoctor, doctors]);

  useEffect(() => {
    if (!form.doctorId) {
      // If no doctor selected yet, show all branches or filter by paramBranch
      if (paramBranch && doctors.length > 0) {
        const allBr = new Map<string, Branch>();
        doctors.forEach(d => d.branches.forEach(b => allBr.set(b.branch.id, b.branch)));
        const brList = Array.from(allBr.values());
        setFilteredBranches(brList);
        const br = brList.find(b => b.id === paramBranch);
        if (br) setForm(prev => ({ ...prev, branchId: br.id, branchName: `${br.name} (${br.city})` }));
      } else {
        setFilteredBranches([]);
      }
      return;
    }
    const doc = doctors.find(d => d.id === form.doctorId);
    if (doc) {
      const brs = doc.branches.map(b => b.branch);
      setFilteredBranches(brs);
      if (paramBranch) {
        const br = brs.find(b => b.id === paramBranch);
        if (br) setForm(prev => ({ ...prev, branchId: br.id, branchName: `${br.name} (${br.city})` }));
      }
    }
  }, [form.doctorId, doctors, paramBranch]);

  function setField(key: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function selectDoctor(doctorId: string) {
    const doc = doctors.find(d => d.id === doctorId);
    setForm(prev => ({ ...prev, doctorId, doctorName: doc?.name ?? "", branchId: "", branchName: "" }));
  }

  function selectBranch(branchId: string) {
    const br = filteredBranches.find(b => b.id === branchId);
    setForm(prev => ({ ...prev, branchId, branchName: br ? `${br.name} (${br.city})` : "" }));
  }

  function canNext() {
    if (step === 0) return !!form.serviceId;
    if (step === 1) return !!form.doctorId && !!form.branchId;
    if (step === 2) return !!form.date && !!form.time;
    return true;
  }

  async function postAppointment(token: string) {
    return fetch(`${API}/api/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        doctorId: form.doctorId,
        branchId: form.branchId,
        serviceId: form.serviceId === "general" ? undefined : (form.serviceId || undefined),
        appointmentDate: form.date,
        appointmentTime: form.time,
        notes: form.notes || undefined,
      }),
    });
  }

  async function handleConfirm() {
    if (!loggedUser) { setAuthRequired(true); return; }
    setSubmitting(true);
    setBookError("");
    try {
      let token = localStorage.getItem("portal_token") ?? "";
      let res = await postAppointment(token);

      if (res.status === 401) {
        const refresh = localStorage.getItem("portal_refresh");
        if (refresh) {
          const rr = await fetch(`${API}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refresh }),
          });
          if (rr.ok) {
            const rd = await rr.json();
            token = rd.accessToken;
            localStorage.setItem("portal_token", token);
            if (rd.refreshToken) localStorage.setItem("portal_refresh", rd.refreshToken);
            res = await postAppointment(token);
          }
        }
      }

      if (res.status === 401) { setAuthRequired(true); return; }
      if (!res.ok) throw new Error("gagal");
      setSubmitted(true);
    } catch {
      setBookError("Gagal membuat booking. Silakan coba beberapa saat lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().split("T")[0];

  function portalSSOUrl() {
    const t = localStorage.getItem('portal_token');
    const r = localStorage.getItem('portal_refresh');
    const u = localStorage.getItem('portal_user');
    if (!t) return PORTAL_URL;
    return `${PORTAL_URL}/token?t=${encodeURIComponent(t)}${r ? `&r=${encodeURIComponent(r)}` : ''}${u ? `&u=${encodeURIComponent(u)}` : ''}&redirect=%2Fdashboard`;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full overflow-hidden text-center p-10 relative">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#14B8A6] via-[#0D9488] to-[#134E4A]" />
          
          <div className="w-20 h-20 bg-[#F0FDFA] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={44} className="text-[#0D9488]" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-[#134E4A] mb-2">Booking Berhasil!</h2>
          {loggedUser && (
            <p className="text-sm text-[#0D9488] font-bold mb-4">Terdaftar untuk {loggedUser.name}</p>
          )}
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Jadwal kunjungan Anda telah dikonfirmasi. Cek portal pasien untuk memantau nomor antrian secara real-time dan melihat rekam medis.
          </p>

          <div className="bg-[#F0FDFA] rounded-2xl p-6 text-left text-sm space-y-3 mb-8 border border-[#CCFBF1]">
            {[
              ["Layanan Medis", form.serviceName],
              ["Dokter Pemeriksa", form.doctorName],
              ["Lokasi Cabang", form.branchName],
              ["Jadwal Kunjungan", `${form.date} · ${form.time} WIB`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-teal-100/50 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-500 font-medium flex-shrink-0">{label}</span>
                <span className="font-bold text-[#134E4A] text-right">{value}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <a
              href={portalSSOUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-2xl text-base font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <LayoutDashboard size={18} /> Buka Portal Pasien
            </a>
            <Link
              href="/"
              className="block w-full py-3 text-sm font-semibold text-gray-500 hover:text-[#134E4A] transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (authRequired) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-2xl text-center max-w-md w-full relative">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LogIn size={32} className="text-amber-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#134E4A] mb-3">Login Diperlukan</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Untuk mengamankan antrian dan menghubungkan riwayat pemeriksaan dengan <strong>rekam medis elektronik</strong> Anda, silakan masuk ke akun Anda.
          </p>
          
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 mb-8 text-left">
            <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-800 text-xs leading-relaxed">
              Seluruh data diagnosa, resep obat, dan hasil lab klinik fisik akan terhubung otomatis ke aplikasi pasien Anda.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/login?redirect=/booking"
              className="block w-full py-4 bg-[#0D9488] hover:bg-[#0F766E] text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Masuk ke Akun Saya
            </Link>
            <Link
              href="/register?redirect=/booking"
              className="block w-full py-3.5 border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-2xl text-sm font-bold transition-all"
            >
              Daftar Pasien Baru
            </Link>
            <button
              onClick={() => setAuthRequired(false)}
              className="text-xs text-gray-400 hover:text-gray-600 mt-3 font-medium underline underline-offset-4 block mx-auto"
            >
              Kembali pilih jadwal
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="bg-gradient-to-b from-[#F0FDFA] to-white py-14 px-4 border-b border-[#E6FFFA] mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-tag mb-3 inline-block">Reservasi Online</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#134E4A] mb-2">Buat Janji Temu Dokter</h1>
          <p className="text-gray-500 text-sm sm:text-base">Proses cepat tanpa antri panjang di loket pendaftaran klinik fisik.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-12 px-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                    i <= step
                      ? "bg-[#0D9488] text-white shadow-teal-500/20 scale-110"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < step ? <CheckCircle size={18} /> : i + 1}
                </div>
                <span className={`absolute -bottom-6 text-xs font-semibold whitespace-nowrap hidden sm:block ${
                  i <= step ? "text-[#134E4A]" : "text-gray-400"
                }`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 sm:mx-4 rounded-full transition-colors ${i < step ? "bg-[#0D9488]" : "bg-gray-100"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-2xl mt-8">
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#134E4A]">Pilih Layanan Medis</h2>
                  <p className="text-xs text-gray-400">Silakan pilih spesialisasi atau konsultasi umum</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5 max-h-[420px] overflow-y-auto pr-1">
                {/* General Consultation Option */}
                <button
                  onClick={() => setForm(prev => ({ ...prev, serviceId: "general", serviceName: "Konsultasi Dokter Spesialis / Umum" }))}
                  className={`text-left px-5 py-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                    form.serviceId === "general"
                      ? "border-[#0D9488] bg-[#F0FDFA] shadow-md shadow-teal-500/5"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <div className={`font-bold text-base transition-colors ${form.serviceId === "general" ? "text-[#0D9488]" : "text-[#134E4A]"}`}>
                      🌟 Konsultasi Dokter Spesialis / Langsung Pilih Dokter
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Pilih ini jika Anda ingin langsung menentukan dokter tanpa paket khusus</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                    form.serviceId === "general" ? "border-[#0D9488] bg-[#0D9488] text-white" : "border-gray-200"
                  }`}>
                    {form.serviceId === "general" && <CheckCircle size={14} />}
                  </div>
                </button>

                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setForm(prev => ({ ...prev, serviceId: s.id, serviceName: s.name }))}
                    className={`text-left px-5 py-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      form.serviceId === s.id
                        ? "border-[#0D9488] bg-[#F0FDFA] shadow-md shadow-teal-500/5"
                        : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <div className={`font-bold text-base transition-colors ${form.serviceId === s.id ? "text-[#0D9488]" : "text-[#134E4A]"}`}>
                        {s.name}
                      </div>
                      {s.description && <div className="text-xs text-gray-500 mt-1 line-clamp-1">{s.description}</div>}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${
                      form.serviceId === s.id ? "border-[#0D9488] bg-[#0D9488] text-white" : "border-gray-200"
                    }`}>
                      {form.serviceId === s.id && <CheckCircle size={14} />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#134E4A]">Pilih Dokter & Lokasi Cabang</h2>
                  <p className="text-xs text-gray-400">Pilih dokter spesialis yang menangani keluhan Anda</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#134E4A] mb-2">Dokter Pemeriksa</label>
                <select
                  value={form.doctorId}
                  onChange={e => selectDoctor(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
                >
                  <option value="">-- Pilih Dokter Spesialis --</option>
                  {doctors.map(d => (
                    <option key={d.id} value={d.id}>{d.name} · {d.specialty}</option>
                  ))}
                </select>
              </div>

              {form.doctorId && (
                <div className="pt-2">
                  <label className="block text-sm font-bold text-[#134E4A] mb-2">
                    Pilih Cabang Klinik
                    <span className="ml-2 text-gray-400 font-normal text-xs">(Lokasi praktek dokter terpilih)</span>
                  </label>
                  {filteredBranches.length === 0 ? (
                    <p className="text-sm text-gray-400 italic bg-gray-50 p-4 rounded-2xl text-center">Dokter ini belum memiliki jadwal cabang terdaftar.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredBranches.map(b => (
                        <button
                          key={b.id}
                          onClick={() => selectBranch(b.id)}
                          className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                            form.branchId === b.id
                              ? "border-[#0D9488] bg-[#F0FDFA] shadow-md shadow-teal-500/5"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <MapPin size={20} className={form.branchId === b.id ? "text-[#0D9488]" : "text-gray-400"} />
                            <div>
                              <div className="font-bold text-sm text-[#134E4A]">{b.name}</div>
                              <div className="text-xs text-gray-500">{b.city}</div>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            form.branchId === b.id ? "border-[#0D9488] bg-[#0D9488] text-white" : "border-gray-200"
                          }`}>
                            {form.branchId === b.id && <CheckCircle size={14} />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#134E4A]">Tentukan Waktu Kunjungan</h2>
                  <p className="text-xs text-gray-400">Pilih tanggal dan estimasi jam konsultasi</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#134E4A] mb-2">Tanggal Pemeriksaan</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setField("date", e.target.value)}
                  min={today}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#134E4A] mb-2">Pilih Jam Sesi</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                  {TIMES.map(t => (
                    <button
                      key={t}
                      onClick={() => setField("time", t)}
                      className={`py-3 rounded-2xl text-sm font-bold border transition-all ${
                        form.time === t
                          ? "bg-[#0D9488] text-white border-[#0D9488] shadow-md shadow-teal-500/20 scale-105"
                          : "border-gray-200 text-gray-700 hover:border-[#0D9488] bg-white"
                      }`}
                    >
                      {t} WIB
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-[#134E4A] mb-2">
                  Catatan / Keluhan Awal
                  <span className="text-gray-400 font-normal text-xs ml-2">(Opsional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={e => setField("notes", e.target.value)}
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:bg-white resize-none transition-all"
                  placeholder="Misal: Demam sejak 3 hari lalu, butuh surat sakit..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center text-[#0D9488]">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#134E4A]">Konfirmasi Reservasi</h2>
                  <p className="text-xs text-gray-400">Pastikan data pilihan janji temu sudah sesuai</p>
                </div>
              </div>

              {loggedUser ? (
                <div className="flex items-center gap-3.5 bg-[#F0FDFA] border border-[#CCFBF1] rounded-2xl p-4">
                  <div className="w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center flex-shrink-0">
                    <UserCircle size={22} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0D9488]">Terverifikasi Masuk Sebagai</p>
                    <p className="text-sm font-extrabold text-[#134E4A]">{loggedUser.name}</p>
                  </div>
                  <a
                    href={PORTAL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1.5 text-xs font-bold text-[#0D9488] hover:underline"
                  >
                    <LayoutDashboard size={14} /> Portal
                  </a>
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200/80 rounded-2xl p-4">
                  <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 text-xs leading-relaxed font-medium">
                    Anda belum masuk akun. Klik konfirmasi untuk login terlebih dahulu agar antrian tercatat di portal rekam medis.
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-6 space-y-3.5 text-sm border border-gray-100">
                {[
                  { label: "Layanan Medis", value: form.serviceName },
                  { label: "Dokter Spesialis", value: form.doctorName },
                  { label: "Lokasi Cabang", value: form.branchName },
                  { label: "Tanggal Janji", value: form.date },
                  { label: "Waktu Kunjungan", value: `${form.time} WIB` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-gray-200/60 pb-2.5 last:border-0 last:pb-0">
                    <span className="text-gray-500 font-medium">{label}</span>
                    <span className="font-bold text-[#134E4A] text-right max-w-[60%]">{value || "-"}</span>
                  </div>
                ))}
                {form.notes && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-gray-400 text-xs mb-1 font-semibold uppercase">Catatan Tambahan</p>
                    <p className="text-gray-700 text-sm font-medium bg-white p-3 rounded-xl border border-gray-100">{form.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {bookError && step === STEPS.length - 1 && (
            <div className="mt-6 px-4 py-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl font-medium flex items-center gap-2">
              <AlertCircle size={16} /> {bookError}
            </div>
          )}

          <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100 gap-4">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-sm font-bold transition-all flex items-center gap-2"
              >
                <ArrowLeft size={16} /> Kembali
              </button>
            ) : <div />}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext()}
                className="px-8 py-3.5 bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ml-auto"
              >
                Lanjut <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="px-8 py-3.5 bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-50 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ml-auto"
              >
                {loggedUser ? <CheckCircle size={18} /> : <LogIn size={18} />}
                {submitting ? "Memproses Reservasi..." : loggedUser ? "Konfirmasi Janji Temu" : "Lanjut & Login Akun"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Memuat Form Booking...</div>}>
      <BookingForm />
    </Suspense>
  );
}
