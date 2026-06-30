# URL Dependencies — aftech Klinik

Inter-service URL map. Setiap service butuh URL service lain dikonfigurasi
sebelum deploy atau update env.

---

## Dependency Graph

```
Supabase PostgreSQL
        │
        ▼
   clinic-api  ◄─────────────────────────────┐
   (NestJS)                                   │ NEXT_PUBLIC_API_URL
        │                                     │
        │         ┌──────────────┬────────────┼──────────────┐
        │         │              │            │              │
        │         ▼              ▼            ▼              ▼
        │    clinic-web    clinic-portal clinic-admin   clinic-pos
        │         │
        │         │ NEXT_PUBLIC_PORTAL_URL (SSO redirect)
        │         ▼
        │    clinic-portal
        │
        └──► FRONTEND_URLS (CORS — wajib include semua 4 domain)
```

**Deploy order wajib:**
1. `clinic-api` (prerequisite semua)
2. `clinic-portal` (prerequisite clinic-web)
3. `clinic-web` (butuh portal URL)
4. `clinic-admin` (independen, butuh API)
5. `clinic-pos` (independen, butuh API)
6. Update `FRONTEND_URLS` di API dengan semua URL Vercel → restart

---

## Per-Service Env Variables

### clinic-api (HF Spaces / Railway)

| Variable | Value | Keterangan |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.xxx:pass@aws-X.pooler.supabase.com:6543/postgres` | Transaction pooler port **6543** untuk runtime |
| `JWT_SECRET` | random hex 32 | — |
| `JWT_REFRESH_SECRET` | random hex 32 | — |
| `JWT_EXPIRES_IN` | `15m` | — |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | — |
| `NODE_ENV` | `production` | — |
| `PORT` | `7860` (HF) / `3001` (Railway) | — |
| `FRONTEND_URLS` | semua URL Vercel, comma-separated, no trailing slash | **Update setelah semua frontend deploy** |

> **Catatan Supabase pooler:**
> - Port **6543** (transaction) → untuk runtime app (PrismaPg adapter)
> - Port **5432** (session) → untuk `prisma db push` dan `seed` dari lokal

---

### clinic-web → butuh 2 URL eksternal

| Variable | Points to | Kapan dipakai |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `clinic-api` base URL (tanpa `/api`) | Semua fetch: login, register, booking, dokter, jadwal |
| `NEXT_PUBLIC_PORTAL_URL` | `clinic-portal` base URL | Redirect SSO setelah login/register berhasil; link "Buka Portal Pasien" |

Contoh prod:
```env
NEXT_PUBLIC_API_URL=https://aftech26-aftech-klinik-api.hf.space
NEXT_PUBLIC_PORTAL_URL=https://clinic-portal-xxx.vercel.app
```

---

### clinic-portal → butuh 1 URL eksternal

| Variable | Points to | Kapan dipakai |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `clinic-api` base URL | Login, register, semua data pasien, antrian, appointment |

```env
NEXT_PUBLIC_API_URL=https://aftech26-aftech-klinik-api.hf.space
```

---

### clinic-admin → butuh 1 URL eksternal

| Variable | Points to | Kapan dipakai |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `clinic-api` base URL | Login admin, manajemen dokter, cabang, laporan |

```env
NEXT_PUBLIC_API_URL=https://aftech26-aftech-klinik-api.hf.space
```

---

### clinic-pos → butuh 1 URL eksternal

| Variable | Points to | Kapan dipakai |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `clinic-api` base URL | Login kasir, transaksi, farmasi, antrean |

```env
NEXT_PUBLIC_API_URL=https://aftech26-aftech-klinik-api.hf.space
```

---

## CORS — FRONTEND_URLS di clinic-api

Wajib update setelah semua app Vercel deploy. Format: comma-separated, no trailing slash.

```env
FRONTEND_URLS=https://klinik.aftech.co.id,https://clinic-portal-xxx.vercel.app,https://clinic-admin-xxx.vercel.app,https://clinic-pos-xxx.vercel.app
```

Kalau pakai custom domain, pakai custom domain (bukan `.vercel.app`).
Custom domain dan `.vercel.app` bisa keduanya dimasukkan jika perlu.

---

## Token Storage (localStorage) per App

| App | localStorage keys |
|---|---|
| clinic-web | `portal_token`, `portal_refresh`, `portal_user` |
| clinic-portal | `portal_token`, `portal_refresh`, `portal_user` |
| clinic-admin | `admin_token`, `admin_refresh`, `admin_user` |
| clinic-pos | `pos_token`, `pos_refresh`, `pos_user` |

> clinic-web dan clinic-portal share key yang sama (`portal_*`) — ini by design
> untuk SSO: web redirect ke portal `/token?t=...` yang set localStorage portal,
> lalu masuk dashboard tanpa login ulang.

---

## SSO Flow: clinic-web → clinic-portal

```
User login/register di clinic-web
        │
        ▼
API balik accessToken + refreshToken
        │
        ▼
clinic-web redirect ke:
  {PORTAL_URL}/token?t=<accessToken>&r=<refreshToken>&u=<userJSON>&redirect=/dashboard
        │
        ▼
clinic-portal /token page:
  - set localStorage portal_token, portal_refresh, portal_user
  - redirect ke /dashboard
```

> clinic-web butuh `NEXT_PUBLIC_PORTAL_URL` untuk generate URL ini.
> Deploy portal dulu, baru set env di clinic-web.

---

## Checklist Update URL (setiap kali domain berubah)

| Aksi | Update di mana |
|---|---|
| Ganti domain clinic-web | Update `FRONTEND_URLS` di API |
| Ganti domain clinic-portal | Update `NEXT_PUBLIC_PORTAL_URL` di clinic-web, update `FRONTEND_URLS` di API |
| Ganti domain clinic-admin | Update `FRONTEND_URLS` di API |
| Ganti domain clinic-pos | Update `FRONTEND_URLS` di API |
| Ganti URL clinic-api | Update `NEXT_PUBLIC_API_URL` di SEMUA 4 frontend → redeploy semua |
