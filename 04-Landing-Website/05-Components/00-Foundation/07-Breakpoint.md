# 07 - Breakpoint System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/07-Breakpoint.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Breakpoint System mendefinisikan bagaimana antarmuka beradaptasi terhadap berbagai ukuran layar.

Dokumen ini mengatur:

- Device Breakpoint
- Responsive Layout
- Container Width
- Grid Changes
- Typography Scaling
- Component Behavior
- Navigation Behavior
- Dashboard Layout
- Responsive Rules

Seluruh halaman wajib mengikuti aturan dalam dokumen ini.

---

# 2. Design Principles

Responsive Design mengikuti prinsip:

## Mobile First

Komponen dirancang untuk layar kecil terlebih dahulu, kemudian ditingkatkan ke tablet dan desktop.

---

## Fluid Layout

Layout berkembang mengikuti ruang yang tersedia.

---

## Consistency

Perubahan layout tidak boleh mengubah identitas visual.

---

## Performance

Perubahan layout tidak boleh menyebabkan rendering berlebihan.

---

## Accessibility

Semua ukuran layar harus tetap mudah digunakan.

---

# 3. Breakpoint Definition

| Device | Width |
|----------|---------|
| Mobile XS | < 480 px |
| Mobile | 480 – 767 px |
| Tablet | 768 – 1023 px |
| Laptop | 1024 – 1279 px |
| Desktop | 1280 – 1439 px |
| Wide Desktop | ≥ 1440 px |

---

# 4. Breakpoint Tokens

| Token | Width |
|---------|---------|
| xs | 480 px |
| sm | 640 px |
| md | 768 px |
| lg | 1024 px |
| xl | 1280 px |
| 2xl | 1440 px |

---

# 5. Grid Behavior

| Device | Columns |
|----------|----------|
| Mobile | 4 |
| Tablet | 8 |
| Laptop | 12 |
| Desktop | 12 |
| Wide Desktop | 12 |

---

# 6. Container Width

| Device | Container |
|----------|-----------|
| Mobile | 100% |
| Tablet | 100% |
| Laptop | 1140 px |
| Desktop | 1280 px |
| Wide Desktop | 1440 px |

---

# 7. Container Padding

| Device | Padding |
|----------|---------|
| Mobile | 16 px |
| Tablet | 24 px |
| Laptop | 24 px |
| Desktop | 32 px |
| Wide Desktop | 32 px |

---

# 8. Typography Behavior

## Desktop

Menggunakan ukuran penuh sesuai Typography System.

---

## Tablet

Display turun satu level bila diperlukan.

Contoh:

Display XL

↓

Display LG

---

## Mobile

Contoh perubahan:

| Desktop | Mobile |
|-----------|----------|
| Display XL | Display MD |
| Heading XL | Heading LG |
| Heading LG | Heading MD |

Body tetap menggunakan ukuran 16 px.

---

# 9. Spacing Behavior

| Device | Section Spacing |
|----------|----------------|
| Mobile | 48–64 px |
| Tablet | 64–80 px |
| Desktop | 80–96 px |

Gap antar komponen mengikuti `03-Spacing.md`.

---

# 10. Navigation Behavior

## Desktop

- Logo
- Menu Lengkap
- CTA Button

---

## Tablet

- Logo
- Menu Ringkas
- CTA Button

---

## Mobile

- Logo
- Hamburger Menu
- CTA disimpan dalam Drawer

---

# 11. Hero Section Behavior

## Desktop

```text
Text | Image
```

---

## Tablet

```text
Text

Image
```

---

## Mobile

```text
Text

CTA

Image
```

Seluruh elemen ditampilkan dalam satu kolom.

---

# 12. Card Layout Behavior

## Service Card

Desktop

```text
4 Card / Row
```

Tablet

```text
2 Card / Row
```

Mobile

```text
1 Card / Row
```

---

## Doctor Card

Desktop

```text
4 Card
```

Tablet

```text
2 Card
```

Mobile

```text
1 Card
```

---

## Promotion Card

Desktop

2 Kolom

Tablet

2 Kolom

Mobile

1 Kolom

---

# 13. Dashboard Behavior

## Desktop

```text
Sidebar

↓

Main Content
```

---

## Tablet

Sidebar dapat diperkecil (Collapsed).

---

## Mobile

Sidebar berubah menjadi Drawer.

---

Widget:

Desktop

```text
4 Widget / Row
```

Tablet

```text
2 Widget / Row
```

Mobile

```text
1 Widget / Row
```

---

# 14. Table Behavior

Desktop

Tabel penuh.

---

Tablet

Kolom kurang penting dapat disembunyikan.

---

Mobile

Tabel berubah menjadi:

- Card List
- Expandable Row
- Horizontal Scroll (opsional jika data kompleks)

---

# 15. Form Behavior

Desktop

Label berada di atas Input.

Lebar Input mengikuti Grid.

---

Tablet

Tetap sama.

---

Mobile

Input menjadi Full Width.

Button utama menjadi Full Width.

---

# 16. Image Behavior

Hero Image

Desktop

100%

---

Tablet

80%

---

Mobile

70%

---

Thumbnail

Menggunakan rasio tetap.

Gunakan:

- 1:1
- 4:3
- 16:9

---

# 17. Responsive Utilities

Komponen harus mendukung:

- Show / Hide
- Collapse
- Expand
- Stack
- Wrap
- Scroll

Tanpa mengubah struktur HTML utama.

---

# 18. CSS Media Query

```css
/* Mobile */
@media (max-width:767px){}

/* Tablet */
@media (min-width:768px){}

/* Laptop */
@media (min-width:1024px){}

/* Desktop */
@media (min-width:1280px){}

/* Wide */
@media (min-width:1440px){}
```

---

# 19. Tailwind Mapping

```ts
screens:{

sm:"640px",

md:"768px",

lg:"1024px",

xl:"1280px",

"2xl":"1440px"

}
```

---

# 20. Flutter Mapping

Gunakan:

```dart
MediaQuery

↓

LayoutBuilder

↓

ResponsiveBuilder
```

Contoh:

```dart
if(width < 768){

return MobileLayout();

}

else if(width < 1024){

return TabletLayout();

}

return DesktopLayout();
```

---

# 21. Figma Guidelines

Desktop

Frame

1440 px

12 Grid

---

Tablet

Frame

768 px

8 Grid

---

Mobile

Frame

390 px

4 Grid

Setiap halaman wajib memiliki desain untuk:

- Desktop
- Tablet
- Mobile

---

# 22. QA Checklist

Pastikan:

- Tidak ada horizontal scroll.
- Tidak ada elemen terpotong.
- Tidak ada teks bertumpuk.
- Semua tombol dapat diklik.
- Semua form dapat digunakan.
- Drawer berfungsi.
- Gambar tidak terdistorsi.
- Layout tetap konsisten.

---

# 23. Do & Don't

## ✅ Do

- Gunakan breakpoint yang telah ditentukan.
- Gunakan Grid System.
- Gunakan Container.
- Uji pada seluruh ukuran layar.
- Gunakan Flex/Grid sebelum media query khusus.

---

## ❌ Don't

- Hardcode ukuran berdasarkan perangkat tertentu.
- Membuat layout terpisah tanpa alasan.
- Mengubah struktur HTML hanya untuk responsive.
- Menggunakan pixel tetap untuk lebar komponen utama.

---

# 24. Change Management

Perubahan Breakpoint System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui pada Figma.
3. Diperbarui pada Tailwind Config.
4. Diperbarui pada Flutter Responsive Layout.
5. Diverifikasi oleh QA.

---

# 25. Acceptance Criteria

- Seluruh halaman responsif.
- Tidak ada horizontal scroll pada viewport standar.
- Typography mengikuti aturan responsive.
- Grid berubah sesuai breakpoint.
- Navigation beradaptasi dengan ukuran layar.
- Card dan Form menyesuaikan layout.
- Konsisten pada Figma, Next.js, dan Flutter.
- Mendukung Mobile, Tablet, Laptop, Desktop, dan Wide Desktop.
