---
phase: "15"
slug: "mobile-first-responsive-accessibility"
status: draft
shadcn_initialized: true
preset: "new-york (Radix base; lucide icons; CSS variables; no preset code)"
created: "2026-11-09"
---

# Phase 15 — UI Design Contract

> Visual and interaction contract for the existing Sekolah Prompt-Fu title, Earth map, planetary hub/cartography, and lessons. Phase 15 implements A11Y-01–04; keep Phase 14 journey decisions and all Phase 15 D-01–D-16. Do not rebrand, change routes or curriculum, add a backend, or introduce Phase 16 motion/audio polish. Source: 15-CONTEXT.md, 14-CONTEXT.md, ROADMAP.md, REQUIREMENTS.md.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn/ui configured; refine project-owned kids components and pixel-art classes rather than transplanting generic shadcn styling |
| Preset | Existing `new-york` style, Radix base, CSS variables, neutral base, no preset code; confirmed by `components.json` and `npx --no-install shadcn info` |
| Component library | Radix-backed local shadcn Button and Sonner; primary phase surfaces are project-owned React/Tailwind components |
| Icon library | lucide-react configured; retain existing pixel-art icons and visible text labels |
| Font | Production Schoolbell via `next/font/google` / `--font-kids`; existing Courier/pixel-font used sparingly for decorative telemetry only; Phase 14's bounded font experiment is not approval to switch |

### Surface and interaction contracts

| Surface | Visual, layout and interaction contract | Decisions |
|---------|----------------------------------------|-----------|
| Title | Two-step welcome stays intact; on phones two equal-weight full-width destination links in one vertical column, with complete action + explanation always visible; no swipe or preferred route. Let welcome content scroll above a labeled, always-reachable Back/Next footer. At >=640px allow equal two-column cards when copy fits. | Phase 14 D-01–05; D-01, D-04 |
| Shared header and Earth map | Keep visible localized Home / Earth map / Planets labels in desktop navigation and opened mobile menu; menu trigger is labeled and keyboard operable. Keep illustrated map locally horizontally scrollable, but never the document; named level actions and planet portal remain independently reachable by keyboard/touch. Tips stay dismissible and do not cover nodes. | Phase 14 D-06, D-12; D-04, D-13 |
| Planet hub and cartography | Keep named planet strip mounted and usable across overview and selected-planet modes, independent of WebGL; planet → text-labeled region chooser → region description/telemetry → mission link/button in DOM reading order. Orbit return and chooser remain reachable while details scroll inside available space. Pin/canvas click and drag are optional shortcuts to the same selection state. No scene-init spinner gates text controls or reroutes the journey. | D-03, D-05–08 |
| Lesson | Keep visible labeled Back/Continue in compact anchored footer, including incomplete Next + reason; activity content scrolls above it with bottom clearance. Section name and ordinal remain readable, not clipped. Select item then select destination by native button on touch/keyboard (drag optional); incorrect placement retains item for retry with explanatory message; answer feedback appears beside answer and is announced without moving focus. No locked-section bypass or progress reset. | Phase 14 D-07–11; D-02, D-09–12 |

### Responsive and input contract

- Mobile-first viewport checks: 320×568, 375×667, 667×375 short landscape, 1280×800, plus 200% browser zoom / effective 320 CSS-px width. At 320px use single-column cards, full-width natural-wrap labels, minimum 16px side padding, `min-width:0` on flex/grid children; at 640px use two title columns only if both fit; at <768px cartography selector/details stack in reading order and at >=768px may sit side by side. No page-level horizontal overflow; only the existing map and optional planet strip scroll locally with keyboard/scroll affordances. No truncation, line clamp, tooltip-only full names or horizontal two-axis scrolling for essential instructions.
- Short/zoomed height: header, chooser/return and lesson footer take natural height, content gets `min-h-0` and its own `overflow-y-auto`; allow footer rows to wrap, reserve bottom inset (including `env(safe-area-inset-bottom)`) and `scroll-padding-bottom` so focused answers never sit behind footer. If fixed footer cannot fit at extreme zoom, let its own contents scroll without making Back/Continue unreachable. Cartography detail pane scrolls without clipping mission CTA; do not hide it under a capped `overflow-hidden` ancestor.
- Hit area: at least 44×44 CSS px for primary links, nav, planet/region choice, activity item/destination, footer and dismiss actions; 8px separation between adjacent hitboxes where practical. Tiny decorative dots may remain 16px visually, but if navigable their interactive button/hitbox is >=44×44; locked dots are not tab stops. Do not shrink text to achieve the hitbox. The local shadcn Button defaults to 36px and is NOT sufficient without a kids-specific minimum-height override. 44px is this project's comfort target, not a claim of WCAG AA requirement.
- All route changes are links; state changes are native buttons. Keyboard order follows visible reading order: header/menu → title choice or map controls → persistent planet chooser → region chooser → details → mission, and in lessons header → section/activity → footer. Enter/Space activate buttons; Tab accesses every available action. On changing planet/region keep focus on the same chooser element and update its `aria-pressed`/selected semantics; text-only selection remains functional with WebGL missing, delayed or errored. No autofocus into canvas or mission. When changing answer state preserve focused answer/control or an equivalent stable replacement.
- Enabled controls: base pixel edge/border, pointer hover darkens or thickens border (never hover-only text), pressed state shifts at most 2px with visible inset border, selected state adds a 2px border + visible `Selected`/`Dipilih` and check icon or shape, disabled uses lock icon + visible reason and no activation. For incomplete Next choose focusable non-activating `aria-disabled="true"` with `aria-describedby` to the adjacent reason, or a separately keyboard-focusable/readable reason; native `disabled` + `title` alone fails this contract. Existing Phase 14 section lock/gating remains authoritative.
- Focus: shared `:focus-visible` outline 3px white (#FFFFFF), 3px offset, outer 3px near-black (#171717) ring (e.g. `box-shadow:0 0 0 6px #171717`), applied to pixel/planetary buttons, links, menu, tips, answers and scrollable chooser. Ensure pixel clip-path or parent clipping never cuts the outline; if it would, apply outline to an unclipped wrapper. Never use only theme-colored glow; verify against bright paper and dark space. Native focus is not suppressed on keyboard input.
- Feedback: selected planet/region and answer outcomes update a persistent nearby `role="status" aria-live="polite" aria-atomic="true"` region with visible BM/EN short status; retain focus. Wrong placement is `Retry: ...` with an actionable hint and same item still selectable. Status text, border/check/lock cues survive muted sound, no animation, reduced-motion and color-vision differences. No motion/audio is required to finish any interaction; do not add Phase 16 rewards now.

---

## Component Inventory

Enumerated by `npx --no-install shadcn info` — 2 components — `shadcn@4.23.0` — 2026-11-09.
Cross-check: `ls src/components/ui/*.tsx | wc -l` → 2 (matches). CLI version independently resolved with `npx --no-install shadcn --version`; shadcn is a CLI, not a direct package dependency. This table is non-exhaustive, not a closed allowlist: check installed exports/files before adding other components.

| Component | Import path | Notes |
|-----------|-------------|-------|
| Button | `@/components/ui/button` | Installed generic Radix Slot wrapper; adapt size and kids focus/pixel treatment if used |
| Toaster | `@/components/ui/sonner` | Installed; not a substitute for nearby persistent answer status |
| KidsHomeContent / KidsHeader | `@/components/kids/layout/kids-home-content` / `@/components/kids/layout/kids-header` | Existing two-choice title and shared named navigation |
| ProgressMap | `@/components/kids/elements/progress-map` | Existing scrollable Earth map and level/portal controls |
| PlanetaryExplorer / PlanetaryHud / PlanetaryCanvas | `@/components/kids/planets/planetary-explorer` / `planetary-hud` / `planetary-canvas` | Shared chooser/state, region/action HUD, optional WebGL respectively |
| LevelContentWrapper / MagicWords / DragDropPrompt | `@/components/kids/layout/level-content-wrapper` / `@/components/kids/elements/magic-words` / `@/components/kids/elements/drag-drop-prompt` | Footer/gating and activities needing select-then-destination path |

---

## Spacing Scale

Keep Phase 14's 4px-based spacing; reuse existing pixel trim instead of changing aesthetic.

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Inline icon/text gap and pixel trim |
| sm | 8px | Compact group gap and target separation |
| md | 16px | Phone horizontal gutter and card spacing |
| lg | 24px | Section and panel padding |
| xl | 32px | Desktop group separation |
| 2xl | 48px | Major title/section separation |
| 3xl | 64px | Wide-screen breathing room |

Exceptions: existing decorative pixel cuts/borders of 2–3px, 3px focus outline/offset, and 44×44 CSS-px minimum hit areas are mechanical/accessibility dimensions rather than layout-spacing tokens. Source: 14-UI-SPEC.md + D-13/D-14; no new arbitrary spacing scale.

---

## Typography

Production Schoolbell stays; no font-switch approval or text-size settings in this phase. These four role sizes and exactly two weights continue Phase 14's kids contract; telemetry that currently uses 8–12px must elevate essential labels/value text to at least 16px. Pixel monospace stays only in decorative metadata, never essential instructions. Let content grow and scroll rather than shrink below role sizes.

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body, instruction, feedback, telemetry value | 20px | 400 | 1.5 |
| Navigation, action, badge/metadata that conveys state | 16px | 700 | 1.25 |
| Section/card/region heading | 28px | 700 | 1.2 |
| Title display | 48px | 700 | 1.1 |

Weights: regular 400 and bold 700 only (Schoolbell font file is loaded at weight 400; existing CSS faux bold treatment remains). In short landscape use scrolling and wrapping rather than scale essential copy down; decorative numerical telemetry may remain smaller only when duplicated by a fully readable textual equivalent. Source: 14-UI-SPEC.md and 15-CONTEXT.md D-04/D-15.

---

## Color

The 60/30/10 ratio describes hierarchy/area, not a recolor of route artwork. Preserve warm pixel paper on title/lesson/map and dark solar-system scene with planet-specific accent colors. Legible text pairs: warm paper `#FEF3C7` with ink `#2C1810`; dark HUD `#0F172A` at >=95% opacity with `#FFFFFF` text. Verify effective colors over actual art (opaque backing preferred). All essential normal-size text target >=4.5:1 contrast, large text >=3:1, interactive boundary/focus >=3:1 against adjacent surface; do not claim formal WCAG certification from the spec alone.

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | Existing illustrated Earth/warm backdrop and space `#020617` on planet route | Keep incumbent art visible around content; no global dimming |
| Secondary (30%) | Existing `#FEF3C7` / `#FDE68A` pixel panels or dark `#0F172A` >=95% opacity HUD scrim | Essential instructions, cards, nav/footer (`#2C1810`), and region details on readable backing |
| Accent (10%) | Existing Earth green `#16A34A` and planet blue `#2563EB`, planetary per-world accent; current-step gold `#FFD700` | Equal Earth/planet trims, active chooser border/check, current-step marker, mission CTA trim; use `#166534` for small green text on pale paper instead of low-contrast `#16A34A` |
| Destructive | Existing `#DC2626` | Only existing reset-progress confirmation; never use error red as the sole retry signal |

Accent reserved for: the two equal title destination card trims/icons, active planet/region/lesson step border or check, and existing planet-specific mission trim. Not for all text, every button, or a new recommended route. Focus is fixed white/near-black two-tone rather than planet accent; success/retry/disabled add words and shape/border as well as any color. Source: project globals.css pixel classes, 14-UI-SPEC.md, D-14–16.

---

## Copywriting Contract

New/changed strings go into `messages/en.json` and `messages/ms.json` via `next-intl`; no English-only section-dot labels, no silent fallback, no truncation. The following status copy is a phase default; preserve existing Phase 14 journey labels verbatim when already present. `{name}`, `{region}` and `{hub}` are localized names from existing data/allowlisted routes, not user-provided URLs.

| Element | English | Bahasa Melayu |
|---------|---------|---------------|
| Title co-primary CTAs (existing) | Start learning / Explore planets | Mula belajar / Terokai planet |
| Planet chooser action | Choose {name} | Pilih {name} |
| Region chooser heading | Choose a region | Pilih kawasan |
| Planet selection feedback | Selected: {name}. Choose a region. | Dipilih: {name}. Pilih kawasan. |
| Region selection feedback | Selected: {region}. Read the details, then start a mission. | Dipilih: {region}. Baca butiran, kemudian mula misi. |
| Selected marker | Selected | Dipilih |
| Item/destination prompt | Choose an item, then choose a place. | Pilih satu item, kemudian pilih tempatnya. |
| Successful placement | Correct! Item placed. | Betul! Item telah diletakkan. |
| Wrong placement (retry) | Not there yet. Choose another place for this item. | Belum tepat. Pilih tempat lain untuk item ini. |
| Lesson locked reason (existing) | Complete the activity first to continue. | Siapkan aktiviti ini dahulu untuk teruskan. |
| Lesson progression CTA (existing) | Continue / Next | Teruskan / Seterusnya |
| Mission CTA (existing) | Start Mission | Mula Misi |
| Empty state heading | No regions here yet | Belum ada kawasan di sini |
| Empty state body | Choose another planet to see its regions. | Pilih planet lain untuk melihat kawasannya. |
| Error / WebGL failure | Planet view is unavailable. Use the planet and region buttons to start a mission. | Paparan planet tidak tersedia. Gunakan butang planet dan kawasan untuk mula misi. |
| Error / lesson load | This lesson could not load. Return to {hub} and choose it again. | Pelajaran ini tidak dapat dibuka. Kembali ke {hub} dan pilih sekali lagi. |
| Existing destructive reset | Reset All Progress? This will delete your stars and progress. Cancel / Yes, Reset Everything. | Set Semula Semua Kemajuan? Ini akan memadamkan bintang dan kemajuan anda. Batal / Ya, Set Semula Semuanya. |

No new destructive action or modal in Phase 15; preserve existing reset confirmation if it appears. Empty regions are a defensive no-data state, not a new destination. Keep title's two fixed cards, map empty copy, location/return wording and incomplete reason from Phase 14; keep first-visit map/planet tips unobstructed and dismissible. Do not interrupt the child after each answer with a toast, alert dialog or focus jump.

---

## UI Considerations

Applicable state considerations resolved: 24 covered, 0 backstop, 0 unresolved. Element kinds: destination/planet/region/level collections (`list-collection, nav`); Earth/space visualization (`media`); activity placement (`form, interactive-control`); lesson/footer/header (`nav, interactive-control, static-content`). Rendering validation is a required acceptance checkpoint, not an unverified assertion.

| Category | Element(s) | Status | Resolution / Reason |
|----------|------------|--------|---------------------|
| empty | Fixed title destinations | ✅ covered | Exactly two fixed named routes exist; never hide either as a no-data state. |
| loading | Title/nav/map | ✅ covered | Route labels and map/planet alternatives remain visible without waiting for client progress. |
| error | Title/nav/map | ✅ covered | Preserve named route alternatives on failed client progress; do not clear saved progress. |
| populated | Title cards/map levels | ✅ covered | Both equally prominent cards and all existing named levels remain available. |
| partial | Progress/map | ✅ covered | Incomplete local progress leaves existing lock/level labels readable, not misleadingly unlocked. |
| overflow | Title/nav/map | ✅ covered | Card labels wrap; map scroll confined to map; document never scrolls horizontally. |
| zero-one-many | Map level/region collection | ✅ covered | Zero shows documented empty copy; one stays labeled; many scroll locally with reachable controls. |
| long-text | Title/nav/map/section titles | ✅ covered | Full BM/EN wraps and grows vertically; no `truncate` or `line-clamp` on essential content. |
| empty | Planetary scene | ✅ covered | Bundled scene is optional; text chooser, regions and mission remain available even with no drawable scene. |
| loading | Planetary scene and controls | ✅ covered | Text controls present while WebGL loads; optional scene may show loading but cannot gate actions. |
| error | Planetary scene | ✅ covered | Show documented WebGL error text and intact chooser → details → mission path. |
| populated | Planetary scene | ✅ covered | Canvas may show 3D planet; named textual controls remain equally functional. |
| loading | Planet/region chooser | ✅ covered | Planet and region data is bundled; names and selectable controls do not wait for WebGL init. |
| error | Planet/region chooser | ✅ covered | Renderer error does not remove controls; empty data uses copy row instead of broken mission. |
| partial | Planet/region chooser | ✅ covered | A selection without mission availability retains named details and visible locked reason; no dead unlabeled CTA. |
| overflow | Planet/region chooser/details | ✅ covered | Persistent chooser remains reachable while details/actions scroll and labels wrap. |
| long-text | Planet/region/details/mission | ✅ covered | Full localized names, descriptions and button labels reflow with >=16px essential text. |
| empty | Activity input | ✅ covered | Unfilled answer shows item/destination prompt, empty slots and visible incomplete Next reason. |
| loading | Activity input | ✅ covered | Lesson loading uses existing localized loading state; do not present phantom answer controls. |
| error | Activity input | ✅ covered | Wrong placement retains item and documented retry status; lesson load error offers allowlisted hub return. |
| partial | Activity input | ✅ covered | Completed slots remain filled, next item is selectable, unfinished activity keeps Next locked. |
| overflow | Activity/lesson/footer | ✅ covered | Answers and footer reachable at short height; scroll padding prevents focused answers being covered. |
| long-text | Feedback/answer/locked reason | ✅ covered | Translated status wraps on readable backing; lock reason can be read with keyboard. |
| loading/error | Lesson footer/section nav | ✅ covered | Pending content keeps existing loading state and no misleading progression; load error provides hub return. |

Acceptance: exercise keyboard + touch on 320×568, 375×667, 667×375, 1280×800 and at 200% zoom, BM/EN, including no-WebGL/slow-WebGL. Measure hitboxes and contrast on rendered pixels/surfaces, inspect Tab focus and no horizontal page overflow; jsdom unit tests alone do not prove layout. Confirm focused controls never disappear/are obscured and answer status is announced without focus change. If no browser/device checkpoint is available, record visual criteria as unverified rather than claim certification. Source: 15-RESEARCH.md validation architecture.

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | None (existing Button/Sonner are local) | not required — no new registry block introduced — 2026-11-09 |
| Third-party | None (`components.json` has empty `registries`) | not applicable — no third-party blocks declared — 2026-11-09 |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS
- [ ] Dimension 7 Inventory Provenance: PASS

**Approval:** pending
