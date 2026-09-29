import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getPublicSiteUrl } from '../config/site';
import { isPublicProject } from '../utils/content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const publicSiteUrl = getPublicSiteUrl() ?? new URL('https://aquatek.invalid/');
  const services = await getCollection('services');
  const projects = (await getCollection('projects')).filter((project) =>
    isPublicProject(project.data),
  );
  const routes = [
    '',
    'empresa/',
    'capacidades/',
    'contacto/',
    'especialidades/',
    'proyectos/',
    ...services.map((service) => `especialidades/${service.data.slug}/`),
    ...projects.map((project) => `proyectos/${project.data.slug}/`),
  ];
  const urls = routes
    .map((route) => `<url><loc>${new URL(route, publicSiteUrl).href}</loc></url>`)
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
