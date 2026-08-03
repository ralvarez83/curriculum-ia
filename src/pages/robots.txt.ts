import type { APIRoute } from 'astro';

/**
 * Se genera en vez de ponerlo en `public/` para que la URL del sitemap salga
 * de `site` en astro.config.mjs y no haya que mantenerla en dos sitios.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemap}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
