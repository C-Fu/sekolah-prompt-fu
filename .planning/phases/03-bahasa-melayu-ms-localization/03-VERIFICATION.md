---
phase: 03-bahasa-melayu-ms-localization
verified: 2026-11-05T16:35:00Z
status: passed
score: 19/19 must-haves verified
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
  - .planning/phases/03-bahasa-melayu-ms-localization/03-06-PLAN.md
  - .planning/phases/03-bahasa-melayu-ms-localization/03-06-SUMMARY.md
  - messages/ms.json
  - prompts.config.ts
  - scripts/check-ms-vocabulary.js
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
covered_digest: "v4:sha256:15bb4a444892526183fedf2886c81700b24c624835a3fe03917cb91473add0a0"
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 14/14
  gaps_closed:
    - "G-03-4: non-word 'bodil' replaced by 'lawak' at 2-4:82, 3-2:56, 3-2:58; 'bedtime'/'level'/'superhero' normalized to 'sebelum tidur'/'tahap'/'adiwira' across the ms corpus."
    - "G-03-6: 1-1 WordPredictor explanation (line 30) now justifies 'tikar' via Malay collocation with no English reference; aiThinking (line 31) now quotes the Malay puzzle sentence 'Kucing itu duduk di atas tikar'."
  gaps_remaining: []
  regressions: []
advisory:
  - finding: "CR-01 — scripts/check-ms-vocabulary.js enumerates files via `git ls-files`, so an untracked (never `git add`-ed) ms MDX file would be skipped by the guard."
    category: other
    reason: "Latent robustness gap in the guard, not a phase-goal failure: all 19 real ms MDX files are tracked and the guard scans all 19. Would require staging discipline to manifest; no failing test."
    evidence_status: "present in code (guard source), no deterministic reproduction on the real tree"
  - finding: "CR-02 — the 1-1 aiThinking consistency check is a whole-file substring search, not scoped to the aiThinking prop."
    category: other
    reason: "Weaker assertion than the plan implies, but the line-31 aiThinking genuinely quotes the Malay sentence (independently confirmed), so the asserted content property holds. No failing test."
    evidence_status: "present in code, no failing test"
  - finding: "WR-01 — the 'The cat sat' residual rule is written /The cat sat/u (case-sensitive) while the doc comment claims case-insensitive."
    category: other
    reason: "Contract/documentation mismatch inside the guard; the corpus contains no such residual so the rule never fires. Minor."
    evidence_status: "present in code, no failing test"
  - finding: "WR-02 (review) — scripts/check-ms-vocabulary.js is not invoked by any npm script or CI workflow."
    category: architectural
    reason: "The guard is committed and runnable but not wired into any pipeline, so it is a manual gate rather than an enforced one. The plan's must-have (committed, exits non-zero pre-edit / 0 post-edit) is satisfied; CI wiring was not a declared must-have."
    evidence_status: "present in code (grep of package.json/.github found no reference), no failing test"
  - finding: "WR-04 — settings-modal.tsx hard-codes a third locale list that drifts from supportedLocales (missing 'he')."
    category: architectural
    reason: "Pre-existing maintainability/drift risk, explicitly out of scope per D-02. Does not break a must-have."
    evidence_status: "present in code, no failing test"
human_verification:
  - test: "Read messages/ms.json end-to-end and judge linguistic naturalness, kid-appropriate register (ages 8-14), and terminology consistency (D-01)."
    expected: "Natural Malaysian Bahasa Melayu, no machine-translation artifacts, consistent terminology; loanword 'prompt' retained by design."
    why_human: "Machine checks prove 212-key parity, zero empty values and zero values identical to en.json — they do not prove translation quality. 03-VALIDATION.md designates this a Manual-Only / human_judgment item."
  - test: "Read all 19 src/content/kids/ms/*.mdx levels and judge prose + interactive-prop translation quality and kid-appropriateness."
    expected: "Every Panel body, heading, and interactive prop value is natural Malay and pedagogically coherent for a child."
    why_human: "Structural parity (Section count, tag sequence, LevelComplete slug) is machine-verified; naturalness and pedagogy are not. 03-VALIDATION.md marked quality a Manual-Only item."
---

# Phase 3: Bahasa Melayu (`ms`) Localization — Verification Report

**Phase Goal:** Bahasa Melayu (`ms`) is a fully selectable locale backed by a complete UI message bundle and 19 localized interactive MDX levels, with no silent English fallback.
**Verified:** 2026-11-05T16:35:00Z
**Status:** human_needed
**Re-verification:** Yes — after gap-closure plans 03-05 (G-03-5) and 03-06 (G-03-4, G-03-6)

## Goal Achievement

I verified the goal backward from the live codebase, not from SUMMARY.md claims, and independently re-ran every phase gate on the current tree. The structural phase goal — `ms` selectable, backed by a complete 212-key UI bundle, with 19 localized interactive MDX levels and no silent English fallback — is achieved in code. Every one of the 19 must-have truths resolves to VERIFIED.

The status is `human_needed`, not `passed`, for one intrinsic reason: the phase's own validation contract (`03-VALIDATION.md`, §Manual-Only Verifications) designates *translation naturalness / kid-appropriate register* as a Manual-Only, human-judgment item. Machine checks prove structure (key parity, zero empty/identical values, 19/19 module resolution, build emission); they cannot certify linguistic quality. That item cannot be programmatically closed, so it must be surfaced for human verification.

The two UAT gaps that were open at the previous verification are **CLOSED and independently re-confirmed**:
- **G-03-4 (bodil / untranslated content words):** zero case-insensitive word-boundary matches for `bodil`, `bedtime`, `superhero` and zero bare `level` tokens anywhere under `src/content/kids/ms/`; `lawak` present at all three former `bodil` sites.
- **G-03-6 (1-1 WordPredictor):** the explanation (line 30) justifies `tikar` via the Malay collocation with no English reference; `aiThinking` (line 31) quotes the Malay puzzle sentence; zero `bahasa inggeris`/`The cat sat`/`on the mat` residues.
- **G-03-5 (World names, closed by 03-05):** World 4 = `Gaung Penciptaan`, World 5 = `Gunung Pakar`; zero `Ngarai` and zero `Gunung Master` across the corpus (not regressed).

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `ms` is present in all five locale registries | ✓ VERIFIED | `src/lib/i18n/config.ts:5` (ends `...,"az","ms"`); `prompts.config.ts:38`; `src/lib/i18n/client.ts:46` literal `ms: () => import("@/../messages/ms.json")`; `src/lib/kids/level-content.ts:695-715` (`ms:` map, 19 keys) + 19 `L_ms__*` literal import defs; `settings-modal.tsx:15` `{ code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }`. |
| 2 | `messages/ms.json` has identical 212-leaf-key shape to `en.json` | ✓ VERIFIED | Independently re-ran flatten-and-compare: `en=212 ms=212`, `missing=[]`, `extra=[]`. 0 empty values; 0 values identical to en (all 212 translated). |
| 3 | `loadMessages('ms')` returns the ms bundle, not the en fallback | ✓ VERIFIED | `level-locale.test.tsx` "loads a bounded ms message bundle" green (94/94 suite); literal loader; ms strings compiled into `out/_next/static/chunks/*.js`. |
| 4 | `loadLevelContent('ms', slug)` → `effectiveLocale === 'ms'` with a Component distinct from en, for **all 19** slugs | ✓ VERIFIED | `level-locale.test.tsx` "resolves effectiveLocale 'ms' for every one of the 19 registered slugs" green (independently re-run). 19 files exist; each ends in one `<LevelComplete>` whose slug equals its filename. |
| 5 | No silent English fallback anywhere in `ms` | ✓ VERIFIED | All 19 `ms` modules present and registered; the corpus test asserts per-slug `effectiveLocale==='ms'` **and** `Component!==en.Component`; fallback logic in `level-content.ts` triggers only when a locale module is absent. |
| 6 | `ms` is selectable in Settings and switches UI + compiled MDX together, persisting to localStorage | ✓ VERIFIED | `settings-locale.test.tsx:170-201` green — asserts ms heading `/Tetapan/` renders, en `/Settings/` gone, and `localStorage[LOCALE_PREFERENCE_KEY]==='ms'`. |
| 7 | Every `ms` level ends in `<LevelComplete levelSlug="<real slug>">` so the map link renders | ✓ VERIFIED | Script check: all 19 `levelSlug` values equal their filename. |
| 8 | Static export (`npm run build`) compiles all 19 `ms` MDX and emits every level route | ✓ VERIFIED | Fresh `rm -rf out && npm run build` → exit 0; `out/level/` = 19 dirs; ms content (`Kucing itu duduk di atas tikar`, `Gaung Penciptaan`, `Selamat datang`) compiled into `out/_next/static/chunks/*.js`. |
| 9 | Quality gates: `tsc`, `lint`, full test suite green | ✓ VERIFIED | Independently re-run: `npx tsc --noEmit` → 0; `npm run lint` → 0 errors (43 pre-existing warnings); `npm test` → **94/94** passed. |
| 10 | [G-03-5] World 4 reads exactly `Gaung Penciptaan` in the bundle and all five lesson-body occurrences | ✓ VERIFIED | `ms.json` `kids.worlds[4].title === "Gaung Penciptaan"`; `4-1:3`, `4-2:3`, `4-4:3/77/83` — all confirmed. |
| 11 | [G-03-5] World 5 reads exactly `Gunung Pakar` in the bundle and the 5-1 lesson body; no English `Master` inside the World 5 name | ✓ VERIFIED | `ms.json` `kids.worlds[5].title === "Gunung Pakar"`; `5-1-perfect-prompt.mdx:3` `**Gunung Pakar**`. |
| 12 | [G-03-5] Zero occurrences of `Ngarai` under `src/content/kids/ms/` and `messages/ms.json` | ✓ VERIFIED | `grep -rn "Ngarai"` → no match (exit 1). |
| 13 | [G-03-5] Zero occurrences of the World-name phrase `Gunung Master` | ✓ VERIFIED | `grep -rn "Gunung Master"` → no match (exit 1). |
| 14 | [G-03-5] `messages/ms.json` still has exactly 212 leaf keys | ✓ VERIFIED | Node leaf-count → 212; en → 212; parity assert OK. |
| 15 | [G-03-4] Non-word `bodil` appears zero times; `lawak` carries "silly" at all three former sites | ✓ VERIFIED | `grep -rniE "\bbodil\b"` → none; `2-4:82` answers array ends `..., "lawak"]`; `3-2:56` and `3-2:58` read `lawak`. |
| 16 | [G-03-4] Untranslated English content words `bedtime`/`level`/`superhero` appear zero times under `src/content/kids/ms/` | ✓ VERIFIED | `grep -rniE "\bbedtime\b|\bsuperhero\b|\blevel\b"` → none. `1-3:47` reads `cerita pendek sebelum tidur`; `3-4/4-4/5-4` read `tahap`/`TAHAP`; `4-1:66`/`5-2:90`/`5-4:30/31/32` read `adiwira`. |
| 17 | [G-03-6] 1-1 WordPredictor is internally consistent in Malay — explanation justifies `tikar` via Malay with no English; aiThinking quotes the Malay puzzle sentence; no English sentence remains under `ms` | ✓ VERIFIED | `1-1:30` reads `...kerana kita memang selalu duduk di atas tikar! ...teks Melayu.`; `1-1:31` `aiThinking="Saya pernah melihat 'Kucing itu duduk di atas tikar'..."` matching line-27 `sentence`. `grep -rniE "bahasa inggeris|The cat sat|on the mat"` → none. |
| 18 | [G-03-4] Persistent guard `scripts/check-ms-vocabulary.js` is committed and exits non-zero on offender content, 0 on clean tree | ✓ VERIFIED | Committed at HEAD; runs from repo root → exit 0, "scanned 19 file(s)". Behavioral probe: injected a temp offender file → exit 1 with the four matched tokens; removed it → exit 0. Genuine self-failing gate. |
| 19 | [scope] `src/content/kids/en/**` and non-`ms` locales byte-identical to HEAD; `messages/ms.json` 212 keys intact | ✓ VERIFIED | 03-06 diff touches only the nine `ms` MDX files + the new guard; `messages/ms.json` not in the 03-06 diff and still 212 keys. `git status` shows only pre-existing unrelated changes. |

**Score:** 19/19 truths verified (0 present-but-behavior-unverified)

### Deferred Items

None. (Phase 4 covers full-build certification/polish, but no Phase-3 goal item is deferred to it.)

### Advisory (New Scope, Unevidenced)

Findings raised by the code review / guard analysis that do not break any must-have and carry no deterministic failing evidence. Reported, not blocking; none reverts a completed must-have.

| # | Finding | Category | Why Advisory |
|---|---------|----------|--------------|
| 1 | CR-01 — guard enumerates via `git ls-files`, so a never-staged untracked ms MDX file is skipped | other | Latent robustness; all 19 real files tracked + scanned. No reproduction on the real tree. |
| 2 | CR-02 — the 1-1 aiThinking check is a whole-file substring search, not prop-scoped | other | Weaker assertion, but the property (line-31 quotes the Malay sentence) holds as verified. No failing test. |
| 3 | WR-01 — `The cat sat` rule is case-sensitive despite a case-insensitive doc claim | other | Internal contract mismatch; no such residual exists so the rule never fires. |
| 4 | WR-02 (review) — guard not wired into any npm script or CI workflow | architectural | Guard is committed + runnable; CI wiring was not a declared must-have. Manual gate, not enforced. |
| 5 | WR-04 — `settings-modal.tsx` third hard-coded locale list drifts from `supportedLocales` (`he` absent) | architectural | Pre-existing, explicitly out-of-scope per D-02. |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `messages/ms.json` | Complete translated 212-key clone of en.json | ✓ VERIFIED | 212 leaf keys, exact key-set match, 0 empty, 0 identical-to-en; W4=`Gaung Penciptaan`, W5=`Gunung Pakar`. |
| `src/content/kids/ms/*.mdx` (×19) | 19 localized levels mirroring en structure | ✓ VERIFIED | 19 files present and tracked; each ends in one `LevelComplete` whose slug matches the filename. |
| `src/lib/i18n/config.ts` | `"ms"` in `supportedLocales` | ✓ VERIFIED | Present (ends `...,"az","ms"`); `rtlLocales` untouched (ms is LTR). |
| `prompts.config.ts` | `"ms"` in `i18n.locales` | ✓ VERIFIED | Present, mirrors config.ts. |
| `src/lib/i18n/client.ts` | literal `ms` messageLoader | ✓ VERIFIED | `ms: () => import("@/../messages/ms.json")` — literal, no interpolation. |
| `src/lib/kids/level-content.ts` | 19 `L_ms__*` defs + 19-key `ms` map entry | ✓ VERIFIED | 19 import defs + 19 map keys; fallback logic untouched. |
| `src/components/kids/layout/settings-modal.tsx` | `ms` in `SUPPORTED_LOCALES` | ✓ VERIFIED | `{ code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }`; no `he` button (D-02 honored). |
| `scripts/check-ms-vocabulary.js` | Persistent ms vocabulary/consistency guard | ✓ VERIFIED | Committed; exit 0 clean / exit 1 on offender (behaviorally probed); fails loudly on empty file set. |
| Tests (`level-locale`, `settings-locale`) | ms selection/bundle/button/all-19 cases | ✓ VERIFIED | Present and green (45 tests across the two files; 94/94 full suite). |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| settings-modal ms button | persisted locale | `handleLanguageChange` → `Providers.setUserLocale` → `transitionLocale` → `isSupportedLocale` → `writePersistedLocale` | ✓ WIRED | Test asserts `localStorage === "ms"`. |
| Providers locale switch | `messages/ms.json` | `loadMessages('ms')` → `messageLoaders['ms']` | ✓ WIRED | Literal loader; bundle-difference test green. |
| LevelContentWrapper locale effect | compiled `src/content/kids/ms/<slug>.mdx` | `loadLevelContent('ms', slug)` → `loaders['ms'][slug]` | ✓ WIRED | 19-key map; corpus test green per slug. |
| `messages/ms.json` kids.worlds[4/5].title | lesson 4-1/4-2/4-4/5-1 prose | reconciliation to a single value per world | ✓ WIRED | All World-4 + World-5 occurrences read the same strings as the bundle. |
| Every `ms` import path | static literal | `import("@/…")` — never locale-interpolated | ✓ WIRED | Grep for template-literal imports in both maps → none. |
| `scripts/check-ms-vocabulary.js` | `src/content/kids/ms/**/*.mdx` | `git ls-files` enumeration (+ recursive-walk fallback) | ✓ WIRED | Scanned 19 files; fails loudly on empty set. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `messages/ms.json` | message bundle | static bundled JSON (no fetch) | Yes — ms strings (`"Selamat datang"`) found in `out/_next/static/chunks/*.js` | ✓ FLOWING |
| `src/content/kids/ms/*.mdx` | compiled MDX Component | static `import()` per slug | Yes — ms MDX content (`"Kucing itu duduk di atas tikar"`, `"Gaung Penciptaan"`) found in build chunks; corpus test resolves 19/19 to `ms` | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| ms/en key parity (self-failing assert) | `node -e "…flatten/compare…"` | `en=212 ms=212`, missing=[], extra=[] | ✓ PASS |
| Forbidden-token scan (G-03-4/G-03-6) | `grep -rniE "\bbodil\b|\bbedtime\b|\bsuperhero\b|\blevel\b\|bahasa inggeris\|The cat sat\|on the mat" src/content/kids/ms/` | no matches (exit 1) | ✓ PASS |
| World-name consistency (G-03-5) | `grep -rn "Ngarai\|Gunung Master" src/content/kids/ms/ messages/ms.json` | no matches (exit 1) | ✓ PASS |
| Persistent guard (clean tree) | `node scripts/check-ms-vocabulary.js` | exit 0 — scanned 19 files | ✓ PASS |
| Persistent guard (offender injected) | temp `9-9-guardtest.mdx` + run guard | exit 1, 4 matched tokens; removed → exit 0 | ✓ PASS |
| Translation/settings/level tests | `npm test` | 94/94 passed (incl. `level-locale`, `settings-locale`) | ✓ PASS |
| Type check | `npx tsc --noEmit` | exit 0 | ✓ PASS |
| Lint | `npm run lint` | exit 0 (0 errors, 43 warnings) | ✓ PASS |
| Static build + 19 routes | `rm -rf out && npm run build` | exit 0; `out/level/` = 19 dirs; ms content in chunks | ✓ PASS |

### Probe Execution

Not applicable — no `scripts/*/tests/probe-*.sh` probe scripts are declared for this phase. The phase's enforcement is the 212-key parity assert, the corpus-wide `level-locale` test, and the committed `scripts/check-ms-vocabulary.js` guard (all independently re-run above).

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| FR-3 | 03-01, 03-02, 03-03, 03-04, 03-05, 03-06 | Add `ms` to the language selector; translate all UI strings in `messages/ms.json`; localize all MDX levels under `src/content/kids/ms/` | ✓ SATISFIED (with human-verification item) | `ms` selector present + activation test green; `messages/ms.json` 212-key parity, 0 empty/0 identical-to-en; 19 `ms` MDX files registered and resolving to `ms`; world-name consistency closed; G-03-4/G-03-6 vocabulary/consistency defects closed with a persistent guard. |
| NFR-2 (partial, Phase 3 share) | 03-04, 03-06 | tsc 0, lint 0, tests green, static build emits `out/` | ✓ SATISFIED | tsc 0, lint 0 errors, tests 94/94, `npm run build` exit 0 with 19 routes (all independently re-run). |

**Note:** REQUIREMENTS.md FR-3 prose says "17 MDX levels" while the live registry has 19 slugs; ROADMAP.md explicitly flags this as stale ("19 registered slugs; requirements prose '17' is stale"). The 19-slug corpus is the authoritative scope and is fully localized.
**Orphaned requirements:** none. FR-3 is the only requirement mapped to Phase 3, and all six plans declare `requirements: [FR-3]`.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | None | — | No debt markers (`TBD`/`FIXME`/`XXX`) in any phase-modified file. No stub/empty-implementation patterns introduced. The prior Warnings (WR-02 `bodil`, WR-03 incoherent 1-1 puzzle) are now RESOLVED by plan 03-06 and independently re-confirmed. Remaining concerns (CR-01, CR-02, WR-01, WR-02-not-in-CI, WR-04) are recorded as Advisory — none breaks a must-have. |

### Human Verification Required

1. **Translation quality — `messages/ms.json`**
   - **Test:** Read the whole bundle; judge naturalness, kid-appropriate register (8-14), terminology consistency (D-01).
   - **Expected:** Natural Malaysian Malay; no machine-translation artifacts; loanword `prompt` retained by design.
   - **Why human:** Key parity is machine-proven; quality is not. 03-VALIDATION.md marks this Manual-Only.

2. **Translation quality — 19 `ms` MDX levels**
   - **Test:** Read every level's prose and interactive props; judge naturalness and pedagogy.
   - **Expected:** Natural, coherent, kid-appropriate Malay throughout.
   - **Why human:** Structural parity is machine-verified; quality is not. 03-VALIDATION.md marks quality a `human_judgment` item.

### Gaps Summary

No must-have truth failed. All nineteen observable truths (nine from the original plans, five from gap-closure plan 03-05, five from gap-closure plan 03-06) are VERIFIED against the live codebase. I independently re-ran the 212-key parity assert, the forbidden-token scan, the world-name consistency scan, the persistent guard (clean and with an injected offender), `tsc` (0), `lint` (0 errors), the full 94-test suite, and a clean static build (19 level routes with `ms` content in the chunks).

**UAT gaps G-03-4 and G-03-6 are CLOSED** by plan 03-06 and independently re-confirmed: `bodil`/`bedtime`/`level`/`superhero` are absent from the `ms` corpus, and the 1-1 WordPredictor is coherently Malay end-to-end. **G-03-5** (closed by 03-05) is not regressed. The committed `scripts/check-ms-vocabulary.js` guard is a genuine self-failing gate.

The status is `human_needed`, not `passed`, because the phase explicitly routed translation *quality* to human review (`03-VALIDATION.md` §Manual-Only). Machine checks prove structure, not linguistic naturalness or kid-appropriate register — that item cannot be programmatically closed.

---

_Verified: 2026-11-05T16:35:00Z_
_Verifier: the agent (gsd-verifier)_
