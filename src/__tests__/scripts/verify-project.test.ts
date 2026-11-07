/**
 * Behavioral tests for scripts/verify-project.js — the NFR-2 certification gate.
 *
 * The script is Node-stdlib and bound to its own repo root (`__dirname/..`), so
 * these tests run it as a subprocess against *sandboxed repo roots* built in a
 * temp dir (a synthetic `out/` tree + a synthetic `src/lib/kids/levels.ts`).
 * That exercises the real code paths — slug derivation, refuse-loudly on an
 * absent `out/`, refuse-loudly on an empty derived slug set, per-artifact checks
 * — without mutating the real `out/` tree.
 *
 * Note: the script's two certified gates (`npx tsc --noEmit`, `npm test`) cannot
 * pass inside a bare sandbox (no deps installed), so gate failure is expected and
 * asserted separately; the artifact-inspection behaviors are asserted on their own
 * output lines/exit status so a gate failure does not mask them.
 *
 * Deferred review findings (04-REVIEW.md, recorded, not implemented here):
 *   - IN-02 (assert `out/` is a directory) — DEFERRED. `fs.existsSync(OUT)`
 *     accepting a regular file is still safe (every downstream `path.join(OUT, …)`
 *     `existsSync` fails loudly), and `04-REVIEW.md:112` calls it "explicitly out of
 *     scope per the file header … purely informational". Adding `statSync().isDirectory()`
 *     would change default-mode behaviour beyond the gap-closure scope.
 *   - IN-03 (short-circuit `npm test` when `tsc` fails) — DEFERRED.
 *     `04-REVIEW.md:118` calls it "Informational only"; running both gates reports
 *     both failures, and short-circuiting would change the certified-gate reporting
 *     contract.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");
const SCRIPT_SRC = path.join(REPO_ROOT, "scripts", "verify-project.js");

/** Create a sandbox repo root containing a copy of the real script. */
function makeSandbox(name: string, opts: {
  slugs?: string[];
  withLevelsTs?: boolean;
  withOut?: boolean;
  rootIndex?: boolean;
  mapIndex?: boolean;
  music?: boolean;
  emittedSlugs?: string[];
}): string {
  const {
    slugs = [],
    withLevelsTs = true,
    withOut = true,
    rootIndex = true,
    mapIndex = true,
    music = true,
    emittedSlugs = slugs,
  } = opts;

  const base = fs.mkdtempSync(path.join(os.tmpdir(), `vp-${name}-`));
  fs.mkdirSync(path.join(base, "scripts"), { recursive: true });
  fs.copyFileSync(SCRIPT_SRC, path.join(base, "scripts", "verify-project.js"));

  if (withLevelsTs) {
    fs.mkdirSync(path.join(base, "src", "lib", "kids"), { recursive: true });
    const entries = slugs
      .map((s, i) => `  { slug: "${s}", world: ${i} },`)
      .join("\n");
    fs.writeFileSync(
      path.join(base, "src", "lib", "kids", "levels.ts"),
      `export const worlds = [\n${entries}\n];\n`,
    );
  }

  if (withOut) {
    const out = path.join(base, "out");
    fs.mkdirSync(out, { recursive: true });
    if (rootIndex) fs.writeFileSync(path.join(out, "index.html"), "<html></html>");
    if (mapIndex) {
      fs.mkdirSync(path.join(out, "map"), { recursive: true });
      fs.writeFileSync(path.join(out, "map", "index.html"), "x");
    }
    if (music) fs.writeFileSync(path.join(out, "kids-music.mp3"), "x");
    for (const s of emittedSlugs) {
      const dir = path.join(out, "level", s);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "index.html"), "x");
    }
  }

  return base;
}

/** Run the sandboxed script; return exit code + combined output.
 *  `args` appends extra argv (e.g. `["--gates-only"]`); defaults to none. */
function runVerify(cwd: string, args: string[] = []): { code: number; output: string } {
  try {
    const output = execFileSync("node", ["scripts/verify-project.js", ...args], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, output };
  } catch (err) {
    const e = err as { status?: number; stdout?: string; stderr?: string };
    return {
      code: e.status ?? -1,
      output: `${e.stdout ?? ""}${e.stderr ?? ""}`,
    };
  }
}

const created: string[] = [];
function sandbox(name: string, opts: Parameters<typeof makeSandbox>[1]): string {
  const b = makeSandbox(name, opts);
  created.push(b);
  return b;
}

afterAll(() => {
  for (const b of created) fs.rmSync(b, { recursive: true, force: true });
});

describe("scripts/verify-project.js — refuse-loudly paths", () => {
  it("exits non-zero with a loud message when out/ is absent (does not pass silently)", () => {
    const base = sandbox("noout", {
      slugs: ["1-1-meet-peromfu"],
      withOut: false,
    });
    const { code, output } = runVerify(base);
    expect(code).toBe(1);
    expect(output).toContain("out/ does not exist");
    expect(output).toContain("npm run build");
    expect(output).not.toContain("✅ NFR-2 certified");
  });

  it("aggregates the absent-out/ case into the FAILED verdict block (IN-01)", () => {
    const base = sandbox("noout-agg", {
      slugs: ["1-1-meet-peromfu"],
      withOut: false,
    });
    const { code, output } = runVerify(base);
    expect(code).toBe(1);
    // The standalone message is still visible AND the structured verdict now runs.
    expect(output).toContain("❌ out/ does not exist");
    expect(output).toContain("❌ NFR-2 certification FAILED");
    expect(output).toContain("out/ does not exist");
    // No cascade of redundant "missing …" problems after the absent-out/ problem.
    expect(output).not.toContain("missing artifact:");
    expect(output).not.toContain("missing level route:");
    expect(output).not.toContain("✅ NFR-2 certified");
  });

  it("exits non-zero when the derived level-slug set is empty (never passes on an empty set)", () => {
    const base = sandbox("emptyslugs", {
      slugs: [],
      withOut: true,
    });
    const { code, output } = runVerify(base);
    expect(code).toBe(1);
    expect(output).toContain("no level slugs derived");
    expect(output).toContain("refusing to pass silently");
    expect(output).not.toContain("✅ NFR-2 certified");
  });

  it("exits non-zero when levels.ts is unreadable (empty derived set fallback)", () => {
    const base = sandbox("nolevelsts", {
      withLevelsTs: false,
      withOut: true,
    });
    const { code, output } = runVerify(base);
    expect(code).toBe(1);
    expect(output).toContain("no level slugs derived");
    expect(output).not.toContain("✅ NFR-2 certified");
  });
});

describe("scripts/verify-project.js — artifact inspection", () => {
  it("names each missing level route by slug and exits non-zero", () => {
    const base = sandbox("misslevel", {
      slugs: ["1-1-meet-peromfu", "2-1-missing-details"],
      emittedSlugs: ["1-1-meet-peromfu"], // 2-1 deliberately not emitted
    });
    const { code, output } = runVerify(base);
    expect(code).toBe(1);
    expect(output).toContain("missing level route: out/level/2-1-missing-details/index.html");
    expect(output).not.toContain("✅ NFR-2 certified");
  });

  it("reports a missing /map route", () => {
    const base = sandbox("nomapl", {
      slugs: ["1-1-meet-peromfu"],
      mapIndex: false,
    });
    const { code, output } = runVerify(base);
    expect(code).toBe(1);
    expect(output).toContain("missing artifact: out/map/index.html");
    expect(output).not.toContain("✅ NFR-2 certified");
  });

  it("reports a missing root / route", () => {
    const base = sandbox("noroot", {
      slugs: ["1-1-meet-peromfu"],
      rootIndex: false,
    });
    const { code, output } = runVerify(base);
    expect(code).toBe(1);
    expect(output).toContain("missing artifact: out/index.html");
    expect(output).not.toContain("✅ NFR-2 certified");
  });

  it("reports a missing bundled media asset", () => {
    const base = sandbox("nomusic", {
      slugs: ["1-1-meet-peromfu"],
      music: false,
    });
    const { code, output } = runVerify(base);
    expect(code).toBe(1);
    expect(output).toContain("missing artifact: out/kids-music.mp3");
    expect(output).not.toContain("✅ NFR-2 certified");
  });

  it("derives the slug set from levels.ts text (not a hard-coded count)", () => {
    // A non-slug-shaped `slug:` value (world slug) must NOT be treated as a level.
    const base = sandbox("derive", {
      slugs: ["1-1-meet-peromfu", "5-4-graduation-day"],
      emittedSlugs: ["1-1-meet-peromfu", "5-4-graduation-day"],
    });
    // Inject a world-style slug that does not match /^\d-\d-/.
    const levelsPath = path.join(base, "src", "lib", "kids", "levels.ts");
    fs.appendFileSync(levelsPath, `\nexport const worldSlug = { slug: "starter-village" };\n`);

    const { output } = runVerify(base);
    // The world slug is present in the artifact output only if wrongly derived.
    expect(output).not.toContain("starter-village");
    expect(output).toContain("2/2 level routes");
  });
});

describe("scripts/verify-project.js — real built tree (integration)", () => {
  const outExists = fs.existsSync(path.join(REPO_ROOT, "out"));

  it.runIf(outExists)(
    "certifies the real repo out/ tree: exit 0 and a PASS verdict naming tsc, vitest, routes and media",
    () => {
      // Shadow the certified gates with stubs that exit 0: the point of this
      // test is to certify the REAL out/ artifact set end-to-end. Running the
      // real `npm test` here would recurse into Vitest (this very suite).
      const bin = fs.mkdtempSync(path.join(os.tmpdir(), "vp-realbin-"));
      for (const cmd of ["npm", "npx", "node"]) {
        // keep real node for the script itself; only stub npm/npx if needed
        if (cmd === "node") continue;
        const p = path.join(bin, cmd);
        fs.writeFileSync(p, "#!/bin/sh\nexit 0\n");
        fs.chmodSync(p, 0o755);
      }
      const env = { ...process.env, PATH: `${bin}:${process.env.PATH}` };
      let code = -1;
      let output = "";
      try {
        output = execFileSync("node", ["scripts/verify-project.js"], {
          cwd: REPO_ROOT,
          encoding: "utf8",
          env,
          stdio: ["ignore", "pipe", "pipe"],
        });
        code = 0;
      } catch (err) {
        const e = err as { status?: number; stdout?: string; stderr?: string };
        code = e.status ?? -1;
        output = `${e.stdout ?? ""}${e.stderr ?? ""}`;
      } finally {
        fs.rmSync(bin, { recursive: true, force: true });
      }

      expect(code).toBe(0);
      expect(output).toContain("✅ NFR-2 certified");
      expect(output).toMatch(/\d+\/\d+ level routes/);
      expect(output).toContain("bundled media");
    },
    60_000,
  );
});

describe("scripts/verify-project.js — --gates-only mode", () => {
  it("does not hard-fail on an absent out/ (skips the artifact inspection)", () => {
    // The sandbox has no deps, so the two certified gates themselves fail; the
    // point is the out/ dimension: gates-only must NOT report the absent-out/
    // problem (it never inspects out/).
    const base = sandbox("gatesonly-noout", {
      slugs: ["1-1-meet-peromfu"],
      withOut: false,
    });
    const { output } = runVerify(base, ["--gates-only"]);
    expect(output).not.toContain("out/ does not exist");
    expect(output).not.toContain("missing artifact:");
    expect(output).not.toContain("missing level route:");
  });

  it("does not inspect artifacts when out/ is absent (no route/media claims)", () => {
    const base = sandbox("gatesonly-noinspect", {
      slugs: ["1-1-meet-peromfu"],
      withOut: false,
    });
    const { output } = runVerify(base, ["--gates-only"]);
    expect(output).not.toContain("level routes");
    expect(output).not.toContain("bundled media");
    expect(output).not.toContain("out/map/index.html");
  });

  it("runs only the two certified gates and skips artifact inspection even when out/ is present", () => {
    const base = sandbox("gatesonly-without", {
      slugs: ["1-1-meet-peromfu"],
      emittedSlugs: ["1-1-meet-peromfu"],
    });
    const { output } = runVerify(base, ["--gates-only"]);
    // out/ exists and is complete, yet gates-only still does not inspect it.
    expect(output).not.toContain("root / route");
    expect(output).not.toContain("bundled media");
  });

  it("exits non-zero with a usage message naming --gates-only for an unknown flag", () => {
    const base = sandbox("bogusflag", { slugs: ["1-1-meet-peromfu"] });
    const { code, output } = runVerify(base, ["--bogus"]);
    expect(code).toBe(1);
    expect(output).toContain("--bogus");
    expect(output).toContain("--gates-only");
  });
});

describe("scripts/verify-project.js — D-12: never runs the build", () => {
  it("does not invoke `npm run build` even when out/ is absent", () => {
    const base = sandbox("nobuild", { slugs: ["1-1-meet-peromfu"], withOut: false });
    // Shadow `npm`/`npx` with sentinels that record invocation.
    const binDir = path.join(base, "bin");
    fs.mkdirSync(binDir, { recursive: true });
    const record = path.join(base, "invoked.log");
    for (const cmd of ["npm", "npx"]) {
      const p = path.join(binDir, cmd);
      fs.writeFileSync(p, `#!/bin/sh\necho "$${cmd} $@" >> "${record}"\nexit 0\n`);
      fs.chmodSync(p, 0o755);
    }
    const env = { ...process.env, PATH: `${binDir}:${process.env.PATH}` };
    try {
      execFileSync("node", ["scripts/verify-project.js"], {
        cwd: base,
        encoding: "utf8",
        env,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch {
      /* expect non-zero exit due to absent out/ */
    }
    const log = fs.existsSync(record) ? fs.readFileSync(record, "utf8") : "";
    expect(log).not.toContain("run build");
  });

  it("does not invoke `npm run build` in --gates-only mode either", () => {
    const base = sandbox("nobuild-gatesonly", { slugs: ["1-1-meet-peromfu"], withOut: false });
    const binDir = path.join(base, "bin");
    fs.mkdirSync(binDir, { recursive: true });
    const record = path.join(base, "invoked.log");
    for (const cmd of ["npm", "npx"]) {
      const p = path.join(binDir, cmd);
      fs.writeFileSync(p, `#!/bin/sh\necho "$${cmd} $@" >> "${record}"\nexit 0\n`);
      fs.chmodSync(p, 0o755);
    }
    const env = { ...process.env, PATH: `${binDir}:${process.env.PATH}` };
    try {
      execFileSync("node", ["scripts/verify-project.js", "--gates-only"], {
        cwd: base,
        encoding: "utf8",
        env,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch {
      /* stubbed gates exit 0, so this should not throw; tolerate either way */
    }
    const log = fs.existsSync(record) ? fs.readFileSync(record, "utf8") : "";
    expect(log).not.toContain("run build");
  });
});