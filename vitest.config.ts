import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Minimal MDX transform for the test runner (01-15).
 *
 * `@next/mdx` compiles `.mdx` content during the Next build; vitest has no MDX
 * pipeline. The compiled-MDX level tests must import the *real* content modules, so
 * this plugin compiles `.mdx` with `@mdx-js/mdx` to an ESM program equivalent to the
 * Next output (same `react/jsx-runtime` JSX runtime, `useMDXComponents` support).
 */
function mdxTestPlugin() {
  return {
    name: "gsd-mdx-test-transform",
    enforce: "pre" as const,
    async transform(code: string, id: string) {
      const cleanId = id.split("?")[0];
      if (!cleanId.endsWith(".mdx")) return null;
      const { compile } = await import("@mdx-js/mdx");
      const compiled = await compile(code, {
        outputFormat: "program",
        jsxImportSource: "react",
      });
      return { code: String(compiled), map: null };
    },
  };
}

export default defineConfig({
  plugins: [mdxTestPlugin(), react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        ".next/",
        "src/**/*.d.ts",
        "vitest.config.ts",
        "vitest.setup.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
