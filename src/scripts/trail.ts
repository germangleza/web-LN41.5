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

    // Salida: debajo del título (móvil) o a su derecha (desktop)
    const s = offsetIn(start);
    const first: Pt = mobile
      ? { x: w * 0.55, y: s.y + start.offsetHeight + 24 }
      : { x: Math.min(s.x + start.offsetWidth + 60, w * 0.7), y: s.y + start.offsetHeight * 0.55 };
    const anchors = [first, ...points.map(center)];
    // Llegada: baja un poco después del último badge
    const last = anchors[anchors.length - 1];
    anchors.push({ x: mobile ? w * 0.3 : Math.min(last.x + 80, w - 24), y: last.y + (mobile ? 160 : 220) });

    // Puntos intermedios con desvíos laterales para que parezca un sendero
    const pts: Pt[] = [];
    const dotAt: Pt[] = [];
    let seed = 415;
    const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    anchors.forEach((a, i) => {
      pts.push(a);
      const b = anchors[i + 1];
      if (!b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy);
      const nx = -dy / len, ny = dx / len;
      const steps = mobile ? 4 : 5;
      for (let k = 1; k < steps; k++) {
        const t = k / steps;
        const swing = Math.sin(t * Math.PI) * len * (mobile ? 0.14 : 0.3 + rand() * 0.1) * (i % 2 ? 1 : -1);
        const wobble = (rand() - 0.5) * 26;
        const p = {
          x: Math.min(w - 20, Math.max(20, a.x + dx * t + nx * (swing + wobble))),
          y: a.y + dy * t + ny * (swing + wobble),
        };
        pts.push(p);
        if (k === Math.floor(steps / 2)) dotAt.push(p);
      }
    });

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
