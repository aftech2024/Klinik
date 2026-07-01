# Mobile App (iOS + Android) — aftech Klinik

Dokumen perencanaan aplikasi mobile. **Status: PLANNING.**

Tujuan: aplikasi native iOS + Android yang **user friendly** untuk pasien (utama) + companion untuk staf (opsional), satu codebase, memakai backend `clinic-api` yang sudah ada.

**Daftar isi**
1. Rekomendasi Tech Stack
2. UI / Tampilan — pakai apa & saran
3. Arsitektur
4. Struktur Navigasi
5. Modul Lengkap → Layar → Fungsi → Endpoint → Komponen UI
6. Detail Layar Utama (wireframe + saran tampilan)
7. Prinsip UX User-Friendly
8. Design System & Token
9. Reuse dari Web
10. Build & Distribusi
11. Tahapan
12. Estimasi Sumber Daya

---

## 1. Rekomendasi Tech Stack

### Pilihan utama: **React Native + Expo** ✅

**Alasan**: tim sudah React + TypeScript (Next.js), satu codebase iOS+Android, Expo build/OTA cepat, reuse pola `lib/api.ts` + tipe data dari web.

| Layer | Pilihan | Alasan |
|-------|---------|--------|
| Framework | **React Native (Expo, managed)** | Cross-platform |
| Bahasa | **TypeScript** | Konsisten web |
| Navigasi | **expo-router** | File-based (mirip Next App Router) |
| Server state | **TanStack Query** | Cache, retry, sync otomatis |
| HTTP | **axios / fetch** | Pola `api.ts` |
| Auth storage | **expo-secure-store** | Token aman (Keychain/Keystore) |
| Push notif | **expo-notifications** | Reminder + antrean dipanggil |
| Biometric | **expo-local-authentication** | Login sidik jari/face |
| Form | **react-hook-form + zod** | Validasi |
| Realtime | **Supabase Realtime** / polling | Antrean live |
| Maps | **react-native-maps** | Lokasi cabang |
| Build | **EAS Build + Submit** | Ke store |
| Testing | **Jest + RNTL**, **Maestro** (E2E) | Kualitas |

### Alternatif: Flutter → hanya kalau ada dev Dart & butuh UI super kompleks. Untuk tim ini RN+Expo lebih efisien.
### Hindari: native terpisah (Swift+Kotlin) = 2x kerja; WebView-wrapper = UX kaku, risiko ditolak store.

---

## 2. UI / Tampilan — Pakai Apa & Saran

Pertanyaan "memudahkan tampilan menggunakan apa" → 2 lapis: **styling** + **component kit**.

### Rekomendasi: **NativeWind (styling) + gluestack-ui v2 (komponen)** ✅

| Kebutuhan | Pilihan | Alasan |
|-----------|---------|--------|
| **Styling** | **NativeWind** (Tailwind untuk RN) | Tim sudah Tailwind di web → reuse token & mental model. Class `className` sama gaya |
| **Komponen siap pakai** | **gluestack-ui v2** | Komponen accessible (button, input, modal, toast, actionsheet) berbasis NativeWind. Cepat, konsisten |
| **Ikon** | **lucide-react-native** | Sama dgn web (`lucide-react`) |
| **Animasi** | **react-native-reanimated** + **moti** | Transisi halus, gesture |
| **Skeleton/loading** | **moti/skeleton** atau shimmer | UX saat fetch |
| **Bottom sheet** | **@gorhom/bottom-sheet** | Pilih jadwal, filter, detail |
| **Toast/alert** | gluestack toast | Feedback aksi |
| **Chart** (staf/analitik) | **victory-native** / **react-native-gifted-charts** | Grafik revenue/kunjungan |

**Kenapa bukan yang lain:**
- *React Native Paper* (Material) → bagus, tapi look Material Google, kurang fleksibel branding.
- *Tamagui* → sangat cepat & powerful, tapi kurva belajar lebih curam. Pilihan kedua kalau butuh performa animasi ekstrem.
- *Bare NativeWind + komponen buatan sendiri* → paling fleksibel tapi lambat di awal. gluestack menyeimbangkan.

### Pola tampilan yang bikin user friendly
- **Card-based**: informasi dibungkus kartu (dokter, appointment, tagihan) — mudah dipindai.
- **Bottom tab** navigasi utama (maks 5 tab).
- **Bottom sheet** untuk aksi (pilih jadwal, filter) — tidak pindah halaman, cepat.
- **Skeleton loader** saat loading (bukan spinner kosong).
- **Empty state** ramah (ilustrasi + teks + tombol aksi) saat data kosong.
- **Angka besar** untuk antrean & informasi kritis.
- **Warna brand** konsisten (primary `#0D9488`).

---

## 3. Arsitektur

```
┌────────────────────────────────┐
│      Mobile App (Expo RN)       │
│  expo-router · TanStack Query · │
│  NativeWind + gluestack-ui ·    │
│  secure-store · notifications   │
└───────────────┬────────────────┘
                │ HTTPS (JWT + refresh)
                ▼
┌────────────────────────────────┐
│         clinic-api (NestJS)      │
│  auth·appointments·queue·        │
│  medical-records·billing·bpjs··· │
└───────────────┬────────────────┘
                ▼
     Supabase (DB + Storage + Realtime)
```

**Prinsip:**
- Backend **sama** (`clinic-api`), tidak ada backend baru.
- Auth JWT + refresh (pola portal), token di `secure-store`.
- Data via **TanStack Query** (cache + offline-tolerant).
- BPJS **tidak pernah** dari mobile — selalu lewat `clinic-api` (lihat `BPJS-INTEGRATION.md`).
- Antrean real-time via Supabase Realtime atau polling ringan.

---

## 4. Struktur Navigasi

**Aplikasi Pasien** — Bottom Tab (5):

```
┌──────────────────────────────────────────────┐
│                                               │
│              [ Konten Layar ]                 │
│                                               │
├──────────────────────────────────────────────┤
│  🏠      📅        🎫        📋        👤     │
│ Beranda Booking  Antrean  Rekam   Profil     │
└──────────────────────────────────────────────┘
```

Tiap tab punya stack sendiri (expo-router):
- **Beranda**: ringkasan + aksi cepat + promo/artikel
- **Booking**: cari dokter/cabang/layanan → pilih jadwal → konfirmasi
- **Antrean**: antrean aktif real-time + riwayat
- **Rekam Medis**: riwayat kunjungan, diagnosa, resep
- **Profil**: data diri, kartu BPJS, tagihan, notifikasi, pengaturan

**Aplikasi Staf** (companion, opsional fase lanjut) — tab berbeda: Antrean (panggil), Jadwal, Pasien, POS ringkas, Laporan.

---

## 5. Modul Lengkap → Layar → Fungsi → Endpoint → Komponen UI

Dipetakan dari **semua modul `clinic-api` yang ada sekarang**. Kolom "App" = P (Pasien) / S (Staf companion).

### 🔐 Auth (`/api/auth`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Login | Masuk email+password / biometric | `POST /auth/login`, `POST /auth/refresh` | Input, Button, biometric prompt | P·S |
| Daftar | Registrasi pasien | `POST /auth/register` | Form (rhf+zod), stepper | P |
| Sesi | Ambil profil aktif, logout | `GET /auth/me`, `POST /auth/logout` | — | P·S |

### 👤 Patients (`/api/patients`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Profil Saya | Lihat/edit data diri | `GET /patients/:id`, `PATCH /patients/:id` | Avatar, list item, form sheet | P |
| Kartu Pasien | No. rekam medis | `GET /patients/medical-number/:number` | Card (QR opsional) | P |

### 🩺 Doctors (`/api/doctors`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Cari Dokter | List + filter spesialis + search | `GET /doctors` | Search bar, chip filter, card grid, `DoctorPhoto` | P |
| Profil Dokter | Detail + jadwal | `GET /doctors/:slug` | Header foto, tabs, jadwal | P |

### 🏥 Branches (`/api/branches`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Cabang | List cabang + peta | `GET /branches` | Card + map pin (react-native-maps) | P |
| Detail Cabang | Alamat, fasilitas, kontak | `GET /branches/:slug` | Map, list fasilitas, tombol telepon/arah | P |

### 🧾 Services (`/api/services`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Layanan | List layanan per kategori | `GET /services`, `GET /services/:slug` | Card kategori, accordion | P |

### 📅 Appointments (`/api/appointments`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Buat Janji | Pilih dokter/cabang/jadwal | `POST /appointments` | Bottom sheet jadwal, date picker, konfirmasi | P |
| Janji Saya | Daftar appointment | `GET /appointments/my` | Card status (badge warna) | P |
| Detail Janji | Info + batal/ubah | `GET /appointments/:id`, `PATCH /:id/status` | Detail card, action sheet | P |
| Kelola (staf) | Semua janji + ubah status | `GET /appointments`, `PATCH /:id/status` | List + filter | S |

### 🎫 Queue (`/api/queue`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Antrean Saya | Nomor + estimasi, real-time | `GET /queue/my` | **Angka besar**, progress, push notif | P |
| Antrean Cabang | Status antrean per cabang | `GET /queue/:branchId`, `/:branchId/stats` | Live list, counter | P·S |
| Panggil (staf) | Panggil berikutnya, update status | `POST /:branchId/call-next`, `PATCH /:queueId/status` | Tombol besar, list | S |

### 📋 Medical Records (`/api/medical-records`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Riwayat Medis | Daftar kunjungan | `GET /medical-records/my` | Timeline/list card | P |
| Detail Rekam | Diagnosa, tindakan, resep | `GET /medical-records/:id` | Section card, list resep | P |
| Input (staf/dokter) | Buat rekam + resep | `POST /`, `PATCH /:id`, `POST /:id/prescriptions` | Form, list editable | S |

### 💳 Billing & Payment (`/api/billing`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Tagihan | Daftar tagihan | `GET /billing` | Card jumlah + status | P |
| Detail & Bayar | Rincian + bayar (non-BPJS) | `GET /billing/:id`, `POST /:id/payment` | Rincian, tombol bayar, gateway | P |
| E-Receipt | Kwitansi | (dari payment) | PDF/share sheet | P |

### 🔔 Notifications (`/api/notifications`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Notifikasi | List + tandai dibaca | `GET /notifications`, `PATCH /:id/read`, `PATCH /read-all` | List, badge unread, swipe | P·S |

### 📰 Content (`/api/content`)
| Layar | Fungsi | Endpoint | Komponen UI | App |
|-------|--------|----------|-------------|-----|
| Artikel | Blog kesehatan | `GET /content/articles`, `/articles/:slug` | Card + detail (render html) | P |
| Promo | Promosi | `GET /content/promotions`, `/promotions/:slug` | Banner carousel | P |
| FAQ | Tanya jawab | `GET /content/faqs` | Accordion | P |
| Testimoni | Ulasan | `GET /content/testimonials` | Card carousel | P |

### 💊 Pharmacy / POS / Reports / Admins — **Staf only** (companion, fase lanjut)
| Modul | Endpoint utama | Layar staf | App |
|-------|----------------|-----------|-----|
| Pharmacy | `/pharmacy/medicines`, `/stock`, `/transfers` | Cek stok, transfer antar cabang | S |
| POS | `/pos/transactions`, `/summary` | Kasir ringkas, ringkasan harian | S |
| Reports | `/reports/dashboard`, `/revenue`, `/top-doctors` | Analitik (chart) | S |
| Admins | `/admins`, aktif/branch | Kelola admin | S |
| Settings | `/settings` | Pengaturan | S |
| Upload | `/upload` | Upload foto (Supabase Storage) | P·S |

> **Fokus rilis pertama = Aplikasi Pasien (P).** Modul staf (S) jadi companion app atau fase lanjut — banyak sudah tercakup di `clinic-admin`/`clinic-pos` web.

---

## 6. Detail Layar Utama (wireframe + saran tampilan)

### Beranda (action-first)
```
┌──────────────────────────────┐
│ Halo, Budi 👋      🔔(2)      │
│ Kartu BPJS: Aktif ✓          │
├──────────────────────────────┤
│ ┌────────┐  ┌────────┐        │
│ │📅 Buat │  │🎫 Ambil│  ← tombol
│ │ Janji  │  │Antrean │    besar
│ └────────┘  └────────┘        │
├──────────────────────────────┤
│ Janji Terdekat                │
│ ┌──────────────────────────┐ │
│ │ dr. Sarah · Senin 10:00  │ │  ← card
│ │ Cabang Pusat   [Detail]  │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Antrean Aktif   No. A-12     │  ← kalau ada
│ Artikel & Promo  [carousel]  │
└──────────────────────────────┘
```
Komponen: greeting header, status BPJS chip, 2 tombol aksi besar, card janji terdekat, banner promo carousel. Skeleton saat load.

### Antrean (real-time)
```
┌──────────────────────────────┐
│        Nomor Antrean Anda     │
│                               │
│           A - 12              │  ← angka SANGAT besar
│                               │
│   Sedang dilayani: A - 09     │
│   Estimasi: ± 25 menit        │
│   ▓▓▓▓▓▓░░░░  6 di depan       │  ← progress
├──────────────────────────────┤
│ [Notifikasi saat giliran] ✓  │
└──────────────────────────────┘
```
Real-time (Supabase Realtime/polling) + push notif saat mendekati giliran.

### Booking (bottom sheet jadwal)
```
Cari dokter → pilih dokter → tap "Buat Janji"
     ↓ bottom sheet naik
┌──────────────────────────────┐
│ Pilih Tanggal  [Sen Sel Rab] │  ← chip tanggal
│ Pilih Jam                     │
│ [09:00][09:30][10:00]✓[10:30]│  ← slot chip
│ Cabang: Pusat ▾              │
│        [ Konfirmasi Janji ]  │  ← tombol
└──────────────────────────────┘
```

### Rekam Medis (timeline)
```
┌──────────────────────────────┐
│ ● 20 Jun 2026 · dr. Sarah    │
│   Dx: ISPA · 2 resep         │  → tap detail
│ ● 05 Mei 2026 · dr. Budi     │
│   Dx: Kontrol rutin          │
└──────────────────────────────┘
```

---

## 7. Prinsip UX User-Friendly

- **Bottom tab** ≤5 item, ikon + label.
- **Home action-first**: 2 tombol besar (Buat Janji, Ambil Antrean).
- Antrean = **angka besar** + estimasi + push notif.
- **Bahasa Indonesia**, ikon jelas, teks minim.
- **Skeleton loader** (bukan spinner kosong) + **empty state** ramah.
- **Bottom sheet** untuk aksi cepat (jadwal, filter) tanpa pindah halaman.
- **Offline-tolerant**: TanStack Query cache.
- **Feedback instan**: toast tiap aksi (berhasil/gagal).
- Aksesibilitas: font scalable, kontras cukup, target tap ≥44px.
- Biometric login untuk cepat & aman.
- Dark mode (fase lanjut).

---

## 8. Design System & Token

Ambil dari web (`clinic-web/src/app/globals.css`) → mapping ke NativeWind theme.

```js
// tailwind.config (NativeWind) — selaras brand web
colors: {
  primary: { 500:'#14B8A6', 600:'#0D9488', 700:'#0F766E', 900:'#134E4A' },
  success:'#12B76A', error:'#F04438', warning:'#F79009',
}
radius: { card: 24 }
font: Inter
```
- Komponen dasar: `Button`, `Card`, `Input`, `Badge`, `Chip`, `Sheet`, `Toast`, `Skeleton`, `EmptyState`, `Avatar`, `SectionHeader`.
- Reuse `DoctorPhoto` (fallback emoji) — port ke RN `Image` + `onError`.

---

## 9. Reuse dari Web

- **Tipe data** (`Doctor`, `Branch`, `Service`, dll) dari `clinic-web/src/lib/api.ts` → ekstrak ke package shared / salin awal.
- **Pola API layer**: `lib/api.ts` gaya sama (axios instance + interceptor refresh 401).
- **Design token**: warna brand.
- **Alur SSO/token**: konsep sama portal, simpan di `secure-store`.

---

## 10. Build & Distribusi

| Item | iOS | Android |
|------|-----|---------|
| Akun | Apple Developer ($99/th) | Play Console ($25 sekali) |
| Build | EAS Build | EAS Build |
| Submit | EAS Submit → App Store Connect | EAS Submit → Play Console |
| Update cepat | Expo OTA (JS only) | Expo OTA |
| Testing | TestFlight | Internal/Closed track |

Siapkan: ikon, splash, **privacy policy** (wajib store), akun developer, sertifikat, screenshot store.

---

## 11. Tahapan

| Fase | Aktivitas | Output |
|------|-----------|--------|
| **0. Setup** | Expo + expo-router + TS + NativeWind + gluestack, koneksi `clinic-api`, auth layer | Login sukses |
| **1. Auth & Profil** | Login/daftar/biometric, profil, kartu BPJS | Pasien masuk |
| **2. Booking** | Cari dokter/cabang, jadwal (sheet), buat janji | Booking dari HP |
| **3. Antrean** | Nomor real-time + push notif | Antrean live |
| **4. Rekam Medis** | Riwayat + diagnosa + resep | History pasien |
| **5. Billing/Payment** | Tagihan + bayar + e-receipt | Transaksi mobile |
| **6. Konten & Notif** | Artikel, promo, FAQ, notifikasi push | Engagement |
| **7. BPJS** | Cek peserta + antrean JKN + i-Care | Fitur BPJS (lihat `BPJS-INTEGRATION.md`) |
| **8. Polish & Launch** | QA, empty/error state, submit store | Rilis publik |
| **9. Staf companion** (opsional) | Antrean panggil, jadwal, POS ringkas, laporan | Staf mobile |

---

## 12. Estimasi Sumber Daya

- **Dev**: 1-2 React Native (bisa dari tim web React).
- **Backend**: tambah endpoint mobile-friendly + module `bpjs` di `clinic-api`.
- **Desain**: 1 designer flow & komponen (reuse design token web).
- **Legal/aset**: privacy policy, akun store, PKS BPJS (paralel — jalur kritis).
