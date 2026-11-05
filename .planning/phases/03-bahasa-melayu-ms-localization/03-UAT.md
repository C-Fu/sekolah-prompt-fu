---
status: complete
phase: 03-bahasa-melayu-ms-localization
source:
  - 03-01-SUMMARY.md
  - 03-02-SUMMARY.md
  - 03-03-SUMMARY.md
  - 03-04-SUMMARY.md
started: 2026-11-05T03:31:00Z
updated: 2026-11-05T03:55:09.361Z
---

## Current Test

[testing complete]

## Tests

### 1. Bahasa Melayu message bundle — translation quality
expected: messages/ms.json reads as natural, kid-simple Bahasa Melayu (Malaysia); consistent terminology; loanword "prompt" retained; no untranslated English, no garbage values. (Key parity with en.json already machine-verified.)
result: pass

### 2. Tracer level `1-1-meet-promi` — localization quality
expected: The 10-Section `ms` tracer level reads as natural kid-simple Bahasa Melayu, ends with a LevelComplete whose slug matches the real registry slug, and its interactive prompts make sense in Malay.
result: pass

### 3. Nine `ms` levels (1-2 … 3-3) — localization quality
expected: Levels 1-2, 1-3, 2-1, 2-2, 2-3, 2-4, 3-1, 3-2, 3-3 each read as natural kid-simple Bahasa Melayu, mirror the en structure, and end with a LevelComplete whose slug matches the file name.
result: pass

### 4. Nine `ms` levels (3-4 … 5-4) — localization quality
expected: Levels 3-4, 4-1, 4-2, 4-3, 4-4, 5-1, 5-2, 5-3, 5-4 each read as natural kid-simple Bahasa Melayu, mirror the en structure, and end with a LevelComplete whose slug matches the file name. (Completes all 19.)
result: pass

### 5. World names & terminology consistency across `ms` map and lessons
expected: World/level names shown on the map match the names used inside the lessons (no divergence), and the same concept is worded the same way everywhere — e.g. World 4 and World 5 names agree between `messages/ms.json` and the `ms` MDX bodies, with no stray English words.
result: issue
reported: "Change Ngarai -> Gaung (World 4). Also fix World 5 so lessons say Gunung Pakar. Decisions: World 4 = 'Gaung Penciptaan' everywhere; World 5 = 'Gunung Pakar' everywhere."
severity: minor

### 6. Static export renders all 19 `ms` level routes
expected: `npm run build` produces `out/` with an `/level/<slug>/index.html` for every one of the 19 levels, and the built pages carry the Bahasa Melayu content (not English).
result: pass

### 7. ms registered in all five locale registries + Settings shows selectable "Bahasa Melayu"
expected: `ms` appears in supportedLocales, prompts.config, messageLoaders, the level-content loader map, and the Settings modal locale list; the Settings modal shows a "Bahasa Melayu" button that activates.
result: pass
source: automated
coverage_id: 03-01-D1

### 8. loadLevelContent('ms','1-1-meet-promi') resolves the ms module (not the English fallback)
expected: effectiveLocale == 'ms' and Component != en.Component for the tracer slug.
result: pass
source: automated
coverage_id: 03-01-D3

### 9. loadMessages('ms') returns the ms bundle (not the en fallback)
expected: The bounded ms message bundle is returned for locale 'ms'.
result: pass
source: automated
coverage_id: 03-01-D4

### 10. ms loader map holds exactly 10 slug keys (after wave 2)
expected: The map contains 1-1 plus the nine 03-02 levels, each a literal import().
result: pass
source: automated
coverage_id: 03-02-D2

### 11. ms loader map holds exactly 19 slug keys (after wave 3)
expected: The map contains all 19 level slugs, each a literal import().
result: pass
source: automated
coverage_id: 03-03-D2

### 12. All 19 registered slugs resolve to ms (no silent English fallback anywhere)
expected: loadLevelContent('ms', slug) returns effectiveLocale 'ms' with a Component distinct from en for every one of the 19 slugs.
result: pass
source: automated
coverage_id: 03-04-D1

## Summary

total: 12
passed: 11
issues: 1
pending: 0
skipped: 0

## Gaps

- gap_id: G-03-5
  truth: "World/level names shown on the map match the names used inside the lessons, with no divergence and no stray English words"
  status: failed
  reason: "User reported: World 4 shows 'Ngarai Penciptaan' on the map but 'Ngarai Cipta' in lessons 4-1/4-2/4-4; World 5 shows 'Gunung Pakar' on the map but 'Gunung Master' in 5-1 (English 'Master' left untranslated). User decision: World 4 must read 'Gaung Penciptaan' everywhere; World 5 must read 'Gunung Pakar' everywhere."
  severity: minor
  test: 5
  artifacts:
    - messages/ms.json (kids.worlds.4.title, kids.worlds.5.title)
    - src/content/kids/ms/4-1-pretend-time.mdx:3
    - src/content/kids/ms/4-2-story-starters.mdx:3
    - src/content/kids/ms/4-4-world-builder.mdx:3,77,83
    - src/content/kids/ms/5-1-perfect-prompt.mdx:3
  missing:
    - "No single source of truth for World 4/5 display names: the ms bundle title and the ms MDX prose were translated independently"
    - "World 4 name diverges: bundle 'Ngarai Penciptaan' vs MDX 'Ngarai Cipta'"
    - "World 5 MDX keeps the English word 'Master' ('Gunung Master') vs bundle 'Gunung Pakar'"
  root_cause: "ms World names were translated without reconciling the map-bundle title against the lesson-body prose; World 5's lesson copied the English 'Master' literally instead of using the bundle's translation"
  fix_direction: "World 4 must read 'Gaung Penciptaan' in all six locations; World 5 must read 'Gunung Pakar' in 5-1 (removing the English 'Master'). No English word may remain in a World name."