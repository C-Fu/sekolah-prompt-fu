---
phase: 27-uranus-rbt-neptune-psv-year-1-curriculum
plan: 01
subsystem: content
tags: [kids, rbt, uranus, prompt-engineering, mdx, kssr-semakan]
status: complete
requires:
  - Phase 26 (Year 1 7-stage interactive pedagogical pattern)
provides:
  - Uranus RBT Year 1 pilot lesson (12-1-rbt-bentuk-asas) in MS and EN
  - Updated subject lessons stages test harness in Vitest
affects:
  - Phase 28 (Level registration & celestial map integration)
tech-stack:
  added: []
  patterns:
    - Canonical 7-stage interactive MDX lesson structure (Panel -> WordPredictor -> PromptVsMistake -> PromptDoctor -> DragDropPrompt -> MagicWords -> LevelComplete)
key-files:
  created:
    - src/content/kids/ms/12-1-rbt-bentuk-asas.mdx
    - src/content/kids/en/12-1-rbt-bentuk-asas.mdx
  modified:
    - src/__tests__/kids/subject-lessons-stages.test.ts
decisions:
  - "D-27-01: Structured Uranus RBT lesson around Miranda Rift Canyon with 2D basic shapes and 3D geometric primitives (kubus, kuboid, silinder, kon, piramid, sfera) and stability constraints"
metrics:
  duration: 4m
  completed: 2026-11-20
actuals:
  tokens: 3502
  tasks: 2
  commits: 1
  plan_head_before: 21d1819e2dd18ccad6fafcfb7fe4a181f0687c67
  plan_head_after: 72d11d651dcd5e227d83d1e578668857091a380d
---

# Phase 27 Plan 01: Uranus (RBT) Year 1 Interactive Pilot Lesson (12-1-rbt-bentuk-asas) Summary

Delivered the complete bilingual interactive Year 1 pilot lesson for Uranus (Reka Bentuk & Teknologi: Bentuk Asas 2D & 3D, Blok Binaan / Geometric Prompt Engineering) across 7 canonical interactive stages adhering to KSSR Semakan standards and zero-residual Malay vocabulary guards.

## Accomplishments

1. **Test Harness Extension (`src/__tests__/kids/subject-lessons-stages.test.ts`)**:
   - Registered `"12-1-rbt-bentuk-asas"` into `SUBJECT_SLUGS`.
   - Verified that both `ms` and `en` versions exist, have at least 7 `<Section>` elements, and culminate in `<LevelComplete levelSlug="12-1-rbt-bentuk-asas" />`. All 42 tests in the suite passed.

2. **Bilingual MDX Authoring (`src/content/kids/{ms,en}/12-1-rbt-bentuk-asas.mdx`)**:
   - **Section 1 (Pengenalan Konsep)**: Peromfu lands at Miranda Rift Canyon (`Lembah Jurang Miranda`), introducing the mission to construct stable structures with 2D shapes and 3D blocks.
   - **Section 2 (WordPredictor)**: Selecting `kuboid yang lebar` / `wide cuboid` for a stable and firm foundation.
   - **Section 3 (PromptVsMistake)**: Contrasting vague instructions with clear geometric prompt primitives (`kubus`, `silinder`, `sfera`).
   - **Section 4 (PromptDoctor)**: Diagnosing and healing a missing builder role, missing 3D primitives, and missing stability constraints.
   - **Section 5 (DragDropPrompt)**: Ordering the prompt formula: `[Peranan Pereka] + [Bongkah 3D & Bentuk] + [Perincian & Kestabilan]`.
   - **Section 6 (MagicWords)**: Domain-specific modifiers for chassis body, wheel shapes, and rooftop antennas.
   - **Section 7 (LevelComplete)**: Awarding stars and celebrating mastery on Uranus.

3. **Vocabulary & Quality Compliance**:
   - `npm run check:vocab` scanned all 26 Malay MDX files with 0 offenses.
   - `next build` compiled cleanly with static route validation.

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

- FOUND: `src/content/kids/ms/12-1-rbt-bentuk-asas.mdx`
- FOUND: `src/content/kids/en/12-1-rbt-bentuk-asas.mdx`
- FOUND: `src/__tests__/kids/subject-lessons-stages.test.ts`
- FOUND: commit `72d11d65`
