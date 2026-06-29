# 05 - Shadow System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/05-Shadow.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Shadow System mendefinisikan standar penggunaan bayangan (Shadow / Elevation) pada seluruh komponen UI.

Shadow digunakan untuk:

- Memberikan kedalaman (Depth)
- Menunjukkan hirarki visual
- Menunjukkan komponen yang dapat berinteraksi
- Membedakan Surface
- Meningkatkan keterbacaan layout

Seluruh komponen wajib menggunakan Shadow Token.

Tidak diperbolehkan membuat shadow secara manual.

---

# 2. Design Principles

## Minimal

Shadow dibuat ringan agar tampilan tetap bersih.

---

## Consistent

Setiap level memiliki shadow yang sama.

---

## Functional

Shadow menunjukkan elevasi, bukan dekorasi.

---

## Modern

Mengikuti gaya modern seperti Material Design, Fluent UI, dan Apple Human Interface.

---

## Performance

Jumlah shadow dijaga seminimal mungkin untuk menjaga performa rendering.

---

# 3. Shadow Philosophy

Clinic Management System menggunakan konsep:

Surface

↓

Card

↓

Popover

↓

Modal

↓

Toast

↓

Floating Action

Semakin tinggi elevasi maka semakin kuat shadow yang digunakan.

---

# 4. Shadow Levels

| Token | Elevation | Usage |
|---------|-----------|---------------------------|
| shadow-none | 0 | Flat UI |
| shadow-xs | 1 | Button Hover |
| shadow-sm | 2 | Card |
| shadow-md | 4 | Dropdown |
| shadow-lg | 8 | Modal |
| shadow-xl | 16 | Drawer |
| shadow-2xl | 24 | Floating Panel |

---

# 5. Shadow Token

## shadow-none

Tidak memiliki bayangan.

Digunakan pada:

- Divider
- Table
- Flat Section

---

## shadow-xs

Bayangan sangat tipis.

Digunakan pada:

- Hover Button
- Small Badge

---

## shadow-sm

Default.

Digunakan pada:

- Card
- Widget
- Statistic Card
- Doctor Card

---

## shadow-md

Digunakan pada:

- Dropdown
- Popover
- Calendar
- Date Picker

---

## shadow-lg

Digunakan pada:

- Modal
- Dialog
- Alert

---

## shadow-xl

Digunakan pada:

- Drawer
- Side Panel
- Navigation Overlay

---

## shadow-2xl

Digunakan pada:

- Floating Toolbar
- Floating Widget
- Live Chat Bubble

---

# 6. Component Mapping

| Component | Shadow |
|------------|---------|
| Button Hover | shadow-xs |
| Card | shadow-sm |
| Statistic Card | shadow-sm |
| Doctor Card | shadow-sm |
| Service Card | shadow-sm |
| Dropdown | shadow-md |
| Tooltip | shadow-md |
| Calendar | shadow-md |
| Modal | shadow-lg |
| Drawer | shadow-xl |
| Floating Widget | shadow-2xl |

---

# 7. Interaction Mapping

## Default

shadow-none

↓

Hover

shadow-xs

↓

Pressed

shadow-none

---

Card

Default

↓

shadow-sm

↓

Hover

↓

shadow-md

↓

Pressed

↓

shadow-sm

---

Modal

Default

↓

shadow-lg

---

Floating Widget

↓

shadow-2xl

---

# 8. CSS Variables

```css
:root {

--shadow-none: none;

--shadow-xs:
0px 1px 2px rgba(16,24,40,0.05);

--shadow-sm:
0px 2px 6px rgba(16,24,40,0.08);

--shadow-md:
0px 4px 12px rgba(16,24,40,0.10);

--shadow-lg:
0px 8px 24px rgba(16,24,40,0.12);

--shadow-xl:
0px 16px 32px rgba(16,24,40,0.14);

--shadow-2xl:
0px 24px 48px rgba(16,24,40,0.18);

}
```

---

# 9. Tailwind Mapping

```ts
boxShadow: {

none: "none",

xs: "0 1px 2px rgba(16,24,40,.05)",

sm: "0 2px 6px rgba(16,24,40,.08)",

md: "0 4px 12px rgba(16,24,40,.10)",

lg: "0 8px 24px rgba(16,24,40,.12)",

xl: "0 16px 32px rgba(16,24,40,.14)",

"2xl": "0 24px 48px rgba(16,24,40,.18)"

}
```

---

# 10. Flutter Mapping

```dart
class AppShadow {

static const xs = [
BoxShadow(
blurRadius: 2,
offset: Offset(0,1),
color: Color(0x0D101828),
),
];

static const sm = [
BoxShadow(
blurRadius: 6,
offset: Offset(0,2),
color: Color(0x14101828),
),
];

static const md = [
BoxShadow(
blurRadius: 12,
offset: Offset(0,4),
color: Color(0x1A101828),
),
];

static const lg = [
BoxShadow(
blurRadius: 24,
offset: Offset(0,8),
color: Color(0x1F101828),
),
];

}
```

---

# 11. Figma Effect Styles

Collection

Effects/

Variables

- Shadow / None
- Shadow / XS
- Shadow / SM
- Shadow / MD
- Shadow / LG
- Shadow / XL
- Shadow / 2XL

Semua komponen wajib menggunakan Effect Style.

Tidak diperbolehkan membuat Effect baru tanpa persetujuan Design System.

---

# 12. Usage Examples

## Button

Default

No Shadow

↓

Hover

Shadow XS

---

## Card

Default

Shadow SM

↓

Hover

Shadow MD

---

## Dropdown

Shadow MD

---

## Modal

Shadow LG

---

## Drawer

Shadow XL

---

## Floating Widget

Shadow 2XL

---

# 13. Accessibility

Shadow tidak boleh menjadi satu-satunya indikator interaksi.

Contoh:

Button Hover

✔ Shadow

✔ Background berubah

✔ Cursor berubah

✔ Focus Ring muncul

---

Modal

✔ Shadow

✔ Overlay

✔ Focus Trap

---

# 14. Performance Guidelines

Gunakan maksimal:

- 1 Shadow pada Button
- 1 Shadow pada Card
- 1 Shadow pada Modal

Hindari:

- Shadow bertumpuk
- Blur terlalu besar
- Opacity tinggi

---

# 15. Responsive Rules

Shadow tidak berubah berdasarkan ukuran layar.

Desktop

↓

Shadow SM

↓

Tablet

↓

Shadow SM

↓

Mobile

↓

Shadow SM

Yang berubah adalah ukuran komponen, bukan shadow.

---

# 16. Dark Theme

Pada Dark Theme:

- Opacity shadow dikurangi.
- Surface lebih mengandalkan perbedaan warna daripada shadow.

Contoh:

Light Theme

Card

↓

Shadow SM

Dark Theme

Card

↓

Shadow XS + Surface Contrast

---

# 17. Do & Don't

## ✅ Do

- Gunakan Shadow Token.
- Gunakan shadow sesuai elevasi.
- Gunakan shadow untuk menunjukkan depth.
- Gunakan hover shadow secara halus.

---

## ❌ Don't

- Membuat shadow baru di luar token.
- Menggunakan shadow terlalu gelap.
- Menggunakan lebih dari dua shadow pada satu komponen.
- Menggunakan shadow sebagai dekorasi.

---

# 18. Change Management

Perubahan Shadow System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui pada Figma Effect Styles.
3. Diperbarui pada CSS Variables.
4. Diperbarui pada Tailwind Theme.
5. Diperbarui pada Flutter Constants.
6. Diverifikasi pada seluruh komponen.

---

# 19. Acceptance Criteria

- Seluruh komponen menggunakan Shadow Token.
- Tidak ada hardcoded box-shadow.
- Konsisten pada Web, Flutter, dan Figma.
- Mendukung Light Theme dan Dark Theme.
- Shadow hanya digunakan untuk menunjukkan elevasi.
- Performa rendering tetap optimal.
- Siap digunakan pada seluruh komponen UI.

---

# 20. Shadow Decision Matrix

| Component | Default | Hover | Active |
|------------|---------|--------|--------|
| Button | None | XS | None |
| Card | SM | MD | SM |
| Dropdown | MD | MD | MD |
| Modal | LG | LG | LG |
| Drawer | XL | XL | XL |
| Tooltip | MD | MD | MD |
| Floating Widget | 2XL | 2XL | 2XL |

---

# 21. Future Roadmap

## Version 1.1

- Glassmorphism Shadow Token
- Colored Shadow Token
- Brand Shadow Token

## Version 2.0

- Adaptive Shadow
- Dynamic Elevation
- Material You Elevation Mapping
- Theme-based Shadow Rendering
