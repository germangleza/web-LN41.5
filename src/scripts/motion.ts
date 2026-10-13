/**
 * Motion del sitio (inspirado en la referencia San Rita):
 * - Scroll suave (Lenis)
 * - [data-split]: titulares que entran palabra por palabra desde una máscara
 * - [data-reveal]: elementos que suben y aparecen al entrar en pantalla
 * - [data-stagger]: los hijos directos aparecen en secuencia
 * - [data-toss]: fotos que "caen" a su ángulo final, como polaroids lanzadas
 * - [data-parallax="0.2"]: desplazamiento vertical según el scroll
 * - [data-spin]: gira suavemente con el scroll (brújula)
 *
 * Todo es mejora progresiva: sin JS o con "reducir movimiento" el contenido se ve completo.
 */
import Lenis from 'lenis';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced) {
  root.classList.remove('motion');
} else {
  init();
}

function init() {
  // Scroll suave
  const lenis = new Lenis({ duration: 1.15, anchors: { offset: 0 } });
  const raf = (t: number) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);

  // Titulares: envolver cada palabra en una máscara
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    let i = 0;
    const walk = (node: Node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const parts = (child.textContent ?? '').split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const mask = document.createElement('span');
            mask.className = 'split-mask';
            const word = document.createElement('span');
            word.className = 'split-word';
            word.style.setProperty('--i', String(i++));
            word.textContent = part;
            mask.append(word);
            frag.append(mask);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
          walk(child);
        }
      });
    };
    walk(el);
  });

  // Secuencias: índice para el retraso escalonado
  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((el) => {
    [...el.children].forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)));
  });

  // Aparición al entrar en pantalla
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
  document.querySelectorAll('[data-split], [data-reveal], [data-stagger], [data-toss]').forEach((el) => io.observe(el));

  // Parallax y giro ligados al scroll
  const parallax = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const spinners = [...document.querySelectorAll<HTMLElement>('[data-spin]')];
  const update = () => {
    const vh = window.innerHeight;
    parallax.forEach((el) => {
      const rect = el.parentElement!.getBoundingClientRect();
      if (rect.bottom < -vh || rect.top > vh * 2) return;
      const speed = parseFloat(el.dataset.parallax || '0.15');
      const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
    spinners.forEach((el) => { el.style.transform = `rotate(${(window.scrollY * 0.12).toFixed(1)}deg)`; });
  };
  lenis.on('scroll', update);
  window.addEventListener('resize', update);
  update();

  // Entrada del hero al cargar
  requestAnimationFrame(() => root.classList.add('is-loaded'));
}
