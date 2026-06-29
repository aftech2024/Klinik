# Foundation

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Components → Foundation

**Folder:** `05-Components/00-Foundation`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# Overview

Foundation merupakan dasar (core) dari seluruh Design System yang digunakan pada Landing Website Clinic Management System.

Foundation tidak menghasilkan komponen UI secara langsung, tetapi menyediakan aturan, standar, dan design token yang digunakan oleh seluruh komponen dan halaman.

Semua komponen pada proyek ini wajib mengikuti Foundation.

---

# Objectives

Foundation dibuat untuk:

- Menjaga konsistensi desain.
- Mengurangi duplikasi style.
- Mempermudah maintenance.
- Mendukung multi-platform (Web & Mobile).
- Mendukung Theme System.
- Mendukung Accessibility.
- Mempermudah scaling aplikasi.

---

# Design Principles

Seluruh Foundation mengikuti prinsip berikut:

- Consistency
- Reusability
- Accessibility
- Scalability
- Maintainability
- Responsive First
- Theme Ready

---

# Foundation Architecture

```
Foundation

├── Color
├── Typography
├── Spacing
├── Radius
├── Shadow
├── Grid
├── Breakpoint
├── Icon
├── Motion
├── Elevation
├── Theme
├── Accessibility
└── Design Token
```

Foundation menjadi dasar untuk:

```
Foundation

↓

Components

↓

Sections

↓

Pages

↓

Application
```

---

# Foundation Files

## 01 - Color

Mengatur seluruh sistem warna aplikasi.

Meliputi:

- Brand Color
- Neutral Color
- Semantic Color
- Status Color
- Surface Color
- Background Color

---

## 02 - Typography

Mengatur seluruh sistem tipografi.

Meliputi:

- Font Family
- Font Size
- Font Weight
- Line Height
- Letter Spacing
- Heading
- Body Text

---

## 03 - Spacing

Mengatur jarak antar elemen menggunakan sistem spacing berbasis token.

Meliputi:

- Margin
- Padding
- Gap
- Section Spacing

---

## 04 - Radius

Mengatur standar Border Radius.

Digunakan pada:

- Button
- Input
- Card
- Modal
- Dialog

---

## 05 - Shadow

Mengatur efek bayangan.

Digunakan untuk memberikan kedalaman visual pada komponen.

---

## 06 - Grid

Mengatur tata letak halaman.

Meliputi:

- Container
- Column
- Gutter
- Margin
- Responsive Grid

---

## 07 - Breakpoint

Mengatur perilaku Responsive Design.

Target:

- Mobile
- Tablet
- Laptop
- Desktop

---

## 08 - Icon

Mengatur standar penggunaan ikon.

Meliputi:

- Ukuran
- Warna
- Stroke
- Library
- Accessibility

---

## 09 - Motion

Mengatur animasi dan transisi.

Meliputi:

- Duration
- Easing
- Hover
- Loading
- Page Transition

---

## 10 - Elevation

Mengatur hirarki visual.

Meliputi:

- Layer
- Z-Index
- Overlay
- Modal
- Drawer
- Toast

---

## 11 - Theme

Mengatur sistem tema aplikasi.

Meliputi:

- Light Theme
- Dark Theme
- High Contrast
- Brand Theme
- White Label

---

## 12 - Accessibility

Mengatur standar aksesibilitas.

Mengikuti:

- WCAG 2.2 AA

Meliputi:

- Keyboard Navigation
- Screen Reader
- Focus Indicator
- Contrast Ratio
- Touch Target

---

## 13 - Design Token

Menghubungkan seluruh Foundation menjadi satu sistem token.

Digunakan oleh:

- Figma Variables
- CSS Variables
- Tailwind Config
- Flutter ThemeData

---

# Foundation Dependency

```
Color
Typography
Spacing
Radius
Shadow
Grid
Breakpoint
Icon
Motion
Elevation
Theme
Accessibility
Design Token
```

Seluruh komponen wajib menggunakan Foundation.

Komponen tidak diperbolehkan membuat style sendiri yang bertentangan dengan Foundation.

---

# Technology Mapping

## Figma

- Variables
- Styles
- Components
- Auto Layout

---

## Web

- Next.js
- React
- TypeScript
- Tailwind CSS
- CSS Variables

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

Design Token

↓

Components

↓

Sections

↓

Pages

↓

Testing

↓

Production
```

---

# Naming Convention

Gunakan format:

```
01-Color.md
02-Typography.md
03-Spacing.md
```

Gunakan penomoran dua digit.

---

# Contribution Guidelines

Sebelum menambahkan Foundation baru, pastikan:

- Tidak menduplikasi Foundation yang sudah ada.
- Memiliki dokumentasi lengkap.
- Mendukung Web dan Flutter.
- Mendukung Theme System.
- Mendukung Accessibility.
- Disetujui oleh UI/UX Lead.

---

# Acceptance Criteria

Foundation dianggap selesai apabila:

- Seluruh aturan desain terdokumentasi.
- Seluruh komponen menggunakan Foundation.
- Tidak ada nilai hardcoded.
- Mendukung Responsive Design.
- Mendukung Theme System.
- Mendukung Accessibility.
- Konsisten antara Figma, Web, dan Mobile.

---

# Folder Structure

```
00-Foundation/

README.md

01-Color.md

02-Typography.md

03-Spacing.md

04-Radius.md

05-Shadow.md

06-Grid.md

07-Breakpoint.md

08-Icon.md

09-Motion.md

10-Elevation.md

11-Theme.md

12-Accessibility.md

13-Design-Token.md
```

---

# Version History

| Version | Date | Description |
|----------|------|-------------|
| 1.0.0 | Initial Release | Foundation Design System |
