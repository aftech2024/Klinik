# 12 - Accessibility System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/12-Accessibility.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Accessibility System mendefinisikan standar aksesibilitas untuk seluruh produk Clinic Management System.

Dokumen ini memastikan aplikasi dapat digunakan oleh semua pengguna, termasuk pengguna dengan keterbatasan penglihatan, pendengaran, motorik, maupun kognitif.

Standar ini berlaku untuk:

- Landing Website
- Patient Portal
- Admin Dashboard
- Android
- iOS

---

# 2. Accessibility Goals

Seluruh produk harus memenuhi minimal:

- WCAG 2.2 Level AA
- Keyboard Accessible
- Screen Reader Friendly
- Responsive
- High Contrast Support
- Dark Theme Support

---

# 3. Design Principles

## Perceivable

Informasi harus dapat dilihat atau didengar.

---

## Operable

Seluruh fitur dapat dioperasikan menggunakan keyboard maupun layar sentuh.

---

## Understandable

Tampilan harus mudah dipahami.

---

## Robust

Komponen harus kompatibel dengan teknologi bantu.

---

# 4. Color Contrast

Minimal rasio kontras:

| Element | Ratio |
|----------|--------|
| Normal Text | 4.5 : 1 |
| Large Text | 3 : 1 |
| Icon | 3 : 1 |
| Button | 4.5 : 1 |
| Input | 4.5 : 1 |

Tidak diperbolehkan menggunakan kombinasi warna yang gagal memenuhi standar.

---

# 5. Typography Accessibility

Minimum ukuran font:

Body

16 px

Caption

14 px

Heading mengikuti Typography System.

Gunakan line-height minimal 1.5.

Jangan menggunakan teks seluruhnya huruf kapital untuk paragraf.

---

# 6. Touch Target

Seluruh elemen interaktif harus memiliki ukuran minimum:

44 × 44 px

Contoh:

- Button
- Icon Button
- Checkbox
- Radio
- Switch
- Menu

---

# 7. Keyboard Navigation

Semua elemen interaktif harus dapat diakses menggunakan:

- Tab
- Shift + Tab
- Enter
- Space
- Escape
- Arrow Key (jika relevan)

Urutan fokus harus logis.

---

# 8. Focus Indicator

Seluruh elemen fokus wajib memiliki Focus Ring.

Contoh:

- Border Primary
- Outline 2 px
- Radius mengikuti Radius System

Focus tidak boleh dihilangkan menggunakan:

```css
outline: none;
```

Kecuali diganti dengan indikator yang setara.

---

# 9. Screen Reader

Semua komponen harus memiliki label yang sesuai.

Contoh:

```html
<button aria-label="Cari dokter">
```

Input:

```html
<label for="email">
Email
</label>
<input id="email">
```

Ikon dekoratif:

```html
aria-hidden="true"
```

---

# 10. Images

Seluruh gambar informatif wajib memiliki:

```html
alt=""
```

Contoh:

```html
<img
alt="Dokter Spesialis Anak"
>
```

Gambar dekoratif:

```html
alt=""
```

---

# 11. Forms

Seluruh form wajib memiliki:

- Label
- Placeholder (opsional)
- Helper Text
- Error Message
- Success State

Label tidak boleh digantikan oleh placeholder.

---

# 12. Error Handling

Error harus ditampilkan menggunakan:

- Warna
- Ikon
- Teks

Contoh:

❌ Jangan hanya border merah.

✔ Border merah

✔ Icon Error

✔ Pesan validasi

---

# 13. Motion Accessibility

Jika pengguna mengaktifkan:

Reduce Motion

Aplikasi harus:

- Mengurangi animasi
- Menghilangkan efek Scale
- Menghilangkan animasi kompleks
- Menggunakan Fade sederhana

---

# 14. High Contrast Mode

Aplikasi harus tetap dapat digunakan pada:

- Windows High Contrast
- Android Accessibility
- iOS Accessibility

Gunakan Theme System.

---

# 15. Dark Mode

Seluruh komponen harus:

- Memiliki kontras yang cukup
- Tetap terbaca
- Tidak mengandalkan shadow saja

---

# 16. Icon Accessibility

Ikon tidak boleh menjadi satu-satunya indikator.

Contoh:

✔ Icon

+

✔ Text

Lebih baik daripada hanya Icon.

---

# 17. Table Accessibility

Table harus memiliki:

```html
<thead>

<tbody>

<th>

<td>
```

Gunakan header yang jelas.

Pada mobile, tabel dapat berubah menjadi Card/List tanpa menghilangkan informasi penting.

---

# 18. Modal Accessibility

Modal wajib memiliki:

- Focus Trap
- ESC untuk menutup
- Overlay
- Tombol Close
- Judul yang jelas

Saat modal terbuka, fokus berpindah ke modal.

---

# 19. Notification Accessibility

Toast harus:

- Tidak menutupi elemen penting
- Memiliki durasi yang cukup
- Dapat ditutup secara manual jika diperlukan

Alert penting tidak boleh hilang otomatis.

---

# 20. Loading Accessibility

Gunakan:

- Skeleton
- Loading Text
- aria-busy="true"

Jangan hanya menggunakan spinner tanpa konteks.

---

# 21. Responsive Accessibility

Seluruh komponen harus dapat digunakan pada:

- Mobile
- Tablet
- Desktop

Tidak boleh ada:

- Horizontal Scroll yang tidak perlu
- Tombol terlalu kecil
- Konten terpotong

---

# 22. Flutter Accessibility

Gunakan:

- Semantics
- ExcludeSemantics
- Tooltip
- FocusNode
- FocusTraversalGroup

Seluruh widget penting harus memiliki label.

---

# 23. Web Accessibility

Gunakan elemen HTML semantik.

Contoh:

```html
<header>

<nav>

<main>

<section>

<article>

<footer>
```

Hindari penggunaan `<div>` untuk semua elemen.

---

# 24. QA Checklist

Pastikan:

- Kontras memenuhi WCAG AA.
- Semua tombol dapat diakses dengan keyboard.
- Focus Ring terlihat.
- Screen Reader membaca label dengan benar.
- Form memiliki label.
- Error dapat dipahami.
- Dark Mode tetap terbaca.
- High Contrast tetap berfungsi.
- Tidak ada elemen interaktif berukuran kurang dari 44 × 44 px.

---

# 25. Do & Don't

## ✅ Do

- Gunakan semantic HTML.
- Gunakan Focus Ring.
- Gunakan Label.
- Gunakan Alt Text.
- Gunakan Error Message yang jelas.
- Uji dengan keyboard dan screen reader.

---

## ❌ Don't

- Menghilangkan Focus Indicator.
- Menggunakan warna sebagai satu-satunya indikator.
- Menggunakan placeholder sebagai label.
- Membuat tombol terlalu kecil.
- Menggunakan teks dengan kontras rendah.
- Mengandalkan hover untuk fungsi penting.

---

# 26. Change Management

Perubahan Accessibility System harus:

1. Disetujui UI/UX Lead.
2. Diverifikasi oleh QA.
3. Diuji menggunakan Screen Reader.
4. Diuji menggunakan Keyboard Navigation.
5. Memenuhi WCAG 2.2 Level AA.

---

# 27. Acceptance Criteria

- Seluruh halaman memenuhi WCAG 2.2 AA.
- Seluruh komponen mendukung keyboard navigation.
- Focus Ring selalu terlihat.
- Form memiliki label dan validasi yang jelas.
- Mendukung Screen Reader.
- Mendukung High Contrast.
- Mendukung Dark Theme.
- Konsisten pada Web, Android, dan iOS.

---

# 28. Future Roadmap

## Version 1.1

- Voice Navigation
- Live Region Support
- Skip Navigation Link
- Accessible Charts

## Version 2.0

- WCAG 3.0 Readiness
- AI Accessibility Audit
- Dynamic Accessibility Settings
- Cognitive Accessibility Support
