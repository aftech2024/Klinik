# 06 - Container

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** Container

**Document:** `05-Components/01-Layout/06-Container.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team

---

# 1. Overview

Container merupakan komponen layout yang digunakan untuk mengatur lebar maksimum (Max Width), alignment, horizontal spacing, serta responsive behavior pada seluruh halaman website.

Container menjadi fondasi utama dalam membangun layout yang konsisten, mudah dipelihara, dan scalable.

Seluruh halaman wajib menggunakan Container dan tidak diperbolehkan menggunakan wrapper dengan ukuran yang berbeda tanpa persetujuan dari Design System.

---

# 2. Objectives

Container bertujuan untuk:

- Menjaga konsistensi layout.
- Mengatur batas maksimal konten.
- Mengontrol responsive layout.
- Mengurangi hardcoded width.
- Mempermudah implementasi Grid System.
- Mendukung berbagai ukuran layar.

---

# 3. User Stories

### Visitor

Sebagai pengguna,

Saya ingin seluruh halaman memiliki tata letak yang konsisten,

Sehingga pengalaman membaca tetap nyaman.

---

Sebagai pengguna mobile,

Saya ingin konten tidak terlalu rapat ke tepi layar.

---

Sebagai developer,

Saya ingin menggunakan satu komponen Container,

Sehingga implementasi layout menjadi konsisten.

---

# 4. Functional Requirements

Container harus mendukung:

- Max Width
- Full Width
- Fluid Width
- Horizontal Padding
- Vertical Padding
- Responsive Breakpoint
- Alignment
- Nested Container
- Theme Support

---

# 5. Component Anatomy

```
Browser

┌─────────────────────────────────────────────┐

      Container

┌───────────────────────────────┐

Content

└───────────────────────────────┘

└─────────────────────────────────────────────┘
```

---

# 6. Container Variants

## Default

Digunakan pada seluruh halaman.

```
Max Width

1280 px
```

---

## Narrow

Digunakan untuk:

- Article
- Blog
- Privacy Policy
- Terms

```
768 px
```

---

## Wide

Digunakan pada:

- Hero
- Gallery
- Promotion

```
1440 px
```

---

## Full Width

Digunakan pada:

- Banner
- Map
- Image Slider

```
100%
```

---

## Fluid

Mengikuti ukuran viewport.

---

# 7. Layout Specification

Desktop

```
Max Width

1280 px
```

Tablet

```
100%
```

Mobile

```
100%
```

Horizontal Margin

```
Auto
```

---

# 8. Padding

Desktop

```
32 px
```

Tablet

```
24 px
```

Mobile

```
16 px
```

Mengikuti Spacing Foundation.

---

# 9. Grid Integration

Container menggunakan Grid Foundation.

Desktop

```
12 Columns
```

Tablet

```
8 Columns
```

Mobile

```
4 Columns
```

Gutter

```
24 px
```

---

# 10. Alignment

Container mendukung:

- Left
- Center
- Stretch

Default

```
Center
```

---

# 11. Responsive Behaviour

## Desktop (>1280 px)

Container tetap berada di tengah.

---

## Laptop

Lebar mengikuti viewport.

---

## Tablet

Padding diperkecil.

---

## Mobile

Padding minimum

```
16 px
```

---

# 12. Safe Area

Container harus memperhatikan:

- iPhone Safe Area
- Android Gesture Area

Gunakan CSS Environment Variables jika diperlukan.

```
env(safe-area-inset-left)

env(safe-area-inset-right)
```

---

# 13. Theme Support

Container mengikuti Theme Foundation.

Background dapat berupa:

- Transparent
- Surface
- Primary
- Secondary

---

# 14. Accessibility

Container tidak memiliki interaksi.

Namun harus:

- Tidak memotong konten.
- Tidak menyebabkan horizontal scroll.
- Mendukung Zoom hingga 200%.

---

# 15. Animation

Container tidak memiliki animasi.

---

# 16. Performance

Container harus:

- Ringan.
- Tidak menggunakan JavaScript.
- Menggunakan CSS murni.
- Tidak menyebabkan CLS (Cumulative Layout Shift).

---

# 17. Props

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| size | default \| narrow \| wide \| full | No | Ukuran container |
| fluid | boolean | No | Full responsive width |
| padding | boolean | No | Horizontal padding |
| centered | boolean | No | Align center |
| className | string | No | Additional class |

---

# 18. Design Tokens

Container menggunakan:

```
grid.container

grid.maxWidth

spacing.16

spacing.24

spacing.32

breakpoint.*

theme.surface
```

---

# 19. Developer Notes

## Next.js

Gunakan:

```
<div class="container mx-auto px-4 lg:px-8">
```

atau komponen reusable:

```
<Container>

...

</Container>
```

Container tidak boleh menggunakan width hardcoded.

---

## Flutter

Gunakan:

```
Padding

↓

ConstrainedBox

↓

Center

↓

Content
```

Maksimum width mengikuti Breakpoint.

---

# 20. CMS Configuration

Container tidak dikontrol melalui CMS.

Layout ditentukan oleh Design System.

---

# 21. Acceptance Criteria

- Seluruh halaman menggunakan Container.
- Tidak ada horizontal scroll.
- Responsive pada seluruh perangkat.
- Padding sesuai breakpoint.
- Mendukung Theme System.
- Konsisten dengan Grid Foundation.

---

# 22. QA Checklist

□ Desktop menggunakan Max Width 1280 px.

□ Tablet menggunakan padding yang benar.

□ Mobile menggunakan padding 16 px.

□ Tidak terjadi overflow.

□ Tidak terjadi layout shift.

□ Tidak ada konten menempel ke tepi layar.

□ Tidak menggunakan hardcoded width.

□ Layout tetap konsisten pada seluruh halaman.

---

# 23. Future Enhancement

## Version 1.1

- Adaptive Container
- Content Width Token
- Auto Responsive Container

---

## Version 2.0

- Dynamic Container berdasarkan Module
- Multi Tenant Layout
- Branch Specific Layout
- AI Responsive Layout
