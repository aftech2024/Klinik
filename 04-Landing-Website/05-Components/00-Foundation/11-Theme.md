# 11 - Theme System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/11-Theme.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Theme System mendefinisikan bagaimana seluruh tampilan aplikasi berubah tanpa mengubah struktur komponen.

Theme mengatur:

- Brand Color
- Surface
- Background
- Typography Color
- Shadow
- Border
- Icon
- State Color
- Component Appearance

Theme memungkinkan aplikasi mendukung:

- Light Theme
- Dark Theme
- High Contrast
- Brand Theme
- White Label Theme
- Future Theme

---

# 2. Theme Architecture

```

Brand

↓

Theme

↓

Semantic Token

↓

Component

↓

Page

```

Komponen tidak boleh menggunakan warna secara langsung.

Seluruh warna berasal dari Theme.

---

# 3. Theme Philosophy

Component

↓

Menggunakan Semantic Token

↓

Semantic Token

↓

Mengambil nilai dari Theme

↓

Theme

↓

Mengambil nilai dari Brand

Dengan demikian perubahan Brand tidak memerlukan perubahan Component.

---

# 4. Supported Theme

| Theme | Status |
|----------|-----------|
| Light | Default |
| Dark | Supported |
| High Contrast | Supported |
| Brand Theme | Supported |
| White Label | Supported |

---

# 5. Theme Structure

```

Theme

├── Color

├── Surface

├── Background

├── Border

├── Typography

├── Icon

├── Shadow

├── State

└── Elevation

```

---

# 6. Light Theme

Background

↓

White

Surface

↓

Gray 50

Primary

↓

Primary 600

Text

↓

Gray 900

Border

↓

Gray 200

---

# 7. Dark Theme

Background

↓

Gray 950

Surface

↓

Gray 900

Primary

↓

Primary 400

Text

↓

Gray 50

Border

↓

Gray 700

---

# 8. High Contrast Theme

Background

↓

Black

Surface

↓

Black

Primary

↓

Yellow

Text

↓

White

Border

↓

White

Digunakan untuk kebutuhan Accessibility.

---

# 9. Brand Theme

Setiap cabang klinik dapat memiliki Brand Theme sendiri.

Contoh

```

Clinic Jakarta

Primary

↓

Blue

Clinic Surabaya

Primary

↓

Green

Clinic Bali

Primary

↓

Orange

```

Komponen tetap sama.

Hanya Theme yang berubah.

---

# 10. Semantic Token

Komponen tidak boleh menggunakan:

```

Primary500

```

Gunakan:

```

color-primary

```

Button Primary

↓

color-primary

↓

Theme

↓

Blue

---

# 11. Surface Token

| Token | Usage |
|------------|----------------|
| Surface 1 | Background |
| Surface 2 | Card |
| Surface 3 | Modal |
| Surface 4 | Drawer |
| Surface 5 | Floating |

---

# 12. Background Token

| Token | Usage |
|------------|-------------|
| Background Primary | Main |
| Background Secondary | Section |
| Background Accent | Highlight |

---

# 13. Border Token

| Token | Usage |
|------------|----------------|
| Border Primary | Default |
| Border Secondary | Divider |
| Border Focus | Input Focus |
| Border Error | Validation |

---

# 14. Typography Theme

| Token | Usage |
|------------|------------|
| Text Primary | Heading |
| Text Secondary | Description |
| Text Disabled | Disabled |
| Text Inverse | White Text |

---

# 15. Icon Theme

| Token | Usage |
|------------|-------------|
| Icon Primary | Default |
| Icon Secondary | Secondary |
| Icon Disabled | Disabled |
| Icon Inverse | White |

---

# 16. Shadow Theme

Light Theme

↓

Shadow aktif

Dark Theme

↓

Shadow dikurangi

↓

Surface Contrast ditingkatkan

---

# 17. Elevation Theme

Seluruh Elevation mengikuti:

Elevation.md

Tidak berubah antar Theme.

---

# 18. State Theme

Success

↓

Green

Warning

↓

Orange

Danger

↓

Red

Info

↓

Blue

State Color tidak boleh berubah antar Theme.

---

# 19. CSS Variables

```css
:root{

--color-primary:#2563EB;

--surface:#FFFFFF;

--background:#F8FAFC;

--text:#111827;

}

[data-theme="dark"]{

--color-primary:#60A5FA;

--surface:#111827;

--background:#030712;

--text:#F9FAFB;

}
```

---

# 20. Tailwind Mapping

Gunakan CSS Variables.

```css
bg-[var(--background)]

text-[var(--text)]

border-[var(--border)]

text-[var(--color-primary)]
```

Tidak menggunakan warna hardcoded.

---

# 21. Flutter ThemeData

Gunakan:

```
ThemeData

↓

ColorScheme

↓

TextTheme

↓

IconTheme

↓

InputDecorationTheme

↓

CardTheme

↓

ButtonTheme
```

Seluruh Widget mengambil warna dari Theme.

---

# 22. Figma Variables

Collection

```
Theme/

Light

Dark

Brand

```

Semua Component menggunakan Variable Mode.

---

# 23. Accessibility

Minimal mendukung:

- Dark Theme
- High Contrast
- Dynamic Text
- Focus Visible

---

# 24. Theme Switching

User dapat memilih:

- Light
- Dark
- System

System mengikuti Operating System.

---

# 25. White Label Support

Theme dapat diganti tanpa mengubah:

- Component
- Layout
- Navigation
- Animation

Hanya Theme yang berubah.

---

# 26. Future Brand Expansion

Jika klinik berkembang menjadi:

- Hospital
- Pharmacy
- Laboratory
- Insurance

Cukup menambahkan Theme baru.

---

# 27. Do & Don't

## ✅ Do

- Gunakan Semantic Token.
- Gunakan Theme Provider.
- Gunakan CSS Variables.
- Gunakan ThemeData di Flutter.
- Gunakan Figma Variables.

---

## ❌ Don't

- Hardcode warna.
- Hardcode background.
- Hardcode text color.
- Mengubah Component ketika hanya Theme yang berubah.

---

# 28. Change Management

Perubahan Theme harus:

1. Disetujui UI Lead.
2. Diperbarui pada Design Token.
3. Diperbarui pada Figma Variables.
4. Diperbarui pada Tailwind Theme.
5. Diperbarui pada Flutter ThemeData.
6. Diverifikasi oleh QA.

---

# 29. Acceptance Criteria

- Seluruh komponen menggunakan Theme.
- Tidak ada warna hardcoded.
- Mendukung Light Theme.
- Mendukung Dark Theme.
- Mendukung Brand Theme.
- Mendukung White Label.
- Konsisten pada Figma, Web, dan Flutter.

---

# 30. Future Roadmap

## Version 1.1

- Dynamic Theme
- Theme API
- Remote Theme
- Tenant Theme

## Version 2.0

- AI Theme Generator
- Seasonal Theme
- Campaign Theme
- Dynamic Branding
