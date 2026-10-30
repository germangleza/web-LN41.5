/**
 * Test "¿Qué España te falta?" (puerta ESPAÑA del sistema de contenido).
 * Devuelve la España del viajero (Mediterránea, Blanca o Atlántica → una ruta) y su perfil de viaje de autor (0–16).
 * Página: src/pages/que-espana-te-falta.astro · Pruebas: src/data/test-espana.test.ts (npm test)
 * Spec y copy: clientes/ln415-travel/recursos/ESPANA.md
 */
export type Espana = 'M' | 'B' | 'A';
export type Bloque = 'A' | 'B' | 'C';

export interface Opcion {
  texto: string;
  /** Bloques A y C: puntos de perfil (2/1/0). Bloque B: la España que suma 1 punto. */
  valor: number | Espana;
}
export interface Pregunta {
  id: string;
  bloque: Bloque;
  pregunta: string;
  opciones: Opcion[];
}

const siNo = (medio: string): Opcion[] => [
  { texto: 'Sí', valor: 2 },
  { texto: medio, valor: 1 },
  { texto: 'No', valor: 0 },
];
const afinidad = (m: string, b: string, a: string): Opcion[] => [
  { texto: m, valor: 'M' },
  { texto: b, valor: 'B' },
  { texto: a, valor: 'A' },
];

export const bloques: Record<Bloque, string> = {
  A: 'Tu historia con España',
  B: 'Qué te mueve',
  C: 'Cómo viajas',
};

export const preguntas: Pregunta[] = [
  { id: 'A1', bloque: 'A', pregunta: '¿Ya conoces España?', opciones: [
    { texto: 'Sí', valor: 2 },
    { texto: 'Una vez, poco tiempo', valor: 1 },
    { texto: 'Todavía no', valor: 0 },
  ] },
  { id: 'A2', bloque: 'A', pregunta: '¿Tu viaje anterior (a España o a Europa) fue sobre todo ciudades grandes y monumentos?', opciones: siNo('Más o menos') },
  { id: 'A3', bloque: 'A', pregunta: '¿Sentiste que te faltó conocer pueblos, regiones o la vida local?', opciones: siNo('Más o menos') },
  { id: 'A4', bloque: 'A', pregunta: '¿Alguna vez pasaste más tiempo organizando el viaje que disfrutándolo?', opciones: siNo('Más o menos') },

  { id: 'B1', bloque: 'B', pregunta: '¿Qué paisaje te llama más?', opciones: afinidad(
    'Viñedos, montaña y mar en el mismo viaje', 'Sierra, olivos y pueblos blancos', 'Acantilados verdes, faros y bosque') },
  { id: 'B2', bloque: 'B', pregunta: 'Tu mesa ideal en el viaje', opciones: afinidad(
    'Vino de la región y cocina de masía', 'Aceite de cosecha temprana y vinos generosos', 'Mariscos, conservas, sidra y quesos') },
  { id: 'B3', bloque: 'B', pregunta: 'La historia que más te atrae', opciones: afinidad(
    'Pueblos medievales de piedra y arte románico', 'Palacios y tradición ecuestre', 'Castros prerromanos y cultura celta') },
  { id: 'B4', bloque: 'B', pregunta: '¿Con qué clima viajas mejor?', opciones: afinidad(
    'Templado, entre montaña y mar', 'Sol, luz y calor seco', 'Fresco y verde, aunque llueva') },
  { id: 'B5', bloque: 'B', pregunta: 'Tu día perfecto', opciones: afinidad(
    'Volcanes en la mañana, pueblo medieval y cena sin prisa', 'Hacienda con caballos y atardecer en un pueblo blanco', 'Caminar junto al mar y comer en un puerto') },
  { id: 'B6', bloque: 'B', pregunta: 'La foto que te traerías', opciones: afinidad(
    'Un puente medieval sobre el río', 'Casas blancas colgadas de la roca', 'Un faro donde se acaba la tierra') },

  { id: 'C1', bloque: 'C', pregunta: '¿Prefieres menos lugares con más tiempo en cada uno?', opciones: siNo('Depende') },
  { id: 'C2', bloque: 'C', pregunta: '¿Valoras que alguien filtre las opciones por ti en lugar de investigar semanas?', opciones: siNo('Depende') },
  { id: 'C3', bloque: 'C', pregunta: '¿Te interesa comer donde comen los locales más que en el lugar de moda?', opciones: siNo('Depende') },
  { id: 'C4', bloque: 'C', pregunta: '¿Estás pensando viajar en los próximos doce meses?', opciones: siNo('Depende') },
];

/** Orden de desempate: Catalunya es la ruta prioritaria. */
export const desempate: Espana[] = ['M', 'B', 'A'];

export interface ResultadoEspana {
  titulo: string;
  ruta: string;
  rutaId: string;
  texto: string;
  extra: string;
  cta: string;
}

export const espanas: Record<Espana, ResultadoEspana> = {
  M: {
    titulo: 'España Mediterránea',
    ruta: 'Catalunya Insólita',
    rutaId: 'catalunya-insolita',
    texto: 'Lo tuyo es un viaje que cambia de paisaje sin cambiar de ritmo: vino en el Penedès, pueblos de piedra en el interior, volcanes en la Garrotxa, el Pirineo y un Mediterráneo lejos de lo masivo. Tu ruta es Catalunya Insólita.',
    extra: 'Estamos armando una salida en grupo reducido para mayo de 2027 (fechas tentativas). Pregúntanos por los lugares.',
    cta: 'Quiero saber de Catalunya Insólita',
  },
  B: {
    titulo: 'España Blanca',
    ruta: 'Andalucía Blanca',
    rutaId: 'andalucia-blanca',
    texto: 'Tu sur no es el de las prisas: palacios sevillanos, caballos de pura raza, pueblos blancos colgados de la roca y el olivar de montaña de la Córdoba menos conocida. Tu ruta es Andalucía Blanca.',
    extra: 'Esta ruta todavía no tiene fecha de salida. La diseñamos a tu medida, en tus fechas.',
    cta: 'Quiero diseñar mi Andalucía',
  },
  A: {
    titulo: 'España Atlántica',
    ruta: 'España Atlántica',
    rutaId: 'espana-atlantica',
    texto: 'Te llama la España verde, marinera y ancestral: faros de la Costa da Morte, aldeas de piedra, puertos de Asturias, sidra, quesos y una última mesa vasca. Tu ruta es España Atlántica.',
    extra: 'Esta ruta todavía no tiene fecha de salida. La diseñamos a tu medida, en tus fechas.',
    cta: 'Quiero diseñar mi España Atlántica',
  },
};

export interface Rango {
  min: number;
  titulo: string;
  texto: string;
}

/** De mayor a menor: gana el primero cuyo `min` alcanza el perfil. */
export const rangos: Rango[] = [
  { min: 12, titulo: 'Viajero de autor', texto: 'Ya sabes lo que no quieres repetir. Tu siguiente viaje no necesita más lugares: necesita mejores decisiones.' },
  { min: 7, titulo: 'Listo para salir del circuito', texto: 'Ya tienes la curiosidad. Lo que falta es saber qué vale la pena y qué dejar fuera para que el viaje se sienta tuyo.' },
  { min: 0, titulo: 'Tu primera España', texto: 'Si es tu primer viaje, lo clásico tiene sentido. Lo importante es armarlo con ritmo, no como lista de pendientes.' },
];

export const lineaDebil: Record<'A' | 'C', string> = {
  A: 'Tu fuerte está en cómo viajas. Si todavía no conoces mucho de España, empezamos por lo esencial y sumamos una región que casi nadie incluye.',
  C: 'Ya conoces España, pero tu forma de viajar todavía es de checklist. Ahí es donde un viaje de autor hace la diferencia.',
};

export const rangoDe = (perfil: number): Rango => rangos.find((r) => perfil >= r.min) ?? rangos[rangos.length - 1];

/** Gana la de más puntos; en empate, la que va primero en `desempate`. */
export function ordenarEspanas(afinidad: Record<Espana, number>): Espana[] {
  return [...desempate].sort((a, b) => afinidad[b] - afinidad[a] || desempate.indexOf(a) - desempate.indexOf(b));
}

export interface Calculo {
  perfil: number;
  bloqueA: number;
  bloqueC: number;
  afinidad: Record<Espana, number>;
  espana: Espana;
  secundaria: Espana | null;
  bloqueDebil: 'A' | 'C' | null;
  codigo: string;
}

/** `respuestas`: id de pregunta → valor de la opción elegida. */
export function calcular(respuestas: Record<string, number | Espana>): Calculo {
  let bloqueA = 0;
  let bloqueC = 0;
  const afinidad: Record<Espana, number> = { M: 0, B: 0, A: 0 };
  for (const p of preguntas) {
    const v = respuestas[p.id];
    if (v === undefined) continue;
    if (p.bloque === 'B') afinidad[v as Espana] += 1;
    else if (p.bloque === 'A') bloqueA += v as number;
    else bloqueC += v as number;
  }
  const perfil = bloqueA + bloqueC;
  const [espana, segunda] = ordenarEspanas(afinidad);
  return {
    perfil,
    bloqueA,
    bloqueC,
    afinidad,
    espana,
    secundaria: afinidad[segunda] > 0 ? segunda : null,
    bloqueDebil: bloqueA < bloqueC ? 'A' : bloqueC < bloqueA ? 'C' : null,
    codigo: `LN-${espana}-${perfil}`,
  };
}

/** Código para WhatsApp: `[LN-M-13]`, o `[LN-M-13 · reel-04]` si llegó con utm_content. */
export const codigoConUtm = (codigo: string, utmContent?: string | null) =>
  `[${utmContent ? `${codigo} · ${utmContent}` : codigo}]`;

export function mensajeWhatsapp(c: Pick<Calculo, 'espana' | 'codigo'>, utmContent?: string | null): string {
  const e = espanas[c.espana];
  return `Hola, hice el test ¿Qué España te falta? Me salió ${e.titulo} (${e.ruta}). Quiero platicar mi viaje. ${codigoConUtm(c.codigo, utmContent)}`;
}
