# Project: Sekolah Prompt-Fu (Learn Prompting for Kids)

## Vision & Objective
Sekolah Prompt-Fu is a lightweight, standalone, gamified interactive learning web application designed for primary school students (Standard 1 / Tahun 1) to learn prompt engineering and AI literacy ("Learn Prompting for Kids") aligned with Malaysian KSSR Semakan & KBAT methodology.

The application is built 100% static (`output: 'export'`) with client-side persistence and zero server dependencies, fully localized in Bahasa Melayu (`ms`) and English (`en`), deployable on GitHub Pages.

## Key Decisions

1. **Prompt-First Syllabus Integration (KSSR & KBAT):**
   - Core learning remains prompt engineering (how to instruct AI, specify context, role-play, constrain formats, give feedback).
   - Subject domain knowledge (BM, English, Math, Science, Pendidikan Moral) serves as authentic context for prompt tasks.
   - Subjects represented as celestial planets (Moon=BM, Earth=Sains, Mars=Matematik, Venus=English, Mercury=Moral) with geological provinces representing Standards 1-6.

2. **Static-First Architecture (GitHub Pages Ready):**
   - Next.js `output: 'export'` with `images: { unoptimized: true }`.
   - Client-side persistence using `localStorage` for level progress, stars, volume, and section completion.
   - Zero database or server runtime dependencies.

3. **Bilingual Navigation & Zero Silent Fallback:**
   - Fast dual-toggle "BM | EN" on the header for instant locale switching.
   - All levels authored in both BM (`src/content/kids/ms/`) and English (`src/content/kids/en/`).

4. **Quality Gates & Clean Imports:**
   - Dedicated scripts for import closure (`npm run check:closure`) and vocabulary checks (`npm run check:vocab`) wired into CI.
   - Verified zero regression with `npm run verify` across all 24 level routes and assets.

## Requirements

### Validated
- ✓ Repository purged to a kids-only surface: Prisma/NextAuth/non-kids routes and component families removed, npm lockfile cut from 1,492 → 826 packages, community prompt datasets deleted — v1.0
- ✓ 19 gamified interactive prompting levels with interactive widgets (`src/content/kids/en/*.mdx`); client-side progress (`localStorage`), audio/background-music engine, and pixel-art UI retained — v1.0
- ✓ Kids game promoted to the root experience (`/`, `/map`, `/level/[slug]`) as a 100% static `out/` export with a GitHub Pages deploy workflow and locally-bundled music — v1.0
- ✓ Bahasa Melayu (`ms`) locale fully selectable, with a complete 212-key UI message bundle (`messages/ms.json`) and all 19 interactive MDX levels localized under `src/content/kids/ms/`; no silent English fallback — v1.0
- ✓ NFR-2 certified end-to-end via a committed, rerunnable verification script (`scripts/verify-project.js` / `npm run verify`) and a CI job enforcing the same gate set (`--gates-only`, bounded gate timeout) — v1.0
- ✓ Onboarding handoff (`.planning/HANDOFF.md`) documenting architecture, gate commands, deploy process, and known non-blocking advisories — v1.0
- ✓ Replace prompts.chat social preview (`public/og.png`, `src/app/opengraph-image.png`, `src/app/twitter-image.png`) with custom Sekolah Prompt-Fu branded banner — v1.1
- ✓ Repaired closure guard for root routes and wired `npm run check:closure` & `npm run check:vocab` into CI — v1.1
- ✓ Consolidated supported locales into a canonical single source of truth in `src/lib/i18n/config.ts` — v1.1
- ✓ Header quick toggle button ("BM | EN") next to Music & Settings buttons for 1-click language switching — v1.1
- ✓ Researched and designed KSSR Semakan Year 1 prompt-learning pedagogy and planetary subject schema (`src/lib/kids/planets.ts`) — v1.1
- ✓ Authored and registered 5 pilot KSSR Year 1 levels across BM, Sains, Matematik, English, and Pendidikan Moral in both BM and English with full static export verification — v1.1

### Active
- (none — run `/gsd-new-milestone` to start v1.2)

### Out of Scope
- Backend database / server-side user accounts (progress is browser-local).
- Live paid LLM calls via secret server keys (game relies on pre-programmed interactive feedback, heuristics, and simulations).
- Higher primary standards (Tahun 2 - 6 deferred to future milestones).

## Context
Shipped **v1.1** on 2026-11-07 (Phases 5-8; 8 plans, 16 tasks). Stack: Next.js (App Router, `output: 'export'`), TypeScript, next-intl (en + ms), Vitest, GitHub Actions → GitHub Pages. Test suite is 129/129; `npm run verify` re-certifies tsc + Vitest + `out/` inspection (24 level routes).

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-11-07 (Milestone v1.1 completion)*
