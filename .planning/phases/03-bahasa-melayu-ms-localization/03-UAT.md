---
status: diagnosed
phase: 03-bahasa-melayu-ms-localization
source:
  - 03-VERIFICATION.md
started: 2026-11-05T13:12:00Z
updated: 2026-11-05T13:40:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Bahasa Melayu message bundle — translation quality
expected: messages/ms.json reads as natural, kid-simple Bahasa Melayu (Malaysia); consistent terminology; loanword "prompt" retained by design; no untranslated English, no garbage values. (Key parity with en.json already machine-verified.)
result: pass

### 2. All 19 `ms` levels — prose & interactive-prop translation quality
expected: Levels 1-1 … 5-4 each read as natural kid-simple Bahasa Melayu; every Panel body, heading, and interactive prop value is in Malay and pedagogically coherent for a child; each ends with a LevelComplete whose slug matches the file name. (Structural parity is machine-verified.)
result: pass

### 3. World names & terminology consistency across `ms` map and lessons (G-03-5 re-test)
expected: World 4 reads `Gaung Penciptaan` and World 5 reads `Gunung Pakar` in BOTH the map bundle (`messages/ms.json`) and the lesson bodies (`4-1`, `4-2`, `4-4`, `5-1`). Zero `Ngarai`, zero `Gunung Master`, no English word inside a World name.
result: pass

### 4. WR-02 — non-word "bodil" as a selectable answer
expected: The non-word "bodil" (intended "silly") is replaced with an age-appropriate Malay word (e.g. `jenaka`/`kelakar`/`main-main`) in `src/content/kids/ms/2-4-detail-detective.mdx:82` (offered to the child as a MagicWords answer) and `src/content/kids/ms/3-2-show-dont-tell.mdx:56` and `:58`.
result: issue
reported: "replace bodil with lawak. any rarely used words like bodil should be replaced with a more common variant"
severity: major

### 5. WR-03 — 1-1 WordPredictor explanation no longer justifies a Malay puzzle "in English"
expected: In `src/content/kids/ms/1-1-meet-promi.mdx` (≈ lines 30-31), the WordPredictor explanation/aiThinking is internally consistent in Malay — it no longer justifies a Malay puzzle "dalam bahasa Inggeris" and the leftover English `aiThinking` string is removed/re-localised.
result: issue
reported: "re-localize both lines to Malay"
severity: major

### 6. Static export renders all 19 `ms` level routes
expected: `npm run build` produces `out/` with an `/level/<slug>/index.html` for every one of the 19 levels, and the built pages carry the Bahasa Melayu content (not English).
result: pass

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
passed: 8
issues: 2
pending: 0
skipped: 0

## Gaps

- gap_id: G-03-4
  truth: "Interactive answer options and lesson prose use common, natural Malay vocabulary a child would recognise — no non-words or rarely-used variants"
  status: failed
  reason: "User reported: 'replace bodil with lawak. any rarely used words like bodil should be replaced with a more common variant'. 'bodil' is not a Malay word; it appears as a selectable MagicWords answer in 2-4:82 and as prose in 3-2:56 and 3-2:58. User also asked for a general pass to replace any other rarely-used words with more common variants."
  severity: major
  test: 4
  root_cause: "The `ms` localization was produced by a translation pass with no Malay-vocabulary / child-readability review gate. English 'silly' was rendered with the invented non-word 'bodil' at three sites; the same gap left untranslated English content words ('superhero', 'bedtime', 'level') in flowing content. The automated gates (tsc/lint/test/build + 212-key parity) verify structure, not word validity."
  artifacts:
    - src/content/kids/ms/2-4-detail-detective.mdx:82  # 'bodil' selectable MagicWords answer
    - src/content/kids/ms/3-2-show-dont-tell.mdx:56,58  # 'bodil' in prose/feedback
    - src/content/kids/ms/1-3-being-clear.mdx:47  # 'bedtime'
    - src/content/kids/ms/3-4-context-champion.mdx:3  # 'level'
    - src/content/kids/ms/4-4-world-builder.mdx:3  # 'level'
    - src/content/kids/ms/5-4-graduation-day.mdx:3,85  # 'level'/'LEVEL'
    - src/content/kids/ms/4-1-pretend-time.mdx:66  # 'superhero'
    - src/content/kids/ms/5-2-fix-it-up.mdx:90  # 'superhero'
    - src/content/kids/ms/5-4-graduation-day.mdx:30,31,32  # 'superhero'
  missing:
    - "Replace the 3 'bodil' occurrences with the user-decided 'lawak'"
    - "Normalize untranslated content words to common Malay: 'bedtime' -> 'sebelum tidur', 'level' -> 'tahap', 'superhero' -> 'adiwira'"
    - "Add a grep-based vocabulary guard (expect 0 for 'bodil') to prevent recurrence"
  debug_session: .planning/debug/ms-rare-vocabulary-bodil.md

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

- gap_id: G-03-6
  truth: "Every `ms` interactive explanation is internally consistent in Malay — no Malay puzzle justified by English wording and no leftover English strings"
  status: failed
  reason: "User reported: 're-localize both lines to Malay'. In 1-1-meet-promi.mdx the WordPredictor explanation (line 30) justifies the Malay answer 'Tikar' by its English collocation ('bunyi yang terkenal dalam bahasa Inggeris'), and aiThinking (line 31) retains the English sentence 'The cat sat on the mat'."
  severity: major
  test: 5
  root_cause: "In the phase-03 `ms` translation pass (whole file introduced by commit 4ba02803), the first 1-1 WordPredictor exercise was localized by translating its puzzle to Malay but carrying the English exercise's rationale over verbatim. Line 30's explanation asserts the Malay answer 'tikar' is natural because it sounds like English, and line 31's aiThinking retains the untranslated English sentence. No review gate checks intra-interactive language consistency."
  artifacts:
    - src/content/kids/ms/1-1-meet-promi.mdx:30  # explanation justifies Malay answer via English
    - src/content/kids/ms/1-1-meet-promi.mdx:31  # aiThinking retains English sentence
  missing:
    - "Re-localize explanation (line 30) to justify 'tikar' via the Malay collocation 'duduk di atas tikar', removing the English reference"
    - "Re-localize aiThinking (line 31) to quote the Malay sentence the child is solving"
  debug_session: .planning/debug/ms-1-1-wordpredictor-english.md