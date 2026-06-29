# 08 - Breadcrumb

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** Breadcrumb

**Document:** `05-Components/01-Layout/08-Breadcrumb.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team, SEO Team

---

# 1. Overview

Breadcrumb merupakan komponen navigasi sekunder yang menampilkan posisi halaman saat ini dalam struktur website.

Komponen ini membantu pengguna memahami lokasi mereka di dalam website serta memudahkan navigasi ke halaman sebelumnya.

Breadcrumb juga berperan penting dalam Search Engine Optimization (SEO) melalui implementasi Schema.org BreadcrumbList.

---

# 2. Objectives

Breadcrumb bertujuan untuk:

- Menunjukkan posisi halaman saat ini.
- Mempermudah navigasi ke halaman sebelumnya.
- Mengurangi tingkat kebingungan pengguna.
- Mendukung struktur SEO website.
- Menjadi komponen navigasi yang konsisten.

---

# 3. User Stories

### Visitor

Sebagai pengunjung,

Saya ingin mengetahui posisi halaman yang sedang saya buka,

Sehingga saya dapat kembali ke halaman sebelumnya dengan mudah.

---

Sebagai pasien,

Saya ingin berpindah ke halaman kategori tanpa harus menggunakan tombol Back pada browser.

---

# 4. Functional Requirements

Breadcrumb harus mendukung:

- Dynamic Path
- Multiple Level
- Current Page Highlight
- Icon Separator
- Responsive Layout
- Schema.org BreadcrumbList
- Custom Label
- Localization (Future)

---

# 5. Component Anatomy

```
Home

>

Services

>

General Check Up
```

---

Dengan icon

```
🏠 Home

>

Services

>

Medical Check Up
```

---

# 6. Variants

## Default

Home > Current Page

---

## Multi Level

Home

>

Services

>

Medical Checkup

>

Package A

---

## Icon

Menggunakan Home Icon.

---

## Minimal

Tanpa Home Icon.

---

## CMS Generated

Data berasal dari CMS.

---

# 7. Content Specification

Home selalu menjadi item pertama.

Current Page selalu berada di posisi terakhir.

Current Page tidak dapat diklik.

Semua parent page dapat diklik.

---

# 8. Breadcrumb Rules

Gunakan urutan:

```
Home

↓

Category

↓

Sub Category

↓

Current Page
```

Contoh:

```
Home

>

Doctors

>

Cardiology

>

Dr. Ahmad
```

---

# 9. Layout Specification

Height

```
40 px
```

Gap

```
8 px
```

Padding Vertical

```
24 px
```

Alignment

Left

Container

Menggunakan Container Component.

---

# 10. Typography

Font

Body Small

Ukuran

14 px

Weight

500

Current Page

Semibold

Mengikuti Typography Foundation.

---

# 11. Color

Default

Text Secondary

Hover

Primary 600

Current

Text Primary

Separator

Neutral 400

Menggunakan Theme Token.

---

# 12. Icons

Mendukung:

- Home
- Chevron Right
- Slash (Opsional)

Ukuran

16 px

Mengikuti Icon Foundation.

---

# 13. Responsive Behaviour

## Desktop

Seluruh breadcrumb ditampilkan.

---

## Tablet

Breadcrumb dipersingkat apabila terlalu panjang.

---

## Mobile

Gunakan maksimal:

```
Home

>

...

>

Current Page
```

atau gunakan horizontal scroll apabila diperlukan.

---

# 14. Accessibility

Gunakan semantic HTML.

```
<nav aria-label="Breadcrumb">

<ol>

<li>

<a>

<span>
```

Current Page menggunakan:

```
aria-current="page"
```

Breadcrumb harus dapat dinavigasi menggunakan keyboard.

---

# 15. Interaction

Klik Parent

↓

Navigate

↓

Page Load

---

Current Page

↓

Tidak dapat diklik.

---

# 16. Motion

Hover

150 ms

Transition

150 ms

Tidak menggunakan animasi kompleks.

---

# 17. CMS Configuration

Breadcrumb dapat dibuat otomatis berdasarkan:

- Struktur halaman.
- Kategori artikel.
- Cabang klinik.
- Layanan.
- Dokter.

Admin dapat mengubah label melalui CMS apabila diperlukan.

---

# 18. SEO Consideration

Breadcrumb wajib menggunakan:

- Schema.org BreadcrumbList
- JSON-LD atau Microdata

Contoh struktur:

```
Home

↓

Services

↓

Medical Checkup
```

Breadcrumb harus konsisten dengan URL halaman.

---

# 19. Performance

- Tidak menyebabkan Layout Shift.
- Tidak menggunakan JavaScript berat.
- Mendukung Server Side Rendering (SSR).
- Mendukung Static Site Generation (SSG).

---

# 20. Analytics Event

| Event | Trigger |
|---------|---------|
| breadcrumb_click | Klik Parent Breadcrumb |
| breadcrumb_view | Breadcrumb tampil |

---

# 21. Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| items | array | Yes | Daftar breadcrumb |
| separator | string/icon | No | Pemisah |
| showHome | boolean | No | Tampilkan Home |
| homeIcon | boolean | No | Tampilkan icon Home |
| maxItems | number | No | Maksimum item yang ditampilkan |

---

# 22. Developer Notes

## Next.js

Gunakan:

- nav
- ol
- li
- next/link

Implementasikan JSON-LD BreadcrumbList untuk SEO.

---

## Flutter

Gunakan:

- Wrap
- Row
- TextButton
- Icon

Breadcrumb menjadi widget reusable.

---

# 23. Acceptance Criteria

- Breadcrumb tampil pada seluruh halaman selain Homepage.
- Current Page tidak dapat diklik.
- Parent dapat diklik.
- Responsive pada Desktop, Tablet, dan Mobile.
- Menggunakan semantic HTML.
- Mendukung Schema.org BreadcrumbList.
- Memenuhi WCAG 2.2 AA.

---

# 24. QA Checklist

□ Breadcrumb muncul sesuai struktur halaman.

□ Home selalu berada di posisi pertama.

□ Current Page tidak memiliki link.

□ Parent mengarah ke halaman yang benar.

□ Responsive pada seluruh breakpoint.

□ Keyboard Navigation berjalan.

□ Screen Reader membaca breadcrumb.

□ JSON-LD tervalidasi.

□ Tidak terjadi overflow.

---

# 25. Future Enhancement

## Version 1.1

- Animated Breadcrumb
- Icon per Category
- Dynamic Collapse
- Multi Language

---

## Version 2.0

- AI Generated Breadcrumb
- Personalized Navigation
- Branch-aware Breadcrumb
- Smart Navigation History
