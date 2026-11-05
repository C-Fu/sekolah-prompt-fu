---
phase: 03-bahasa-melayu-ms-localization
verified: 2026-11-05T13:10:00Z
status: human_needed
score: 14/14 must-haves verified
covered_files:
  - .planning/phases/03-bahasa-melayu-ms-localization/03-01-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-01-SUMMARY.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-02-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-02-SUMMARY.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-03-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-03-SUMMARY.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-04-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-04-SUMMARY.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-05-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-05-SUMMARY.md
  - messages/ms.json
  - prompts.config.ts
  - src/__tests__/kids/level-locale.test.tsx
  - src/__tests__/kids/settings-locale.test.tsx
  - src/components/kids/layout/settings-modal.tsx
  - src/content/kids/ms/1-1-meet-promi.mdx
  - src/content/kids/ms/1-2-first-words.mdx
  - src/content/kids/ms/1-3-being-clear.mdx
  - src/content/kids/ms/2-1-missing-details.mdx
  - src/content/kids/ms/2-2-who-and-what.mdx
  - src/content/kids/ms/2-3-when-and-where.mdx
  - src/content/kids/ms/2-4-detail-detective.mdx
  - src/content/kids/ms/3-1-setting-the-scene.mdx
  - src/content/kids/ms/3-2-show-dont-tell.mdx
  - src/content/kids/ms/3-3-format-finder.mdx
  - src/content/kids/ms/3-4-context-champion.mdx
  - src/content/kids/ms/4-1-pretend-time.mdx
  - src/content/kids/ms/4-2-story-starters.mdx
  - src/content/kids/ms/4-3-character-creator.mdx
  - src/content/kids/ms/4-4-world-builder.mdx
  - src/content/kids/ms/5-1-perfect-prompt.mdx
  - src/content/kids/ms/5-2-fix-it-up.mdx
  - src/content/kids/ms/5-3-prompt-remix.mdx
  - src/content/kids/ms/5-4-graduation-day.mdx
  - src/lib/i18n/client.ts
  - src/lib/i18n/config.ts
  - src/lib/kids/level-content.ts
covered_digest: "v4:sha256:6045873560ae59dfb96e3f4b7388d20ca185a0839c309cbb838d139a9ab2d31d"
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 9/9
  gaps_closed:
    - "G-03-5: World 4 reads exactly 'Gaung Penciptaan' in all six locations (ms.json:117 + 4-1:3, 4-2:3, 4-4:3/77/83)."
    - "G-03-5: World 5 reads exactly 'Gunung Pakar' in the bundle and 5-1:3; the English word 'Master' is gone from the World 5 name."
    - "G-03-5: Zero 'Ngarai' and zero 'Gunung Master' across src/content/kids/ms/** and messages/ms.json."
  gaps_remaining: []
  regressions: []
advisory:
  - finding: "WR-02 — the non-word 'bodil' remains for 'silly' in 2-4-detail-detective.mdx:82 (a user-selectable MagicWords answer), 3-2-show-dont-tell.mdx:56 and 3-2:58."
    category: other
    reason: "Content-quality defect confirmed present; replacing it requires a native-speaker wording decision not mechanically derivable. Does not break a structural must-have; routed to human verification."
    evidence_status: "present in code (grep confirmed), no failing test"
  - finding: "WR-03 — ms/1-1-meet-promi.mdx:30-31 explains a Malay puzzle as famous 'dalam bahasa Inggeris' and keeps aiThinking=\"... 'The cat sat on the mat' ...\" in English."
    category: other
    reason: "Pedagogical/incoherence content defect confirmed present; re-authoring is a content judgment. Does not break a structural must-have; routed to human verification."
    evidence_status: "present in code (grep confirmed), no failing test"
  - finding: "WR-04 — settings-modal.tsx hard-codes a third locale list that drifts from supportedLocales (missing 'he')."
    category: architectural
    reason: "Standing maintainability/drift risk, pre-existing and explicitly out of scope per D-02. Does not break a must-have."
    evidence_status: "present in code, no failing test"
human_verification:
  - test: "Read messages/ms.json end-to-end and judge linguistic naturalness, kid-appropriate register (ages 8-14), and terminology consistency (per D-01)."
    expected: "Natural Malaysian Bahasa Melayu, no machine-translation artifacts, consistent terminology; loanword 'prompt' retained by design."
    why_human: "Machine checks prove 212-key parity, zero empty values and zero values identical to en.json — they do not prove translation quality. The phase plans explicitly designated this a Manual-Only / human_judgment item (03-VALIDATION.md)."
  - test: "Read all 19 src/content/kids/ms/*.mdx levels and judge prose + interactive-prop translation quality and kid-appropriateness."
    expected: "Every Panel body, heading, and interactive prop value is natural Malay and pedagogically coherent for a child."
    why_human: "Structural parity (Section count, tag sequence, LevelComplete slug) is machine-verified; naturalness and pedagogy are not. Plans marked quality human_judgment: true."
  - test: "WR-02: replace the non-word 'bodil' ('silly') in 2-4-detail-detective.mdx:82 (offered to the child as a selectable MagicWords answer), 3-2-show-dont-tell.mdx:56 and :58."
    expected: "'bodil' replaced with an age-appropriate Malay word (e.g. jenaka/kelakar/main-main) in all three places."
    why_human: "Requires a native-speaker wording decision; the correct replacement is not mechanically derivable."
  - test: "WR-03: re-localise the 1-1 WordPredictor explanation/aiThinking (1-1-meet-promi.mdx:30-31) so the feedback no longer justifies a Malay puzzle 'in English' and the leftover English aiThinking string is removed."
    expected: "The puzzle premise, explanation and aiThinking are internally consistent in Malay."
    why_human: "Pedagogical re-authoring; correctness of the puzzle premise is a content judgement."
---

# Phase 3: Bahasa Melayu (`ms`) Localization — Verification Report

**Phase Goal:** Bahasa Melayu (`ms`) is a fully selectable locale backed by a complete UI message bundle and 19 localized interactive MDX levels, with no silent English fallback.
**Verified:** 2026-11-05T13:10:00Z
**Status:** human_needed
**Re-verification:** Yes — after gap-closure plan 03-05 (closed UAT gap G-03-5)

## Goal Achievement

I verified the goal backward from the live codebase, not from SUMMARY.md claims, and independently re-ran every phase gate. Every must-have resolves to VERIFIED, including the five must-haves declared by the gap-closure plan 03-05. The phase goal (selectable `ms`, complete bundle, 19 localized levels, no silent English fallback) is achieved in code.

The status remains `human_needed` — not `passed` — for two independent reasons, both intrinsic to this phase rather than plumbing failures:

1. The phase's own plans designate translation *quality* (not just key parity / structural correctness) as a `human_judgment: true` / Manual-Only item (03-VALIDATION.md). Machine checks cannot certify linguistic naturalness or kid-appropriate register.
2. Two concrete, user-visible content defects from the code review remain `open` (WR-02 non-word "bodil" offered as a selectable answer; WR-03 incoherent 1-1 puzzle). These are content-quality items requiring a human wording decision; they do not fail a structural must-have but should not be silently absorbed into `passed`.

**G-03-5 is CLOSED** (re-verified independently): World 4 = `Gaung Penciptaan` in all six locations; World 5 = `Gunung Pakar` in the bundle and 5-1:3; zero `Ngarai` and zero `Gunung Master` across the `ms` corpus.

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `ms` is present in all five locale registries | ✓ VERIFIED | `src/lib/i18n/config.ts:5` (`supportedLocales` ends `...,"az","ms"`); `prompts.config.ts:38`; `src/lib/i18n/client.ts:46` literal `ms: () => import("@/../messages/ms.json")`; `src/lib/kids/level-content.ts:695-715` (`ms:` map, 19 keys) + 19 `L_ms__*` literal import defs; `settings-modal.tsx:15` `{ code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }`. |
| 2 | `messages/ms.json` has identical 212-leaf-key shape to `en.json` | ✓ VERIFIED | Independently re-ran the flatten-and-compare: `PARITY OK: en=212 ms=212 leaf keys`. 0 empty values; 0 values identical to en (all 212 translated). |
| 3 | `loadMessages('ms')` returns the ms bundle, not the en fallback | ✓ VERIFIED | `level-locale.test.tsx:111-117` "loads a bounded ms message bundle" green; literal loader present; ms strings (`"Selamat datang"`) compiled into `out/_next/static/chunks/*.js`. |
| 4 | `loadLevelContent('ms', slug)` → `effectiveLocale === 'ms'` with a Component distinct from en, for **all 19** slugs | ✓ VERIFIED | `level-locale.test.tsx:97-109` "resolves effectiveLocale 'ms' for every one of the 19 registered slugs" green (independently re-run). 19 files exist; each ends in one `<LevelComplete>` whose slug equals its filename. |
| 5 | No silent English fallback anywhere in `ms` | ✓ VERIFIED | `level-content.ts:744-754` falls back only when the locale module is *absent*; all 19 `ms` modules are present; the corpus test asserts per-slug `effectiveLocale==='ms'` **and** `Component!==en.Component`. |
| 6 | `ms` is selectable in Settings and switches UI + compiled MDX together, persisting to localStorage | ✓ VERIFIED | `settings-locale.test.tsx:170-201` green — asserts ms-authored heading `/Tetapan/` renders, en `/Settings/` gone, and `localStorage[LOCALE_PREFERENCE_KEY]==='ms'`. |
| 7 | Each `ms` level ends in `<LevelComplete levelSlug="<real slug>">` so the map link renders | ✓ VERIFIED | Script check: all 19 `levelSlug` values equal their filename. |
| 8 | Static export (`npm run build`) compiles all 19 `ms` MDX and emits every level route | ✓ VERIFIED | Fresh `rm -rf out && npm run build` → exit 0; `out/level/` = 19 dirs; ms content (`Gaung Penciptaan`) and ms UI (`Selamat datang`) compiled into `out/_next/static/chunks/*.js`. |
| 9 | Quality gates: `tsc`, `lint`, full test suite green | ✓ VERIFIED | Independently re-run: `npx tsc --noEmit` → 0; `npm run lint -- --quiet` → 0; `npm test` → **94/94** passed. |
| 10 | [G-03-5] World 4 reads exactly `Gaung Penciptaan` in the bundle and all five lesson-body occurrences | ✓ VERIFIED | `ms.json:117`; `4-1-pretend-time.mdx:3`; `4-2-story-starters.mdx:3`; `4-4-world-builder.mdx:3`, `:77`, `:83` — all six grep-confirmed. |
| 11 | [G-03-5] World 5 reads exactly `Gunung Pakar` in the bundle and the 5-1 lesson body; no English `Master` inside the World 5 name | ✓ VERIFIED | `ms.json:120` `"title": "Gunung Pakar"`; `5-1-perfect-prompt.mdx:3` `**Gunung Pakar**`. |
| 12 | [G-03-5] Zero occurrences of `Ngarai` anywhere under `src/content/kids/ms/` and `messages/ms.json` | ✓ VERIFIED | `grep -rn "Ngarai"` → exit 1 (no match). |
| 13 | [G-03-5] Zero occurrences of the World-name phrase `Gunung Master` anywhere under `src/content/kids/ms/` and `messages/ms.json` | ✓ VERIFIED | `grep -rn "Gunung Master"` → exit 1 (no match). The seven out-of-scope `Master` headings/sentences on 5-1 lines 8/43/55/67/79/91/96 remain (legitimate Malay content, not World names). |
| 14 | [G-03-5] `messages/ms.json` still has exactly 212 leaf keys (value edit, not key change) | ✓ VERIFIED | Node leaf-count → 212; en → 212; parity assert → `PARITY OK`. |

**Score:** 14/14 truths verified (0 present-but-behavior-unverified)

### Deferred Items

None. (Phase 4 covers full-build certification/polish, but no Phase-3 goal item is deferred to it.)

### Advisory (New Scope, Unevidenced)

New-scope findings from Step 7 with no deterministic evidence (no failing test, no reproducible defect command) — reported, not blocking, do not revert any completed must-have. These are the code-review items that remain open; none rises to a must-have failure.

| # | Finding | Category | Why Advisory |
|---|---------|----------|--------------|
| 1 | WR-02 — `bodil` non-word for "silly" in 2-4:82 (selectable answer), 3-2:56, 3-2:58 | other | New-scope content-quality finding, no deterministic evidence; requires a human wording decision (routed to Human Verification). |
| 2 | WR-03 — 1-1 WordPredictor explanation/aiThinking retains English (`"The cat sat on the mat"`, "dalam bahasa Inggeris") after the Malay relabel | other | New-scope pedagogical finding, no deterministic evidence; requires human re-authoring (routed to Human Verification). |
| 3 | WR-04 — settings-modal.tsx third hard-coded locale list drifts from `supportedLocales` (`he` absent) | architectural | Pre-existing, explicitly out-of-scope per D-02; no failing test. |
| 4 | IN-01 — settings `ms` test proves the compiled-MDX switch only via Section count (which equals en) | other | Test-strength observation; the module-identity guard exists in `level-locale.test.tsx:97-109`, so coverage is adequate. |
| 5 | IN-03 — `prompts.config.ts` / `config.ts` locale arrays are unenforced duplicates | architectural | Standing drift risk; no failing test. |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `messages/ms.json` | Complete translated 212-key clone of en.json | ✓ VERIFIED | 212 leaf keys, exact key-set match, 0 empty, 0 identical-to-en. |
| `src/content/kids/ms/*.mdx` (×19) | 19 localized levels mirroring en structure | ✓ VERIFIED | 19 files present; each ends in one `LevelComplete` whose slug matches the filename. |
| `src/lib/i18n/config.ts` | `"ms"` in `supportedLocales` | ✓ VERIFIED | Present (ends `...,"az","ms"`); `rtlLocales` untouched (ms is LTR). |
| `prompts.config.ts` | `"ms"` in `i18n.locales` | ✓ VERIFIED | Present, mirrors config.ts. |
| `src/lib/i18n/client.ts` | literal `ms` messageLoader | ✓ VERIFIED | `ms: () => import("@/../messages/ms.json")` — literal, no interpolation. |
| `src/lib/kids/level-content.ts` | 19 `L_ms__*` defs + 19-key `ms` map entry | ✓ VERIFIED | 19 literal import defs + 19 map keys; fallback logic untouched. |
| `src/components/kids/layout/settings-modal.tsx` | `ms` in `SUPPORTED_LOCALES` | ✓ VERIFIED | `{ code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }`; no `he` button (D-02 honored). |
| Tests (`level-locale`, `settings-locale`) | ms selection/bundle/button/all-19 cases | ✓ VERIFIED | Present and green (45 tests across the two files; 94/94 full suite). |
| `messages/ms.json` (03-05) | `kids.worlds[4].title='Gaung Penciptaan'`, `[5].title='Gunung Pakar'` | ✓ VERIFIED | Confirmed. |
| `ms/4-*` + `5-1` (03-05) | World names reconciled | ✓ VERIFIED | All six World-4 locations + 5-1 World-5 location confirmed; zero `Ngarai`/`Gunung Master`. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| settings-modal ms button | persisted locale | `handleLanguageChange` → `Providers.setUserLocale` → `transitionLocale` → `isSupportedLocale` → `writePersistedLocale` | ✓ WIRED | Test asserts `localStorage === "ms"`. |
| Providers locale switch | `messages/ms.json` | `loadMessages('ms')` → `messageLoaders['ms']` | ✓ WIRED | Literal loader; bundle-difference test green. |
| LevelContentWrapper locale effect | compiled `src/content/kids/ms/<slug>.mdx` | `loadLevelContent('ms', slug)` → `loaders['ms'][slug]` | ✓ WIRED | 19-key map; corpus test green per slug. |
| `messages/ms.json` kids.worlds[4/5].title (03-05) | lesson 4-1/4-2/4-4/5-1 prose | reconciliation to single value per world | ✓ WIRED | All six World-4 + the World-5 occurrence read the same strings as the bundle. |
| Every `ms` import path | static literal | `import("@/…")` — never locale-interpolated | ✓ WIRED | Grep for template-literal imports in both maps → none. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `messages/ms.json` | message bundle | static bundled JSON (no fetch) | Yes — ms strings (`"Selamat datang"`) found in `out/_next/static/chunks/*.js` | ✓ FLOWING |
| `src/content/kids/ms/*.mdx` | compiled MDX Component | static `import()` per slug | Yes — ms MDX content (`"Gaung Penciptaan"`) found in build chunks; corpus test resolves 19/19 to `ms` | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| ms/en key parity (self-failing assert) | `node -e "…flatten…throw…"` | `PARITY OK: en=212 ms=212 leaf keys` | ✓ PASS |
| ms selection + all-19 resolution + settings switch | `npm test` | 94/94 passed (incl. `level-locale`, `settings-locale`) | ✓ PASS |
| Type check | `npx tsc --noEmit` | exit 0 | ✓ PASS |
| Lint | `npm run lint -- --quiet` | exit 0 | ✓ PASS |
| Static build + 19 routes | `rm -rf out && npm run build` | exit 0; `out/level/` = 19 dirs; ms content in chunks | ✓ PASS |
| G-03-5 consistency gate | `grep -rn "Ngarai\|Gunung Master" src/content/kids/ms/ messages/ms.json` | no matches (exit 1) | ✓ PASS |
| Registered commits exist | `git cat-file -t ea91df68 5ed42193` | both `commit` | ✓ PASS |

### Probe Execution

Not applicable — no probe scripts declared for this phase; the parity assert, the corpus-wide `level-locale` test, and the phase gates above are the phase's enforcement.

### Decision Coverage

Decision coverage: not evaluated (no CONTEXT.md in this phase — the gate skipped cleanly, `total: 0`, `honored: 0`).

### Test Quality Audit

| Test File | Linked Req | Active | Skipped | Circular | Assertion Level | Verdict |
|-----------|-----------|--------|---------|----------|-----------------|---------|
| `src/__tests__/kids/level-locale.test.tsx` | FR-3 | all | 0 | none | Behavioral (per-slug loop, module identity) | ✓ SUFFICIENT |
| `src/__tests__/kids/settings-locale.test.tsx` | FR-3 | all | 0 | none | Behavioral (bundle switch + localStorage persistence) | ✓ SUFFICIENT (IN-01: MDX-switch arm is weaker — section count — but module identity is covered by `level-locale`) |

**Disabled tests on requirements:** 0. **Circular patterns detected:** 0. **Insufficient assertions:** 0 BLOCKERs.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FR-3 | 03-01, 03-02, 03-03, 03-04, 03-05 | Add `ms` to the language selector; translate all UI strings in `messages/ms.json`; localize all MDX levels under `src/content/kids/ms/` | ✓ SATISFIED (with human-verification items) | `ms` selector present + activation test green; `messages/ms.json` 212-key parity, 0 empty/0 identical-to-en; 19 `ms` MDX files registered and resolving to `ms`; world-name consistency closed. |
| NFR-2 (partial, Phase 3 share) | 03-04 | tsc 0, lint 0, tests green, static build emits `out/` | ✓ SATISFIED | tsc 0, lint 0, tests 94/94, `npm run build` exit 0 with 19 routes (all independently re-run). |

**Note:** REQUIREMENTS.md FR-3 prose says "17 MDX levels" while the live registry has 19 slugs; ROADMAP.md explicitly flags this as stale ("19 registered slugs; requirements prose '17' is stale"). The 19-slug corpus is the authoritative scope and is fully localized. No orphaned requirements: FR-3 is the only requirement mapped to Phase 3 and it is claimed by all five plans.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/content/kids/ms/2-4-detail-detective.mdx` | 82 | `"bodil"` (non-word) offered as a selectable MagicWords answer | ⚠️ Warning | User-visible, potentially confusing content in a learning game (WR-02, disposition open) — routed to human verification. |
| `src/content/kids/ms/3-2-show-dont-tell.mdx` | 56, 58 | `"bodil"` in the correct prompt and explanation | ⚠️ Warning | Same as above (WR-02). |
| `src/content/kids/ms/1-1-meet-promi.mdx` | 30-31 | English idiom leftovers (`'The cat sat on the mat'`) and explanation cites "dalam bahasa Inggeris" after the Malay relabel | ⚠️ Warning | Pedagogically incoherent puzzle (WR-03) — routed to human verification. |
| `src/components/kids/layout/settings-modal.tsx` | 13-31 | Third hard-coded locale list; drifts from `supportedLocales` (missing `he`) | ⚠️ Warning | Standing maintainability/drift risk (WR-04). Pre-existing; `he` drift explicitly out of scope per D-02. |

No debt markers (`TBD`/`FIXME`/`XXX`) in any phase-modified file. No stub/empty-implementation patterns introduced. WR-01 (world-name mismatch) is **resolved** by 03-05; the remaining Warnings are content-quality/maintainability items the code review recorded `open` and the plans flagged `human_judgment: true`.

### Human Verification Required

1. **Translation quality — `messages/ms.json`**
   - **Test:** Read the whole bundle; judge naturalness, kid-appropriate register (8-14), terminology consistency (D-01).
   - **Expected:** Natural Malaysian Malay; no machine-translation artifacts.
   - **Why human:** Key parity is machine-proven; quality is not. Plans marked this Manual-Only.

2. **Translation quality — 19 `ms` MDX levels**
   - **Test:** Read every level's prose and interactive props; judge naturalness and pedagogy.
   - **Expected:** Natural, coherent, kid-appropriate Malay throughout.
   - **Why human:** Structural parity is machine-verified; quality is not.

3. **WR-02 — replace the non-word `bodil`** in 2-4:82 (selectable answer), 3-2:56, 3-2:58.
4. **WR-03 — re-localise the 1-1 WordPredictor explanation/aiThinking** (1-1-meet-promi.mdx:30-31) so it no longer justifies a Malay puzzle "in English".

### Gaps Summary

No must-have truth failed. All fourteen observable truths (nine from the original plans plus the five declared by gap-closure plan 03-05) are VERIFIED against the live codebase. I independently re-ran the 212-key parity assert, `tsc` (0), `lint` (0), the full 94-test suite, and a clean static build (19 level routes with `ms` content in the chunks), plus the G-03-5 consistency scan.

**UAT gap G-03-5 is closed:** World 4 = `Gaung Penciptaan` in all six locations, World 5 = `Gunung Pakar` in the bundle and 5-1, with zero `Ngarai` and zero `Gunung Master` anywhere in the `ms` corpus.

The status is `human_needed`, not `passed`, because the phase explicitly routed translation *quality* to human review (every plan marks it `human_judgment: true`) and two concrete, user-visible content defects remain open (WR-02 offers a non-word to a child as a selectable answer; WR-03 presents an incoherent puzzle). These are content-quality items the developer must adjudicate — not plumbing failures — but they should not be silently absorbed into `passed`.

---

_Verified: 2026-11-05T13:10:00Z_
_Verifier: the agent (gsd-verifier)_