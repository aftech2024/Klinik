"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { PORTAL_URL } from "@/lib/constants";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/";

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) { setError("Password minimal 8 karakter."); return; }
    if (form.password !== form.confirm) { setError("Konfirmasi password tidak cocok."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(Array.isArray(data.message) ? data.message[0] : (data.message ?? "Pendaftaran gagal"));
      localStorage.setItem("portal_token", data.accessToken);
      if (data.refreshToken) localStorage.setItem("portal_refresh", data.refreshToken);
      const userStr = JSON.stringify(data.user);
      localStorage.setItem("portal_user", userStr);

      if (redirect !== "/" && !redirect.startsWith("http")) {
        router.push(redirect);
      } else {
        const targetUrl = `${PORTAL_URL}/token?t=${encodeURIComponent(data.accessToken)}${data.refreshToken ? `&r=${encodeURIComponent(data.refreshToken)}` : ''}&u=${encodeURIComponent(userStr)}&redirect=%2Fdashboard`;
        window.location.href = targetUrl;
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#0D9488] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserPlus size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h1>
          <p className="text-gray-500 mt-2">Daftarkan diri sebagai pasien aftech Klinik</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={set("name")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                placeholder="Nama lengkap Anda"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={set("email")}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                placeholder="email@contoh.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={set("password")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent"
                  placeholder="Min. 8 karakter"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password</label>
              <input
                type={showPw ? "text" : "password"}
                required
                autoComplete="new-password"
                value={form.confirm}
                onChange={set("confirm")}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-transparent ${
                  form.confirm && form.confirm !== form.password ? "border-red-300 bg-red-50" : "border-gray-200"
                }`}
                placeholder="Ulangi password"
              />
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {loading ? "Mendaftarkan..." : "Daftar Sekarang"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun?{" "}
            <Link
              href={`/login${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
              className="text-[#0D9488] font-medium hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
