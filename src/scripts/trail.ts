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
  let stops: { el: Element; at: number }[] = []; // at = distancia a lo largo del trazo

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

  const end = section.querySelector<HTMLElement>('[data-trail-end]');

  // Muestras del trazo (posición y distancia recorrida) para ubicar paradas y avanzar con el scroll
  let samples: { x: number; y: number; l: number }[] = [];
  let drawn = 0;
  let target = 0;
  let raf = 0;

  const build = () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    const mobile = w < 640;

    // El sendero corre por los espacios libres: sale del título, va por el carril que queda
    // encima de cada fila y, al cambiar de fila, baja por el costado de la última tarjeta.
    // Las filas están en zigzag (ver CSS), así que nunca tiene que regresar sobre sí mismo.
    const s = offsetIn(start);
    const first: Pt = mobile
      ? { x: w * 0.6, y: s.y + start.offsetHeight + 28 }
      : { x: s.x + 24, y: s.y + start.offsetHeight + 30 };
    const pts: Pt[] = [first];
    const dotAt: Pt[] = [first];
    let seed = 415;
    const wob = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280 - 0.5) * 22;
    const clampX = (x: number) => Math.min(w - 12, Math.max(12, x));

    type Target = { p: Pt; card: { l: number; r: number; t: number; b: number } | null };
    const targets: Target[] = points.map((el) => {
      const card = el.closest<HTMLElement>('.route-card') ?? el;
      const o = offsetIn(card);
      return { p: center(el), card: { l: o.x, r: o.x + card.offsetWidth, t: o.y, b: o.y + card.offsetHeight } };
    });
    if (end) targets.push({ p: center(end), card: null });

    let prev: Target = { p: first, card: null };
    targets.forEach((t, i) => {
      const b = t.p, a = prev.p;
      const lane = b.y - 60; // carril sobre la fila (los badges asoman ahí)
      if (i === 0) {
        // Sale de debajo del título y corre a la derecha hasta la primera parada
        const mid = { x: (a.x + b.x) / 2, y: (a.y + lane) / 2 + 12 };
        pts.push(mid);
      } else if (prev.card && b.y > prev.card.b) {
        // Cambio de fila: baja por el costado exterior de la tarjeta anterior
        const right = a.x > w / 2;
        const ex = clampX(right ? prev.card.r + 34 : prev.card.l - 34);
        if (!right) pts.push({ x: (a.x + ex) / 2, y: a.y - 46 + wob() * 0.4 });
        pts.push({ x: ex, y: a.y + (right ? 80 : 30) });
        const down = { x: ex + wob() * 0.3, y: (a.y + lane) / 2 };
        pts.push(down); dotAt.push(down);
        pts.push({ x: ex, y: lane - 30 });
        if (Math.abs(ex - b.x) > 140) pts.push({ x: (ex + b.x) / 2, y: lane + wob() * 0.5 });
      } else {
        // Misma fila: por encima de las fotos, hacia la siguiente parada
        const top = Math.min(a.y, b.y) - 60;
        const mid = { x: (a.x + b.x) / 2, y: top + wob() };
        pts.push(mid); dotAt.push(mid);
        if (!t.card && b.y - top > 140) pts.push({ x: b.x + wob() * 0.3, y: top + 30 }, { x: b.x, y: b.y - 70 });
      }
      pts.push(b);
      prev = t;
    });
    if (!end) {
      const ex = clampX(prev.card ? prev.card.r + 34 : prev.p.x);
      pts.push({ x: ex, y: prev.p.y + 90 }, { x: ex, y: prev.p.y + 220 });
      dotAt.push(pts[pts.length - 1]);
    }

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

    samples = [];
    for (let l = 0; l <= length; l += 6) {
      const p = path.getPointAtLength(l);
      samples.push({ x: p.x, y: p.y, l });
    }
    const along = (q: Pt) => samples.reduce((best, s) => {
      const dist = Math.hypot(s.x - q.x, s.y - q.y);
      return dist < best.d ? { d: dist, l: s.l } : best;
    }, { d: Infinity, l: 0 }).l;

    dotsGroup.replaceChildren();
    stops = [];
    dotAt.forEach((q) => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('class', 'trail__dot');
      c.setAttribute('cx', q.x.toFixed(1));
      c.setAttribute('cy', q.y.toFixed(1));
      c.setAttribute('r', '7');
      dotsGroup.append(c);
      stops.push({ el: c, at: along(q) });
    });
    points.forEach((el) => stops.push({ el, at: along(center(el)) }));
    if (end) stops.push({ el: end, at: length });
    drawn = Math.min(drawn, length);
    update();
  };

  // El trazo avanza hasta el primer punto del camino que aún está por debajo de la "línea de
  // lectura" (70% de la pantalla). Entre filas el camino corre de lado a lado: se anima con
  // suavizado para que se vea recorrer el carril en vez de aparecer de golpe.
  const update = () => {
    if (!length) return;
    if (!animated) { target = length; } else {
      const line = window.innerHeight * 0.7 - section.getBoundingClientRect().top;
      const next = samples.find((s) => s.y > line);
      target = next ? next.l : length;
    }
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const tick = () => {
    raf = 0;
    drawn = Math.abs(target - drawn) < 1 ? target : drawn + (target - drawn) * 0.09;
    path.style.strokeDashoffset = `${length - drawn}`;
    stops.forEach((s) => s.el.classList.toggle('is-reached', drawn >= s.at - 4));
    if (drawn !== target) raf = requestAnimationFrame(tick);
  };

  build();
  window.addEventListener('scroll', update, { passive: true });
  let t: number | undefined;
  window.addEventListener('resize', () => { clearTimeout(t); t = window.setTimeout(build, 150); });
  window.addEventListener('load', build);
}
