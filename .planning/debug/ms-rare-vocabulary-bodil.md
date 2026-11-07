---
status: diagnosed
trigger: "replace bodil with lawak. any rarely used words like bodil should be replaced with a more common variant"
created: 2026-11-05T00:00:00Z
updated: 2026-11-05T14:30:00Z
audit_acknowledged:
  milestone: v1.0
  at: 2026-11-07
  status: diagnosed
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: A translation pass over the `ms` corpus introduced the non-word "bodil" as a rendering of English "silly", and left a handful of untranslated English content words (superhero, bedtime, level, T-Rex/proper names, master) — no Malay-dictionary/child-vocabulary review gate existed to catch them. Localized, finite, not systemic.
test: Enumerated every `ms` MDX + `messages/ms.json` string, compared against the English source, and flagged non-words / rarely-used words / untranslated English / typos.
expecting: A bounded list of offending tokens with file:line.
next_action: COMPLETE — root cause confirmed; evidence recorded below. No source files modified (diagnosis-only).

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: Interactive answer options and lesson prose in `src/content/kids/ms/**` and `messages/ms.json` use common, natural Malay vocabulary a child would recognise — no non-words, no English, no rarely-used/obscure variants.
actual: The non-word "bodil" (intended meaning "silly/playful", cf. English "silly"/wordplay style) is present at `src/content/kids/ms/2-4-detail-detective.mdx:82` as a selectable MagicWords answer, and at `src/content/kids/ms/3-2-show-dont-tell.mdx:56` and `:58` as lesson prose/feedback. The user reported: "replace bodil with lawak. any rarely used words like bodil should be replaced with a more common variant" — i.e. also scan for OTHER rarely-used words across the `ms` corpus.
errors: None reported
reproduction: Test 4 in UAT (WR-02 / gap G-03-4)
started: Discovered during UAT (Phase 03)

## Eliminated
<!-- APPEND only - prevents re-investigating -->

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-11-05T00:00:00Z
  checked: grep -rn "bodil" src/content/kids/ms/ messages/ms.json
  found: Exactly 3 occurrences, all in ms MDX: 2-4-detail-detective.mdx:82 (MagicWords answers array), 3-2-show-dont-tell.mdx:56 (good= prose), 3-2-show-dont-tell.mdx:58 (explanation= prose). Zero occurrences in messages/ms.json.
  implication: "bodil" is confined to 2 files / 3 lines; the message bundle is unaffected by this specific non-word.

- timestamp: 2026-11-05T00:00:00Z
  checked: English source origin of the 3 "bodil" sites — src/content/kids/en/2-4-detail-detective.mdx:82 and en/3-2-show-dont-tell.mdx:56,58.
  found: en 2-4:82 answer is "silly"; en 3-2:56 good= "...something silly with a pun!"; en 3-2:58 explanation= "...that same silly wordplay style!". All three English "silly" renderings became the non-word "bodil" in ms.
  implication: "bodil" is a false rendering of English "silly" — a non-word with no Malay dictionary entry. Root cause of the specific offender is confirmed.

- timestamp: 2026-11-05T00:00:00Z
  checked: Full read of all 19 src/content/kids/ms/*.mdx files + messages/ms.json (212 keys) against their en sources; grep sweeps for non-words, untranslated English content tokens, Indonesian-only/archaic words, typos.
  found: Corpus is otherwise mostly natural kid-level Malay. Residual untranslated English content tokens found (see Findings table). message bundle messages/ms.json is fully translated (keys like "level"/"check" are JSON key names, not content; the "check" values are correctly "Semak!").
  implication: The degradation is a small, finite set of untranslated English content words — not a systemic quality failure. No Indonesian-only/archaic vocabulary beyond the noted items.

## Findings (G-03-4 scope — vocabulary)

### Severity: MUST FIX (non-word / wrong word)
| # | File:Line | Offending | Context | en source meaning | Suggested replacement |
|---|-----------|-----------|---------|--------------------|------------------------|
| 1 | src/content/kids/ms/2-4-detail-detective.mdx:82 | `bodil` | MagicWords answers array (selectable mood/style answer, 5th item) | "silly" | `lawak` (user-decided mapping) |
| 2 | src/content/kids/ms/3-2-show-dont-tell.mdx:56 | `bodil` | good= prose ("...sesuatu yang bodil dengan permainan kata!") | "silly" | `lawak` |
| 3 | src/content/kids/ms/3-2-show-dont-tell.mdx:58 | `bodil` | explanation= prose ("...gaya permainan kata yang bodil itu!") | "silly" | `lawak` |

### Severity: SHOULD FIX (untranslated English content word a child sees)
| # | File:Line | Offending | Context | en source meaning | Suggested replacement |
|---|-----------|-----------|---------|--------------------|------------------------|
| 4 | src/content/kids/ms/1-3-being-clear.mdx:47 | `bedtime` ("cerita bedtime pendek") | DragDropPrompt piece | "a short bedtime story" | `cerita pendek sebelum tidur` (cf. ms 5-2:70/4-3:40-42 already use "sebelum tidur") |
| 5 | src/content/kids/ms/3-4-context-champion.mdx:3 | `level` ("level terakhir") | Panel prose | "the final level of…" | `tahap` (ms bundle/lessons consistently use "tahap"; e.g. ms.json kids.header.levels="tahap") |
| 6 | src/content/kids/ms/4-4-world-builder.mdx:3 | `level` ("level terakhir") | Panel prose | "the final level of…" | `tahap` |
| 7 | src/content/kids/ms/5-4-graduation-day.mdx:3 | `LEVEL TERAKHIR` | Panel prose | "the FINAL LEVEL" | `TAHAP TERAKHIR` |
| 8 | src/content/kids/ms/5-4-graduation-day.mdx:85 | `level` ("SEMUA level") | Panel prose | "ALL the levels" | `tahap` |
| 9 | src/content/kids/ms/4-1-pretend-time.mdx:66 | `superhero` | MagicWords answers (character) | "superhero" | `adiwira` (already used at ms 2-2:12, ms 2-2:78, ms 3-2:69 — inconsistent) |
| 10 | src/content/kids/ms/5-2-fix-it-up.mdx:90 | `superhero` ("tema superhero") | MagicWords answers (example) | "a superhero theme" | `tema adiwira` |
| 11 | src/content/kids/ms/5-4-graduation-day.mdx:30 | `superhero` (×2: "jurulatih superhero", "nama superhero") | good= prose | "superhero coach / superhero names" | `jurulatih adiwira` / `nama adiwira` |
| 12 | src/content/kids/ms/5-4-graduation-day.mdx:31 | `superhero` ("nama superhero") | bad= prose | "superhero names" | `nama adiwira` |
| 13 | src/content/kids/ms/5-4-graduation-day.mdx:32 | `superhero` ("jurulatih superhero") | explanation= prose | "superhero coach" | `jurulatih adiwira` |

### Severity: JUDGMENT / lower priority (see notes)
- `master` in lessons — ms 5-1:8,43,55,67,79,91,96 standalone content headings were **deliberately left untouched as out of scope** by the prior G-03-5 fix (per .planning/STATE.md line 80). NOT new findings.
- ms 5-1:50 (`promiMessage` "prompt tahap master"), ms 5-4:29,32,57 (`master` in prose) — English "master" in flowing content; consistent with the accepted decision, but flag for the plan owner to confirm whether the in-scope tax extends here (heading vs prose). NOT in the deliberate-exception list verbatim.
- Proper nouns / onomatopoeia mirrored from en: `T-Rex` (3-1:38-39, 5-3:45-47), `Golden Retriever` (5-3:26-28), `Phoenix` (3-2:83), `Zap`/`Pip`/`Luna` (character names), `Moo` (3-4:40,42 animal sound), `Hoo hoo` (4-3:56), `Starblaze` (5-4:30,32). These are intentional names/sounds also present in the en source — acceptable, not "rare Malay words".
- Quoted sample brand names kept in English by design (mirror en): `'Super Star'`, `'Magic Moment'`, `'Wonder World'`/`'Wonder Word'`, `'Happy Helper'`, `'Dream Team'` (3-4:68, 5-1:88). Example proper nouns — acceptable.
- Loanwords acceptable per project decision: `prompt`, `robot`, `unicorn`, `dinosaur`, `emoji`, `kod`/`fail` type terms. NOT findings.
- `kesateria` (1-2:69, 2-2:19, 2-4:83, 4-3:66) for "knight" — valid Malay spelling variant (DBP also `kesatria`); NOT rare. NOT a finding.
- `kekok` (2-4:26,45) for "clumsy" — standard colloquial Malay; NOT rare. NOT a finding.

## Root Cause (G-03-4)
The `ms` localization was produced by a translation pass with **no Malay-vocabulary / child-readability review gate**. The English source word "silly" (en 2-4:82, en 3-2:56,58) was rendered with the invented non-word **"bodil"** at exactly those three sites; no dictionary check or native-review step existed to reject it (the phase's automated gates — tsc/lint/test/build + key parity — verify structure, not word validity). The same gap left a finite set of untranslated English content words in flowing prose/answers (**superhero, bedtime, level**, plus intentional proper nouns), because the same pass sometimes translated a term (en "superhero" → ms "adiwira" at 2-2/3-2) and sometimes left it in English (ms 4-1/5-2/5-4). `messages/ms.json` is fully translated and contains none of these defects.
Why not caught: no gate existed for this class — there is no vocabulary/dictionary lint, and the UAT human review (test 2, "translation quality") passed before the "bodil" artifact was spotted and re-opened as test 4.

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: "bodil" is an invented non-word used to translate English "silly" at src/content/kids/ms/2-4-detail-detective.mdx:82 and src/content/kids/ms/3-2-show-dont-tell.mdx:56,58 — a translation-pass artifact with no Malay-vocabulary review gate. The same review gap left untranslated English content words (superhero, bedtime, level) in the ms corpus; the message bundle is fully translated.
fix: [not applied — diagnosis-only session]
verification: [n/a — diagnosis-only]
files_changed: []   # diagnosis-only; NO source files modified

## Files the Gap-Closure Plan Must Touch
- src/content/kids/ms/2-4-detail-detective.mdx:82  (bodil → lawak)
- src/content/kids/ms/3-2-show-dont-tell.mdx:56,58  (bodil → lawak)
- src/content/kids/ms/1-3-being-clear.mdx:47  (bedtime → sebelum tidur)
- src/content/kids/ms/3-4-context-champion.mdx:3  (level → tahap)
- src/content/kids/ms/4-4-world-builder.mdx:3  (level → tahap)
- src/content/kids/ms/5-4-graduation-day.mdx:3,85  (level → tahap)
- src/content/kids/ms/4-1-pretend-time.mdx:66  (superhero → adiwira)
- src/content/kids/ms/5-2-fix-it-up.mdx:90  (superhero → adiwira)
- src/content/kids/ms/5-4-graduation-day.mdx:30,31,32  (superhero → adiwira)
- (OPTIONAL / owner-decision) src/content/kids/ms/5-1-perfect-prompt.mdx:50 and src/content/kids/ms/5-4-graduation-day.mdx:29,32,57 — "master" in flowing prose/answers outside the previously-declared heading exception.
- messages/ms.json: NO CHANGE REQUIRED (no non-words / untranslated content found).

Verification recommendation for the plan: after edits, re-run `grep -rni "bodil" src/content/kids/ms/` (expect 0), and `grep -rniE "\b(superhero|bedtime|level)\b" src/content/kids/ms/` (expect only intentional/decided exceptions). Consider adding a small vocabulary-lint guard to prevent recurrence.
