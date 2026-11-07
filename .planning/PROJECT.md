# Project: Sekolah Prompt-Fu (Learn Prompting for Kids)

## Vision & Objective
Sekolah Prompt-Fu is a lightweight, standalone, gamified interactive learning web application designed for primary school students (Standard 1 / Tahun 1) to learn prompt engineering and AI literacy ("Learn Prompting for Kids") aligned with Malaysian KSSR Semakan & KBAT methodology.

The application is built 100% static (`output: 'export'`) with client-side persistence and zero server dependencies, fully localized in Bahasa Melayu (`ms`) and English (`en`), deployable on GitHub Pages.

## Key Decisions

1. **Prompt-First Syllabus Integration (KSSR & KBAT):**
   - Core learning remains prompt engineering (how to instruct AI, specify context, role-play, constrain formats, give feedback).
   - Subject domain knowledge (BM, English, Math, Science, Pendidikan Moral) serves as authentic context for prompt tasks (e.g. instructing AI to check rhyming words, count items, classify living things, solve moral dilemmas).

2. **Static-First Architecture (GitHub Pages Ready):**
   - Next.js `output: 'export'` with `images: { unoptimized: true }`.
   - Client-side persistence using `localStorage` for level progress, stars, volume, and section completion.
   - Zero database or server runtime dependencies.

3. **Bilingual Navigation & Zero Silent Fallback:**
   - Fast dual-toggle "BM | EN" on the header for instant locale switching.
   - All levels authored in both BM (`src/content/kids/ms/`) and English (`src/content/kids/en/`).

4. **Quality Gates & Clean Imports:**
   - Dedicated scripts for import closure and vocabulary checks wired into CI to prevent rot.
   - Authentic Malaysian educational standards (KSSR Semakan, DSKP Tahun 1).

## Current Milestone: v1.1 Sekolah Prompt-Fu Rebrand, Tech Debt, & KSSR Tahun 1 Integration

**Goal:** Establish authentic Sekolah Prompt-Fu branding (replace prompts.chat social previews), clean all accumulated technical debts/guard scripts, add header BM/EN quick toggle, and design & pilot Malaysian Standard 1 (KSSR/KBAT) prompt-based learning levels.

**Target features:**
- Purge legacy prompts.chat Open Graph preview images (`og.png`, `opengraph-image.png`) and replace with custom Sekolah Prompt-Fu banner.
- Repair `scripts/check-kids-import-closure.js` for promoted root paths; wire closure and `check-ms-vocabulary.js` into `package.json` scripts and `ci.yml`.
- Unify locale definitions (`prompts.config.ts`, `src/lib/i18n/config.ts`, `settings-modal.tsx`) to single source of truth.
- Header quick toggle button ("BM | EN") next to Music & Settings buttons.
- Clean residual assets, stale prisma ignores, unused test mocks, and sync documentation test counts.
- Research KSSR Semakan Standard 1 DSKP (BM, English, Matematik, Sains, Pendidikan Moral) & formulate prompt-based learning pedagogy.
- Author and pilot initial Standard 1 prompt-learning levels with interactive widgets in both BM & EN.

## Requirements

### Validated
- ✓ Repository purged to a kids-only surface: Prisma/NextAuth/non-kids routes and component families removed, npm lockfile cut from 1,492 → 826 packages, community prompt datasets deleted — v1.0
- ✓ 19 gamified interactive prompting levels with interactive widgets (`src/content/kids/en/*.mdx`); client-side progress (`localStorage`), audio/background-music engine, and pixel-art UI retained — v1.0
- ✓ Kids game promoted to the root experience (`/`, `/map`, `/level/[slug]`) as a 100% static `out/` export with a GitHub Pages deploy workflow and locally-bundled music — v1.0
- ✓ Bahasa Melayu (`ms`) locale fully selectable, with a complete 212-key UI message bundle (`messages/ms.json`) and all 19 interactive MDX levels localized under `src/content/kids/ms/`; no silent English fallback — v1.0
- ✓ NFR-2 certified end-to-end via a committed, rerunnable verification script (`scripts/verify-project.js` / `npm run verify`) and a CI job enforcing the same gate set (`--gates-only`, bounded gate timeout) — v1.0
- ✓ Onboarding handoff (`.planning/HANDOFF.md`) documenting architecture, gate commands, deploy process, and known non-blocking advisories — v1.0
- ✓ Milestone audit: 6/6 requirements satisfied, 4/4 phases verified, 6/6 cross-phase integrations wired, 5/5 E2E flows complete — no critical blockers (`tech_debt` only) — v1.0

### Active
- [ ] BRAND-01: Replace prompts.chat social preview (`public/og.png`, `src/app/opengraph-image.png`) with Sekolah Prompt-Fu branded banner.
- [ ] GUARD-01: Fix `scripts/check-kids-import-closure.js` entry points and wire closure + vocab check into `package.json` and CI.
- [ ] I18N-01: Single source of truth for supported locales, eliminating drift between modal and config.
- [ ] UI-01: Dual toggle "BM | EN" on the header for instant locale switching.
- [ ] CLEAN-01: Remove residual non-kids assets, clean stale prisma ignores, update HANDOFF metrics.
- [ ] KSSR-01: Research and design KSSR Semakan Year 1 prompt-learning syllabus (BM, Math, Science, English, Moral).
- [ ] KSSR-02: Author and wire pilot Year 1 prompt-learning levels in both BM and English.

### Out of Scope
- Backend database / server-side user accounts (progress is browser-local).
- Live paid LLM calls via secret server keys (game relies on pre-programmed interactive feedback, heuristics, and simulations).
- Higher primary standards (Tahun 2 - 6 deferred to future milestones).

## Context
Shipped **v1.0** on 2026-11-07. Stack: Next.js (App Router, `output: 'export'`), TypeScript, next-intl (en + ms), Vitest, GitHub Actions → GitHub Pages. Test suite is 119/119; `npm run verify` re-certifies tsc + Vitest + `out/` inspection.

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
*Last updated: 2026-11-07 (Milestone v1.1 initialization)*
