---
task: rename-promi-peromfu
date: 2026-11-06
status: complete
---

# Quick Task Summary: Rename "Promi" → "Peromfu"

## Changes
- **Display text** in all 18 locale MDX files + all 20 `messages/*.json`
  (word-boundary replace; `Promi`/`promi` never matched `Promise`)
- **Locale-specific grammar forms**: German genitive `Promis`→`Peromfus`,
  Azerbaijani dative `Promiyə`→`Peromfuya`, CJK particle-attached forms
  (`Promiを`, `Promi的`, `Promi가`…→`Peromfu…`)
- **Native-script transliterations** (2-1/3-1 content): Проми→Перомфу,
  プロミ→ペロムフ, 프로미→페롬푸, 普罗米→佩罗姆夫, پرومی→پرومفو, برومي→برومفو
- **Level slug** `1-1-meet-promi`→`1-1-meet-peromfu`: `levels.ts`,
  `level-content.ts` loader map (identifiers `L_xx__1_1_meet_promi` incl.),
  MDX `levelSlug` props, `scripts/check-ms-vocabulary.js`, tests;
  18 MDX files `git mv`'d; URL is now `/level/1-1-meet-peromfu`
- **i18n keys**: `1_1_meet_promi`→`1_1_meet_peromfu`,
  `promiIntro`→`peromfuIntro` (levels.ts + all messages/*.json in sync)
- **Component API**: `Panel`/`StoryScene` `character="promi"` union+defaults
  → `"peromfu"`; props `promiMessage`→`peromfuMessage` (650 usages),
  `promiPosition`→`peromfuPosition`; identifiers `PromiCharacter`,
  `PromiWithMessage`, `PromiMood` → `Peromfu*`
- **SEO/branding**: "Promi's Prompt School"→"Peromfu's Prompt School" etc.;
  README updated
- **Assets**: `public/promi{,-animated,-dark}.svg` → `peromfu*.svg`
  (were unreferenced in src; renamed for consistency)
- **Progress migration**: `progress.ts` gains `LEGACY_SLUG_ALIASES`
  (`1-1-meet-promi`→`1-1-meet-peromfu`) migrated on read so returning
  players keep stars/completion/`currentLevel` (localStorage is slug-keyed)
- **Earlier fix (same task)**: ms `1-1` WordPredictor sentence
  `Pada suatu masa dahulu ___`→`Pada suatu masa ____` ("dahulu" was both
  part of the question and the answer)

## Intentionally untouched
- Generated build output (`out/`, `.next/`, `tsconfig.tsbuildinfo`) — rebuilt
- Historical `.planning/` phase artifacts and `progress.ts`'s legacy-alias
  comment/map (the two remaining `promi` mentions in src are the alias map)

## Verification
- grep audit: 0 non-`Promise` `promi` matches in src/messages/scripts/README
  (only the intentional `LEGACY_SLUG_ALIASES` entries remain)
- `npm test` 119/119; `npx tsc --noEmit` 0 errors (via verify)
- `npm run build` exit 0 — 25 pages, `/level/1-1-meet-peromfu` emitted
- `npm run verify` — ✅ NFR-2 certified, 19/19 level routes
- `npm run lint` 0 errors (44 pre-existing warnings); `npm run lint:ms` pass

## Known consequences
- Old deep link `/level/1-1-meet-promi` now 404s (static export supports no
  redirects; old URL had no inbound refs in-repo)
- Old bookmarked progress auto-migrates via the alias map
