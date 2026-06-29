# 10 - Elevation System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/10-Elevation.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Elevation System mendefinisikan hirarki visual (Visual Hierarchy) pada seluruh aplikasi.

Elevation digunakan untuk menentukan:

- Layer
- Z-Index
- Overlay
- Focus
- Floating Component
- Modal Priority
- Drawer Priority
- Toast Priority

Elevation bukan hanya Shadow.

Elevation menentukan urutan tampilan seluruh komponen.

---

# 2. Design Principles

## Hierarchy

Semakin tinggi elevation maka semakin tinggi prioritas visual.

---

## Consistency

Komponen dengan fungsi yang sama selalu memiliki elevation yang sama.

---

## Predictability

Developer dapat mengetahui layer suatu komponen tanpa menebak.

---

## Accessibility

Komponen dengan elevation tinggi tidak boleh menghalangi fokus pengguna secara tidak perlu.

---

# 3. Elevation Philosophy

Urutan layer aplikasi:

```
Page

↓

Section

↓

Card

↓

Dropdown

↓

Popover

↓

Drawer

↓

Modal

↓

Toast

↓

Global Notification

↓

Loading Screen
```

Semakin ke bawah semakin tinggi prioritas.

---

# 4. Elevation Levels

| Level | Token | Usage |
|--------|-------|---------------------------|
| 0 | elevation-0 | Background |
| 1 | elevation-1 | Button |
| 2 | elevation-2 | Card |
| 3 | elevation-3 | Dropdown |
| 4 | elevation-4 | Popover |
| 5 | elevation-5 | Drawer |
| 6 | elevation-6 | Modal |
| 7 | elevation-7 | Toast |
| 8 | elevation-8 | Global Loading |
| 9 | elevation-9 | Emergency Alert |

---

# 5. Layer Structure

```
Elevation 9

Emergency Alert

────────────────────

Elevation 8

Global Loader

────────────────────

Elevation 7

Toast

────────────────────

Elevation 6

Modal

────────────────────

Elevation 5

Drawer

────────────────────

Elevation 4

Popover

────────────────────

Elevation 3

Dropdown

────────────────────

Elevation 2

Card

────────────────────

Elevation 1

Button

────────────────────

Elevation 0

Background
```

---

# 6. Component Mapping

| Component | Elevation |
|------------|-----------|
| Background | 0 |
| Button | 1 |
| Input | 1 |
| Card | 2 |
| Widget | 2 |
| Dropdown | 3 |
| Calendar | 3 |
| Tooltip | 4 |
| Popover | 4 |
| Drawer | 5 |
| Modal | 6 |
| Toast | 7 |
| Global Loader | 8 |
| Emergency Dialog | 9 |

---

# 7. Overlay Rules

Modal

↓

Overlay

↓

Elevation 5

Modal

↓

Elevation 6

Artinya Overlay selalu berada satu level di bawah Modal.

---

# 8. Z-Index Mapping

| Elevation | Z-Index |
|------------|----------|
| 0 | auto |
| 1 | 10 |
| 2 | 20 |
| 3 | 30 |
| 4 | 40 |
| 5 | 50 |
| 6 | 60 |
| 7 | 70 |
| 8 | 80 |
| 9 | 90 |

Tidak diperbolehkan menggunakan nilai z-index acak.

---

# 9. CSS Variables

```css
:root{

--z-base:auto;

--z-button:10;

--z-card:20;

--z-dropdown:30;

--z-popover:40;

--z-drawer:50;

--z-modal:60;

--z-toast:70;

--z-loader:80;

--z-alert:90;

}
```

---

# 10. Tailwind Mapping

```ts
zIndex:{

auto:"auto",

10:"10",

20:"20",

30:"30",

40:"40",

50:"50",

60:"60",

70:"70",

80:"80",

90:"90"

}
```

---

# 11. Flutter Mapping

Gunakan:

- Stack
- Overlay
- OverlayEntry
- Navigator
- Material Elevation
- Dialog Route

Urutan:

```
Scaffold

↓

Card

↓

PopupMenu

↓

Drawer

↓

Dialog

↓

Overlay

↓

Loader
```

---

# 12. Figma Layer

Gunakan Layer berikut:

```
Background

↓

Content

↓

Card

↓

Dropdown

↓

Overlay

↓

Modal

↓

Toast
```

Tidak mengubah urutan layer secara manual.

---

# 13. Interaction Rules

Dropdown

↓

Tidak boleh muncul di bawah Card.

---

Modal

↓

Harus menutup seluruh interaksi.

---

Toast

↓

Tidak boleh menghalangi Modal.

---

Loader

↓

Menutup seluruh halaman.

---

# 14. Responsive Rules

Elevation tidak berubah berdasarkan ukuran layar.

Desktop

↓

Modal

↓

Elevation 6

Tablet

↓

Elevation 6

Mobile

↓

Elevation 6

---

# 15. Accessibility

Focus selalu berpindah ke komponen dengan elevation tertinggi.

Contoh:

Modal

↓

Focus Trap

↓

Keyboard Navigation

↓

ESC Close

---

# 16. Do & Don't

## ✅ Do

- Gunakan Elevation Token.
- Gunakan Z-Index Token.
- Ikuti urutan layer.
- Gunakan Overlay untuk Modal.

---

## ❌ Don't

- Menggunakan `z-index:999999`.
- Membuat layer baru tanpa kebutuhan.
- Menampilkan Toast di atas Emergency Alert.
- Mengubah urutan layer secara manual.

---

# 17. Change Management

Perubahan Elevation System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui pada Design Token.
3. Diperbarui pada Tailwind Config.
4. Diperbarui pada Flutter Constants.
5. Diverifikasi oleh QA.

---

# 18. Acceptance Criteria

- Seluruh komponen menggunakan Elevation Token.
- Tidak ada z-index hardcoded.
- Seluruh layer mengikuti hirarki.
- Modal, Drawer, Toast, dan Loader memiliki urutan yang konsisten.
- Mendukung Web dan Flutter.
- Konsisten pada Figma.

---

# 19. Future Roadmap

## Version 1.1

- Floating FAB Layer
- Bottom Sheet Layer
- Notification Center Layer

## Version 2.0

- Dynamic Elevation
- Adaptive Elevation
- Theme-based Elevation
- Material 3 Elevation Mapping
