# 01 - Navbar

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** Navbar

**Document:** `05-Components/01-Layout/01-Navbar.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team

---

# 1. Overview

Navbar merupakan komponen navigasi utama yang ditampilkan pada seluruh halaman Landing Website.

Navbar berfungsi sebagai pintu masuk menuju seluruh fitur utama website serta menjadi identitas visual klinik.

Navbar harus bersifat:

- Responsive
- Sticky
- Accessible
- Theme Ready
- Reusable

---

# 2. Objectives

Navbar bertujuan untuk:

- Mempermudah navigasi pengguna.
- Mempercepat akses ke halaman penting.
- Menampilkan identitas klinik.
- Menampilkan tombol aksi utama.
- Mendukung berbagai ukuran layar.

---

# 3. User Stories

### Visitor

Sebagai pengunjung,

Saya ingin melihat menu navigasi dengan jelas,

Sehingga saya dapat menemukan informasi yang dibutuhkan.

---

Sebagai calon pasien,

Saya ingin langsung membuat janji temu,

Sehingga saya tidak perlu mencari tombol booking.

---

Sebagai pengguna mobile,

Saya ingin menu mudah dibuka,

Sehingga navigasi tetap nyaman.

---

# 4. Functional Requirements

Navbar wajib memiliki:

- Logo Klinik
- Menu Navigasi
- Tombol Appointment
- Tombol Login (opsional)
- Mobile Menu
- Sticky Navigation

---

# 5. Component Anatomy

```
+-------------------------------------------------------------+

LOGO

Home

Services

Doctors

Branches

Promotion

Article

Contact

Appointment Button

+-------------------------------------------------------------+
```

Mobile

```
LOGO

☰
```

---

# 6. Navigation Menu

Menu default.

| Menu | Required |
|--------|----------|
| Home | ✅ |
| About | ✅ |
| Services | ✅ |
| Doctors | ✅ |
| Branches | ✅ |
| Promotion | Optional |
| Articles | Optional |
| FAQ | Optional |
| Contact | ✅ |

---

# 7. CTA Button

Primary CTA

```
Book Appointment
```

Optional CTA

```
Download Apps
```

---

# 8. Variants

## Default

Transparent

---

## Sticky

Background White

Shadow Active

---

## Mobile

Hamburger Menu

---

## Minimal

Logo

Appointment

---

## Transparent

Digunakan pada Hero.

---

# 9. States

### Default

Navbar normal.

---

### Hover

Menu berubah warna.

---

### Active

Menu aktif menggunakan Primary Color.

---

### Sticky

Background berubah menjadi putih.

Shadow muncul.

---

### Mobile Open

Sidebar muncul.

Overlay aktif.

---

### Disabled

Tidak digunakan.

---

# 10. Responsive Behaviour

## Desktop

```
Logo

Menu Horizontal

CTA
```

---

## Tablet

Menu mulai dipadatkan.

CTA tetap tampil.

---

## Mobile

```
Logo

Hamburger
```

Menu tampil sebagai Drawer.

---

# 11. Layout Specification

Height

```
80 px
```

Container

```
1280 px
```

Horizontal Padding

```
24 px
```

Gap Menu

```
32 px
```

Logo Width

```
160 px
```

CTA Width

```
Auto
```

---

# 12. Typography

Logo

Heading Medium

Menu

Body Medium

CTA

Button Medium

Mengikuti Typography Foundation.

---

# 13. Color

Background

```
Surface Primary
```

Menu

```
Text Primary
```

Active

```
Primary 600
```

Hover

```
Primary 500
```

Border

```
Border Primary
```

Menggunakan Theme Token.

---

# 14. Icon

Hamburger

24 px

Close

24 px

Chevron

20 px

Menggunakan Icon Foundation.

---

# 15. Motion

Hover

150 ms

Dropdown

200 ms

Sticky

200 ms

Drawer

250 ms

Mengikuti Motion Foundation.

---

# 16. Accessibility

Navbar harus mendukung:

- Keyboard Navigation
- Focus Ring
- Screen Reader
- Skip Navigation
- ARIA Label

Hamburger:

```
aria-label="Open Navigation"
```

---

# 17. SEO Consideration

Gunakan semantic HTML.

```
<header>

<nav>

<ul>

<li>

<a>
```

Hanya satu elemen `<nav>` utama per halaman.

---

# 18. Interaction Flow

Desktop

```
Hover Menu

↓

Click

↓

Navigate
```

---

Mobile

```
Tap Hamburger

↓

Drawer Open

↓

Tap Menu

↓

Navigate

↓

Drawer Close
```

---

# 19. Error Handling

Jika menu gagal dimuat:

- Gunakan menu default.
- Tampilkan logo.
- Tombol Appointment tetap tersedia.

---

# 20. Analytics Event

Event yang dicatat:

| Event | Trigger |
|---------|---------|
| navbar_click | Klik Menu |
| navbar_cta | Klik Appointment |
| navbar_mobile_open | Drawer Dibuka |
| navbar_mobile_close | Drawer Ditutup |

---

# 21. Developer Notes

## Next.js

Gunakan:

- `<header>`
- `<nav>`
- `<Link>`
- `next/image`
- Tailwind CSS
- Shadcn Button

Sticky menggunakan:

```
position: sticky;
top: 0;
```

---

## Flutter

Gunakan:

- AppBar
- NavigationRail (Tablet)
- Drawer (Mobile)

---

# 22. Acceptance Criteria

- Logo tampil pada seluruh halaman.
- Menu dapat dinavigasi.
- Sticky berjalan dengan baik.
- Mobile Drawer berfungsi.
- CTA dapat diklik.
- Responsive di semua ukuran layar.
- Mendukung Theme System.
- Memenuhi WCAG 2.2 AA.

---

# 23. QA Checklist

- Logo tampil dengan benar.
- Seluruh menu mengarah ke halaman yang sesuai.
- Sticky aktif saat scroll.
- Hamburger muncul di mobile.
- Drawer dapat dibuka dan ditutup.
- Focus keyboard terlihat.
- Screen reader membaca menu.
- Tidak ada layout shift saat sticky aktif.
- Navbar tampil baik pada Light dan Dark Theme.

---

# 24. Future Enhancement

## Version 1.1

- Mega Menu
- Search Global
- Multi Language
- Notification Banner

## Version 2.0

- Personalized Navigation
- AI Search
- Dynamic Menu berdasarkan Role
- Branch Selector
