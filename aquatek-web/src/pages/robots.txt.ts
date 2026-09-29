import type { APIRoute } from 'astro';
import { getPublicSiteUrl } from '../config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const publicSiteUrl = getPublicSiteUrl();
  const allowIndexing = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
  const body =
    publicSiteUrl && allowIndexing
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', publicSiteUrl).href}\n`
      : 'User-agent: *\nDisallow: /\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
