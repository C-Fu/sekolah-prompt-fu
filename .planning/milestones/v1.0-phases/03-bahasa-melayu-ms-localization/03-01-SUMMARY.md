---
phase: 03-bahasa-melayu-ms-localization
plan: 01
subsystem: i18n
tags: [next-intl, mdx, localization, bahasa-melayu, static-export, vitest]

# Dependency graph
requires:
  - phase: 01-purge-non-kids-code-dependencies
    provides: validated bounded import maps (messageLoaders, level-content loaders), isSupportedLocale hardening, client locale preference (transitionLocale)
  - phase: 02-promote-kids-game-to-root-configure-static-export
    provides: kids game served at / with MDX level compilation
provides:
  - "ms registered in all five locale registries (config.ts, prompts.config.ts, client.ts messageLoaders, level-content.ts loaders, settings-modal.tsx SUPPORTED_LOCALES)"
  - "messages/ms.json — complete 212-leaf-key Bahasa Melayu parity clone of en.json"
  - "src/content/kids/ms/1-1-meet-promi.mdx — 10-Section Phase 3 tracer level"
  - "Wave 0 ms regression tests (selection, message bundle, supportedLocales, language-button activation)"
affects: [03-remaining, 04]

# Actuals (#2632) — pairs with the plan's `estimate` to calibrate future estimates.
actuals:
  tokens: 33509
  tasks: 3
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Literal static import() entries for every new locale (never locale-interpolated) — preserved T-03-SC/T-01-16/T-01-14 hardening"
    - "messages/ms.json authored as a flattened-key-identical clone of en.json, gated by a self-failing node leaf-key-set-equality assertion"

key-files:
  created:
    - messages/ms.json
    - src/content/kids/ms/1-1-meet-promi.mdx
  modified:
    - src/lib/i18n/config.ts
    - prompts.config.ts
    - src/lib/i18n/client.ts
    - src/lib/kids/level-content.ts
    - src/components/kids/layout/settings-modal.tsx
    - src/__tests__/kids/level-locale.test.tsx
    - src/__tests__/kids/settings-locale.test.tsx

key-decisions:
  - "Author messages/ms.json as a 212-leaf-key clone of en.json (not the RESEARCH's stale 322 figure) — PATTERNS.md correction verified against scripts/check-translations.js."
  - "Tracer 1-1-meet-promi mirrors en's 10-Section structure exactly (D-01 strict-parity authoring contract), unlike es which uses 7."
  - "The ms settings-heading discriminator ('Tetapan' present, en /Settings/ absent) is the ms-vs-en silent-fallback guard; the section count (10) is only a mount gate, not a discriminator (en also renders 10)."
  - "Do NOT add a `he` settings button (D-02) — the pre-existing SUPPORTED_LOCALES/supportedLocales drift stays out of scope."

patterns-established:
  - "Locale registration = five synchronized edits + a self-failing 212-key parity assertion; a miss in any registry produces a silent English fallback, which the new tests catch."
  - "MDX localization translates both prose (Panel/##) and every interactive prop value (title/instruction/sentence/options/correctAnswer/explanation/aiThinking/successMessage/message) — never half-localize."

requirements-completed: [FR-3]

coverage:
  - id: D1
    description: "ms is registered in all five locale registries and the Settings modal shows an selectable 'Bahasa Melayu' button"
    requirement: "FR-3"
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#includes ms in supportedLocales"
        status: pass
      - kind: integration
        ref: "src/__tests__/kids/settings-locale.test.tsx#switches UI messages and compiled MDX together when Bahasa Melayu is selected"
        status: pass
    human_judgment: false
  - id: D2
    description: "messages/ms.json is a complete 212-leaf-key Bahasa Melayu clone of en.json (no missing/extra keys)"
    requirement: "FR-3"
    verification:
      - kind: automated_ui
        ref: "node -e flattened leaf-key-set equality assertion — 'ms parity OK: 212 leaf keys'"
        status: pass
      - kind: automated_ui
        ref: "node scripts/check-translations.js — '✅ All translation files are complete!' (report only)"
        status: pass
    human_judgment: true
    rationale: "Machine checks prove key parity, not linguistic naturalness / kid-appropriate register (03-VALIDATION.md Manual-Only row). A human must read the translations."
  - id: D3
    description: "loadLevelContent('ms','1-1-meet-promi') resolves the ms module (effectiveLocale 'ms', Component != en), not the silent English fallback"
    requirement: "FR-3"
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#selects ms content (not the en fallback) when the ms module exists"
        status: pass
    human_judgment: false
  - id: D4
    description: "loadMessages('ms') returns the ms bundle, not the en fallback"
    requirement: "FR-3"
    verification:
      - kind: unit
        ref: "src/__tests__/kids/level-locale.test.tsx#loads a bounded ms message bundle"
        status: pass
    human_judgment: false
  - id: D5
    description: "src/content/kids/ms/1-1-meet-promi.mdx is a structurally-correct, fully-localized 10-Section tracer level ending in LevelComplete"
    requirement: "FR-3"
    verification:
      - kind: automated_ui
        ref: "node structural check — 'tracer mdx OK (10 sections)'"
        status: pass
    human_judgment: true
    rationale: "Structural/parity checks pass; translation quality (Bahasa Melayu register and terminology consistency) requires human reading."

# Metrics
duration: 26min
completed: 2026-11-05
status: complete
---

# Phase 3 Plan 01: Bahasa Melayu (`ms`) Tracer Slice Summary

**Registered `ms` across all five locale registries, authored a complete 212-key Bahasa Melayu `messages/ms.json`, and localized the 10-Section `1-1-meet-promi` MDX tracer level end-to-end — plus Wave 0 tests that fail loudly on any silent English fallback.**

## Performance

- **Duration:** 26 min
- **Started:** 2026-11-05T10:26:00Z
- **Completed:** 2026-11-05T10:52:00Z
- **Tasks:** 3
- **Files modified:** 9 (7 modified, 2 created)

## Accomplishments
- `ms` added to `supportedLocales` (config.ts), `i18n.locales` (prompts.config.ts), `messageLoaders` (client.ts), the level `loaders` map (level-content.ts), and `SUPPORTED_LOCALES` (settings-modal.tsx) — all as literal static entries, never locale-interpolated.
- `messages/ms.json` authored as a flattened-key-identical clone of `en.json` — verified at exactly **212 leaf keys**, zero missing, zero extra; `node scripts/check-translations.js` reports "✅ All translation files are complete!".
- `src/content/kids/ms/1-1-meet-promi.mdx` authored with the same component vocabulary as en (10 `<Section>`, 5 `<Panel>`, 2 `<WordPredictor>`, 2 `<PromptVsMistake>`, 1 `<LevelComplete levelSlug="1-1-meet-promi">`), all prose and interactive props translated to kid-simple Bahasa Melayu.
- Four Wave 0 tests landed; each was proven to fail against a deliberately-removed registry entry (ms message loader removal → message-bundle test red; ms level-map removal → selection test red), confirming they genuinely catch silent fallback.

## Task Commits

Each task was committed atomically:

1. **Task 1: Register ms in five registries + complete messages/ms.json + tracer MDX** - `4ba02803` (feat)
2. **Task 2: Add Wave 0 failing tests for ms selection, message bundle, and language button** - `f98a31c8` (test)
3. **Task 3: Author the tracer MDX level** - committed within `4ba02803` (the plan listed `src/content/kids/ms/1-1-meet-promi.mdx` in both Task 1's and Task 3's `<files>`; it was authored and committed as part of Task 1's atomic commit, so Task 3 produced no separate change)

**Plan metadata:** pending (docs: complete plan) — committed after this SUMMARY.

_Note: Task 3 carried no new artifact because its sole file was already committed under Task 1; its `<verify>` structural check was re-run and passes._

## Files Created/Modified
- `messages/ms.json` - complete 212-key Bahasa Melayu message bundle (NEW)
- `src/content/kids/ms/1-1-meet-promi.mdx` - 10-Section localized tracer level (NEW)
- `src/lib/i18n/config.ts` - appended `"ms"` to `supportedLocales` (rtlLocales untouched — ms is LTR)
- `prompts.config.ts` - appended `"ms"` to `i18n.locales`
- `src/lib/i18n/client.ts` - added `ms: () => import("@/../messages/ms.json")` to `messageLoaders`
- `src/lib/kids/level-content.ts` - added `L_ms__1_1_meet_promi` loader def + `ms: { "1-1-meet-promi": … }` map entry (fallback logic untouched)
- `src/components/kids/layout/settings-modal.tsx` - added `{ code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }` (no `he` entry, D-02)
- `src/__tests__/kids/level-locale.test.tsx` - 3 new ms cases (content selection, message bundle, supportedLocales.includes)
- `src/__tests__/kids/settings-locale.test.tsx` - 1 new ms language-button activation case

## Decisions Made
- **212-key parity target, not 322:** RESEARCH.md's stale "322-key" figure was corrected by PATTERNS.md; verified against `scripts/check-translations.js` (212 leaf keys) and enforced by the task's self-failing node assertion.
- **Strict en-structure mirror for the tracer:** per D-01, `ms/1-1-meet-promi.mdx` mirrors en's 10-Section order exactly (es uses 7). This makes the level reviewable and keeps the section count a valid mount gate.
- **ms-vs-en discriminator is the heading, not the section count:** the settings test asserts the ms-authored heading `Tetapan` renders AND the en `/Settings/` heading is gone; the section count (10) is explicitly not the discriminator (en also renders 10).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ms settings-activation test triggered a jsdom audio crash and leaked progress**
- **Found during:** Task 2 (Wave 0 tests)
- **Issue:** The new ms activation case did not seed progress, so music defaulted to enabled; the first click fired `background-music.tsx`'s interaction handler, which called `audioRef.current.play()` (undefined in jsdom) and threw. It also caused `<LevelComplete stars={3}>` to persist stars into `kids-progress`, polluting the later reset test (`getTotalStars()` returned 3 instead of 0).
- **Fix:** Seeded progress in the ms case via the existing `seedProgress()` helper (which also disables music and pre-marks `1-1-meet-promi` with stars=3, so `<LevelComplete>` does not re-write), mirroring the es activation case's structure exactly. Added a `getTotalStars() === 5` survival assertion.
- **Files modified:** src/__tests__/kids/settings-locale.test.tsx
- **Verification:** Full `settings-locale.test.tsx` now 7/7 green; `level-locale.test.tsx` + `settings-locale.test.tsx` = 44/44 green; full suite 93/93.
- **Committed in:** `f98a31c8` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug)
**Impact on plan:** Test-isolation correctness only; no production code changed, no scope creep. The fix mirrors the established es-activation pattern.

## Issues Encountered
- The plan's Abstract listed the tracer MDX in both Task 1's and Task 3's `<files>`; it was authored and committed once under Task 1's atomic commit. Task 3's verify was re-run independently and passes. No separate Task 3 commit exists because there was no additional change to commit.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The full localization pipeline is proven on `ms` for one level: registry registration → `loadMessages` bundle → compiled MDX selection with `effectiveLocale === "ms"` → Settings switcher → persisted `kids-locale-preference`.
- Ready for the remaining 18 `ms` MDX levels (plan 03-remaining): each needs only an `L_ms__<slug>` loader def + `ms` map entry in `level-content.ts` and an authored `src/content/kids/ms/<slug>.mdx`.
- Baseline gates all green: `npx tsc --noEmit` → 0 errors; `npm run lint` → 0 errors (43 pre-existing warnings, unchanged); `npm run test` → 93/93.
- Manual-only follow-up: human read of `messages/ms.json` and the tracer MDX for linguistic naturalness / kid-appropriate register (03-VALIDATION.md Manual-Only row).

---
*Phase: 03-bahasa-melayu-ms-localization*
*Completed: 2026-11-05*

## Self-Check: PASSED

- `messages/ms.json` — FOUND
- `src/content/kids/ms/1-1-meet-promi.mdx` — FOUND
- `.planning/phases/03-bahasa-melayu-ms-localization/03-01-SUMMARY.md` — FOUND
- Commit `4ba02803` (Task 1) — FOUND (ancestor of HEAD)
- Commit `f98a31c8` (Task 2) — FOUND (ancestor of HEAD)