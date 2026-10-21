/**
 * Portada de Facebook de LN41.5 (1640×624, el doble de 820×312 para que se vea nítida).
 * En el celular Facebook muestra solo el centro (x ≈ 370–1270), pone la foto de perfil
 * redonda al centro abajo y encima los íconos (atrás, compartir, buscar). Por eso el texto
 * va centrado arriba y las fotos a los lados de la foto de perfil. Sin logo.
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

// Tarjetas de ruta: las dos de en medio se ven en el celular; las de las orillas solo en desktop
const icons = {
  castillo: 'M4 21V8h2.5v2.5H9V8h2.5v2.5h1V8H15v2.5h2.5V8H20v13H4zM10 21v-4.5a2 2 0 0 1 4 0V21',
  montana: 'M2.5 20 9 9l3.5 5.5L15 11l6.5 9z',
  copa: 'M8 3h8l-.4 5.2a3.6 3.6 0 0 1-7.2 0L8 3zM12 12v8M8.5 20.5h7',
  ola: 'M3 10c1.5 0 1.5-1.5 3-1.5S7.5 10 9 10s1.5-1.5 3-1.5S13.5 10 15 10s1.5-1.5 3-1.5S19.5 10 21 10M3 15c1.5 0 1.5-1.5 3-1.5S7.5 15 9 15s1.5-1.5 3-1.5S13.5 15 15 15s1.5-1.5 3-1.5S19.5 15 21 15',
};
const cards = [
  { foto: 'ruta-castellana', x: 120, y: 300, w: 180, h: 250, rot: -3, icon: icons.castillo },
  { foto: 'hero', x: 410, y: 320, w: 185, h: 260, rot: 2, icon: icons.montana },
  { foto: 'ruta-vino', x: 1045, y: 320, w: 185, h: 260, rot: -2, icon: icons.copa },
  { foto: 'ruta-atlantica', x: 1340, y: 300, w: 180, h: 250, rot: 3, icon: icons.ola },
];
const badge = (c) => ({ x: c.x + c.w - 26, y: c.y + 4 });
const b = cards.map(badge);
// El sendero entra por la izquierda, pasa por los badges y baja por el centro (detrás de la foto de perfil)
const trail = `M -20 360 C 40 300, ${b[0].x - 60} ${b[0].y - 50}, ${b[0].x} ${b[0].y}
  S ${b[1].x - 80} ${b[1].y - 50}, ${b[1].x} ${b[1].y}
  C ${b[1].x + 120} ${b[1].y + 40}, 720 560, 820 560 S ${b[2].x - 140} ${b[2].y + 30}, ${b[2].x} ${b[2].y}
  S ${b[3].x - 80} ${b[3].y - 60}, ${b[3].x} ${b[3].y} S ${W - 40} 300, ${W + 20} 260`;

const html = `<!doctype html><meta charset="utf-8"><style>
@font-face { font-family: 'Cormorant'; font-weight: 600; src: url('${font('cormorant-garamond', 'cormorant-garamond-latin-600-normal.woff2')}'); }
@font-face { font-family: 'Cormorant'; font-weight: 600; font-style: italic; src: url('${font('cormorant-garamond', 'cormorant-garamond-latin-600-italic.woff2')}'); }
@font-face { font-family: 'Montserrat'; font-weight: 500; src: url('${font('montserrat', 'montserrat-latin-500-normal.woff2')}'); }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: ${W}px; height: ${H}px; position: relative; overflow: hidden; background: #2f271f; color: #eee6d8; font-family: 'Montserrat'; -webkit-font-smoothing: antialiased; font-variant-numeric: lining-nums; }
body::before { content: ''; position: absolute; inset: 0; background: #f0c054; opacity: .14; -webkit-mask: url('${topo}') center/cover no-repeat; }
.copy { position: absolute; left: 0; right: 0; top: 0; height: 100%; text-align: center; }
.copy .cap { position: absolute; left: 0; right: 0; top: 120px; justify-content: center; display: flex; }
.copy h1 { position: absolute; left: 0; right: 0; top: 234px; margin: 0; }
.cap { font-size: 16px; font-weight: 500; letter-spacing: .3em; text-transform: uppercase; color: #f0c054; display: inline-flex; align-items: center; gap: 16px; }
.cap::before, .cap::after { content: ''; width: 48px; height: 1px; background: currentColor; opacity: .7; }
h1 { font-family: 'Cormorant'; font-weight: 600; font-size: 58px; line-height: 1; white-space: nowrap; text-transform: uppercase; color: #f0c054; margin-top: 16px; }
.sub { font-family: 'Cormorant'; font-weight: 600; font-style: italic; font-size: 28px; line-height: 1.2; margin-top: 22px; max-width: 30ch; }
.card { position: absolute; overflow: hidden; box-shadow: 0 18px 40px rgba(0,0,0,.35); }
.card img { width: 100%; height: 100%; object-fit: cover; display: block; }
svg.overlay { position: absolute; inset: 0; }
.badge { position: absolute; width: 52px; height: 52px; margin: -26px 0 0 -26px; border-radius: 50%; background: #f0c054; color: #1e1914; display: grid; place-items: center; box-shadow: 0 0 0 4px #2f271f, 0 0 0 5.5px #f0c054; }
</style>
<div class="copy">
  <p class="cap">Viajes diseñados con criterio y conocimiento local</p>
  <h1>España desde dentro.</h1>
</div>
<svg class="overlay" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <path d="${trail}" fill="none" stroke="#fccc6c" stroke-width="3" stroke-linecap="round" opacity=".95"/>
  <circle cx="820" cy="560" r="9" fill="#2f271f" stroke="#fccc6c" stroke-width="3.5"/>
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
// Vista previa en celular: recorte del centro + foto de perfil e íconos que pone Facebook encima
await page.evaluate(() => {
  const g = document.createElement('div');
  g.innerHTML = `<div style="position:absolute;left:628px;top:295px;width:384px;height:384px;border-radius:50%;background:#2f271f;border:8px solid #fff;z-index:20"></div>
    <div style="position:absolute;left:0;right:0;top:548px;bottom:0;background:#fff;z-index:19"></div>
    ${[410, 982, 1083, 1185].map((x) => `<div style="position:absolute;left:${x}px;top:178px;width:48px;height:48px;border-radius:50%;border:3px solid #fff;z-index:21"></div>`).join('')}`;
  document.body.append(g);
});
await page.screenshot({ path: join(here, 'portada-facebook-vista-movil.png'), clip: { x: 369, y: 0, width: 902, height: H } });
await browser.close();
rmSync(tmp);
console.log('✓ portada-facebook');
