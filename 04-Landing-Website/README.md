# Components Library

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Folder:** `05-Components`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# Overview

Components Library merupakan kumpulan komponen UI (User Interface) yang digunakan untuk membangun seluruh Landing Website Clinic Management System.

Seluruh komponen dirancang dengan prinsip:

- Reusable
- Consistent
- Accessible
- Responsive
- Scalable
- Cross Platform Ready

Komponen ini menjadi dasar implementasi untuk:

- Landing Website
- Patient Portal
- Admin Dashboard
- Mobile Apps (Flutter)

---

# Objectives

Components Library dibuat untuk:

- Mengurangi duplikasi komponen.
- Menjaga konsistensi desain.
- Mempercepat proses pengembangan.
- Memudahkan maintenance.
- Menjadi acuan implementasi UI.

---

# Design Principles

Seluruh komponen wajib mengikuti prinsip berikut:

- Reusable
- Modular
- Atomic Design
- Responsive
- Accessible (WCAG 2.2 AA)
- Theme Ready
- Dark Mode Ready
- Mobile First

---

# Component Architecture

```
Foundation

↓

Layout

↓

Forms

↓

Data Display

↓

Feedback

↓

Navigation

↓

Pages
```

---

# Folder Structure

```
05-Components/

├── README.md

├── 00-Foundation/

├── 01-Layout/

├── 02-Forms/

├── 03-Data-Display/

├── 04-Feedback/

└── 05-Navigation/
```

---

# Component Categories

## 00 - Foundation

Berisi seluruh aturan dasar Design System.

Contoh:

- Color
- Typography
- Spacing
- Radius
- Shadow
- Grid
- Breakpoint
- Theme
- Accessibility

Foundation **tidak menghasilkan UI**, tetapi menjadi dasar seluruh komponen.

---

## 01 - Layout

Komponen yang membentuk struktur halaman.

Contoh:

- Navbar
- Hero
- Footer
- CTA
- Container
- Breadcrumb
- Topbar

---

## 02 - Forms

Komponen input pengguna.

Contoh:

- Button
- Input
- Select
- Search Bar
- Checkbox
- Radio
- Switch
- Textarea

---

## 03 - Data Display

Komponen untuk menampilkan informasi.

Contoh:

- Doctor Card
- Service Card
- Branch Card
- Promotion Card
- Article Card
- Badge
- Avatar
- Statistic

---

## 04 - Feedback

Komponen yang memberikan umpan balik kepada pengguna.

Contoh:

- Toast
- Modal
- Dialog
- Loading
- Skeleton
- Empty State
- Error State

---

## 05 - Navigation

Komponen untuk membantu navigasi.

Contoh:

- Pagination
- Tabs
- Stepper
- Sidebar
- Menu

---

# Component Standard

Setiap file komponen wajib memiliki struktur dokumentasi yang sama.

```
Overview

Purpose

Goals

Variants

Anatomy

Properties

State

Interaction

Responsive Behaviour

Accessibility

Design Specification

Acceptance Criteria

Developer Notes

Future Enhancement
```

---

# Naming Convention

Gunakan format berikut:

```
01-Navbar.md

02-Hero.md

03-Button.md
```

Gunakan **PascalCase** untuk nama komponen.

---

# Design Dependency

Seluruh komponen wajib menggunakan Foundation berikut:

- Color
- Typography
- Spacing
- Radius
- Shadow
- Grid
- Breakpoint
- Motion
- Elevation
- Theme
- Accessibility

Komponen **tidak diperbolehkan** menggunakan nilai hardcoded.

---

# Responsive Support

Semua komponen wajib mendukung:

- Mobile
- Tablet
- Desktop

Responsive mengikuti Breakpoint System.

---

# Accessibility

Seluruh komponen harus memenuhi standar:

- WCAG 2.2 Level AA
- Keyboard Navigation
- Screen Reader
- Focus Indicator
- Touch Target Minimum 44 × 44 px
- High Contrast Support
- Dark Theme Support

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

- Flutter
- Material 3
- Cupertino
- ThemeData

---

# Development Workflow

```
Foundation

↓

Component

↓

Composite Component

↓

Section

↓

Page

↓

Responsive Testing

↓

QA

↓

Production
```

---

# Contribution Guidelines

Sebelum membuat komponen baru, pastikan:

- Tidak ada komponen serupa.
- Mengikuti Foundation.
- Mengikuti Theme System.
- Mendukung Accessibility.
- Memiliki dokumentasi lengkap.
- Memiliki state lengkap.
- Mendukung responsive.

---

# Acceptance Criteria

Components Library dianggap selesai apabila:

- Seluruh komponen mengikuti Design System.
- Tidak ada hardcoded style.
- Seluruh komponen reusable.
- Seluruh komponen responsive.
- Seluruh komponen accessible.
- Seluruh komponen memiliki dokumentasi lengkap.
- Seluruh komponen siap diimplementasikan pada Web dan Flutter.

---

# Version History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | Initial Release | Components Library untuk Landing Website |
