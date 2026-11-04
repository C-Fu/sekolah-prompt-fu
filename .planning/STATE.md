# Project State

## Status
- **Current Phase:** Phase 1 (Purge Non-Kids Code & Dependencies)
- **Status:** Ready to start Phase 1
- **Next Command:** `/gsd-plan-phase 1`

## Key Decisions
- Pure client-side static site architecture for GitHub Pages deployment.
- Storage and game state managed in `localStorage`.
- Support for Bahasa Melayu (`ms`) added across UI and all 17 MDX levels.
- Stripping all server/database dependencies (PostgreSQL, Prisma, NextAuth).
- Root layout is a kids-compatible, auth-free, request-independent shell; the shared `Providers` wrapper exposes only `NextIntlClientProvider` (locale/messages kept as props for later client locale switching).
- i18n request config is deterministic (bundled default-locale messages, no cookie/header lookup); a locale candidate is validated against `supportedLocales` before any message import path is built.
- Kids level content is selected on the client from a validated slug via a statically analyzable, bounded lazy MDX import map (English fallback only when the locale module is absent); the level page performs no request-time locale read.
- Mounted MDX Sections own stable identities resolved to ordered indexes from document order; navigation locking is identity-scoped and fails closed. The legacy numeric context signatures stay callable but cannot unlock a mounted interactive Section until 01-16 migrates the consumers.
- All nine retained interactive MDX consumers (drag-drop-prompt, example-matcher, magic-words, prompt-doctor, prompt-lab, prompt-parts, prompt-vs-mistake, step-by-step, word-predictor) resolve their containing Section via `useSectionIdentity()` and register/persist completion by that resolved index, never the navigation cursor. Adjacent repeated challenges (WordPredictor 3/4, PromptVsMistake 7/8) lock and complete independently. Completion writes refuse an unresolved identity (fail closed). The wrapper's current-Section lock now recomputes on `completedSections` changes so an identity-scoped completion actually unlocks Next (Rule 2 fix in 01-16).

## Session
- **Last session:** 2026-11-05
- **Stopped At:** Completed 01-16-PLAN.md
- **Resume File:** None
- **Last Completed Plan:** 01-16 (Section-scoped interactive consumers)
