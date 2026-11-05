---
phase: 03-bahasa-melayu-ms-localization
reviewed: 2026-11-05T00:00:00Z
depth: standard
files_reviewed: 28
files_reviewed_list:
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
findings:
  critical: 0
  warning: 4
  info: 3
  total: 7
status: issues_found
---

# Phase 3: Code Review Report — Bahasa Melayu (`ms`) Localization

**Reviewed:** 2026-11-05
**Depth:** standard
**Files Reviewed:** 28
**Status:** issues_found

## Summary

Phase 3 adds a Bahasa Melayu (`ms`) locale to the kids prompting game. I reviewed the
locale inventory wiring (`config.ts`, `prompts.config.ts`), the bounded import maps
(`i18n/client.ts`, `kids/level-content.ts`), the settings language picker
(`settings-modal.tsx`), the 24 new `ms` MDX lesson files, `messages/ms.json`, and the two
kid test files.

**Invariants verified — no BLOCKERs found:**

1. **Static import maps (security invariant).** Both `messageLoaders` (18 literal keys, incl.
   `ms`) and the `level-content.ts` `loaders` map use fully literal, statically analyzable
   `() => import("...")` entries. No `locale`/`slug` interpolation into an import path exists
   anywhere; the runtime only indexes a validated locale/slug. Injection candidates
   (`"../evil"`, `"../../secrets"`) resolve to the default locale or `null` before any import.
2. **Silent-fallback correctness.** `ms` is present in `supportedLocales`, the message-loader
   map, and the 19-key `ms` content map, so a missing entry cannot silently degrade to English.
   `loadLevelContent` throws (never returns `null`) when the English module for a known slug is
   absent, and only the *absence* of a locale module triggers fallback.
3. **Structural parity.** All 19 `ms` MDX files match `en` on `<Section>` count, `<Section>`/
   `</Section>` balance, full component-tag sequence (Panel / WordPredictor / ExampleMatcher /
   MagicWords / DragDropPrompt / PromptParts / PromptDoctor / PromptLab / StepByStep /
   PromptVsMistake / LevelComplete), `LevelComplete` `levelSlug`, `stars`, `correctOrder`
   length, `options`/`answers` entry counts, and the `{{id}}`-vs-`___` placeholder convention.
   `messages/ms.json` has 212 keys with an exact key-set match to `en` and no empty values.
4. **Test discrimination.** `level-locale.test.tsx` guards `ms` with both an
   `effectiveLocale === "ms"` assertion and a `Component !== en.Component` module-identity
   assertion (per-slug loop over all 19), plus a bundle-difference assertion. These genuinely
   discriminate `ms` from the `en` fallback.

The defects below are content-quality and maintainability issues in the `ms` translation and
the settings picker, not correctness/security failures in the locale plumbing.

## Warnings

### WR-01: World names in `ms` MDX contradict `messages/ms.json` (map vs. lesson mismatch)

**File:** `src/content/kids/ms/4-1-pretend-time.mdx:3`, `4-2:3`, `4-3:3`, `4-4:3`, `4-4:83`,
`5-1-perfect-prompt.mdx:3`, `src/content/kids/ms/5-2-fix-it-up.mdx:3` vs `messages/ms.json:117,121`

**Issue:** The World-4 and World-5 display names differ between the map (driven by
`messages/ms.json`) and the lesson bodies (hard-coded in MDX):

| World | `messages/ms.json` title | `ms` MDX body |
|-------|--------------------------|----------------|
| 4 | `Ngarai Penciptaan` | `Ngarai Cipta` |
| 5 | `Gunung Pakar` | `Gunung Master` |

A child sees "Ngarai Penciptaan" on the map but "Ngarai Cipta" in the lesson intro, and
"Gunung Pakar" on the map but "Gunung Master" in every `5-*` lesson. `en` does not have this
defect — `en.json` and `en` MDX agree on "Creation Canyon" / "Master Mountain". Additionally,
`Gunung Master` leaves the English word "Master" untranslated inside an otherwise Malay string.

**Fix:** Pick one name per world and make both sources agree. Prefer the `ms.json` values
(already user-facing on the map): change the MDX bodies to `Ngarai Penciptaan` and
`Gunung Pakar`, covering intro panels, `LevelComplete` `message` strings, and closing
celebration panels.

### WR-02: Corrupted/nonsense word "bodil" used for "silly" (3 occurrences)

**File:** `src/content/kids/ms/2-4-detail-detective.mdx:82`, `src/content/kids/ms/3-2-show-dont-tell.mdx:56`, `3-2:58`

**Issue:** The English source uses the mood word "silly". The `ms` files render it as
`bodil` — not a recognised Malay word (a probable corruption of `bodoh`, which is also
unsuitable/tone-deaf for a kids' product). The occurrences are:

- `2-4:82` — inside a `MagicWords` `answers` array, so "bodil" is offered to the child as a
  selectable mood/style answer.
- `3-2:56` — inside the correct `good` prompt shown to the child.
- `3-2:58` — inside the explanation text.

Because one occurrence is a user-selectable answer, this is visible, potentially confusing
content in a learning game.

**Fix:** Replace `bodil` with an age-appropriate Malay word for "silly/playful", e.g.
`jenaka`, `kelakar`, or `main-main`, in all three places (`3-2` already uses `kelakar`
elsewhere, so prefer `main-main`/`jenaka` there to avoid duplication of the mood).

### WR-03: `ms` 1-1 WordPredictor explanation is incoherent after translation (English-idiom puzzle relabelled in Malay)

**File:** `src/content/kids/ms/1-1-meet-promi.mdx:27-31`

**Issue:** The puzzle's premise is an English known-phrase completion ("The cat sat on the
___"). The `ms` translation changed the sentence to Malay (`Kucing itu duduk di atas ___`) and
the answer/options to Malay (`tikar`), but kept an explanation that says the answer is correct
"kerana ia bunyi yang terkenal **dalam bahasa Inggeris**" ("because it's a famous rhyme **in
English**"), and kept `aiThinking="Saya pernah melihat 'The cat sat on the mat' ..."` in
English. The child is asked to complete a Malay sentence and then told the answer is famous
in English — the pedagogical logic no longer holds and the answer isn't actually derivable
in Malay.

**Fix:** Re-localise the explanation and `aiThinking` around a Malay pattern the child can
recognise (or pick a different well-known Malay sentence). At minimum remove the "in English"
justification and the leftover English `aiThinking` string so the feedback is internally
consistent. Same review applies to `ms/1-2-first-words.mdx:18` ("'Naga' paling masuk akal
kerana cerita biasanya tentang watak...") which is fine, but re-check remaining puzzles whose
correctness depended on an English idiom.

### WR-04: `settings-modal.tsx` hard-codes a locale list that has already drifted from the source of truth

**File:** `src/components/kids/layout/settings-modal.tsx:13-31`

**Issue:** `SUPPORTED_LOCALES` is a third hard-coded copy of the locale inventory. It now
contains 17 entries while `supportedLocales` in `src/lib/i18n/config.ts:5` and
`prompts.config.ts:38` contain 18 — `he` is a supported locale (has `messages/he.json`) but is
absent from the picker, so a Hebrew user can never select it. This phase correctly added `ms`
to the picker, but the underlying duplication means every future locale addition must be made
in three places and will silently drift again if forgotten.

**Fix:** Derive the picker from `supportedLocales`, keeping only a display-label/flag map:
```tsx
import { supportedLocales } from "@/lib/i18n/config";
const LOCALE_META: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇺🇸" },
  ms: { label: "Bahasa Melayu", flag: "🇲🇾" },
  // ...
};
const SUPPORTED_LOCALES = supportedLocales
  .filter((code) => code in LOCALE_META)
  .map((code) => ({ code, ...LOCALE_META[code] }));
```
Also add the missing `he` label/flag so the picker and the inventory stay aligned.

## Info

### IN-01: Settings `ms` test asserts compiled-MDX switch only via Section count (which equals `en`)

**File:** `src/__tests__/kids/settings-locale.test.tsx:191-194`

**Issue:** The `ms` case asserts the message bundle switched via the `ms`-only heading
`/Tetapan/` (a genuine discriminator), but then asserts the compiled MDX switched by checking
`section[data-section-index]` count equals `10` — which is also the `en` count. If the `ms`
MDX loader silently fell back to `en`, that assertion would still pass. The stronger
module-identity guard exists in `level-locale.test.tsx:88-109`, so overall coverage is
adequate, but this specific test does not independently prove the MDX changed to Malay.
**Fix:** Assert an `ms`-only string from the compiled content in the DOM (e.g. a Malay panel
string such as "Berjumpa Promi"), mirroring how the heading proves the bundle switch.

### IN-02: `ms` 4-1 world name says "Ngarai Cipta" in the intro only; keep consistent with WR-01 fix

**File:** `src/content/kids/ms/4-1-pretend-time.mdx:3`

**Issue:** Grouped under WR-01 but noted separately because the intro panel is the first
user-visible string for that world; ensure the WR-01 fix covers intro panels and not just
`LevelComplete` messages.
**Fix:** Apply the chosen World-4 name uniformly across `4-1`..`4-4`.

### IN-03: `prompts.config.ts` / `config.ts` locale arrays are duplicated literal lists

**File:** `prompts.config.ts:38`, `src/lib/i18n/config.ts:5`

**Issue:** The supported-locale array is maintained in two files with a "keep in sync"
comment but no enforcement. `ms` was added to both correctly this phase, but the duplication is
a standing drift risk (compounded by the third copy in `settings-modal.tsx`, WR-04).
**Fix:** Have `prompts.config.ts` import `supportedLocales` from `src/lib/i18n/config.ts`
(or vice-versa) and add a unit test asserting the two arrays are equal, so a future locale
addition cannot land in only one place.

---

_Reviewed: 2026-11-05_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_