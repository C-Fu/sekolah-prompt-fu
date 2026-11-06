---
task: rename-promi-peromfu
date: 2026-11-06
status: in-progress
---

# Quick Task: Rename character "Promi" → "Peromfu" across the app

## Description
User request: the robot character is currently named "Promi"; rename it to
"Peromfu" everywhere it appears in the app/game ("not Promi anymore").
Also includes the earlier MS-content fix (duplicate "dahulu" in the 2nd
WordPredictor question), already applied.

## Scope
- Display text in all 18 locale MDX files + `messages/*.json` (word-boundary
  safe: `Promi` is a prefix of `Promise`, so replacements use `\b`)
- Level slug `1-1-meet-promi` → `1-1-meet-peromfu` (levels.ts, level-content.ts
  loader map, MDX `levelSlug` props, scripts, tests) + MDX file renames (18)
- `Panel`/`StoryScene` `character="promi"` prop union, comparisons, defaults
- i18n keys `1_1_meet_promi` → `1_1_meet_peromfu`, `promiIntro` → `peromfuIntro`
- Component identifiers: `PromiCharacter`, `PromiWithMessage`, `PromiMood`
- SEO title "Promi's Prompt School" → "Peromfu's Prompt School", README
- `public/promi{,-animated,-dark}.svg` → `peromfu*.svg` (unreferenced in src)
- localStorage progress migration shim (progress keyed by old slug)

## Out of scope
- Generated build output (`out/`, `.next/`, tsconfig.tsbuildinfo) — regenerated
- Historical `.planning/` phase artifacts (records of past work)

## Verification
- `grep` audit: zero non-`Promise` `promi` matches in src/messages/scripts/README
- `npm test` (vitest suite incl. seo/level-locale/verify-project tests)
- `npm run build` (static export; catches MDX import-path breaks)
- `npm run verify`
