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
| Existing destructive reset | Reset All Progress? This will delete your stars and progress. Keep My Progress / Yes, Reset Everything. | Set Semula Semua Kemajuan? Ini akan memadamkan bintang dan kemajuan anda. Kekalkan Kemajuan Saya / Ya, Set Semula Semuanya. |

No new destructive action or modal in Phase 15; preserve existing reset confirmation if it appears. Empty regions are a defensive no-data state, not a new destination. Keep title's two fixed cards, map empty copy, location/return wording and incomplete reason from Phase 14; keep first-visit map/planet tips unobstructed and dismissible. Do not interrupt the child after each answer with a toast, alert dialog or focus jump.

---

## UI Considerations

The post-verification UI-state probe classified the five surfaces below as navigation, collection, media, form, interactive controls and static content (as applicable). The user confirmed the kinds and chose **Specify** for every applicable state. These are **acceptance criteria**, not claims that current implementation passes. Empty/error copy is defined in `## Copywriting Contract`; the rows below define state behavior. Rendered checks remain necessary; jsdom cannot prove clipping, contrast or hit areas.

| Element | Category | Resolution | Explicit acceptance criterion |
|---------|----------|------------|-------------------------------|
| E1 — Title destinations | empty | resolved / explicit | Both existing title destinations remain present; do not replace them with an empty-state carousel. |
| E1 — Title destinations | loading | resolved / explicit | Both destination links remain labeled and operable while client-side progress loads. |
| E1 — Title destinations | error | resolved / explicit | If progress storage fails, both destination links remain operable without clearing saved progress. |
| E1 — Title destinations | populated | resolved / explicit | Both equally prominent title cards display action label and short explanation. |
| E1 — Title destinations | partial | resolved / explicit | If one destination lacks progress, both links retain equal weight and neither loses its description. |
| E1 — Title destinations | overflow | resolved / explicit | At 320 CSS px the two cards stack and the page has no horizontal overflow. |
| E1 — Title destinations | zero-one-many | resolved / explicit | Title has exactly two destinations; neither is hidden or elevated as a recommended route. |
| E1 — Title destinations | long-text | resolved / explicit | BM and EN card labels and explanations wrap without truncation, clipping or reducing essential font size. |
| E2 — Header / Earth map | empty | resolved / explicit | When no saved progress exists, named map levels and the planet portal remain reachable. |
| E2 — Header / Earth map | loading | resolved / explicit | Header navigation and map/portal labels remain reachable while client progress loads. |
| E2 — Header / Earth map | error | resolved / explicit | If client progress cannot load, labeled Home, Earth map and Planets links remain reachable. |
| E2 — Header / Earth map | populated | resolved / explicit | Existing level links, map controls, and planet portal have visible labels. |
| E2 — Header / Earth map | partial | resolved / explicit | Incomplete progress keeps level and locked-state labels readable without unlocking unavailable levels. |
| E2 — Header / Earth map | overflow | resolved / explicit | Map may scroll horizontally inside its own region; page and header do not scroll horizontally. |
| E2 — Header / Earth map | zero-one-many | resolved / explicit | With zero, one, or many unlocked levels, every available level action remains labeled and reachable. |
| E2 — Header / Earth map | long-text | resolved / explicit | BM/EN navigation and level names wrap or scroll locally; no essential name uses line clamp. |
| E3 — Planet / regions / scene | empty | resolved / explicit | With no drawable scene or regions, show localized empty-state copy and keep planet chooser available. |
| E3 — Planet / regions / scene | loading | resolved / explicit | Planet strip and text region/mission path remain operable while WebGL loads. |
| E3 — Planet / regions / scene | error | resolved / explicit | When WebGL fails, display localized unavailable-view guidance; planet → region → mission text path still works. |
| E3 — Planet / regions / scene | populated | resolved / explicit | Selected planet has a named region chooser, readable details and mission action without canvas interaction. |
| E3 — Planet / regions / scene | partial | resolved / explicit | If selected region has no mission, keep details visible and give a text reason rather than a dead CTA. |
| E3 — Planet / regions / scene | overflow | resolved / explicit | Orbit return and planet chooser stay reachable; region details and mission scroll without clipping. |
| E3 — Planet / regions / scene | zero-one-many | resolved / explicit | Zero regions show empty-state copy; one or many regions display named selections with keyboard reachability. |
| E3 — Planet / regions / scene | long-text | resolved / explicit | BM/EN planet, region, detail and mission text wraps without truncation on mobile. |
| E4 — Lesson activity | empty | resolved / explicit | Unanswered activity presents item/destination instruction and visible incomplete-Next reason. |
| E4 — Lesson activity | loading | resolved / explicit | Before lesson content loads, use localized loading copy rather than phantom answer buttons. |
| E4 — Lesson activity | error | resolved / explicit | Incorrect placement retains the item for retry and shows/announces nearby explanatory text; load failure offers originating-hub return. |
| E4 — Lesson activity | partial | resolved / explicit | Placed answers remain placed while remaining items stay selectable; incomplete Next cannot activate. |
| E4 — Lesson activity | overflow | resolved / explicit | At short height, activity content scrolls above the footer with its final answer reachable and unobscured. |
| E4 — Lesson activity | long-text | resolved / explicit | BM/EN instruction, feedback and lock reason wrap on readable backing at narrow width. |
| E5 — Lesson footer / sections | loading | resolved / explicit | While a lesson section loads, footer never offers misleading Next progression. |
| E5 — Lesson footer / sections | error | resolved / explicit | On failed lesson loading show localized originating-hub return without losing progress. |
| E5 — Lesson footer / sections | overflow | resolved / explicit | At 667×375 and 200% zoom, footer actions stay reachable while activity scrolls above with bottom clearance. |
| E5 — Lesson footer / sections | long-text | resolved / explicit | Back, Continue and incomplete reason wrap without clipping or covering focused answers. |

Probe result: 34 applicable, 34 resolved with explicit verification, 0 backstop, 0 unresolved. Check BM/EN at 320×568, 375×667, 667×375, 1280×800 and 200% zoom, plus WebGL unavailable. If a browser/device is unavailable, mark rendered criteria **unverified** rather than claiming certification.

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
