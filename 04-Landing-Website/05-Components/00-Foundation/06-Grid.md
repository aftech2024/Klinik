# 06 - Grid System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/06-Grid.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Grid System adalah fondasi layout yang digunakan untuk mengatur posisi, ukuran, dan alignment seluruh elemen antarmuka.

Grid memastikan seluruh halaman memiliki struktur yang:

- Konsisten
- Responsive
- Mudah dikembangkan
- Mudah dipelihara
- Selaras antar platform

Grid digunakan pada:

- Landing Website
- Patient Portal
- Admin Dashboard
- Flutter Android
- Flutter iOS

---

# 2. Design Principles

Grid System dibangun berdasarkan prinsip berikut.

## Consistency

Seluruh halaman menggunakan struktur grid yang sama.

---

## Alignment

Seluruh komponen harus sejajar secara horizontal maupun vertikal.

---

## Responsive

Grid beradaptasi terhadap ukuran layar.

---

## Flexible

Layout dapat berkembang tanpa mengubah struktur dasar.

---

## Predictable

Developer dapat memprediksi ukuran dan posisi komponen.

---

# 3. Grid Architecture

Grid terdiri dari:

```text
Viewport

↓

Container

↓

Columns

↓

Gutters

↓

Content
```

---

# 4. Grid Structure

```text
┌──────────────────────────────────────────────┐
│               Container                      │
│                                              │
│ | C1 | C2 | C3 | ... | C12 |                 │
│                                              │
└──────────────────────────────────────────────┘
```

Grid menggunakan:

- Container
- Columns
- Gutters
- Margins

---

# 5. Container Width

## Extra Large Desktop

1440 px

---

## Desktop

1280 px

---

## Laptop

1140 px

---

## Tablet

100%

Padding mengikuti Breakpoint.

---

## Mobile

100%

Padding mengikuti Mobile Layout.

---

# 6. Grid Columns

## Desktop

12 Columns

---

## Laptop

12 Columns

---

## Tablet

8 Columns

---

## Mobile

4 Columns

---

# 7. Column Usage

## 12 Columns

Digunakan pada:

- Landing Website
- Dashboard
- Portal

---

## 8 Columns

Digunakan pada:

- Tablet

---

## 4 Columns

Digunakan pada:

- Mobile

---

# 8. Column Span

| Span | Usage |
|-------|----------------------------|
| 12 | Full Width |
| 10 | Hero Content |
| 8 | Main Content |
| 6 | 2 Column Layout |
| 4 | Card Grid |
| 3 | Statistic Card |
| 2 | Sidebar Widget |
| 1 | Icon Area |

---

# 9. Gutter

Gutter adalah jarak antar kolom.

| Device | Gutter |
|----------|---------|
| Desktop | 24 px |
| Laptop | 24 px |
| Tablet | 20 px |
| Mobile | 16 px |

---

# 10. Margin

Margin adalah jarak antara viewport dan container.

| Device | Margin |
|----------|---------|
| Desktop | 32 px |
| Laptop | 24 px |
| Tablet | 24 px |
| Mobile | 16 px |

---

# 11. Container Padding

| Device | Padding |
|----------|---------|
| Desktop | 32 px |
| Tablet | 24 px |
| Mobile | 16 px |

---

# 12. Layout Patterns

## Single Column

Digunakan pada:

- Article
- Login
- Register
- FAQ

---

## Two Columns

Digunakan pada:

- Hero
- About
- Contact

---

## Three Columns

Digunakan pada:

- Feature
- Service
- Promotion

---

## Four Columns

Digunakan pada:

- Doctor Grid
- Branch Grid
- Dashboard Cards

---

# 13. Landing Website Layout

```text
Container

12 Columns

--------------------------------------

Hero

12

--------------------------------------

Services

4 | 4 | 4

--------------------------------------

Doctors

3 | 3 | 3 | 3

--------------------------------------

Promotion

6 | 6

--------------------------------------

Article

4 | 4 | 4
```

---

# 14. Dashboard Layout

```text
Sidebar

2

Main Content

10
```

---

Dashboard Widget

```text
3 | 3 | 3 | 3
```

---

Table

```text
12
```

---

# 15. Mobile Layout

Semua layout berubah menjadi single-column bila diperlukan.

Contoh:

Desktop

```text
4 | 4 | 4
```

↓

Tablet

```text
6 | 6
```

↓

Mobile

```text
12
12
12
```

---

# 16. Responsive Rules

Desktop

12 Grid

↓

Tablet

8 Grid

↓

Mobile

4 Grid

Komponen tidak boleh keluar dari Container.

---

# 17. Nested Grid

Nested Grid diperbolehkan maksimal:

2 Level

Contoh:

```text
Container

↓

12 Columns

↓

Card

↓

2 Columns
```

Lebih dari dua level harus dihindari.

---

# 18. Alignment Rules

Gunakan alignment berikut:

Horizontal

- Left
- Center
- Right

Vertical

- Top
- Middle
- Bottom

Distribusi:

- Space Between
- Space Around
- Space Evenly

---

# 19. CSS Variables

```css
:root{

--container-xl:1440px;

--container-lg:1280px;

--container-md:1140px;

--gutter-desktop:24px;

--gutter-tablet:20px;

--gutter-mobile:16px;

}
```

---

# 20. Tailwind Mapping

```ts
container:{

center:true,

padding:{

DEFAULT:"16px",

md:"24px",

lg:"32px",

xl:"32px",

},

screens:{

sm:"640px",

md:"768px",

lg:"1024px",

xl:"1280px",

"2xl":"1440px"

}

}
```

---

# 21. Flutter Mapping

Gunakan:

```dart
LayoutBuilder

↓

MediaQuery

↓

ConstrainedBox

↓

Expanded

↓

Flexible
```

Gunakan GridView dengan jumlah kolom sesuai breakpoint.

Contoh:

Desktop

4 Columns

Tablet

2 Columns

Mobile

1 Column

---

# 22. Figma Layout Grid

Gunakan:

Desktop

- 12 Columns
- Margin 32
- Gutter 24

Tablet

- 8 Columns
- Margin 24
- Gutter 20

Mobile

- 4 Columns
- Margin 16
- Gutter 16

Seluruh Frame wajib menggunakan Layout Grid.

---

# 23. Do & Don't

## ✅ Do

- Gunakan Layout Grid pada seluruh halaman.
- Gunakan Container.
- Gunakan Gutter yang konsisten.
- Gunakan Column Span sesuai kebutuhan.
- Gunakan Nested Grid maksimal 2 level.

---

## ❌ Don't

- Menempatkan komponen di luar Container.
- Menggunakan margin acak.
- Membuat layout tanpa grid.
- Mengubah jumlah kolom di luar standar.
- Menggunakan absolute positioning untuk layout utama.

---

# 24. Change Management

Perubahan Grid System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui pada Figma Layout Grid.
3. Diperbarui pada Tailwind Config.
4. Diperbarui pada Flutter Layout.
5. Diuji pada seluruh breakpoint.

---

# 25. Acceptance Criteria

- Seluruh halaman menggunakan Grid System.
- Seluruh komponen berada di dalam Container.
- Menggunakan 12-Column Grid untuk Desktop.
- Menggunakan 8-Column Grid untuk Tablet.
- Menggunakan 4-Column Grid untuk Mobile.
- Tidak ada layout yang keluar dari viewport.
- Mendukung seluruh platform.
- Konsisten pada Figma, Next.js, dan Flutter.
