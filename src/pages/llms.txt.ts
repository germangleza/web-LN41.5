import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site.config';

/**
 * llms.txt — estándar emergente para GEO.
 * Le da a ChatGPT/Claude/Perplexity un resumen estructurado del sitio
 * para que te entiendan y te citen correctamente. Se regenera en cada build.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const rutas = (await getCollection('rutas', ({ data }) => !data.draft))
    .sort((a, b) => a.data.order - b.data.order);

  const body = `# ${SITE.name}

> ${SITE.description}

## Información
- Sitio: ${SITE.url}
- Contacto: ${SITE.business.email}

## Rutas
${rutas.map((r) => `- [${r.data.title}](${SITE.url}/rutas/${r.id}): ${r.data.subtitle}`).join('\n')}

## Blog
${posts.map((p) => `- [${p.data.title}](${SITE.url}/blog/${p.id}): ${p.data.description}`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
