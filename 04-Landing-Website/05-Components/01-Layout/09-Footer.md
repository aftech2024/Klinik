# 09 - Footer

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Category:** Layout Component

**Component:** Footer

**Document:** `05-Components/01-Layout/09-Footer.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team, UI/UX Team, Frontend Team, Marketing Team

---

# 1. Overview

Footer merupakan komponen penutup yang ditampilkan pada bagian bawah setiap halaman Landing Website.

Footer berfungsi sebagai pusat informasi tambahan, navigasi sekunder, identitas perusahaan, kontak, media sosial, informasi cabang, legal, serta akses cepat ke halaman penting.

Seluruh konten Footer bersifat dinamis dan dikelola melalui CMS.

---

# 2. Objectives

Footer bertujuan untuk:

- Menyediakan navigasi tambahan.
- Menampilkan informasi perusahaan.
- Memudahkan pengguna menghubungi klinik.
- Menampilkan informasi legal.
- Mendukung SEO melalui internal linking.
- Menampilkan informasi seluruh cabang klinik.

---

# 3. User Stories

### Visitor

Sebagai pengunjung,

Saya ingin menemukan informasi kontak dan alamat klinik,

Sehingga saya dapat menghubungi atau mengunjungi cabang yang diinginkan.

---

Sebagai pasien,

Saya ingin melihat link ke halaman penting tanpa harus kembali ke menu utama.

---

Sebagai calon pasien,

Saya ingin mengetahui media sosial dan aplikasi klinik.

---

# 4. Functional Requirements

Footer harus mendukung:

- Logo
- Deskripsi Perusahaan
- Navigation Links
- Service Links
- Branch Links
- Contact Information
- Social Media
- Newsletter (Optional)
- Download Apps
- Copyright
- Legal Links
- CMS Configuration
- Multi Branch Support

---

# 5. Component Anatomy

```
-------------------------------------------------------------

LOGO

Deskripsi Klinik

Menu

Layanan

Cabang

Kontak

Media Sosial

Download Apps

-------------------------------------------------------------

Copyright

Privacy Policy

Terms

-------------------------------------------------------------
```

---

# 6. Component Structure

```
Footer

├── Company
│
├── Navigation
│
├── Services
│
├── Branches
│
├── Contact
│
├── Social Media
│
├── Download Apps
│
├── Legal
│
└── Copyright
```

---

# 7. Footer Sections

## Company

Menampilkan:

- Logo
- Nama Klinik
- Deskripsi Singkat

---

## Navigation

Berisi:

- Home
- About
- Services
- Doctors
- Branches
- Promotions
- Articles
- Contact

---

## Services

Contoh:

- General Checkup
- Dental
- Pediatrics
- Vaccination
- Laboratory

---

## Branches

Menampilkan:

- Cabang Jakarta
- Cabang Bekasi
- Cabang Tangerang
- Cabang Depok
- dan seterusnya

Data berasal dari CMS.

---

## Contact

Menampilkan:

- Telepon
- Email
- Alamat
- Jam Operasional

---

## Social Media

Mendukung:

- Instagram
- Facebook
- TikTok
- YouTube
- LinkedIn

---

## Download Apps

Menampilkan:

- App Store
- Google Play

---

## Legal

Berisi:

- Privacy Policy
- Terms & Conditions
- Cookie Policy
- Sitemap

---

# 8. Variants

## Default

Footer standar.

---

## Minimal

Logo

Copyright

---

## Corporate

Logo

Company

Menu

Legal

---

## Multi Branch

Memiliki daftar seluruh cabang.

---

# 9. Layout Specification

Container

1280 px

Padding Top

80 px

Padding Bottom

48 px

Column

4–6 Column

Gap

40 px

---

# 10. Typography

Heading

Title Small

Body

Body Medium

Link

Body Medium

Copyright

Body Small

Mengikuti Typography Foundation.

---

# 11. Color

Background

Surface Dark

Text

White

Secondary Text

Neutral 300

Link Hover

Primary 400

Divider

Neutral 700

Menggunakan Theme Foundation.

---

# 12. Icons

Gunakan:

- Phone
- Mail
- Map Pin
- Clock
- Facebook
- Instagram
- TikTok
- YouTube
- LinkedIn

Ukuran:

20 px

Mengikuti Icon Foundation.

---

# 13. Responsive Behaviour

## Desktop

4–6 kolom.

---

## Tablet

2 kolom.

---

## Mobile

Single Column.

Urutan:

Company

↓

Navigation

↓

Services

↓

Branches

↓

Contact

↓

Apps

↓

Legal

↓

Copyright

---

# 14. Accessibility

Gunakan semantic HTML.

```
<footer>

<nav>

<ul>

<li>

<a>
```

Seluruh link harus dapat diakses menggunakan keyboard.

Kontras warna mengikuti WCAG 2.2 AA.

---

# 15. Interaction

Hover Link

↓

Primary Hover

↓

Click

↓

Navigate

Social Media membuka tab baru.

---

# 16. Motion

Hover

150 ms

Fade

200 ms

Tidak menggunakan animasi kompleks.

---

# 17. CMS Configuration

Admin dapat mengubah:

- Logo
- Deskripsi
- Menu
- Layanan
- Daftar Cabang
- Kontak
- Social Media
- Download Apps
- Copyright
- Legal Links

Tanpa deployment.

---

# 18. Multi Branch Support

Footer dapat menampilkan:

- Semua Cabang
- Cabang berdasarkan Kota
- Cabang berdasarkan Provinsi

Data berasal dari Master Branch.

---

# 19. SEO Consideration

Footer mendukung:

- Internal Linking
- Sitemap Link
- Privacy Policy
- Structured Navigation

Seluruh link menggunakan anchor yang sesuai.

---

# 20. Performance

- Lazy Load apabila diperlukan.
- Tidak menyebabkan Layout Shift.
- Icon menggunakan SVG.
- Data di-cache.

---

# 21. Analytics Event

| Event | Trigger |
|---------|---------|
| footer_link_click | Klik Link Footer |
| footer_social_click | Klik Media Sosial |
| footer_app_download | Klik Download App |

---

# 22. Props

| Property | Type | Required |
|----------|------|----------|
| company | object | Yes |
| navigation | array | Yes |
| services | array | Yes |
| branches | array | Yes |
| contact | object | Yes |
| social | array | No |
| apps | array | No |
| legal | array | Yes |

---

# 23. Developer Notes

## Next.js

Gunakan:

- footer
- nav
- ul
- li
- next/link
- next/image

Seluruh data berasal dari CMS API.

---

## Flutter

Footer digunakan pada:

- Web
- Tablet

Pada Mobile Apps, Footer tidak digunakan dan digantikan oleh Bottom Navigation.

---

# 24. Acceptance Criteria

- Footer tampil pada seluruh halaman.
- Seluruh link berfungsi.
- Responsive.
- Mendukung Theme.
- Mendukung CMS.
- Mendukung Multi Branch.
- Accessibility terpenuhi.

---

# 25. QA Checklist

□ Logo tampil.

□ Deskripsi sesuai CMS.

□ Navigation benar.

□ Layanan benar.

□ Cabang tampil.

□ Kontak benar.

□ Social Media berfungsi.

□ Download Apps berfungsi.

□ Responsive.

□ Dark Theme berjalan.

□ Analytics terkirim.

---

# 26. Future Enhancement

## Version 1.1

- Newsletter Subscription
- WhatsApp Floating Link
- Live Chat
- Branch Finder

---

## Version 2.0

- Dynamic Footer berdasarkan Cabang
- Multi Language
- AI Recommendation Link
- Personalized Quick Links
- Dynamic Operating Hours
