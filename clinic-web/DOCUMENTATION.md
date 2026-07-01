# clinic-web — Dokumentasi Website Publik

Website publik **aftech Klinik** (landing + informasi + entry point booking/login).
Dokumen ini untuk maintenance: struktur, fungsi tiap halaman, alur data, env, deploy, troubleshooting.

> Aplikasi lain di monorepo: `clinic-admin` (dashboard admin), `clinic-pos` (kasir), `clinic-portal` (portal pasien/dokter), `clinic-api` (backend). Lihat `DEPLOYMENT.md` & `URL-DEPENDENCIES.md` di root untuk gambaran sistem penuh.

---

## 1. Tech Stack

| Item | Versi / Nilai |
|------|---------------|
| Framework | Next.js **16.2.9** (App Router) |
| React | **19.2.4** |
| Styling | Tailwind CSS **v4** + custom CSS (`globals.css`) |
| Icons | `lucide-react` |
| Animasi | `framer-motion` |
| UI primitives | `@base-ui/react`, `shadcn` |
| Rendering | Server Components + selektif Client Components |
| Deploy | Vercel (project `clinic-web`, root dir `clinic-web`) |

> **Catatan penting**: Next.js versi ini punya breaking changes. Sebelum edit, baca guide di `node_modules/next/dist/docs/`. Lihat `AGENTS.md`.

---

## 2. Struktur Folder

```
clinic-web/
├── src/
│   ├── app/                    # Routes (App Router)
│   │   ├── layout.tsx          # Root layout: Navbar + Footer + viewport + metadata
│   │   ├── page.tsx            # Homepage (force-dynamic)
│   │   ├── globals.css         # Semua style global + responsive
│   │   └── <route>/page.tsx    # Tiap halaman
│   ├── components/
│   │   ├── layout/             # Navbar, Footer, Hero, CTA, dll
│   │   ├── sections/           # Section homepage (DoctorsSection, dll)
│   │   └── DoctorPhoto.tsx     # Foto dokter dgn fallback emoji
│   └── lib/
│       ├── api.ts              # Data layer — semua fetch ke backend
│       ├── constants.ts        # Konstanta (PORTAL_URL, stats)
│       └── utils.ts            # Helper
```

---

## 3. Halaman (Routes)

| Route | Tipe | Fungsi |
|-------|------|--------|
| `/` | Dynamic | Homepage: hero, layanan, tentang, **dokter**, cabang, testimoni, CTA |
| `/about` | Static | Profil klinik |
| `/services` | Static (ISR 1m) | Daftar layanan |
| `/services/[slug]` | Dynamic | Detail layanan |
| `/doctors` | Static (ISR 1m) | Daftar semua dokter + search + filter spesialis |
| `/doctors/[slug]` | Dynamic | Profil dokter |
| `/branches` | Static (ISR 1m) | Daftar cabang |
| `/branches/[slug]` | Dynamic | Detail cabang |
| `/articles` | Static (ISR 1m) | Daftar artikel/blog |
| `/articles/[slug]` | Dynamic | Detail artikel |
| `/promotions` | Static (ISR 1m) | Daftar promo |
| `/promotions/[slug]` | Dynamic | Detail promo |
| `/faq` | Static (ISR 1m) | FAQ |
| `/booking` | Static | Entry point booking → redirect ke portal pasien |
| `/login` | Static | Login pasien/dokter → SSO ke portal |
| `/register` | Static | Daftar pasien baru |
| `/contact` | Static | Form kontak + info |
| `/privacy`, `/terms`, `/sitemap` | Static | Halaman legal & peta situs |

**ISR (Incremental Static Regeneration)**: halaman `revalidate 1m` → di-cache, refresh tiap 60 detik.
**Homepage `/` = `force-dynamic`** → render per-request supaya foto dokter selalu ikut data admin (tanpa cache build). Lihat §7.

---

## 4. Komponen

### Layout (`components/layout/`)
| Komponen | Fungsi |
|----------|--------|
| `Navbar.tsx` | Nav utama. Desktop menu + **hamburger + mobile drawer** (client, `useState drawerOpen`). Aktif ≤768px |
| `Footer.tsx` | Footer: link, kontak, newsletter |
| `Hero.tsx`, `CTA.tsx`, `AnnouncementBar.tsx`, `FloatingNav.tsx` | Elemen tambahan |

### Sections homepage (`components/sections/`)
Dirender berurutan di `page.tsx`:
`HeroSection` → `QuickSection` → `ServicesSection` → `AboutSection` → `DoctorsSection` → `BranchesSection` → `TestimonialsSection` → `CTABannerSection`

| Section | Sumber data |
|---------|-------------|
| `DoctorsSection` | `api.doctors()` — 4 dokter pertama, pakai `DoctorPhoto` |
| `ServicesSection` | `api.services()` |
| `BranchesSection` | `api.branches()` |
| `TestimonialsSection` | statis / `api.testimonials()` |
| Lainnya | konten statis |

### `DoctorPhoto.tsx` (client)
Render foto dokter. Kalau `photoUrl` null / gambar broken (`onError`) → fallback emoji 👨‍⚕️.
Dipakai di homepage `DoctorsSection` **dan** `/doctors` (`DoctorsClient`) — konsisten dua tempat.

---

## 5. Data Layer (`lib/api.ts`)

Semua request backend lewat satu file. Base URL dari env `NEXT_PUBLIC_API_URL`.

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function get<T>(path): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { next: { revalidate: 60 } });
  ...
}
```

Method tersedia:

| Method | Endpoint | Return |
|--------|----------|--------|
| `api.branches()` / `api.branch(slug)` | `/api/branches` | Cabang |
| `api.doctors(params?)` / `api.doctor(slug)` | `/api/doctors` | Dokter |
| `api.services()` / `api.service(slug)` | `/api/services` | Layanan |
| `api.promotions()` | `/api/promotions` | Promo |
| `api.articles()` / `api.article(slug)` | `/api/articles` | Artikel |
| `api.testimonials()` | `/api/testimonials` | Testimoni |
| `api.faqs()` | `/api/faqs` | FAQ |

> Fetch punya cache `revalidate: 60`. Data max stale 60 detik setelah admin ubah.

---

## 6. Alur Data Penting

### 6a. Login SSO (web → portal)
`/login` (client):
1. POST `${API}/api/auth/login` (email, password, role PATIENT/DOCTOR)
2. Simpan token di `localStorage` (`portal_token`, `portal_refresh`, `portal_user`)
3. Redirect ke `${PORTAL_URL}/token?t=<token>&r=<refresh>&u=<user>&redirect=<tujuan>`
4. Portal baca token dari URL → set sesi → lanjut ke dashboard

`PORTAL_URL` dari `NEXT_PUBLIC_PORTAL_URL` (default `http://localhost:3003`).

### 6b. Booking
`/booking` → arahkan user ke portal pasien untuk pilih dokter/jadwal (pakai `PORTAL_URL`).

### 6c. Foto dokter (admin → web)
1. Admin upload foto di `clinic-admin /doctors` → backend simpan ke **Supabase Storage** (bucket `clinic-uploads/doctors/`) → simpan URL publik di kolom `photoUrl` dokter
2. Web fetch `api.doctors()` → `DoctorPhoto` render `photoUrl`
3. Homepage `force-dynamic` + `/doctors` ISR 60s → foto sinkron otomatis

---

## 7. Responsive / Mobile

- **Viewport** di `layout.tsx` (`export const viewport`) — WAJIB, kalau hilang mobile tampil desktop di-zoom-out.
- Breakpoint di `globals.css`:
  - `≤1024px` (tablet): services 2 kolom, doctors 2 kolom
  - `≤768px` (mobile): navbar → hamburger drawer, semua grid 1 kolom, hero stack, padding rapat
  - `≤480px` (HP kecil): services 1 kolom, footer 1 kolom, heading mengecil
- `body { overflow-x: hidden }` cegah scroll horizontal.

---

## 8. Environment Variables

| Var | Fungsi | Contoh prod |
|-----|--------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL backend API | `https://aftech26-aftech-klinik-api.hf.space` |
| `NEXT_PUBLIC_PORTAL_URL` | URL portal pasien/dokter (SSO redirect) | URL portal prod |

Set di **Vercel → clinic-web → Settings → Environment Variables**. Prefix `NEXT_PUBLIC_` = terekspos ke browser (aman, non-secret).

---

## 9. Deploy

**Vercel**, project `clinic-web`, connected ke GitHub `aftech2024/Klinik`.

Setting wajib (Vercel → clinic-web → Settings):
- **Git**: connected repo `aftech2024/Klinik`, branch `main`
- **Build and Deployment → Root Directory** = `clinic-web`

Alur normal: `git push origin main` → Vercel auto-deploy commit terbaru.

Deploy manual (kalau perlu):
```bash
cd clinic-web && vercel --prod --yes
```

> **Limit Vercel free (Hobby): 100 deploy/hari.** Kalau habis → error `api-deployments-free-per-day`, tunggu reset ~24 jam.

---

## 10. Development

```bash
cd clinic-web
npm install
npm run dev      # http://localhost:3000
npm run build    # verifikasi build production
npx tsc --noEmit # cek TypeScript
```

Butuh backend jalan (default `http://localhost:3001`) atau set `NEXT_PUBLIC_API_URL` ke API prod.

---

## 11. Troubleshooting

| Gejala | Penyebab | Fix |
|--------|----------|-----|
| Mobile tampil seperti desktop di-zoom | `viewport` export hilang di `layout.tsx` | Pastikan `export const viewport` ada |
| Foto dokter homepage beda dengan `/doctors` | Homepage ke-cache build lama | Homepage sudah `force-dynamic`. Pastikan Vercel deploy commit terbaru |
| Foto dokter jadi emoji semua | `photoUrl` broken/null, atau bucket Supabase belum public | Cek bucket `clinic-uploads` public; re-upload di admin |
| Perubahan sudah push tapi web tidak berubah | Vercel belum deploy (dulu deploy manual, tidak auto) | Pastikan Git connected + root dir `clinic-web`; cek tab Deployments |
| Deploy gagal `api-deployments-free-per-day` | Kuota 100/hari habis | Tunggu reset ~24 jam |
| Data lama muncul ~1 menit | Cache `revalidate: 60` | Normal. Tunggu ≤60 detik |
| Build gagal TS error | Type mismatch (mis. field tidak ada di `Doctor`) | `npx tsc --noEmit` cari error, perbaiki sebelum push |
| Gambar/scroll horizontal di mobile | Elemen lebih lebar dari viewport | Cek `overflow-x: hidden` di body + width elemen |

---

## 12. Konvensi Maintenance

- **Tambah halaman**: buat `src/app/<route>/page.tsx`. Untuk data dinamis pakai server component + `api.*`.
- **Tambah endpoint data**: tambah method di `lib/api.ts` (satu sumber, jangan fetch tersebar).
- **Styling**: pakai class di `globals.css` (custom) atau Tailwind. Media query di bagian RESPONSIVE bawah `globals.css`.
- **Selalu** jalankan `npm run build` sebelum push — build gagal = Vercel tidak deploy.
- Foto/aset user → Supabase Storage (bukan disk; disk ephemeral di serverless).
