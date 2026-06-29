# 07 - CTA (Call To Action)

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** CTA (Call To Action)

**Document:** `05-Components/01-Layout/07-CTA.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team, Marketing Team

---

# 1. Overview

CTA (Call To Action) merupakan komponen yang digunakan untuk mengajak pengguna melakukan tindakan tertentu setelah membaca suatu informasi.

CTA merupakan salah satu komponen dengan tingkat konversi tertinggi pada Landing Website dan harus dirancang agar menarik perhatian tanpa mengganggu pengalaman pengguna.

CTA biasanya ditempatkan setelah section utama seperti Services, Doctors, Promotions, Articles, atau sebelum Footer.

---

# 2. Objectives

CTA bertujuan untuk:

- Meningkatkan konversi booking.
- Mengarahkan pengguna menuju layanan utama.
- Mendorong pengguna menghubungi klinik.
- Mengarahkan pengguna mengunduh aplikasi.
- Menampilkan promosi atau kampanye tertentu.

---

# 3. User Stories

### Visitor

Sebagai pengunjung,

Saya ingin dapat langsung melakukan booking setelah membaca informasi,

Sehingga saya tidak perlu mencari tombol booking.

---

Sebagai calon pasien,

Saya ingin memiliki beberapa pilihan tindakan,

Sehingga saya dapat memilih antara booking, menghubungi klinik, atau melihat layanan.

---

# 4. Functional Requirements

CTA harus mendukung:

- Badge (Optional)
- Heading
- Description
- Primary Button
- Secondary Button
- Background Image
- Illustration
- Theme Variant
- Responsive Layout

---

# 5. Component Anatomy

```
+---------------------------------------------------------+

Badge

Heading

Description

[ Primary CTA ]

[ Secondary CTA ]

Illustration

+---------------------------------------------------------+
```

---

# 6. CTA Variants

## Primary CTA

Digunakan untuk:

- Booking Appointment

---

## Contact CTA

Digunakan untuk:

- Hubungi Klinik

---

## Download CTA

Digunakan untuk:

- Download Mobile Apps

---

## Promotion CTA

Digunakan untuk:

- Promo Medical Checkup
- Promo Vaksin

---

## Emergency CTA

Digunakan untuk:

- Hubungi Ambulans
- IGD 24 Jam

---

# 7. Content Specification

## Badge

Opsional.

Contoh:

```
PROMO

NEW

SPECIAL OFFER
```

---

## Heading

Maksimal:

2 baris

Contoh:

```
Siap Memulai Perjalanan
Menuju Hidup Lebih Sehat?
```

---

## Description

Maksimal:

3 baris

Contoh:

```
Jadwalkan konsultasi dengan dokter pilihan Anda hanya dalam beberapa menit.
```

---

## Primary Button

Contoh:

```
Booking Sekarang
```

---

## Secondary Button

Contoh:

```
Hubungi Kami

Lihat Dokter

Download Aplikasi
```

---

# 8. Layout Variants

## Center

Konten berada di tengah.

---

## Left Image

Konten di kiri.

Illustration di kanan.

---

## Right Image

Illustration di kiri.

Konten di kanan.

---

## Full Banner

Background penuh.

---

## Card CTA

Menggunakan Card.

---

# 9. Layout Specification

Container

1280 px

Padding

80 px

Gap

32 px

Border Radius

24 px

Minimum Height

320 px

---

# 10. Typography

Heading

Display Medium

Bold

Description

Body Large

Button

Mengikuti Button Component

---

# 11. Color

Menggunakan Theme Token.

Background

Primary

Surface

Gradient

Heading

White

Description

White / Neutral

Button

Mengikuti Button Component.

---

# 12. Illustration

CTA mendukung:

- SVG
- PNG
- WebP
- Lottie

Ukuran maksimum:

480 × 480 px

---

# 13. Responsive Behaviour

## Desktop

2 Column

Content

+

Illustration

---

## Tablet

Illustration diperkecil.

---

## Mobile

Single Column

Heading

↓

Description

↓

Button

↓

Illustration

---

# 14. Accessibility

CTA harus mendukung:

- Keyboard Navigation
- Screen Reader
- Focus Ring
- Semantic HTML

Gunakan:

```
<section>

<h2>

<p>

<button>
```

---

# 15. Interaction

Primary Button

↓

Booking

---

Secondary Button

↓

Navigate

---

# 16. Motion

Hover

150 ms

Fade In

250 ms

Button Ripple

200 ms

Mengikuti Motion Foundation.

---

# 17. CMS Configuration

Marketing dapat mengubah:

- Heading
- Description
- Badge
- Background
- Illustration
- Button Text
- Button Link
- Theme
- Publish Date
- Expired Date

---

# 18. SEO Consideration

Gunakan:

<section>

<h2>

<p>

Button menggunakan Link apabila menuju halaman lain.

---

# 19. Performance

- Lazy Load Illustration
- WebP Image
- Tidak menyebabkan CLS
- Responsive Image

---

# 20. Analytics Event

| Event | Trigger |
|---------|---------|
| cta_view | CTA tampil |
| cta_primary_click | Klik Primary CTA |
| cta_secondary_click | Klik Secondary CTA |

---

# 21. Props

| Property | Type | Required |
|----------|------|----------|
| badge | string | No |
| title | string | Yes |
| description | string | Yes |
| primaryButton | object | Yes |
| secondaryButton | object | No |
| image | string | No |
| variant | string | Yes |
| alignment | string | No |
| background | string | No |

---

# 22. Developer Notes

## Next.js

Gunakan:

- Container
- Section
- Button Component
- Next Image
- Tailwind CSS

CTA tidak boleh menggunakan Button hardcoded.

Seluruh Button harus menggunakan Button Component.

---

## Flutter

Gunakan:

- Card
- Column
- Row
- ElevatedButton
- FilledButton

CTA menjadi reusable widget.

---

# 23. Acceptance Criteria

- CTA tampil sesuai desain.
- Heading maksimal 2 baris.
- Description maksimal 3 baris.
- Responsive.
- Button berfungsi.
- Theme Support.
- CMS Support.
- Accessibility terpenuhi.

---

# 24. QA Checklist

□ CTA tampil pada seluruh halaman.

□ Heading sesuai CMS.

□ Button mengarah ke halaman benar.

□ Responsive Desktop.

□ Responsive Tablet.

□ Responsive Mobile.

□ Analytics terkirim.

□ Tidak terjadi overflow.

□ Dark Theme berjalan.

---

# 25. Future Enhancement

## Version 1.1

- Countdown CTA

- Floating CTA

- Video CTA

- Dynamic Campaign

---

## Version 2.0

- AI CTA Recommendation

- Personalized CTA

- Branch Specific CTA

- Dynamic CTA berdasarkan perilaku pengguna
