/**
 * Genera las piezas de redes de LN41.5 (1080×1350, 4:5) con el sistema visual de la web.
 * Cada carrusel se dibuja como un lienzo continuo y se corta en slides, para que el
 * sendero y la línea punteada crucen de una slide a otra.
 *
 * Uso:  PWPATH=$(npm root -g)/playwright node contenido/generar.mjs
 */
import { createRequire } from 'module';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PWPATH || 'playwright');

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const W = 1080, H = 1350;
const f = (p) => `file://${join(root, p)}`;
// Usa las mismas fotos de la web (src/assets/fotos)
const foto = (n) => f(`src/assets/fotos/${n}.jpg`);
// La textura topográfica va incrustada: Chromium no aplica máscaras SVG desde file://
const topo = `data:image/svg+xml;base64,${readFileSync(join(root, 'public/img/topo.svg')).toString('base64')}`;

const css = `
@font-face { font-family: 'Cormorant'; font-weight: 600; src: url('${f('node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2')}'); }
@font-face { font-family: 'Cormorant'; font-weight: 600; font-style: italic; src: url('${f('node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-italic.woff2')}'); }
@font-face { font-family: 'Montserrat'; font-weight: 400; src: url('${f('node_modules/@fontsource/montserrat/files/montserrat-latin-400-normal.woff2')}'); }
@font-face { font-family: 'Montserrat'; font-weight: 500; src: url('${f('node_modules/@fontsource/montserrat/files/montserrat-latin-500-normal.woff2')}'); }
@font-face { font-family: 'Montserrat'; font-weight: 600; src: url('${f('node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff2')}'); }
:root { --ink:#1e1914; --base:#2f271f; --gold:#f0c054; --gold2:#fccc6c; --copper:#864105; --sand:#eee6d8; --stone:#a89a86; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { width: var(--w); height: ${H}px; position: relative; overflow: hidden; font-family: 'Montserrat'; font-variant-numeric: lining-nums; -webkit-font-smoothing: antialiased; }
.slide { position: absolute; top: 0; width: ${W}px; height: ${H}px; overflow: hidden; padding: 96px 88px; }
.ink { background: var(--ink); color: var(--sand); } .base { background: var(--base); color: var(--sand); } .sand { background: var(--sand); color: var(--base); }
.topo::before { content:''; position:absolute; inset:0; background: var(--tc, var(--gold)); opacity: var(--to, .16); z-index: 0; -webkit-mask: url('${topo}') center/cover no-repeat; }
.sand.topo { --tc: var(--copper); --to: .2; }
.bg { position:absolute; inset:0; background-size: cover; background-position: center; }
.shade::after { content:''; position:absolute; inset:0; background: linear-gradient(to top, rgba(30,25,20,.96) 0%, rgba(30,25,20,.6) 42%, rgba(30,25,20,.12) 75%, rgba(30,25,20,.35) 100%); }
.shade.strong::after { background: linear-gradient(to top, rgba(30,25,20,.97) 0%, rgba(30,25,20,.82) 55%, rgba(30,25,20,.35) 100%); }
.rel { position: relative; z-index: 3; }
.cap { font-family:'Montserrat'; font-weight:500; font-size: 22px; letter-spacing: .2em; text-transform: uppercase; line-height: 1.4; }
.label { display:flex; align-items:center; gap:18px; }
.label::after { content:''; width: 72px; height: 1.5px; background: currentColor; opacity:.7; }
.disp { font-family:'Cormorant'; font-weight:600; text-transform:uppercase; line-height:.86; letter-spacing:-.01em; }
.lead { font-family:'Cormorant'; font-weight:600; line-height:1.06; }
.it { font-style: italic; }
.body { font-size: 34px; line-height: 1.5; }
.gold { color: var(--gold); } .copper { color: var(--copper); } .sandc { color: var(--sand); } .stone { color: var(--stone); } .basec { color: var(--base); }
.btn { display:inline-flex; align-items:center; gap:14px; padding: 26px 40px; border: 2px solid currentColor; font-weight:600; font-size: 24px; letter-spacing:.18em; text-transform: uppercase; }
.btn.solid { background: var(--gold); border-color: var(--gold); color: var(--ink); }
.count { position:absolute; top: 96px; right: 88px; z-index: 4; }
.mono { position:absolute; right: 80px; bottom: 72px; height: 76px; z-index: 4; }
.bottom { position:absolute; left: 88px; right: 88px; bottom: 120px; z-index: 3; }
.tilt { position:absolute; overflow:hidden; background-size:cover; background-position:center; }
.badge { position:absolute; z-index:6; width:108px; height:108px; border-radius:50%; background: var(--gold); color: var(--ink); display:grid; place-items:center; box-shadow: 0 0 0 8px var(--ink), 0 0 0 11px var(--gold); }
.badge svg { width: 50px; height: 50px; }
svg.overlay { position:absolute; top:0; left:0; z-index:5; pointer-events:none; }
.row { display:grid; grid-template-columns: 110px 1fr; align-items: baseline; padding: 34px 0; border-top: 1.5px solid rgba(134,65,5,.3); }
.row:last-child { border-bottom: 1.5px solid rgba(134,65,5,.3); }
.row b { font-family:'Cormorant'; font-weight:600; font-size: 64px; color: var(--copper); line-height: 1; }
.row span { font-size: 36px; line-height: 1.35; }
.rows5 .row { padding: 30px 0; }
.rows5 .row b { font-size: 58px; }
.rows5 .row span { font-size: 34px; }
`;

const count = (i, n, cls = 'gold') => `<p class="cap count ${cls}">${String(i).padStart(2, '0')} / ${String(n).padStart(2, '0')}</p>`;
const icon = {
  copa: 'M8 3h8l-.4 5.2a3.6 3.6 0 0 1-7.2 0L8 3zM12 12v8M8.5 20.5h7',
  ola: 'M3 10c1.5 0 1.5-1.5 3-1.5S7.5 10 9 10s1.5-1.5 3-1.5S13.5 10 15 10s1.5-1.5 3-1.5S19.5 10 21 10M3 15c1.5 0 1.5-1.5 3-1.5S7.5 15 9 15s1.5-1.5 3-1.5S13.5 15 15 15s1.5-1.5 3-1.5S19.5 15 21 15',
  castillo: 'M4 21V8h2.5v2.5H9V8h2.5v2.5h1V8H15v2.5h2.5V8H20v13H4zM10 21v-4.5a2 2 0 0 1 4 0V21',
  montana: 'M2.5 20 9 9l3.5 5.5L15 11l6.5 9zM7.2 12.2 9 13.5l1.6-1.4',
  encina: 'M12 21v-6M12 15c-4.5 0-7.5-2.4-7.5-5.6C4.5 6.3 7.8 4 12 4s7.5 2.3 7.5 5.4c0 3.2-3 5.6-7.5 5.6zM9 21h6',
};
const badge = (name, x, y) => `<div class="badge" style="left:${x - 54}px;top:${y - 54}px"><svg viewBox="0 0 24 24"><path d="${icon[name]}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
const at = (i) => `left:${i * W}px`;

/* ---------------- POSTS ---------------- */
const posts = [];

// POST 1 · Imagen · España desde dentro
posts.push({ id: 'post-01-espana-desde-dentro', n: 1, html: `
<section class="slide ink" style="${at(0)}">
  <div class="bg shade" style="background-image:url('${foto('hero')}');background-position:62% center"></div>
  <div class="bottom">
    <h1 class="disp gold" style="font-size:190px">España<br>desde<br>dentro.</h1>
    <p class="cap sandc" style="margin-top:44px;font-size:26px">Viajes a España diseñados a tu medida</p>
  </div>
</section>` });

// POST 2 · Carrusel · El punto de partida
posts.push({ id: 'post-02-punto-de-partida', n: 5, html: `
<section class="slide ink" style="${at(0)}">
  <div class="bg shade" style="background-image:url('${foto('ruta-vino')}');background-position:center"></div>
  <div style="position:absolute;inset:0 0 auto 0;height:360px;z-index:2;background:linear-gradient(to bottom, rgba(30,25,20,.85), rgba(30,25,20,0))"></div>
  ${count(1, 5)}
  <div class="rel">
    <p class="cap label gold">El punto de partida</p>
  </div>
  <div class="bottom">
    <h2 class="disp sandc" style="font-size:132px">Viajar hoy es más fácil que nunca.</h2>
    <p class="lead it gold" style="font-size:80px;margin-top:40px">Y reservar no es el problema.</p>
    <p class="cap gold" style="margin-top:72px">Desliza →</p>
  </div>
</section>
<section class="slide ink topo" style="${at(1)}">
  ${count(2, 5)}
  <div class="bottom" style="bottom:200px">
    <h2 class="disp gold" style="font-size:150px">El reto<br>es otro.</h2>
    <p class="lead sandc" style="font-size:62px;margin-top:64px">Saber qué sí vale la pena, qué dejar fuera y cómo construir un viaje que realmente se sienta propio.</p>
  </div>
</section>
<section class="slide ink topo" style="${at(2)}">
  ${count(3, 5)}
  <div class="tilt" style="left:150px;top:150px;width:780px;height:640px;rotate:-4deg;background-image:url('${foto('para-ti')}')"></div>
  <div class="bottom" style="bottom:150px">
    <h2 class="disp sandc" style="font-size:118px">Es para quienes quieren viajar mejor.</h2>
  </div>
</section>
<section class="slide sand topo" style="${at(3)}">
  ${count(4, 5, 'copper')}
  <p class="cap label copper rel">Para ti si…</p>
  <div class="bottom rows5" style="bottom:130px">
    <div class="row"><b>01</b><span>Ya conociste España y quieres volver.</span></div>
    <div class="row"><b>02</b><span>Quieres salirte del itinerario típico.</span></div>
    <div class="row"><b>03</b><span>Valoras gastronomía, historia, cultura y regiones.</span></div>
    <div class="row"><b>04</b><span>Prefieres criterio en vez de mil recomendaciones.</span></div>
    <div class="row"><b>05</b><span>Quieres un viaje más personal y menos genérico.</span></div>
  </div>
</section>
<section class="slide base topo" style="${at(4)}">
  ${count(5, 5)}
  <div class="bottom" style="bottom:200px">
    <h2 class="disp gold" style="font-size:132px">LN41.5 nace de esa idea.</h2>
    <p class="body sandc" style="margin-top:48px;max-width:820px">Conocer España con más criterio, más contexto y menos itinerario típico.</p>
    <p style="margin-top:64px"><span class="btn gold">Diseñar mi viaje →</span></p>
  </div>
</section>` });

// POST 3 · Imagen · Manifiesto
posts.push({ id: 'post-03-manifiesto', n: 1, html: `
<section class="slide sand topo" style="${at(0)};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
  <p class="cap copper rel" style="display:flex;gap:18px;align-items:center"><span style="width:72px;height:1.5px;background:currentColor"></span>Nuestro norte<span style="width:72px;height:1.5px;background:currentColor"></span></p>
  <p class="body basec rel" style="margin-top:110px">Cada viaje debería dejar<br>una sensación muy simple:</p>
  <p class="lead it copper rel" style="font-size:118px;line-height:1;margin-top:56px">“Esto no lo habría armado así por mi cuenta.”</p>
  <p class="cap basec rel" style="margin-top:110px">Ese es el estándar.</p>
</section>` });

// POST 4 · Carrusel · Rutas de autor (sendero continuo de badge en badge)
const rutas = [
  { badge: 'castillo', title: 'España Castellana', sub: 'Castillos, Fogones y Silencio', text: 'Fortalezas, pueblos medievales, viñedos y mesas compartidas. Historia y gastronomía sin prisas.', img: 'ruta-castellana', rot: -3 },
  { badge: 'copa', title: 'España del Vino', sub: 'Rioja Alavesa & Ribera del Duero', text: 'Dos territorios, dos formas de interpretar el vino. Viñedos, bodegas de autor y las personas detrás de cada botella.', img: 'ruta-vino', rot: 2.5 },
  { badge: 'montana', title: 'Catalunya Insólita', sub: 'Menos evidente, más personal', text: 'Del Priorat a los Pirineos y el Empordà: pueblos, paisaje y gastronomía más allá de Barcelona.', img: 'ruta-catalunya', rot: -2 },
  { badge: 'encina', title: 'España Profunda', sub: 'Extremadura · Dehesa, Imperios y Silencio', text: 'Ciudades monumentales, dehesas, productores y monasterios en una de las regiones menos exploradas.', img: 'ruta-profunda', rot: 2 },
  { badge: 'ola', title: 'España Atlántica', sub: 'La España Verde, Marinera y Celta', text: 'De Galicia al País Vasco: faros, pueblos marineros, aldeas de piedra y cocina del Cantábrico.', img: 'ruta-atlantica', rot: -2.5 },
];
const NR = rutas.length, NS = NR + 2;
const B = rutas.map((_, i) => ({ x: (i + 1) * W + 880, y: 150 })); // badges de cada ruta
// Sendero: sale bajo el título, corre por la franja superior de badge en badge y baja por la derecha al botón
let trailPath = `M600 1060 C820 1060, 1010 900, 1010 700 S1180 120, 1500 110 S1800 230, ${B[0].x} ${B[0].y}`;
const dots = [{ x: 600, y: 1060 }, { x: 1010, y: 700 }];
for (let i = 0; i < NR - 1; i++) {
  const x = B[i].x;
  trailPath += ` S${x + 340} 40, ${x + 560} 110 S${x + 900} 230, ${B[i + 1].x} ${B[i + 1].y}`;
  dots.push({ x: x + 560, y: 110 });
}
const L = B[NR - 1].x;
trailPath += ` S${L + 580} 120, ${L + 860} 420 S${L + 1180} 900, ${L + 1160} 1110`;
dots.push({ x: L + 1160, y: 1110 });
posts.push({ id: 'post-04-rutas-de-autor', n: NS, html: `
<section class="slide ink topo" style="${at(0)}">
  ${count(1, NS)}
  <p class="cap label gold rel">Rutas de autor</p>
  <h2 class="disp gold rel" style="font-size:150px;margin-top:150px">Rutas de<br>autor<br>LN41.5</h2>
  <p class="lead sandc rel" style="font-size:56px;margin-top:40px;max-width:640px">5 maneras de comenzar a conocer la otra España.</p>
  <p class="cap gold" style="position:absolute;left:88px;bottom:120px">Desliza →</p>
</section>
${rutas.map((r, i) => `
<section class="slide ink topo" style="${at(i + 1)}">
  <p class="cap gold" style="position:absolute;top:96px;left:88px;z-index:4">${String(i + 2).padStart(2, '0')} / ${String(NS).padStart(2, '0')}</p>
  <div class="tilt" style="left:110px;top:220px;width:860px;height:600px;rotate:${r.rot}deg;background-image:url('${foto(r.img)}')"></div>
  <div class="bottom" style="bottom:100px">
    <p class="cap gold">Ruta ${String(i + 1).padStart(2, '0')}</p>
    <h3 class="disp sandc" style="font-size:96px;margin-top:20px">${r.title}</h3>
    <p class="lead it gold" style="font-size:44px;margin-top:14px">${r.sub}</p>
    <p class="body stone" style="margin-top:20px;font-size:30px">${r.text}</p>
  </div>
</section>`).join('')}
<section class="slide base topo" style="${at(NS - 1)}">
  ${count(NS, NS)}
  <div class="bottom" style="bottom:330px;left:88px">
    <h2 class="disp gold" style="font-size:140px">¿Cuál va<br>contigo?</h2>
    <p class="body sandc" style="margin-top:44px;max-width:700px">Cada ruta es un punto de partida. La ajustamos a tu ritmo, tus fechas y tus intereses.</p>
  </div>
  <p style="position:absolute;left:340px;bottom:150px;z-index:6"><span class="btn solid">Hablar por WhatsApp</span></p>
</section>
<svg class="overlay" width="${NS * W}" height="${H}" viewBox="0 0 ${NS * W} ${H}">
  <path d="${trailPath}" fill="none" stroke="#fccc6c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>
  ${dots.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="13" fill="#1e1914" stroke="#fccc6c" stroke-width="4.5"/>`).join('')}
</svg>
${rutas.map((r, i) => badge(r.badge, B[i].x, B[i].y)).join('')}
` });

// POST 5 · Imagen · Por qué España
posts.push({ id: 'post-05-por-que-espana', n: 1, html: `
<section class="slide ink" style="${at(0)}">
  <div class="bg shade" style="background-image:url('${foto('ruta-castellana')}');background-position:38% center"></div>
  <p class="cap label gold rel">Por qué España</p>
  <div class="bottom" style="bottom:130px">
    <p class="cap stone">Especialidad</p>
    <p class="disp gold" style="font-size:180px;margin-top:10px">España.</p>
    <div style="height:1.5px;background:rgba(240,192,84,.45);margin:44px 0 40px"></div>
    <p class="cap stone">Capacidad</p>
    <p class="disp gold" style="font-size:180px;margin-top:10px">Mundo.</p>
  </div>
</section>` });

// POST 6 · Carrusel · Así se construye el viaje (línea punteada continua)
const pasos = [
  ['Conversación inicial', 'Entendemos quién viaja, qué buscan, qué fechas tienen y cómo quieren vivir el recorrido.'],
  ['Concepto de viaje', 'Construimos una lógica de ruta: regiones, ritmo, experiencias y enfoque general.'],
  ['Propuesta', 'Aterrizamos el viaje en una propuesta con estructura, opciones y costos.'],
  ['Coordinación', 'Te acompañamos para convertir la idea en un viaje listo para vivir.'],
];
const LY = 720; // altura de la línea de ruta
posts.push({ id: 'post-06-asi-se-construye', n: 6, html: `
<section class="slide sand topo" style="${at(0)}">
  ${count(1, 6, 'copper')}
  <p class="cap label copper rel">Proceso</p>
  <h2 class="disp basec rel" style="font-size:136px;margin-top:70px">Así se<br>construye<br>el viaje</h2>
  <p class="cap copper" style="position:absolute;left:88px;bottom:120px">Desliza →</p>
</section>
${pasos.map((p, i) => `
<section class="slide sand topo" style="${at(i + 1)}">
  ${count(i + 2, 6, 'copper')}
  <p class="disp copper" style="position:absolute;left:88px;top:330px;font-size:300px;line-height:.8;z-index:3">${String(i + 1).padStart(2, '0')}</p>
  <div style="position:absolute;left:88px;right:88px;top:${LY + 80}px;z-index:3">
    <p class="cap copper">Paso ${i + 1}</p>
    <h3 class="disp basec" style="font-size:92px;margin-top:22px">${p[0]}</h3>
    <p class="body basec" style="margin-top:28px;max-width:860px">${p[1]}</p>
  </div>
</section>`).join('')}
<section class="slide ink" style="${at(5)}">
  <div class="bg shade strong" style="background-image:url('${foto('cierre')}')"></div>
  
  <div class="bottom" style="bottom:150px">
    <h2 class="disp gold" style="font-size:118px">¿Estás pensando en ir o volver a España?</h2>
    <p class="body sandc" style="margin-top:40px;max-width:860px">Cuéntanos qué tienes en mente y empecemos a diseñar una ruta a tu medida.</p>
    <p style="margin-top:56px"><span class="btn solid">Diseñar mi viaje</span></p>
  </div>
</section>
<svg class="overlay" width="${6 * W}" height="${H}" viewBox="0 0 ${6 * W} ${H}">
  <line x1="88" y1="${LY}" x2="${5 * W}" y2="${LY}" stroke="#864105" stroke-width="3" stroke-dasharray="10 12"/>
  <circle cx="88" cy="${LY}" r="12" fill="#eee6d8" stroke="#864105" stroke-width="3"/>
  ${pasos.map((_, i) => `<circle cx="${(i + 1) * W + 100}" cy="${LY}" r="22" fill="#eee6d8" stroke="#864105" stroke-width="3"/><circle cx="${(i + 1) * W + 100}" cy="${LY}" r="${i === 3 ? 22 : 11}" fill="#864105"/>`).join('')}
</svg>
` });

/* ---------------- RENDER ---------------- */
const build = join(here, '.build');
mkdirSync(build, { recursive: true });
const browser = await chromium.launch();
for (const post of posts) {
  const width = post.n * W;
  const file = join(build, `${post.id}.html`);
  writeFileSync(file, `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>${css}</style></head><body style="--w:${width}px">${post.html}</body></html>`);
  const page = await browser.newPage({ viewport: { width, height: H } });
  await page.goto(`file://${file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const out = join(here, post.id);
  mkdirSync(out, { recursive: true });
  for (let i = 0; i < post.n; i++) {
    const name = post.n === 1 ? `${post.id}.png` : `slide-${String(i + 1).padStart(2, '0')}.png`;
    await page.screenshot({ path: join(out, name), clip: { x: i * W, y: 0, width: W, height: H } });
  }
  await page.close();
  console.log('✓', post.id, post.n);
}
await browser.close();
