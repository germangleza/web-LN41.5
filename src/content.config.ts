import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Colección del blog con frontmatter TIPADO Y VALIDADO.
 * Si te falta un campo obligatorio, el build falla y te avisa. Cero posts rotos.
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70, 'Máx 70 caracteres para SEO'),
    description: z.string().min(50).max(160, 'Description entre 50-160 caracteres'),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/**
 * Rutas de autor. Cada archivo = una página en /rutas/<nombre-del-archivo>.
 * Todo el contenido de la página vive en el frontmatter; las secciones sin datos no se muestran (ver src/pages/rutas/[slug].astro).
 * - kind 'ruta' aparece en la home (ordenada por `order`); 'especial' solo como banner.
 * - `photo` = nombre del archivo en src/assets/fotos (sin extensión).
 * - En `paragraphs`, un texto que empieza con "> " se muestra destacado.
 */
const stop = z.object({
  name: z.string(),
  title: z.string().optional(),
  paragraphs: z.array(z.string()).default([]),
  itemsIntro: z.string().optional(),
  items: z.array(z.string()).default([]),
});
const rutas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/rutas' }),
  schema: z.object({
    kind: z.enum(['ruta', 'especial']).default('ruta'),
    title: z.string().max(70),
    subtitle: z.string(),
    summary: z.string(),
    description: z.string().min(50).max(160, 'Description entre 50-160 caracteres'),
    order: z.number(),
    photo: z.string(),
    photoAlt: z.string().optional(),
    icon: z.enum(['copa', 'ola', 'castillo', 'brujula', 'montana', 'encina', 'estrella']).default('brujula'),
    eyebrow: z.string().optional(),
    duration: z.string().optional(),
    dates: z.string().optional(),
    hero: z.object({ text: z.string(), cta: z.string() }).optional(),
    intro: z.object({ title: z.string(), paragraphs: z.array(z.string()) }).optional(),
    route: z.object({
      title: z.string().default('La ruta'),
      groups: z.array(z.object({ title: z.string().optional(), stops: z.array(stop) })),
    }).optional(),
    defines: z.object({ title: z.string().default('Lo que define este viaje'), items: z.array(z.string()), note: z.string().optional() }).optional(),
    extra: z.array(z.object({ title: z.string(), paragraphs: z.array(z.string()) })).default([]),
    idealFor: z.array(z.string()).default([]),
    closing: z.object({ title: z.string(), text: z.string().optional(), cta: z.string() }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, rutas };
