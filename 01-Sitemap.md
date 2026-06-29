# 01 - Sitemap

**Project:** Clinic Management System (CMS)

**Module:** Landing Website

**Version:** 1.0.0

**Status:** Draft

---

# 1. Document Purpose

Dokumen ini mendefinisikan struktur navigasi (Information Architecture) untuk Landing Website. Tujuannya adalah memastikan seluruh halaman memiliki hierarki yang jelas, mudah dinavigasi oleh pengguna, dan ramah terhadap SEO.

Sitemap ini menjadi dasar untuk:

* User Flow
* Layout Structure
* Menu Navigation
* Breadcrumb
* Internal Linking
* URL Structure
* XML Sitemap

---

# 2. Information Architecture

```text
Landing Website
│
├── Home (/)
│
├── About (/about)
│   ├── Company Profile
│   ├── Vision & Mission
│   ├── Our Values
│   ├── Timeline
│   └── Certifications
│
├── Services (/services)
│   ├── General Practice
│   ├── Pediatrics
│   ├── Dental
│   ├── Obstetrics & Gynecology
│   ├── Internal Medicine
│   ├── Vaccination
│   ├── Laboratory
│   ├── Medical Check Up
│   └── Service Detail
│
├── Doctors (/doctors)
│   ├── Doctor List
│   ├── Search Doctor
│   ├── Filter by Branch
│   ├── Filter by Specialty
│   └── Doctor Detail
│
├── Branches (/branches)
│   ├── Branch List
│   ├── Branch Detail
│   ├── Facilities
│   ├── Operational Hours
│   └── Google Maps
│
├── Promotions (/promotions)
│   ├── Promotion List
│   └── Promotion Detail
│
├── Articles (/articles)
│   ├── Category
│   ├── Article Detail
│   ├── Search
│   └── Tags
│
├── FAQ (/faq)
│
├── Contact (/contact)
│
├── Login (/login)
│
├── Register (/register)
│
├── Download App
│
├── Privacy Policy
│
├── Terms & Conditions
│
├── 404
│
└── 500
```

---

# 3. Navigation Structure

## Primary Navigation

Menu utama yang selalu tampil pada Header.

| Menu       | URL         | Visibility |
| ---------- | ----------- | ---------- |
| Home       | /           | Public     |
| Services   | /services   | Public     |
| Doctors    | /doctors    | Public     |
| Branches   | /branches   | Public     |
| Promotions | /promotions | Public     |
| Articles   | /articles   | Public     |
| FAQ        | /faq        | Public     |
| Contact    | /contact    | Public     |

Action Button:

* Login
* Register
* Download App

---

## Secondary Navigation

Berada di Footer.

### Company

* About
* Careers (Phase 2)
* Privacy Policy
* Terms & Conditions

### Services

* General Practice
* Dental
* Pediatrics
* Laboratory
* Medical Check Up

### Resources

* Articles
* FAQ
* Promotions

### Contact

* Phone
* WhatsApp
* Email
* Address
* Google Maps

---

# 4. URL Convention

Semua URL menggunakan format:

* Huruf kecil (lowercase)
* Menggunakan tanda hubung (-)
* Tidak menggunakan underscore (_)
* Tidak menggunakan parameter untuk halaman utama
* SEO Friendly

Contoh:

✅ /medical-check-up

✅ /doctor/dr-budi-santoso

❌ /DoctorDetail?id=10

---

# 5. Breadcrumb Rules

Breadcrumb digunakan pada halaman berikut:

* Service Detail
* Doctor Detail
* Branch Detail
* Promotion Detail
* Article Detail

Contoh:

Home

>

Services

>

Medical Check Up

---

# 6. Internal Linking Strategy

Untuk meningkatkan SEO, setiap halaman harus memiliki internal link yang relevan.

Contoh:

### Home

→ Services

→ Doctors

→ Branches

→ Promotions

→ Articles

### Service Detail

→ Related Services

→ Related Doctors

→ Branches Offering Service

### Doctor Detail

→ Branch

→ Related Services

→ Appointment CTA

### Article Detail

→ Related Articles

→ Related Services

→ Doctor Recommendation

---

# 7. Search Entry Points

Pengguna dapat melakukan pencarian dari:

## Home

* Search Doctor

## Doctors

* Search by Name
* Filter by Specialty
* Filter by Branch

## Articles

* Search by Keyword
* Category
* Tag

## Branches

* Search by City
* Search by Branch Name

---

# 8. User Entry Points

Pengguna dapat masuk ke website melalui:

* Google Search
* Social Media
* Digital Ads
* QR Code
* WhatsApp
* Direct URL
* Referral Link

Semua entry point diarahkan ke halaman yang paling relevan (deep link).

---

# 9. SEO Sitemap

Halaman yang wajib masuk ke sitemap.xml:

* Home
* About
* Services
* Service Detail
* Doctors
* Doctor Detail
* Branches
* Branch Detail
* Promotions
* Promotion Detail
* Articles
* Article Detail
* FAQ
* Contact
* Privacy Policy
* Terms & Conditions

Halaman yang **tidak** dimasukkan:

* Login
* Register
* 404
* 500

---

# 10. Future Sitemap (Phase 2)

Halaman berikut direncanakan pada fase selanjutnya:

* Careers
* Insurance Partners
* Online Booking
* Events
* Webinar
* Testimonials
* CSR Program
* Press Release
* Media Gallery
* Health Calculator

---

# 11. Acceptance Criteria

* Struktur navigasi maksimal tiga tingkat (3-level navigation).
* Semua halaman memiliki URL yang konsisten dan SEO-friendly.
* Tidak ada halaman yatim (orphan page).
* Semua halaman dapat diakses melalui maksimal tiga klik dari Home.
* Breadcrumb tersedia pada seluruh halaman detail.
* Footer menyediakan tautan ke seluruh halaman penting.
* XML Sitemap dapat dihasilkan secara otomatis.
* Struktur siap digunakan untuk implementasi Next.js App Router.

---

# 12. Deliverables

Dokumen ini menjadi referensi untuk:

* 02-User-Flow.md
* 03-Layout-Structure.md
* 04-Component-Specification.md
* Seluruh PRD halaman (Home, About, Services, Doctors, Branches, Promotions, Articles, FAQ, Contact)
