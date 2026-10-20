/**
 * Tarjeta de branding de LN41.5: paleta (café oscuro, café claro, cobre) y tipografías
 * (Cormorant Garamond Semibold + Montserrat).
 *
 * Uso:  PWPATH=$(npm root -g)/playwright node contenido/templates/generar-branding.mjs
 */
import { createRequire } from 'module';
import { readFileSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PWPATH || 'playwright');
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const f = (p) => `file://${join(root, p)}`;
const topo = `data:image/svg+xml;base64,${readFileSync(join(root, 'public/img/topo.svg')).toString('base64')}`;
const font = (pkg, file) => f(`node_modules/@fontsource/${pkg}/files/${file}`);
const W = 1920, H = 1080;

const colores = [
  { name: 'Café oscuro', hex: '#2F271F', rgb: '47 · 39 · 31', bg: '#2f271f', fg: '#eee6d8', use: 'Fondos principales' },
  { name: 'Café claro', hex: '#EEE6D8', rgb: '238 · 230 · 216', bg: '#eee6d8', fg: '#2f271f', use: 'Fondos y texto sobre oscuro' },
  { name: 'Cobre', hex: '#864105', rgb: '134 · 65 · 5', bg: '#864105', fg: '#eee6d8', use: 'Títulos y detalles sobre claro' },
];

const html = `<style>
@font-face { font-family: 'Cormorant'; font-weight: 600; src: url('${font('cormorant-garamond', 'cormorant-garamond-latin-600-normal.woff2')}'); }
@font-face { font-family: 'Montserrat'; font-weight: 400; src: url('${font('montserrat', 'montserrat-latin-400-normal.woff2')}'); }
@font-face { font-family: 'Montserrat'; font-weight: 500; src: url('${font('montserrat', 'montserrat-latin-500-normal.woff2')}'); }
@font-face { font-family: 'Montserrat'; font-weight: 600; src: url('${font('montserrat', 'montserrat-latin-600-normal.woff2')}'); }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: ${W}px; height: ${H}px; display: grid; grid-template-columns: 1fr 1fr; font-family: 'Montserrat'; -webkit-font-smoothing: antialiased; font-variant-numeric: lining-nums; }
.half { position: relative; padding: 90px 96px; overflow: hidden; display: flex; flex-direction: column; }
.half::before { content: ''; position: absolute; inset: 0; background: var(--tc); opacity: var(--to); -webkit-mask: url('${topo}') center/cover no-repeat; }
.half > * { position: relative; }
.dark { background: #2f271f; color: #eee6d8; --tc: #864105; --to: .35; }
.light { background: #eee6d8; color: #2f271f; --tc: #864105; --to: .2; }
.cap { font-size: 17px; font-weight: 500; letter-spacing: .28em; text-transform: uppercase; }
.copper { color: #864105; } .soft { color: #c9a88a; }
.disp { font-family: 'Cormorant'; font-weight: 600; line-height: .9; text-transform: uppercase; }
h1 { font-size: 150px; margin-top: 36px; }
.sub { font-family: 'Cormorant'; font-weight: 600; font-size: 40px; margin-top: 22px; max-width: 20ch; line-height: 1.1; }
.swatches { margin-top: auto; display: grid; gap: 18px; }
.sw { display: grid; grid-template-columns: 150px 1fr; align-items: stretch; border: 1px solid rgba(238,230,216,.25); }
.chip { height: 132px; }
.info { padding: 22px 28px; display: grid; align-content: center; gap: 8px; background: rgba(30,25,20,.35); }
.info b { font-family: 'Cormorant'; font-weight: 600; font-size: 38px; text-transform: uppercase; letter-spacing: .02em; line-height: 1; }
.info span { font-size: 16px; letter-spacing: .14em; opacity: .85; }
.font { padding: 34px 0; border-top: 1px solid rgba(134,65,5,.35); }
.font:first-of-type { margin-top: 46px; }
.font .row { display: flex; justify-content: space-between; align-items: baseline; }
.big-c { font-size: 104px; margin-top: 14px; }
.big-m { font-family: 'Montserrat'; font-weight: 500; font-size: 78px; margin-top: 18px; letter-spacing: -.01em; line-height: 1; }
.alpha { margin-top: 18px; font-size: 22px; letter-spacing: .06em; }
.alpha.c { font-family: 'Cormorant'; font-weight: 600; font-size: 34px; letter-spacing: .04em; }
.sample { margin-top: 18px; font-size: 21px; line-height: 1.6; max-width: 40ch; color: #5a4a3a; }
</style>
<section class="half dark">
  <p class="cap copper" style="color:#c27a3c">Identidad · Paleta</p>
  <h1 class="disp">LN41.5</h1>
  <p class="sub">Viajes a España diseñados con criterio y conocimiento local.</p>
  <div class="swatches">
    ${colores.map((c) => `<div class="sw"><div class="chip" style="background:${c.bg};${c.hex === '#2F271F' ? 'box-shadow: inset 0 0 0 1px rgba(238,230,216,.35)' : ''}"></div>
      <div class="info"><b>${c.name}</b><span>HEX ${c.hex} &nbsp;·&nbsp; RGB ${c.rgb}</span><span class="cap" style="font-size:13px;opacity:.6">${c.use}</span></div></div>`).join('')}
  </div>
</section>
<section class="half light">
  <p class="cap copper">Identidad · Tipografía</p>
  <div class="font">
    <div class="row"><p class="cap copper">Display / Títulos</p><p class="cap" style="opacity:.6">Semibold 600 · Mayúsculas</p></div>
    <p class="disp big-c copper">Cormorant Garamond</p>
    <p class="alpha c">AaBbCc ÁÉÍÓÚ Ñ 0123456789</p>
  </div>
  <div class="font">
    <div class="row"><p class="cap copper">Texto / Etiquetas</p><p class="cap" style="opacity:.6">Regular 400 · Medium 500</p></div>
    <p class="big-m">Montserrat</p>
    <p class="alpha">AaBbCc ÁÉÍÓÚ Ñ 0123456789</p>
    <p class="sample">Cada viaje se diseña como una nueva experiencia: rutas de autor para conocer la otra España.</p>
  </div>
</section>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
// Se carga desde un archivo para que Chromium acepte las fuentes locales (file://)
const tmp = join(tmpdir(), 'ln415-branding.html');
writeFileSync(tmp, `<!doctype html><meta charset="utf-8">${html}`);
await page.goto(`file://${tmp}`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: join(here, 'branding-ln415.png') });
await browser.close();
rmSync(tmp);
console.log('✓ branding-ln415.png');
