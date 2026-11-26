// Smoke test: opens every game mode in a headless browser and fails if any
// console error or uncaught page error shows up.
// Run: npm install && npx playwright install chromium, then npm run test:smoke
// One mode only: npm run test:smoke -- story
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HASH = 'df09c633be73aa5e8ce3bd432a75a7bba47b2fe109b0984577e5cba799ebeb32'; // same as index.html: skips the code lock
const SETTLE = 2500; // ms to let each mode run after it opens

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary', '.jpg': 'image/jpeg' };

function serve() {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}

const visible = (page, sel) => page.locator(sel).first().waitFor({ state: 'visible', timeout: 20000 });

// Each mode: how to get there from the main map, and what must be on screen afterwards.
const MODES = {
  async map(page) { await visible(page, '#sea'); await visible(page, '#modes'); },
  async bridge(page) {
    await page.click('#b3d'); await visible(page, '#v3drive');
    await page.click('#v3drive'); await visible(page, '#dExit');
  },
  async story(page) {
    await page.click('#mStory'); await visible(page, '#skPick [data-st="titanic"]');
    await page.click('#skPick [data-st="titanic"]'); await visible(page, '#skNarr');
  },
  async sandbox(page) { await page.click('#mSandbox'); await visible(page, '#sbxBtns'); },
  async dive(page) {
    await page.click('#mDive'); await visible(page, '#wkPick [data-wk]');
    await page.click('#wkPick [data-wk]'); await visible(page, '#dvTop'); // first wreck is the Titanic dive
  },
  async fleet(page) {
    await page.click('#mFleet');
    const f = page.frameLocator('#fleetBox iframe');
    await f.locator('body').waitFor({ timeout: 20000 });
  },
};

async function run() {
  const only = process.argv.slice(2);
  const srv = await serve();
  const base = `http://127.0.0.1:${srv.address().port}/`;
  const browser = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] });
  let failed = 0;
  for (const [name, go] of Object.entries(MODES)) {
    if (only.length && !only.includes(name)) continue;
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, serviceWorkers: 'block' });
    await ctx.addInitScript(h => { try { localStorage.setItem('sbt-key', h); } catch (e) {} }, HASH);
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
    page.on('pageerror', e => errors.push(`page error: ${e.message}`));
    page.on('requestfailed', r => errors.push(`request failed: ${r.url()} (${r.failure()?.errorText})`));
    const t0 = Date.now();
    try {
      await page.goto(base, { waitUntil: 'load', timeout: 60000 });
      await page.waitForFunction(() => !document.getElementById('lock'), null, { timeout: 20000 });
      await go(page);
      await page.waitForTimeout(SETTLE);
    } catch (e) { errors.push(`step failed: ${e.message.split('\n')[0]}`); }
    const s = ((Date.now() - t0) / 1000).toFixed(1);
    if (errors.length) { failed++; console.log(`FAIL ${name} (${s}s)`); errors.forEach(x => console.log('   ' + x)); }
    else console.log(`ok   ${name} (${s}s)`);
    await ctx.close();
  }
  await browser.close(); srv.close();
  console.log(failed ? `\n${failed} mode(s) failed` : '\nall modes ok');
  process.exit(failed ? 1 : 0);
}
run();
