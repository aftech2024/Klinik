# 02 - User Flow

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Version:** 1.0.0

**Status:** Draft

---

# 1. Document Purpose

Dokumen ini mendefinisikan seluruh alur interaksi pengguna (User Flow) pada Landing Website.

Tujuan utama:

* Memastikan pengalaman pengguna (UX) konsisten.
* Menentukan Call-To-Action (CTA) setiap halaman.
* Menjadi acuan UI Design.
* Menjadi acuan Frontend Development.
* Menjadi dasar Event Analytics.

---

# 2. User Types

Landing Website memiliki 4 tipe pengguna.

| User              | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| Guest             | Pengunjung yang belum memiliki akun                         |
| Existing Patient  | Pasien yang telah memiliki akun                             |
| New Patient       | Calon pasien baru                                           |
| Corporate Partner | Perusahaan atau institusi yang mencari informasi kerja sama |

---

# 3. User Entry Points

Pengguna dapat masuk ke Landing Website melalui:

* Google Search
* Social Media
* QR Code
* Digital Advertisement
* WhatsApp Link
* Email Campaign
* Direct URL
* Referral Link

---

# 4. Primary User Journey

```text
Visitor

↓

Landing Website

↓

Browse Information

↓

Choose Service

↓

Choose Doctor

↓

Choose Branch

↓

Book Appointment

↓

Login / Register

↓

Patient Portal

↓

Appointment Success
```

---

# 5. Global Navigation Flow

```text
Home
│
├── About
├── Services
├── Doctors
├── Branches
├── Promotions
├── Articles
├── FAQ
├── Contact
│
├── Login
└── Register
```

Pengguna dapat berpindah antar halaman kapan saja melalui Navigation Bar maupun Footer.

---

# 6. Home Page Flow

```text
Home

↓

Hero Banner

↓

Scroll

↓

Services

↓

Doctor

↓

Promotion

↓

Article

↓

Download App

↓

Footer
```

CTA Utama:

* Book Appointment
* Search Doctor
* Download App

---

# 7. Service Flow

```text
Home

↓

Services

↓

Choose Service

↓

Service Detail

↓

Find Doctor

↓

Book Appointment

↓

Login/Register

↓

Patient Portal
```

---

# 8. Doctor Flow

```text
Home

↓

Doctors

↓

Search

↓

Filter

↓

Doctor Detail

↓

Choose Branch

↓

Book Appointment
```

Filter yang tersedia:

* Nama Dokter
* Spesialis
* Cabang
* Hari Praktik

---

# 9. Branch Flow

```text
Home

↓

Branches

↓

Choose Branch

↓

Branch Detail

↓

View Doctors

↓

Book Appointment
```

---

# 10. Promotion Flow

```text
Home

↓

Promotion

↓

Promotion Detail

↓

Book Appointment
```

---

# 11. Article Flow

```text
Home

↓

Articles

↓

Category

↓

Article Detail

↓

Related Article

↓

Related Service

↓

Book Appointment
```

---

# 12. FAQ Flow

```text
Home

↓

FAQ

↓

Search

↓

Read Answer

↓

Contact Us
```

---

# 13. Contact Flow

```text
Home

↓

Contact

↓

Choose Method

├── WhatsApp

├── Phone

├── Email

└── Contact Form
```

---

# 14. Authentication Flow

### Existing User

```text
Landing Website

↓

Login

↓

Patient Portal
```

### New User

```text
Landing Website

↓

Register

↓

Email/OTP Verification

↓

Login

↓

Patient Portal
```

---

# 15. Download App Flow

```text
Landing Website

↓

Download App

↓

Google Play

atau

↓

App Store
```

---

# 16. Conversion Funnel

Target utama Landing Website adalah mengubah pengunjung menjadi pasien.

```text
Visitor

↓

Landing Website

↓

View Service

↓

View Doctor

↓

Book Appointment

↓

Register

↓

Patient Portal

↓

Completed Appointment
```

---

# 17. Call-To-Action (CTA)

## Home

Primary CTA

* Book Appointment

Secondary CTA

* Download App

---

## Service Detail

Primary

* Find Doctor

Secondary

* Book Now

---

## Doctor Detail

Primary

* Book Appointment

Secondary

* View Schedule

---

## Branch Detail

Primary

* Visit Branch

Secondary

* Contact Branch

---

## Article Detail

Primary

* Book Consultation

Secondary

* Related Service

---

## Contact

Primary

* WhatsApp

Secondary

* Contact Form

---

# 18. Error Flow

404

↓

Back Home

atau

Search Website

---

500

↓

Retry

↓

Contact Support

---

# 19. Empty State Flow

Jika tidak ada hasil pencarian:

Search

↓

No Result

↓

Suggestion

↓

Popular Service

↓

Popular Doctor

---

# 20. Analytics Events

Setiap CTA harus menghasilkan event.

| Event                  | Description         |
| ---------------------- | ------------------- |
| page_view              | Halaman dibuka      |
| click_book_appointment | Klik tombol booking |
| click_download_app     | Klik unduh aplikasi |
| click_call             | Klik nomor telepon  |
| click_whatsapp         | Klik WhatsApp       |
| search_doctor          | Mencari dokter      |
| search_service         | Mencari layanan     |
| search_branch          | Mencari cabang      |
| login_click            | Klik Login          |
| register_click         | Klik Register       |

---

# 21. UX Principles

Landing Website harus:

* Memiliki maksimal 3 klik menuju halaman tujuan.
* CTA selalu terlihat pada setiap halaman.
* Tidak ada dead-end page.
* Semua halaman memiliki navigasi kembali.
* Selalu tersedia akses menuju booking appointment.

---

# 22. Acceptance Criteria

* Seluruh flow telah tervalidasi.
* Tidak ada halaman yang terisolasi.
* Semua CTA mengarah ke tujuan yang benar.
* Flow dapat diterjemahkan menjadi wireframe tanpa perubahan logika.
* Seluruh event analytics telah didefinisikan.
* Siap digunakan sebagai dasar desain UI dan implementasi Next.js.
