# Deployment Guide — aftech Klinik

## Arsitektur

```
clinic-web (Next.js) ─┐
clinic-portal (Next.js) ─┤── Vercel
clinic-admin (Next.js) ─┤
clinic-pos (Next.js) ───┘
                              ├── clinic-api (NestJS) ─── Railway / Render
                                                            │
                                                            └── Supabase PostgreSQL
```

---

## 1. Database — Supabase

### 1.1. Buat Project

1. Buka https://supabase.com → **Start new project**
2. Isi:
   - **Name:** `aftech-klinik`
   - **Database Password:** simpan aman
   - **Region:** pilih yang terdekat (Singapore / Jakarta)
3. Tunggu provisioning (~2 menit)

### 1.2. Dapatkan Connection String

1. Di dashboard Supabase, kiri: **Project Settings → Database**
2. Cari **Connection string → URI**
3. Copy string seperti:
   ```
   postgresql://postgres:xxxxxxxxxxxx@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```
4. **Simpan** — akan dipakai untuk `DATABASE_URL` di API

### 1.3. Catatan Storage

Supabase tidak support MinIO. Untuk file upload nanti ganti pakai:
- **Supabase Storage** (built-in, bucket `clinic-files`)
- Atau **Cloudinary**
- Atau **AWS S3**

---

## 2. Backend API — Railway

Railway paling cocok untuk NestJS + Prisma (native Node.js, build script, cron, domain otomatis).

### 2.1. Setup Railway

1. Buka https://railway.app → Login with GitHub
2. **New Project → Deploy from GitHub repo**
3. Pilih repo → **Add variable**
4. Pilih **root directory** → `/clinic-api` (karena monorepo)

### 2.2. Environment Variables (Railway)

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://postgres:xxx@xxx.supabase.co:6543/postgres` |
| `JWT_SECRET` | Generate random: `openssl rand -hex 32` |
| `JWT_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_SECRET` | Generate random: `openssl rand -hex 32` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `FRONTEND_URLS` | `https://clinic-web.vercel.app,https://clinic-portal.vercel.app,https://clinic-admin.vercel.app,https://clinic-pos.vercel.app` |
| `REDIS_URL` | *(skip dulu sampai perlu queue)* |
| `MINIO_ENDPOINT` | *(isi nanti kalau pakai S3)* |

### 2.3. Build & Start Config

Railway akan otomatis detect Node.js. Di **Settings**:

- **Root Directory:** `/clinic-api`
- **Build Command:**
  ```bash
  npx prisma generate && npm run build
  ```
- **Start Command:**
  ```bash
  npx prisma db push && npm run start:prod
  ```

> **Atau** buat file `railway.json` di `clinic-api/`:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npx prisma generate && npm run build"
  },
  "deploy": {
    "startCommand": "npx prisma db push && node dist/main",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2.4. Seed Data (Sekali)

Setelah deploy sukses, jalankan seed via Railway **Shell**:

```bash
npx prisma db push
npx ts-node prisma/seed.ts
```

Atau kalau `ts-node` tidak ada:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

---

## 3. Frontend — Vercel

### 3.1. BFS — Deploy Sekaligus (Recommended)

Vercel support monorepo. Tiap app di-deploy sebagai project terpisah:

1. Buka https://vercel.com → **Add New → Project**
2. Import GitHub repo yang sama
3. **Configure Project:**
   - **Root Directory:** `clinic-web` (atau yang lain)
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next`

### 3.2. Environment Variables (tiap app)

#### clinic-web

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://clinic-api.up.railway.app` |
| `NEXT_PUBLIC_PORTAL_URL` | `https://clinic-portal.vercel.app` |

#### clinic-portal

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://clinic-api.up.railway.app` |

#### clinic-admin

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://clinic-api.up.railway.app` |

#### clinic-pos

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://clinic-api.up.railway.app` |

### 3.3. Domain Custom (Opsional)

Di Vercel dashboard: **Project → Settings → Domains**
- `klinik.aftech.id` → clinic-web
- `portal.klinik.aftech.id` → clinic-portal
- `admin.klinik.aftech.id` → clinic-admin
- `pos.klinik.aftech.id` → clinic-pos

Update `FRONTEND_URLS` di Railway jika pakai custom domain.

---

## 4. File Storage (MinIO → Pengganti)

MinIO berjalan di localhost dan tidak bisa dipakai di production. Pilih salah satu:

### Opsi A: Supabase Storage (gratis)

```bash
# Di Supabase dashboard → Storage → Create bucket
# Nama bucket: clinic-files
# Public bucket (atau atur RLS policy)
```

Update env API:
```
MINIO_ENDPOINT=supabase.co
MINIO_PORT=443
MINIO_ACCESS_KEY=  # Dari Project Settings → API → anon public key
MINIO_SECRET_KEY=   # Dari Project Settings → API → service_role key
MINIO_BUCKET=clinic-files
```

### Opsi B: AWS S3

```
MINIO_ENDPOINT=s3.ap-southeast-1.amazonaws.com
MINIO_PORT=443
MINIO_ACCESS_KEY=AKIA...
MINIO_SECRET_KEY=...
MINIO_BUCKET=aftech-clinic-files
```

> **Note:** Di production, ganti provider MinIO SDK dengan S3 SDK. Tapi kalo library nya udah S3-compatible, endpoint diganti aja.

---

## 5. Checklist Deploy

| # | Step | Done? |
|---|---|---|
| 1 | Buat Supabase project, simpan connection string | ☐ |
| 2 | Deploy `clinic-api` ke Railway dengan env vars | ☐ |
| 3 | Jalankan `prisma db push + seed` di Railway Shell | ☐ |
| 4 | Deploy `clinic-web` ke Vercel | ☐ |
| 5 | Deploy `clinic-portal` ke Vercel | ☐ |
| 6 | Deploy `clinic-admin` ke Vercel | ☐ |
| 7 | Deploy `clinic-pos` ke Vercel | ☐ |
| 8 | Update `FRONTEND_URLS` di Railway | ☐ |
| 9 | Test login flow end-to-end | ☐ |
| 10 | Setup custom domain (opsional) | ☐ |

---

## 6. Troubleshooting

### Prisma: `Can't reach database server`
- Pastikan Supabase connection string benar
- Di Supabase dashboard → **Database → Connection pooling** — pastikan pooled connection
- Railway → tambahkan variable `DATABASE_URL` dengan connection string yang benar

### CORS error di browser
- Pastikan `FRONTEND_URLS` di API sudah includes semua domain Vercel
- Format: comma-separated, no trailing slash

### `next build` gagal karena TypeScript
- Set `NEXT_PUBLIC_API_URL` sebagai env di Vercel
- Pastikan tidak ada import lokal yang broken di kode

### Redis / Queue error
- Jika tidak urgent, set `REDIS_URL` kosong dan comment/disable kode yang pakai Redis di API
- Atau deploy Redis di Railway (Add-on → Redis)
