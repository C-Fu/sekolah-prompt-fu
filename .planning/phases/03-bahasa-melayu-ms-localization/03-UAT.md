---
status: testing
phase: 03-bahasa-melayu-ms-localization
source:
  - 03-VERIFICATION.md
started: 2026-11-05T13:12:00Z
updated: 2026-11-05T13:12:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Bahasa Melayu message bundle — translation quality
expected: |
  `messages/ms.json` reads as natural, kid-simple Bahasa Melayu (Malaysia) for
  ages 8-14, with consistent terminology and the loanword "prompt" retained by
  design. No machine-translation artifacts, no untranslated English, no garbage.
  (212-key parity with `en.json` is already machine-verified — judge ONLY the
  language.)
awaiting: user response

## Tests

### 1. Bahasa Melayu message bundle — translation quality
expected: messages/ms.json reads as natural, kid-simple Bahasa Melayu (Malaysia); consistent terminology; loanword "prompt" retained by design; no untranslated English, no garbage values. (Key parity with en.json already machine-verified.)
result: [pending]

### 2. All 19 `ms` levels — prose & interactive-prop translation quality
expected: Levels 1-1 … 5-4 each read as natural kid-simple Bahasa Melayu; every Panel body, heading, and interactive prop value is in Malay and pedagogically coherent for a child; each ends with a LevelComplete whose slug matches the file name. (Structural parity is machine-verified.)
result: [pending]

### 3. World names & terminology consistency across `ms` map and lessons (G-03-5 re-test)
expected: World 4 reads `Gaung Penciptaan` and World 5 reads `Gunung Pakar` in BOTH the map bundle (`messages/ms.json`) and the lesson bodies (`4-1`, `4-2`, `4-4`, `5-1`). Zero `Ngarai`, zero `Gunung Master`, no English word inside a World name.
result: [pending]

### 4. WR-02 — non-word "bodil" as a selectable answer
expected: The non-word "bodil" (intended "silly") is replaced with an age-appropriate Malay word (e.g. `jenaka`/`kelakar`/`main-main`) in `src/content/kids/ms/2-4-detail-detective.mdx:82` (offered to the child as a MagicWords answer) and `src/content/kids/ms/3-2-show-dont-tell.mdx:56` and `:58`.
result: [pending]

### 5. WR-03 — 1-1 WordPredictor explanation no longer justifies a Malay puzzle "in English"
expected: In `src/content/kids/ms/1-1-meet-promi.mdx` (≈ lines 30-31), the WordPredictor explanation/aiThinking is internally consistent in Malay — it no longer justifies a Malay puzzle "dalam bahasa Inggeris" and the leftover English `aiThinking` string is removed/re-localised.
result: [pending]

### 6. Static export renders all 19 `ms` level routes
expected: `npm run build` produces `out/` with an `/level/<slug>/index.html` for every one of the 19 levels, and the built pages carry the Bahasa Melayu content (not English).
result: pass
source: automated

### 7. ms registered in all five locale registries + Settings shows selectable "Bahasa Melayu"
expected: `ms` appears in supportedLocales, prompts.config, messageLoaders, the level-content loader map, and the Settings modal locale list; the Settings modal shows a "Bahasa Melayu" button that activates.
result: pass
source: automated

### 8. loadLevelContent('ms', slug) resolves the ms module for all 19 slugs (no English fallback)
expected: effectiveLocale == 'ms' and Component != en.Component for every one of the 19 registered slugs.
result: pass
source: automated

### 9. loadMessages('ms') returns the ms bundle (not the en fallback)
expected: The bounded ms message bundle is returned for locale 'ms'.
result: pass
source: automated

### 10. Quality gates green (tsc / lint / full test suite)
expected: `npx tsc --noEmit` → 0; `npm run lint` → 0; `npm test` → 94/94 passed.
result: pass
source: automated

## Summary

total: 10
passed: 4
issues: 0
pending: 6
skipped: 0

## Gaps

- gap_id: G-03-5
  truth: "World/level names shown on the map match the names used inside the lessons, with no divergence and no stray English words"
  status: closed
  reason: "User reported (previous session): World 4 diverged between map and lessons; World 5 lesson kept English 'Master'. Fixed by gap-closure plan 03-05 (commit ea91df68, 5ed42193); re-verified by the phase verifier (14/14 must-haves). Re-test item 3 confirms."
  severity: minor
  test: 3
  artifacts:
    - messages/ms.json (kids.worlds.4.title, kids.worlds.5.title)
    - src/content/kids/ms/4-1-pretend-time.mdx:3
    - src/content/kids/ms/4-2-story-starters.mdx:3
    - src/content/kids/ms/4-4-world-builder.mdx:3,77,83
    - src/content/kids/ms/5-1-perfect-prompt.mdx:3
  fix_direction: "World 4 = 'Gaung Penciptaan' everywhere; World 5 = 'Gunung Pakar' everywhere; no English word in a World name."