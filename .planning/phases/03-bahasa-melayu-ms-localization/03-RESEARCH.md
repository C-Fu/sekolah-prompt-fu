# Phase 3: Bahasa Melayu (`ms`) Localization - Research

**Researched:** 2026-11-05
**Domain:** next-intl client-side localization + MDX content localization (Next.js 16 static export)
**Confidence:** HIGH

## Summary

Contrary to `STATE.md`'s claim that "support for Bahasa Melayu (`ms`) added across UI and all 17 MDX levels," the current codebase contains **no `ms` support whatsoever**. Exhaustive verification:
- `src/lib/i18n/config.ts:5` — `supportedLocales` has 17 entries, **no `ms`**.
- `messages/` — 17 JSON files, **no `ms.json`** (only `en, tr, es, zh, ja, ar, pt, fr, it, de, nl, ko, ru, he, el, fa, az`).
- `src/content/kids/` — 16 locale directories, **no `ms/`**.
- `src/lib/kids/level-content.ts` — `loaders` map keyed by 16 locales, **no `ms`**.
- `src/components/kids/layout/settings-modal.tsx:13-30` — `SUPPORTED_LOCALES` UI list has **16 entries** (missing both `he` and `ms`).
- `grep -rn '"ms"\|Bahasa\|Melayu' src` — **zero matches**.
- `git log --all -- 'src/content/kids/ms/**' 'messages/ms.json'` — **no history**; `ms` was never committed.

So Phase 3 is **greenfield localization work**, not a completion/verification of prior work. The phase must add `ms` in **five** coordinated locations, author a complete `messages/ms.json`, and author 19 localized MDX files (not 17 — see the count discrepancy below). All of these must be produced *from scratch*; the only existing translations are the 16 non-English locales already present.

The single most important structural fact for planning: the pipeline has **four independent registries that must stay in sync** (`supportedLocales`, `messageLoaders`, `level-content` `loaders`, and the settings-modal `SUPPORTED_LOCALES`), plus the `prompts.config.ts` i18n list that mirrors `supportedLocales`. A missing/typo'd entry in any one of them produces a silent English fallback rather than an error, so the plan must include an explicit consistency check. A second key fact: existing translated locales demonstrate that MDX translations are **not required to be structurally 1:1** with English (en `1-1` has 10 `<Section>` blocks; es/fr/de/ja/zh/ar `1-1` have 7). The interactive-section locking engine keys completions by the **ordered Section index within the active locale**, so a translated level may legitimately have a different Section count — but any locale change invalidates index-based completions to fail safe (already implemented in `transitionLocale`).

**Primary recommendation:** Treat Phase 3 as authoring work gated by a mechanical registry-consistency contract, not as a code-architecture change. Add the `ms` code string to the four/five registries, produce `messages/ms.json` with the **exact 322-key shape of `en.json`** (verify with `scripts/check-translations.js`), author 19 `src/content/kids/ms/*.mdx` files mirroring the component vocabulary of `en/`, then wire `ms` into `level-content.ts`, and add a regression test that `loadLevelContent("ms", slug)` returns `effectiveLocale: "ms"` (not the `en` fallback).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Locale registry / validation | Build-time config (`src/lib/i18n/config.ts`, `prompts.config.ts`) | — | Pure module, no request-time access (Phase 1 removed server locale resolution) |
| Message bundle delivery | Static asset (`messages/*.json`, bundled via `messageLoaders`) | Browser (next-intl provider) | Every locale's JSON is statically importable; the runtime only indexes a validated key |
| Locale switching UX | Browser/Client (`settings-modal.tsx` → `Providers` context) | localStorage | Client-owned preference signal; no navigation, no server |
| Localized MDX content | Static asset (`src/content/kids/<locale>/*.mdx`) | Browser (lazy `import()` map) | MDX compiled at build; selected client-side by validated `(locale, slug)` |
| Section locking / progression | Browser (LevelProvider + Section registry) | localStorage | Identity-scoped to resolved document-order Section index |
| Language list presentation | Browser (`settings-modal.tsx` `SUPPORTED_LOCALES`) | — | Static UI array independent of the i18n config (a known drift risk) |

## Standard Stack

This phase introduces **no new dependencies**. It uses the exact stack already pinned in `package.json` (verified this session).

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | ^4.5.8 | Message loading + `NextIntlClientProvider` | Already integrated (Phase 1); the switcher depends on it |
| next | ^16.0.10 | Static export (`output: 'export'`), MDX | Project framework |
| react / react-dom | 19.2.0 | UI | Project framework |
| @next/mdx + @mdx-js/loader | ^16.1.1 / ^3.1.1 | Compile `src/content/kids/ms/*.mdx` | Registry in `mdx-components.tsx` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| vitest | ^2.1.8 | Regression tests for locale selection | Extend `level-locale.test.tsx` pattern |
| picocolors | ^1.1.1 | Output coloring in `scripts/*.js` | Consistency-check script (optional) |

**Installation:** none — no `npm install` required. Reproduce the baseline with the existing scripts only:
```bash
npm run test        # vitest run  — baseline 89/89 pass
npx tsc --noEmit    # baseline 0 errors
npm run lint        # eslint      — baseline 0
npm run build       # next build  — static export to out/
node scripts/check-translations.js  # key-parity check (currently reports 16 langs)
```

**Version verification:** No packages added, so no registry lookup is required. The `## Package Legitimacy Audit` section is therefore **not applicable** to this phase (it installs nothing). This is a deliberate omission, not an oversight.

## Package Legitimacy Audit

**Not applicable** — Phase 3 installs no external packages; it is pure authoring + registry-wiring using the already-locked dependency set from Phase 1's prune (lockfile `--package-lock-only`, 826 packages). No `npm install` step belongs in any Phase 3 plan.

## Architecture Patterns

### System Architecture Diagram

```
User taps a language button in SettingsModal
        │
        ▼
handleLanguageChange(code)                 [src/components/kids/layout/settings-modal.tsx]
        │  (SUPPORTED_LOCALES list — 4th registry; add ms here)
        ▼
localePreference.setUserLocale(code)       [Providers context]
        │
        ▼
transitionLocale(code, current)            [src/lib/i18n/client.ts]
        │  ├─ isSupportedLocale(code)?     [supportedLocales — registry #1; add ms here]
        │  ├─ if changed → invalidateLocaleIncompatibleInteractions()
        │  │     (clears locale-incompatible useId drafts + index Section completions;
        │  │      NEVER touches kids-progress / sound; fails closed on storage denial)
        │  └─ writePersistedLocale(code)   [localStorage: kids-locale-preference]
        ▼
loadMessages(code)                          [src/lib/i18n/client.ts]
        │  indexed by messageLoaders map    (registry #2; add ms → import ms.json)
        ▼
setState({ locale, messages })              [Providers — atomic switch]
        │
        ├─► NextIntlClientProvider re-renders UI strings  (messages/ms.json — NEW FILE)
        │
        └─► LevelContentWrapper re-renders compiled MDX
                 │
                 ▼
            loadLevelContent(locale, slug)   [src/lib/kids/level-content.ts]
                 │  loaders[locale][slug]    (registry #3; add 19 ms entries)
                 │  fallback → en ONLY when the ms module is absent
                 ▼
            compiled src/content/kids/ms/<slug>.mdx  (19 NEW FILES)
                 │
                 ▼
            <Section> blocks register ordered indices; interactive children
            (WordPredictor, PromptVsMistake, MagicWords, DragDropPrompt,
             PromptParts, ExampleMatcher, PromptDoctor, StepByStep, PromptLab)
            lock/complete against their OWN Section index (fail closed)
```

### Recommended Project Structure (new files only)
```
messages/
└── ms.json                      # NEW — 322-key shape identical to en.json

src/content/kids/
└── ms/                          # NEW — 19 .mdx files
    ├── 1-1-meet-promi.mdx
    ├── 1-2-first-words.mdx
    ├── 1-3-being-clear.mdx
    ├── 2-1-missing-details.mdx
    ├── 2-2-who-and-what.mdx
    ├── 2-3-when-and-where.mdx
    ├── 2-4-detail-detective.mdx
    ├── 3-1-setting-the-scene.mdx
    ├── 3-2-show-dont-tell.mdx
    ├── 3-3-format-finder.mdx
    ├── 3-4-context-champion.mdx
    ├── 4-1-pretend-time.mdx
    ├── 4-2-story-starters.mdx
    ├── 4-3-character-creator.mdx
    ├── 4-4-world-builder.mdx
    ├── 5-1-perfect-prompt.mdx
    ├── 5-2-fix-it-up.mdx
    ├── 5-3-prompt-remix.mdx
    └── 5-4-graduation-day.mdx
```

Files to **edit** (registries):
- `src/lib/i18n/config.ts` — add `"ms"` to `supportedLocales`
- `prompts.config.ts` — add `"ms"` to `i18n.locales` (comment says "keep in sync with src/lib/i18n/config.ts")
- `src/lib/i18n/client.ts` — add `ms: () => import("@/../messages/ms.json")` to `messageLoaders`
- `src/lib/kids/level-content.ts` — add 19 `L_ms__*` loaders + `ms: { ... }` loaders entry
- `src/components/kids/layout/settings-modal.tsx` — add `{ code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" }` to `SUPPORTED_LOCALES`

### Pattern 1: Registry-consistency contract (the core risk of this phase)
**What:** Five separate lists must agree that `ms` is supported. Miss one → silent English fallback (never a thrown error), because `loadMessages` and `loadLevelContent` both fall back to `en` on a missing entry.
**When to use:** Every task that touches a registry.
**Why it matters:** `settings-modal.tsx` `SUPPORTED_LOCALES` (16 entries) is **already out of sync** with `supportedLocales` (17 — it omits `he`). A plan that only "adds ms" without auditing this drift will ship a selector that lists a language whose messages may not load, or omit a newly supported one.
**Enforcement:** the plan MUST include a mechanical check (see Code Examples) plus `node scripts/check-translations.js`.

### Pattern 2: MDX authoring mirrors the component vocabulary, not the section count
**What:** Each `en` level composes `Section`, `Panel`, `PromptVsMistake`, `MagicWords`, `DragDropPrompt`, `LevelComplete`, `WordPredictor`, `StepByStep`, `PromptParts`, `PromptLab`, `PromptDoctor`, `ExampleMatcher`. Component-name usage across `en/` is VERIFIED below.
**When to use:** Every `ms` MDX file.
**Rule:** Reuse the *same components with the same props contract* as `en`, but the number of `<Section>` blocks may differ (es/fr/de/ja/zh/ar all use 7 for `1-1` where en uses 10). The section-lock engine tolerates any section count — but `LevelComplete` must exist in a final Section so the map link renders (see `level-locale.test.tsx:307-355`).

### Anti-Patterns to Avoid
- **Authoring `ms` MDX with English JSON props left untranslated:** interactive components take their *content* from MDX props (e.g. `question`, `good`, `bad`, `explanation`, `sentence`, `options`, `correctAnswer`) AND their *chrome* from `messages/kids.*`. Both must be translated. Leaving MDX props in English while translating only `ms.json` produces a half-localized level.
- **Assuming 1:1 section/prop parity with `en`:** translations legitimately restructure; correctness is "the interactive component still locks until solved and `LevelComplete` ends the level", not "same section count".
- **Editing `src/lib/i18n/request.ts` import template:** it uses `import(\`@/../messages/${locale}.json\`)` with `locale` pinned to `defaultLocale` — no per-locale edit needed there; adding a file is sufficient for the request path (though the client path uses the explicit `messageLoaders` map).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Locale validation | Custom string checks | `isSupportedLocale` / `resolveSupportedLocale` (`src/lib/i18n/client.ts:49-56`) | Already threat-hardened (T-01-16) against path injection via validated indexing |
| Locale persistence + invalidation | New localStorage schema | `transitionLocale` + `writePersistedLocale` | Handles fail-closed invalidation semantics and never wipes kids-progress/sound |
| Message loading | `fetch('/messages/ms.json')` | `messageLoaders` bounded `import()` map | Static export has no server; only bundled `import()` works under `output:'export'` |
| MDX locale selection | Dynamic `import()` template with `locale` interpolated | Add entries to the static `loaders` map in `level-content.ts` | A runtime-interpolated path breaks the statically-analyzable bundler trace and the T-01-14 bound |
| Translation key-parity checking | Hand-diff the JSON | `node scripts/check-translations.js` | Already reports missing/extra keys vs `en.json` for every non-en file |

**Key insight:** The infrastructure to *switch* to `ms` already exists and is hardened — Phase 3's only job is to *register* `ms` and *author* its content. Any bespoke loading/validation code would duplicate (and likely weaken) Phase 1's threat-modeled seams.

## Runtime State Inventory

> This is **NOT** a rename/refactor phase — it is additive localization. There is no string being renamed, so most categories are genuinely empty. Explicitly answered below per protocol.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no DB (Phase 1 removed Prisma/Postgres). Only additive new statics. | None |
| Live service config | None — no external services; static GitHub Pages only. | None |
| OS-registered state | None — no scheduler/services/plists. | None |
| Secrets/env vars | None — `.env.example` reduced to `NEXT_PUBLIC_SITE_URL` only (Phase 1); no locale-keyed secrets. | None |
| Build artifacts | `out/` (static export) and `messages/*.json` are build inputs, not state. A stale `out/` from Phase 2 will not include `ms`; it is regenerated by `npm run build`. | Rebuild `out/` (Phase 4 does full-build certification); no migration |
| *(extra: localStorage)* | Existing users may hold `kids-locale-preference` values from the 16 current locales. Adding `ms` introduces a **new valid value**; `isSupportedLocale` gates it, so no migration is needed. Old preferences remain valid. | None — additive enum extension |

**Canonical question — "After the repo is updated, what runtime systems still have the old state?"** Answer: none. `ms` is purely additive; no existing key, collection, or registration references it (verified via `grep -rn '"ms"' src` → 0 matches, and no git history).

## Common Pitfalls

### Pitfall 1: Silent English fallback masks a missing registry entry
**What goes wrong:** You author `messages/ms.json` and `src/content/kids/ms/*.mdx` but forget one of the five registries; the app still loads, showing English, and no error is raised.
**Why it happens:** `loadMessages` catches import failure and falls back to `en` (`client.ts:84-89`); `loadLevelContent` falls back to `en` when the locale module is absent (`level-content.ts:704-710`).
**How to avoid:** Add a test asserting `loadLevelContent("ms", slug).effectiveLocale === "ms"` and `loadMessages("ms").common.loading !== en.common.loading`. Assert `supportedLocales.includes("ms")` and that the settings modal renders an "Bahasa Melayu" button that actually switches `useLocale()`.
**Warning signs:** `effectiveLocale` is `"en"` for an `ms` request; `document.querySelectorAll("section[data-section-index]")` count matches `en` exactly.

### Pitfall 2: The pre-existing `SUPPORTED_LOCALES` ↔ `supportedLocales` drift
**What goes wrong:** The settings modal's list (16) does not equal `supportedLocales` (17) today — `he` is selectable in neither, and there is a risk of adding `ms` inconsistently.
**Why it happens:** The UI array (`settings-modal.tsx:13-30`) is hand-maintained and duplicated from the config.
**How to avoid:** Audit and reconcile in the same plan. Decide explicitly whether to also surface `he` (which has UI messages but no MDX content — a valid English-fallback case per `level-locale.test.tsx:87-93`). At minimum, add `ms` to both.
**Warning signs:** A language button exists whose code is not in `supportedLocales`, or a supported locale has no button.

### Pitfall 3: Translating `messages/ms.json` incompletely
**What goes wrong:** Missing keys fall through to `getMessageFallback` which renders the raw key `namespace.key` (e.g. `kids.map.title`) to children — a visible bug.
**Why it happens:** `request.ts:46-48` returns `${namespace}.${key}` for missing messages instead of the English text.
**How to avoid:** Match `en.json`'s **322-key** shape exactly and run `node scripts/check-translations.js` — it lists every missing/extra key per language. Also note interactive components pull from namespaces `kids.quiz`, `kids.magicWords`, `kids.dragDrop`, `kids.promptParts`, `kids.exampleMatcher`, `kids.promptDoctor`, `kids.stepByStep`, `kids.promptLab`, `kids.wordPredictor`, `kids.levelComplete`, `kids.settings`, `kids.navigation`.
**Warning signs:** Raw dot-notation strings rendered in the UI; the check script reports missing keys under `MS`.

### Pitfall 4: MDX JSX syntax errors break the static build
**What goes wrong:** A malformed `ms` MDX file (unclosed tag, bad attribute quoting, unescaped `{`/`}` in prose) fails `next build`.
**Why it happens:** MDX is compiled at build; a single bad file fails the whole static export.
**How to avoid:** Run `npm run build` after authoring; if useful, run `node scripts/lint-mdx.js` (note: it currently targets `src/content/book` — which Phase 1 deleted — so its path may need updating or it may be a no-op; verify before relying on it).
**Warning signs:** `next build` error pointing at a `sqlite`/MDX parse location in `src/content/kids/ms/`.

### Pitfall 5: Assuming 19 files when requirements say "17"
**What goes wrong:** Scope confusion — the ROADMAP/REQUIREMENTS say "17 MDX levels" but the actual registry has **19** slugs across **5 worlds**.
**Why it happens:** STATE.md (01-07) already flagged this: "All 19 kids levels preserved (requirements prose says 17)."
**How to avoid:** Author **19** files (one per slug in `src/lib/kids/levels.ts`). The `generateStaticParams` test asserts exactly 19 slugs (`level-locale.test.tsx:59-65`). Treat "17" as stale prose; 19 is the code-of-record.
**Warning signs:** A level that shows English content in `ms`, or a `loadLevelContent("ms", <slug>)` that returns `null`.

### Pitfall 6: MDX translations structurally diverging so `LevelComplete` is missing
**What goes wrong:** A translated level's interactive lock never unlocks (no `LevelComplete`), or the final section lacks the map link.
**Why it happens:** The section-lock engine requires the interactive section to register completion; the map link only appears on the last section when there is no trailing interactive section.
**How to avoid:** Preserve the interactive-component ↔ `LevelComplete` pairing per level as in `en`. Keep `LevelComplete levelSlug="..."` values matching the real slugs.
**Warning signs:** A stuck "Next" disabled on the last section; no map link at level end.

## Code Examples

### Registry edits (exact shapes to match)

**`src/lib/i18n/config.ts`** — append `"ms"` to the array (line 5) `[VERIFIED: src/lib/i18n/config.ts:5]`:
```ts
export const supportedLocales = ["en", "tr", "es", "zh", "ja", "ar", "pt", "fr", "it", "de", "nl", "ko", "ru", "he", "el", "fa", "az", "ms"];
```

**`prompts.config.ts`** — mirror the same list `[VERIFIED: prompts.config.ts:38]`:
```ts
i18n: {
  locales: ["en", "tr", "es", "zh", "ja", "ar", "pt", "fr", "it", "de", "nl", "ko", "ru", "he", "el", "fa", "az", "ms"],
  defaultLocale: "en",
},
```

**`src/lib/i18n/client.ts`** — add to `messageLoaders` (after the `az` entry at line 45) `[VERIFIED: src/lib/i18n/client.ts:28-46]`:
```ts
  az: () => import("@/../messages/az.json"),
  ms: () => import("@/../messages/ms.json"),
};
```

**`src/components/kids/layout/settings-modal.tsx`** — add to `SUPPORTED_LOCALES` `[VERIFIED: src/components/kids/layout/settings-modal.tsx:13-30]`:
```ts
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
```
(Note: Malay is spoken in Malaysia, Indonesia, Brunei, Singapore; 🇲🇾 is the conventional flag choice. This is a UX choice — confirm during discuss if a different flag is preferred.)

**`src/lib/kids/level-content.ts`** — add 19 loader defs plus the map entry `[VERIFIED: src/lib/kids/level-content.ts:339-676]`:
```ts
const L_ms__1_1_meet_promi = () => import("@/content/kids/ms/1-1-meet-promi.mdx");
// …18 more, one per slug…
const loaders: Record<string, Record<string, () => Promise<{ default: CompiledLevelContent }>>> = {
  // …
  ms: {
    "1-1-meet-promi": L_ms__1_1_meet_promi,
    // …18 more…
  },
};
```
All 19 slugs (verbatim from `src/lib/kids/level-content.ts:341-359`): `1-1-meet-promi`, `1-2-first-words`, `1-3-being-clear`, `2-1-missing-details`, `2-2-who-and-what`, `2-3-when-and-where`, `2-4-detail-detective`, `3-1-setting-the-scene`, `3-2-show-dont-tell`, `3-3-format-finder`, `3-4-context-champion`, `4-1-pretend-time`, `4-2-story-starters`, `4-3-character-creator`, `4-4-world-builder`, `5-1-perfect-prompt`, `5-2-fix-it-up`, `5-3-prompt-remix`, `5-4-graduation-day`.

### MDX level shape (from `en/1-1-meet-promi.mdx`) `[VERIFIED: src/content/kids/en/1-1-meet-promi.mdx]`
Sections wrap panels/interactives/drills, ending in a final section with `LevelComplete`:
```mdx
<Section>
<Panel character="promi" mood="happy">
Hi there! I'm **Promi** 🤖, your robot friend! I'm so happy to meet you!
</Panel>
</Section>

<Section>
## How Do I Think? 🧠
<WordPredictor
  title="Think Like AI!"
  instruction="I read patterns and guess the next word. What would YOU guess?"
  sentence="The cat sat on the ___"
  options={["mat", "moon", "purple", "keyboard"]}
  correctAnswer="mat"
  explanation="'Mat' is the most common word that follows 'The cat sat on the' because it's a famous rhyme! AI learns these patterns from reading lots of text."
  aiThinking="I've seen 'The cat sat on the mat' many times before..."
  successMessage="You think like AI! I pick the most likely word based on patterns."
/>
</Section>

<Section>
## You Did It! 🎉
<Panel character="promi" mood="celebrating">
Amazing job! You learned what AI is and what a prompt is.
</Panel>
<LevelComplete
  levelSlug="1-1-meet-promi"
  stars={3}
  message="You learned what AI and prompts are!"
/>
</Section>
```

### Component vocabulary across all `en` levels (VERIFIED by grep)
`[VERIFIED: src/content/kids/en/*.mdx]` — counts: `<Section>` ×160, `<Panel>` ×62, `<PromptVsMistake>` ×38, `<LevelComplete>` ×19, `<MagicWords>` ×18, `<DragDropPrompt>` ×16, `<WordPredictor>` ×3, `<StepByStep>` ×1, `<PromptParts>` ×1, `<PromptLab>` ×1, `<PromptDoctor>` ×1, `<ExampleMatcher>` ×1.
Translation namespaces the interactive components consume `[VERIFIED: src/components/kids/elements/*.tsx]`:
| Component | `useTranslations` namespace |
|-----------|------------------------------|
| ExampleMatcher | `kids.exampleMatcher` |
| MagicWords | `kids.magicWords` |
| WordPredictor | `kids.wordPredictor` |
| DragDropPrompt | `kids.dragDrop` |
| PromptParts | `kids.promptParts` |
| PromptDoctor | `kids.promptDoctor` |
| PromptLab | `kids.promptLab` |
| StepByStep | `kids.stepByStep` |
| PromptVsMistake | `kids.quiz` |
| LevelComplete | `kids` |

### Regression test pattern (extend `src/__tests__/kids/level-locale.test.tsx`)
The existing suite mocks `next-intl` and asserts locale selection. Add cases mirroring `[VERIFIED: src/__tests__/kids/level-locale.test.tsx:78-93]`:
```ts
it("selects ms content (not the en fallback) when the ms module exists", async () => {
  const en = await loadLevelContent("en", "1-1-meet-promi");
  const ms = await loadLevelContent("ms", "1-1-meet-promi");
  expect(ms?.effectiveLocale).toBe("ms");
  expect(ms?.Component).not.toBe(en?.Component);
});

it("loads a bounded ms message bundle", async () => {
  const en = await loadMessages("en");
  const ms = await loadMessages("ms");
  expect((ms.common as { loading: string }).loading).not.toBe(
    (en.common as { loading: string }).loading
  );
});
```
Also assert `supportedLocales.includes("ms")` and that the SettingsButton renders and activates the "Bahasa Melayu" button (mirror `settings-locale.test.tsx:131-168`).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Cookie + hard-reload locale switcher | Client `Providers` context + localStorage, atomic messages+MDX switch | Phase 1 (01-17) | Adding a locale now means *registering*, never touching request-time locale logic |
| Request-time locale read (`getRequestConfig` reads cookie/header) | Deterministic default locale; no request-time read | Phase 1 | `src/i18n/request.ts` needs **no** edit to add `ms` |
| English-only MDX under a runtime-interpolated import | Static, bounded `loaders` map + English fallback | Phase 1 (01-15) | `ms` must be registered explicitly or it silently falls back |

**Deprecated/outdated:**
- `setLocale` / `getLocaleClient` in `client.ts` are `@deprecated` shims; do not use for `ms` — use `Providers.setUserLocale`.
- ROADMAP/REQUIREMENTS "17 MDX levels" is stale prose; code-of-record is 19 (per `generateStaticParams` test).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The `ms` locale label should be "Bahasa Melayu" with flag 🇲🇾 | Code Examples | Minor UX; a different label/flag may be preferred (Indonesia uses "Bahasa Indonesia" with 🇮🇩). **Confirm in discuss-phase.** |
| A2 | "ms" should map to Malay (`ms` ISO 639-1) and, being LTR, needs **no** `rtlLocales` change | Standard Stack / Config | If the intent were Indonesian (`id`) or Jawi script, the code and direction handling would differ. `ms` in Latin script is LTR — correct as stated, but confirm the target language variant |
| A3 | `scripts/lint-mdx.js` targets the deleted `src/content/book` dir and may not validate kids MDX | Common Pitfalls | If relied upon as a gate and it no-ops, syntax errors slip to `next build`. Verify or supplement with a direct build check |
| A4 | Requirements' "17 levels" is stale, actual is 19 | Summary / Pitfalls | If the intent is genuinely to ship only 17, mapping which 2 to omit requires user input. State.md (01-07) already established 19 is correct |

**If this table is empty:** n/a — see above.

## Open Questions (RESOLVED)

1. **Should `he` also be reconciled into the settings selector while adding `ms`?** — **RESOLVED (D-02):** No. Phase 3 adds `ms` ONLY; do NOT add a `he` button, and do not otherwise change `he` behavior. The pre-existing `settings-modal.tsx` drift (16 entries, no `he`; `supportedLocales` has 17 incl. `he`; `he` has no MDX dir → English fallback by design) is documented as a known out-of-scope note. This is asserted negatively in 03-01 Task 1 (`if(/code:\s*"he"/.test(sm)) throw`).
   - What we knew: `supportedLocales` had 17 (incl. `he`), `settings-modal.tsx` listed 16 (no `he`), and `he` had no MDX content dir.
   - Resolution: User locked `ms`-only scope (D-02); `he` drift left untouched.

2. **Target Malay variant / script for terminology.** — **RESOLVED (D-01):** Use Bahasa Melayu (Malaysia), Latin script (LTR; no `rtlLocales` change), in a kid-simple register for ages 8-14 with accurate, consistent terminology. Keep the loanword "prompt" where a native term (`gesaan`) would confuse a young learner. Label "Bahasa Melayu", flag 🇲🇾. Applied across `messages/ms.json` and every `src/content/kids/ms/*.mdx`.
   - What we knew: `ms` is Malay; the game teaches prompt engineering to children 8-14.
   - Resolution: User selected Malaysian variant + loanword policy (D-01).

3. **Do translated `ms` MDX levels aim for section-parity with `en` or may they restructure?** — **RESOLVED (D-01):** Mirror `en` structure closely (1:1 section order/count) for reviewability; the engine does not require it, but strict parity is the authored contract (e.g. tracer 1-1 = 10 Sections, asserted in 03-01 Task 2).
   - What we knew: es/fr/de/ja/zh/ar use fewer sections than `en` for `1-1` and still work.
   - Resolution: User chose strict mirror-the-`en`-structure for reviewability (D-01).

## Environment Availability

> Phase has no external tool dependencies beyond the project's own toolchain.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | build/test | ✓ | v24.15.0 | — (`engines.node: 24.x`) |
| npm | scripts | ✓ | 11.12.1 | — |
| next / next-intl / @next/mdx | the app | ✓ | already in `node_modules` | — |
| vitest | regression tests | ✓ | ^2.1.8 | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none. (No install step required.)

## Validation Architecture

> `workflow.nyquist_validation` is not explicitly `false` in `.planning/config.json` (key absent) → this section is included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest ^2.1.8 + @testing-library/react ^16.1.0 (jsdom ^25) |
| Config file | `vitest.config.ts` (+ `vitest.setup.ts`) |
| Quick run command | `npx vitest run src/__tests__/kids/level-locale.test.tsx src/__tests__/kids/settings-locale.test.tsx` |
| Full suite command | `npm run test` (baseline: 89/89 pass) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FR-3a | `ms` in `supportedLocales` + settings selector shows & activates "Bahasa Melayu" | unit/integration | `npx vitest run src/__tests__/kids/settings-locale.test.tsx` | ❌ Wave 0 (new case) |
| FR-3b | `messages/ms.json` complete (322-key parity) | static check | `node scripts/check-translations.js` (assert no MS section) | ✓ script exists; MS file ❌ Wave 0 |
| FR-3c | `loadLevelContent("ms", slug)` returns `effectiveLocale: "ms"` for all 19 slugs | unit | `npx vitest run src/__tests__/kids/level-locale.test.tsx` | ❌ Wave 0 (new cases) |
| FR-3d | `loadMessages("ms")` returns the ms bundle (not `en`) | unit | same file | ❌ Wave 0 (new case) |
| FR-3e | Static build compiles all `ms` MDX; `out/` includes ms level pages | build | `npm run build` | ✓ (invoked) |
| NFR-2 | tsc/lint/tests green | gate | `npx tsc --noEmit && npm run lint && npm run test` | ✓ |

### Sampling Rate
- **Per task commit:** `npx vitest run` (fast subset or full) — target < 30s.
- **Per wave merge:** `npx tsc --noEmit && npm run lint && npm run test && node scripts/check-translations.js`.
- **Phase gate:** Full suite green + `npm run build` succeeds + `out/` contains ms level routes before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `src/__tests__/kids/level-locale.test.tsx` — add `ms` selection + message-bundle cases (covers FR-3c, FR-3d).
- [ ] `src/__tests__/kids/settings-locale.test.tsx` — add `ms` button activation case (covers FR-3a).
- [ ] `messages/ms.json` — the parity check needs the file to exist (FR-3b).
- [ ] Framework install: none — existing infrastructure covers the rest.

## Security Domain

> `security_enforcement` is enabled (absent in config = enabled).

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | no auth (Phase 1 removed NextAuth) |
| V3 Session Management | no | no sessions; localStorage only |
| V4 Access Control | no | no server, no privileged resources |
| V5 Input Validation | yes | Validate every untrusted locale candidate against `supportedLocales` before indexing any message/MDX import (`isSupportedLocale`, `resolveSupportedLocale`, `loadLevelContent`'s `isSupportedLocale` gate). The `ms` addition must NOT introduce a runtime-interpolated import path. |
| V6 Cryptography | no | none introduced |

### Known Threat Patterns for {Next.js static + next-intl + MDX}
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Path traversal via a crafted locale value (e.g. `"../evil"`) | Tampering | Already mitigated: buttons pass fixed codes; runtime validates against `supportedLocales` before indexing bounded import maps (T-01-16 / T-01-14). Keep the `ms` entry in the *static* map — never build an import path from the locale string. |
| Prototype pollution via JSON message keys | Tampering | `messages/ms.json` is a static bundled asset authored in-repo; no untrusted JSON. Keep it a static module, not fetched. |
| XSS via translated MDX content | Tampering | MDX compiled at build; author content only, no `dangerouslySetInnerHTML`. Do not introduce raw HTML/scripts in `ms` MDX. |
| Missing-message disclosure (`namespace.key` rendered) | Information Disclosure | Low; `getMessageFallback` echoes key names. Avoid by completing the bundle (FR-3b). |

**Security note:** The only security-relevant action in this phase is *not weakening* the existing validated, bounded import-map pattern when registering `ms`. No new attack surface is introduced by adding a locale.

## Sources

### Primary (HIGH confidence)
- In-repo source of truth, read this session:
  - `src/lib/i18n/config.ts:1-24` — `supportedLocales`, `defaultLocale`, `rtlLocales`
  - `src/lib/i18n/client.ts:1-160` — `messageLoaders`, validation, `transitionLocale`
  - `src/i18n/request.ts:1-50` — deterministic default + fallback
  - `src/lib/kids/level-content.ts:1-728` — 16-locale `loaders` map, English fallback
  - `src/components/kids/layout/settings-modal.tsx:13-30` — `SUPPORTED_LOCALES` (16 entries)
  - `src/components/providers/index.tsx:1-141` — atomic locale/messages switch
  - `prompts.config.ts:37-40` — i18n list mirror
  - `messages/en.json:1-322` — 322-key message shape
  - `src/content/kids/en/*.mdx` — 19 levels, component vocabulary
  - `src/__tests__/kids/level-locale.test.tsx:1-1075`, `settings-locale.test.tsx:1-326` — test contracts
  - `scripts/check-translations.js`, `package.json`, `next.config.ts`, `.github/workflows/deploy.yml`

### Secondary (MEDIUM confidence)
- `STATE.md` line 25 (claim of prior `ms` support) — **CONTRADICTED** by direct inspection; treat as stale/aspirational.
- `REQUIREMENTS.md` FR-3 ("17 MDX levels") — **CONTRADICTED** by 19-slug registry; per STATE.md 01-07.

### Tertiary (LOW confidence)
- None — no external/web sources were needed; this phase is fully answerable from the repo.

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH — no new deps; all versions verified from `package.json`/`node_modules` this session.
- Architecture: HIGH — all four registry sites and the fallback paths were read verbatim.
- Pitfalls: HIGH — derived from actual code behavior (silent fallbacks, fallback message rendering) and existing test contracts.

**Research date:** 2026-11-05
**Valid until:** 2027-01-04 (stable, in-repo; re-check only if the i18n/level-content architecture changes)