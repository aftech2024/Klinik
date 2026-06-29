# 03 - Layout Structure

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Version:** 1.0.0

**Status:** Draft

---

# 1. Document Purpose

Dokumen ini mendefinisikan struktur layout standar yang digunakan oleh seluruh halaman Landing Website.

Tujuan:

* Menyamakan pola layout seluruh halaman.
* Menjadi acuan UI/UX Designer.
* Menjadi acuan Frontend Developer.
* Menjadi dasar Component Library.
* Memastikan pengalaman pengguna konsisten.

---

# 2. Design Principles

Landing Website harus memiliki karakteristik:

* Clean
* Modern
* Professional Healthcare
* Minimalist
* Responsive
* Fast
* Conversion Oriented
* Accessibility First

---

# 3. Responsive Breakpoints

| Device  |        Width |
| ------- | -----------: |
| Mobile  |   360–767 px |
| Tablet  |  768–1023 px |
| Laptop  | 1024–1439 px |
| Desktop |     ≥1440 px |

---

# 4. Container Width

| Device  | Max Width |
| ------- | --------: |
| Mobile  |      100% |
| Tablet  |    720 px |
| Laptop  |   1140 px |
| Desktop |   1320 px |

Container menggunakan margin otomatis (auto) agar konten selalu berada di tengah.

---

# 5. Grid System

Menggunakan 12 Column Grid.

Desktop

```text
|1|2|3|4|5|6|7|8|9|10|11|12|
```

Tablet

```text
|1|2|3|4|5|6|7|8|
```

Mobile

```text
|1|
```

Semua section wajib mengikuti grid ini.

---

# 6. Global Page Structure

Semua halaman mengikuti struktur berikut:

```text
Announcement Bar (Optional)

↓

Header / Navigation

↓

Hero Section (Optional)

↓

Main Content

↓

CTA Section (Optional)

↓

Footer
```

---

# 7. Header Structure

```text
+------------------------------------------------------+
| Logo | Menu | Menu | Menu | Menu | Login | Register |
+------------------------------------------------------+
```

Header bersifat:

* Sticky
* Transparent di Hero (Home)
* Solid pada halaman lain
* Berubah saat scroll

---

# 8. Navigation Rules

Desktop:

* Horizontal Navigation

Tablet:

* Hamburger Menu

Mobile:

* Drawer Navigation

Seluruh menu harus dapat diakses menggunakan keyboard.

---

# 9. Hero Section

Struktur standar Hero:

```text
+------------------------------------------------------+
| Heading                                              |
| Sub Heading                                          |
|                                                      |
| [Primary CTA] [Secondary CTA]                        |
|                                                      |
| Illustration / Image                                 |
+------------------------------------------------------+
```

Komponen:

* Badge (opsional)
* Heading
* Description
* Primary Button
* Secondary Button
* Hero Image / Illustration

---

# 10. Section Layout

Semua section memiliki pola yang sama.

```text
Section Header

↓

Title

↓

Description

↓

Content

↓

Action (Optional)
```

---

# 11. Card Layout

Semua card mengikuti struktur berikut:

```text
+------------------------------+
| Image                        |
+------------------------------+
| Title                        |
| Subtitle                     |
| Description                  |
|                              |
| Button                       |
+------------------------------+
```

Jenis Card:

* Service Card
* Doctor Card
* Branch Card
* Promotion Card
* Article Card
* Testimonial Card

---

# 12. CTA Section

Contoh:

```text
+------------------------------------------------+
| Ready to Book Your Appointment?                |
|                                                |
| Short Description                              |
|                                                |
| [Book Appointment] [Download App]              |
+------------------------------------------------+
```

CTA selalu muncul menjelang Footer.

---

# 13. Footer Layout

```text
+--------------------------------------------------------------+
| Logo                                                         |
| About | Services | Doctors | Branches | Contact | Articles   |
|                                                              |
| Address                                                      |
| Phone                                                        |
| Email                                                        |
| Social Media                                                 |
| Copyright                                                    |
+--------------------------------------------------------------+
```

Footer harus memuat:

* Navigasi
* Kontak
* Sosial Media
* Legal
* Download App

---

# 14. Page Layout Standards

## Home

```text
Announcement

↓

Header

↓

Hero

↓

Quick Booking

↓

Services

↓

Doctors

↓

Branches

↓

Promotion

↓

Testimonials

↓

Articles

↓

Download App

↓

CTA

↓

Footer
```

---

## About

```text
Header

↓

Hero

↓

Company Profile

↓

Vision

↓

Mission

↓

Timeline

↓

Values

↓

Certifications

↓

CTA

↓

Footer
```

---

## Services

```text
Header

↓

Hero

↓

Search

↓

Category

↓

Service Grid

↓

CTA

↓

Footer
```

---

## Doctors

```text
Header

↓

Hero

↓

Search

↓

Filter

↓

Doctor Grid

↓

Pagination

↓

CTA

↓

Footer
```

---

## Branches

```text
Header

↓

Hero

↓

Map

↓

Branch List

↓

CTA

↓

Footer
```

---

## Promotions

```text
Header

↓

Hero

↓

Promotion Grid

↓

CTA

↓

Footer
```

---

## Articles

```text
Header

↓

Hero

↓

Search

↓

Category

↓

Article Grid

↓

Pagination

↓

CTA

↓

Footer
```

---

## FAQ

```text
Header

↓

Hero

↓

Search

↓

FAQ Accordion

↓

Contact CTA

↓

Footer
```

---

## Contact

```text
Header

↓

Hero

↓

Contact Information

↓

Contact Form

↓

Google Maps

↓

Footer
```

---

# 15. Spacing Rules

Menggunakan 8-point grid.

| Element            | Spacing |
| ------------------ | ------: |
| Section to Section |   96 px |
| Card Gap           |   24 px |
| Button Gap         |   16 px |
| Form Gap           |   20 px |
| Card Padding       |   24 px |

---

# 16. Responsive Behavior

Desktop

* Multi-column layout.
* Sidebar (jika diperlukan).

Tablet

* Dua kolom.
* Grid disederhanakan.

Mobile

* Satu kolom.
* Card memenuhi lebar layar.
* CTA berada di bagian bawah layar yang mudah dijangkau.

---

# 17. Loading State

Semua halaman harus memiliki Skeleton Loader.

Contoh:

* Hero Skeleton
* Card Skeleton
* Article Skeleton
* Doctor Skeleton

Tidak menggunakan spinner sebagai loading utama.

---

# 18. Empty State

Jika data kosong:

* Ilustrasi
* Judul yang jelas
* Deskripsi
* Tombol tindakan (CTA)

Contoh:

"Belum ada dokter yang sesuai dengan pencarian Anda."

---

# 19. Error State

Jika terjadi kesalahan:

* Ikon Error
* Judul
* Penjelasan singkat
* Tombol "Coba Lagi"
* Tombol "Kembali ke Beranda"

---

# 20. Accessibility

Semua layout harus memenuhi:

* Kontras warna minimal WCAG AA.
* Navigasi menggunakan keyboard.
* Focus state yang jelas.
* Alt text untuk seluruh gambar.
* Heading hierarchy (H1 → H2 → H3) yang konsisten.

---

# 21. Performance Guidelines

* Gambar menggunakan WebP atau AVIF.
* Lazy Loading untuk gambar di bawah fold.
* Komponen dipisah menjadi reusable components.
* Menggunakan Next.js Image Optimization.
* Font dimuat secara efisien.

---

# 22. Acceptance Criteria

* Seluruh halaman menggunakan struktur layout yang konsisten.
* Responsive pada Mobile, Tablet, Laptop, dan Desktop.
* Header dan Footer konsisten di seluruh halaman.
* Semua section mengikuti grid system.
* Layout siap dijadikan dasar desain Figma.
* Layout siap diimplementasikan menggunakan Next.js App Router.
