/**
 * Sendero dibujado (inspirado en San Rita): una línea de ruta que sale del título,
 * serpentea y pasa por los badges de cada tarjeta ([data-trail-point]), con puntos de
 * parada en el camino. Se dibuja conforme avanza el scroll por la sección [data-trail].
 * El camino se recalcula según el layout (desktop / móvil).
 */
const SVG_NS = 'http://www.w3.org/2000/svg';

type Pt = { x: number; y: number };

document.querySelectorAll<HTMLElement>('[data-trail]').forEach(setup);

function setup(section: HTMLElement) {
  const svg = section.querySelector<SVGSVGElement>('.trail');
  const path = section.querySelector<SVGPathElement>('.trail__path');
  const dotsGroup = section.querySelector<SVGGElement>('.trail__dots');
  const start = section.querySelector<HTMLElement>('[data-trail-start]');
  const points = [...section.querySelectorAll<HTMLElement>('[data-trail-point]')];
  if (!svg || !path || !dotsGroup || !start || points.length === 0) return;

  const animated = document.documentElement.classList.contains('motion');
  let length = 0;
  let stops: { el: Element; at: number }[] = [];

  // Posición sin transforms (las tarjetas se animan con translate)
  const offsetIn = (el: HTMLElement): Pt => {
    let x = 0, y = 0, node: HTMLElement | null = el;
    while (node && node !== section) {
      x += node.offsetLeft; y += node.offsetTop;
      node = node.offsetParent as HTMLElement | null;
    }
    return { x, y };
  };
  const center = (el: HTMLElement): Pt => {
    const o = offsetIn(el);
    return { x: o.x + el.offsetWidth / 2, y: o.y + el.offsetHeight / 2 };
  };

  const build = () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const mobile = w < 640;

    // El sendero va por los espacios libres: sale del título, corre por el carril que hay
    // encima de cada fila de tarjetas y, para cambiar de fila, baja por el margen derecho
    // de la tarjeta. Así no cruza títulos ni textos, en desktop (varias columnas) o móvil.
    const s = offsetIn(start);
    const badges = points.map(center);
    const first: Pt = mobile
      ? { x: w * 0.6, y: s.y + start.offsetHeight + 28 }
      : { x: Math.min(s.x + start.offsetWidth + 60, w * 0.7), y: s.y + start.offsetHeight * 0.6 };
    const pts: Pt[] = [first];
    const dotAt: Pt[] = [];
    let seed = 415;
    const wob = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 22;
    const lane = (y: number) => y - 64; // carril libre sobre la fila (los badges asoman ahí)
    const margin = (x: number) => Math.min(w - 14, x + 70); // hueco a la derecha de la tarjeta
    let prev = first;
    badges.forEach((b, i) => {
      if (i === 0) {
        const ly = lane(b.y);
        pts.push({ x: prev.x + wob(), y: (prev.y + ly) / 2 });
        const mid = { x: (prev.x + b.x) / 2, y: ly + wob() };
        pts.push(mid); dotAt.push(mid);
      } else if (Math.abs(b.y - prev.y) < 120) {
        // misma fila: por encima de las fotos
        const mid = { x: (prev.x + b.x) / 2, y: Math.min(prev.y, b.y) - 64 + wob() };
        pts.push(mid); dotAt.push(mid);
      } else {
        // fila siguiente: baja por el margen y cruza por el carril de arriba de la nueva fila
        const ex = margin(prev.x), ly = lane(b.y);
        pts.push({ x: ex, y: prev.y + 90 });
        dotAt.push({ x: ex, y: (prev.y + 90 + ly - 20) / 2 });
        pts.push({ x: ex + wob() * 0.3, y: ly - 20 });
        if (Math.abs(ex - b.x) > 120) {
          const mid = { x: (ex + b.x) / 2, y: ly + wob() };
          pts.push(mid);
        }
      }
      pts.push(b);
      prev = b;
    });
    // Llegada: baja por el margen después del último badge
    const endX = margin(prev.x);
    pts.push({ x: endX, y: prev.y + 90 });
    const end = { x: endX, y: prev.y + 220 };
    pts.push(end);
    const anchors = [first, ...badges, end];

    // Catmull-Rom → Bézier para un trazo suave
    let d = `M${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
      const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
      const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
      d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    path.setAttribute('d', d);
    length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    // Distancia a lo largo del trazo de cada parada (muestreo)
    const samples: { p: DOMPoint; l: number }[] = [];
    for (let l = 0; l <= length; l += 6) samples.push({ p: path.getPointAtLength(l), l });
    const along = (q: Pt) => samples.reduce((best, s) => {
      const dist = Math.hypot(s.p.x - q.x, s.p.y - q.y);
      return dist < best.d ? { d: dist, l: s.l } : best;
    }, { d: Infinity, l: 0 }).l / length;

    dotsGroup.replaceChildren();
    stops = [];
    // Puntos de parada en el trazo + salida y llegada
    [first, ...dotAt, anchors[anchors.length - 1]].forEach((q) => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('class', 'trail__dot');
      c.setAttribute('cx', q.x.toFixed(1));
      c.setAttribute('cy', q.y.toFixed(1));
      c.setAttribute('r', '7');
      dotsGroup.append(c);
      stops.push({ el: c, at: along(q) });
    });
    points.forEach((el) => stops.push({ el, at: along(center(el)) }));
    draw();
  };

  const draw = () => {
    if (!length) return;
    let progress = 1;
    if (animated) {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // Empieza cuando el título entra; termina cuando el final de la sección llega a 3/4 de pantalla
      progress = (vh * 0.75 - rect.top - start.offsetTop) / (rect.height - start.offsetTop);
      progress = Math.min(1, Math.max(0, progress));
    }
    path.style.strokeDashoffset = `${length * (1 - progress)}`;
    stops.forEach((s) => s.el.classList.toggle('is-reached', progress >= s.at - 0.005));
  };

  build();
  window.addEventListener('scroll', draw, { passive: true });
  let t: number | undefined;
  window.addEventListener('resize', () => { clearTimeout(t); t = window.setTimeout(build, 150); });
  window.addEventListener('load', build);
}
