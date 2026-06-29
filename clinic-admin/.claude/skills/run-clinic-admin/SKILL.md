---
name: run-clinic-admin
description: run, start, build, screenshot, test, smoke, launch clinic-admin admin dashboard Next.js port 3002
---

# run-clinic-admin

Next.js 16 admin dashboard for aftech Klinik. Driven by `.claude/skills/run-clinic-admin/driver.mjs` using system Chrome. All paths relative to `clinic-admin/`.

## Prerequisites

- Node 22, npm
- `playwright` package: `npm install -D playwright`
- Chrome at `/Applications/Google Chrome.app`
- `clinic-api` running on port 3001 (required for login + data)
- Admin credentials: `admin@aftechklinik.com` / `admin123456` (seeded)
- `SUPER_ADMIN` role required — login page allows `ADMIN`, `SUPER_ADMIN`, `DOCTOR`

## Build

```bash
npm install
npm run build
```

## Run — agent path (driver)

```bash
# Start dev server
npm run dev -- --port 3002 &
sleep 4

# Screenshot login page
SS_DIR=.claude/skills/run-clinic-admin node .claude/skills/run-clinic-admin/driver.mjs ss login

# Full smoke: login → navigate all 9 dashboard pages → screenshot each
ADMIN_EMAIL=admin@aftechklinik.com ADMIN_PASS=admin123456 \
SS_DIR=.claude/skills/run-clinic-admin \
node .claude/skills/run-clinic-admin/driver.mjs smoke

# Just login and screenshot result
ADMIN_EMAIL=admin@aftechklinik.com ADMIN_PASS=admin123456 \
node .claude/skills/run-clinic-admin/driver.mjs login

# Screenshot any path (assumes already navigated/logged in)
node .claude/skills/run-clinic-admin/driver.mjs navigate /patients patients-page
```

Driver commands: `ss [label]` | `smoke` | `login [email] [pass]` | `navigate <path> [label]`

Screenshots: `ss-<label>.png` in `$SS_DIR` (default `.`).

## Pages

| Route | Description |
|---|---|
| `/login` | Admin login (dark slate theme) |
| `/dashboard` | KPI cards + appointment/revenue charts |
| `/patients` | Patient table with search + pagination |
| `/doctors` | Doctor cards grid |
| `/branches` | Branch table |
| `/appointments` | Appointment table with status filter |
| `/queue` | Queue board per-branch + call-next |
| `/billing` | Billing table with status filter |
| `/reports` | Revenue bar chart + top doctors |
| `/settings` | Key-value settings editor |

## Gotchas

- **CORS**: API (`localhost:3001`) must allow origin `localhost:3002`. Fixed by setting `FRONTEND_URLS=http://localhost:3000,http://localhost:3002,http://localhost:3003` in `clinic-api/.env` and restarting. If login shows "Email atau password salah" but curl works, this is CORS.
- **`SUPER_ADMIN` role blocked**: Original login check only allowed `ADMIN`/`DOCTOR`. Fixed to also allow `SUPER_ADMIN`. Seed user has role `SUPER_ADMIN`.
- **Dashboard KPI empty in headless smoke**: `localStorage` token is set during login via `router.push`, but playwright's `waitForNavigation` catches it — however the API calls in `useEffect` may not complete before screenshot. The sidebar/layout is always correct. Run with `--headed` to see live data.
- **KPI data requires SUPER_ADMIN token on reports endpoint**: reports return 403 for DOCTOR role users.

## Troubleshooting

| Error | Fix |
|---|---|
| Login: "Email atau password salah" + curl works | CORS — add `localhost:3002` to `FRONTEND_URLS` in clinic-api `.env`, restart API |
| `EADDRINUSE :::3002` | `lsof -ti:3002 \| xargs kill -9` |
| Dashboard empty | API not running on 3001, or CORS blocked |
| Login redirects back to `/login` | Role not in `['ADMIN','SUPER_ADMIN','DOCTOR']` |
