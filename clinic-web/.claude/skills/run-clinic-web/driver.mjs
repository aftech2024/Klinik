#!/usr/bin/env node
/**
 * driver.mjs — clinic-web playwright smoke driver
 * Usage: node driver.mjs [command]
 *   ss [label]   — screenshot → ss-<label>.png (default: "home")
 *   smoke        — full page smoke: home, services, doctors, articles, about
 *   navigate <url> [label] — screenshot any path
 */
import { chromium } from 'playwright';
import { existsSync } from 'fs';
import { resolve } from 'path';

const BASE = process.env.WEB_URL ?? 'http://localhost:3000';
const SS_DIR = process.env.SS_DIR ?? '.';

const [,, cmd = 'smoke', ...args] = process.argv;

async function withPage(fn) {
  // Try system Chrome first, fall back to playwright bundled chromium
  const executablePath = existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome')
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : undefined;

  const browser = await chromium.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await fn(page);
  } finally {
    await browser.close();
  }
}

async function screenshot(page, label) {
  const file = resolve(SS_DIR, `ss-${label}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`[driver] screenshot → ${file}`);
  return file;
}

async function smokeCheck(page, path, label, selector) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
  const title = await page.title();
  console.log(`[driver] ${path} → "${title}"`);
  if (selector) {
    const found = await page.locator(selector).count();
    if (!found) console.warn(`[driver] WARN: selector "${selector}" not found on ${path}`);
    else console.log(`[driver] PASS: found "${selector}"`);
  }
  await screenshot(page, label);
}

if (cmd === 'ss') {
  const [label = 'home'] = args;
  await withPage(async (page) => {
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
    await screenshot(page, label);
  });
} else if (cmd === 'navigate') {
  const [path, label = 'page'] = args;
  await withPage(async (page) => {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    await screenshot(page, label);
  });
} else if (cmd === 'smoke') {
  await withPage(async (page) => {
    await smokeCheck(page, '/',           'home',     'text=aftech Klinik');
    await smokeCheck(page, '/services',   'services', 'h1');
    await smokeCheck(page, '/doctors',    'doctors',  'h1');
    await smokeCheck(page, '/branches',   'branches', 'h1');
    await smokeCheck(page, '/articles',   'articles', 'h1');
    await smokeCheck(page, '/about',      'about',    'h1');
    await smokeCheck(page, '/faq',        'faq',      'h1');
    await smokeCheck(page, '/contact',    'contact',  'h1');
    await smokeCheck(page, '/login',      'login',    'input[type=email]');
    await smokeCheck(page, '/register',   'register', 'input[type=email]');
    await smokeCheck(page, '/promotions', 'promos',   'h1');
    await smokeCheck(page, '/booking',    'booking',  'h1');
    console.log('[driver] smoke done — all pages loaded');
  });
} else {
  console.error(`Unknown command: ${cmd}. Use: ss [label] | smoke | navigate <path> [label]`);
  process.exit(1);
}
