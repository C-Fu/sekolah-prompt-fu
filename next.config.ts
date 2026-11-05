import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Plugin names keep loader options serializable for Turbopack.
    remarkPlugins: ["remark-gfm"],
  },
});

// GitHub Pages serves the project under a sub-path. The build sets
// NEXT_PUBLIC_BASE_PATH to that prefix; it stays empty for local dev and
// plain `next build`, so the static export remains navigable from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  // Self-contained static export for GitHub Pages (no server runtime).
  output: "export",
  // Configure webpack for raw imports
  webpack: (config) => {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source',
    });
    return config;
  },
  // Prefix internal links/assets with the Pages sub-path when configured.
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Emit `dir/index.html` for every route so GitHub Pages serves clean URLs
  // (and matches the directory layout the deploy workflow expects).
  trailingSlash: true,
  // Render metadata in <head> before the body streams for crawlers. Next.js only does
  // this for its built-in list of HTML-limited bots, which leaves out Googlebot and AI
  // crawlers; they would otherwise find the title, canonical and robots tags in <body>.
  htmlLimitedBots:
    /bot|crawler|spider|slurp|google-|-google|googleother|bingpreview|lighthouse|facebookexternalhit|facebookcatalog|externalagent|perplexity|whatsapp|ia_archiver|vkshare|quora link preview|skypeuripreview|yeti|tumblr|yandex|sogou|googleweblight/i,
  // Static export requires unoptimized images (no on-demand image server).
  images: {
    unoptimized: true,
  },
};

export default withMDX(withNextIntl(nextConfig));