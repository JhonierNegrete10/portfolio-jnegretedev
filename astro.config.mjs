import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import expressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { routes } from "./src/i18n/routes.ts";
import blogSitemap from "./integrations/blog-sitemap.mjs";

const SITE = "https://jnegrete.dev";

const blogSitemapState = blogSitemap({ site: SITE, routes });

// https://astro.build/config
export default defineConfig({
  site: SITE,
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  vite: {
    envPrefix: ["PUBLIC_", "BLOG_"],
  },
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  integrations: [
    blogSitemapState.integration,
    expressiveCode({
      themes: ["github-dark"],
      plugins: [pluginLineNumbers()],
      defaultProps: { showLineNumbers: true },
      styleOverrides: {
        borderRadius: "0",
        borderColor: "#2e2e30",
        codeBackground: "#141416",
        codeForeground: "#ececea",
        codeFontFamily: "var(--font-mono)",
        focusBorder: "#ff5c35",
        gutterBorderColor: "#2e2e30",
        frames: {
          editorBackground: "#141416",
          editorTabBarBackground: "#141416",
          editorTabBarBorderColor: "#2e2e30",
          editorActiveTabIndicatorTopColor: "#ff5c35",
        },
      },
    }),
    mdx(),
    sitemap({
      serialize(item) {
        return blogSitemapState.serialize(item);
      },
    }),
  ],
});
