/**
 * ⚙️ CONFIGURACIÓN CENTRAL DEL SITIO
 * Este es EL ÚNICO archivo que necesitas editar al iniciar un proyecto nuevo.
 * Todo el sitio (SEO, schema, sitemap, RSS, llms.txt) se alimenta de aquí.
 */

export const SITE = {
  // === Básicos ===
  name: 'LN41.5 Travel',                     // Nombre de la marca/negocio
  url: 'https://ln415travel.com',            // Dominio final SIN slash al final — PENDIENTE confirmar
  title: 'LN41.5 Travel — Viajes a España diseñados a tu medida',
  description: 'Diseñamos viajes a España con criterio y conocimiento local: regiones, sabores e historias que se quedan fuera del itinerario tradicional.',
  locale: 'es_MX',                           // es_MX, es_ES, en_US...
  lang: 'es',

  // === Marca ===
  logo: '/logo.png',                         // Ruta en /public
  ogImage: '/og-default.png',                // Imagen por defecto para compartir (1200x630)
  themeColor: '#1e1914',

  // === Contacto / Negocio (para schema LocalBusiness) ===
  business: {
    type: 'Organization' as const,           // 'Organization' | 'LocalBusiness'
    legalName: '',                           // PENDIENTE razón social
    email: 'hola@ln415travel.com',           // PENDIENTE confirmar
    phone: '+52 55 7810 1234',               // PENDIENTE confirmar
    whatsapp: '525578101234',                // Solo dígitos con lada país, para wa.me — PENDIENTE confirmar
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'MX',
    },
    geo: { lat: 0, lng: 0 },                 // Solo si es LocalBusiness
    openingHours: [] as string[],            // Ej: ['Mo-Fr 09:00-18:00', 'Sa 09:00-14:00']
  },

  // === Redes sociales (para schema sameAs y footer) ===
  socials: {
    twitter: '',                             // handle sin @, ej: 'miempresa'
    instagram: '',
    facebook: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
  },

  // === Llamados a la acción ===
  cta: {
    // "Diseñar mi viaje": URL del formulario. Si se deja vacío, abre un correo a business.email.
    designTrip: '',
    designTripSubject: 'Quiero diseñar mi viaje a España',
    whatsappMessage: 'Hola, estoy pensando en viajar a España y me gustaría diseñar una ruta.',
  },

  // === Blog ===
  blog: {
    title: 'Blog',
    description: 'Artículos y novedades.',
    postsPerPage: 10,
    defaultAuthor: 'Equipo LN41.5',
  },

  // === Analytics (opcional, deja vacío si no usas) ===
  analytics: {
    plausibleDomain: '',                     // ej: 'ejemplo.com'
    googleAnalyticsId: '',                   // ej: 'G-XXXXXXX'
  },
} as const;

export type SiteConfig = typeof SITE;

/** Destino del CTA "Diseñar mi viaje" */
export function designTripUrl(): string {
  return SITE.cta.designTrip || `mailto:${SITE.business.email}?subject=${encodeURIComponent(SITE.cta.designTripSubject)}`;
}

/** Link de WhatsApp con mensaje prellenado */
export function whatsappUrl(message: string = SITE.cta.whatsappMessage): string {
  return `https://wa.me/${SITE.business.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** URLs sociales completas derivadas del config */
export function socialUrls(): string[] {
  const s = SITE.socials;
  return [
    s.twitter && `https://twitter.com/${s.twitter}`,
    s.instagram && `https://instagram.com/${s.instagram}`,
    s.facebook && `https://facebook.com/${s.facebook}`,
    s.linkedin && `https://linkedin.com/company/${s.linkedin}`,
    s.youtube && `https://youtube.com/@${s.youtube}`,
    s.tiktok && `https://tiktok.com/@${s.tiktok}`,
  ].filter(Boolean) as string[];
}
