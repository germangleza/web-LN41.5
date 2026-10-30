/**
 * Test "¿Qué ruta de autor va contigo?" (puerta RUTA del sistema de contenido).
 * Cada respuesta suma puntos a una o dos rutas (id = archivo en src/content/rutas/).
 * Gana la ruta con más puntos; en empate, gana la que aparece primero en `orden`.
 * Página: src/pages/test-ruta.astro · Documentación del recurso: clientes/ln415-travel/recursos/RUTA.md
 */
export type RutaId = 'catalunya-insolita' | 'andalucia-blanca' | 'espana-atlantica';

export interface Opcion {
  texto: string;
  puntos: Partial<Record<RutaId, number>>;
}
export interface Pregunta {
  pregunta: string;
  opciones: Opcion[];
}

export const orden: RutaId[] = ['catalunya-insolita', 'andalucia-blanca', 'espana-atlantica'];

export const preguntas: Pregunta[] = [
  {
    pregunta: '¿Qué te gustaría traerte de regreso de este viaje?',
    opciones: [
      { texto: 'Pueblos de piedra, montaña y mar en un mismo viaje', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'Pueblos blancos, sierra y caballos', puntos: { 'andalucia-blanca': 2 } },
      { texto: 'Faros, pueblos marineros y cocina de mar', puntos: { 'espana-atlantica': 2 } },
    ],
  },
  {
    pregunta: 'Tu día perfecto termina…',
    opciones: [
      { texto: 'En un pueblo del Empordà mirando al Mediterráneo', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'En una finca en la sierra de Grazalema, sin ruido', puntos: { 'andalucia-blanca': 2 } },
      { texto: 'Con sidra y pescado frente al Cantábrico', puntos: { 'espana-atlantica': 2 } },
    ],
  },
  {
    pregunta: '¿Qué paisaje te llama más?',
    opciones: [
      { texto: 'Montaña que baja hasta la costa', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'Sierra, olivares y pueblos colgados de la roca', puntos: { 'andalucia-blanca': 2 } },
      { texto: 'Costa verde, acantilados y niebla', puntos: { 'espana-atlantica': 2 } },
    ],
  },
  {
    pregunta: '¿Qué tanto te mueve el vino?',
    opciones: [
      { texto: 'Mucho: quiero viñedos y bodegas de autor', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'Me atraen los vinos generosos y las bodegas antiguas', puntos: { 'andalucia-blanca': 2 } },
      { texto: 'Me interesa más el producto local', puntos: { 'espana-atlantica': 1, 'andalucia-blanca': 1 } },
      { texto: 'No es lo mío', puntos: { 'espana-atlantica': 1 } },
    ],
  },
  {
    pregunta: '¿Qué le da más sentido a un viaje para ti?',
    opciones: [
      { texto: 'La historia y las tradiciones de cada lugar', puntos: { 'andalucia-blanca': 2 } },
      { texto: 'Conocer a quien hace las cosas: productores, criadores, artesanos', puntos: { 'andalucia-blanca': 1, 'catalunya-insolita': 1 } },
      { texto: 'El paisaje y la arquitectura', puntos: { 'catalunya-insolita': 2, 'espana-atlantica': 1 } },
      { texto: 'La comida, de principio a fin', puntos: { 'espana-atlantica': 2 } },
    ],
  },
  {
    pregunta: '¿Cómo te gusta moverte?',
    opciones: [
      { texto: 'Pocas bases y mucho tiempo en cada una', puntos: { 'andalucia-blanca': 2 } },
      { texto: 'Combinar ciudad y pueblos', puntos: { 'catalunya-insolita': 1, 'andalucia-blanca': 1 } },
      { texto: 'En carretera, cambiando de paisaje', puntos: { 'espana-atlantica': 1, 'catalunya-insolita': 1 } },
    ],
  },
  {
    pregunta: '¿Ya conoces Barcelona?',
    opciones: [
      { texto: 'Sí, y quiero conocer otra Catalunya', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'Sí, y esta vez quiero otra región', puntos: { 'andalucia-blanca': 1, 'espana-atlantica': 1 } },
      { texto: 'Todavía no', puntos: { 'catalunya-insolita': 1 } },
    ],
  },
  {
    pregunta: '¿Cuándo te imaginas viajando?',
    opciones: [
      { texto: 'Primavera', puntos: { 'andalucia-blanca': 1, 'catalunya-insolita': 1 } },
      { texto: 'Verano', puntos: { 'espana-atlantica': 1, 'catalunya-insolita': 1 } },
      { texto: 'Otoño', puntos: { 'andalucia-blanca': 1, 'catalunya-insolita': 1 } },
      { texto: 'Todavía no lo sé', puntos: {} },
    ],
  },
  {
    pregunta: '¿Con quién viajas?',
    opciones: [
      { texto: 'En pareja', puntos: { 'andalucia-blanca': 1, 'catalunya-insolita': 1 } },
      { texto: 'En familia', puntos: { 'espana-atlantica': 1, 'andalucia-blanca': 1 } },
      { texto: 'Con amigos', puntos: { 'catalunya-insolita': 1, 'espana-atlantica': 1 } },
      { texto: 'Varias generaciones juntas', puntos: { 'andalucia-blanca': 1, 'espana-atlantica': 1 } },
    ],
  },
  {
    pregunta: '¿Qué tan conocido quieres que sea el destino?',
    opciones: [
      { texto: 'Clásico, pero visto de otra forma', puntos: { 'andalucia-blanca': 2 } },
      { texto: 'Con nombre propio, para los que saben', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'Algo que me sorprenda', puntos: { 'espana-atlantica': 2 } },
      { texto: 'Lo menos explorado posible', puntos: { 'espana-atlantica': 1, 'andalucia-blanca': 1 } },
    ],
  },
];

/** Por qué le va cada ruta (se muestra en el resultado). */
export const porQue: Record<RutaId, string> = {
  'catalunya-insolita': 'Quieres una Catalunya más allá de lo obvio: Penedès, Pirineos y Empordà, con pueblos, paisaje y gastronomía que casi nadie mete en el itinerario.',
  'andalucia-blanca': 'Buscas calma, paisaje y tradición. Sevilla, la Serranía de Ronda y la Córdoba del olivar: palacios, caballos de pura raza y pueblos blancos colgados de la roca.',
  'espana-atlantica': 'Te llama el mar y la cocina de producto. Del Atlántico al Cantábrico: faros, pueblos marineros y una España verde y celta.',
};
