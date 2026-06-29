---
name: run-clinic-portal
description: run, start, build, screenshot, test, smoke, launch clinic-portal patient portal Next.js port 3003
---

# run-clinic-portal

Next.js 16 patient portal for aftech Klinik. Driven by `.claude/skills/run-clinic-portal/driver.mjs` using system Chrome. All paths relative to `clinic-portal/`.

## Prerequisites

- Node 22, npm
- `playwright` devDependency: `npm install -D playwright`
- Chrome at `/Applications/Google Chrome.app`
- `clinic-api` running on port 3001
- A registered patient account (register via API or portal `/register` page)

## Register a test patient

```bash
curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Pasien","email":"testpasien@test.com","password":"Test1234!"}'
```

## Build

```bash
npm install
npm run build
```

## Run — agent path (driver)

```bash
# Start dev server
npm run dev -- --port 3003 &
sleep 4

# Full smoke: auth pages + login + all 7 portal pages
PORTAL_EMAIL=testpasien@test.com PORTAL_PASS=Test1234! \
SS_DIR=.claude/skills/run-clinic-portal \
node .claude/skills/run-clinic-portal/driver.mjs smoke

# Screenshot any path
node .claude/skills/run-clinic-portal/driver.mjs navigate /login login-page

# Login and screenshot dashboard
PORTAL_EMAIL=testpasien@test.com PORTAL_PASS=Test1234! \
node .claude/skills/run-clinic-portal/driver.mjs login
```

Driver commands: `ss [label]` | `smoke` | `login [email] [pass]` | `navigate <path> [label]`

Screenshots: `ss-<label>.png` in `$SS_DIR` (default `.`).

## Pages

| Route | Description |
|---|---|
| `/login` | Patient login |
| `/register` | Patient registration |
| `/dashboard` | Quick links + upcoming appointments + notifications |
| `/profile` | Profile editor |
| `/booking` | 3-step booking flow: pick doctor → pick date/time → confirm |
| `/queue` | Live queue tracker |
| `/medical-records` | SOAP records accordion |
| `/billing` | Invoice list |
| `/notifications` | Notification list + mark read |

## Gotchas

- **`source /tmp/portal-test-creds.sh`**: the `source` trick for env vars doesn't work inside `node -e`. Pass env explicitly: `PORTAL_EMAIL=x PORTAL_PASS=y node driver.mjs smoke`.
- **localStorage not shared between page navigations in smoke**: after login sets token, subsequent `page.goto()` calls in the same browser context DO share localStorage — tested working.
- **CORS required**: `clinic-api` must allow `localhost:3003`. In `clinic-api/.env`, ensure `FRONTEND_URLS` includes `http://localhost:3003`. Restart API after changing.
- **`/auth/me` endpoint**: portal dashboard calls `/api/auth/me` for the patient name. If this returns 401, the greeting shows "Halo, !" (empty name) — this is cosmetic only.

## Troubleshooting

| Error | Fix |
|---|---|
| Login → stays on `/login` | CORS or wrong credentials — check `clinic-api` CORS config |
| `EADDRINUSE :::3003` | `lsof -ti:3003 \| xargs kill -9` |
| `Cannot find module 'playwright'` | `npm install -D playwright` |
| Empty dashboard data | New patient has no appointments — expected state |
