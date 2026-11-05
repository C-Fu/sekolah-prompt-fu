# Phase 4: Verification, Testing & Polish - Pattern Map

**Mapped:** 2026-11-05
**Files analyzed:** 4 new/modified code+doc files (+ up to 3 optional planning-certification edits)
**Analogs found:** 4 / 4 (all strong matches)
**Note:** No RESEARCH.md for this phase (research skipped). File list derived from `04-CONTEXT.md` §decisions + §specifics and §code_context §Integration Points.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `scripts/verify-*.js` (new) | utility (CLI gate) | batch / request-response (spawns gates, inspects `out/`) | `scripts/check-ms-vocabulary.js` (+ `scripts/check-kids-import-closure.js`) | exact (role + flow) |
| `package.json` (add `"verify"`) | config | transform | `package.json` existing `"lint:ms"` / `"lint:mdx"` script entries | exact |
| `.github/workflows/ci.yml` (add `tsc --noEmit` + verify step) | config (CI pipeline) | event-driven (on push/PR) | `.github/workflows/ci.yml` existing steps | exact (self) |
| `.planning/HANDOFF.md` (new) | docs artifact | transform (human/agent consumption) | `.planning/phases/03-.../03-VERIFICATION.md` (+ Phase 2 `VERIFICATION.md`) | role-match |
| `.planning/STATE.md` / `.planning/REQUIREMENTS.md` / `.planning/PROJECT.md` (optional certification notes) | config (state docs) | transform | existing files, self | exact (self) |

---

## Pattern Assignments

### `scripts/verify-*.js` (utility, batch/request-response)

**Analog:** `scripts/check-ms-vocabulary.js` (primary style) + `scripts/check-kids-import-closure.js` (structure for a `main()`-style multi-phase script)

This is the source of truth for NFR-2 certification (D-01, D-04). It must run the certified gates (`npx tsc --noEmit`, `npm test`), inspect the already-built `out/` tree (D-03), and print PASS/FAIL with a non-zero exit on failure — the Phase 1–3 **exit-code gate convention** (CONTEXT §Established Patterns). It must **NOT** run `npm run build` (D-12; build stays in `deploy.yml`). Model the whole thing on this Node-stdlib, zero-external-dep guard.

**File header + shebang pattern** (`check-ms-vocabulary.js:1-26`):
```javascript
#!/usr/bin/env node

/**
 * <one-line purpose>.
 *
 * <what it certifies, referencing NFR-2 / D-04, and exactly what a non-zero exit means>
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
```

**Root + pass/fail shape** (`check-kids-import-closure.js:25-30`, `main()` at 238-315): use a `main()` that logs a banner, does each check, accumulates `problems`, then fails loudly or prints success and exits explicitly.
```javascript
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

function main() {
  console.log("🔎 <Verification name> (read-only)\n");

  // ... run each certified gate, collect failures ...

  if (problems.length > 0) {
    console.error(`❌ <Gate> failed (${problems.length} problem(s)):\n`);
    for (const p of problems) console.error(`   ${p}`);
    console.error("");
    process.exit(1);
  }

  console.log("✅ <All certified gates pass>.");
  process.exit(0);
}

main();
```

**Spawning a gate and reading its exit code** (pattern derived from `check-ms-vocabulary.js:61-73`, which wraps `execSync` with explicit cwd/stdio/encoding and a try/catch — apply the same discipline when invoking `tsc` / `npm test`):
```javascript
function runGate(label, command) {
  try {
    execSync(command, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "inherit"], // keep stdout pipeable; stream stderr
      encoding: "utf8",
    });
    return { label, passed: true };
  } catch (err) {
    // execSync throws on non-zero exit; surface stdout for the verdict block.
    return { label, passed: false, output: (err.stdout || "").toString() };
  }
}

// Deliberately NOT run: `npm run build` — D-12 keeps the static build in deploy.yml
// so CI/local certification does not double-build. `npm run verify` inspects the
// ALREADY-BUILT out/ tree instead.
const gates = [
  runGate("tsc --noEmit", "npx tsc --noEmit"),
  runGate("vitest run", "npm test"),
];
```

**Artifact inspection pattern** — walk `out/` and assert route directories exist (adapt the recursive walk from `check-ms-vocabulary.js:42-48` / `check-kids-import-closure.js:217-236`). Directory-index output comes from `output:'export'` + `trailingSlash:true` (CONTEXT §Established Patterns): each route is `out/<route>/index.html`.
```javascript
function walkDirs(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const full = path.join(dir, entry.name);
      out.push(full);
      walkDirs(full, out);
    }
  }
  return out;
}

// D-03: confirm the emitted out/ artifact — `/` + `/map` + one index.html per
// registered level slug (19), plus bundled media (e.g. kids-music.mp3).
const OUT = path.join(ROOT, "out");
if (!fs.existsSync(OUT)) {
  console.error("❌ out/ does not exist — run `npm run build` before `npm run verify` (build stays in deploy.yml).");
  process.exit(1);
}
// Assert: out/index.html, out/map/index.html, out/level/<slug>/index.html ×19, out/kids-music.mp3
```

**Fail-loudly-on-empty-set pattern** (`check-ms-vocabulary.js:80-85`): never silently pass when the thing you're checking is absent — mirror this with a loud error + `process.exit(1)`. The 19-slug list is the source of truth from `src/lib/kids/levels.ts` (19 level-pattern slugs `/^\d-\d-/`); do NOT hard-code a count without deriving it from the registry, so the check matches Phase 2's "25 pages = 19 levels + / + /map + 404" model and Phase 3's "19 registered slugs" evidence.

**Output style** (`check-ms-vocabulary.js:157-162`): trail each certifying line with a `✔`, and keep a machine-readable summary block optional (CONTEXT §the agent's Discretion — nice-to-have, not required).

**NFR-2 certified gate set (D-02)** — exactly: `npx tsc --noEmit`, `npm test` (vitest run). Do NOT add lint / `lint:mdx` / the guard scripts to the certified output; they exist and are wired, but the NFR-2 claim stays bounded.

---

### `package.json` (config, transform)

**Analog:** self — existing script entries (`package.json:7-18`)

Add one entry that invokes the committed verification script. Match the existing short, verb-less-name convention (`lint:ms`, `lint:mdx`, `test`, `build`).

**Existing scripts block** (`package.json:7-18`):
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage",
  "lint:mdx": "node scripts/lint-mdx.js",
  "lint:ms": "node scripts/check-ms-vocabulary.js"
}
```

**Add** (name is `verify` per D-12; keep the `node scripts/...` form used by `lint:mdx`/`lint:ms`):
```json
"verify": "node scripts/verify-<name>.js"
```

---

### `.github/workflows/ci.yml` (config, event-driven)

**Analog:** self — existing steps (`ci.yml:11-35`); structure mirrors `deploy.yml:21-53` for step ordering.

Add `npx tsc --noEmit` (D-10) and a verify-script step (D-11) so CI and local certification use the identical gate set. Place `tsc` **before** tests (fast fail), and the verify step last. Node 24 + `npm ci` already match `deploy.yml`.

**Existing job** (`ci.yml:11-35`):
```yaml
jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Check `ms` vocabulary guard
        run: npm run lint:ms

      - name: Run tests
        run: npm test
```

**Append** (step names follow the existing `- name:` / `run:` two-key shape):
```yaml
      - name: Run TypeScript type check
        run: npx tsc --noEmit

      # ... existing linter / lint:ms / test steps ...

      - name: Run verification script
        run: npm run verify
```
Important: `npm run verify` deliberately excludes `npm run build` (D-12), so CI does not build twice. The build remains solely in `deploy.yml:38-45`. `deploy.yml` is **not** modified (D-13).

---

### `.planning/HANDOFF.md` (docs artifact, transform)

**Analog:** `.planning/phases/03-bahasa-melayu-ms-localization/03-VERIFICATION.md` (rich, sectioned, frontmatter'd, evidence-table style) + `.planning/phases/02-promote-kids-game-to-root-configure-static-export/VERIFICATION.md` (concise "Verdict → Goal Achievement → Concerns → Deferred" style).

There is no existing `HANDOFF.md`. Prefer the Phase-2/3 VERIFICATION.md voice: a bolded **Verdict** line up top, bullet/section headings, and evidence tables with a Status column (`✓ VERIFIED`). This is a **human/agent onboarding doc**, not a machine-gated artifact.

**Structure to mirror** (from `03-VERIFICATION.md:88-93`, `VERIFICATION.md:12-21`) — four content areas required by D-06, ordered at discretion (CONTEXT §the agent's Discretion):

1. **Architecture recap** — static-first, `output:'export'`, `trailingSlash:true`, client-only `localStorage` persistence, root routes `/`, `/map`, `/level/[slug]`. (Sourced from STATE.md §Decisions lines 79-81 and CONTEXT §Established Patterns.)
2. **Gate commands** — `npx tsc --noEmit`, `npm test`, `npm run build`, and `npm run verify`. Include exact commands (as in `03-VERIFICATION.md:184-192`).
3. **Deploy process** — `deploy.yml`: Node 24, `npm ci`, `npm run build` with `NEXT_PUBLIC_BASE_PATH=/<repo>` (lines 38-45), `configure-pages@v5`, `upload-pages-artifact@v3 path:./out`, `deploy-pages@v4` under the `github-pages` environment, least-privilege perms + `concurrency: pages` (lines 9-19).
4. **Known non-blocking advisories** — WR-04 (`settings-modal.tsx` hard-coded locale list drifted) and IN-03 (duplicated locale arrays in `prompts.config.ts` / `src/lib/i18n/config.ts`). Copy the "known, tracked, non-blocking — do not fix in Phase 4" framing from `03-REVIEW-DISPOSITION.md:58-59` (both `open`).

**Advisory-table pattern to copy** (`03-VERIFICATION.md:140-146`):
```markdown
| # | Finding | Category | Why Advisory |
|---|---------|----------|--------------|
| 1 | WR-04 — `settings-modal.tsx` hard-codes a locale list that drifted from `supportedLocales` | architectural | Pre-existing, explicitly out-of-scope per D-02. Not a Phase 4 blocker. |
| 2 | IN-03 — duplicated locale literal arrays (`prompts.config.ts` / `config.ts`) | architectural | Pre-existing maintainability risk; defer to a refactor phase. |
```

**Verdict-line pattern to copy** (`VERIFICATION.md:19-21`):
```markdown
## Verdict

**PASS.** All certified gates reproduced: `tsc --noEmit` 0, Vitest N/N passed, `out/` emits `/` + `/map` + 19 level routes + bundled media. `npm run verify` is the rerunnable certification source of truth.
```

---

### `.planning/STATE.md` / `.planning/REQUIREMENTS.md` / `.planning/PROJECT.md` (config, transform — optional)

**Analog:** self. These are certification-note edits, only if the plan certifies NFR-2 as fully satisfied.

- `REQUIREMENTS.md:30` currently reads `NFR-2: Quality & Type Safety ◑ partial (...; final certification Phase 4)`. Flip `◑ partial` → `✓ satisfied` with the Phase-4 evidence once gates pass.
- `STATE.md` has a frontmatter block (lines 1-15) + §Status / §Key Decisions. Add the Phase-4 verification summary to §Status and a Phase-04 key decision, matching the one-line `- [Phase NN]: ...` bullet style (lines 79-84).
- `PROJECT.md` — the Active checklist Phase 4 closes (CONTEXT §canonical_refs line 63). Match its existing checklist grammar; do not restructure.

Only touch these if the phase actually certifies — keep NFR-2 edits to a bounded evidence note, not a rewrite.

---

## Shared Patterns

### Exit-code gate convention
**Source:** `scripts/check-ms-vocabulary.js` (whole file); `scripts/check-kids-import-closure.js` (whole file)
**Apply to:** `scripts/verify-*.js` (and, by reference, `ci.yml` which invokes it)
Deterministic, zero-external-deps, `#!/usr/bin/env node`, `process.exit(0)` on pass / non-zero on fail, and a **loud refusal on an empty/absent check set** rather than a silent pass (`check-ms-vocabulary.js:80-85`).

### Node-stdlib only
**Source:** both guard scripts — only `fs`, `path`, and `child_process` are required (plus an inert eslint-disable in the closure checker, `check-kids-import-closure.js:2`)
**Apply to:** `scripts/verify-*.js`
No new dependencies. `execSync` is the established way to run an external gate and read its exit code (`check-ms-vocabulary.js:61-73`).

### Read-only verification
**Source:** `check-kids-import-closure.js:23` ("Read-only: never writes, moves, or deletes anything. Exit 0 = closure closed.")
**Apply to:** `scripts/verify-*.js` and HANDOFF.md (a doc)
The verifier inspects artifacts and runs gates; it never mutates the tree. If verification surfaces a real regression, the fix is a separate change (D-09), not a side effect of the script.

### GitHub Actions step shape
**Source:** `ci.yml:15-35`, `deploy.yml:25-53`
**Apply to:** `.github/workflows/ci.yml`
Steps are `- name: <Title>` + `run: <command>`; Node pinned to `'24'` via `actions/setup-node@v6` with `cache: 'npm'`; checkout `actions/checkout@v6`. New steps reuse this exact shape.

### Bounded claim set (NFR-2)
**Source:** `03-VERIFICATION.md:203` (NFR-2 partial), `REQUIREMENTS.md:30`, D-02
**Apply to:** verify script output + HANDOFF.md gate list
The certified set is exactly `tsc --noEmit` + Vitest + (build/`out/` inspection). Do not advertise lint, `lint:mdx`, or the guards as NFR-2 certified gates even though they run in CI; keeps the claim honest and bounded.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `.planning/HANDOFF.md` | docs artifact | transform | No prior `HANDOFF.md` exists; use the Phase-2/3 `VERIFICATION.md` section/table style as the structural template (role-match above). |

## Metadata

**Analog search scope:** `scripts/`, `package.json`, `.github/workflows/`, `.planning/` (phase VERIFICATION.md + REVIEW-DISPOSITION.md artifacts)
**Files scanned:** 7 read in full (`check-ms-vocabulary.js`, `check-kids-import-closure.js`, `ci.yml`, `deploy.yml`, `package.json`, Phase-3 + Phase-2 `VERIFICATION.md`, `03-REVIEW-DISPOSITION.md`), plus targeted reads of `04-CONTEXT.md`, `STATE.md`, `ROADMAP.md`, `REQUIREMENTS.md`, `levels.ts`
**Pattern extraction date:** 2026-11-05
**Tracked-source gate:** all named analogs are git-tracked repo source (`scripts/*`, `.github/workflows/*`, `package.json`, `.planning/**`); no gitignored install/runtime mirror paths emitted.