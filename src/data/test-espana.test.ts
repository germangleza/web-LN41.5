/** Pruebas del cálculo del test "¿Qué España te falta?". Correr con `npm test`. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcular, mensajeWhatsapp, preguntas, rangoDe, type Espana } from './test-espana.ts';

/** Respuestas con bloque A y C fijos y la afinidad indicada (6 respuestas del bloque B). */
function respuestas(afinidad: Espana[], a = [2, 2, 2, 2], c = [2, 2, 2, 2]) {
  const r: Record<string, number | Espana> = {};
  a.forEach((v, i) => (r[`A${i + 1}`] = v));
  c.forEach((v, i) => (r[`C${i + 1}`] = v));
  afinidad.forEach((e, i) => (r[`B${i + 1}`] = e));
  return r;
}

test('14 preguntas: 4 del bloque A, 6 del B y 4 del C', () => {
  assert.equal(preguntas.length, 14);
  assert.deepEqual(['A', 'B', 'C'].map((b) => preguntas.filter((p) => p.bloque === b).length), [4, 6, 4]);
});

test('empate M/B → gana Mediterránea', () => {
  const c = calcular(respuestas(['M', 'M', 'M', 'B', 'B', 'B']));
  assert.equal(c.espana, 'M');
  assert.equal(c.secundaria, 'B');
});

test('empate B/A → gana Blanca', () => {
  const c = calcular(respuestas(['B', 'A', 'B', 'A', 'B', 'A']));
  assert.equal(c.espana, 'B');
  assert.equal(c.secundaria, 'A');
});

test('empate triple → M, con B de secundaria', () => {
  const c = calcular(respuestas(['A', 'B', 'M', 'A', 'B', 'M']));
  assert.equal(c.espana, 'M');
  assert.equal(c.secundaria, 'B');
});

test('sin segunda España si todas las respuestas van a una', () => {
  const c = calcular(respuestas(['A', 'A', 'A', 'A', 'A', 'A']));
  assert.equal(c.espana, 'A');
  assert.equal(c.secundaria, null);
});

test('perfil cae en el rango correcto', () => {
  const casos: [number, string][] = [
    [0, 'Tu primera España'], [6, 'Tu primera España'],
    [7, 'Listo para salir del circuito'], [11, 'Listo para salir del circuito'],
    [12, 'Viajero de autor'], [16, 'Viajero de autor'],
  ];
  for (const [perfil, titulo] of casos) assert.equal(rangoDe(perfil).titulo, titulo, `perfil ${perfil}`);
});

test('perfil, bloques y bloque más débil', () => {
  const c = calcular(respuestas(['M', 'M', 'M', 'M', 'M', 'M'], [1, 0, 1, 0], [2, 2, 1, 2]));
  assert.deepEqual([c.perfil, c.bloqueA, c.bloqueC, c.bloqueDebil], [9, 2, 7, 'A']);
  assert.equal(calcular(respuestas(['M'], [2, 2, 2, 1], [1, 0, 0, 0])).bloqueDebil, 'C');
  assert.equal(calcular(respuestas(['M'], [1, 1, 1, 1], [1, 1, 1, 1])).bloqueDebil, null);
});

test('código y mensaje de WhatsApp', () => {
  const c = calcular(respuestas(['M', 'M', 'M', 'M', 'B', 'A'], [2, 2, 2, 1], [2, 2, 1, 1]));
  assert.equal(c.codigo, 'LN-M-13');
  assert.equal(
    mensajeWhatsapp(c),
    'Hola, hice el test ¿Qué España te falta? Me salió España Mediterránea (Catalunya Insólita). Quiero platicar mi viaje. [LN-M-13]',
  );
  assert.ok(mensajeWhatsapp(c, 'reel-04').endsWith('[LN-M-13 · reel-04]'));
});
