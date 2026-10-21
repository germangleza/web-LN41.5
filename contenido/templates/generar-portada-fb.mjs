/**
 * Portada de Facebook de LN41.5 (1640×624, el doble de 820×312 para que se vea nítida).
 * En móvil Facebook recorta los costados: todo lo importante va en el centro (x 265–1375).
 * Sin logo: se agrega después.
 *
 * Uso:  PWPATH=$(npm root -g)/playwright node contenido/templates/generar-portada-fb.mjs
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
const font = (pkg, file) => f(`node_modules/@fontsource/${pkg}/files/${file}`);
const topo = `data:image/svg+xml;base64,${readFileSync(join(root, 'public/img/topo.svg')).toString('base64')}`;
const W = 1640, H = 624;

// Tres tarjetas de ruta con su badge; el sendero pasa por los badges
const cards = [
  { foto: 'hero', x: 880, y: 150, w: 150, h: 300, rot: -3, icon: 'M2.5 20 9 9l3.5 5.5L15 11l6.5 9z' },
  { foto: 'ruta-vino', x: 1050, y: 110, w: 150, h: 300, rot: 2.5, icon: 'M8 3h8l-.4 5.2a3.6 3.6 0 0 1-7.2 0L8 3zM12 12v8M8.5 20.5h7' },
  { foto: 'ruta-atlantica', x: 1220, y: 170, w: 150, h: 300, rot: -1.5, icon: 'M3 10c1.5 0 1.5-1.5 3-1.5S7.5 10 9 10s1.5-1.5 3-1.5S13.5 10 15 10s1.5-1.5 3-1.5S19.5 10 21 10M3 15c1.5 0 1.5-1.5 3-1.5S7.5 15 9 15s1.5-1.5 3-1.5S13.5 15 15 15s1.5-1.5 3-1.5S19.5 15 21 15' },
];
const badge = (c) => ({ x: c.x + c.w - 26, y: c.y + 4 });
const b = cards.map(badge);
const trail = `M 300 500 C 620 515, 830 505, 848 400 S ${b[0].x - 50} ${b[0].y - 60}, ${b[0].x} ${b[0].y}
  S ${b[1].x - 70} ${b[1].y - 60}, ${b[1].x} ${b[1].y} S ${b[2].x - 70} ${b[2].y - 90}, ${b[2].x} ${b[2].y}
  S ${b[2].x + 120} ${b[2].y + 40}, 1700 120`;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: 'Cormorant'; font-weight: 600; src: url('${font('cormorant-garamond', 'cormorant-garamond-latin-600-normal.woff2')}'); }
@font-face { font-family: 'Cormorant'; font-weight: 600; font-style: italic; src: url('${font('cormorant-garamond', 'cormorant-garamond-latin-600-italic.woff2')}'); }
@font-face { font-family: 'Montserrat'; font-weight: 500; src: url('${font('montserrat', 'montserrat-latin-500-normal.woff2')}'); }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: ${W}px; height: ${H}px; position: relative; overflow: hidden; background: #2f271f; color: #eee6d8; font-family: 'Montserrat'; -webkit-font-smoothing: antialiased; font-variant-numeric: lining-nums; }
body::before { content: ''; position: absolute; inset: 0; background: #f0c054; opacity: .14; -webkit-mask: url('${topo}') center/cover no-repeat; }
.copy { position: absolute; left: 300px; top: 168px; width: 560px; }
.cap { font-size: 15px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: #f0c054; display: flex; align-items: center; gap: 16px; }
.cap::after { content: ''; width: 56px; height: 1px; background: currentColor; opacity: .7; }
h1 { font-family: 'Cormorant'; font-weight: 600; font-size: 72px; line-height: .92; white-space: nowrap; text-transform: uppercase; color: #f0c054; margin-top: 24px; }
.sub { font-family: 'Cormorant'; font-weight: 600; font-style: italic; font-size: 28px; line-height: 1.2; margin-top: 22px; max-width: 30ch; }
.card { position: absolute; overflow: hidden; box-shadow: 0 18px 40px rgba(0,0,0,.35); }
.card img { width: 100%; height: 100%; object-fit: cover; display: block; }
svg.overlay { position: absolute; inset: 0; }
.badge { position: absolute; width: 52px; height: 52px; margin: -26px 0 0 -26px; border-radius: 50%; background: #f0c054; color: #1e1914; display: grid; place-items: center; box-shadow: 0 0 0 4px #2f271f, 0 0 0 5.5px #f0c054; }
</style>
<div class="copy">
  <p class="cap">Rutas de autor</p>
  <h1>España<br>desde dentro.</h1>
  <p class="sub">Viajes diseñados con criterio y conocimiento local.</p>
</div>
<svg class="overlay" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <path d="${trail}" fill="none" stroke="#fccc6c" stroke-width="3" stroke-linecap="round" opacity=".95"/>
  <circle cx="300" cy="500" r="9" fill="#2f271f" stroke="#fccc6c" stroke-width="3.5"/>
</svg>
${cards.map((c) => `<div class="card" style="left:${c.x}px;top:${c.y}px;width:${c.w}px;height:${c.h}px;rotate:${c.rot}deg"><img src="${f(`src/assets/fotos/${c.foto}.jpg`)}"></div>`).join('')}
${cards.map((c) => { const p = badge(c); return `<span class="badge" style="left:${p.x}px;top:${p.y}px"><svg viewBox="0 0 24 24" width="24" height="24"><path d="${c.icon}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`; }).join('')}
`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
const tmp = join(tmpdir(), 'ln415-portada-fb.html');
writeFileSync(tmp, html);
await page.goto(`file://${tmp}`, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: join(here, 'portada-facebook-1640x624.png') });
// Vista previa del recorte en móvil (centro 1109×624)
await page.screenshot({ path: join(here, 'portada-facebook-vista-movil.png'), clip: { x: (W - 1109) / 2, y: 0, width: 1109, height: H } });
await browser.close();
rmSync(tmp);
console.log('✓ portada-facebook');
