---
phase: "17"
slug: "visual-audit-release-certification"
status: approved
shadcn_initialized: true
preset: "new-york (Radix base; lucide icons; CSS variables; no preset code)"
created: "2026-11-16"
reviewed_at: "2026-11-16T19:57:00+08:00"
---

# Phase 17 — UI Design Contract: Visual Audit & Release Certification

> Visual and interaction contract for Phase 17 (Visual Audit & Release Certification) covering requirements VIS-01 and VIS-02 across all core Sekolah Prompt-Fu surfaces (title, Earth map, planetary hub, cartography, and lessons). Phase 17 preserves established brand identity, bilingual behavior, and static-export architecture while ensuring consistent typography, spacing, controls, and card hierarchies. Source: ROADMAP.md, REQUIREMENTS.md, and prior Phase 14-16 UI-SPECs.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn/ui configured; maintain project-owned kids components and pixel-art classes rather than generic defaults |
| Preset | `new-york` style, Radix base, CSS variables, neutral base, no preset code |
| Component library | Radix-backed local shadcn Button and Sonner; primary surfaces are project-owned React/Tailwind components |
| Icon library | lucide-react configured; retain existing pixel-art icons and visible text labels |
| Font | Production Schoolbell via `next/font/google` / `--font-kids`; Courier/monospace used strictly for telemetry and retro labels |

---

## Visual Consistency & Surface Hierarchy (VIS-01)

| Surface | Visual Hierarchy & Spacing | Interactive Controls & Cards | Distinct Planetary Theming |
|---------|----------------------------|------------------------------|----------------------------|
| Title screen (`/`) | Clear 2-step welcome hierarchy with Schoolbell heading and equal-weight destination cards. | Buttons/cards have minimum 44px touch target, 2px border, tactile press, and explicit text labels. | Classic space academy pixel-art frame with parchment/slate contrasting surfaces. |
| Earth map (`/map`) | Labeled header navigation (Home / Earth Map / Planets) with scroll-contained illustrated map. | 44px minimum node actions, dismissible tips with high-contrast backing, zero document overflow. | Terrestrial green/amber palette with pixel markers. |
| Planetary hub (`/planets`) | Persistent named planet strip with reading-order flow (planet -> region -> details -> mission). | Fully operable text path independent of WebGL status; active item highlighted with 2px accent border + checkmark. | Distinct planetary atmospheric color palettes (Mars rust, Jupiter gas, Saturn gold, etc.). |
| Lesson activities (`/level/[slug]`) | Structured card layout with sticky compact footer, section progress dots, and bilingual status announcements. | Tactile micro-press feedback (`scale(0.98)`), non-color-alone success/error icons (`Check`, `XCircle`), active retry. | Consistent kids pixel-panel themes (purple, amber, green) tailored to world domain. |

---

## Release Certification & Brand Preservation (VIS-02)

1. **Brand & Identity Preservation:**
   - Retains retro pixel-art aesthetic, Peromfu mascot, rocket illustrations, and starry telemetry backgrounds.
   - Preserves bilingual English / Bahasa Melayu toggle with zero silent fallbacks and consistent text wrap.
2. **Architecture & Delivery Contracts:**
   - Pure client-side Next.js static export (`output: "export"`, `unoptimized: true`).
   - LocalStorage client progress persistence without external database or backend network dependencies.
   - Full accessibility: keyboard operable tab stops, 3px two-tone focus outline, screen-reader polite live regions, and `prefers-reduced-motion: reduce` compliance.

---

## Component Inventory

Enumerated by `npx --no-install shadcn info` — 2 components — `shadcn@4.23.0` — 2026-11-16.
Cross-check: `ls src/components/ui/*.tsx | wc -l` → 2 (matches). CLI version independently resolved with `npx --no-install shadcn --version`. This table is non-exhaustive, not a closed allowlist.

| Component | Import path | Notes |
|-----------|-------------|-------|
| Button | `@/components/ui/button` | Radix Slot wrapper with 44px touch targets and kids tactile active styling |
| Toaster | `@/components/ui/sonner` | Toast provider for ambient telemetry, never substituting inline status |
| KidsHomeContent | `@/components/kids/layout/kids-home-content` | Two-step title destination and responsive welcome cards |
| KidsHeader | `@/components/kids/layout/kids-header` | Labeled header navigation across all core routes |
| ProgressMap | `@/components/kids/elements/progress-map` | Contained Earth map journey and level nodes |
| PlanetaryExplorer | `@/components/kids/planets/planetary-explorer` | Accessible planet strip and text-navigable cartography |
| LevelContentWrapper | `@/components/kids/layout/level-content-wrapper` | Section gating and anchored footer controls |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Micro padding, icon gaps, inline badge offsets |
| sm | 8px | Button inner padding, compact gaps between adjacent hitboxes |
| md | 16px | Card content padding, default element spacing |
| lg | 24px | Section padding, container gaps |
| xl | 32px | Layout breaks, header-to-content separation |
| 2xl | 48px | Screen milestone breaks, hero margins |
| 3xl | 64px | Page bottom clearance for anchored footers |

Exceptions: none.

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 14px | 700 | 1.4 |
| Heading | 20px | 700 | 1.3 |
| Display | 28px | 800 | 1.2 |

Total sizes: 4. Weights: 2. Complies with typography design constraints.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#0F172A` / `#FEF3C7` | Cosmic navy / Warm light parchment |
| Secondary (30%) | `#1E293B` / `#FDE68A` | Card backgrounds, panels, navigation wrappers |
| Accent (10%) | `#38BDF8` / `#F59E0B` | Active state outlines, focus rings, progress stars |
| Destructive | `#EF4444` | Progress reset confirmation only |

Accent reserved for: focused controls, selected planet/region borders, and earned progress stars (never applied as a blanket button color).

---

## Copywriting Contract

| Element | Copy (EN / BM) |
|---------|----------------|
| Primary Title CTA | "Start Learning" / "Mula Belajar" |
| Header Map Link | "Earth map" / "Peta Bumi" |
| Header Planets Link | "Planets" / "Planet" |
| Lesson Next CTA | "Next" / "Seterusnya" |
| Verification Badge | "NFR-2 Certified" / "Disahkan NFR-2" |
| Empty State Heading | "No missions found" / "Tiada misi dijumpai" |
| Empty State Body | "Choose an available destination to start learning." / "Pilih destinasi yang tersedia untuk mula belajar." |
| Error State | "Content could not load. Return to previous hub." / "Kandungan tidak dapat dimuatkan. Kembali ke hab sebelumnya." |
| Destructive confirmation | "Reset Progress" / "Set Semula": "Are you sure you want to reset all stars?" / "Adakah anda pasti mahu set semula semua bintang?" |

---

## UI Considerations

Applicable state considerations resolved: 8 covered, 0 backstop, 0 unresolved.

| Category | Element(s) | Status | Resolution / Reason |
|----------|------------|--------|---------------------|
| empty | E1 — Unified routes (title, map, planets, level) | ✅ covered | Empty states present localized constructive guidance and previous-hub navigation. |
| loading | E1 — Unified routes (title, map, planets, level) | ✅ covered | Interactive text controls remain operable during client-side hydration or scene initialization. |
| error | E1 — Unified routes (title, map, planets, level) | ✅ covered | WebGL or data failures fall back to accessible text journeys without unhandled traps. |
| populated | E1 — Unified routes (title, map, planets, level) | ✅ covered | Standard layouts maintain consistent spacing tokens, 44px hitboxes, and distinct planetary palettes. |
| overflow | E1 — Unified routes (title, map, planets, level) | ✅ covered | Responsive layouts wrap text naturally down to 320px width and short landscapes without page overflow. |
| long-text | E1 — Unified routes (title, map, planets, level) | ✅ covered | Bilingual English and Bahasa Melayu text labels render without truncation or ellipsis. |
| partial | E2 — Progress & completion states | ✅ covered | Partially unlocked modules clearly indicate locked status with lock icon and accessible text reason. |
| populated | E2 — Progress & completion states | ✅ covered | Complete modules display earned stars and allow immediate non-blocking navigation. |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | None (existing Button/Sonner are local) | not required — 2026-11-16 |
| Third-party | None | not applicable — 2026-11-16 |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS
- [x] Dimension 7 Inventory Provenance: PASS

**Approval:** approved 2026-11-16
