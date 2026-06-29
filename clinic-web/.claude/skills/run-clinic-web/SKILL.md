---
name: run-clinic-web
description: run, start, build, screenshot, test, smoke, launch clinic-web landing website Next.js port 3000
---

# run-clinic-web

Next.js 16 landing website for aftech Klinik. Driven by the Playwright driver at `.claude/skills/run-clinic-web/driver.mjs` using system Chrome (`/Applications/Google Chrome.app`). All paths relative to `clinic-web/`.

## Prerequisites

- Node 22, npm
- `playwright` package: `npm install -D playwright` (already in devDependencies)
- Chrome installed at `/Applications/Google Chrome.app` (used automatically)
- `clinic-api` running on port 3001 (content is fetched server-side; pages load without it but show empty data)

## Build

```bash
npm install
npm run build          # type-checks + builds .next/
```

## Run — agent path (driver)

```bash
# Start dev server (background)
npm run dev -- --port 3000 &
sleep 4   # wait for Ready

# Screenshot homepage
SS_DIR=.claude/skills/run-clinic-web node .claude/skills/run-clinic-web/driver.mjs ss home

# Smoke all pages (12 pages, saves screenshots to SS_DIR)
SS_DIR=.claude/skills/run-clinic-web node .claude/skills/run-clinic-web/driver.mjs smoke

# Screenshot any path
SS_DIR=/tmp node .claude/skills/run-clinic-web/driver.mjs navigate /promotions promos
```

Driver commands: `ss [label]` | `smoke` | `navigate <path> [label]`

Screenshots: `ss-<label>.png` in `$SS_DIR` (default `.`).

## Run — human path

```bash
npm run dev -- --port 3000
# open http://localhost:3000
```

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, services, doctors, branches, promos, articles |
| `/services`, `/services/[slug]` | Service listing + detail |
| `/doctors`, `/doctors/[slug]` | Doctor listing + detail |
| `/branches`, `/branches/[slug]` | Branch listing + detail |
| `/articles`, `/articles/[slug]` | Article listing + detail |
| `/promotions`, `/promotions/[slug]` | Promo listing + detail |
| `/about` | About page |
| `/faq` | FAQ accordion |
| `/contact` | Contact + form |
| `/login` | Patient login (form, client-side) |
| `/register` | Patient registration (form, client-side) |
| `/booking` | Multi-step booking flow (client-side) |

## Gotchas

- **Login/register forms not found by `input[type=email]` selector** during smoke: pages are Next.js App Router client components that need React hydration. The driver WARNs but the pages do load correctly — check the screenshot to confirm.
- **Empty content sections**: if `clinic-api` is not running, server-side `api.*()` calls fail silently and return `[]`. Pages render empty grids, not errors.
- **Port conflict**: `npm run dev` on port 3000 conflicts if clinic-web is already running. Kill it first: `lsof -ti:3000 | xargs kill -9`.
- **Tailwind v4**: uses `@import "tailwindcss"` in globals.css, not the v3 config plugin. Do not add `tailwind.config.js`.
- **shadcn/ui uses @base-ui/react** (not Radix UI). `Button` has no `asChild` prop — use the `btn()` helper from `lib/utils.ts` for link-styled buttons.

## Troubleshooting

| Error | Fix |
|---|---|
| `EADDRINUSE :::3000` | `lsof -ti:3000 \| xargs kill -9` |
| `Cannot find module 'playwright'` | `npm install -D playwright` |
| Blank screenshots | Increase `waitUntil: 'networkidle'` timeout or check dev server is up |
| `api.branches() failed` | Start `clinic-api` on port 3001 first |
