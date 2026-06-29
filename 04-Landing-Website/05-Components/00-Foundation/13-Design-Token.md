# 04 - Design Token

Project : Clinic Management System

Module : Landing Website

Version : 1.0.0

Status : Draft

---

# 1. Purpose

Dokumen ini mendefinisikan seluruh Design Token yang digunakan pada Landing Website.

Seluruh komponen UI wajib menggunakan token yang didefinisikan di dokumen ini.

Developer **tidak diperbolehkan menggunakan hardcoded value** seperti:

```
padding: 18px

color: #3299ff

font-size: 15px
```

Semua nilai harus berasal dari Design Token.

---

# 2. Design Principles

Design System memiliki prinsip:

Consistency

Scalability

Accessibility

Reusable

Responsive

Theme Ready

---

# 3. Color Palette

## Primary

| Token | Value |
|---------|------------|
| Primary-50 | #EFF8FF |
| Primary-100 | #D1E9FF |
| Primary-200 | #B2DDFF |
| Primary-300 | #84CAFF |
| Primary-400 | #53B1FD |
| Primary-500 | #2E90FA |
| Primary-600 | #1570EF |
| Primary-700 | #175CD3 |
| Primary-800 | #1849A9 |
| Primary-900 | #194185 |

---

## Neutral

White

Gray 50

Gray 100

Gray 200

Gray 300

Gray 400

Gray 500

Gray 600

Gray 700

Gray 800

Gray 900

Black

---

## Semantic

Success

Warning

Danger

Info

---

# 4. Typography

Primary Font

Inter

Fallback

sans-serif

---

## Font Weight

300

400

500

600

700

800

---

## Heading

H1

48 px

H2

40 px

H3

32 px

H4

28 px

H5

24 px

H6

20 px

---

## Body

Large

18 px

Regular

16 px

Small

14 px

Caption

12 px

---

# 5. Border Radius

xs

4 px

sm

8 px

md

12 px

lg

16 px

xl

24 px

full

9999 px

---

# 6. Shadow

Small

Medium

Large

Extra Large

---

# 7. Spacing

Menggunakan 8-point Grid.

```
4

8

12

16

24

32

40

48

64

80

96

120
```

---

# 8. Container

Desktop

1320 px

Laptop

1140 px

Tablet

720 px

Mobile

100%

---

# 9. Grid

Desktop

12 Column

Tablet

8 Column

Mobile

1 Column

---

# 10. Z Index

Header

100

Drawer

200

Modal

500

Toast

900

Tooltip

1000

---

# 11. Animation

Fast

150 ms

Normal

250 ms

Slow

400 ms

---

# 12. Transition

ease-in-out

---

# 13. Icon

Library

Lucide

Default Size

20 px

24 px

32 px

---

# 14. Button Height

Small

36

Medium

44

Large

52

---

# 15. Input Height

Small

40

Medium

48

Large

56

---

# 16. Card

Padding

24

Radius

16

Shadow

Medium

---

# 17. Image Ratio

Hero

16:9

Doctor

4:5

Promotion

16:9

Article

16:10

Branch

16:9

---

# 18. Responsive Token

Desktop

>=1440

Laptop

1024

Tablet

768

Mobile

360

---

# 19. Accessibility

Minimum Contrast

WCAG AA

Focus Ring

Visible

Keyboard Navigation

Supported

ARIA

Required

---

# 20. Acceptance Criteria

Semua komponen menggunakan Design Token.

Tidak ada hardcoded spacing.

Tidak ada hardcoded color.

Tidak ada hardcoded typography.

Seluruh halaman konsisten.
