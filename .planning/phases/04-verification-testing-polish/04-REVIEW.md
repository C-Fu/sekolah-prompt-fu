---
phase: 04-verification-testing-polish
reviewed: 2026-11-05T12:57:29Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - scripts/verify-project.js
  - package.json
  - .github/workflows/ci.yml
findings:
  critical: 1
  warning: 2
  info: 3
  total: 6
status: issues_found
---

# Phase 4: Code Review Report

**Reviewed:** 2026-11-05T12:57:29Z
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Reviewed the three Phase-4 source changes: the new `scripts/verify-project.js` NFR-2 certification gate, its `npm run verify` alias in `package.json`, and the two new steps in `.github/workflows/ci.yml`.

The verify script itself is well-structured and honors the project's exit-code-gate / fail-loud-on-empty-set conventions: it emits a non-zero exit on absent `out/`, on an empty derived slug set, and on any missing artifact or failed gate; it is genuinely read-only; and its command strings are static literals (no injection surface). The `deriveLevelSlugs` regex (`/slug:\s*"([^"]+)"/`) correctly filters world slugs (`starter-village`, `clarity-castle`, …) via the `/^\d-\d-/` guard and correctly ignores the non-literal `slug: string` type/parameter occurrences; I verified it derives exactly the 19 expected level slugs from `src/lib/kids/levels.ts`.

However, there is a **shipping-blocker integration defect**: the CI workflow that consumes the script can never pass. `ci.yml` runs `npm run verify` but never builds `out/`, and `out/` is gitignored (`.gitignore:18`) and entirely untracked — so on a clean CI checkout the script hits its own `out/ does not exist` guard and exits 1 on **every** run. I reproduced this against a clean worktree of `HEAD` (exit code 1, message `out/ does not exist`). The gate is red-by-construction.

The remaining findings are quality/robustness concerns (a duplicated full test-suite run in CI, no per-gate timeout, and an early-exit that suppresses the aggregated verdict).

## Critical Issues

### CR-01: CI `Run verification script` step can never pass — verify runs against a frozen, never-built `out/`

**File:** `.github/workflows/ci.yml:40-41` (with `scripts/verify-project.js:100-106`)
**Issue:** The new CI step runs `npm run verify`, but `ci.yml` has no `npm run build` step (by design — D-12 keeps the build in `deploy.yml`). `scripts/verify-project.js` unconditionally requires the already-built `out/` tree and hard-exits 1 when it is absent:

```js
if (!fs.existsSync(OUT)) {
  console.error(
    "❌ out/ does not exist — run `npm run build` before `npm run verify` ..."
  );
  process.exit(1);
}
```

On a GitHub Actions runner, `actions/checkout` produces a clean tree, and `out/` is both gitignored (`.gitignore:18`) and untracked (`git ls-files out` returns nothing), so it is never present. `npm ci` does not build it. Therefore the `Run verification script` step fails on every push/PR, making the required CI check permanently red — and the phase's NFR-2 certification claim ("CI enforces the certified gates") is not actually enforced by a passing pipeline.

Reproduced against a clean worktree of `HEAD` (`git worktree add /tmp/cleanrepo HEAD`):

```
🔎 Project verification — NFR-2 certification (read-only)
   ✘ tsc --noEmit
   ✘ vitest run
❌ out/ does not exist — run `npm run build` before `npm run verify` ...
EXIT CODE: 1
```

**Fix:** Resolve the contradiction between the artifact-inspection requirement (D-03) and the no-build-in-CI decision (D-12). Options, in rough preference order:

1. **Build once in CI, then verify** (the artifact-inspection gate then has a real tree to inspect; keep `deploy.yml` as the deployment build):
   ```yaml
   - name: Build static export (for verification)
     run: npm run build

   - name: Run verification script
     run: npm run verify
   ```
   (If the intent is strictly "don't double-build," accept that CI cannot run the artifact portion and either:)
2. **Split the gates in CI** so `out/` inspection only runs where a build exists — e.g. add a `--gates-only` flag to `verify-project.js` that runs `tsc` + `vitest` and skips the `out/` inspection, and have `ci.yml` invoke that, reserving the full script for `deploy.yml` after its build, or
3. **Remove the `npm run verify` step from `ci.yml`** and run the full verify only in `deploy.yml` after the build step.

Do not leave the step in place as-is: it is guaranteed to fail.

## Warnings

### WR-01: CI runs the full Vitest suite twice on every run (`npm test` then `npm run verify` → `npm test`)

**File:** `.github/workflows/ci.yml:37-41` (with `scripts/verify-project.js:80-83`)
**Issue:** `ci.yml` runs `npm test` in the `Run tests` step and then immediately runs `npm run verify`, whose first certified gate is `runGate("vitest run", "npm test")` — i.e. the entire Vitest suite is executed a second time on the same runner. This doubles suite runtime and doubles the flakiness surface for no additional signal; the second run also re-executes `src/__tests__/scripts/verify-project.test.ts`, which spawns the verify script as a subprocess. Once CR-01 is resolved this becomes a real cost on every push/PR.
**Fix:** Give the script a mode that assumes gates have already been run (e.g. `verify-project.js --artifacts-only`) and use it in `ci.yml` after the `Run tests` step, or drop the redundant standalone `Run tests` step and rely on `verify-project.js`'s gate. Keep exactly one invocation of the suite per CI run.

### WR-02: Certified gates run with no timeout — a hung gate hangs verification (and CI) indefinitely

**File:** `scripts/verify-project.js:40-51`
**Issue:** `runGate` calls `execSync(command, { cwd, stdio, encoding })` with no `timeout`. If `npx tsc` or `npm test` ever hangs (e.g. watchers, interactive prompt, stuck worker), the verification script — and the CI job invoking it — blocks until the runner's own job timeout (default 6 h), producing no actionable failure. The Node-stdlib gate convention in this repo (`check-ms-vocabulary.js`) wraps `execSync` with an explicit configuration too, and a bounded gate is the natural extension of the existing exit-code-gate discipline.
**Fix:** Pass a generous but finite `timeout` (and surface the timeout as a gate failure):
```js
execSync(command, {
  cwd: ROOT,
  stdio: ["ignore", "pipe", "inherit"],
  encoding: "utf8",
  timeout: 5 * 60 * 1000, // 5 min
});
```

## Info

### IN-01: Absent `out/` short-circuits before the aggregated verdict, hiding failed gates from the summary block

**File:** `scripts/verify-project.js:100-106`
**Issue:** When `out/` is absent, the script `process.exit(1)`s immediately, before the "NFR-2 certification FAILED (N problem(s))" block that lists collected `problems`. Failed gates were already printed inline (`✘ tsc --noEmit`), so the information is not lost — but the final structured verdict is skipped in exactly the CI-relevant case, making the summary line inconsistent with the "fail loud with a problem list" convention.
**Fix:** Collect the absent-`out/` case into `problems` and fall through to the shared verdict block (still exiting 1), rather than exiting early. Low priority.

### IN-02: `out/` presence is checked but not that it is a directory or freshly built

**File:** `scripts/verify-project.js:100`, `108-147`
**Issue:** `fs.existsSync(OUT)` accepts a regular file named `out`. Subsequent `path.join(OUT, "index.html")` checks would then fail loudly, so behavior is still safe, but a stale `out/` from an earlier build passes inspection identically to a fresh one (no mtime/lockfile correlation). This is explicitly out of scope per the file header, so purely informational.
**Fix:** Optionally assert `fs.statSync(OUT).isDirectory()`, and document (already partly done in the header) that freshness is the caller's responsibility.

### IN-03: Gate ordering runs `npm test` even when `tsc` already failed

**File:** `scripts/verify-project.js:80-83`
**Issue:** Both gates are the arguments to an eagerly-evaluated array literal, so `npm test` runs even if `tsc --noEmit` failed. This is not incorrect (both failures are reported), but it lengthens a doomed run. Informational only.
**Fix:** If desired, short-circuit the second gate when the first fails; otherwise leave as-is.

---

_Reviewed: 2026-11-05T12:57:29Z_
_Reviewer: the agent (gsd-code-reviewer)_
_Depth: standard_