# 09 - Motion System

**Project:** Clinic Management System (CMS)

**Module:** Design System Foundation

**Document:** `05-Components/00-Foundation/09-Motion.md`

**Version:** 1.0.0

**Status:** Draft

**Owner:** Product Team & UI/UX Team

---

# 1. Purpose

Motion System mendefinisikan standar animasi dan transisi yang digunakan pada seluruh aplikasi.

Motion digunakan untuk:

- Memberikan feedback
- Memperjelas perubahan state
- Membantu navigasi
- Mengurangi cognitive load
- Meningkatkan pengalaman pengguna

Motion bukan dekorasi.

Motion harus memiliki tujuan yang jelas.

---

# 2. Design Principles

## Functional

Setiap animasi harus membantu pengguna.

---

## Fast

Animasi harus cepat.

Target:

100–300 ms

---

## Natural

Menggunakan easing yang terasa alami.

---

## Consistent

Semua komponen menggunakan motion yang sama.

---

## Accessible

Motion dapat dimatikan jika user mengaktifkan "Reduce Motion".

---

# 3. Motion Philosophy

Healthcare membutuhkan UI yang:

- Tenang
- Profesional
- Cepat
- Tidak mengganggu

Karena itu:

✔ Fade

✔ Scale

✔ Slide

✔ Transform

❌ Bounce

❌ Shake berlebihan

❌ Rotate

❌ Flash

❌ Infinite Animation

---

# 4. Motion Categories

Motion dibagi menjadi:

- Hover
- Press
- Focus
- Loading
- Navigation
- Modal
- Drawer
- Toast
- Skeleton
- Page Transition

---

# 5. Duration Token

| Token | Duration | Usage |
|---------|----------|----------------|
| instant | 0 ms | Disabled Motion |
| fast | 100 ms | Hover |
| normal | 200 ms | Button |
| medium | 250 ms | Card |
| slow | 300 ms | Modal |
| slower | 400 ms | Page Transition |

Default

200 ms

---

# 6. Easing Token

| Token | Curve |
|---------|-----------------------------|
| Linear | linear |
| Ease In | ease-in |
| Ease Out | ease-out |
| Ease In Out | ease-in-out |
| Standard | cubic-bezier(.2,.8,.2,1) |

Default

Standard

---

# 7. Hover Motion

Desktop only.

Hover:

- Shadow naik sedikit
- Scale 1.02
- Background berubah halus

Duration

150–200 ms

---

# 8. Button Motion

Hover

↓

Background lebih gelap

↓

Shadow XS

↓

Scale 1.01

---

Pressed

↓

Scale 0.98

↓

Shadow hilang

---

Disabled

↓

Tidak ada motion

---

# 9. Input Motion

Focus

↓

Border berubah

↓

Primary Color

↓

Shadow Focus

↓

200 ms

Error

↓

Border berubah

↓

Fade

---

# 10. Card Motion

Hover

↓

Translate Y -4 px

↓

Shadow SM → MD

↓

200 ms

Click

↓

Scale 0.99

---

# 11. Navigation Motion

Desktop

Hover

↓

Underline

↓

Fade

↓

150 ms

---

Mobile

Drawer

↓

Slide Right

↓

250 ms

---

# 12. Modal Motion

Open

↓

Fade

+

Scale

95%

↓

100%

↓

250 ms

---

Close

↓

Fade Out

↓

Scale Down

↓

200 ms

---

# 13. Drawer Motion

Open

↓

Translate X

↓

300 ms

Close

↓

Reverse

---

# 14. Dropdown Motion

Open

↓

Fade

↓

Slide Down 8 px

↓

200 ms

---

Close

↓

Fade Out

↓

150 ms

---

# 15. Tooltip Motion

Open

↓

Fade

↓

100 ms

---

Close

↓

Fade

↓

100 ms

---

# 16. Toast Motion

Appear

↓

Slide Top

↓

Fade

↓

250 ms

Disappear

↓

Fade Out

↓

200 ms

---

# 17. Loading Motion

Loading Spinner

Rotation

1 detik

Linear

Infinite

---

Skeleton

Opacity

1

↓

0.6

↓

1

1.5 detik

Infinite

---

# 18. Page Transition

Desktop

Fade

+

Slide

↓

300 ms

---

Mobile

Slide

↓

250 ms

---

# 19. CSS Variables

```css
:root{

--motion-fast:100ms;

--motion-normal:200ms;

--motion-medium:250ms;

--motion-slow:300ms;

--motion-easing:cubic-bezier(.2,.8,.2,1);

}
```

---

# 20. Tailwind Mapping

```ts
transitionDuration:{

100:"100ms",

200:"200ms",

250:"250ms",

300:"300ms",

400:"400ms"

}
```

---

# 21. Next.js Implementation

Gunakan:

Framer Motion

Untuk:

- Modal
- Drawer
- Toast
- Page Transition
- Accordion
- Hero Animation

Hover sederhana cukup menggunakan CSS Transition.

---

# 22. Flutter Implementation

Gunakan:

- AnimatedContainer
- AnimatedOpacity
- AnimatedSwitcher
- Hero
- AnimatedPositioned
- AnimatedScale

Hindari package animasi berat.

---

# 23. Figma Smart Animate

Gunakan:

Smart Animate

Duration

200 ms

Easing

Ease Out

Semua prototype wajib menggunakan Motion Token.

---

# 24. Accessibility

Hormati preferensi sistem:

Reduce Motion

Jika aktif:

- Hilangkan Scale
- Hilangkan Slide
- Gunakan Fade sederhana
- Maksimum 100 ms

---

# 25. Component Motion Mapping

| Component | Motion |
|------------|----------------|
| Button | Fade + Scale |
| Input | Border Fade |
| Card | Lift |
| Navbar | Fade |
| Drawer | Slide |
| Modal | Fade + Scale |
| Toast | Slide |
| Tooltip | Fade |
| Dropdown | Fade + Slide |
| Skeleton | Pulse |

---

# 26. Performance Rules

Target FPS

60 FPS

---

Gunakan:

- transform
- opacity

Hindari:

- width animation
- height animation
- left
- top
- margin animation

---

# 27. Do & Don't

## ✅ Do

- Gunakan Motion Token.
- Gunakan easing yang konsisten.
- Gunakan animasi singkat.
- Gunakan motion untuk feedback.
- Gunakan transform & opacity.

---

## ❌ Don't

- Bounce Animation.
- Flash Animation.
- Infinite Animation selain Loading.
- Animasi lebih dari 400 ms.
- Animasi yang menghambat workflow.

---

# 28. Change Management

Perubahan Motion System harus:

1. Disetujui UI/UX Lead.
2. Diperbarui pada Figma Prototype.
3. Diperbarui pada Framer Motion.
4. Diperbarui pada Flutter Animation.
5. Diverifikasi oleh QA.

---

# 29. Acceptance Criteria

- Seluruh animasi menggunakan Motion Token.
- Tidak ada animasi lebih dari 400 ms.
- Mendukung Reduce Motion.
- Konsisten pada Web dan Flutter.
- Menggunakan transform & opacity.
- Performa minimal 60 FPS.
- Tidak mengganggu workflow pengguna.

---

# 30. Future Roadmap

## Version 1.1

- Motion Preset
- Gesture Animation
- Swipe Interaction
- Bottom Sheet Motion

## Version 2.0

- Adaptive Motion
- Dynamic Motion Token
- AI Assisted Motion
- Micro Interaction Library
