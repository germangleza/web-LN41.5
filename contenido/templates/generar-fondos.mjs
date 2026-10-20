/**
 * Fondos limpios (sin texto) para usar de template: café oscuro y café claro con la
 * textura topográfica de la web, en formato post 4:5, cuadrado e historia.
 *
 * Uso:  PWPATH=$(npm root -g)/playwright node contenido/templates/generar-fondos.mjs
 */
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PWPATH || 'playwright');
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const topo = `data:image/svg+xml;base64,${readFileSync(join(root, 'public/img/topo.svg')).toString('base64')}`;

// Mismos valores que .base.topo y .sand.topo de contenido/generar.mjs
const fondos = {
  'cafe-oscuro': { bg: '#2f271f', line: '#f0c054', opacity: 0.16 },
  'cafe-claro': { bg: '#eee6d8', line: '#864105', opacity: 0.2 },
};
const formatos = { post: [1080, 1350], cuadrado: [1080, 1080], historia: [1080, 1920] };

const browser = await chromium.launch();
for (const [fname, [w, h]] of Object.entries(formatos)) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const [name, c] of Object.entries(fondos)) {
    await page.setContent(`<style>*{margin:0}body{width:${w}px;height:${h}px;position:relative;background:${c.bg}}
      body::before{content:'';position:absolute;inset:0;background:${c.line};opacity:${c.opacity};-webkit-mask:url('${topo}') center/cover no-repeat}</style>`);
    await page.waitForTimeout(150);
    await page.screenshot({ path: join(here, `${name}-${fname}-${w}x${h}.png`) });
    console.log('✓', name, fname);
  }
  await page.close();
}
await browser.close();
