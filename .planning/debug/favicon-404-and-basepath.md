---
status: resolved
trigger: >
  Console errors in chrome: Error with Permissions-Policy header (run-ad-auction,
  join-ad-interest-group, private-aggregation, attribution-reporting); GET
  https://c-fu.github.io/favicon/site.webmanifest 404; Manifest fetch failed, code 404;
  GET https://c-fu.github.io/favicon/favicon.svg 404; GET
  https://c-fu.github.io/favicon/favicon.ico 404; GET
  https://c-fu.github.io/favicon/favicon-96x96.png 404. User instruction: "For favico
  errors, generate one using the Peromfu character as the icon".
symptoms:
  expected: >
    Favicon, apple-touch-icon, and web manifest load without errors on the deployed
    GitHub Pages project site (hosted under the /sekolah-prompt-fu/ subpath), and the
    icon is a Peromfu pixel-art robot.
  actual: >
    All favicon/manifest requests resolve to the domain root
    (https://c-fu.github.io/favicon/...) instead of the project subpath
    (https://c-fu.github.io/sekolah-prompt-fu/favicon/...), producing 404s. The icon
    itself is also not the Peromfu character.
  error: >
    Error with Permissions-Policy header: Unrecognized feature: 'run-ad-auction'.
    Error with Permissions-Policy header: Unrecognized feature: 'join-ad-interest-group'.
    Error with Permissions-Policy header: Unrecognized feature: 'private-aggregation'.
    Error with Permissions-Policy header: Unrecognized feature: 'attribution-reporting'.
    GET https://c-fu.github.io/favicon/site.webmanifest 404 (Not Found)
    Manifest fetch from https://c-fu.github.io/favicon/site.webmanifest failed, code 404
    GET https://c-fu.github.io/favicon/favicon.svg 404 (Not Found)
    GET https://c-fu.github.io/favicon/favicon.ico 404 (Not Found)
    GET https://c-fu.github.io/favicon/favicon-96x96.png 404 (Not Found)
  timeline: >
    Present on the live GitHub Pages deployment. The deployed HTML carries
    canonical "https://sekolah-prompt-fu.example/level/..." — the fallback value in
    src/lib/seo.ts getBaseUrl() — which shows the deployed bundle was built WITHOUT
    NEXT_PUBLIC_SITE_URL / NEXT_PUBLIC_BASE_PATH in its environment.
  repro: >
    Open the deployed Pages site (https://c-fu.github.io/sekolah-prompt-fu/), open
    Chrome DevTools console, observe the favicon/manifest 404s pointing at the domain
    root.
current_focus:
  hypothesis: >
    basePath/assetPrefix are read from NEXT_PUBLIC_BASE_PATH at build time
    (next.config.ts). The deployed static export was generated without that env var
    (proven by the .example fallback canonical), so Next emitted root-absolute
    asset URLs. Additionally, metadata.icons/manifest in src/app/layout.tsx use
    hardcoded root-absolute paths ("/favicon/...") that do not honour basePath, and
    public/favicon/site.webmanifest hardcodes root-absolute icon srcs
    ("/favicon/web-app-manifest-*.png") that also ignore basePath. Favicon assets
    themselves exist in public/favicon/.
  test: >
    Confirm (a) the deployed build lacked the Pages base path, and (b) whether
    metadata/manifest paths bypass basePath even when it IS set, by building with
    NEXT_PUBLIC_BASE_PATH=/sekolah-prompt-fu and inspecting emitted HTML/manifest.
  expecting: >
    With correct build env vars and basePath-aware metadata, emitted HTML references
    /sekolah-prompt-fu/favicon/* and the manifest serves from the subpath.
  next_action: complete
  reasoning_checkpoint: null
  tdd_checkpoint: null
evidence:
  - timestamp: 2026-11-06T20:05:00Z
    type: empirical
    content: >
      Built with NEXT_PUBLIC_BASE_PATH=/sekolah-prompt-fu. Emitted out/index.html
      still had <link rel="manifest" href="/favicon/site.webmanifest"/> and
      <link rel="icon" href="/favicon/favicon.svg"/> with NO subpath prefix —
      proving Next.js does not apply basePath to metadata.icons/metadata.manifest
      string URLs. OG image and canonical DID get the subpath (via metadataBase),
      confirming only the metadata.icons/manifest and the static manifest file's
      own icon srcs were broken.
  - timestamp: 2026-11-06T20:03:00Z
    type: static-analysis
    content: >
      public/favicon/ contains the asset files (apple-touch-icon.png,
      favicon-96x96.png, favicon.ico, favicon.svg, web-app-manifest-*.png) — a
      path-resolution bug, not missing files. The prior favicon*.svg/png/ico were
      generic (a 900x900 path-based SVG), not the Peromfu character.
  - timestamp: 2026-11-06T20:16:00Z
    type: verification
    content: >
      After fix, build with NEXT_PUBLIC_BASE_PATH=/sekolah-prompt-fu emits all
      icon/shortcut/apple/manifest links and both manifest icon srcs prefixed with
      /sekolah-prompt-fu/. Plain build (no env var) emits root-relative
      /favicon/... as before, so local dev is unaffected. Manifest now emitted by
      src/app/manifest.ts at out/manifest.webmanifest.
  - timestamp: 2026-11-06T20:18:00Z
    type: verification
    content: >
      Permissions-Policy console lines: no source in repo (src/, scripts/,
      .github/, public/, next.config.ts) emits a Permissions-Policy header —
      classified as non-actionable browser/Pages-header noise.
eliminated:
  - >
    Missing favicon files — assets existed in public/favicon/; the 404s were purely
    URL-resolution, not absence.
  - >
    Missing GitHub Pages base path alone — even with NEXT_PUBLIC_BASE_PATH set, the
    metadata.icons/manifest URLs stayed root-absolute, so the source paths also
    required the basePath-aware fix.
  - >
    Permissions-Policy header emitted by this app — grep of the repo found no
    source, so it is browser-generated noise from externally-served headers.
resolution:
  root_cause: >
    Two coupled causes. (1) The deployed bundle was built without
    NEXT_PUBLIC_BASE_PATH / NEXT_PUBLIC_SITE_URL (proven by the
    "https://sekolah-prompt-fu.example" fallback canonical in the live HTML), so
    Next's basePath/assetPrefix were empty. (2) Independently, metadata.icons,
    metadata.manifest (src/app/layout.tsx), the OG/Twitter image paths, and the
    manifest's own icon srcs used hardcoded root-absolute "/favicon/..." paths that
    Next.js does NOT prefix with basePath — so even a correctly-configured build
    still emitted root-absolute favicon/manifest URLs that resolve against the
    domain root and 404 on the /sekolah-prompt-fu/ project site.
  fix: >
    Added withBasePath()/getBasePath() to src/lib/seo.ts and routed all
    metadata.icons / metadata.manifest / OG / Twitter image paths in
    src/app/layout.tsx through it. Replaced the static
    public/favicon/site.webmanifest with a base-path-aware src/app/manifest.ts
    (MetadataRoute.Manifest, dynamic="force-static" for output:"export") so its
    icon srcs are prefixed at build time. Regenerated the entire favicon set as the
    Peromfu pixel-art robot (blue head #4A90D9, yellow antenna #FFD700 on silver
    #C0C0C0 base, dark #333 eyes/smile) on the sky-blue gradient, via a new
    scripts/generate-favicons.js (sharp) wired to `npm run icons` — producing
    favicon.svg, a multi-size favicon.ico (16/32/48), favicon-96x96.png,
    apple-touch-icon.png (180), and web-app-manifest 192/512 PNGs.
  verification: >
    NEXT_PUBLIC_BASE_PATH=/sekolah-prompt-fu build emits every icon/shortcut/apple/
    manifest link and both manifest icon srcs under /sekolah-prompt-fu/; plain
    build emits root paths. `npx tsc --noEmit` pass; `npm test` 124/124 pass
    (5 new withBasePath tests); `npm run lint` 0 errors (44 pre-existing warnings);
    `npm run verify` full NFR-2 certification PASS (tsc, vitest, 19 level routes,
    / and /map, bundled media). Permissions-Policy lines confirmed non-actionable
    (no repo source).
  files_changed:
    - src/lib/seo.ts
    - src/app/layout.tsx
    - src/app/manifest.ts (new)
    - public/favicon/site.webmanifest (removed; replaced by src/app/manifest.ts)
    - public/favicon/favicon.svg
    - public/favicon/favicon.ico
    - public/favicon/favicon-96x96.png
    - public/favicon/apple-touch-icon.png
    - public/favicon/web-app-manifest-192x192.png
    - public/favicon/web-app-manifest-512x512.png
    - scripts/generate-favicons.js (new)
    - package.json (icons script)
    - src/__tests__/lib/seo.test.ts (withBasePath tests)
---

# Debug Session: favicon-404-and-basepath

## Scope

This session covers two coupled deliverables approved by the user:

1. **Fix** the favicon/manifest 404s on the GitHub Pages subpath deployment
   (basePath handling + Peromfu icon wiring).
2. **Generate** a new favicon set using the Peromfu pixel-art robot character
   (option chosen: pixel-art robot head, matching the in-app Peromfu on the
   sky-blue gradient).

## Notes

- The Permissions-Policy "Unrecognized feature" console lines are browser-generated
  from response headers (likely GitHub Pages), not from this app's source. Treat as
  non-actionable noise unless the debugger finds a header source in the repo.
- Existing favicon assets live in `public/favicon/` and DO exist; this is a path
  resolution bug, not a missing-file bug.
- `peromfu.svg` at `public/peromfu.svg` is the canonical pixel-art source of truth
  for the character artwork (viewBox 0 0 16 20).