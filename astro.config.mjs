import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import node from "@astrojs/node";
import { satteri } from "@astrojs/markdown-satteri";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const redirectsFile = fileURLToPath(new URL("./src/data/redirects.json", import.meta.url));
const redirectItems = JSON.parse(readFileSync(redirectsFile, "utf8"));

function siteOrigin() {
  return (process.env.PUBLIC_SITE_URL || "https://1clekod.ru").replace(/\/$/, "");
}

function siteBase() {
  const raw = (process.env.PUBLIC_BASE_PATH || "/").trim();
  if (!raw || raw === "/") return "/";
  const prefixed = raw.startsWith("/") ? raw : `/${raw}`;
  return prefixed.replace(/\/$/, "");
}

const base = siteBase();
const staticHost = process.env.PUBLIC_STATIC_HOST === "true";

function prefixInternalLinks() {
  const prefix = base === "/" ? "" : base;
  return () => ({
    name: "prefix-internal-links",
    element: {
      filter: ["a"],
      visit(node, ctx) {
        const href = node.properties?.href;
        if (
          typeof href !== "string" ||
          !href.startsWith("/") ||
          href.startsWith("//") ||
          !prefix ||
          href === prefix ||
          href.startsWith(`${prefix}/`)
        ) {
          return;
        }
        ctx.setProperty(node, "href", `${prefix}${href}`);
      }
    }
  });
}

const redirects = Object.fromEntries(
  redirectItems
    .filter((item) => item.enabled)
    .map((item) => [
      item.from,
      {
        status: item.status ?? 301,
        destination: item.to.startsWith("/") && base !== "/" ? `${base}${item.to}` : item.to
      }
    ])
);

export default defineConfig({
  site: siteOrigin(),
  base,
  output: "static",
  adapter: node({ mode: "standalone" }),
  trailingSlash: "never",
  build: staticHost ? { format: "file" } : undefined,
  redirects,
  markdown: {
    processor: satteri({
      hastPlugins: [prefixInternalLinks()]
    })
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => process.env.PUBLIC_NOINDEX !== "true" && !page.includes("/api/")
    })
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  }
});
