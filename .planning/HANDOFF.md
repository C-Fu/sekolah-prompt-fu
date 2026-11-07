# HANDOFF — Sekolah Prompt-Fu (Learn Prompting for Kids)

**Verdict:** **PASS.** The standalone kids prompting game is static-first, self-contained, and GitHub Pages-ready. The certified gates reproduce cleanly — `npx tsc --noEmit` → 0, Vitest → 94/94, `npm run build` emits a static `out/` export, and `npm run verify` re-certifies all of it with one command. Two pre-existing, non-blocking advisories (WR-04, IN-03) are handed off, unfixed, to a future phase.

This is the single onboarding/handoff document for the next owner (human or agent). It covers, in order: the **architecture recap**, the **gate commands**, the **GitHub Pages deploy process**, and the **known non-blocking advisories**.

---

## 1. Architecture Recap

The app is a **100% static-first Next.js export**. There is no database, no server runtime, and no network backend — the entire game is compiled to static HTML/JS/CSS and served as files.

| Aspect | What it is | Source |
|--------|------------|--------|
| Export mode | `output: 'export'` + `images: { unoptimized: true }` + `trailingSlash: true` (directory-index output, so every route is `<route>/index.html` for GitHub Pages clean URLs) | `next.config.ts` (Phase 2) |
| Backend | **Zero** database / server-runtime dependencies (PostgreSQL, Prisma, NextAuth all purged in Phase 1) | Phase 1 |
| Persistence | **All** client-side via `localStorage`: level progress, stars, sound/volume settings, section completion | `src/lib/kids/progress.ts` |
| Routes | Kids game served at the application **root**: `/` (home), `/map` (world map), `/level/[slug]` (19 interactive MDX levels) | `src/app/**` (Phase 2) |
| basePath / assets | `basePath`, `assetPrefix`, and the bundled music URL are all driven by `NEXT_PUBLIC_BASE_PATH` (empty by default, so local `npm run build` stays navigable) | `next.config.ts`, `src/components/kids/layout/background-music.tsx` |
| Localization | English (`en`) + Bahasa Melayu (`ms`) fully selectable; 19 levels localized under `src/content/kids/ms/`; no silent English fallback | Phase 3 |

**Key consequence:** any feature that would need a server (accounts, live LLM calls, cross-device sync) is out of scope by design. Progress lives and dies with the browser's `localStorage`.

---

## 2. Gate Commands (Certified Quality Stack)

These are the **certified gates**. Run them before any change lands. The claim set is deliberately bounded to four commands (D-02).

| Gate | Command | What it proves |
|------|---------|----------------|
| Type check | `npx tsc --noEmit` | TypeScript types are sound (exit 0). |
| Unit tests | `npm test` | Vitest suite (`vitest run`) — currently **94/94** passing. |
| Static build | `npm run build` | Next.js static export → emits the `out/` tree (`/`, `/map`, 19 level routes, bundled media). |
| Re-certify | `npm run verify` | Runs `npx tsc --noEmit` + `npm test` **and** inspects the built `out/` tree, then prints a PASS/FAIL verdict (`✅`/`❌`, exit 0/1). |

### Ordering note (important)

`npm run verify` does **NOT** run the build. The static build stays solely in `deploy.yml` so CI never builds twice. Therefore `out/` must already exist before `npm run verify` will pass:

```bash
npm run build      # emits out/ (build stays out of `verify` by design)
npm run verify     # re-runs tsc + vitest and inspects the existing out/ tree
```

If `out/` is absent, `npm run verify` fails loudly (exit 1) with a "run `npm run build` first" message — it never passes silently on a missing artifact.

`npm run verify` is the **rerunnable source of truth** for certification (D-04); it is committed at `scripts/verify-project.js` (Node stdlib only, read-only) and is wired into CI alongside the same tsc step, so local and CI certification share the identical gate set.

> **Bounded claim:** lint, `lint:mdx`, and the guard scripts (`check-ms-vocabulary.js`, `check-kids-import-closure.js`) run in CI but are **not** part of the certified NFR-2 gate set (D-02). Do not present them as NFR-2 evidence.

---

## 3. GitHub Pages Deploy Process

Deployment is a GitHub Actions pipeline in `.github/workflows/deploy.yml`.

| Aspect | Value |
|--------|-------|
| Trigger | `push` to `main` and `workflow_dispatch` |
| Permissions | Least-privilege: `contents: read`, `pages: write`, `id-token: write` |
| Concurrency | `group: "pages"`, `cancel-in-progress: false` (never cancel an in-progress production run) |
| Environment | `github-pages` |

**Build job steps:**

1. `actions/checkout@v6` — checkout the repository.
2. `actions/setup-node@v6` — **Node 24**, `cache: 'npm'`.
3. `npm ci` — clean install.
4. `npm run build` — static export with env:
   - `NEXT_PUBLIC_BASE_PATH=/<repo-name>` (derived from `github.event.repository.name`)
   - `NEXT_PUBLIC_SITE_URL=https://<owner>.github.io/<repo-name>`
5. `actions/configure-pages@v5` — setup Pages.
6. `actions/upload-pages-artifact@v3` with `path: ./out` — upload the static bundle.

**Deploy job:** `needs: build`, runs under the `github-pages` environment, and uses `actions/deploy-pages@v4` (`id: deployment`).

**`ci.yml` is separate** — it runs lint + `lint:ms` + type-check + tests + `npm run verify` and **does not build**. The build exists only in `deploy.yml` (D-12/D-13). `deploy.yml` was intentionally not hardened with additional gates in Phase 4.

---

## 4. Known Non-Blocking Advisories

These are **known, tracked, and non-blocking** — recorded here so the next owner sees them, but **NOT fixed in Phase 4** (D-07/D-08). Both are `open` in `.planning/phases/03-bahasa-melayu-ms-localization/03-REVIEW-DISPOSITION.md`.

| # | Finding | Category | Why Advisory |
|---|---------|----------|--------------|
| 1 | **WR-04** — `src/components/kids/layout/settings-modal.tsx` hard-codes a third locale list that has already drifted from the source of truth (`supportedLocales`; e.g. `he` absent). | architectural | Pre-existing maintainability/drift risk. Tracked in `03-REVIEW-DISPOSITION.md`; belongs to a future phase, not Phase 4 (D-02/D-08). |
| 2 | **IN-03** — duplicated locale literal arrays across `prompts.config.ts` and `src/lib/i18n/config.ts`. | architecture / maintainability | Pre-existing duplication risk. Defer to a future refactor phase. |

**Framing (from `03-REVIEW-DISPOSITION.md`):** both rows remain `open`; they are recorded, not yet triaged. They do **not** break any must-have and must be fixed in their own future phase — do **not** fix them here.

---

## Handoff Summary

- The game is static, self-contained, and deploys to GitHub Pages via `deploy.yml` on push to `main`.
- The certified gates are `npx tsc --noEmit`, `npm test`, `npm run build`, and `npm run verify` (the rerunnable certification source of truth).
- `npm run verify` inspects the **already-built** `out/` — run `npm run build` first; the script never builds.
- WR-04 and IN-03 are known, tracked, non-blocking advisories handed off unfixed.

---

_Phase: 04-verification-testing-polish_
_Written: 2026-11-05_