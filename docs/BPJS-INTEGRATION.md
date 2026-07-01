# Integrasi BPJS Kesehatan — aftech Klinik

Dokumen perencanaan integrasi data BPJS untuk peserta JKN-KIS.
**Status: PLANNING.** Belum diimplementasikan. Butuh registrasi resmi + PKS dengan BPJS Kesehatan.

> ⚠️ **Disclaimer**: Detail endpoint, header, dan skema enkripsi di bawah berdasarkan pola bridging BPJS yang umum. **Spesifikasi resmi & kredензial hanya didapat setelah PKS** (Perjanjian Kerja Sama) via kantor cabang BPJS + Dinas terkait. Selalu verifikasi ke dokumentasi resmi BPJS (DPMP / Trust Mark) yang diberikan saat onboarding. Jangan hardcode asumsi.

---

## 1. Klasifikasi Faskes → API yang Dipakai

BPJS membedakan API berdasarkan tingkat fasilitas kesehatan:

| Faskes | Contoh | API BPJS relevan |
|--------|--------|------------------|
| **FKTP** (Faskes Tingkat Pertama) | Klinik Pratama, Puskesmas, dr. keluarga | **PCare**, **Antrean Online**, **i-Care JKN** |
| **FKRTL** (Rujukan/Lanjutan) | RS, Klinik Utama | **VClaim**, **Aplicares**, **Antrean Online**, **i-Care JKN** |

**aftech Klinik** kemungkinan **Klinik Pratama (FKTP)** → fokus utama: **PCare + Antrean Online + i-Care JKN**.
Kalau ada layanan Klinik Utama → tambah **VClaim**.

> **Aksi pertama**: konfirmasi status faskes klinik (FKTP/FKRTL) & nomor registrasi PPK BPJS tiap cabang.

---

## 2. Modul BPJS (Ringkasan Fungsi)

### 2a. PCare (Primary Care) — inti untuk klinik
API pelayanan FKTP. Fitur:
- **Pendaftaran peserta** — cek keaktifan kartu (nomor kartu / NIK)
- **Data peserta** — nama, tgl lahir, faskes terdaftar, kelas, status aktif
- **Pendaftaran kunjungan** — daftar pelayanan (poli, keluhan)
- **Pelayanan** — input diagnosa (ICD-10), terapi, tindakan
- **Rujukan** — buat rujukan ke FKRTL
- **Obat** — pencatatan obat
- **Master data** — referensi diagnosa, poli, dokter, kabupaten, dll

### 2b. Antrean Online (Antrol) — WAJIB
Bridging antrean klinik ke **Mobile JKN**. Peserta ambil antrean dari HP → data masuk sistem klinik & sebaliknya.
- Kirim jadwal dokter/poli ke BPJS
- Terima booking antrean dari Mobile JKN
- Update status antrean real-time (dipanggil, dilayani, selesai)
- **Wajib** untuk klinik yang kerja sama BPJS (regulasi antrean online).

### 2c. i-Care JKN — riwayat pelayanan
Menampilkan **riwayat kesehatan peserta** (kunjungan, diagnosa, obat sebelumnya) lintas faskes.
- Butuh **validasi peserta** (sidik jari / face recognition / verifikasi nomor kartu)
- Return: URL untuk ditampilkan (iframe/webview) berisi history
- Membantu dokter lihat rekam medis JKN pasien.

### 2d. VClaim (kalau Klinik Utama/FKRTL)
Untuk klaim & SEP (Surat Eligibilitas Peserta), rujukan lanjutan. Skip kalau murni FKTP.

---

## 3. Skema Keamanan Bridging BPJS

Semua API BPJS pakai **signature-based auth + response terenkripsi**. Ini WAJIB dan sensitif.

### Header request
| Header | Isi |
|--------|-----|
| `X-cons-id` | Consumer ID (dari BPJS) |
| `X-timestamp` | Unix timestamp (detik) sejak 1970 UTC |
| `X-signature` | HMAC-SHA256 base64 dari string `consid&timestamp`, key = secret key BPJS |
| `X-authorization` / `user_key` | Untuk PCare: Basic auth (username:password:kdaplikasi) + `user_key` |

### Response
- Body **terenkripsi AES-256-CBC**. Key = `consid + secretkey + timestamp`. IV = 16 byte pertama dari SHA-256(key).
- Setelah dekripsi → **di-decompress LZ-String** (`decompressFromEncodedURIComponent`).
- Baru jadi JSON.

> Skema ini kompleks & berubah per versi. **Implementasi HARUS server-side** (di `clinic-api`), **tidak pernah** di mobile/browser. Secret key BPJS = rahasia tingkat tinggi.

### Kredensial yang dibutuhkan (dari BPJS saat onboarding)
- `cons-id`, `secret-key`
- PCare: `username`, `password`, `user_key`, `kode aplikasi`
- Base URL production & development (BPJS kasih terpisah)

---

## 4. Arsitektur Integrasi

```
┌─────────────┐     ┌──────────────────────┐     ┌────────────────┐
│  Mobile App │────▶│      clinic-api       │────▶│  BPJS Kesehatan │
│ Admin / POS │     │  (module: bpjs)       │     │  PCare/Antrol/  │
│   Portal    │◀────│  - signature builder  │◀────│  i-Care/VClaim  │
└─────────────┘     │  - AES decrypt+LZ     │     └────────────────┘
                    │  - cache ref data     │
                    │  - map ke model lokal │
                    └──────────┬───────────┘
                               │
                        ┌──────▼──────┐
                        │  Supabase   │  (simpan mapping: Patient↔noKartu BPJS,
                        │  Postgres   │   log kunjungan BPJS, cache master data)
                        └─────────────┘
```

**Prinsip**:
1. Semua panggilan BPJS lewat **satu module `bpjs`** di `clinic-api`. Client (mobile/admin) tidak pernah kontak BPJS langsung.
2. Kredensial BPJS di **env server** (`clinic-api` secrets), bukan di repo/mobile.
3. Simpan mapping `Patient.bpjsCardNumber` + cache referensi (diagnosa ICD-10, poli) di DB lokal biar cepat.
4. Semua request/response BPJS **di-log** (audit) untuk troubleshooting & compliance.

---

## 5. Perubahan Data Model (rencana)

Tambahan di Prisma (`clinic-api/prisma/schema.prisma`):

```prisma
model Patient {
  // ... existing
  bpjsCardNumber   String?   @unique   // nomor kartu JKN
  bpjsActive       Boolean?             // status keaktifan (cache)
  bpjsFaskesCode   String?              // kode faskes terdaftar
  nik              String?   @unique    // untuk cek peserta by NIK
}

model BpjsVisit {                       // log kunjungan BPJS
  id            String   @id @default(cuid())
  patientId     String
  branchId      String
  noKunjungan   String?               // no dari PCare
  diagnosaIcd   String?
  poli          String?
  status        String                // registered/served/referred/done
  rawResponse   Json?                 // audit
  createdAt     DateTime @default(now())
}

model BpjsReferenceCache {             // cache master data (ICD, poli, dll)
  id        String   @id @default(cuid())
  type      String                    // "diagnosa" | "poli" | "dokter"
  code      String
  name      String
  updatedAt DateTime @updatedAt
  @@unique([type, code])
}
```

---

## 6. Endpoint clinic-api (rencana, module `bpjs`)

| Endpoint internal | Fungsi | Panggil BPJS |
|-------------------|--------|--------------|
| `GET /api/bpjs/peserta?noka=` | Cek peserta by no kartu | PCare peserta |
| `GET /api/bpjs/peserta/nik?nik=` | Cek peserta by NIK | PCare peserta |
| `POST /api/bpjs/kunjungan` | Daftar kunjungan | PCare pendaftaran |
| `POST /api/bpjs/pelayanan` | Input diagnosa/terapi | PCare pelayanan |
| `POST /api/bpjs/rujukan` | Buat rujukan | PCare rujukan |
| `GET /api/bpjs/ref/:type` | Master data (cache) | PCare referensi |
| `POST /api/bpjs/antrean` | Kirim/update antrean | Antrean Online |
| `GET /api/bpjs/icare/:noka` | URL riwayat i-Care | i-Care JKN |

Semua di-guard JWT + role (admin/dokter cabang).

---

## 7. Legal & Compliance (WAJIB sebelum coding)

1. **PKS dengan BPJS Kesehatan** — perjanjian kerja sama per faskes/cabang. Tanpa ini tidak dapat kredensial.
2. **Registrasi PPK / bridging** — daftar aplikasi bridging ke BPJS (Trust Mark).
3. **UU PDP (Perlindungan Data Pribadi)** — data BPJS = data kesehatan sensitif. Butuh:
   - Consent pasien untuk akses data BPJS-nya
   - Enkripsi data at-rest & in-transit
   - Audit log akses
   - Retensi & penghapusan data sesuai regulasi
4. **Perjanjian antrean online** — kewajiban regulasi FKTP.

---

## 8. Tahapan Implementasi BPJS

| Fase | Aktivitas | Output |
|------|-----------|--------|
| **0. Legal** | Urus PKS, dapat kredensial, konfirmasi status faskes | cons-id, secret, user_key |
| **1. Core auth** | Module `bpjs`: signature builder + AES/LZ decrypt, di sandbox BPJS | Bisa call 1 endpoint sukses |
| **2. Peserta** | Cek keaktifan peserta (noka/NIK), mapping ke `Patient` | Verifikasi BPJS di pendaftaran |
| **3. Antrean Online** | Bridging antrean ke Mobile JKN | Peserta booking dari HP |
| **4. Pelayanan** | Kunjungan + diagnosa (ICD-10) + rujukan | Alur pelayanan JKN lengkap |
| **5. i-Care** | Riwayat pelayanan di portal dokter | Dokter lihat history JKN |
| **6. Rekonsiliasi** | Laporan & audit klaim BPJS | Dashboard BPJS |

---

## 9. Risiko & Catatan

- **Akses gated**: tanpa PKS resmi, tidak ada sandbox pun. Prioritaskan urus legal paralel dgn dev app lain.
- **Skema enkripsi berubah** antar versi API — buat abstraksi biar gampang update.
- **Rate limit & downtime** BPJS — buat retry + fallback + cache master data.
- **Jangan** simpan secret BPJS di repo/mobile. Server-only.
- Endpoint & format response BPJS **tidak dijamin stabil** — verifikasi selalu ke dokumen resmi terbaru.
