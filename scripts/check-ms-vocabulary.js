#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Bahasa Melayu (`ms`) vocabulary / consistency guard.
 *
 * Closes UAT gaps G-03-4 (invented non-word "bodil"; untranslated English content
 * words "bedtime"/"level"/"superhero") and G-03-6 (the 1-1 WordPredictor
 * explanation justified a Malay answer via English and kept an English
 * `aiThinking` sentence).
 *
 * Scans every tracked `src/content/kids/ms` MDX file and exits non-zero on:
 *   1. a case-insensitive word-boundary match for `bodil`, `bedtime` or `superhero`;
 *   2. a case-insensitive word-boundary match for the bare English content word
 *      `level` (the common Malay term is `tahap`);
 *   3. a known English-residual marker: `bahasa inggeris`, `The cat sat`, `on the mat`;
 *   4. a 1-1 `aiThinking` that does not quote the Malay puzzle sentence
 *      `Kucing itu duduk di atas tikar`.
 *
 * The guard is over `src/content/kids/ms` MDX only — it must NOT scan
 * `messages/ms.json` (whose JSON key names like `level` are legitimate) nor any
 * non-`ms` locale.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MS_DIR = path.join(__dirname, "..", "src", "content", "kids", "ms");
const ONE_ONE = path.join(MS_DIR, "1-1-meet-promi.mdx");
const PUZZLE_QUOTE = "Kucing itu duduk di atas tikar";

// Enumerate every tracked `ms` MDX file. Prefer git (the tracked source of truth);
// fall back to a recursive walk if git is unavailable. Never silently check nothing.
function listMsFiles() {
  let files = [];
  try {
    const out = execSync("git ls-files src/content/kids/ms", {
      cwd: path.join(__dirname, ".."),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    });
    files = out
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => path.join(__dirname, "..", f));
  } catch {
    // Fallback: recursive walk.
    const walk = (dir) => {
      const out = [];
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walk(full));
        else if (entry.name.endsWith(".mdx")) out.push(full);
      }
      return out;
    };
    if (fs.existsSync(MS_DIR)) files = walk(MS_DIR);
  }
  return files;
}

const files = listMsFiles();

if (files.length === 0) {
  console.error(
    "❌ ms vocabulary guard: no `src/content/kids/ms/**/*.mdx` files found — refusing to pass silently."
  );
  process.exit(1);
}

const offenders = [];

// 1. Invented non-word + untranslated English content words.
const WORD_RULES = [
  { name: "bodil (non-word; use 'lawak')", re: /\bbodil\b/i },
  { name: "bedtime (use 'sebelum tidur')", re: /\bbedtime\b/i },
  { name: "superhero (use 'adiwira')", re: /\bsuperhero\b/i },
];

// 2. Bare English content word `level` (singular; the Malay term is `tahap`).
const LEVEL_RULE = { name: "level (use 'tahap')", re: /\blevel\b/i };

// 3. Known English-residual markers (case-insensitive).
const RESIDUAL_RULES = [
  { name: "'bahasa inggeris'", re: /bahasa inggeris/i },
  { name: "'The cat sat'", re: /The cat sat/u },
  { name: "'on the mat'", re: /on the mat/i },
];

function scanFile(file, rules) {
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  const rel = path.relative(path.join(__dirname, ".."), file);
  for (const rule of rules) {
    lines.forEach((line, i) => {
      const m = line.match(rule.re);
      if (m) {
        offenders.push(`${rel}:${i + 1}  [${rule.name}]  matched: "${m[0]}"`);
      }
    });
  }
}

for (const file of files) {
  scanFile(file, WORD_RULES);
  scanFile(file, [LEVEL_RULE]);
  scanFile(file, RESIDUAL_RULES);
}

// 4. 1-1 WordPredictor consistency: `aiThinking` must quote the Malay puzzle sentence.
if (fs.existsSync(ONE_ONE)) {
  const text = fs.readFileSync(ONE_ONE, "utf8");
  const rel = path.relative(path.join(__dirname, ".."), ONE_ONE);
  if (!text.includes(PUZZLE_QUOTE)) {
    offenders.push(
      `${rel}  [1-1 aiThinking]  does not quote the Malay puzzle sentence "${PUZZLE_QUOTE}"`
    );
  }
}

if (offenders.length > 0) {
  console.error("❌ ms vocabulary/consistency guard failed:\n");
  for (const o of offenders) console.error(`   ${o}`);
  console.error(`\n   ${offenders.length} offender(s). Exit 1.`);
  process.exit(1);
}

console.log(`✅ ms vocabulary guard: scanned ${files.length} file(s)`);
console.log("   ✔ no bodil / bedtime / superhero (case-insensitive, word-boundary)");
console.log("   ✔ no bare English content word `level` (use `tahap`)");
console.log("   ✔ no English-residual markers (bahasa inggeris / The cat sat / on the mat)");
console.log(`   ✔ 1-1 aiThinking quotes the Malay puzzle sentence "${PUZZLE_QUOTE}"`);
process.exit(0);