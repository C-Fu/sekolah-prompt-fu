#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Read-only kids import-closure checker.
 *
 * Purpose: prove that the retained kids game still resolves every repo-local
 * module it depends on after non-kids component families are pruned. It starts
 * from a fixed set of retained entry points, recursively resolves repo-local
 * `@/…` and relative import/export specifiers (with TS/TSX/JS/JSX/JSON/MDX and
 * `index.*` variants), and exits non-zero when any specifier resolves to a
 * missing file — reporting both the missing target and the importer.
 *
 * It intentionally does NOT type-check the whole project (the full-project
 * `tsc` still includes stale legacy tests until a later plan cleans them up).
 * This is a bounded, dependency-graph-only check.
 *
 * Bare npm imports (e.g. `react`, `next/link`, `next-intl`) and CSS/assets
 * resolved by Next are ignored. Dynamic MDX registry imports of the form
 * `import("@/content/kids/<locale>/<slug>.mdx")` are resolved as files; the
 * registry slugs checked against `src/content/kids/en` must exist, so a level
 * registry entry can never point at a pruned/renamed MDX file.
 *
 * Read-only: never writes, moves, or deletes anything. Exit 0 = closure closed.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

/** Extensions tried, in resolution order (mirrors common Next/TS resolution). */
const MODULE_EXTENSIONS = [
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".mdx",
];

/** Asset/CSS specifiers Next resolves itself; never treated as module targets. */
const ASSET_EXTENSIONS = new Set([
  ".css",
  ".scss",
  ".sass",
  ".less",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".avif",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
  ".mp3",
  ".mp4",
  ".webm",
  ".wav",
  ".pdf",
]);

/** Directory holding the English kids MDX levels used for registry validation. */
const KIDS_EN_CONTENT_DIR = path.join(ROOT, "src", "content", "kids", "en");

/** Entry points: the retained kids game surface (files only; dirs are expanded). */
const ENTRY_PATHS = [
  // Retained app route/layout/error files that the kids game renders through.
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/error.tsx",
  "src/app/global-error.tsx",
  "src/app/not-found.tsx",
  "src/app/map/page.tsx",
  "src/app/level/[slug]/page.tsx",
  // Kids components themselves.
  "src/components/kids",
  // Shared provider shell retained for the kids game.
  "src/components/providers/index.tsx",
  // MDX component binding used by compiled kids content.
  "mdx-components.tsx",
];

/** Resolve a directory to its module-bearing files, recursing on directories. */
function expandEntry(entryRel) {
  const abs = path.join(ROOT, entryRel);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return [abs];
  const out = [];
  for (const dirent of fs.readdirSync(abs, { withFileTypes: true })) {
    const child = path.join(abs, dirent.name);
    if (dirent.isDirectory()) out.push(...expandEntry(path.relative(ROOT, child)));
    else if (MODULE_EXTENSIONS.includes(path.extname(dirent.name))) out.push(child);
  }
  return out;
}

/**
 * Resolve a repo-local module specifier to an on-disk file, trying extension
 * and `index.*` variants. Returns the absolute path or null.
 */
function resolveModule(specifier, importerAbs) {
  let base;
  if (specifier.startsWith("@/")) {
    base = path.join(ROOT, "src", specifier.slice(2));
  } else if (specifier.startsWith(".")) {
    base = path.resolve(path.dirname(importerAbs), specifier);
  } else {
    // Bare npm specifier (react, next/*, next-intl, lucide-react, …).
    return { external: true };
  }

  // Skip asset/CSS specifiers Next bundles itself.
  if (ASSET_EXTENSIONS.has(path.extname(base).toLowerCase())) {
    return { external: true };
  }

  const candidates = [];
  const ext = path.extname(base);
  const KNOWN_MODULE_EXT = new Set(MODULE_EXTENSIONS);
  if (ext && KNOWN_MODULE_EXT.has(ext)) {
    // Explicit, known module extension given (e.g. `.mdx`, `.json`) — try as-is.
    candidates.push(base);
    // TS/Next allow dropping the extension when resolving source imports.
    if (ext === ".js" || ext === ".jsx") {
      candidates.push(base.slice(0, -ext.length) + ".ts");
      candidates.push(base.slice(0, -ext.length) + ".tsx");
    }
  } else {
    // No extension, or a dotted basename that is NOT a module extension
    // (e.g. `prompts.config` from `@/../prompts.config`) — try extensions.
    for (const e of MODULE_EXTENSIONS) candidates.push(base + e);
    for (const e of MODULE_EXTENSIONS) candidates.push(path.join(base, "index" + e));
  }

  for (const cand of candidates) {
    try {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
    } catch {
      /* ignore */
    }
  }
  return null;
}

/** Match static `import`/`export ... from "spec"` and bare `import("spec")`. */
const STATIC_SPECIFIER_RE =
  /(?:^|[^\w$])(?:import|export)\b[\s\S]*?\bfrom\s*["']([^"']+)["']|(?:^|[^\w$])import\s*\(\s*["']([^"']+)["']\s*\)|(?:^|[^\w$])import\s+["']([^"']+)["']/g;

/** Extract module specifiers from a source file's text. */
function extractSpecifiers(text) {
  const specs = [];
  let m;
  STATIC_SPECIFIER_RE.lastIndex = 0;
  while ((m = STATIC_SPECIFIER_RE.exec(text)) !== null) {
    const spec = m[1] || m[2] || m[3];
    if (spec) specs.push(spec);
  }
  return specs;
}

/** Collect the set of MDX slugs present in `src/content/kids/en`. */
function collectEnglishSlugs() {
  const slugs = new Set();
  if (!fs.existsSync(KIDS_EN_CONTENT_DIR)) return slugs;
  for (const name of fs.readdirSync(KIDS_EN_CONTENT_DIR)) {
    if (name.endsWith(".mdx")) slugs.add(name.slice(0, -".mdx".length));
  }
  return slugs;
}

/**
 * Verify every dynamic import specifier pointing at `src/content/kids/en/<slug>.mdx`
 * has a matching file. Returns failure records. (Other locales are out of scope
 * for this slice; the English fallback is the load-bearing one.)
 */
function checkEnglishRegistrySlugs() {
  const failures = [];
  const seen = new Set();
  for (const file of walkDir(path.join(ROOT, "src"))) {
    if (!MODULE_EXTENSIONS.includes(path.extname(file))) continue;
    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (!text.includes("content/kids/en/")) continue;
    for (const spec of extractSpecifiers(text)) {
      const marker = "content/kids/en/";
      const idx = spec.indexOf(marker);
      if (idx === -1) continue;
      const tail = spec.slice(idx + marker.length);
      const slug = tail.replace(/\.mdx$/, "");
      const key = spec;
      if (seen.has(key)) continue;
      seen.add(key);
      const target = path.join(KIDS_EN_CONTENT_DIR, slug + ".mdx");
      if (!fs.existsSync(target)) {
        failures.push({
          importer: path.relative(ROOT, file),
          specifier: spec,
          target: path.relative(ROOT, target),
        });
      }
    }
  }
  return failures;
}

/** Recursively list files under a directory (absolute paths). */
function walkDir(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const dirent of entries) {
    const child = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (dirent.name === "node_modules" || dirent.name === ".git") continue;
      out.push(...walkDir(child));
    } else {
      out.push(child);
    }
  }
  return out;
}

function main() {
  console.log("🔎 Kids import-closure check (read-only)\n");

  // Build the entry set.
  const entries = new Set();
  for (const rel of ENTRY_PATHS) {
    const files = expandEntry(rel);
    if (files.length === 0) {
      console.error(`❌ Entry point missing or empty: ${rel}`);
      process.exit(2);
    }
    for (const f of files) entries.add(f);
  }

  const visited = new Set();
  const missing = [];
  const queue = [...entries];

  while (queue.length > 0) {
    const file = queue.shift();
    if (visited.has(file)) continue;
    visited.add(file);

    let text;
    try {
      text = fs.readFileSync(file, "utf8");
    } catch {
      continue;
    }

    for (const spec of extractSpecifiers(text)) {
      let resolved;
      try {
        resolved = resolveModule(spec, file);
      } catch (err) {
        missing.push({
          importer: path.relative(ROOT, file),
          specifier: spec,
          target: "(resolution error: " + err.message + ")",
        });
        continue;
      }
      if (!resolved) {
        missing.push({
          importer: path.relative(ROOT, file),
          specifier: spec,
          target: spec,
        });
        continue;
      }
      if (resolved.external) continue;
      if (!visited.has(resolved)) queue.push(resolved);
    }
  }

  // Bounded dynamic MDX registry check (English fallback).
  const slugFailures = checkEnglishRegistrySlugs();
  const enSlugs = collectEnglishSlugs();
  console.log(`📚 src/content/kids/en MDX slugs: ${enSlugs.size}`);
  console.log(`🧩 Modules visited in closure: ${visited.size}\n`);

  const problems = [...missing, ...slugFailures];

  if (problems.length > 0) {
    console.error(`❌ Import closure is broken (${problems.length} problem(s)):\n`);
    for (const p of problems) {
      const via = p.specifier ? ` (specifier: ${p.specifier})` : "";
      console.error(`   • missing target: ${p.target}${via}`);
      console.error(`     imported by:   ${p.importer}`);
    }
    console.error("");
    process.exit(1);
  }

  console.log("✅ Import closure is closed — every repo-local specifier resolves.");
  process.exit(0);
}

main();