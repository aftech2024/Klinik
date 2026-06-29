---
name: run-clinic-api
description: run, start, build, test, smoke, launch clinic-api NestJS backend API port 3001
---

# run-clinic-api

NestJS 11 REST API for aftech Klinik. Backed by PostgreSQL 16 (Homebrew, port 5433, trust auth). Driven by `.claude/skills/run-clinic-api/smoke.sh`. All paths relative to `clinic-api/`.

## Prerequisites

- Node 22, npm
- PostgreSQL 16 via Homebrew on **port 5433** (trust auth) — NOT 5432 (system pg13, password auth)
- No Docker

## Build

```bash
npm install
npm run build
```

## Run — agent path (smoke.sh)

```bash
# Start dev server in background
npm run start:dev &
sleep 5

# Full smoke: 12 checks across public + protected endpoints
bash .claude/skills/run-clinic-api/smoke.sh
```

Smoke expects `BASE=http://localhost:3001` (default). All 12 checks must PASS.

## Seed data

```bash
npm run prisma:seed
```

Seeded admin: `admin@aftechklinik.com` / `admin123456` (role: `SUPER_ADMIN`)

## Key endpoints

| Method | Path | Auth? | Notes |
|---|---|---|---|
| GET | `/api/services` | no | list all services |
| GET | `/api/doctors` | no | returns array directly (no wrapper) |
| GET | `/api/branches` | no | list branches |
| GET | `/api/promotions` | no | list active promotions |
| GET | `/api/articles` | no | list articles |
| POST | `/api/auth/register` | no | `{name, email, password}` — no `role` field |
| POST | `/api/auth/login` | no | `{email, password}` → `{accessToken, user}` |
| GET | `/api/auth/me` | yes | current user profile |
| GET | `/api/appointments/my` | yes | patient's appointments |
| GET | `/api/queue/my` | yes | patient's queue |
| GET | `/api/notifications/my` | yes | patient notifications |
| GET | `/api/reports/dashboard` | yes (SUPER_ADMIN) | dashboard KPI |

## Gotchas

- **Port 5433 not 5432**: Homebrew PG16 binds 5433. Confirm: `pg_ctl status -D /opt/homebrew/var/postgresql@16`. Connection string in `prisma.config.ts` must use `port: 5433`.
- **Prisma 7 adapter pattern**: no `url` in `schema.prisma` datasource block. Config lives in `prisma.config.ts` using `defineConfig` + `PrismaPg` adapter.
- **`register` strict DTO**: sending `role` in body → 422 (forbidden field). Register only accepts `{name, email, password}`.
- **`/api/doctors` returns array**: not `{data:[]}`. `jq` path is `.[0].specialty`, not `.data[0].specialty`.
- **CORS**: API allows origins `localhost:3000`, `localhost:3002`, `localhost:3003` via `FRONTEND_URLS` env var. Add new frontend ports there, not in `main.ts` directly.
- **Reports**: `/api/reports/dashboard` (not `/dashboard-kpi`). Requires `SUPER_ADMIN` JWT.

## Troubleshooting

| Error | Fix |
|---|---|
| `ECONNREFUSED 5432` | DB on wrong port — ensure `port: 5433` in prisma.config.ts |
| `P1001: Can't reach database server` | Start PG: `brew services start postgresql@16` |
| register → 422 ForbiddenPropertyException | Remove `role` from request body |
| reports → 403 | Token not SUPER_ADMIN role |
| CORS blocked from admin/portal | Add origin to `FRONTEND_URLS`, restart API |
