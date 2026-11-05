---
phase: 03-bahasa-melayu-ms-localization
reviewed: 2026-11-05T00:00:00Z
depth: standard
files_reviewed: 13
files_reviewed_list:
  - scripts/check-ms-vocabulary.js
  - src/content/kids/ms/1-1-meet-promi.mdx
  - src/content/kids/ms/1-3-being-clear.mdx
  - src/content/kids/ms/2-4-detail-detective.mdx
  - src/content/kids/ms/3-2-show-dont-tell.mdx
  - src/content/kids/ms/3-4-context-champion.mdx
  - src/content/kids/ms/4-1-pretend-time.mdx
  - src/content/kids/ms/4-2-story-starters.mdx
  - src/content/kids/ms/4-4-world-builder.mdx
  - src/content/kids/ms/5-1-perfect-prompt.mdx
  - src/content/kids/ms/5-2-fix-it-up.mdx
  - src/content/kids/ms/5-4-graduation-day.mdx
  - messages/ms.json
findings:
  critical: 2
  warning: 2
  info: 2
  total: 6
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-11-05
**Depth:** standard
**Files Reviewed:** 13
**Status:** issues_found

## Summary

This review covers the phase-03 `ms` (Bahasa Melayu) gap-closure edits (plans 03-05 and 03-06): the new persistent guard `scripts/check-ms-vocabulary.js`, eleven `ms` MDX content files, and `messages/ms.json`. The MDX content edits themselves are **coherent and correct** — `bodil`→`lawak`, `bedtime`→`sebelum tidur`, `level`→`tahap`, `superhero`→`adiwira` are all applied cleanly across the corpus, the 1-1 WordPredictor `explanation`/`aiThinking` are re-localized to Malay, and the World 4 name is consistent (`Gaung Penciptaan`) between the MDX and `messages/ms.json`.

The defects are concentrated in the **guard script**, which is the phase's core deliverable. Two of its four check classes have correctness holes that let the exact regression the phase was written to prevent slip through undetected, and the guard is never invoked by any CI job or npm script, so it cannot actually "prevent recurrence". Each hole was reproduced against the real repository tree / a faithful fixture.

Note on `messages/ms.json`: the review brief stated it "should be unmodified (212 leaf keys)". The diff shows **one value edit** (`"Ngarai Penciptaan"` → `"Gaung Penciptaan"`, line 117). Leaf-key count is still exactly 212 (verified), so the structural contract holds and the edit is consistent with the plan's deliberate 03-05 World-4 name reconciliation. It is flagged in Info for the orchestrator's awareness, not as a defect.

## Critical Issues

### CR-01: Guard silently skips untracked `ms` MDX files (git-path enumeration is incomplete)

**File:** `scripts/check-ms-vocabulary.js:35-62` (and the empty-set guard at `:66-71`)
**Issue:** `listMsFiles()` prefers `git ls-files src/content/kids/ms`, which enumerates **only tracked files**. When git succeeds and returns a non-empty list, the recursive-walk fallback is never used, so any `ms` MDX file that exists on disk but is not yet committed is **silently excluded** from the scan — even as the guard prints its ✅ success lines and exits 0.

This is not hypothetical: it is *precisely* the workflow during localization. A contributor (or an agent) adds/edits a new `ms` level, runs `node scripts/check-ms-vocabulary.js` to self-check, sees green, and only then commits. A violation in the new (untracked) file is invisible. The "no files found → exit 1" safeguard at lines 66-71 only fires when the *entire* tracked set is empty, not when the tracked set is a strict subset of the on-disk set.

Reproduced:
```
# git repo, one tracked clean file + one UNTRACKED violating file
$ node scripts/check-ms-vocabulary.js   # → only inspects the tracked file
✅ ms vocabulary guard: scanned 1 file(s)   ... EXIT 0
# untracked 9-9-untracked.mdx containing "bodil" was never scanned
```

**Fix:** Union the git result with an on-disk walk so untracked-but-present files are always covered, e.g.:
```js
function listMsFiles() {
  const seen = new Set();
  const add = (abs) => seen.add(path.resolve(abs));
  // 1. tracked (authoritative for committed content)
  try {
    const out = execSync("git ls-files src/content/kids/ms", {
      cwd: path.join(__dirname, ".."),
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    });
    out.split("\n").map((f) => f.trim()).filter((f) => f.endsWith(".mdx"))
      .forEach((f) => add(path.join(__dirname, "..", f)));
  } catch { /* no git — fall through to walk */ }
  // 2. on-disk (covers untracked/new files); walk is the single source for the dir
  if (fs.existsSync(MS_DIR)) {
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (e.name.endsWith(".mdx")) add(full);
      }
    };
    walk(MS_DIR);
  }
  return [...seen];
}
```
(Alternatively scan the directory always and use git only as a fallback — the directory is the source of truth for "what exists right now".)

### CR-02: 1-1 `aiThinking` check is a whole-file substring search, not scoped to the `aiThinking` prop

**File:** `scripts/check-ms-vocabulary.js:113-121`
**Issue:** The consistency check asserts `text.includes(PUZZLE_QUOTE)` over the **entire file**, then reports "`[1-1 aiThinking] does not quote the Malay puzzle sentence"`. It never verifies the sentence actually appears inside the `aiThinking` attribute. If the puzzle sentence is present anywhere else in `1-1-meet-promi.mdx` (e.g. the `sentence=` prop, the `explanation=` prop, a comment), the guard passes even when `aiThinking` is a fully English sentence — i.e. the exact G-03-6 defect class the guard claims to close. The success line at `:134` then makes a false assertion ("✔ 1-1 aiThinking quotes the Malay puzzle sentence") about a prop it never inspected.

Reproduced:
```
# 1-1 file:
#   sentence="Kucing itu duduk di atas tikar"
#   aiThinking="English sentence only"
$ node scripts/check-ms-vocabulary.js
✅ ... ✔ 1-1 aiThinking quotes the Malay puzzle sentence "Kucing itu duduk di atas tikar"   EXIT 0
```

**Fix:** Extract the `aiThinking` attribute value and test it specifically:
```js
if (fs.existsSync(ONE_ONE)) {
  const text = fs.readFileSync(ONE_ONE, "utf8");
  const rel = path.relative(path.join(__dirname, ".."), ONE_ONE);
  const m = text.match(/aiThinking\s*=\s*"([^"]*)"/);
  if (!m) {
    offenders.push(`${rel}  [1-1 aiThinking]  no aiThinking attribute found`);
  } else if (!m[1].includes(PUZZLE_QUOTE)) {
    offenders.push(
      `${rel}  [1-1 aiThinking]  aiThinking does not quote the Malay puzzle sentence "${PUZZLE_QUOTE}"`
    );
  }
}
```
(If the prop may span lines or use `{...}`, use a small JSON5/template-aware extraction — but the current files use a plain double-quoted attribute, so the regex above is sufficient and strictly stronger than the current check.)

## Warnings

### WR-01: `The cat sat` residual rule is case-sensitive, contradicting its documented case-insensitive contract

**File:** `scripts/check-ms-vocabulary.js:86-90` (rule `/The cat sat/u`), doc at `:16`, success line at `:133`
**Issue:** The comment at line 85 says the residual markers are matched "case-insensitive", and the console output at line 133 advertises "no English-residual markers (bahasa inggeris / The cat sat / on the mat)". But the `The cat sat` regex has only the `u` flag — **no `i` flag** — unlike its two siblings (`/bahasa inggeris/i` and `/on the mat/i`). Consequently `The Cat Sat`, `THE CAT SAT`, and `the cat sat` all slip through.

Reproduced (all four variants in one file, guard exits 0):
```
The Cat Sat
THE CAT SAT
the cat sat        → ✅ ... EXIT 0
```

**Fix:** Add the `i` flag (the `u` flag is unnecessary here):
```js
{ name: "'The cat sat'", re: /The cat sat/i },
```
Also reconcile the doc comment to match (or explicitly document the intended sensitivity). A guard that reports success for a class it does not actually cover is worse than one that omits the class.

### WR-02: The "persistent guard" is not invoked by any CI job or npm script

**File:** `scripts/check-ms-vocabulary.js` (not referenced); `.github/workflows/ci.yml:28-32`; `package.json:5-17`
**Issue:** The plan's stated purpose (`03-06-PLAN.md`, `<done>`) is that the committed guard means the `bodil`/`bedtime`/`level`/`superhero` and 1-1-English-residual classes "cannot silently recur". However, the script is referenced by no `package.json` script, no CI workflow, and no Makefile — `grep -rn "check-ms-vocabulary"` finds only the plan/summary documents. CI runs `npm run lint` (which, per `eslint.config.mjs:16`, globally ignores `scripts/**`) and `npm test`, neither of which touches this guard. A guard that must be run by hand provides no recurrence protection; it documents intent but does not enforce it.

**Fix:** Wire it into the pipeline, e.g. add to `package.json`:
```json
"lint:ms": "node scripts/check-ms-vocabulary.js",
```
and invoke it from `.github/workflows/ci.yml` (e.g. `run: npm run lint:ms` after the linter step). Note: because of CR-01, CI checkout has all files tracked, so a directory-walking scan (or the union fix) is what makes the CI run meaningful.

## Info

### IN-01: `messages/ms.json` was modified despite the "unmodified" contract

**File:** `messages/ms.json:117`
**Issue:** The review brief stated `messages/ms.json` should be unmodified with 212 leaf keys. It has a one-line value change: `"Ngarai Penciptaan"` → `"Gaung Penciptaan"`. This is consistent with the 03-05 World-4 name reconciliation and the MDX corpus (all `ms` MDX now read `Gaung Penciptaan`), and the leaf-key count is still exactly 212 (verified by flattening), so the parity gate is unaffected. Flagged only so downstream consumers expecting a byte-identical `ms.json` are not surprised.
**Fix:** No code change required if the name reconciliation is intended (it appears to be). If a byte-identical `ms.json` was a hard contract, this edit needs explicit sign-off; otherwise update the review contract to permit this value edit.

### IN-02: Redundant `eslint-disable` lead comment

**File:** `scripts/check-ms-vocabulary.js:2`
**Issue:** `/* eslint-disable @typescript-eslint/no-require-imports */` is inert: `eslint.config.mjs:9-17` globally ignores `scripts/**`, so ESLint never processes the file (`npx eslint scripts/check-ms-vocabulary.js` reports "File ignored because of a matching ignore pattern"). The directive neither helps nor hurts; it mirrors `scripts/check-translations.js` but not `scripts/lint-mdx.js`, so the convention is inconsistent across scripts.
**Fix:** Optional — drop the directive (dead code) or keep it for consistency with `check-translations.js`. Low priority; no behavioral impact.

---

_Reviewed: 2026-11-05_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_