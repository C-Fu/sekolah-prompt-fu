---
status: diagnosed
trigger: "re-localize both lines to Malay"
created: 2026-11-05T14:00:00Z
updated: 2026-11-05T14:10:00Z
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: During the `ms` translation pass, the 1-1 `WordPredictor` first exercise was transferred from the English source by translating the puzzle sentence/options/answer to Malay but carrying over the English exercise's *rationale* verbatim — the explanation still cites the English nursery rhyme ("bunyi yang terkenal dalam bahasa Inggeris") and the aiThinking still quotes the English sentence — with no review gate checking intra-interactive language consistency (Malay puzzle must be justified by Malay reasoning).
test: Read the ms file and its en source in full; compared prop-by-prop; swept every `ms` MDX interactive prop (explanation/aiThinking/instruction/successMessage/promiMessage) for retained English sentences or English-justified Malay puzzles; confirmed provenance via git log.
expecting: A single, bounded offender (1-1:30-31) with a clear root cause and an explicit re-localization direction.
next_action: COMPLETE — root cause confirmed; evidence recorded below. No source files modified (diagnosis-only).

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: In `src/content/kids/ms/1-1-meet-promi.mdx` the WordPredictor `explanation` (line 30) and `aiThinking` (line 31) are fully and coherently in Malay — the explanation does not justify a Malay answer via English, and no English sentence remains.
actual: Line 30 `explanation` reads: "'Tikar' ialah perkataan yang paling biasa selepas 'Kucing itu duduk di atas' kerana ia bunyi yang terkenal dalam bahasa Inggeris! AI belajar corak ini daripada membaca banyak teks." — the puzzle sentence is Malay ("Kucing itu duduk di atas ___") but the explanation says the answer is natural because it "sounds familiar **in English**" ("bunyi yang terkenal dalam bahasa Inggeris"), which is incoherent for a Malay puzzle. Line 31 `aiThinking` reads: "Saya pernah melihat 'The cat sat on the mat' berkali-kali sebelum ini..." — retains the English sentence. The user reported: "re-localize both lines to Malay".
errors: None reported
reproduction: Test 5 in UAT
started: Discovered during UAT (Phase 03, WR-03 / gap G-03-6)

## Eliminated
<!-- APPEND only - prevents re-investigating -->

- hypothesis: Other `ms` interactives carry the same intra-interactive English defect (an interactive `explanation`/`aiThinking`/feedback that justifies a Malay answer via English, or retains an untranslated English sentence inside a prop value).
  evidence: Exhaustive sweep of all 19 `src/content/kids/ms/*.mdx` files for every interactive prop (explanation=, aiThinking=, instruction=, successMessage=, promiMessage=, question=, good=, bad=). Only 2 `aiThinking=` props exist in the whole corpus (1-1:31, 1-1:45) plus one in 1-2:19 — all others are clean Malay; only one `explanation=` references English wording (1-1:30). No quoted English sentences survive in any other interactive prop (the lone English quoted string in the corpus is 1-1:31).
  timestamp: 2026-11-05T14:05:00Z

- hypothesis: messages/ms.json carries the same English-justification defect.
  evidence: The offender is a WordPredictor MDX prop, not a bundle key; `messages/ms.json` contains no WordPredictor content and none of the flagged English tokens. The bundle was already verified fully translated (see ms-rare-vocabulary-bodil.md, Evidence entry 3 / Root Cause).
  timestamp: 2026-11-05T14:06:00Z

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-11-05T14:02:00Z
  checked: Full read of src/content/kids/ms/1-1-meet-promi.mdx (100 lines) and src/content/kids/en/1-1-meet-promi.mdx (read-only).
  found: ms 1-1 has two WordPredictor blocks (lines 24-33 and 38-47). Block 1 (lines 24-33) is the offender. Its props: title="Fikir Seperti AI!" (translated), instruction="Saya membaca corak dan meneka perkataan seterusnya. Apa yang ANDA akan teka?" (Malay), sentence="Kucing itu duduk di atas ___" (Malay), options=["tikar","bulan","ungu","papan kekunci"] (Malay), correctAnswer="tikar" (Malay) — but explanation (30) and aiThinking (31) retain the English rationale/proper sentence. successMessage (32) is clean Malay.
  implication: Exactly 2 of 6 interactive prop values in the block are defective; the rest of the file (prose, 2nd WordPredictor, PromptVsMistake ×2, LevelComplete) is clean Malay.

- timestamp: 2026-11-05T14:03:00Z
  checked: en source lines 24-33 (the corresponding WordPredictor block).
  found: en explanation (30) = "'Mat' is the most common word that follows 'The cat sat on the' because it's a famous rhyme! AI learns these patterns from reading lots of text." en aiThinking (31) = "I've seen 'The cat sat on the mat' many times before..."
  implication: The ms translation swapped the puzzle to a Malay sentence/answer ("Kucing itu duduk di atas ___" → "tikar") but did NOT re-ground the rationale: it mechanically translated "because it's a famous rhyme" into "kerana ia bunyi yang terkenal dalam bahasa Inggeris" (preserving the English-rhyme justification) and left the English quoted sentence verbatim in aiThinking. The defect is a translation-consistency error, not a missing translation.

- timestamp: 2026-11-05T14:05:00Z
  checked: grep sweep over src/content/kids/ms/**/*.mdx for all interactive prop values; case-insensitive English content-word sweep (the|you|story|silly|master|superhero|level|bedtime|cat|sat|mat|once upon|perfect|amazing|...).
  found: The only English-justification / retained-English-sentence defect is 1-1:30-31. Remaining English content tokens in `ms` interactives (master in 5-1:8,43,55,67,79,91,96 and 5-4:29,57,85; superhero in 4-1:66, 5-2:90, 5-4:30,31,32; bedtime 1-3:47; level 3-4:3, 4-4:3, 5-4:3,85) are already catalogued under G-03-4 / WR-02 (ms-rare-vocabulary-bodil.md) and are a *different* defect class (acquired English content words, not English-justified Malay puzzles). No other interactive retains an English sentence.
  implication: G-03-6 is a bounded, single-site defect; the gap-closure plan touches only src/content/kids/ms/1-1-meet-promi.mdx lines 30-31 (WR-03). It does NOT overlap G-03-4 vocabulary items.

- timestamp: 2026-11-05T14:08:00Z
  checked: git log -p --follow -- src/content/kids/ms/1-1-meet-promi.mdx; git log --oneline -- src/content/kids/ms/1-1-meet-promi.mdx.
  found: The file was created whole in a single commit 4ba02803 ("feat(03-01): register ms in five registries + complete messages/ms.json + tracer MDX"), dated 2026-11-05T10:28:53+0800. Both offending lines were added by that one commit (diff shows both as `+` additions).
  implication: The defect is original to the phase-03 translation pass (03-01 tracer MDX) — not a later regression. Confirms provenance: the translation pass produced these two lines; no human/native review step corrected the intra-interactive inconsistency before the phase's automated gates passed.

## Root Cause

The 1-1 `WordPredictor` first exercise was translated from the English source by a pass that translated the *puzzle* (sentence/options/answer to Malay) but carried the English exercise's *rationale* over into the `ms` file. Specifically:

1. **explanation (line 30):** en "…because it's a famous rhyme!" (English-specific reasoning tied to "The cat sat on the mat") was mechanically rendered as "…kerana ia bunyi yang terkenal dalam bahasa Inggeris!" — i.e. it asserts the Malay answer "tikar" is natural *because it sounds like English*. That is incoherent for a Malay puzzle: the rhyme reward only exists in English, and the localized sentence ("Kucing itu duduk di atas ___") has no such "famous rhyme". The rationale was never re-grounded to the Malay sentence (e.g. collocation of "duduk di atas tikar" as a common everyday Malay collocation).
2. **aiThinking (line 31):** the English quoted sentence "'The cat sat on the mat'" was left untranslated — the one surviving English sentence in any `ms` interactive prop.

**Why it happened:** the translation pass treated the two props as independent strings to translate and lost the *intra-interactive* relationship between the (translated) puzzle and the (reasoning about) explanation. There was no review gate checking that an interactive's explanation/aiThinking is internally consistent with — and justifies — its own localized puzzle in the target language. The phase's automated gates (`tsc` 0, `lint` 0, `npm test` 94/94, `npm run build`, `messages/ms.json` key parity, per-slug resolution to `ms`) verify structure/plumbing, not semantic/linguistic coherence of interactive content. The human UAT "translation quality" test (test 2) passed before this artifact was spotted and reopened as test 5 (WR-03).

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: "During the phase-03 ms translation pass (commit 4ba02803, 03-01 tracer MDX), the 1-1 first WordPredictor was localized by translating its puzzle sentence/options/answer to Malay but carrying over the English exercise's rationale verbatim: the explanation (line 30) asserts the Malay answer 'tikar' is natural 'because it sounds familiar in English' ('bunyi yang terkenal dalam bahasa Inggeris') — incoherent for a Malay puzzle — and the aiThinking (line 31) retains the untranslated English sentence 'The cat sat on the mat'. No review gate checks intra-interactive language consistency (Malay puzzle must be justified by Malay reasoning); automated gates verify structure, not linguistic coherence."
fix: [not applied — diagnosis-only session]
verification: [n/a — diagnosis-only]
files_changed: []   # diagnosis-only; NO source files modified

## Files the Gap-Closure Plan Must Touch

- `src/content/kids/ms/1-1-meet-promi.mdx:30` — `explanation`: replace the English-rhyme justification with a Malay-language rationale for the Malay answer. Intended direction: explain that "tikar" is the most natural/common word for the Malay sentence "Kucing itu duduk di atas ___" (everyday Malay collocation "duduk di atas tikar"), and that AI learns such patterns from reading lots of Malay text — with no reference to English. Drop the phrase "bunyi yang terkenal dalam bahasa Inggeris" entirely.
- `src/content/kids/ms/1-1-meet-promi.mdx:31` — `aiThinking`: replace the retained English sentence with a Malay one. Intended direction: quote the Malay sentence the child is actually solving, e.g. "Saya pernah melihat 'Kucing itu duduk di atas tikar' berkali-kali sebelum ini…".

No other files. `messages/ms.json` requires NO change. The remaining English-content-word findings in `ms` interactives (`master`, `superhero`, `bedtime`, `level`) belong to the separate G-03-4 vocabulary fix (see `.planning/debug/ms-rare-vocabulary-bodil.md`) and are NOT part of this gap.

## Verification recommendation for the plan

After edits, confirm: (a) `grep -niE "bahasa inggeris|The cat sat|the mat" src/content/kids/ms/1-1-meet-promi.mdx` → 0; (b) the line-31 `aiThinking` quote matches the line-27 `sentence` subject ("Kucing itu duduk di atas tikar"); (c) pass `npx tsc --noEmit`, `npm run lint`, `npm test`. Optionally add a lint/guard that flags an `explanation`/`aiThinking` containing an English-only phrase inside a locale whose `sentence` is not English.