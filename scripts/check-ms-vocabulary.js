#!/usr/bin/env node

/**
 * Bahasa Melayu (`ms`) vocabulary / consistency guard.
 *
 * Closes UAT gaps G-03-4 (invented non-word "bodil"; untranslated English content
 * words "bedtime"/"level"/"superhero") and G-03-6 (the 1-1 WordPredictor
 * explanation justified a Malay answer via English and kept an English
 * `aiThinking` sentence).
 *
 * Scans every `src/content/kids/ms` MDX file (on-disk walk ∪ tracked) and exits non-zero on:
 *   1. a case-insensitive word-boundary match for `bodil`, `bedtime` or `superhero`;
 *   2. a case-insensitive word-boundary match for the bare English content word
 *      `level` (the common Malay term is `tahap`);
 *   3. a case-insensitive English-residual marker: `bahasa inggeris`, `The cat sat`, `on the mat`;
 *   4. a 1-1 `aiThinking` prop whose value does not quote the Malay puzzle sentence
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

// Enumerate every `ms` MDX file that exists on disk. The on-disk walk is the
// SOURCE OF TRUTH for "what exists right now": it always covers untracked/new
// files (CR-01 — a `git ls-files`-only enumeration silently skipped an
// uncommitted level, exactly the self-check-before-commit workflow). git is
// unioned in as a cheap completeness backstop (e.g. a tracked file whose bytes
// are absent from the working tree is still reported); when both agree the set
// is identical. Never silently check nothing.
function listMsFiles() {
  const seen = new Set();

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".mdx")) seen.add(path.resolve(full));
    }
  };

  // 1. On-disk walk — the source of truth for what exists right now.
  if (fs.existsSync(MS_DIR)) {
    walk(MS_DIR);
  } else {
    console.error(
      `❌ ms vocabulary guard: ${path.relative(path.join(__dirname, ".."), MS_DIR)} does not exist — refusing to pass silently.`
    );
    process.exit(1);
  }

  // 2. Union in tracked files (backstop for a tracked-but-missing-on-disk file).
  try {
    const out = execSync("git ls-files src/content/kids/ms", {
      cwd: path.join(__dirname, ".."),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    });
    for (const f of out.split("\n")) {
      const rel = f.trim();
      if (rel.endsWith(".mdx")) seen.add(path.resolve(path.join(__dirname, "..", rel)));
    }
  } catch {
    // No git available — the on-disk walk already covers every present file.
  }

  return [...seen].sort();
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
  // WR-01: the `i` flag is required — the comment above and the success line
  // below both advertise case-insensitive matching, and `The Cat Sat` /
  // `THE CAT SAT` / `the cat sat` must all be caught. The `u` flag is
  // unnecessary for this ASCII marker.
  { name: "'The cat sat'", re: /The cat sat/i },
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

// 4. 1-1 WordPredictor consistency: the `aiThinking` ATTRIBUTE VALUE must quote
//    the Malay puzzle sentence. CR-02: the check must be scoped to the prop, not
//    a whole-file substring search — a `sentence=`/`explanation=`/comment copy of
//    the sentence elsewhere in the file would otherwise mask an English
//    `aiThinking` (the exact G-03-6 defect this guard exists to catch).
if (fs.existsSync(ONE_ONE)) {
  const text = fs.readFileSync(ONE_ONE, "utf8");
  const rel = path.relative(path.join(__dirname, ".."), ONE_ONE);
  const m = text.match(/aiThinking\s*=\s*"([^"]*)"/);
  if (!m) {
    offenders.push(
      `${rel}  [1-1 aiThinking]  no \`aiThinking="..."\` attribute found`
    );
  } else if (!m[1].includes(PUZZLE_QUOTE)) {
    offenders.push(
      `${rel}  [1-1 aiThinking]  aiThinking does not quote the Malay puzzle sentence "${PUZZLE_QUOTE}"`
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