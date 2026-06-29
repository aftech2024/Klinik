# 03 - Spacing System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/03-Spacing.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Spacing System mendefinisikan aturan jarak (spacing) yang digunakan pada seluruh produk Clinic Management System.

Spacing mencakup:

- Margin
- Padding
- Gap
- Section Spacing
- Container Spacing
- Grid Gutter
- Component Internal Spacing
- Page Layout

Seluruh spacing wajib menggunakan Design Token.

Tidak diperbolehkan menggunakan nilai spacing secara langsung (misalnya `padding: 18px`).

---

# 2. Design Principles

## Consistency

Menggunakan satu sistem spacing di seluruh platform.

## Predictability

Developer dapat memprediksi jarak antar elemen.

## Scalability

Mudah diperluas tanpa mengubah komponen.

## Responsive

Spacing mengikuti ukuran layar.

## Reusability

Token dapat digunakan oleh seluruh komponen.

---

# 3. Base Unit

Design System menggunakan **8-Point Grid**.

Base Unit:

```

8 px

```

Kelipatan spacing mengikuti grid tersebut.

Exception diperbolehkan hanya untuk:

- Border (1px)
- Divider (1px)
- Icon Gap (4px)
- Hairline UI

---

# 4. Spacing Scale

| Token | Value | Usage |
|---------|-------|-----------------------------|
| 0 | 0 px | Tidak ada jarak |
| 1 | 4 px | Icon Gap |
| 2 | 8 px | Jarak kecil |
| 3 | 12 px | Helper Text |
| 4 | 16 px | Default |
| 5 | 20 px | Form |
| 6 | 24 px | Card |
| 8 | 32 px | Section kecil |
| 10 | 40 px | Hero |
| 12 | 48 px | Layout |
| 16 | 64 px | Section |
| 20 | 80 px | Large Section |
| 24 | 96 px | Hero Section |
| 32 | 128 px | Landing Page |

---

# 5. Padding Rules

## XS

8 px

Digunakan untuk:

- Badge
- Chip
- Small Button

---

## SM

12 px

Digunakan pada:

- Small Card

---

## MD

16 px

Default.

Digunakan pada:

- Form
- Input
- Card

---

## LG

24 px

Digunakan untuk:

- Dashboard Widget
- Large Card

---

## XL

32 px

Digunakan untuk:

- Hero
- Section

---

# 6. Margin Rules

Margin digunakan untuk memisahkan komponen yang berbeda.

Contoh:

Card

↓

24 px

↓

Card

---

Section

↓

64 px

↓

Section

---

Hero

↓

96 px

↓

Next Section

---

# 7. Gap Rules

Gap digunakan pada:

- Flex
- Grid
- Auto Layout

Default:

16 px

---

Small Gap

8 px

---

Medium Gap

16 px

---

Large Gap

24 px

---

Extra Large Gap

32 px

---

# 8. Component Spacing

## Button

Horizontal Padding

20 px

Vertical Padding

12 px

Gap Icon

8 px

---

## Input

Padding

16 px

---

## Card

Internal Padding

24 px

Gap

16 px

---

## Navbar

Horizontal

32 px

Vertical

16 px

---

## Hero

Top

96 px

Bottom

96 px

---

## Footer

Top

64 px

Bottom

32 px

---

# 9. Layout Spacing

## Desktop

Container Padding

32 px

---

## Tablet

24 px

---

## Mobile

16 px

---

# 10. Section Spacing

| Section | Top | Bottom |
|----------|-----|---------|
| Hero | 96 | 96 |
| Feature | 80 | 80 |
| Doctor | 80 | 80 |
| Promotion | 80 | 80 |
| FAQ | 64 | 64 |
| Footer | 64 | 32 |

---

# 11. Form Spacing

Label

↓

8 px

↓

Input

↓

16 px

↓

Helper Text

↓

24 px

↓

Next Input

---

Button

↓

24 px

↓

Footer Link

---

# 12. Grid Gutter

Desktop

24 px

Tablet

20 px

Mobile

16 px

---

# 13. Responsive Rules

## Desktop

Menggunakan spacing penuh.

---

## Tablet

Spacing dikurangi ±20%.

---

## Mobile

Gunakan:

16 px

24 px

32 px

Hindari penggunaan spacing lebih dari 64 px.

---

# 14. CSS Variables

```css
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

---

# 15. Tailwind Mapping

```ts
spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
    20: "80px",
    24: "96px",
    32: "128px"
}
```

---

# 16. Flutter Mapping

```dart
class AppSpacing {

static const double xs = 4;

static const double sm = 8;

static const double md = 16;

static const double lg = 24;

static const double xl = 32;

static const double section = 64;

static const double hero = 96;

}
```

---

# 17. Figma Variables

Collection

Spacing/

Variables

- Space-0
- Space-1
- Space-2
- Space-3
- Space-4
- Space-5
- Space-6
- Space-8
- Space-10
- Space-12
- Space-16
- Space-20
- Space-24
- Space-32

Semua Auto Layout wajib menggunakan Variable.

---

# 18. Usage Examples

## Card

```text
Padding : 24 px

Title

↓

16 px

Description

↓

24 px

Button
```

---

## Form

```text
Label

↓

8 px

Input

↓

8 px

Helper

↓

24 px

Input
```

---

## Landing Page

```text
Hero

↓

96 px

Services

↓

80 px

Doctors

↓

80 px

Promotion

↓

80 px

Article

↓

64 px

Footer
```

---

# 19. Do & Don't

## ✅ Do

- Gunakan token spacing.
- Gunakan Auto Layout.
- Gunakan gap daripada margin jika memungkinkan.
- Gunakan Section Spacing yang konsisten.

## ❌ Don't

- Hardcode `padding: 18px`.
- Mencampur banyak ukuran spacing dalam satu komponen.
- Menggunakan margin negatif tanpa alasan yang jelas.
- Memberikan padding berbeda untuk komponen yang identik.

---

# 20. Change Management

Perubahan Spacing System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui pada Figma Variables.
3. Diperbarui pada Tailwind Theme.
4. Diperbarui pada Flutter Constants.
5. Diuji pada seluruh breakpoint.

---

# 21. Acceptance Criteria

- Seluruh komponen menggunakan Spacing Token.
- Tidak ada hardcoded spacing.
- Konsisten pada Web dan Flutter.
- Mendukung Auto Layout Figma.
- Mendukung Responsive Layout.
- Seluruh section menggunakan spacing yang konsisten.
- Siap digunakan pada seluruh modul aplikasi.
