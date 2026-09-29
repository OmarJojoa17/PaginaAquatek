// @ts-check
import { defineConfig } from 'astro/config';

const configuredBase = process.env.PUBLIC_BASE_PATH || '/';
const base = `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`.replace('//', '/');

// https://astro.build/config
export default defineConfig({
  devToolbar: { enabled: false },
  markdown: { syntaxHighlight: false },
  site: process.env.PUBLIC_SITE_URL,
  base,
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "connect-src 'self'",
        "font-src 'self'",
        "form-action 'self'",
        "frame-src 'none'",
        "img-src 'self' data:",
        "manifest-src 'self'",
        "media-src 'self'",
        "object-src 'none'",
        "worker-src 'self'",
      ],
    },
  },
});
