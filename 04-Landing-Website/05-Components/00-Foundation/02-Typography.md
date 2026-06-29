# 02 - Typography System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/02-Typography.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Typography System mendefinisikan standar tipografi yang digunakan pada seluruh produk Clinic Management System.

Typography bertujuan untuk:

- Meningkatkan keterbacaan (Readability)
- Menjaga konsistensi visual
- Mendukung aksesibilitas
- Mempermudah implementasi lintas platform
- Menjadi dasar seluruh komponen UI

Seluruh komponen wajib menggunakan Typography Token dan tidak diperbolehkan menggunakan ukuran font secara hardcoded.

---

# 2. Design Principles

Typography mengikuti prinsip berikut:

## Readability

Teks harus mudah dibaca pada seluruh ukuran layar.

## Consistency

Ukuran font, line-height, dan font-weight harus konsisten.

## Accessibility

Memenuhi standar WCAG 2.2 AA.

## Scalability

Mudah diperluas untuk modul baru.

## Responsive

Ukuran font dapat beradaptasi terhadap perangkat.

---

# 3. Font Family

## Primary Font

Inter

Digunakan untuk:

- Landing Website
- Dashboard
- Patient Portal
- Flutter

---

## Fallback Font

```text
Inter
↓
Segoe UI
↓
Roboto
↓
Helvetica
↓
Arial
↓
sans-serif
```

---

## Monospace

Digunakan pada:

- Source Code
- API Response
- JSON Viewer
- Terminal

```text
JetBrains Mono
↓
Consolas
↓
monospace
```

---

# 4. Font Weight

| Token | Weight | Usage |
|---------|--------|--------------------|
| Light | 300 | Sangat jarang |
| Regular | 400 | Body Text |
| Medium | 500 | Label |
| SemiBold | 600 | Button, Subtitle |
| Bold | 700 | Heading |
| ExtraBold | 800 | Hero |

---

# 5. Typography Scale

Menggunakan sistem 8-point dan modular scale.

| Token | Size | Line Height |
|---------|------|-------------|
| Display XL | 64 | 72 |
| Display LG | 56 | 64 |
| Display MD | 48 | 56 |
| Display SM | 40 | 48 |
| Heading XL | 36 | 44 |
| Heading LG | 32 | 40 |
| Heading MD | 28 | 36 |
| Heading SM | 24 | 32 |
| Title LG | 20 | 28 |
| Title MD | 18 | 28 |
| Title SM | 16 | 24 |
| Body LG | 18 | 28 |
| Body MD | 16 | 24 |
| Body SM | 14 | 20 |
| Caption | 12 | 18 |
| Overline | 10 | 16 |

---

# 6. Heading Hierarchy

## H1

Display XL

Digunakan pada:

- Hero Landing Page
- Campaign
- Halaman Utama

---

## H2

Heading XL

Digunakan untuk:

- Judul Section

---

## H3

Heading LG

Digunakan pada:

- Sub Section

---

## H4

Heading MD

---

## H5

Heading SM

---

## H6

Title LG

---

# 7. Body Text

## Body Large

18 px

Digunakan untuk:

- Hero Description
- Landing Description

---

## Body Medium

16 px

Default.

Digunakan pada hampir seluruh teks.

---

## Body Small

14 px

Digunakan pada:

- Card
- Table
- List

---

## Caption

12 px

Digunakan pada:

- Helper Text
- Metadata
- Timestamp

---

# 8. Letter Spacing

| Token | Value |
|---------|-------|
| Tight | -0.02em |
| Normal | 0 |
| Wide | 0.02em |

Default:

Normal

---

# 9. Line Height Rules

Heading

120%

Body

150%

Caption

150%

Button

100%

---

# 10. Text Alignment

Default

Left

---

Center

Digunakan pada:

- Hero
- Empty State
- Loading

---

Right

Hanya untuk data numerik atau tabel tertentu.

---

# 11. Text Transform

Default

None

Gunakan huruf besar-kecil secara alami.

---

Button

Sentence Case

---

Navigation

Sentence Case

---

Label

Sentence Case

---

Jangan menggunakan ALL CAPS kecuali untuk kebutuhan khusus seperti Badge atau Overline.

---

# 12. Responsive Typography

## Desktop

Menggunakan ukuran penuh.

---

## Tablet

Heading dapat turun satu level bila ruang terbatas.

---

## Mobile

Display XL → Display MD

Heading XL → Heading LG

Body tetap 16 px.

Minimal ukuran teks:

14 px

---

# 13. Usage Mapping

| Component | Typography |
|-----------|------------|
| Hero Title | Display XL |
| Hero Subtitle | Body LG |
| Navbar | Body MD |
| Button | Body MD SemiBold |
| Card Title | Title LG |
| Card Description | Body SM |
| Form Label | Body SM Medium |
| Input Value | Body MD |
| Table Header | Body SM SemiBold |
| Table Cell | Body SM |
| Footer | Body SM |
| Badge | Caption SemiBold |

---

# 14. Accessibility

Kontras teks mengikuti Color System.

Minimum:

- Body Text : 4.5 : 1
- Large Text : 3 : 1

Jangan menggunakan ukuran di bawah 12 px.

Pastikan line-height cukup agar mudah dibaca.

---

# 15. CSS Variables

```css
--font-family-primary: "Inter", sans-serif;

--font-size-display-xl: 64px;
--font-size-heading-xl: 36px;
--font-size-body-md: 16px;
--font-size-caption: 12px;

--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

---

# 16. Tailwind Mapping

```ts
fontFamily: {
  sans: ["Inter", "sans-serif"],
},

fontSize: {
  "display-xl": ["64px", "72px"],
  "heading-xl": ["36px", "44px"],
  "body-md": ["16px", "24px"],
  "caption": ["12px", "18px"],
},
```

---

# 17. Flutter Mapping

```dart
class AppTextTheme {

static const displayXL = TextStyle(
fontSize: 64,
fontWeight: FontWeight.w700,
height: 1.125,
);

static const headingXL = TextStyle(
fontSize: 36,
fontWeight: FontWeight.w700,
height: 1.22,
);

static const bodyMD = TextStyle(
fontSize: 16,
fontWeight: FontWeight.w400,
height: 1.5,
);

}
```

---

# 18. Figma Variables

Collection:

Typography/

- Display
- Heading
- Title
- Body
- Caption
- Overline

Setiap Text Style harus menggunakan Variables dan Auto Layout.

---

# 19. Do & Don't

## ✅ Do

- Gunakan Typography Token.
- Gunakan Heading sesuai hierarki.
- Gunakan Body MD sebagai default.
- Gunakan SemiBold untuk Button.

## ❌ Don't

- Hardcode ukuran font.
- Menggunakan lebih dari 4 level heading dalam satu section.
- Menggunakan ALL CAPS pada paragraf.
- Mengubah line-height tanpa alasan yang jelas.

---

# 20. Change Management

Setiap perubahan Typography harus:

1. Disetujui UI/UX Lead.
2. Diperbarui di Figma Text Styles.
3. Diperbarui di Tailwind Theme.
4. Diperbarui di Flutter Theme.
5. Diuji pada seluruh platform.

---

# 21. Acceptance Criteria

- Seluruh komponen menggunakan Typography Token.
- Tidak ada hardcoded font-size.
- Tidak ada hardcoded line-height.
- Konsisten pada Web, Flutter, dan Figma.
- Memenuhi standar WCAG 2.2 AA.
- Mendukung Responsive Layout.
- Siap untuk pengembangan lintas platform.
