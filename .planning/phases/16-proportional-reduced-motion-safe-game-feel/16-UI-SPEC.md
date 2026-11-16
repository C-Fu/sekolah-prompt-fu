---
phase: "16"
slug: "proportional-reduced-motion-safe-game-feel"
status: draft
shadcn_initialized: true
preset: "new-york (Radix base; lucide icons; CSS variables; no preset code)"
created: "2026-11-16"
---

# Phase 16 — UI Design Contract

> Visual and interaction contract for proportional, reduced-motion-safe game feel across Sekolah Prompt-Fu (title, Earth map, planetary hub/cartography, lessons, and completion moments). Phase 16 implements FEEL-01, FEEL-02, and FEEL-03; builds on Phase 14 journey clarity and Phase 15 responsive accessibility contracts. Do not rebrand, alter static export architecture, break keyboard navigation, or introduce long blocking animations or mandatory sound. Source: ROADMAP.md, REQUIREMENTS.md, Phase 15 UI-SPEC.md, and codebase analysis.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | shadcn/ui configured; refine project-owned kids components and pixel-art classes rather than transplanting generic shadcn styling |
| Preset | Existing `new-york` style, Radix base, CSS variables, neutral base, no preset code; confirmed by `components.json` and `npx --no-install shadcn info` |
| Component library | Radix-backed local shadcn Button and Sonner; primary phase surfaces are project-owned React/Tailwind components |
| Icon library | lucide-react configured; retain existing pixel-art icons, emoji markers, and visible text labels |
| Font | Production Schoolbell via `next/font/google` / `--font-kids`; existing Courier/pixel-font used sparingly for decorative telemetry only |

---

## Surface and Feedback Contracts

| Surface / Moment | Visual Feedback (FEEL-01) | Motion Contract (FEEL-02) | Reduced-Motion & Sound Fallback (FEEL-03) |
|------------------|---------------------------|---------------------------|-------------------------------------------|
| Interactive selections & clicks (Buttons, links, selectors) | Immediate 2px border shift / inset highlight; distinct active color + check/pressed indicator; never color-only. | Micro-press transform `scale(0.98)` or `translateY(1px)`, duration <= 100ms. Non-blocking. | In reduced-motion: zero translate/scale; instant border/outline change. Zero mandatory audio. |
| Lesson answers (MagicWords, DragDrop, StepByStep, PromptDoctor) | Correct: emerald border + checkmark icon + localized success badge. Error: amber/rose border + retry icon + localized retry text. | Brief pulse/pop <= 200ms on answer badge; zero input lock; child can immediately select or retry. | Reduced-motion: static border color + icon change + immediate text status announcement; no motion delay. |
| Progress changes (Star earned, level unlock, node completion) | Gold star fill + border glow + star counter badge update; visible badge text update. | Gentle star scale/bounce <= 300ms; progress bar fill transition <= 400ms. Non-blocking. | Reduced-motion: instant fill/count update without bounce/scale; `aria-live` announces progress change. |
| Level completion & celebration (LevelComplete, confetti) | Celebration banner + star summary + next/return actions visible immediately. | Optional subtle pixel confetti (max 1.5s, non-blocking). Child can immediately click Next or Return without waiting. | Reduced-motion: no moving confetti particles; celebratory banner and stars appear statically; zero wait. |
| Capstone & rocket launch (RocketLaunchOverlay, 5-4 Graduation) | Launch telemetry screen + clear visible Skip/Proceed button; countdown visualizer. | Rocket liftoff animation <= 1.2s; Skip button instantly navigates to destination. Never trap focus or lock navigation. | Reduced-motion: immediate static graduation card with "Proceed to Orbit" button; zero forced animation/countdown. |
| Background audio & effects | Visual mute toggle status in header/settings (sound icon with slash when muted). | Audio transitions fade over 300ms if enabled; zero auto-play if browser or user blocks audio. | All audio is purely ambient/optional. Every visual event is fully self-sufficient with text + icon; audio mute changes zero gameplay. |

---

## Component Inventory

Enumerated by `npx --no-install shadcn info` — 2 components — `shadcn@4.23.0` — 2026-11-16.
Cross-check: `ls src/components/ui/*.tsx | wc -l` → 2 (matches). CLI version independently resolved with `npx --no-install shadcn --version`. This table is non-exhaustive, not a closed allowlist: check installed exports/files before adding other components.

| Component | Import path | Notes |
|-----------|-------------|-------|
| Button | `@/components/ui/button` | Installed generic Radix Slot wrapper; uses minimum 44px height for kids touch targets and tactile press styling |
| Toaster | `@/components/ui/sonner` | Installed toast provider; reserved for ambient notices, not a substitute for inline persistent answer feedback |
| LevelComplete | `@/components/kids/elements/level-complete` | Level completion summary; needs non-blocking confetti and reduced-motion static presentation |
| RocketLaunchOverlay | `@/components/kids/elements/rocket-launch-overlay` | Rocket launch transition; requires instant Skip button, reduced-motion bypass, and non-blocking countdown |
| PixelArt / PixelRocket / PixelRobot | `@/components/kids/elements/pixel-art` | Pixel art avatars and celebration illustrations; support static poses under `prefers-reduced-motion` |
| BackgroundMusic | `@/components/kids/layout/background-music` | Ambient audio management; must remain strictly optional, persist mute preference, and never block game flow |
| MagicWords / DragDropPrompt / StepByStep | `@/components/kids/elements/*` | Interactive lesson activities; provide instant non-color-only tactile feedback and retry affordance |

---

## Spacing Scale

Declared values (must be multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon gaps, micro inline padding, feedback badge gaps |
| sm | 8px | Button inner padding, compact badge spacing |
| md | 16px | Card content padding, default feedback margin |
| lg | 24px | Section gaps, dialog inner margins |
| xl | 32px | Screen header / footer separation |
| 2xl | 48px | Milestone break padding, modal hero gaps |
| 3xl | 64px | Page bottom clearance for floating footers |

Exceptions: none.

---

## Typography

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Body | 16px | 400 | 1.5 |
| Label | 14px | 700 | 1.4 |
| Heading | 20px | 700 | 1.3 |
| Display | 28px | 800 | 1.2 |

Total font sizes: 4. Weights: 2 (400, 700/800). Complies with typography design constraints.

---

## Color

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `#0F172A` / `#FEF3C7` | Space background / Light parchment surface |
| Secondary (30%) | `#1E293B` / `#FDE68A` | Cards, panels, navigation bars, modal containers |
| Accent (10%) | `#38BDF8` / `#F59E0B` | Active feedback indicators, selected borders, progress stars |
| Destructive | `#EF4444` | Reset progress confirmation action only |

Accent reserved for: selected choice borders, active progress stars, and completion highlight banners only (never applied blanketly to all buttons or text).

Feedback color pairings (must never rely on color alone):
- Success: Emerald `#10B981` border + `Check` icon + localized text "Betul!" / "Correct!"
- Error / Retry: Amber/Rose `#F43F5E` border + `RotateCcw` icon + localized text "Cuba lagi" / "Try again"
- Neutral: Slate `#64748B` border + circle bullet + localized text "Dipilih" / "Selected"

---

## Copywriting Contract

| Element | Copy (EN / BM) |
|---------|----------------|
| Primary CTA | "Start Activity" / "Mula Aktiviti" |
| Secondary CTA | "Continue to Next" / "Teruskan ke Seterusnya" |
| Immediate retry action | "Try Again" / "Cuba Lagi" |
| Launch skip action | "Skip Animation" / "Langkau Animasi" |
| Audio toggle mute | "Mute Sound" / "Senyapkan Bunyi" |
| Audio toggle unmute | "Play Sound" / "Pasang Bunyi" |
| Empty state heading | "No completed missions yet" / "Belum ada misi yang selesai" |
| Empty state body | "Choose a planet to explore and complete your first mission!" / "Pilih planet untuk diterokai dan selesaikan misi pertama anda!" |
| Error state heading | "Sound could not play" / "Bunyi tidak dapat dimainkan" |
| Error state body | "Your browser prevented audio playback. You can continue playing silently." / "Pelayar anda menghalang audio. Anda boleh terus bermain tanpa bunyi." |
| Destructive confirmation | "Reset All Progress" / "Set Semula Semua": "This will erase all earned stars and unlocked planets. Are you sure?" / "Ini akan memadamkan semua bintang dan planet yang telah dibuka. Adakah anda pasti?" |

---

## UI Considerations

> Shape-rooted UI state coverage across interactive surfaces, feedback banners, and celebration overlays for Phase 16.

Applicable state considerations resolved: 14 covered, 0 backstop, 0 unresolved.

| Category | Element(s) | Status | Resolution / Reason |
|----------|------------|--------|---------------------|
| empty | E1 — Audio player & sound manager | ✅ covered | When sound files are absent or audio API is unsupported, player remains silent and UI presents zero error blockers. |
| loading | E1 — Audio player & sound manager | ✅ covered | Audio loading does not delay interface interactions or block page render. |
| error | E1 — Audio player & sound manager | ✅ covered | Autoplay denial or audio decode error silently falls back to muted state; gameplay continues unimpeded. |
| populated | E1 — Audio player & sound manager | ✅ covered | When audio is playing, mute button indicates active sound state with visible text and icon. |
| partial | E2 — Interactive answer feedback (MagicWords/DragDrop) | ✅ covered | In multi-part questions, placed parts show persistent success indicators while unanswered parts remain interactive. |
| error | E2 — Interactive answer feedback (MagicWords/DragDrop) | ✅ covered | Incorrect selection displays immediate retry text + icon beside the control; input remains unlocked for retry. |
| populated | E2 — Interactive answer feedback (MagicWords/DragDrop) | ✅ covered | Correct answer highlights with emerald border, checkmark icon, and immediate success announcement. |
| long-text | E2 — Interactive answer feedback (MagicWords/DragDrop) | ✅ covered | Feedback and retry messages wrap naturally within container without overlapping action buttons. |
| empty | E3 — Level completion celebration (LevelComplete) | ✅ covered | If zero stars are awarded, completion still shows constructive finish summary and next action without confetti. |
| populated | E3 — Level completion celebration (LevelComplete) | ✅ covered | Earned stars display with static icon + count label; non-blocking confetti automatically clears within 1.5s. |
| overflow | E3 — Level completion celebration (LevelComplete) | ✅ covered | On small screens (320px width, short height), completion banner and next buttons remain fully visible and in-flow. |
| loading | E4 — Rocket launch overlay (RocketLaunchOverlay) | ✅ covered | Countdown visualizer does not disable escape or skip; immediate skip button is available from frame 0. |
| populated | E4 — Rocket launch overlay (RocketLaunchOverlay) | ✅ covered | Liftoff sequence displays rocket thrust; auto-redirects on completion or immediately when Skip is tapped. |
| overflow | E4 — Rocket launch overlay (RocketLaunchOverlay) | ✅ covered | At reduced-motion preference, overlay presents static ready card with direct "Continue" button, bypassing countdown. |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | None (existing Button/Sonner are local) | not required — no new registry block introduced — 2026-11-16 |
| Third-party | None (`components.json` has empty `registries`) | not applicable — no third-party blocks declared — 2026-11-16 |

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
