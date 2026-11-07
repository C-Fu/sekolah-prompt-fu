# Milestones

## v1.0 Kids Prompting Game Standalone & GitHub Pages (Shipped: 2026-11-07)

**Phases completed:** 5 phases, 27 plans, 51 tasks

**Key accomplishments:**
- Kids entry now renders through an auth-free, request-independent root shell: header/footer/ads/analytics/pathname branching and the SessionProvider/theme/branding wrappers are gone, and the intl request config ships bundled default-locale messages with no cookie/header lookup.
- Pruned the npm manifest/lockfile to a kids-only surface (1492 -> 826 locked packages), deleted community prompt datasets and legacy published/job assets, dropped DATABASE_URL from CI, and passed all four mandatory gates while preserving all 19 kids levels; the single mandated lock-audit divergence was human-waived.
- Removed the non-kids book MDX corpus and editor data (565 files, ~215k lines) and pruned shared providers/UI primitives/hooks down to the exact files the retained kids game imports — `providers/index.tsx`, `ui/button.tsx`, `ui/sonner.tsx` — with the kids import closure staying green.
- The retained `/kids/level/[slug]` route now selects compiled locale MDX on the client from a validated slug and drives navigation from an ordered, identity-scoped Section registry that fails closed on mounted interactive Sections.
- All nine retained interactive MDX elements now register requirements and persist completion against the Section they actually inhabit — resolved via `useSectionIdentity()` — so adjacent repeated challenges lock and complete independently instead of writing the navigation cursor.
- Kids language selection now switches UI messages, compiled MDX and layout direction together through a validated localStorage-persisted client preference (no request-time lookup), invalidates only locale-incompatible puzzle drafts/Section indexes for a genuine change, and clears all three kids stores only on confirmed reset.
- Kids game promoted to the application root (/, /map, /level/[slug]), music bundled locally, and a self-contained GitHub Pages static export built and deployable via a new workflow.
- Registered `ms` across all five locale registries, authored a complete 212-key Bahasa Melayu `messages/ms.json`, and localized the 10-Section `1-1-meet-promi` MDX tracer level end-to-end — plus Wave 0 tests that fail loudly on any silent English fallback.
- Authored nine Bahasa Melayu MDX levels (World 1 tail through World 3 partial) mirroring their `en` counterparts and registered each with a literal loader — the `ms` level map now holds 10 of 19 slugs with no silent English fallback.
- Authored the final nine Bahasa Melayu MDX levels (World 3 tail through World 5), mirroring their `en` counterparts and registering each with a literal loader — the `ms` level map now holds all 19 slugs with no silent English fallback.
- Closed the phase: added a corpus-wide test proving all 19 registered slugs resolve to `ms` (never the silent English fallback), then ran the phase gate green end-to-end — tsc 0, lint 0, tests 94/94, self-failing 212-key ms/en parity, and a successful `npm run build` emitting `out/` with all 19 level routes.
- Committed Node-stdlib `scripts/verify-project.js` that re-runs `npx tsc --noEmit` + Vitest and inspects the built `out/` export (19 level routes + `/` + `/map` + bundled media), exposed as `npm run verify` and wired into `ci.yml` alongside a new tsc step — NFR-2 certified end-to-end.
- Ships `.planning/HANDOFF.md` — one onboarding doc covering the static-first architecture, the certified gate commands (`npx tsc --noEmit`, `npm test`, `npm run build`, `npm run verify`), the GitHub Pages `deploy.yml` process, and the WR-04/IN-03 advisories — and flips NFR-2 to satisfied with Phase-4 evidence after re-running the gates green.
- Closes the single Phase-4 gap (Truth 6 / CR-01) by adding a `--gates-only` mode to `scripts/verify-project.js` — CI now runs `npm run verify -- --gates-only` and passes green-by-construction on a clean checkout with no `out/`, while the default full mode keeps inspecting `out/` (D-03), the build stays solely in `deploy.yml` (D-12, byte-identical D-13), and the Vitest suite runs exactly once (WR-01), with a bounded gate timeout (WR-02) and an aggregated absent-`out/` verdict (IN-01).

---
