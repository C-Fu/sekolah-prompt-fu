# Phase 3: Bahasa Melayu (`ms`) Localization - Pattern Map

**Mapped:** 2026-11-05
**Files analyzed:** 5 modified registries + 3 new artifact groups + 2 modified test files
**Analogs found:** all registry edits have an exact in-file analog; all authored artifacts have an exact `en` analog

> **Scope note (from RESEARCH.md):** This phase is *additive authoring + registry wiring*, not a code-architecture change. Every registry edit copies the **existing `en` (or sibling-locale) entry in the same file**. Every authored artifact copies the **`en` artifact of the same shape** (`messages/en.json`, `src/content/kids/en/<slug>.mdx`). No new patterns are introduced.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/lib/i18n/config.ts` (edit) | config | transform (static array) | same file — existing `"az"` array entry (line 5) | exact |
| `prompts.config.ts` (edit) | config | transform (static array) | same file — `i18n.locales` array (line 38) | exact |
| `src/lib/i18n/client.ts` (edit) | config / provider | request-response (dynamic import) | same file — `az:` entry in `messageLoaders` (line 45) | exact |
| `src/lib/kids/level-content.ts` (edit) | service / registry | file-I/O (static dynamic import map) | same file — `az` loader defs (lines 53–71) + `az` map block (lines 361–381) | exact |
| `src/components/kids/layout/settings-modal.tsx` (edit) | component | request-response (UI state) | same file — `SUPPORTED_LOCALES` entries (lines 13–30) | exact |
| `messages/ms.json` (new) | config (message bundle) | transform (static JSON) | `messages/en.json` | exact |
| `src/content/kids/ms/*.mdx` (new, 19 files) | component (MDX content) | request-response (compiled MDX render) | `src/content/kids/en/*.mdx` (structure) + `src/content/kids/es/1-1-meet-promi.mdx` (translated shape) | exact |
| `src/__tests__/kids/level-locale.test.tsx` (edit) | test | request-response | same file — "selects locale-specific content" case (lines 78–85) | exact |
| `src/__tests__/kids/settings-locale.test.tsx` (edit) | test | request-response | same file — "switches UI messages …" case (lines 131–168) | exact |

> **Tracked-source gate (#3645):** All named analog paths below verified git-tracked via `git ls-files -- <path>` (non-empty). None are gitignored install/runtime mirrors.

---

## Pattern Assignments

### `src/lib/i18n/config.ts` (config, transform)

**Analog:** same file, existing array entry.

**Registry pattern** (lines 4–5):
```ts
// Supported locales - keep in sync with prompts.config.ts
export const supportedLocales = ["en", "tr", "es", "zh", "ja", "ar", "pt", "fr", "it", "de", "nl", "ko", "ru", "he", "el", "fa", "az"];
```
→ Append `"ms"` to the end of the array. Keep the `// keep in sync with prompts.config.ts` comment intact.

**Do NOT touch** `rtlLocales` (line 9) — `ms` is Latin-script LTR.

---

### `prompts.config.ts` (config, transform)

**Analog:** same file, existing `i18n.locales` array.

**Registry pattern** (lines 36–40):
```ts
  // Internationalization - keep in sync with src/lib/i18n/config.ts.
  i18n: {
    locales: ["en", "tr", "es", "zh", "ja", "ar", "pt", "fr", "it", "de", "nl", "ko", "ru", "he", "el", "fa", "az"],
    defaultLocale: "en",
  },
```
→ Append `"ms"` to the array so it matches `supportedLocales` exactly.

---

### `src/lib/i18n/client.ts` (config/provider, request-response)

**Analog:** same file, `az:` entry in `messageLoaders`.

**Bounded import-map pattern** (lines 28–46):
```ts
const messageLoaders: Record<string, () => Promise<{ default: unknown }>> = {
  en: () => import("@/../messages/en.json"),
  // …
  az: () => import("@/../messages/az.json"),
};
```
→ Add after the `az` line:
```ts
  ms: () => import("@/../messages/ms.json"),
```
**Critical:** keep it inside the *static* map (`import("@/../messages/ms.json")` literal). Never build the path by interpolating `locale` — that is the T-01-16 / T-01-14 hardening.

---

### `src/lib/kids/level-content.ts` (service/registry, file-I/O)

**Analog:** same file — `az` loader defs plus the `az` map block.

**Loader-def pattern** (lines 53–71, exact shape of each of the 19 defs):
```ts
const L_az__1_1_meet_promi = () => import("@/content/kids/az/1-1-meet-promi.mdx");
// …
const L_az__5_4_graduation_day = () => import("@/content/kids/az/5-4-graduation-day.mdx");
```
→ Add 19 definitions named `L_ms__<slug_with_underscores>`:
```ts
const L_ms__1_1_meet_promi = () => import("@/content/kids/ms/1-1-meet-promi.mdx");
const L_ms__1_2_first_words = () => import("@/content/kids/ms/1-2-first-words.mdx");
// … one per slug, hyphen → underscore in the identifier …
const L_ms__5_4_graduation_day = () => import("@/content/kids/ms/5-4-graduation-day.mdx");
```

**Loader-map entry pattern** (lines 361–381, `az` block; map opened at line 339):
```ts
const loaders: Record<string, Record<string, () => Promise<{ default: CompiledLevelContent }>>> = {
  ar: { /* 19 entries */ },
  az: {
    "1-1-meet-promi": L_az__1_1_meet_promi,
    // … 18 more …
    "5-4-graduation-day": L_az__5_4_graduation_day,
  },
  // …
};
```
→ Add an `ms: { ... }` block with all **19** keys (verbatim slugs, quoted since they contain hyphens):
`1-1-meet-promi`, `1-2-first-words`, `1-3-being-clear`, `2-1-missing-details`, `2-2-who-and-what`, `2-3-when-and-where`, `2-4-detail-detective`, `3-1-setting-the-scene`, `3-2-show-dont-tell`, `3-3-format-finder`, `3-4-context-champion`, `4-1-pretend-time`, `4-2-story-starters`, `4-3-character-creator`, `4-4-world-builder`, `5-1-perfect-prompt`, `5-2-fix-it-up`, `5-3-prompt-remix`, `5-4-graduation-day`.

**Frozen fallback logic — do not modify** (lines 697–716). Adding the `ms` map entry is the *only* edit needed; the English fallback triggers purely on a missing `loaders[locale]` / loader:
```ts
const requestedLocale = isSupportedLocale(locale) ? locale : defaultLocale;
const requested = await loadFromLocale(requestedLocale, slug);
if (requested) return { Component: requested, effectiveLocale: requestedLocale };
if (requestedLocale !== defaultLocale) {
  const fallback = await loadFromLocale(defaultLocale, slug);
  if (fallback) return { Component: fallback, effectiveLocale: defaultLocale };
}
throw new Error(`No compiled MDX content for level "${slug}" (locale "${requestedLocale}")`);
```

---

### `src/components/kids/layout/settings-modal.tsx` (component, request-response)

**Analog:** same file, `SUPPORTED_LOCALES` array.

**UI-list pattern** (lines 13–30):
```ts
const SUPPORTED_LOCALES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  // …
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
];
```
→ Add one entry. Native-name label; per RESEARCH A1 the recommended shape is:
```ts
  { code: "ms", label: "Bahasa Melayu", flag: "🇲🇾" },
```
(Label/flag are a UX choice — confirm in discuss. Buttons below already key off `code` via `handleLanguageChange`; no other change required. See **Shared Patterns → Locale activation**.)

---

### `messages/ms.json` (config, transform)

**Analog:** `messages/en.json` (git-tracked; `node scripts/check-translations.js` reports **212 leaf keys**, not 322 — use 212 as the parity target).

**Shape pattern** (`messages/en.json:1-30`):
```json
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel",
    "next": "Next",
    "previous": "Previous",
    "close": "Close",
    // …
  }
}
```
→ Author `messages/ms.json` as a **flattened-key-identical** clone of `en.json`, translating every value. Namespaces that must be present exactly (consumed by interactive components, per RESEARCH): `common`, `kids.quiz`, `kids.magicWords`, `kids.dragDrop`, `kids.promptParts`, `kids.exampleMatcher`, `kids.promptDoctor`, `kids.stepByStep`, `kids.promptLab`, `kids.wordPredictor`, `kids.levelComplete`, `kids.settings`, `kids.navigation`.

**Validation contract:** `node scripts/check-translations.js` must print **no `MS` missing/extra-key section** (it currently prints `✅ All translation files are complete!`). Missing keys render literally as `namespace.key` via `getMessageFallback` (`src/i18n/request.ts:46-48`) — a visible bug.

---

### `src/content/kids/ms/*.mdx` (component/MDX, request-response)

**Analogs:**
- Structure/vocabulary: `src/content/kids/en/<slug>.mdx` (all 19).
- Translated shape: `src/content/kids/es/1-1-meet-promi.mdx` (proof that a translated level may restructure — 7 Sections vs en's 10 — while still ending in `LevelComplete`).

**Level-shape pattern** (`src/content/kids/en/1-1-meet-promi.mdx`; es counterpart lines 1–96):
```mdx
<Section>
<Panel character="promi" mood="happy">
Hi there! I'm **Promi** 🤖, your robot friend!
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
  explanation="…"
  aiThinking="…"
  successMessage="…"
/>
</Section>

<Section>
## You Did It! 🎉
<Panel character="promi" mood="celebrating">…</Panel>
<LevelComplete
  levelSlug="1-1-meet-promi"
  stars={3}
  message="You learned what AI and prompts are!"
/>
</Section>
```

**Rules to copy from the `en`/`es` analogs:**
- Reuse the **same components with the same props contract** as `en`; translate *both* MDX prop text (`question`, `good`, `bad`, `explanation`, `sentence`, `options`, `correctAnswer`, `aiThinking`, `successMessage`, `title`, `instruction`, `message`) **and** prose (`<Panel>` bodies, `##` headings).
- Keep `LevelComplete` in a final `<Section>` with `levelSlug="<real slug>"` so the map link renders (contract asserted in `level-locale.test.tsx:307-355`).
- Section count **may** differ from `en` — the lock engine keys on ordered Section index within the active locale.
- Component vocabulary to preserve (counts across `en/*.mdx`): `<Section>` ×160, `<Panel>` ×62, `<PromptVsMistake>` ×38, `<LevelComplete>` ×19, `<MagicWords>` ×18, `<DragDropPrompt>` ×16, `<WordPredictor>` ×3, `<StepByStep>` ×1, `<PromptParts>` ×1, `<PromptLab>` ×1, `<PromptDoctor>` ×1, `<ExampleMatcher>` ×1.
- No raw HTML / scripts (build-time compiled MDX; XSS-safe authoring).

**19 files (one per slug):** `1-1-meet-promi`, `1-2-first-words`, `1-3-being-clear`, `2-1-missing-details`, `2-2-who-and-what`, `2-3-when-and-where`, `2-4-detail-detective`, `3-1-setting-the-scene`, `3-2-show-dont-tell`, `3-3-format-finder`, `3-4-context-champion`, `4-1-pretend-time`, `4-2-story-starters`, `4-3-character-creator`, `4-4-world-builder`, `5-1-perfect-prompt`, `5-2-fix-it-up`, `5-3-prompt-remix`, `5-4-graduation-day`.

---

### `src/__tests__/kids/level-locale.test.tsx` (test)

**Analog:** same file — "selects locale-specific content when the translated module exists" (lines 78–85) and the fallback case (lines 87–93).

**Test pattern** (lines 78–85, copy as the `ms` analog):
```ts
it("selects locale-specific content when the translated module exists", async () => {
  const en = await loadLevelContent("en", "1-1-meet-promi");
  const es = await loadLevelContent("es", "1-1-meet-promi");
  expect(es?.effectiveLocale).toBe("es");
  expect(es?.Component).not.toBe(en?.Component);
});
```
→ Add `ms` cases (per RESEARCH FR-3c/FR-3d):
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
Also assert `supportedLocales.includes("ms")`. Existing `afterEach` (lines 124–129) already clears section completion + localStorage.

---

### `src/__tests__/kids/settings-locale.test.tsx` (test)

**Analog:** same file — "switches UI messages and compiled MDX together without navigation…" (lines 131–168).

**Test pattern** (lines 131–168 excerpt):
```ts
await renderApp();
await openSettings();
fireEvent.click(screen.getByRole("button", { name: /Español/ }));
await waitFor(() => {
  expect(screen.getByRole("heading", { name: /Configuración/ })).toBeInTheDocument();
});
await waitFor(() => {
  expect(document.querySelectorAll("section[data-section-index]").length).toBe(7);
});
expect(localStorage.getItem(LOCALE_PREFERENCE_KEY)).toBe("es");
```
→ Add an `ms` case mirroring this: click the button named `/Bahasa Melayu/`, assert the ms settings heading renders, assert the ms section count for the served slug, and assert `localStorage.getItem(LOCALE_PREFERENCE_KEY) === "ms"`. (The md section count for `ms` depends on how many `<Section>`s the author writes — assert against the authored count, not `en`'s.)

---

## Shared Patterns

### Locale registry consistency (the core risk)
**Source of truth:** `src/lib/i18n/config.ts:5` `supportedLocales` (registry #1).
**Apply to:** all five registry edits.
`ms` must be present in **all five** of: `config.ts supportedLocales`, `prompts.config.ts i18n.locales`, `client.ts messageLoaders`, `level-content.ts loaders`, `settings-modal.tsx SUPPORTED_LOCALES`. A miss in any one causes a **silent English fallback**, never an error.
**Mechanical gate:**
```bash
node scripts/check-translations.js   # asserts messages/ms.json parity (no MS section)
npx vitest run src/__tests__/kids/level-locale.test.tsx src/__tests__/kids/settings-locale.test.tsx
```
**Known pre-existing drift (do not silently "fix"):** `settings-modal.tsx` has 16 entries and omits `he` (a supported locale with messages, no MDX). RESEARCH Open Q1 recommends keeping Phase 3 scoped to `ms` and surfacing the `he` drift to the user in discuss.

### Locale activation (client)
**Source:** `src/lib/i18n/client.ts` — `isSupportedLocale` (lines 49–51), `transitionLocale`, `writePersistedLocale`.
**Apply to:** the settings-modal `ms` button and both new tests.
```ts
export function isSupportedLocale(locale: string | null | undefined): boolean {
  return typeof locale === "string" && supportedLocales.includes(locale);
}
```
No new activation code — the existing `SettingsButton → handleLanguageChange → setUserLocale → transitionLocale → loadMessages` chain handles `ms` once it is registered. Do **not** use the `@deprecated` `setLocale`/`getLocaleClient` shims.

### Missing-message rendering
**Source:** `src/i18n/request.ts:46-48` — returns `` `${namespace}.${key}` `` for missing messages.
**Apply to:** `messages/ms.json` completeness. This is why the 212-key parity with `en.json` is mandatory (FR-3b).

### English fallback contract
**Source:** `src/lib/kids/level-content.ts:697-716`.
**Apply to:** the `loaders` edit and the new `ms` test.
Fallback is **only** on module absence; a registered loader that throws propagates. Test must distinguish success (`effectiveLocale === "ms"`) from the silent `"en"` fallback.

### Static-import bound (security)
**Source:** T-01-14 / T-01-16 hardening.
**Apply to:** `client.ts messageLoaders` and `level-content.ts loaders` edits.
Never interpolate `locale` into an import path; add literal static entries only.

---

## No Analog Found

None — every file in this phase has an exact in-repo analog.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| — | — | — | All registry edits copy a sibling-locale entry in the same file; all authored artifacts copy the `en` artifact of the same shape. |

## Metadata

**Analog search scope:** `src/lib/i18n/`, `src/lib/kids/`, `src/components/kids/layout/`, `src/content/kids/`, `messages/`, `src/__tests__/kids/`, `prompts.config.ts`, `scripts/`.
**Files scanned:** 12 (all git-tracked).
**Pattern extraction date:** 2026-11-05
**Key corrections to RESEARCH.md:** `messages/en.json` has **212** leaf keys (verified via `scripts/check-translations.js`), not 322 — use 212 as the parity target.