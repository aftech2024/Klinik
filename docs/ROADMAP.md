# Roadmap Pengembangan — aftech Klinik

Peta jalan jangka panjang (3-6+ bulan). Dokumen hidup — update tiap fase selesai.

**Arah strategis (hasil brainstorm):**
1. 🎯 **Aplikasi mobile iOS + Android** untuk pasien → lihat [`MOBILE-APP.md`](./MOBILE-APP.md)
2. 🎯 **Integrasi data BPJS** (peserta JKN) → lihat [`BPJS-INTEGRATION.md`](./BPJS-INTEGRATION.md)
3. 🎯 **Modul apps user-friendly**
4. Plus penguatan: revenue/payment, pasien experience, operasional, kualitas teknis.

---

## Kondisi Sekarang (baseline)

| App | Fungsi | Deploy |
|-----|--------|--------|
| `clinic-web` | Website publik + entry booking/login | Vercel |
| `clinic-admin` | Dashboard admin cabang (dokter, obat, stok, POS) | Vercel |
| `clinic-pos` | Kasir | Vercel |
| `clinic-portal` | Portal pasien & dokter | Vercel |
| `clinic-api` | Backend NestJS + Prisma | HF Spaces + Supabase |

**Fondasi sudah ada**: multi-cabang, multi-role, model DB lengkap (appointment, queue, billing, payment, pharmacy, medical-records, notification, audit-log).

**Utang teknis / gap yang perlu dibereskan awal:**
- Deploy manual + kena limit Vercel 100/hari → butuh CI/CD proper.
- Belum ada testing otomatis (Playwright terpasang, test belum ada).
- Belum ada monitoring/error tracking.
- Backend di HF Spaces (bisa sleep) → pertimbangkan hosting lebih stabil untuk skala.

---

## Prioritas & Urutan

Legenda dampak/effort: 🔥 tinggi · 🟡 sedang · 🟢 rendah

### FASE 0 — Fondasi (paralel, mulai segera) 🔥
Prasyarat semua fitur besar. Kerjakan sambil urus legal BPJS.

| Item | Kenapa penting |
|------|----------------|
| **CI/CD** (GitHub Actions → deploy) | Hentikan deploy manual + kelola kuota |
| **Monitoring** (Sentry) di web + api | Tahu error produksi |
| **Testing dasar** (api + E2E jalur kritis) | Cegah regresi |
| **Hosting API dinilai ulang** | HF Spaces sleep → skala butuh stabil |
| **Urus legal BPJS** (PKS, kredensial) | Gate BPJS — makan waktu, mulai awal |

### FASE 1 — Persiapan Mobile & API 🔥
| Item | Detail |
|------|--------|
| Endpoint mobile-friendly di `clinic-api` | Payload ringkas, versi-kan API |
| Auth mobile (JWT + refresh + secure-store) | Reuse pola portal |
| Setup project Expo React Native | Lihat `MOBILE-APP.md` Fase 0 |
| Shared types (Doctor/Branch/dll) | Reuse dari web |

### FASE 2 — Mobile App Core (pasien) 🔥
Auth → Profil → Booking → Antrean real-time → Rekam medis.
Detail per fase di [`MOBILE-APP.md`](./MOBILE-APP.md) §7.
Rilis **MVP** ke TestFlight / Play internal testing di akhir fase.

### FASE 3 — Integrasi BPJS 🔥
Prasyarat: legal selesai (Fase 0).
Core auth bridging → Peserta → Antrean Online (Mobile JKN) → Pelayanan → i-Care.
Detail per fase di [`BPJS-INTEGRATION.md`](./BPJS-INTEGRATION.md) §8.
Integrasikan ke mobile app + admin + portal.

### FASE 4 — Revenue & Payment 🟡
| Item | |
|------|--|
| Payment gateway (Midtrans/Xendit) | Bayar online non-BPJS |
| Invoice + e-receipt PDF | Otomatis |
| Voucher/promo engine | Model `Promotion` sudah ada |
| Membership/paket (MCU, dll) | Retensi pasien |

### FASE 5 — Pasien Experience Lanjut 🟡
| Item | |
|------|--|
| Reminder appointment (WhatsApp/email + push) | Kurangi no-show |
| Telemedicine (chat/video) | Konsultasi jarak jauh |
| Notifikasi hasil lab | |
| Program referral pasien | Growth |

### FASE 6 — Operasional & Analitik 🟡
| Item | |
|------|--|
| Dashboard analitik cabang (revenue, kunjungan, obat terlaris) | Model `Report` |
| Stok obat: reorder point, alert expired, transfer antar cabang | `StockTransfer` ada |
| Manajemen jadwal & shift dokter | `DoctorSchedule` ada |
| Dashboard audit log | `AuditLog` ada |

### FASE 7 — Skala & Kualitas 🟢
| Item | |
|------|--|
| Optimasi SEO website + konten blog | |
| Performance & caching | |
| PWA untuk web (offline) | |
| Coverage testing diperluas | |

---

## Timeline Indikatif (fleksibel)

```
Bulan 1-2   │ Fase 0 (fondasi) + Fase 1 (persiapan mobile/api)  + [legal BPJS mulai]
Bulan 2-4   │ Fase 2 (mobile core, MVP rilis)
Bulan 3-5   │ Fase 3 (BPJS — setelah legal beres)
Bulan 4-6   │ Fase 4 (payment) + Fase 5 (experience)
Bulan 6+    │ Fase 6 (operasional/analitik) + Fase 7 (skala)
```

> Legal BPJS = jalur kritis. Mulai paling awal karena di luar kendali teknis.

---

## Dependensi Kunci

```
Legal BPJS ──────────────▶ Fase 3 (BPJS)
Fase 0 (fondasi) ────────▶ semua fase
Fase 1 (api/mobile prep) ▶ Fase 2 (mobile) ─▶ Fase 3 (BPJS di mobile)
Payment gateway ─────────▶ Fase 4
```

---

## Keputusan yang Perlu Dikonfirmasi

1. Status faskes tiap cabang: **FKTP (Klinik Pratama)** atau **FKRTL (Klinik Utama)**? → menentukan API BPJS.
2. Mobile: konfirmasi **React Native + Expo** (rekomendasi) vs Flutter.
3. Payment gateway: Midtrans / Xendit / lainnya?
4. Hosting API produksi jangka panjang: tetap HF Spaces atau pindah (Railway/Fly/VPS)?
5. Ada budget akun store (Apple $99/th, Google $25) & Apple Developer?

---

## Referensi Dokumen

- [`MOBILE-APP.md`](./MOBILE-APP.md) — tech stack & detail aplikasi mobile
- [`BPJS-INTEGRATION.md`](./BPJS-INTEGRATION.md) — integrasi data BPJS
- `../clinic-web/DOCUMENTATION.md` — dokumentasi website
- `../DEPLOYMENT.md`, `../URL-DEPENDENCIES.md` — infra & URL antar-service
