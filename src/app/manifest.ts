import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/seo";

// Static export (`next.config.ts`) cannot prerender a route handler unless it
// declares itself static.
export const dynamic = "force-static";

/**
 * Web app manifest.
 *
 * Defined as an app route (not a static `public/` file) so the icon `src`
 * values can be run through `withBasePath()` at build time: GitHub Pages serves
 * this project site under a sub-path, and root-absolute icon URLs would
 * otherwise resolve against the domain root and 404.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sekolah Prompt-Fu",
    short_name: "Prompt-Fu",
    icons: [
      {
        src: withBasePath("/favicon/web-app-manifest-192x192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: withBasePath("/favicon/web-app-manifest-512x512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  };
}