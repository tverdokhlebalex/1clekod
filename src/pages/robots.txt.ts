import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const hidden = import.meta.env.PUBLIC_NOINDEX === "true";
  const site = (import.meta.env.PUBLIC_SITE_URL || "https://1clekod.ru").replace(/\/$/, "");
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base === "/" ? "" : base.replace(/\/$/, "");
  const body = hidden
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${site}${prefix}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" }
  });
};
