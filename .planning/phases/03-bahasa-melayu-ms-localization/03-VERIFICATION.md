---
phase: 03-bahasa-melayu-ms-localization
verified: 2026-11-05T11:30:00Z
status: human_needed
score: 9/9 must-haves verified
covered_files:
  - .planning/phases/03-bahasa-melayu-ms-localization/03-01-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-01-SUMMARY.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-02-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-02-SUMMARY.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-03-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-03-SUMMARY.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-04-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-04-SUMMARY.md
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
covered_digest: "v4:sha256:e960c1b14ed8ab312a34e3ea5c402152697072691da05342fcad17071a662354"
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Read messages/ms.json end-to-end and judge linguistic naturalness, kid-appropriate register (ages 8-14), and terminology consistency (per D-01)."
    expected: "Natural Malaysian Bahasa Melayu, no machine-translation artifacts, consistent terminology; loanword 'prompt' retained by design."
    why_human: "Machine checks prove key parity + structure, not translation quality. The phase plans explicitly designated this a Manual-Only / human_judgment item."
  - test: "Read all 19 src/content/kids/ms/*.mdx levels and judge prose + interactive-prop translation quality and kid-appropriateness."
    expected: "Every Panel body, heading, and interactive prop value is natural Malay and pedagogically coherent for a child."
    why_human: "Structural parity is machine-verified; naturalness and pedagogy are not."
  - test: "Resolve WR-01 (confirmed): World 4/5 display names disagree between the map (ms.json 'Ngarai Penciptaan'/'Gunung Pakar') and the lesson bodies (MDX 'Ngarai Cipta'/'Gunung Master'). Pick one name per world and reconcile."
    expected: "A child sees the same world name on the map and inside every 4-* and 5-* lesson."
    why_human: "Content decision — which of the two names is authoritative is an authoring/product call."
  - test: "Resolve WR-02 (confirmed): the non-word 'bodil' is used for 'silly' in 2-4-detail-detective.mdx:82 (a user-selectable MagicWords answer), 3-2-show-dont-tell.mdx:56 and :58."
    expected: "'bodil' replaced with an age-appropriate Malay word (e.g. jenaka/kelakar/main-main). One occurrence is offered to the child as a selectable answer."
    why_human: "Requires a native-speaker wording decision; the correct replacement is not mechanically derivable."
  - test: "Resolve WR-03 (confirmed): ms/1-1-meet-promi.mdx:27-31 asks the child to complete a Malay sentence ('Kucing itu duduk di atas ___') but the explanation says the answer is famous 'dalam bahasa Inggeris', and aiThinking still reads 'The cat sat on the mat'."
    expected: "Explanation/aiThinking re-localised around a recognizable Malay pattern so the feedback is internally consistent."
    why_human: "Pedagogical re-authoring; correctness of the puzzle premise is a content judgement."
---

# Phase 3: Bahasa Melayu (`ms`) Localization — Verification Report

**Phase Goal:** Bahasa Melayu (`ms`) is a fully selectable locale backed by a complete UI message bundle and 19 localized interactive MDX levels, with no silent English fallback.
**Verified:** 2026-11-05T11:30:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Goal Achievement

I verified the goal backward from the live codebase, not from SUMMARY.md claims. Every must-have resolves to VERIFIED; the phase goal is achieved in code. The remaining status is human_needed because the phase itself designated translation *quality* (not just key parity / structural correctness) as a human-judgment item, and my inspection confirms concrete, user-visible content defects that only a human can adjudicate.

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `ms` is present in all five locale registries | ✓ VERIFIED | `src/lib/i18n/config.ts:5` (`supportedLocales` ends `...,"az","ms"`); `prompts.config.ts:38`; `src/lib/i18n/client.ts:46` literal `ms: () => import("@/../messages/ms.json")`; `src/lib/kids/level-content.ts:695-715` (`ms:` map, 19 keys) + 19 `L_ms__*` literal import defs; `settings-modal.tsx:14` `{ code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }`. |
| 2 | `messages/ms.json` has identical 212-leaf-key shape to `en.json` (no missing/extra) | ✓ VERIFIED | Independently re-ran the flatten-and-compare assert: `PARITY OK: en=212 ms=212 leaf keys`. Top-level namespaces identical (`common,notFound,serverError,kids,seo`). |
| 3 | `loadMessages('ms')` returns the ms bundle, not the en fallback | ✓ VERIFIED | `level-locale.test.tsx` "loads a bounded ms message bundle" green; literal loader present; ms strings compiled into the build bundle (verified `"Selamat datang"` present in `out/_next/static/chunks/…`). |
| 4 | `loadLevelContent('ms', slug)` → `effectiveLocale === 'ms'` with a Component distinct from en, for **all 19** slugs | ✓ VERIFIED | Corpus-wide test "resolves effectiveLocale 'ms' for every one of the 19 registered slugs" green (independently re-run). 19 files exist; section counts match en per slug; each file has exactly one `<LevelComplete>`. |
| 5 | No silent English fallback anywhere in `ms` | ✓ VERIFIED | `level-content.ts:744-750` falls back only when the locale module is *absent*; all 19 `ms` modules are present; the corpus test asserts per-slug `effectiveLocale==='ms'` **and** `Component!==en.Component`. |
| 6 | `ms` is selectable in Settings and switches UI + compiled MDX together, persisting to localStorage | ✓ VERIFIED | `settings-locale.test.tsx` "switches UI messages and compiled MDX together when Bahasa Melayu is selected" green — asserts ms-authored heading `/Tetapan/` renders, en `/Settings/` gone, and `localStorage[LOCALE_PREFERENCE_KEY]==='ms'`. |
| 7 | Each `ms` level ends in `<LevelComplete levelSlug="<real slug>">` so the map link renders | ✓ VERIFIED | Script check: all 19 `levelSlug` values equal their filename/registry slug. |
| 8 | Static export (`npm run build`) compiles all 19 `ms` MDX and emits every level route | ✓ VERIFIED | Fresh `rm -rf out && npm run build` → exit 0; `out/level/` = 19 dirs; ms MDX content (`"Kucing itu duduk"`) and ms messages compiled into `out/_next/static/chunks/*.js`. |
| 9 | Quality gates: `tsc`, `lint`, full test suite green | ✓ VERIFIED | Independently re-run: `npx tsc --noEmit` → 0; `npm run lint -- --quiet` → 0; `npm test` → **94/94** passed. |

**Score:** 9/9 truths verified (0 present-but-behavior-unverified)

### Deferred Items

None. (Phase 4 covers full-build certification/polish, but no Phase-3 goal item is deferred to it.)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `messages/ms.json` | Complete translated 212-key clone of en.json | ✓ VERIFIED | 212 leaf keys, exact key-set match, namespaces identical. |
| `src/content/kids/ms/*.mdx` (×19) | 19 localized levels mirroring en structure | ✓ VERIFIED | 19 files present; section counts match en (10/7/9/8/9/9/9/7/9/8/8/8/8/8/8/9/9/9/8); each ends in one `LevelComplete`; content is Malay prose (spot-checked 2-1, 1-1). |
| `src/lib/i18n/config.ts` | `"ms"` in `supportedLocales` | ✓ VERIFIED | Present; `rtlLocales` untouched (ms is LTR). |
| `prompts.config.ts` | `"ms"` in `i18n.locales` | ✓ VERIFIED | Present, mirrors config.ts. |
| `src/lib/i18n/client.ts` | literal `ms` messageLoader | ✓ VERIFIED | Literal static `import()`; no template interpolation. |
| `src/lib/kids/level-content.ts` | 19 `L_ms__*` defs + 19-key `ms` map entry | ✓ VERIFIED | 19 literal import defs + 19 map keys; fallback logic untouched. |
| `src/components/kids/layout/settings-modal.tsx` | `ms` in `SUPPORTED_LOCALES` | ✓ VERIFIED | `{ code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }`; no `he` button (D-02 honored). |
| Tests (`level-locale`, `settings-locale`) | ms selection/bundle/button/all-19 cases | ✓ VERIFIED | Present and green; all-19 case asserts both locale and component identity. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| settings-modal ms button | persisted locale | `handleLanguageChange` → `Providers.setUserLocale` → `transitionLocale` → `isSupportedLocale` → `writePersistedLocale` | ✓ WIRED | Test asserts `localStorage === "ms"`. |
| Providers locale switch | `messages/ms.json` | `loadMessages('ms')` → `messageLoaders['ms']` | ✓ WIRED | Literal loader; bundle-difference test green. |
| LevelContentWrapper locale effect | compiled `src/content/kids/ms/<slug>.mdx` | `loadLevelContent('ms', slug)` → `loaders['ms'][slug]` | ✓ WIRED | 19-key map; corpus test green per slug. |
| Every `ms` import path | static literal | `import("@/…")` — never locale-interpolated | ✓ WIRED | `grep` for template-literal imports in both maps → none. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `messages/ms.json` | message bundle | static bundled JSON (no fetch) | Yes — ms strings found in `out/_next/static/chunks` | ✓ FLOWING |
| `src/content/kids/ms/*.mdx` | compiled MDX Component | static `import()` per slug | Yes — ms MDX content found in build chunks; corpus test resolves 19/19 to `ms` | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| ms/en key parity (self-failing assert) | `node -e "…flatten…throw…"` | `PARITY OK: en=212 ms=212 leaf keys` | ✓ PASS |
| ms selection + all-19 resolution | `npx vitest run level-locale settings-locale` | 45 passed | ✓ PASS |
| Full suite | `npm test` | 94/94 passed | ✓ PASS |
| Type check | `npx tsc --noEmit` | exit 0 | ✓ PASS |
| Lint | `npm run lint -- --quiet` | exit 0 | ✓ PASS |
| Static build + 19 routes | `rm -rf out && npm run build` | exit 0; 19 level routes; ms content in chunks | ✓ PASS |
| Registered commits exist | `git cat-file -t <hash>` ×9 | all 9 OK | ✓ PASS |

### Probe Execution

Not applicable — no probe scripts declared for this phase; the parity assert and gates above are the phase's enforcement.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FR-3 | 03-01, 03-02, 03-03, 03-04 | Add `ms` to the language selector; translate all UI strings in `messages/ms.json`; localize all MDX levels under `src/content/kids/ms/` | ✓ SATISFIED (with human-verification items) | `ms` selector present + activation test green; `messages/ms.json` 212-key parity; 19 `ms` MDX files registered and resolving to `ms`. |
| NFR-2 (partial, Phase 3 share) | 03-04 | tsc 0, lint 0, tests green, static build emits `out/` | ✓ SATISFIED | tsc 0, lint 0, tests 94/94, `npm run build` exit 0 with 19 routes (all independently re-run). |

**Orphaned requirements:** None. FR-3 is the only requirement mapped to Phase 3 in REQUIREMENTS.md and it is claimed by all four plans.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `src/content/kids/ms/2-4-detail-detective.mdx` | 82 | `"bodil"` (non-word) offered as a selectable answer | ⚠️ Warning | User-visible, potentially confusing content in a learning game (WR-02, disposition open). |
| `src/content/kids/ms/3-2-show-dont-tell.mdx` | 56, 58 | `"bodil"` in the correct prompt and explanation | ⚠️ Warning | Same as above (WR-02). |
| `src/content/kids/ms/1-1-meet-promi.mdx` | 31 | English idiom leftovers (`'The cat sat on the mat'`) after Malay relabel; explanation cites "dalam bahasa Inggeris" | ⚠️ Warning | Pedagogically incoherent puzzle (WR-03). |
| `src/content/kids/ms/4-*`, `5-1` | 3 (and 4-4:77,83) | World names in MDX (`Ngarai Cipta`, `Gunung Master`) disagree with `messages/ms.json` (`Ngarai Penciptaan`, `Gunung Pakar`) | ⚠️ Warning | Map vs. lesson name mismatch; `Gunung Master` leaves an English word untranslated (WR-01/IN-02). |
| `src/components/kids/layout/settings-modal.tsx` | 13-31 | Third hard-coded locale list; drifts from `supportedLocales` (17 vs 18 — `he` missing) | ⚠️ Warning | Standing maintainability/drift risk (WR-04/IN-03). Pre-existing; `he` drift explicitly out of scope per D-02. |

No debt markers (`TBD`/`FIXME`/`XXX`) in any phase-modified file. The four Warnings above are all confirmed present in the code and are exactly the items the code review already recorded (`open`) and the plans already flagged `human_judgment: true`.

### Human Verification Required

1. **Translation quality — `messages/ms.json`**
   - **Test:** Read the whole bundle; judge naturalness, kid-appropriate register (8-14), terminology consistency (D-01).
   - **Expected:** Natural Malaysian Malay; no machine-translation artifacts.
   - **Why human:** Key parity is machine-proven; quality is not. Plans marked this Manual-Only.

2. **Translation quality — 19 `ms` MDX levels**
   - **Test:** Read every level's prose and interactive props; judge naturalness and pedagogy.
   - **Expected:** Natural, coherent, kid-appropriate Malay throughout.
   - **Why human:** Structural parity is machine-verified; quality is not.

3. **WR-01 — reconcile World 4/5 names** (map says `Ngarai Penciptaan`/`Gunung Pakar`; MDX says `Ngarai Cipta`/`Gunung Master`).
4. **WR-02 — replace the non-word `bodil`** in 2-4:82 (selectable answer), 3-2:56, 3-2:58.
5. **WR-03 — re-localise the 1-1 WordPredictor explanation/aiThinking** so it no longer justifies a Malay puzzle "in English".

### Gaps Summary

No must-have truth failed. All nine observable truths are VERIFIED against the live codebase — the phase goal (selectable `ms`, complete bundle, 19 localized levels, no silent English fallback) is achieved, and I independently re-ran the parity assert, tsc, lint, the full 94-test suite, and a clean static build (19 routes).

The status is `human_needed`, not `passed`, because the phase explicitly routed translation *quality* to human review (every plan's coverage marks translation quality `human_judgment: true`), and my inspection confirms concrete, user-visible content defects already logged by the code review with disposition `open` (WR-01, WR-02, WR-03; plus structural WR-04/IN-01/IN-03). These are content-quality items, not plumbing failures — but WR-02 offers a non-word to a child as a selectable answer and WR-03 presents an incoherent puzzle, so they should not be silently absorbed into a `passed` verdict.

---

_Verified: 2026-11-05T11:30:00Z_
_Verifier: the agent (gsd-verifier)_