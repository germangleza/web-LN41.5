import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { SITE } from './src/config/site.config.ts';

export default defineConfig({
  site: SITE.url,
  integrations: [sitemap(), mdx()],
  trailingSlash: 'never',
  build: { format: 'file' },
  // Rutas anteriores que se sustituyeron por las nuevas Rutas de autor
  redirects: {
    '/rutas/espana-entre-vinedos': '/#rutas',
    '/rutas/espana-medieval': '/#rutas',
    '/rutas/sabores-del-norte': '/rutas/espana-atlantica',
    '/ruta': '/que-espana-te-falta',
    '/test-ruta': '/que-espana-te-falta',
    '/test': '/que-espana-te-falta',
  },
});
