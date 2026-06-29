# 05 - Section Header

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** Section Header

**Document:** `05-Components/01-Layout/05-Section-Header.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team

---

# 1. Overview

Section Header merupakan komponen yang digunakan sebagai pembuka setiap section pada Landing Website.

Komponen ini bertugas memberikan identitas yang jelas terhadap isi section sehingga pengguna dapat memahami struktur halaman dengan cepat.

Section Header harus memiliki desain yang konsisten pada seluruh website.

---

# 2. Objectives

Section Header bertujuan untuk:

- Memberikan identitas pada setiap section.
- Membantu pengguna melakukan scanning halaman.
- Menjaga konsistensi visual.
- Mendukung SEO dengan struktur heading yang benar.
- Menjadi komponen reusable.

---

# 3. User Stories

### Visitor

Sebagai pengunjung,

Saya ingin mengetahui bagian halaman yang sedang saya lihat,

Sehingga saya dapat memahami isi website dengan lebih mudah.

---

Sebagai pasien,

Saya ingin menemukan informasi dokter, layanan, promo maupun artikel dengan cepat.

---

# 4. Functional Requirements

Section Header harus mendukung:

- Badge (Optional)
- Title
- Subtitle
- Description
- CTA Button (Optional)
- Alignment
- Divider (Optional)
- Background Variant

---

# 5. Component Anatomy

```
Badge

Title

Subtitle

Description

CTA
```

Desktop

```
────────────────────────────────────────

OUR SERVICES

Layanan Klinik Kami

Kami menyediakan berbagai layanan kesehatan
untuk seluruh keluarga.

[Lihat Semua]

────────────────────────────────────────
```

---

# 6. Component Structure

```
Section Header

├── Badge
├── Title
├── Subtitle
├── Description
├── CTA
└── Divider
```

---

# 7. Variants

## Default

Title

Description

---

## Center

Seluruh konten berada di tengah.

Digunakan pada Homepage.

---

## Left

Konten rata kiri.

Digunakan pada halaman detail.

---

## CTA

Memiliki tombol aksi.

Contoh

```
Lihat Semua
```

---

## Minimal

Hanya Title.

---

## Highlight

Menggunakan Background.

---

# 8. Content Specification

## Badge

Opsional.

Contoh

```
OUR SERVICES

WHY CHOOSE US

OUR DOCTORS
```

---

## Title

Maksimal

```
2 Baris
```

---

## Subtitle

Opsional.

---

## Description

Maksimal

```
3 Baris
```

---

## CTA

Opsional.

Contoh

```
Lihat Semua

Selengkapnya

Explore
```

---

# 9. Layout Specification

Max Width

```
720 px
```

Padding Top

```
64 px
```

Padding Bottom

```
32 px
```

Gap

```
16 px
```

Alignment

- Left
- Center

---

# 10. Typography

Badge

Label Medium

12 px

Uppercase

Letter Spacing

2%

---

Title

Display Small

40 px

Bold

---

Subtitle

Title Medium

20 px

---

Description

Body Large

18 px

---

CTA

Button Medium

Mengikuti Typography Foundation.

---

# 11. Color

Menggunakan Theme Token.

Badge

Primary 600

Title

Text Primary

Subtitle

Text Secondary

Description

Text Secondary

CTA

Primary

Divider

Border Primary

---

# 12. Icons

CTA dapat menggunakan:

- Arrow Right
- Chevron Right

Ukuran

```
20 px
```

---

# 13. Responsive Behaviour

## Desktop

Title maksimal

2 baris.

---

## Tablet

Font menyesuaikan.

---

## Mobile

Title maksimal

3 baris.

CTA berada di bawah Description.

---

# 14. Accessibility

Gunakan semantic heading.

```
<section>

<h2>

<p>

<button>
```

Homepage:

```
Hero

↓

H1

↓

Section Header

↓

H2
```

Tidak diperbolehkan menggunakan lebih dari satu H1.

---

# 15. Interaction

CTA

Hover

↓

Primary Hover

↓

Click

↓

Navigate

---

# 16. Motion

Hover CTA

150 ms

Fade In

250 ms

Scroll Reveal

300 ms

Mengikuti Motion Foundation.

---

# 17. CMS Configuration

Marketing dapat mengubah:

- Badge
- Title
- Subtitle
- Description
- CTA Text
- CTA Link
- Alignment
- Theme Variant

---

# 18. SEO Consideration

Gunakan struktur heading yang benar.

```
Hero

↓

H1

↓

Section Header

↓

H2

↓

Card

↓

H3
```

Title harus menggunakan:

```
<h2>
```

---

# 19. Performance

- Tidak menggunakan image.
- Tidak menyebabkan CLS.
- Render cepat.
- SEO Friendly.

---

# 20. Analytics Event

| Event | Trigger |
|--------|---------|
| section_header_cta | Klik CTA |
| section_view | Section tampil |

---

# 21. Developer Notes

## Next.js

Gunakan:

- section
- h2
- p
- Button Component

Layout menggunakan Flex.

---

## Flutter

Gunakan:

- Column
- Text
- ElevatedButton

Buat reusable widget.

---

# 22. Props

| Property | Type | Required | Description |
|-----------|------|----------|-------------|
| badge | string | No | Badge kecil di atas judul |
| title | string | Yes | Judul section |
| subtitle | string | No | Subjudul |
| description | string | No | Penjelasan singkat |
| alignment | left \| center | Yes | Posisi konten |
| showCTA | boolean | No | Menampilkan CTA |
| ctaText | string | No | Teks tombol |
| ctaLink | string | No | Link tujuan |
| divider | boolean | No | Menampilkan garis bawah |

---

# 23. Design Tokens

Menggunakan token berikut:

```
color.text.primary

color.text.secondary

color.primary

spacing.16

spacing.24

spacing.32

radius.md

typography.display.sm

typography.body.lg
```

---

# 24. Acceptance Criteria

- Title tampil sesuai desain.
- Description maksimal 3 baris.
- CTA bekerja.
- Responsive.
- Theme Support.
- SEO Friendly.
- Accessibility terpenuhi.
- Reusable.
- Tidak menggunakan hardcoded style.

---

# 25. QA Checklist

□ Title tampil benar

□ Badge tampil sesuai CMS

□ CTA menuju halaman benar

□ Responsive Desktop

□ Responsive Tablet

□ Responsive Mobile

□ H2 hanya digunakan untuk judul section

□ Tidak ada overflow

□ Dark Theme berjalan

□ Analytics terkirim

---

# 26. Future Enhancement

## Version 1.1

- Animated Divider
- Gradient Badge
- Icon Badge
- Breadcrumb Integration

---

## Version 2.0

- AI Generated Heading
- Dynamic Section Theme
- Multi Language
- Dynamic CTA
