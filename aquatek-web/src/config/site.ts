export const siteConfig = {
  name: 'Aquatek',
  tagline: 'Ingeniería de Recursos Hídricos',
  locale: 'es_CO',
  language: 'es',
  defaultTitle: 'Aquatek | Ingeniería de Recursos Hídricos',
  defaultDescription:
    'Ingeniería de recursos hídricos aplicada a hidrología, hidráulica, drenaje, redes contra incendio y redes hidrosanitarias.',
  contactEmail: 'aquatek@gmail.com',
  socialImage: '/og-default.png',
} as const;

export function getPublicSiteUrl(): URL | undefined {
  const value = import.meta.env.PUBLIC_SITE_URL?.trim();
  if (!value) return undefined;

  try {
    return new URL(value.endsWith('/') ? value : `${value}/`);
  } catch {
    return undefined;
  }
}
