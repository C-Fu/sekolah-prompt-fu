---
phase: 26-jupiter-sains-saturn-sejarah-year-1-curriculum
plan: "01"
subsystem: content
tags:
  - kids
  - mdx
  - jupiter
  - sains
  - prompt-engineering
  - year-1
dependency_graph:
  requires: []
  provides:
    - src/content/kids/ms/10-1-sains-benda-hidup.mdx
    - src/content/kids/en/10-1-sains-benda-hidup.mdx
    - src/__tests__/kids/subject-lessons-stages.test.ts
  affects:
    - subject-lessons-stages test suite
tech_stack:
  added: []
  patterns:
    - 7-Stage Interactive Widget Flow (Panel, WordPredictor, PromptVsMistake, PromptDoctor, DragDropPrompt, MagicWords, LevelComplete)
    - KSSR Sains Year 1 Benda Hidup & Benda Bukan Hidup pedagogy
    - Static MDX compilation
key_files:
  created:
    - src/content/kids/ms/10-1-sains-benda-hidup.mdx
    - src/content/kids/en/10-1-sains-benda-hidup.mdx
  modified:
    - src/__tests__/kids/subject-lessons-stages.test.ts
decisions:
  - "Authored 10-1-sains-benda-hidup in both BM and EN following canonical 7-section structure with full interactive elements for biological observation prompts."
  - "Strictly adhered to KSSR Year 1 biological criteria (bernafas, air dan makanan, membesar) and zero English residuals in Malay content passing check:vocab."
status: complete
metrics:
  duration: 4m
  completed_date: "2026-11-20"
actuals:
  tokens: 45000
  tasks: 2
  commits: 2
  plan_head_before: c4dc224a5b48ad0aa8e17849e7b28d6896253457
  plan_head_after: 2d0e6684610dfb0b975d045d9fa74bf51a44c77c
---

# Phase 26 Plan 01: Jupiter (Sains) Year 1 Interactive Pilot Lesson Summary

Year 1 interactive science observation prompt lesson for Jupiter (`10-1-sains-benda-hidup`) authored in Bahasa Melayu and English across 7 canonical interactive stages.

## What Was Done

1. **Updated Integration Test Suite**:
   - Added `"10-1-sains-benda-hidup"` to `SUBJECT_SLUGS` in `src/__tests__/kids/subject-lessons-stages.test.ts`.
   - Verified tracer RED behavior before authoring, and GREEN after authoring.

2. **Authored Malay and English Interactive Lesson Content**:
   - `src/content/kids/ms/10-1-sains-benda-hidup.mdx`
   - `src/content/kids/en/10-1-sains-benda-hidup.mdx`
   - Built with the 7 canonical interactive sections:
     - **Section 1 (Pengenalan Konsep)**: Peromfu introduces Jupiter (Musytari) and Great Red Spot (Bintik Merah Gergasi), setting up observation of living vs non-living things.
     - **Section 2 (WordPredictor)**: Core biological life need identification (`air serta makanan` / `water and food`).
     - **Section 3 (PromptVsMistake)**: Vague instruction vs precise scientific comparison prompt between living cat and toy robot with table output format.
     - **Section 4 (PromptDoctor)**: 3-step healing of broken prompt (`Cari benda hidup`) with scientist role, specimens, and biological criteria.
     - **Section 5 (DragDropPrompt)**: Ordering science formula `[Peranan Pembantu Sains] + [Tindakan & Ciri Biologi] + [Format Senarai]`.
     - **Section 6 (MagicWords)**: Templated wildlife observation inquiry with multi-slot blanks for organism, life need, and habitat.
     - **Section 7 (LevelComplete)**: Peromfu celebratory panel and `<LevelComplete levelSlug="10-1-sains-benda-hidup" stars={3} />`.

3. **Validation & Quality Assurance**:
   - `vitest run src/__tests__/kids/subject-lessons-stages.test.ts` passed 30/30 tests.
   - `npm run check:vocab` scanned 24 files with 0 violations.
   - Next.js production build (`next build`) succeeded with all static pages prerendered cleanly.

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- Automated test run:
  - `npx vitest run src/__tests__/kids/subject-lessons-stages.test.ts -t "Lesson 10-1-sains-benda-hidup"` (6 passed)
  - `npm run check:vocab` (0 errors)
  - `npm run build` (compiled successfully)

## Self-Check: PASSED
- [x] `src/content/kids/ms/10-1-sains-benda-hidup.mdx` exists on disk
- [x] `src/content/kids/en/10-1-sains-benda-hidup.mdx` exists on disk
- [x] `src/__tests__/kids/subject-lessons-stages.test.ts` exists and includes `10-1-sains-benda-hidup`
- [x] Commit `937acd99`: `test(26-01): add 10-1-sains-benda-hidup to subject-lessons-stages test suite`
- [x] Commit `2d0e6684`: `feat(26-01): author Jupiter Sains Year 1 interactive pilot lesson in BM and EN`
