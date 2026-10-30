# Spec · Test «¿Qué España te falta?» — LN41.5 Travel

**Estado:** ✅ publicado en `https://www.ln415.com/que-espana-te-falta` · Código: `src/pages/que-espana-te-falta.astro` y `src/data/test-espana.ts` (pruebas: `npm test`). Sustituye al test RUTA (`/test-ruta` y `/ruta` redirigen aquí).

> Documento para Claude Code. Construir el test como una página nueva dentro del sitio actual de LN41.5 (ln415.com, construido en Astro por Maguey Studio). Todo el copy de este documento es final salvo lo marcado como **[por confirmar]**.

---

## 1. Contexto en 30 segundos

- **Marca:** LN41.5 Travel — viajes de autor a España, «España desde dentro». Cliente ideal: pareja o familia mexicana de 38–58 años que ya viajó (muchas veces ya fue a España) y quiere volver a conocer regiones, gastronomía e historia fuera del circuito típico.
- **Para qué sirve el test:** es la puerta **ESPAÑA** del sistema de contenido. La gente comenta o manda «ESPAÑA» en Instagram, recibe el link por DM, hace el test en ~2 minutos y el resultado la invita a hablar por WhatsApp con Miguel (fundador).
- **Qué devuelve:**
  1. **Su España:** Mediterránea (→ ruta *Catalunya Insólita*), Blanca (→ *Andalucía Blanca*) o Atlántica (→ *España Atlántica*).
  2. **Su perfil de viaje de autor:** puntaje de 0 a 16 con interpretación por rango y bloque más débil.
- **Prioridad comercial:** Catalunya Insólita es la ruta que se empuja (salida grupal, fechas tentativas mayo 2027). Si hay empate, gana Mediterránea.
- **El resultado se entrega sin pedir datos.** La captura de contacto es opcional y va después, con consentimiento separado.

---

## 2. Ruta, stack y alcance

| Tema | Decisión |
|---|---|
| URL | `/que-espana-te-falta` (alias opcional `/test` con redirect 301) |
| Stack | Página Astro dentro del repo actual + un island/componente cliente (el que ya use el proyecto; si no hay framework de islands, vanilla JS/TS en un `<script>` del componente). Sin backend nuevo obligatorio. |
| Estado | En memoria (JS). Guardar progreso en `sessionStorage` con try/catch para no perderlo al recargar; la página debe funcionar si storage falla. |
| Idioma | Español de México |
| Dispositivo | Mobile-first (la mayoría llega desde Instagram). Ancho útil 360–430 px, sin scroll horizontal. Desktop centrado, máx. ~640 px. |
| Duración objetivo | ~2 minutos, 14 preguntas, una por pantalla |
| Navegación | Barra de progreso, botón «Atrás», selección = avance automático (con 250 ms de feedback visual). |
| SEO | `noindex` no es necesario; sí title/meta/OG propios (ver §9). No enlazar desde el menú principal todavía; sí desde el footer y desde un banner opcional en `/#rutas` **[por confirmar]**. |

### Sistema visual
- Reutilizar tokens, tipografías, botones y estilos del sitio (`theme-color` actual: `#1e1914`). No inventar paleta nueva: extraer variables CSS/clases existentes.
- Imágenes: reutilizar las del sitio — `ruta-catalunya` (Besalú), `ruta-atlantica` (faro de Cabo Vilán), `cierre`, `hero`.
- **Ojo:** la tarjeta de Andalucía Blanca en la home hoy muestra el placeholder «Foto · ruta-andalucia.jpg». Para el resultado Blanca usar un fondo de color sólido de la paleta hasta que exista la foto **[por confirmar: foto de Andalucía]**.

---

## 3. Flujo de pantallas

1. **Intro**
2. **Bloque A · Tu historia con España** (4 preguntas)
3. **Bloque B · Qué te mueve** (6 preguntas)
4. **Bloque C · Cómo viajas** (4 preguntas)
5. **Cargando resultado** (800–1200 ms, solo animación ligera)
6. **Resultado** (España + perfil + CTA WhatsApp)
7. **Captura opcional** (debajo del resultado, no bloquea)

### 3.1 Intro (copy final)

- **Eyebrow:** Test · 2 minutos
- **Título:** ¿Qué España te falta?
- **Texto:** Catorce preguntas para saber qué España va contigo —Mediterránea, Blanca o Atlántica— y qué tan listo estás para un viaje de autor.
- **Subtexto pequeño:** Sin registro. Ves tu resultado al terminar.
- **Botón:** Empezar

---

## 4. Preguntas y puntaje

### Bloque A · Tu historia con España (puntaje de perfil)

Opciones fijas por pregunta: **Sí = 2 · Más o menos = 1 · No = 0**

| ID | Pregunta |
|---|---|
| A1 | ¿Ya conoces España? |
| A2 | ¿Tu viaje anterior (a España o a Europa) fue sobre todo ciudades grandes y monumentos? |
| A3 | ¿Sentiste que te faltó conocer pueblos, regiones o la vida local? |
| A4 | ¿Alguna vez pasaste más tiempo organizando el viaje que disfrutándolo? |

> Para A1, mostrar las etiquetas «Sí», «Una vez, poco tiempo», «Todavía no» (valen 2 / 1 / 0).

### Bloque B · Qué te mueve (afinidad de ruta)

Cada opción suma **1 punto** a una España: **M** = Mediterránea · **B** = Blanca · **A** = Atlántica. Mostrar opciones en orden aleatorio por pregunta (guardar el orden en estado para que «Atrás» lo respete).

| ID | Pregunta | Opción M | Opción B | Opción A |
|---|---|---|---|---|
| B1 | ¿Qué paisaje te llama más? | Viñedos, montaña y mar en el mismo viaje | Sierra, olivos y pueblos blancos | Acantilados verdes, faros y bosque |
| B2 | Tu mesa ideal en el viaje | Vino de la región y cocina de masía | Aceite de cosecha temprana y vinos generosos | Mariscos, conservas, sidra y quesos |
| B3 | La historia que más te atrae | Pueblos medievales de piedra y arte románico | Palacios y tradición ecuestre | Castros prerromanos y cultura celta |
| B4 | ¿Con qué clima viajas mejor? | Templado, entre montaña y mar | Sol, luz y calor seco | Fresco y verde, aunque llueva |
| B5 | Tu día perfecto | Volcanes en la mañana, pueblo medieval y cena sin prisa | Hacienda con caballos y atardecer en un pueblo blanco | Caminar junto al mar y comer en un puerto |
| B6 | La foto que te traerías | Un puente medieval sobre el río | Casas blancas colgadas de la roca | Un faro donde se acaba la tierra |

### Bloque C · Cómo viajas (puntaje de perfil)

Opciones fijas: **Sí = 2 · Depende = 1 · No = 0**

| ID | Pregunta |
|---|---|
| C1 | ¿Prefieres menos lugares con más tiempo en cada uno? |
| C2 | ¿Valoras que alguien filtre las opciones por ti en lugar de investigar semanas? |
| C3 | ¿Te interesa comer donde comen los locales más que en el lugar de moda? |
| C4 | ¿Estás pensando viajar en los próximos doce meses? |

### 4.1 Cálculo

```
perfil = suma(A1..A4) + suma(C1..C4)          // 0–16
bloqueA = suma(A1..A4)                          // 0–8
bloqueC = suma(C1..C4)                          // 0–8
afinidad = { M: n, B: n, A: n }                 // n = 0–6, suma 6

espana = max(afinidad)
desempate: M > B > A                            // Catalunya es la ruta prioritaria
secundaria = segundo mayor (si > 0), mismo desempate

bloqueDebil = bloqueA < bloqueC ? "A" : bloqueC < bloqueA ? "C" : null
```

Código de resultado para atribución (va en el mensaje de WhatsApp y en analytics):
`LN-{M|B|A}-{perfil}` → ej. `LN-M-13`

---

## 5. Pantalla de resultado (copy final)

Estructura, de arriba abajo:

1. **Imagen de la España** (a sangre en móvil, con degradado inferior)
2. **Eyebrow:** Tu España es…
3. **Título** (según España)
4. **Texto** (según España)
5. **Línea secundaria** (si hay España secundaria): «Tu segunda España: {nombre}.»
6. **Tarjeta de perfil:** puntaje «{perfil}/16» + título y texto del rango + línea del bloque más débil
7. **Firma:** *Esto es España desde dentro.*
8. **CTA principal (WhatsApp)** + texto de apoyo
9. **CTA secundario:** «Ver la ruta» → página de la ruta con UTM
10. **Compartir:** «Mándaselo a con quien viajas» (Web Share API; fallback copiar link)
11. **Captura opcional** (§6)
12. **Volver a hacer el test** (link pequeño)

### 5.1 Copy por España

**M · España Mediterránea → Catalunya Insólita**
- **Título:** España Mediterránea
- **Texto:** Lo tuyo es un viaje que cambia de paisaje sin cambiar de ritmo: vino en el Penedès, pueblos de piedra en el interior, volcanes en la Garrotxa, el Pirineo y un Mediterráneo lejos de lo masivo. Tu ruta es Catalunya Insólita.
- **Bloque extra (solo M):** Estamos armando una salida en grupo reducido para mayo de 2027 (fechas tentativas). Pregúntanos por los lugares.
- **CTA WhatsApp:** Quiero saber de Catalunya Insólita
- **Ver la ruta:** `/rutas/catalunya-insolita`

**B · España Blanca → Andalucía Blanca**
- **Título:** España Blanca
- **Texto:** Tu sur no es el de las prisas: palacios sevillanos, caballos de pura raza, pueblos blancos colgados de la roca y el olivar de montaña de la Córdoba menos conocida. Tu ruta es Andalucía Blanca.
- **Bloque extra (solo B):** Esta ruta todavía no tiene fecha de salida. La diseñamos a tu medida, en tus fechas.
- **CTA WhatsApp:** Quiero diseñar mi Andalucía
- **Ver la ruta:** `/rutas/andalucia-blanca`

**A · España Atlántica → España Atlántica**
- **Título:** España Atlántica
- **Texto:** Te llama la España verde, marinera y ancestral: faros de la Costa da Morte, aldeas de piedra, puertos de Asturias, sidra, quesos y una última mesa vasca. Tu ruta es España Atlántica.
- **Bloque extra (solo A):** Esta ruta todavía no tiene fecha de salida. La diseñamos a tu medida, en tus fechas.
- **CTA WhatsApp:** Quiero diseñar mi España Atlántica
- **Ver la ruta:** `/rutas/espana-atlantica`

### 5.2 Copy por rango de perfil

| Rango | Título | Texto |
|---|---|---|
| 12–16 | Viajero de autor | Ya sabes lo que no quieres repetir. Tu siguiente viaje no necesita más lugares: necesita mejores decisiones. |
| 7–11 | Listo para salir del circuito | Ya tienes la curiosidad. Lo que falta es saber qué vale la pena y qué dejar fuera para que el viaje se sienta tuyo. |
| 0–6 | Tu primera España | Si es tu primer viaje, lo clásico tiene sentido. Lo importante es armarlo con ritmo, no como lista de pendientes. |

### 5.3 Línea de bloque más débil

- **Si bloqueDebil = A:** Tu fuerte está en cómo viajas. Si todavía no conoces mucho de España, empezamos por lo esencial y sumamos una región que casi nadie incluye.
- **Si bloqueDebil = C:** Ya conoces España, pero tu forma de viajar todavía es de checklist. Ahí es donde un viaje de autor hace la diferencia.
- **Si null:** no mostrar línea.

### 5.4 Texto de apoyo del CTA WhatsApp

> Cuéntanos tu resultado y qué viaje tienes en mente. Te responde Miguel, no un bot.

**[por confirmar con Miguel que él responde directamente.]** Si no, cambiar a «Te respondemos en horario de oficina».

---

## 6. Captura opcional (no bloquea el resultado)

- **Título:** ¿Te mandamos tu resultado?
- **Campos:** Nombre (opcional) · WhatsApp **o** correo (uno requerido para enviar)
- **Checkbox 1 (requerido para enviar):** Acepto el [aviso de privacidad] para recibir mi resultado. — link **[por confirmar: URL del aviso de privacidad; si no existe, crear `/aviso-de-privacidad` con texto por confirmar con el cliente]**
- **Checkbox 2 (opcional, desmarcado):** Quiero recibir ideas de viaje y salidas de LN41.5.
- **Botón:** Enviarme mi resultado
- **Destino de datos:** **[por confirmar]** — opción recomendada sin backend: endpoint de Formspree / Google Apps Script (Sheet) configurable por variable de entorno `PUBLIC_TEST_LEAD_ENDPOINT`. Si la variable no existe, ocultar la sección de captura.
- **Payload:** `{ nombre, contacto, tipo_contacto, espana, secundaria, perfil, bloqueA, bloqueC, codigo, respuestas, utm_source, utm_medium, utm_campaign, utm_content, consentimiento_resultado, consentimiento_marketing, timestamp }`
- Mensaje de éxito: «Listo. Te llega en unos minutos.» (el envío real del resultado queda fuera del alcance de esta fase; registrar el lead basta) **[por confirmar si se automatiza el envío]**.

---

## 7. WhatsApp y atribución

- Número: `526633135555` (el mismo de la web).
- Link: `https://wa.me/526633135555?text=<urlencoded>`
- Mensaje prellenado:

```
Hola, hice el test ¿Qué España te falta? Me salió {Título España} ({Ruta}). Quiero platicar mi viaje. [{codigo}]
```

  Ejemplo: `Hola, hice el test ¿Qué España te falta? Me salió España Mediterránea (Catalunya Insólita). Quiero platicar mi viaje. [LN-M-13]`

- **UTM entrantes:** leer `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` de la URL al cargar, guardarlos en estado y adjuntarlos a eventos y al payload de captura. Si existe `utm_content`, agregarlo al código: `[LN-M-13 · reel-04]`.
- **Links salientes a rutas:** agregar `?utm_source=test&utm_medium=resultado&utm_campaign=espana&utm_content={M|B|A}`.

Link que se manda por DM desde Instagram (referencia para el equipo, no para el código):
`https://www.ln415.com/que-espana-te-falta?utm_source=instagram&utm_medium=dm&utm_campaign=espana&utm_content=<pieza>`

---

## 8. Analytics

Usar lo que el sitio ya tenga (GA4, Meta Pixel, Vercel Analytics). Si no hay nada, dejar un helper `track(event, params)` que haga no-op y documentar dónde conectarlo.

| Evento | Cuándo | Params |
|---|---|---|
| `test_start` | Clic en «Empezar» | utm_* |
| `test_answer` | Cada respuesta | question_id, value |
| `test_complete` | Se muestra el resultado | espana, secundaria, perfil, codigo, utm_* |
| `test_whatsapp_click` | Clic en CTA WhatsApp | espana, perfil, codigo |
| `test_route_click` | Clic en «Ver la ruta» | espana |
| `test_share` | Compartir | método |
| `test_lead_submit` | Envío de captura | espana, consentimiento_marketing |

Meta Pixel (si existe): `Lead` en `test_whatsapp_click` y en `test_lead_submit`.

---

## 9. SEO / OG

- **Title:** ¿Qué España te falta? · Test · LN41.5 Travel
- **Meta description:** Catorce preguntas para descubrir si tu España es Mediterránea, Blanca o Atlántica, y qué tan listo estás para un viaje de autor.
- **OG image:** reutilizar `og-default.png` o generar una con el título del test **[por confirmar]**.

---

## 10. Accesibilidad

- Opciones como `<button>` o radios reales, navegables con teclado, foco visible.
- Contraste AA con los tokens del sitio.
- `aria-live="polite"` para el cambio de pregunta y el resultado.
- Respetar `prefers-reduced-motion`.
- Alt text en imágenes de resultado (usar los alt existentes del sitio).

---

## 11. Criterios de aceptación

- [ ] `/que-espana-te-falta` carga en móvil sin scroll horizontal y con el estilo del sitio.
- [ ] 14 preguntas, una por pantalla, con progreso y «Atrás» que conserva respuestas.
- [ ] Puntaje y desempate exactamente como §4.1 (incluir tests unitarios de la función de cálculo: empate M/B → M; empate B/A → B; perfil 0, 6, 7, 11, 12, 16 caen en el rango correcto).
- [ ] Resultado se muestra sin pedir datos.
- [ ] Link de WhatsApp abre con el mensaje prellenado y el código correcto.
- [ ] UTM entrantes viajan a eventos, código y payload.
- [ ] Captura oculta si no hay `PUBLIC_TEST_LEAD_ENDPOINT`; consentimientos separados.
- [ ] Funciona con `sessionStorage` bloqueado.
- [ ] Lighthouse móvil ≥ 90 en Performance y Accessibility.

---

## 12. Fuera de alcance (fase 1)

- Envío automático del resultado por correo/WhatsApp.
- Integración con ManyChat (los DMs se manejan aparte; copy en §13).
- Versión en inglés.

---

## 13. Referencia para el equipo: DMs de la puerta ESPAÑA

(No es código; es para configurar la respuesta en Instagram.)

**DM 1 — al recibir «ESPAÑA»**
> ¡Va! Aquí está el test: ¿Qué España te falta? Son dos minutos. → [link con UTM]
> Mientras: ¿ya conoces España o sería tu primera vez?

**DM 2 — 24 h sin respuesta**
> ¿Qué España te salió? Me da curiosidad.

**DM 3 — si responde**
> Valida su resultado en una línea (ej. «Mediterránea tiene todo el sentido si te gusta el vino y los pueblos de piedra»).
> Si es Mediterránea: «Estamos armando una salida a Catalunya en grupo reducido para mayo de 2027. ¿Te paso los detalles por WhatsApp?»
> Si es Blanca o Atlántica: «Esa ruta la diseñamos a tu medida. ¿Platicamos por WhatsApp qué fechas traes?»

---

## 14. Pendientes del cliente

- Foto de Andalucía Blanca para el resultado B (y para la home).
- URL del aviso de privacidad.
- Destino de leads (endpoint).
- Confirmar que Miguel responde el WhatsApp del test.
- OG image propia del test (opcional).
