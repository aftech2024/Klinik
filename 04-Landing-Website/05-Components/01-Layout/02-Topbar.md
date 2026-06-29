# 02 - Topbar

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** Topbar

**Document:** `05-Components/01-Layout/02-Topbar.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team

---

# 1. Overview

Topbar merupakan komponen informasi sekunder yang ditampilkan di atas Navbar.

Topbar digunakan untuk menyampaikan informasi penting secara cepat kepada pengguna tanpa mengganggu navigasi utama.

Topbar bersifat **opsional** dan dapat diaktifkan atau dinonaktifkan melalui konfigurasi CMS.

---

# 2. Objectives

Topbar bertujuan untuk:

- Menampilkan informasi kontak.
- Menampilkan jam operasional.
- Menampilkan informasi cabang.
- Menampilkan shortcut ke media sosial.
- Menampilkan pilihan bahasa (Future).
- Menampilkan shortcut menuju Portal Pasien.

---

# 3. User Stories

### Visitor

Sebagai pengunjung,

Saya ingin melihat nomor telepon klinik,

Sehingga saya dapat menghubungi klinik dengan cepat.

---

Sebagai pasien,

Saya ingin mengetahui jam operasional,

Sehingga saya dapat datang pada waktu yang tepat.

---

Sebagai pengguna mobile,

Saya ingin informasi penting tetap mudah diakses,

Tanpa mengganggu navigasi utama.

---

# 4. Functional Requirements

Topbar dapat berisi:

- Nomor Telepon
- Email
- Jam Operasional
- Lokasi Pusat
- Social Media
- Patient Portal
- Language Switcher (Future)

Seluruh item dapat dikonfigurasi melalui CMS.

---

# 5. Component Anatomy

Desktop

```
+-----------------------------------------------------------------------+

📞 (021) 12345678

|

✉ info@clinic.com

|

🕒 Senin - Minggu 08.00 - 21.00

|

Facebook Instagram

|

Patient Portal

+-----------------------------------------------------------------------+
```

---

Mobile

```
📞 Call

|

Patient Portal
```

atau

Topbar dapat disembunyikan.

---

# 6. Information Priority

Prioritas informasi:

1. Nomor Telepon
2. Jam Operasional
3. Email
4. Patient Portal
5. Social Media
6. Bahasa

---

# 7. Variants

## Default

Background Primary

---

## Secondary

Background Neutral

---

## Transparent

Digunakan pada Hero tertentu.

---

## Hidden

Tidak ditampilkan.

---

## Campaign

Digunakan saat promosi.

Background mengikuti Campaign Theme.

---

# 8. States

### Default

Informasi tampil normal.

---

### Hover

Link berubah warna.

---

### Active

Shortcut aktif.

---

### Hidden

Topbar tidak dirender.

---

# 9. Layout Specification

Height

```
40 px
```

Desktop

```
Full Width
```

Container

```
1280 px
```

Horizontal Padding

```
24 px
```

Gap

```
16 px
```

Vertical Alignment

```
Center
```

---

# 10. Typography

Font

Body Small

Ukuran

14 px

Weight

500

Mengikuti Typography Foundation.

---

# 11. Color

Background

```
Primary 700
```

Text

```
White
```

Hover

```
Primary 200
```

Border

Tidak digunakan.

Menggunakan Theme Token.

---

# 12. Icons

Gunakan icon berikut:

- Phone
- Mail
- Clock
- Map Pin
- Facebook
- Instagram
- Globe

Ukuran:

20 px

Mengikuti Icon Foundation.

---

# 13. Responsive Behaviour

## Desktop

Semua informasi tampil.

---

## Tablet

Beberapa informasi disembunyikan jika ruang tidak cukup.

---

## Mobile

Prioritas:

- Telepon
- Patient Portal

Informasi lain disembunyikan.

---

# 14. Accessibility

Topbar harus mendukung:

- Keyboard Navigation
- Screen Reader
- Focus Ring
- Minimum Touch Target 44 × 44 px

Nomor telepon menggunakan:

```
tel:
```

Email menggunakan:

```
mailto:
```

---

# 15. Interaction

Klik Nomor

↓

Dial Phone

---

Klik Email

↓

Open Email Client

---

Klik Patient Portal

↓

Redirect ke Login

---

Klik Social Media

↓

Open New Tab

---

# 16. Animation

Hover

150 ms

Fade

200 ms

Tidak menggunakan animasi kompleks.

---

# 17. CMS Configuration

Field yang dapat diubah melalui CMS:

- Nomor Telepon
- Email
- Jam Operasional
- Link Social Media
- Portal Pasien
- Status Aktif
- Warna Background (Opsional)

---

# 18. SEO Consideration

Gunakan semantic HTML.

```
<header>

<div>

<a href="tel:">

<a href="mailto:">
```

Link sosial menggunakan:

```
rel="noopener noreferrer"
```

---

# 19. Analytics Event

Event yang dicatat:

| Event | Trigger |
|--------|---------|
| topbar_phone_click | Klik Nomor |
| topbar_email_click | Klik Email |
| topbar_patient_portal | Klik Portal |
| topbar_social_click | Klik Social |

---

# 20. Developer Notes

## Next.js

Gunakan:

- Header
- Flex Layout
- Tailwind CSS
- Lucide Icon

Gunakan konfigurasi CMS untuk mengatur visibilitas item.

---

## Flutter

Topbar tidak digunakan secara langsung.

Informasi serupa dapat ditampilkan pada:

- Drawer
- Profile
- About

---

# 21. Acceptance Criteria

- Informasi tampil sesuai konfigurasi.
- Nomor telepon dapat ditekan.
- Email membuka email client.
- Portal mengarah ke halaman login.
- Social Media membuka tab baru.
- Responsive pada Desktop, Tablet, dan Mobile.
- Mengikuti Theme System.
- Memenuhi WCAG 2.2 AA.

---

# 22. QA Checklist

- Nomor telepon benar.
- Email benar.
- Jam operasional sesuai CMS.
- Semua link berfungsi.
- Hover berjalan normal.
- Responsive pada semua breakpoint.
- Focus keyboard terlihat.
- Screen reader membaca seluruh informasi.
- Tidak terjadi overflow pada layar kecil.

---

# 23. Future Enhancement

## Version 1.1

- Multi Language
- Currency Selector
- Branch Selector
- Emergency Hotline

## Version 2.0

- Dynamic Notification
- Weather Alert
- Holiday Schedule
- Live Queue Information
