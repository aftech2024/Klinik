# 01 - Color System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/01-Color.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Color System mendefinisikan seluruh warna yang digunakan pada seluruh platform Clinic Management System.

Seluruh komponen UI wajib menggunakan token warna yang telah ditentukan. Penggunaan nilai warna secara langsung (hardcoded HEX/RGB) tidak diperbolehkan.

---

# 2. Design Principles

## Consistency

Semua komponen menggunakan token warna yang sama.

## Accessibility

Seluruh kombinasi warna harus memenuhi standar **WCAG 2.2 AA**.

## Scalability

Palette dapat diperluas tanpa mengubah komponen yang sudah ada.

## Semantic

Warna harus merepresentasikan makna, bukan sekadar tampilan.

Contoh:

* Gunakan `color-success-500`
* Jangan gunakan `color-green`

---

# 3. Brand Identity

Healthcare membutuhkan kesan:

* Profesional
* Bersih
* Modern
* Aman
* Terpercaya
* Mudah dibaca

Karena itu warna utama menggunakan **Blue** dengan aksen **Sky Blue** dan dominasi **White**.

---

# 4. Brand Palette

## Primary

Digunakan untuk aksi utama, link aktif, CTA, dan elemen penting.

| Token       | HEX     | Usage                      |
| ----------- | ------- | -------------------------- |
| Primary-50  | #EFF8FF | Background lembut          |
| Primary-100 | #D1E9FF | Hover ringan               |
| Primary-200 | #B2DDFF | Badge                      |
| Primary-300 | #84CAFF | Icon                       |
| Primary-400 | #53B1FD | Secondary CTA              |
| Primary-500 | #2E90FA | Default Brand              |
| Primary-600 | #1570EF | Primary Button             |
| Primary-700 | #175CD3 | Hover                      |
| Primary-800 | #1849A9 | Active                     |
| Primary-900 | #194185 | Heading pada area berwarna |

---

## Secondary

| Token         | HEX     |
| ------------- | ------- |
| Secondary-50  | #F0FDFA |
| Secondary-100 | #CCFBF1 |
| Secondary-200 | #99F6E4 |
| Secondary-300 | #5EEAD4 |
| Secondary-400 | #2DD4BF |
| Secondary-500 | #14B8A6 |
| Secondary-600 | #0D9488 |
| Secondary-700 | #0F766E |
| Secondary-800 | #115E59 |
| Secondary-900 | #134E4A |

Digunakan untuk elemen pendukung dan ilustrasi.

---

# 5. Neutral Palette

| Token    | HEX     |
| -------- | ------- |
| White    | #FFFFFF |
| Gray-50  | #F9FAFB |
| Gray-100 | #F3F4F6 |
| Gray-200 | #E5E7EB |
| Gray-300 | #D1D5DB |
| Gray-400 | #9CA3AF |
| Gray-500 | #6B7280 |
| Gray-600 | #4B5563 |
| Gray-700 | #374151 |
| Gray-800 | #1F2937 |
| Gray-900 | #111827 |
| Black    | #000000 |

Digunakan untuk background, teks, border, dan surface.

---

# 6. Semantic Palette

## Success

| Token       | HEX     |
| ----------- | ------- |
| Success-50  | #ECFDF3 |
| Success-100 | #D1FADF |
| Success-300 | #6CE9A6 |
| Success-500 | #12B76A |
| Success-700 | #027A48 |
| Success-900 | #054F31 |

Contoh penggunaan:

* Appointment berhasil
* Pembayaran sukses
* Status aktif

---

## Warning

| Token       | HEX     |
| ----------- | ------- |
| Warning-50  | #FFFAEB |
| Warning-100 | #FEF0C7 |
| Warning-300 | #FEC84B |
| Warning-500 | #F79009 |
| Warning-700 | #B54708 |
| Warning-900 | #7A2E0E |

Contoh:

* Jadwal hampir penuh
* Data belum lengkap

---

## Error

| Token     | HEX     |
| --------- | ------- |
| Error-50  | #FEF3F2 |
| Error-100 | #FEE4E2 |
| Error-300 | #FDA29B |
| Error-500 | #F04438 |
| Error-700 | #B42318 |
| Error-900 | #7A271A |

Digunakan untuk:

* Validasi form
* Error API
* Gagal login

---

## Info

| Token    | HEX     |
| -------- | ------- |
| Info-50  | #EFF8FF |
| Info-100 | #D1E9FF |
| Info-300 | #84CAFF |
| Info-500 | #2E90FA |
| Info-700 | #175CD3 |
| Info-900 | #194185 |

---

# 7. Surface Colors

| Token             | Usage              |
| ----------------- | ------------------ |
| Surface-Primary   | Background utama   |
| Surface-Secondary | Section alternatif |
| Surface-Card      | Card               |
| Surface-Modal     | Modal              |
| Surface-Overlay   | Overlay            |

Default:

* Surface-Primary = White
* Surface-Secondary = Gray-50
* Surface-Card = White

---

# 8. Text Colors

| Token          | Usage            |
| -------------- | ---------------- |
| Text-Primary   | Heading          |
| Text-Secondary | Body             |
| Text-Tertiary  | Caption          |
| Text-Inverse   | Background gelap |
| Text-Disabled  | Disabled         |

Mapping:

* Text-Primary → Gray-900
* Text-Secondary → Gray-700
* Text-Tertiary → Gray-500
* Text-Disabled → Gray-400
* Text-Inverse → White

---

# 9. Border Colors

| Token          | Usage       |
| -------------- | ----------- |
| Border-Default | Gray-200    |
| Border-Strong  | Gray-300    |
| Border-Focus   | Primary-500 |
| Border-Error   | Error-500   |
| Border-Success | Success-500 |

---

# 10. Background Mapping

| Component | Background |
| --------- | ---------- |
| Body      | White      |
| Card      | White      |
| Sidebar   | White      |
| Navbar    | White      |
| Footer    | Gray-900   |
| Modal     | White      |
| Tooltip   | Gray-900   |

---

# 11. Component Color Mapping

## Button

Primary → Primary-600

Hover → Primary-700

Pressed → Primary-800

Disabled → Gray-300

---

## Input

Border → Gray-300

Focus → Primary-500

Error → Error-500

Disabled → Gray-200

---

## Badge

Success → Success-500

Warning → Warning-500

Error → Error-500

Info → Info-500

Neutral → Gray-500

---

## Card

Background → White

Border → Gray-200

Shadow → Shadow-SM

---

# 12. Dark Theme

Semua token wajib memiliki pasangan Dark Theme.

Contoh:

| Light       | Dark        |
| ----------- | ----------- |
| White       | Gray-900    |
| Gray-900    | Gray-50     |
| Primary-600 | Primary-400 |

Dark Theme akan diimplementasikan pada Phase 2.

---

# 13. CSS Variables

```css
--color-primary-600: #1570EF;
--color-gray-100: #F3F4F6;
--color-success-500: #12B76A;
--color-error-500: #F04438;
```

---

# 14. Tailwind Mapping

```ts
colors: {
  primary: {
    50: "#EFF8FF",
    100: "#D1E9FF",
    500: "#2E90FA",
    600: "#1570EF",
    700: "#175CD3",
    900: "#194185"
  }
}
```

---

# 15. Flutter Mapping

```dart
class AppColors {
  static const primary600 = Color(0xFF1570EF);
  static const success500 = Color(0xFF12B76A);
  static const error500 = Color(0xFFF04438);
  static const gray100 = Color(0xFFF3F4F6);
}
```

---

# 16. Figma Variables

Collection:

* Color / Primary
* Color / Neutral
* Color / Semantic
* Color / Surface
* Color / Text
* Color / Border

Semua komponen Figma wajib menggunakan Variables, bukan nilai HEX langsung.

---

# 17. Do & Don't

## ✅ Do

* Gunakan token (`Primary-600`, `Gray-200`, `Success-500`).
* Gunakan semantic color sesuai konteks.
* Gunakan kontras yang memenuhi WCAG.

## ❌ Don't

* Hardcode warna (`#1570EF`).
* Menggunakan warna merah untuk status sukses.
* Menggunakan terlalu banyak warna dalam satu layar.

---

# 18. Accessibility

* Kontras teks normal minimal **4.5:1**.
* Kontras teks besar minimal **3:1**.
* Jangan mengandalkan warna saja untuk menyampaikan informasi; gunakan ikon atau teks pendukung.
* Focus state harus tetap terlihat pada semua tema.

---

# 19. Change Management

Perubahan pada Color System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui di Figma Variables.
3. Diperbarui di Design Token.
4. Diuji pada Web dan Flutter.
5. Dicatat pada changelog.

---

# 20. Acceptance Criteria

* Seluruh warna menggunakan Design Token.
* Tidak ada hardcoded HEX pada komponen.
* Mendukung Light Theme.
* Siap untuk Dark Theme.
* Memenuhi WCAG 2.2 AA.
* Konsisten pada Next.js, Flutter, dan Figma.
* Menjadi referensi tunggal untuk seluruh sistem warna.
