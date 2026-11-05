---
phase: 03-bahasa-melayu-ms-localization
plan: 06
subsystem: content
tags: [i18n, ms, mdx, content-quality, gap-closure, guard-script]
dependency-graph:
  requires:
    - 03-05
  provides:
    - "ms vocabulary/consistency guard (scripts/check-ms-vocabulary.js)"
    - "clean ms corpus: no bodil/bedtime/level/superhero; 1-1 WordPredictor coherent Malay"
  affects:
    - "03-verify-work (G-03-4, G-03-6 closeable)"
    - "FR-3 certification"
tech-stack:
  added: []
  patterns:
    - "Node stdlib guard script mirroring scripts/check-translations.js + lint-mdx.js conventions"
key-files:
  created:
    - scripts/check-ms-vocabulary.js
  modified:
    - src/content/kids/ms/2-4-detail-detective.mdx
    - src/content/kids/ms/3-2-show-dont-tell.mdx
    - src/content/kids/ms/1-3-being-clear.mdx
    - src/content/kids/ms/3-4-context-champion.mdx
    - src/content/kids/ms/4-4-world-builder.mdx
    - src/content/kids/ms/5-4-graduation-day.mdx
    - src/content/kids/ms/4-1-pretend-time.mdx
    - src/content/kids/ms/5-2-fix-it-up.mdx
    - src/content/kids/ms/1-1-meet-promi.mdx
decisions:
  - "Versioned a persistent Node guard (scripts/check-ms-vocabulary.js) rather than a one-off grep so the bodil/bedtime/level/superhero and English-residual classes cannot silently recur."
  - "Guard resolves the ms file set via `git ls-files src/content/kids/ms` with a recursive-walk fallback and fails loudly on an empty set — a guard that checks nothing is worse than none."
  - "`level` rule is singular word-boundary only (do not match `levels`) — the offending sites all used the singular."
  - "1-1 aiThinking consistency asserted structurally (must quote 'Kucing itu duduk di atas tikar') so the interactive cannot drift from its own puzzle sentence."
metrics:
  duration: "3 min"
  completed: "2026-11-05"
  tasks: 2
  files: 10
status: complete
actuals:
  tokens: 1873
  tasks: 2
  commits: 2
plan_head_before: ce41d1a4058b0cabd93b64040116a018bd25fe92
plan_head_after: d67b34cc5a778dc62aefff3040e32c12c7a429fe
---

# Phase 03 Plan 06: ms Vocabulary + 1-1 WordPredictor Gap Closure Summary

Closed UAT gaps G-03-4 (invented non-word `bodil` + untranslated English content words `bedtime`/`level`/`superhero`) and G-03-6 (the 1-1 WordPredictor justified a Malay answer in English and kept an English `aiThinking`) with bounded, locale-scoped `ms` MDX edits plus a committed persistent Node guard.

## What Was Built

### Task 1 — Vocabulary normalization + persistent guard
Replaced the invented non-word `bodil` with the user-decided `lawak` at its three sites, and normalized three untranslated English content words to the Malay variants already used elsewhere in the `ms` corpus:

- `bodil → lawak`: `2-4:82` (MagicWords answer), `3-2:56` (`good` prop), `3-2:58` (`explanation` prop)
- `bedtime → sebelum tidur`: `1-3:47` (`"cerita bedtime pendek"` → `"cerita pendek sebelum tidur"`)
- `level/LEVEL → tahap/TAHAP`: `3-4:3`, `4-4:3`, `5-4:3` (`LEVEL TERAKHIR` → `TAHAP TERAKHIR`), `5-4:85` (`SEMUA level!` → `SEMUA tahap!`)
- `superhero → adiwira`: `4-1:66`, `5-2:90` (`tema superhero` → `tema adiwira`), `5-4:30` (both occurrences: `jurulatih adiwira` + `nama adiwira unik`), `5-4:31`, `5-4:32`

Created `scripts/check-ms-vocabulary.js` — a Node stdlib guard mirroring `check-translations.js`/`lint-mdx.js` conventions. It enumerates every tracked `src/content/kids/ms/**/*.mdx` (via `git ls-files` with a recursive-walk fallback, failing loudly on an empty set) and exits non-zero when a case-insensitive word-boundary match for `bodil`/`bedtime`/`superhero`/`level` is present, when an English-residual marker (`bahasa inggeris` / `The cat sat` / `on the mat`) is present, or when the 1-1 `aiThinking` does not quote the Malay puzzle sentence.

### Task 2 — 1-1 WordPredictor Malay re-grounding
Edited only lines 30-31 of `1-1-meet-promi.mdx`:

- `explanation` (line 30) now justifies the answer `tikar` via the everyday Malay collocation (`kita memang selalu duduk di atas tikar`), removing the `bunyi yang terkenal dalam bahasa Inggeris` reference.
- `aiThinking` (line 31) now quotes the very sentence the child solves (`Kucing itu duduk di atas tikar`), matching line 27's `sentence` subject.

## Verification

| Gate | Result |
|------|--------|
| `node scripts/check-ms-vocabulary.js` (post-edit) | exit 0 — scanned 19 files, all four check classes clean |
| `scripts/check-ms-vocabulary.js` on pre-edit HEAD tree | exit 1 — 16 offenders across 8 files (self-failing gate proven) |
| `bodil`/`bedtime`/`superhero` (case-insensitive, word-boundary) under `src/content/kids/ms/` | 0 |
| `level` token (any case, word-boundary) under `src/content/kids/ms/` | 0 |
| `bahasa inggeris` / `The cat sat` / `on the mat` under `src/content/kids/ms/` | 0 |
| `messages/ms.json` leaf keys | 212 (unmodified, not in `git diff`) |
| G-03-5 regression guard | prints `world names still consistent` |
| `node scripts/check-translations.js` | `✅ All translation files are complete!` |
| `npx tsc --noEmit` | 0 errors |
| `npm run lint` | 0 errors (43 pre-existing warnings) |
| `npm run test` | 94/94 passed (5 files) |

**Pre-edit HEAD probe (proof the guard is a genuine gate):** running the same rule set against `git archive HEAD src/content/kids/ms` surfaced 16 offenders — `bodil` ×3, `bedtime` ×1, `superhero` ×5, `level/LEVEL` ×4, and the 1-1 `bahasa inggeris`/`The cat sat`/`on the mat` ×3 — and exited 1.

## Deviations from Plan

None - plan executed exactly as written. Both tasks applied at the exact enumerated file:line sites; every surrounding quotation mark, brace, bracket, hash, emoji, and the rest of each string preserved byte-identical.

## Scope Confirmation

- `git diff --name-only` lists only the nine `ms` MDX files from `files_modified` plus the added `scripts/check-ms-vocabulary.js`.
- `messages/ms.json` is unmodified (212 keys intact).
- `src/content/kids/en/**` and every non-`ms` locale are byte-identical to HEAD.
- Deskoped `master` prose (`5-1:50`, `5-4:29`, `5-4:32`'s `Prompt master…`, `5-4:57`) and the seven `5-1` standalone `Master` headings were NOT touched.
- Pre-existing unrelated changes (`.env.example`, `.planning/config.json`, `.planning/THEMES_LIST.md`, `.planning/state.json`, `sample_themes/`) were left untouched and not staged.

## Commits

- `c325df12`: `fix(03-06): replace non-word 'bodil' and normalize untranslated English words in ms corpus`
- `d67b34cc`: `fix(03-06): re-localize 1-1 WordPredictor explanation and aiThinking to consistent Malay`

## Self-Check

- `scripts/check-ms-vocabulary.js` exists and is executable via `node`: PASSED
- `src/content/kids/ms/1-1-meet-promi.mdx:30,31` re-grounded: PASSED
- Commit `c325df12` is ancestor of HEAD: PASSED
- Commit `d67b34cc` is ancestor of HEAD: PASSED