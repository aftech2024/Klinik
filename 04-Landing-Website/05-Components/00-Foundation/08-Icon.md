# 08 - Icon System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/08-Icon.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Icon System mendefinisikan standar penggunaan ikon pada seluruh aplikasi.

Dokumen ini mengatur:

- Icon Library
- Icon Size
- Stroke Width
- Icon Color
- Icon Placement
- Accessibility
- Responsive Behavior
- Component Mapping

Seluruh ikon wajib mengikuti standar ini.

---

# 2. Design Principles

## Consistency

Semua ikon berasal dari library yang sama.

---

## Simplicity

Gunakan ikon yang mudah dikenali.

---

## Accessibility

Ikon tidak boleh menjadi satu-satunya indikator informasi.

---

## Scalability

Mudah diperluas tanpa mengubah komponen.

---

## Performance

Gunakan SVG pada Web.

Gunakan Vector Icon pada Flutter.

---

# 3. Icon Library

## Primary

Lucide

Digunakan pada:

- Landing Website
- Dashboard
- Patient Portal
- Flutter

---

## Secondary

Material Symbols

Digunakan hanya bila Lucide tidak memiliki ikon yang dibutuhkan.

---

## Not Allowed

❌ Menggabungkan banyak library.

Contoh:

Lucide

+

Heroicons

+

Bootstrap Icons

+

Font Awesome

↓

Tidak diperbolehkan.

---

# 4. Icon Style

Gunakan:

Outline Style

---

Stroke Width

2 px

---

Rounded Corner

Default Lucide

---

Filled Icon

Tidak digunakan sebagai default.

Hanya digunakan untuk:

- Active Navigation
- Rating
- Favorite
- Notification

---

# 5. Icon Size

| Token | Size | Usage |
|--------|------|---------------------------|
| icon-xs | 12 px | Badge |
| icon-sm | 16 px | Helper Text |
| icon-md | 20 px | Input |
| icon-lg | 24 px | Default |
| icon-xl | 32 px | Hero |
| icon-2xl | 40 px | Empty State |
| icon-3xl | 48 px | Illustration |

Default:

24 px

---

# 6. Icon Color

Default mengikuti Color System.

| Usage | Color |
|---------|----------------|
| Default | Gray-600 |
| Primary | Primary-600 |
| Success | Success-500 |
| Warning | Warning-500 |
| Error | Error-500 |
| Disabled | Gray-300 |
| Inverse | White |

---

# 7. Medical Icons

Digunakan untuk fitur klinik.

| Function | Icon |
|-----------|----------------|
| Doctor | Stethoscope |
| Appointment | Calendar |
| Patient | User |
| Branch | Building |
| Pharmacy | Pill |
| Laboratory | Microscope |
| Medical Record | FileText |
| Queue | Clock3 |
| Payment | CreditCard |
| Insurance | ShieldCheck |
| Emergency | Ambulance |
| Vaccination | Syringe |
| Report | ClipboardList |
| Dashboard | LayoutDashboard |

---

# 8. Navigation Icons

| Menu | Icon |
|----------|----------------|
| Home | House |
| About | Info |
| Service | BriefcaseMedical |
| Doctor | Stethoscope |
| Branch | Building2 |
| Promotion | BadgePercent |
| Article | Newspaper |
| Contact | Phone |
| FAQ | CircleHelp |
| Login | LogIn |
| Register | UserPlus |
| Profile | UserCircle |
| Notification | Bell |
| Settings | Settings |

---

# 9. Action Icons

| Action | Icon |
|-----------|-------------|
| Add | Plus |
| Edit | Pencil |
| Delete | Trash2 |
| Save | Save |
| Download | Download |
| Upload | Upload |
| Refresh | RefreshCw |
| Search | Search |
| Filter | SlidersHorizontal |
| Sort | ArrowUpDown |
| Export | FileOutput |
| Import | FileInput |
| Print | Printer |
| Share | Share2 |
| Copy | Copy |
| View | Eye |
| Hide | EyeOff |
| Back | ArrowLeft |
| Next | ArrowRight |
| Close | X |

---

# 10. Status Icons

| Status | Icon |
|------------|-------------|
| Success | CircleCheck |
| Warning | TriangleAlert |
| Error | CircleX |
| Info | CircleAlert |
| Pending | Clock |
| Loading | LoaderCircle |

---

# 11. Icon Placement

## Button

```
[ Icon ] Label
```

Gap

8 px

---

## Input

```
[ Search ]

──────────────
```

Padding

16 px

---

## Card

```
Icon

Title

Description
```

---

## Navbar

Logo

↓

Navigation Icon

↓

Profile

---

# 12. Component Mapping

| Component | Size |
|------------|--------|
| Button | 20 px |
| Input | 20 px |
| Search Bar | 20 px |
| Navbar | 24 px |
| Sidebar | 20 px |
| Card | 24 px |
| Hero | 40 px |
| Empty State | 48 px |
| Table Action | 18–20 px |
| Modal | 20 px |

---

# 13. Responsive Behavior

Desktop

24 px

↓

Tablet

24 px

↓

Mobile

20 px

Hero Icon

40 px

↓

32 px

---

# 14. Accessibility

Seluruh ikon interaktif harus memiliki:

aria-label

Contoh

```html
<button aria-label="Search">
```

Ikon dekoratif

```html
aria-hidden="true"
```

Jangan gunakan ikon tanpa label pada aksi penting.

---

# 15. CSS Variables

```css
:root{

--icon-xs:12px;

--icon-sm:16px;

--icon-md:20px;

--icon-lg:24px;

--icon-xl:32px;

--icon-2xl:40px;

--icon-3xl:48px;

}
```

---

# 16. Tailwind Mapping

```tsx
className="w-5 h-5"

↓

20 px

className="w-6 h-6"

↓

24 px
```

---

# 17. Flutter Mapping

```dart
Icon(
LucideIcons.search,
size:24,
)
```

Gunakan ukuran sesuai token.

---

# 18. Figma Guidelines

Gunakan:

Lucide Icon Plugin

Semua ikon dibuat sebagai:

Component

↓

Variants

↓

Auto Layout Compatible

Tidak melakukan edit manual pada SVG.

---

# 19. Icon Naming Convention

Gunakan nama asli library.

Contoh:

```
Search

ArrowLeft

ArrowRight

Trash2

CircleCheck

Building2

Calendar

Clock3
```

Jangan mengganti nama icon.

---

# 20. Do & Don't

## ✅ Do

- Gunakan Lucide sebagai library utama.
- Gunakan ukuran sesuai token.
- Gunakan warna dari Color System.
- Gunakan ikon yang memiliki makna jelas.
- Gunakan SVG pada Web.

---

## ❌ Don't

- Menggabungkan beberapa icon library.
- Mengubah bentuk ikon.
- Mengubah stroke width.
- Menggunakan ikon dekoratif secara berlebihan.
- Menggunakan ikon tanpa label pada aksi penting.

---

# 21. Change Management

Perubahan Icon System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui pada Figma Library.
3. Diperbarui pada Next.js Component Library.
4. Diperbarui pada Flutter Component Library.
5. Diverifikasi oleh QA.

---

# 22. Acceptance Criteria

- Seluruh ikon menggunakan Lucide.
- Ukuran ikon mengikuti token.
- Warna mengikuti Color System.
- Tidak ada pencampuran library.
- Mendukung Web, Flutter, dan Figma.
- Memenuhi standar aksesibilitas.
- Konsisten pada seluruh aplikasi.

---

# 23. Recommended Package

## Next.js

```bash
npm install lucide-react
```

---

## Flutter

```yaml
dependencies:
  flutter_lucide: latest
```

---

## Figma

Gunakan plugin:

```
Lucide Icons
```

Sebagai satu-satunya sumber ikon pada Design System.

---

# 24. Future Roadmap

## Version 1.1

- Animated Icons
- Medical Custom Icons
- Brand Icons
- Payment Icons

## Version 2.0

- Dynamic Icon Theme
- Icon Variants (Outline / Filled)
- RTL Icon Support
- Adaptive Icon Rendering
