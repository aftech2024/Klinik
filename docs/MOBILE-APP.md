# Mobile App (iOS + Android) — aftech Klinik

Dokumen perencanaan aplikasi mobile pasien (dan opsi staf).
**Status: PLANNING.**

Tujuan: aplikasi native iOS + Android untuk pasien — booking, antrean, rekam medis, BPJS, notifikasi — **user friendly**, satu codebase.

---

## 1. Rekomendasi Tech Stack

### Pilihan utama: **React Native + Expo** ✅ (rekomendasi)

**Alasan** (sesuai konteks tim & sistem):
- Tim sudah pakai **React + TypeScript** (Next.js di web/admin/pos/portal) → reuse skill, pola, tipe data.
- **Satu codebase** iOS + Android.
- **Expo** = build & deploy cepat (EAS Build), OTA update (patch tanpa re-submit store), tooling matang.
- Bisa reuse pola `lib/api.ts` dari `clinic-web` (fetch ke `clinic-api` yang sama).
- Ekosistem library lengkap (navigation, notifikasi, biometric, kamera untuk upload).

**Stack lengkap:**

| Layer | Pilihan | Alasan |
|-------|---------|--------|
| Framework | **React Native (Expo, managed workflow)** | Cross-platform, cepat |
| Bahasa | **TypeScript** | Konsisten dgn web |
| Navigasi | **expo-router** | File-based routing (mirip Next App Router) |
| State/Data | **TanStack Query (react-query)** | Cache, retry, sync server state |
| HTTP | **fetch / axios** | Sama pola `api.ts` |
| Auth storage | **expo-secure-store** | Simpan token aman (Keychain/Keystore) |
| Notifikasi | **expo-notifications** (push) | Reminder appointment |
| Biometric | **expo-local-authentication** | Login sidik jari/face |
| Form | **react-hook-form + zod** | Validasi konsisten |
| UI | **NativeWind** (Tailwind utk RN) atau **Tamagui** | Reuse pola Tailwind web |
| Maps | **react-native-maps** | Lokasi cabang |
| Build/Deploy | **EAS Build + EAS Submit** | Ke App Store & Play Store |
| Testing | **Jest + React Native Testing Library**, **Maestro** (E2E) | Kualitas |

### Alternatif: **Flutter**
| Plus | Minus |
|------|-------|
| UI sangat mulus, performa tinggi | Bahasa **Dart** (baru untuk tim React) |
| Widget kaya | Tidak reuse kode/skill web |

→ **Pilih Flutter hanya kalau** ada developer Dart & butuh animasi/UI super kompleks. Untuk tim ini, **React Native + Expo lebih efisien**.

### Yang TIDAK disarankan
- Native murni (Swift + Kotlin terpisah) → 2x kerja, 2x maintenance.
- WebView-wrapper murni → UX kaku, kemungkinan ditolak App Store.

---

## 2. Arsitektur

```
┌────────────────────────────────┐
│      Mobile App (Expo RN)       │
│  expo-router · react-query ·    │
│  secure-store · notifications   │
└───────────────┬────────────────┘
                │ HTTPS (JWT)
                ▼
┌────────────────────────────────┐
│         clinic-api (NestJS)      │
│  auth · appointments · queue ·   │
│  medical-records · bpjs · ...    │
└───────────────┬────────────────┘
                ▼
         Supabase (DB + Storage)
```

**Prinsip:**
- Mobile pakai **backend yang sama** (`clinic-api`). Tidak ada backend baru.
- Tambah endpoint **mobile-friendly** (payload ringkas) bila perlu, atau BFF layer.
- Auth: JWT + refresh token (sama seperti portal). Token di `secure-store`.
- BPJS **tidak pernah** dipanggil dari mobile — selalu lewat `clinic-api` (lihat `BPJS-INTEGRATION.md`).

---

## 3. Fitur Aplikasi Pasien (Modul)

Prioritas user-friendly: alur sedikit tap, jelas, bahasa Indonesia.

| Modul | Fungsi | Backend |
|-------|--------|---------|
| **Onboarding & Auth** | Daftar, login, biometric, lupa password | `auth` |
| **Profil & Kartu** | Data diri, kartu BPJS, NIK | `patients` + `bpjs` |
| **Cari & Booking** | Cari dokter/cabang/layanan, pilih jadwal, booking | `doctors` `branches` `appointments` |
| **Antrean Real-time** | Nomor antrean, estimasi waktu, notifikasi dipanggil | `queue` + Antrean Online BPJS |
| **BPJS** | Cek keaktifan, pakai antrean JKN, rujukan | `bpjs` |
| **Rekam Medis** | Riwayat kunjungan, diagnosa, resep | `medical-records` + i-Care |
| **Pembayaran** | Bayar tagihan (non-BPJS), riwayat, e-receipt | `billing` `payment` |
| **Notifikasi** | Reminder appointment, promo, hasil lab | `notifications` (push) |
| **Telemedicine** (fase lanjut) | Chat/video konsultasi | modul baru |
| **Info & Konten** | Artikel kesehatan, promo, lokasi cabang (maps) | `content` |

---

## 4. Prinsip UX (User Friendly)

- **Bottom tab navigation**: Beranda · Booking · Antrean · Rekam Medis · Profil.
- **Home = action-first**: tombol besar "Buat Janji" & "Ambil Antrean".
- Antrean tampil **angka besar + estimasi** + push notif saat mendekati giliran.
- Bahasa Indonesia, ikon jelas, minim teks.
- **Offline-tolerant**: cache data (react-query) biar tetap tampil saat sinyal jelek.
- Aksesibilitas: font scalable, kontras cukup, target tap ≥44px.
- Dark mode (opsional fase lanjut).

---

## 5. Reuse dari Web

- **Tipe data**: ekstrak tipe `Doctor`, `Branch`, `Service`, dll (dari `clinic-web/src/lib/api.ts`) ke package shared / duplikasi awal.
- **Pola API layer**: `lib/api.ts` gaya sama.
- **Design token**: warna brand (primary `#0D9488`, dst dari `globals.css`) → mapping ke NativeWind/Tamagui theme.
- **Alur SSO/token**: sama konsep portal (`token bridge`), disesuaikan ke `secure-store`.

---

## 6. Build & Distribusi

| Item | iOS | Android |
|------|-----|---------|
| Akun | Apple Developer Program ($99/th) | Google Play Console ($25 sekali) |
| Build | EAS Build | EAS Build |
| Submit | EAS Submit → App Store Connect | EAS Submit → Play Console |
| Update cepat | Expo OTA (untuk JS, bukan native) | Expo OTA |
| Testing | TestFlight | Internal/Closed testing track |

> Siapkan: ikon app, splash, privacy policy (wajib store), akun developer, sertifikat.

---

## 7. Tahapan (Mobile)

| Fase | Aktivitas | Output |
|------|-----------|--------|
| **0. Setup** | Init Expo + expo-router + TS + NativeWind, koneksi ke `clinic-api` | App kosong login sukses |
| **1. Auth & Profil** | Login/daftar/biometric, profil, kartu BPJS | Pasien bisa masuk |
| **2. Booking** | Cari dokter/cabang, pilih jadwal, buat janji | Booking dari HP |
| **3. Antrean** | Nomor antrean real-time + push notif | Antrean live |
| **4. Rekam Medis** | Riwayat kunjungan, diagnosa, resep | History pasien |
| **5. BPJS** | Cek peserta + antrean JKN + i-Care | Fitur BPJS di app |
| **6. Pembayaran** | Bayar tagihan non-BPJS + e-receipt | Transaksi mobile |
| **7. Polish & Launch** | Notifikasi, konten, QA, submit store | Rilis publik |

---

## 8. Estimasi Sumber Daya

- **Minimal**: 1-2 dev React Native (bisa dari tim web yang sudah React).
- **Backend**: tambah endpoint mobile + module `bpjs` di `clinic-api`.
- **Desain**: 1 designer untuk flow & komponen mobile (opsional pakai design system existing).
- **Aset legal**: privacy policy, akun store, PKS BPJS (paralel).
