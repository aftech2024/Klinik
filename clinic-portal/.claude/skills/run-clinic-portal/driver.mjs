#!/usr/bin/env node
/**
 * driver.mjs — clinic-portal playwright smoke driver
 * Usage: node driver.mjs [command]
 *   ss [label]               — screenshot
 *   smoke                    — smoke auth pages + attempt login + portal pages
 *   login <email> <pass>     — login as patient and screenshot dashboard
 *   navigate <path> [label]
 */
import { chromium } from 'playwright';
import { resolve } from 'path';

const BASE  = process.env.PORTAL_URL   ?? 'http://localhost:3003';
const SS_DIR = process.env.SS_DIR      ?? '.';
const EMAIL  = process.env.PORTAL_EMAIL ?? 'patient@test.com';
const PASS   = process.env.PORTAL_PASS  ?? 'Test1234!';

const [,, cmd = 'smoke', ...args] = process.argv;

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function withBrowser(fn) {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'], headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  try { await fn(page); } finally { await browser.close(); }
}

const ss = async (page, label) => {
  const file = resolve(SS_DIR, `ss-${label}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`[driver] screenshot → ${file}`);
};

async function doLogin(page, email = EMAIL, pass = PASS) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.fill('input[type=email]', email);
  await page.fill('input[type=password]', pass);
  await page.click('button[type=submit]');
  await page.waitForTimeout(3000);
  const url = page.url();
  console.log(`[driver] after login → ${url}`);
  return url.includes('/login') ? 'failed' : 'ok';
}

if (cmd === 'ss') {
  const [label = 'portal'] = args;
  await withBrowser(async (p) => {
    await p.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await ss(p, label);
  });
} else if (cmd === 'navigate') {
  const [path, label = 'page'] = args;
  await withBrowser(async (p) => {
    await p.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await ss(p, label);
  });
} else if (cmd === 'login') {
  const [email = EMAIL, pass = PASS] = args;
  await withBrowser(async (p) => {
    const result = await doLogin(p, email, pass);
    console.log(`[driver] login result: ${result}`);
    await ss(p, 'portal-dashboard');
  });
} else if (cmd === 'smoke') {
  await withBrowser(async (p) => {
    // Auth pages
    await p.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`[driver] /login → "${await p.title()}"`);
    await ss(p, 'login');

    await p.goto(`${BASE}/register`, { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`[driver] /register → "${await p.title()}"`);
    await ss(p, 'register');

    // Login
    const loginResult = await doLogin(p);
    await ss(p, loginResult === 'ok' ? 'dashboard' : 'login-failed');

    if (loginResult === 'ok') {
      const ROUTES = [
        ['/dashboard',        'dashboard'],
        ['/profile',          'profile'],
        ['/booking',          'booking'],
        ['/queue',            'queue'],
        ['/medical-records',  'medical-records'],
        ['/billing',          'billing'],
        ['/notifications',    'notifications'],
      ];
      for (const [path, label] of ROUTES) {
        await p.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
        console.log(`[driver] ${path} → "${await p.title()}"`);
        await ss(p, label);
      }
      console.log('[driver] smoke done');
    } else {
      console.warn('[driver] WARN: login failed — set PORTAL_EMAIL + PORTAL_PASS or register first');
    }
  });
} else {
  console.error(`Unknown: ${cmd}. Use: ss [label] | smoke | login [email] [pass] | navigate <path> [label]`);
  process.exit(1);
}
