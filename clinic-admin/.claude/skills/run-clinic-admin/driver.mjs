#!/usr/bin/env node
/**
 * driver.mjs — clinic-admin playwright smoke driver
 * Usage: node driver.mjs [command]
 *   ss [label]             — screenshot current page
 *   smoke                  — smoke all protected pages (needs admin token)
 *   login <email> <pass>   — login and screenshot dashboard
 *   navigate <path> [label]
 */
import { chromium } from 'playwright';
import { resolve } from 'path';

const BASE = process.env.ADMIN_URL ?? 'http://localhost:3002';
const SS_DIR = process.env.SS_DIR ?? '.';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@aftechklinik.com';
const ADMIN_PASS  = process.env.ADMIN_PASS  ?? 'Admin123!';

const [,, cmd = 'smoke', ...args] = process.argv;

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function withBrowser(fn) {
  const browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  try {
    await fn(page, ctx);
  } finally {
    await browser.close();
  }
}

async function ss(page, label) {
  const file = resolve(SS_DIR, `ss-${label}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`[driver] screenshot → ${file}`);
  return file;
}

async function doLogin(page, email = ADMIN_EMAIL, pass = ADMIN_PASS) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.fill('input[type=email]', email);
  await page.fill('input[type=password]', pass);
  await page.click('button[type=submit]');
  await page.waitForNavigation({ timeout: 8000 }).catch(() => {});
  const url = page.url();
  console.log(`[driver] after login → ${url}`);
  return url.includes('/login') ? 'login-failed' : 'ok';
}

if (cmd === 'ss') {
  const [label = 'admin'] = args;
  await withBrowser(async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await ss(page, label);
  });
} else if (cmd === 'navigate') {
  const [path, label = 'page'] = args;
  await withBrowser(async (page) => {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await ss(page, label);
  });
} else if (cmd === 'login') {
  const [email = ADMIN_EMAIL, pass = ADMIN_PASS] = args;
  await withBrowser(async (page) => {
    await ss(page, 'before-login');
    const result = await doLogin(page, email, pass);
    console.log(`[driver] login result: ${result}`);
    await ss(page, 'after-login');
  });
} else if (cmd === 'smoke') {
  await withBrowser(async (page) => {
    // Login page
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`[driver] /login → "${await page.title()}"`);
    await ss(page, 'login');

    // Try to login with admin credentials
    const loginResult = await doLogin(page);

    if (loginResult === 'ok') {
      // Smoke dashboard pages
      const ROUTES = [
        ['/dashboard',    'dashboard'],
        ['/patients',     'patients'],
        ['/doctors',      'doctors'],
        ['/branches',     'branches'],
        ['/appointments', 'appointments'],
        ['/queue',        'queue'],
        ['/billing',      'billing'],
        ['/reports',      'reports'],
        ['/settings',     'settings'],
      ];
      for (const [path, label] of ROUTES) {
        await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
        const title = await page.title();
        console.log(`[driver] ${path} → "${title}"`);
        await ss(page, label);
      }
      console.log('[driver] smoke done — all admin pages loaded');
    } else {
      console.warn('[driver] WARN: login failed — only login page tested');
      console.warn('[driver] Set ADMIN_EMAIL and ADMIN_PASS env vars, or seed admin user first');
    }
  });
} else {
  console.error(`Unknown command: ${cmd}. Use: ss [label] | smoke | login [email] [pass] | navigate <path> [label]`);
  process.exit(1);
}
