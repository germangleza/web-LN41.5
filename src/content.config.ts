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
 * Rutas de viaje. Cada archivo = una página en /rutas/<nombre-del-archivo>.
 * `order` define el orden en la home. `photo` = nombre del archivo en src/assets/fotos (sin extensión).
 */
const rutas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/rutas' }),
  schema: z.object({
    title: z.string().max(70),
    subtitle: z.string(),
    description: z.string().min(50).max(160, 'Description entre 50-160 caracteres'),
    order: z.number(),
    photo: z.string(),
    photoAlt: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, rutas };
