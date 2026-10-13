import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

const redirectsFile = fileURLToPath(new URL("./src/data/redirects.json", import.meta.url));
const redirectItems = JSON.parse(readFileSync(redirectsFile, "utf8"));

const redirects = Object.fromEntries(
  redirectItems
    .filter((item) => item.enabled)
    .map((item) => [item.from, { status: item.status ?? 301, destination: item.to }])
);

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || "https://1clekod.ru",
  output: "static",
  adapter: node({ mode: "standalone" }),
  trailingSlash: "never",
  redirects,
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/api/")
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
