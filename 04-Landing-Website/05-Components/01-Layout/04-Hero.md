# 04 - Hero

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** Hero

**Document:** `05-Components/01-Layout/04-Hero.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team, Marketing Team

---

# 1. Overview

Hero merupakan komponen utama yang berada pada bagian paling atas halaman (Above the Fold) setelah Navbar.

Hero menjadi area pertama yang dilihat oleh pengguna dan memiliki peran penting dalam menyampaikan nilai utama klinik, membangun kepercayaan, serta mengarahkan pengguna menuju aksi utama (Primary Call To Action).

Hero harus mampu menarik perhatian dalam waktu kurang dari 5 detik.

---

# 2. Objectives

Hero bertujuan untuk:

- Menampilkan identitas klinik.
- Menjelaskan value proposition.
- Meningkatkan konversi booking.
- Mengarahkan pengguna ke layanan utama.
- Menampilkan promosi utama.
- Meningkatkan kepercayaan pengguna.

---

# 3. User Stories

### Visitor

Sebagai pengunjung,

Saya ingin langsung memahami layanan utama klinik,

Sehingga saya mengetahui apakah klinik sesuai dengan kebutuhan saya.

---

Sebagai calon pasien,

Saya ingin langsung melakukan Booking Appointment,

Sehingga saya tidak perlu mencari tombol booking.

---

Sebagai pasien,

Saya ingin dapat mencari dokter atau layanan secara cepat.

---

# 4. Functional Requirements

Hero wajib mendukung:

- Headline
- Subheadline
- Primary CTA
- Secondary CTA
- Hero Image / Illustration
- Background
- Badge (Optional)
- Search Component (Optional)
- Statistics (Optional)
- Trust Badge (Optional)

---

# 5. Component Anatomy

Desktop

```
+---------------------------------------------------------------+

Badge

Headline

Subheadline

[Booking Sekarang]

[Lihat Layanan]

Doctor Image

+---------------------------------------------------------------+
```

---

Mobile

```
Headline

Subheadline

Doctor Image

Booking

Layanan
```

---

# 6. Hero Content

## Headline

Maksimal

```
2 Baris
```

Contoh

```
Pelayanan Kesehatan Terbaik
Untuk Keluarga Anda
```

---

## Subheadline

Maksimal

```
3 Baris
```

Menjelaskan layanan utama klinik.

---

## Primary CTA

Contoh

```
Booking Sekarang
```

---

## Secondary CTA

Contoh

```
Lihat Layanan
```

---

## Hero Image

Berupa:

- Foto Dokter
- Ilustrasi
- Foto Klinik
- Video (Future)

---

# 7. Variants

## Default

Headline + Image

---

## Search Hero

Headline

Search Doctor

CTA

---

## Promotion Hero

Background Campaign

Countdown

CTA

---

## Branch Hero

Cabang

Maps

Alamat

---

## Video Hero

Video Background

Future Version

---

# 8. States

### Default

Hero tampil normal.

---

### Loading

Skeleton tampil.

---

### Error

Menggunakan Hero Default.

---

### Empty

Hero menggunakan placeholder.

---

# 9. Layout Specification

Height Desktop

```
720 px
```

Tablet

```
600 px
```

Mobile

```
Auto Height
```

Container

```
1280 px
```

Padding

```
80 px
```

Gap

```
48 px
```

---

# 10. Grid Layout

Desktop

```
6 Columns

Content

+

6 Columns

Image
```

---

Tablet

```
12 Columns
```

---

Mobile

```
Single Column
```

---

# 11. Typography

Headline

Display Large

Weight

700

---

Subheadline

Body Large

---

CTA

Button Large

Mengikuti Typography Foundation.

---

# 12. Color

Menggunakan Theme Token.

Background

Surface Primary

Headline

Text Primary

Subheadline

Text Secondary

CTA

Primary Color

---

# 13. Illustration

Hero mendukung:

- PNG
- SVG
- WebP
- Lottie (Optional)

Ukuran maksimum

```
600 × 600 px
```

---

# 14. Trust Indicators

Hero dapat menampilkan:

- 11 Cabang Klinik
- 50+ Dokter
- 25.000+ Pasien
- BPJS Partner
- ISO Certification

Bersifat opsional.

---

# 15. Search Integration

Hero dapat menampilkan:

- Cari Dokter
- Cari Layanan
- Cari Cabang

Search menggunakan komponen Search-Bar.

---

# 16. CTA

Primary

```
Booking Appointment
```

Secondary

```
Lihat Dokter
```

Tertiary (Optional)

```
Download Apps
```

---

# 17. Responsive Behaviour

## Desktop

Image dan Content sejajar.

---

## Tablet

Image diperkecil.

---

## Mobile

Layout berubah menjadi:

Content

↓

Image

↓

CTA

↓

Search

---

# 18. Accessibility

Hero harus mendukung:

- Keyboard Navigation
- Focus Ring
- Screen Reader
- Semantic HTML

Gunakan:

```
<section>

<h1>

<p>

<button>
```

Hanya satu elemen `<h1>` pada halaman.

---

# 19. Animation

Animation menggunakan Motion Foundation.

Jenis animasi:

- Fade In
- Slide Up
- Image Parallax (Opsional)
- CTA Hover
- Counter Animation

Durasi maksimum

```
300 ms
```

---

# 20. CMS Configuration

Marketing dapat mengubah:

- Headline
- Subheadline
- CTA
- Background
- Hero Image
- Badge
- Trust Indicator
- Search Visibility
- Publish Date
- Expired Date

Tanpa deployment.

---

# 21. Multi Branch Support

Hero dapat berubah sesuai cabang.

Contoh:

Cabang Bekasi

↓

Hero menampilkan:

- Dokter Bekasi
- Promo Bekasi
- Foto Cabang Bekasi

---

# 22. SEO Consideration

Gunakan:

```
<section>

<h1>

<p>

<img>

button
```

Hero wajib memiliki:

- Alt Image
- Lazy Loading
- Structured Heading

---

# 23. Performance

Hero harus memenuhi:

- LCP < 2.5 detik
- CLS < 0.1
- Image WebP
- Lazy Loading
- Responsive Image

---

# 24. Analytics Event

Event yang dicatat:

| Event | Trigger |
|--------|---------|
| hero_view | Hero tampil |
| hero_cta_click | Klik Booking |
| hero_secondary_click | Klik Layanan |
| hero_search | Cari Dokter |
| hero_scroll | Scroll Hero |

---

# 25. Developer Notes

## Next.js

Gunakan:

- next/image
- Tailwind CSS
- Framer Motion
- Dynamic Content dari CMS

Gunakan responsive image.

---

## Flutter

Hero menjadi reusable widget.

Gunakan:

- Column
- Stack
- Expanded
- CachedNetworkImage

---

# 26. Acceptance Criteria

- Hero tampil pada seluruh perangkat.
- Headline mudah dibaca.
- CTA berfungsi.
- Search berfungsi (jika aktif).
- Responsive.
- Theme Support.
- CMS Support.
- Multi Branch Support.
- WCAG 2.2 AA.

---

# 27. QA Checklist

- Headline tampil benar.
- CTA mengarah ke halaman yang benar.
- Image tidak pecah.
- Responsive.
- Search muncul sesuai konfigurasi.
- Hero tidak mengalami layout shift.
- Dark Mode berjalan.
- Screen Reader membaca Hero dengan benar.
- Analytics terkirim.

---

# 28. Future Enhancement

## Version 1.1

- Video Background
- AI Recommendation Banner
- Dynamic Weather Banner
- Floating Search

---

## Version 2.0

- Personalized Hero
- Branch Detection
- AI Doctor Recommendation
- Interactive Hero
- 3D Illustration
