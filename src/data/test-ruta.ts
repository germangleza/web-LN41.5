/**
 * Test "¿Qué ruta de autor va contigo?" (puerta RUTA del sistema de contenido).
 * Cada respuesta suma puntos a una o dos rutas (id = archivo en src/content/rutas/).
 * Gana la ruta con más puntos; en empate, gana la que aparece primero en `orden`.
 * Página: src/pages/test-ruta.astro · Documentación del recurso: clientes/ln415-travel/recursos/RUTA.md
 */
export type RutaId = 'espana-castellana' | 'espana-del-vino' | 'catalunya-insolita' | 'espana-profunda' | 'espana-atlantica';

export interface Opcion {
  texto: string;
  puntos: Partial<Record<RutaId, number>>;
}
export interface Pregunta {
  pregunta: string;
  opciones: Opcion[];
}

export const orden: RutaId[] = ['espana-castellana', 'espana-del-vino', 'catalunya-insolita', 'espana-profunda', 'espana-atlantica'];

export const preguntas: Pregunta[] = [
  {
    pregunta: '¿Qué te gustaría traerte de regreso de este viaje?',
    opciones: [
      { texto: 'Historias de castillos, catedrales y villas medievales', puntos: { 'espana-castellana': 2 } },
      { texto: 'Entender por qué cada vino sabe como sabe', puntos: { 'espana-del-vino': 2 } },
      { texto: 'Pueblos de piedra, montaña y mar en un mismo viaje', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'Producto, paisaje abierto y silencio', puntos: { 'espana-profunda': 2 } },
      { texto: 'Faros, pueblos marineros y cocina de mar', puntos: { 'espana-atlantica': 2 } },
    ],
  },
  {
    pregunta: 'Tu día perfecto termina…',
    opciones: [
      { texto: 'Cenando asado de horno de leña en una villa amurallada', puntos: { 'espana-castellana': 2 } },
      { texto: 'En una bodega al atardecer, entre viñedos', puntos: { 'espana-del-vino': 2 } },
      { texto: 'En un pueblo del Empordà mirando al Mediterráneo', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'En una casa rural en la dehesa, sin ruido', puntos: { 'espana-profunda': 2 } },
      { texto: 'Con sidra y pescado frente al Cantábrico', puntos: { 'espana-atlantica': 2 } },
    ],
  },
  {
    pregunta: '¿Qué paisaje te llama más?',
    opciones: [
      { texto: 'Meseta, murallas y cielos abiertos', puntos: { 'espana-castellana': 2 } },
      { texto: 'Viñedos hasta donde alcanza la vista', puntos: { 'espana-del-vino': 2 } },
      { texto: 'Montaña que baja hasta la costa', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'Dehesa de encinas y llanuras', puntos: { 'espana-profunda': 2 } },
      { texto: 'Costa verde, acantilados y niebla', puntos: { 'espana-atlantica': 2 } },
    ],
  },
  {
    pregunta: '¿Qué tanto te mueve el vino?',
    opciones: [
      { texto: 'Es el motivo del viaje', puntos: { 'espana-del-vino': 3 } },
      { texto: 'Me gusta acompañar bien la comida', puntos: { 'espana-castellana': 1, 'espana-del-vino': 1 } },
      { texto: 'Me interesa más el producto local', puntos: { 'espana-profunda': 1, 'espana-atlantica': 1 } },
      { texto: 'No es lo mío', puntos: { 'catalunya-insolita': 1, 'espana-atlantica': 1 } },
    ],
  },
  {
    pregunta: '¿Qué le da más sentido a un viaje para ti?',
    opciones: [
      { texto: 'La historia de cada lugar', puntos: { 'espana-castellana': 2, 'espana-profunda': 1 } },
      { texto: 'Conocer a quien hace las cosas: productores, enólogos, artesanos', puntos: { 'espana-del-vino': 2, 'espana-profunda': 1 } },
      { texto: 'El paisaje y la arquitectura', puntos: { 'catalunya-insolita': 2, 'espana-atlantica': 1 } },
      { texto: 'La comida, de principio a fin', puntos: { 'espana-atlantica': 2, 'espana-profunda': 1 } },
    ],
  },
  {
    pregunta: '¿Cómo te gusta moverte?',
    opciones: [
      { texto: 'Pocas bases y mucho tiempo en cada una', puntos: { 'espana-profunda': 1, 'espana-del-vino': 1 } },
      { texto: 'Combinar ciudad y pueblos', puntos: { 'espana-castellana': 1, 'catalunya-insolita': 1 } },
      { texto: 'En carretera, cambiando de paisaje', puntos: { 'espana-atlantica': 1, 'catalunya-insolita': 1 } },
    ],
  },
  {
    pregunta: '¿Ya conoces Barcelona?',
    opciones: [
      { texto: 'Sí, y quiero conocer otra Catalunya', puntos: { 'catalunya-insolita': 2 } },
      { texto: 'Sí, y esta vez quiero otra región', puntos: { 'espana-castellana': 1, 'espana-profunda': 1, 'espana-atlantica': 1 } },
      { texto: 'Todavía no', puntos: { 'catalunya-insolita': 1 } },
    ],
  },
  {
    pregunta: '¿Cuándo te imaginas viajando?',
    opciones: [
      { texto: 'Primavera', puntos: { 'espana-castellana': 1, 'espana-profunda': 1 } },
      { texto: 'Verano', puntos: { 'espana-atlantica': 1, 'catalunya-insolita': 1 } },
      { texto: 'Otoño', puntos: { 'espana-del-vino': 1, 'espana-castellana': 1 } },
      { texto: 'Todavía no lo sé', puntos: {} },
    ],
  },
  {
    pregunta: '¿Con quién viajas?',
    opciones: [
      { texto: 'En pareja', puntos: { 'espana-del-vino': 1, 'espana-profunda': 1 } },
      { texto: 'En familia', puntos: { 'espana-castellana': 1, 'espana-atlantica': 1 } },
      { texto: 'Con amigos', puntos: { 'espana-del-vino': 1, 'catalunya-insolita': 1 } },
      { texto: 'Varias generaciones juntas', puntos: { 'espana-castellana': 1, 'espana-atlantica': 1 } },
    ],
  },
  {
    pregunta: '¿Qué tan conocido quieres que sea el destino?',
    opciones: [
      { texto: 'Clásico, pero visto de otra forma', puntos: { 'espana-castellana': 2 } },
      { texto: 'Con nombre propio, para los que saben', puntos: { 'espana-del-vino': 2 } },
      { texto: 'Algo que me sorprenda', puntos: { 'catalunya-insolita': 1, 'espana-atlantica': 1 } },
      { texto: 'Lo menos explorado posible', puntos: { 'espana-profunda': 2 } },
    ],
  },
];

/** Por qué le va cada ruta (se muestra en el resultado). */
export const porQue: Record<RutaId, string> = {
  'espana-castellana': 'Te mueve la historia y la mesa sin prisas. Castilla junta fortalezas, villas medievales y cocina de horno de leña en un viaje con ritmo pausado.',
  'espana-del-vino': 'Para ti el vino no es una cata más: es una forma de entender el lugar. Rioja Alavesa y Ribera del Duero son dos maneras de leer el paisaje.',
  'catalunya-insolita': 'Quieres una Catalunya más allá de lo obvio: Priorat, Pirineos y Empordà, con pueblos, paisaje y gastronomía que casi nadie mete en el itinerario.',
  'espana-profunda': 'Buscas profundidad y silencio. Extremadura tiene ciudades monumentales, dehesa y productores en una de las regiones menos exploradas de España.',
  'espana-atlantica': 'Te llama el mar y la cocina de producto. Del Atlántico al Cantábrico: faros, pueblos marineros y una España verde y celta.',
};
