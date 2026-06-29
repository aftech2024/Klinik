# Layout Components

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Components → Layout

**Folder:** `05-Components/01-Layout`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team

---

# Overview

Layout Components merupakan kumpulan komponen yang membentuk struktur utama (layout) seluruh halaman Landing Website.

Komponen pada kategori ini digunakan secara konsisten di seluruh website dan menjadi fondasi visual untuk membangun halaman yang mudah dipahami, responsif, dan dapat digunakan kembali.

Layout Components tidak berisi konten bisnis, tetapi menyediakan kerangka halaman yang akan diisi oleh komponen lain seperti Forms, Data Display, dan Navigation.

---

# Objectives

Layout Components dibuat untuk:

- Menyediakan struktur halaman yang konsisten.
- Meningkatkan pengalaman pengguna.
- Mempermudah proses pengembangan.
- Mengurangi duplikasi layout.
- Mendukung responsive design.
- Mendukung accessibility.
- Menjadi fondasi seluruh halaman Landing Website.

---

# Design Principles

Seluruh Layout Components wajib mengikuti prinsip berikut:

- Consistent
- Reusable
- Responsive
- Accessible
- Theme Ready
- Mobile First
- Performance Optimized

---

# Component Architecture

```
Foundation

↓

Layout Components

↓

Business Components

↓

Sections

↓

Pages
```

Layout merupakan lapisan pertama setelah Foundation.

---

# Folder Structure

```
01-Layout/

README.md

01-Navbar.md

02-Topbar.md

03-Announcement-Bar.md

04-Hero.md

05-Section-Header.md

06-Container.md

07-CTA.md

08-Breadcrumb.md

09-Footer.md
```

---

# Component Hierarchy

Landing Website dibangun menggunakan urutan berikut.

```
Announcement Bar (Optional)

↓

Topbar (Optional)

↓

Navbar

↓

Hero

↓

Section

↓

CTA

↓

Footer
```

Pada halaman tertentu dapat ditambahkan:

```
Breadcrumb

↓

Page Content
```

---

# Components

## 01 - Navbar

Navigasi utama website.

Digunakan pada seluruh halaman.

Fungsi:

- Navigasi
- Login
- Register
- Appointment
- Mobile Menu

---

## 02 - Topbar

Menampilkan informasi singkat.

Contoh:

- Nomor Telepon
- Email
- Jam Operasional

Topbar bersifat opsional.

---

## 03 - Announcement Bar

Digunakan untuk:

- Promo
- Event
- Pengumuman
- Informasi penting

Announcement Bar dapat ditutup (dismissible).

---

## 04 - Hero

Bagian pertama yang dilihat pengguna.

Berfungsi untuk:

- Menampilkan headline utama.
- Menampilkan CTA utama.
- Menampilkan ilustrasi.
- Menampilkan pencarian dokter atau layanan.

---

## 05 - Section Header

Digunakan sebagai judul setiap section.

Contoh:

- Layanan
- Dokter
- Cabang
- Promo
- Artikel

---

## 06 - Container

Mengatur:

- Max Width
- Horizontal Padding
- Responsive Width
- Content Alignment

Container mengikuti Grid System.

---

## 07 - CTA

Call To Action.

Digunakan untuk mengajak pengguna melakukan aksi.

Contoh:

- Booking Sekarang
- Hubungi Kami
- Download Aplikasi

---

## 08 - Breadcrumb

Digunakan untuk membantu navigasi.

Tidak digunakan pada Homepage.

---

## 09 - Footer

Bagian penutup website.

Berisi:

- Informasi Klinik
- Menu
- Social Media
- Copyright
- Legal
- Privacy Policy

---

# Foundation Dependency

Seluruh Layout Components wajib menggunakan:

- Color
- Typography
- Spacing
- Radius
- Shadow
- Grid
- Breakpoint
- Icon
- Motion
- Elevation
- Theme
- Accessibility

Tidak diperbolehkan menggunakan style hardcoded.

---

# Responsive Behaviour

## Desktop

- Horizontal Navigation
- Multi Column Layout
- Full Container

---

## Tablet

- Adaptive Navigation
- Responsive Container
- Flexible Grid

---

## Mobile

- Hamburger Menu
- Single Column Layout
- Full Width CTA
- Optimized Touch Area

---

# Accessibility

Seluruh Layout Components harus memenuhi:

- WCAG 2.2 Level AA
- Keyboard Navigation
- Focus Indicator
- Screen Reader Support
- Minimum Touch Target 44 × 44 px
- High Contrast Support

---

# Theme Support

Seluruh Layout Components wajib mendukung:

- Light Theme
- Dark Theme
- High Contrast Theme
- Brand Theme

---

# Animation

Animation hanya digunakan untuk meningkatkan pengalaman pengguna.

Jenis animasi:

- Fade In
- Slide Down
- Hover Transition
- Mobile Menu Animation

Animation tidak boleh mengganggu usability.

---

# Technology Mapping

## Web

- Next.js
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Framer Motion

---

## Mobile

Sebagian besar Layout Components akan digunakan kembali pada Flutter dengan penyesuaian terhadap pola navigasi mobile.

---

# Development Order

Implementasi dilakukan dengan urutan berikut:

1. Navbar
2. Footer
3. Hero
4. Container
5. Section Header
6. CTA
7. Breadcrumb
8. Topbar
9. Announcement Bar

---

# Component Template

Seluruh komponen Layout wajib menggunakan struktur dokumentasi berikut:

1. Overview
2. Objectives
3. User Stories
4. Functional Requirements
5. Component Anatomy
6. Variants
7. Properties (Props)
8. States
9. Responsive Behaviour
10. Accessibility
11. Design Specification
12. Interaction & Animation
13. Validation Rules
14. Acceptance Criteria
15. Developer Notes
16. Future Enhancement

---

# Acceptance Criteria

Layout Components dianggap selesai apabila:

- Seluruh komponen reusable.
- Seluruh komponen responsive.
- Seluruh komponen mengikuti Foundation.
- Seluruh komponen mendukung Theme System.
- Seluruh komponen memenuhi standar Accessibility.
- Seluruh komponen memiliki dokumentasi lengkap.
- Siap digunakan pada seluruh halaman Landing Website.

---

# Future Roadmap

## Version 1.1

- Sticky Section Navigation
- Floating CTA
- Mega Menu
- Secondary Navigation

## Version 2.0

- Multi Brand Layout
- Dynamic Layout Configuration
- Personalised Header
- AI-based Navigation

---

# Version History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | Initial Release | Layout Components Documentation |
