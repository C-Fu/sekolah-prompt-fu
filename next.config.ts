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

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  reactCompiler: true,
  // Configure webpack for raw imports
  webpack: (config) => {
    config.module.rules.push({
      resourceQuery: /raw/,
      type: 'asset/source',
    });
    return config;
  },
  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Render metadata in <head> before the body streams for crawlers. Next.js only does
  // this for its built-in list of HTML-limited bots, which leaves out Googlebot and AI
  // crawlers; they would otherwise find the title, canonical and robots tags in <body>.
  htmlLimitedBots:
    /bot|crawler|spider|slurp|google-|-google|googleother|bingpreview|lighthouse|facebookexternalhit|facebookcatalog|externalagent|perplexity|whatsapp|ia_archiver|vkshare|quora link preview|skypeuripreview|yeti|tumblr|yandex|sogou|googleweblight/i,
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withMDX(withNextIntl(nextConfig));