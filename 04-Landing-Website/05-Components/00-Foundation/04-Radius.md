# 04 - Radius System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/04-Radius.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Radius System mendefinisikan standar **Border Radius** yang digunakan pada seluruh komponen UI dalam Clinic Management System.

Border Radius digunakan untuk:

- Button
- Input
- Search Bar
- Card
- Modal
- Dialog
- Badge
- Avatar
- Image
- Tooltip
- Dropdown
- Navigation
- Dashboard Widget

Seluruh komponen wajib menggunakan Radius Token dan tidak diperbolehkan menggunakan nilai radius secara langsung.

---

# 2. Design Principles

## Consistency

Seluruh komponen menggunakan radius yang sama.

---

## Modern Healthcare UI

Radius dirancang agar memberikan kesan:

- Modern
- Friendly
- Professional
- Clean
- Trusted

---

## Reusable

Radius dapat digunakan kembali pada seluruh platform.

---

## Responsive

Radius tetap konsisten pada Desktop, Tablet, dan Mobile.

---

# 3. Radius Philosophy

Clinic Management System menggunakan **Soft Corner Design**.

Tujuan:

- Mengurangi kesan kaku.
- Meningkatkan kenyamanan visual.
- Memperkuat identitas Healthcare Digital Platform.

Tidak menggunakan sudut yang terlalu tajam maupun terlalu membulat.

---

# 4. Radius Scale

| Token | Value | Usage |
|---------|--------|----------------------------|
| radius-none | 0 px | Divider, Table |
| radius-xs | 2 px | Tooltip kecil |
| radius-sm | 4 px | Badge |
| radius-md | 8 px | Button, Input |
| radius-lg | 12 px | Card |
| radius-xl | 16 px | Modal |
| radius-2xl | 20 px | Hero Card |
| radius-3xl | 24 px | Promotional Banner |
| radius-full | 9999 px | Avatar, Pill |

---

# 5. Radius Usage

## radius-none

Digunakan untuk:

- Divider
- Table
- Progress Bar

---

## radius-xs

Digunakan untuk:

- Tooltip
- Small Indicator

---

## radius-sm

Digunakan untuk:

- Badge
- Chip
- Status Label

---

## radius-md

Default.

Digunakan untuk:

- Button
- Input
- Select
- Search
- Date Picker

---

## radius-lg

Digunakan untuk:

- Card
- Widget
- Service Card

---

## radius-xl

Digunakan untuk:

- Modal
- Drawer
- Side Panel

---

## radius-2xl

Digunakan untuk:

- Hero Banner
- Feature Card
- Landing Section

---

## radius-full

Digunakan untuk:

- Avatar
- Floating Button
- Notification Dot
- Profile Image

---

# 6. Component Mapping

| Component | Radius |
|------------|---------|
| Button | radius-md |
| Input | radius-md |
| Search Bar | radius-md |
| Card | radius-lg |
| Modal | radius-xl |
| Drawer | radius-xl |
| Hero Banner | radius-2xl |
| Promotion Banner | radius-3xl |
| Avatar | radius-full |
| Badge | radius-sm |
| Checkbox | radius-sm |
| Radio | radius-full |
| Switch | radius-full |
| Tooltip | radius-xs |

---

# 7. Responsive Rules

Radius tidak berubah berdasarkan ukuran layar.

Contoh:

Desktop

Button → radius-md

↓

Tablet

Button → radius-md

↓

Mobile

Button → radius-md

Konsistensi radius membantu menjaga identitas visual.

---

# 8. Design Token

Seluruh implementasi wajib menggunakan token berikut.

```text
radius-none
radius-xs
radius-sm
radius-md
radius-lg
radius-xl
radius-2xl
radius-3xl
radius-full
```

---

# 9. CSS Variables

```css
:root {

--radius-none: 0px;

--radius-xs: 2px;

--radius-sm: 4px;

--radius-md: 8px;

--radius-lg: 12px;

--radius-xl: 16px;

--radius-2xl: 20px;

--radius-3xl: 24px;

--radius-full: 9999px;

}
```

---

# 10. Tailwind Mapping

```ts
borderRadius: {

none: "0px",

xs: "2px",

sm: "4px",

md: "8px",

lg: "12px",

xl: "16px",

"2xl": "20px",

"3xl": "24px",

full: "9999px"

}
```

---

# 11. Flutter Mapping

```dart
class AppRadius {

static const none = Radius.circular(0);

static const xs = Radius.circular(2);

static const sm = Radius.circular(4);

static const md = Radius.circular(8);

static const lg = Radius.circular(12);

static const xl = Radius.circular(16);

static const xxl = Radius.circular(20);

static const xxxl = Radius.circular(24);

}
```

Contoh penggunaan:

```dart
Container(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.all(AppRadius.lg),
  ),
)
```

---

# 12. Figma Variables

Collection:

```
Radius/
```

Variables:

```
None
XS
SM
MD
LG
XL
2XL
3XL
Full
```

Seluruh Component Set wajib menggunakan Variable.

Tidak diperbolehkan menggunakan nilai radius manual.

---

# 13. Usage Examples

## Button

```text
┌──────────────────────┐
│      Login           │
└──────────────────────┘

Radius : MD (8px)
```

---

## Card

```text
┌──────────────────────────────┐
│ Doctor Card                  │
│                              │
│ Dr. Budi                     │
└──────────────────────────────┘

Radius : LG (12px)
```

---

## Modal

```text
┌──────────────────────────────┐
│ Confirmation                 │
│                              │
│ ...                          │
└──────────────────────────────┘

Radius : XL (16px)
```

---

## Avatar

```text
●

Radius : FULL
```

---

# 14. Accessibility

Radius tidak boleh mengurangi:

- Area klik
- Area sentuh
- Keterbacaan komponen

Minimum touch target tetap:

44 × 44 px

Radius tidak boleh menyebabkan teks atau ikon terpotong.

---

# 15. Do & Don't

## ✅ Do

- Gunakan Radius Token.
- Gunakan radius yang sama untuk komponen sejenis.
- Gunakan `radius-full` hanya untuk elemen berbentuk lingkaran atau pill.

---

## ❌ Don't

- Hardcode `border-radius: 7px`.
- Menggunakan radius berbeda untuk Button dengan fungsi yang sama.
- Menggunakan radius berlebihan pada tabel atau data padat.
- Mengubah radius hanya untuk alasan estetika tanpa pertimbangan konsistensi.

---

# 16. Change Management

Perubahan Radius System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui di Figma Variables.
3. Diperbarui pada Tailwind Theme.
4. Diperbarui pada Flutter Constants.
5. Diverifikasi pada seluruh komponen.

---

# 17. Acceptance Criteria

- Seluruh komponen menggunakan Radius Token.
- Tidak ada hardcoded border-radius.
- Konsisten pada Web, Flutter, dan Figma.
- Mendukung Light Theme dan Dark Theme.
- Mendukung seluruh komponen UI.
- Mudah dipelihara dan dikembangkan.
