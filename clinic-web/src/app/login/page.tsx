"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Stethoscope, Eye, EyeOff } from "lucide-react";
import { PORTAL_URL } from "@/lib/constants";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type RoleTab = "PATIENT" | "DOCTOR";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/";

  const [roleTab, setRoleTab] = useState<RoleTab>("PATIENT");
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Login gagal");
      localStorage.setItem("portal_token", data.accessToken);
      if (data.refreshToken) localStorage.setItem("portal_refresh", data.refreshToken);
      const userStr = JSON.stringify(data.user);
      localStorage.setItem("portal_user", userStr);

      const portalRedirect = roleTab === "DOCTOR" ? "%2Fdoctor%2Fdashboard" : "%2Fdashboard";

      if (redirect !== "/" && !redirect.startsWith("http")) {
        router.push(redirect);
      } else {
        const targetUrl = `${PORTAL_URL}/token?t=${encodeURIComponent(data.accessToken)}${data.refreshToken ? `&r=${encodeURIComponent(data.refreshToken)}` : ''}&u=${encodeURIComponent(userStr)}&redirect=${portalRedirect}`;
        window.location.href = targetUrl;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors ${roleTab === "PATIENT" ? "bg-[#0D9488]" : "bg-blue-600"}`}>
            {roleTab === "PATIENT" ? <Heart size={26} className="text-white" /> : <Stethoscope size={26} className="text-white" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun Anda</h1>
          <p className="text-gray-500 mt-2">Pilih peran Anda di bawah</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button type="button" onClick={() => setRoleTab("PATIENT")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${roleTab === "PATIENT" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <Heart size={16} /> Pasien
            </button>
            <button type="button" onClick={() => setRoleTab("DOCTOR")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${roleTab === "DOCTOR" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              <Stethoscope size={16} /> Dokter
            </button>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                placeholder="email@contoh.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 ${roleTab === "PATIENT" ? "bg-[#0D9488] hover:bg-[#0F766E]" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Memproses..." : `Masuk sebagai ${roleTab === "PATIENT" ? "Pasien" : "Dokter"}`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Belum punya akun?{" "}
            <Link
              href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="text-[#0D9488] font-medium hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
