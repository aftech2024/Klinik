# 03 - Announcement Bar

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** Announcement Bar

**Document:** `05-Components/01-Layout/03-Announcement-Bar.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team, Marketing Team

---

# 1. Overview

Announcement Bar merupakan komponen yang digunakan untuk menampilkan informasi penting kepada seluruh pengunjung website.

Announcement Bar berada di bagian paling atas halaman (di atas Topbar atau Navbar) dan memiliki prioritas visual tertinggi.

Komponen ini bersifat dinamis dan seluruh kontennya dikontrol melalui CMS.

---

# 2. Objectives

Announcement Bar bertujuan untuk:

- Menampilkan promo klinik.
- Memberikan informasi penting.
- Mengumumkan perubahan jam operasional.
- Menampilkan informasi maintenance.
- Memberikan notifikasi layanan baru.
- Menampilkan emergency announcement.

---

# 3. User Stories

### Visitor

Sebagai pengunjung,

Saya ingin mengetahui promo terbaru,

Sehingga saya tidak melewatkan penawaran menarik.

---

Sebagai pasien,

Saya ingin mengetahui perubahan jadwal operasional,

Sehingga saya tidak datang pada waktu yang salah.

---

Sebagai pasien,

Saya ingin mengetahui apabila website sedang mengalami maintenance,

Sehingga saya memahami apabila terdapat gangguan layanan.

---

# 4. Functional Requirements

Announcement Bar harus mendukung:

- Text Announcement
- CTA Button
- Link
- Close Button
- Auto Hide
- Schedule Publish
- Priority Level
- Background Theme
- Icon
- Multi Branch Announcement

---

# 5. Component Anatomy

Desktop

```
+--------------------------------------------------------------------------+

📢 Promo Medical Checkup Diskon 30%

[Lihat Promo]

✕

+--------------------------------------------------------------------------+
```

---

Mobile

```
📢 Promo Medical Checkup

[Lihat]

✕

```

---

# 6. Announcement Type

## Promotion

Contoh

```
Diskon Medical Checkup 30%
```

---

## Information

Contoh

```
Cabang Jakarta Selatan tutup sementara.
```

---

## Warning

Contoh

```
Website sedang maintenance pukul 23.00 WIB.
```

---

## Success

Contoh

```
Booking Online Kini Tersedia.
```

---

## Emergency

Contoh

```
Layanan IGD 24 Jam Tetap Beroperasi.
```

---

# 7. Priority Level

| Priority | Description |
|-----------|-------------|
| Low | Informasi biasa |
| Medium | Promo |
| High | Informasi penting |
| Critical | Emergency |

Priority menentukan urutan apabila terdapat lebih dari satu announcement aktif.

---

# 8. Variants

## Static

Informasi tetap.

---

## Dismissible

Pengguna dapat menutup Announcement Bar.

---

## Auto Sliding

Menampilkan beberapa announcement secara bergantian.

---

## Campaign

Digunakan pada event tertentu.

Contoh:

- Hari Kemerdekaan
- Ramadan
- Natal
- Tahun Baru

---

## Emergency

Menggunakan warna khusus.

Tidak dapat ditutup.

---

# 9. States

### Default

Announcement tampil.

---

### Hover

CTA berubah warna.

---

### Active

CTA sedang ditekan.

---

### Closed

Announcement disembunyikan.

---

### Expired

Tidak ditampilkan.

---

# 10. Layout Specification

Height

```
48 px
```

Desktop

```
Full Width
```

Container

```
1280 px
```

Padding

```
16 px
```

Gap

```
12 px
```

Text Alignment

Center

---

# 11. Typography

Announcement

Body Small

Weight

500

CTA

Button Small

Mengikuti Typography Foundation.

---

# 12. Color

Menggunakan Semantic Color.

| Type | Background | Text |
|------|------------|------|
| Info | Primary 50 | Primary 700 |
| Success | Green 100 | Green 700 |
| Warning | Yellow 100 | Yellow 800 |
| Danger | Red 100 | Red 700 |
| Campaign | Brand Primary | White |

Seluruh warna mengikuti Theme Token.

---

# 13. Icons

Jenis icon:

- Info
- Megaphone
- Warning
- Check Circle
- Alert Triangle
- Calendar

Ukuran

```
20 px
```

---

# 14. CTA Button

CTA bersifat opsional.

Contoh

```
Lihat Promo

Booking Sekarang

Pelajari Selengkapnya
```

---

# 15. Responsive Behaviour

## Desktop

- Full Announcement
- CTA
- Close Button

---

## Tablet

Text dipersingkat.

CTA tetap tampil.

---

## Mobile

Text maksimal 1 baris.

CTA menggunakan ukuran kecil.

Close Button tetap tersedia.

---

# 16. Accessibility

Announcement Bar harus mendukung:

- Screen Reader
- Keyboard Navigation
- Focus Indicator
- ARIA Role

Gunakan

```
role="status"
```

atau

```
role="alert"
```

sesuai jenis announcement.

---

# 17. CMS Configuration

Marketing dapat mengatur:

- Status Aktif
- Judul Announcement
- Isi Announcement
- Icon
- CTA
- Link
- Warna
- Priority
- Publish Date
- Expired Date
- Branch Target
- Dismissible
- Auto Slide
- Theme

Tanpa perlu melakukan deployment ulang.

---

# 18. Multi Branch Support

Announcement dapat ditampilkan berdasarkan:

- Semua Cabang
- Cabang Tertentu
- Kota
- Provinsi
- Regional

Contoh

```
Cabang Bekasi Libur Hari Minggu.
```

Hanya tampil pada pengunjung yang memilih Cabang Bekasi.

---

# 19. Interaction Flow

```
Website Load

↓

Announcement Active?

↓

Ya

↓

Render Announcement

↓

Klik CTA

↓

Redirect

↓

Analytics

↓

Selesai
```

---

# 20. Analytics Event

Event yang dicatat:

| Event | Trigger |
|--------|---------|
| announcement_view | Announcement tampil |
| announcement_click | Klik CTA |
| announcement_close | Klik Close |
| announcement_expired | Announcement berakhir |

---

# 21. SEO Consideration

Announcement tidak menjadi Heading.

Gunakan

```
<div>

<span>

<a>
```

Jangan menggunakan

```
<h1>
```

Announcement tidak boleh mengganggu struktur SEO halaman.

---

# 22. Performance

- Lazy Load apabila diperlukan.
- Maksimal 1 Announcement aktif secara bersamaan.
- Ukuran payload kecil.
- Tidak menyebabkan Layout Shift.

---

# 23. Developer Notes

## Next.js

Gunakan:

- React Context
- CMS API
- Framer Motion
- Tailwind CSS

State:

```
open

closed

expired
```

---

## Flutter

Announcement dapat digunakan kembali sebagai:

- Banner
- Notification Card
- Information Banner

---

# 24. Acceptance Criteria

- Announcement tampil sesuai jadwal.
- CTA berfungsi.
- Close Button bekerja.
- Responsive pada semua perangkat.
- Mendukung Theme System.
- Mendukung Multi Branch.
- Tidak menyebabkan CLS (Cumulative Layout Shift).
- Memenuhi WCAG 2.2 AA.

---

# 25. QA Checklist

- Announcement tampil sesuai CMS.
- CTA menuju halaman yang benar.
- Close Button menyembunyikan banner.
- Banner hilang saat expired.
- Priority berjalan benar.
- Warna sesuai Theme.
- Responsive pada Desktop, Tablet, Mobile.
- Screen Reader membaca announcement.
- Keyboard Navigation berfungsi.
- Analytics terkirim.

---

# 26. Future Enhancement

## Version 1.1

- Countdown Timer
- Video Announcement
- Image Banner
- Carousel Announcement

---

## Version 2.0

- Personalized Announcement
- AI Campaign
- Geolocation Announcement
- Dynamic Queue Information
- Live Emergency Notification
