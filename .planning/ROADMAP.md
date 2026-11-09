# Roadmap: Sekolah Prompt-Fu (Learn Prompting for Kids)

## Milestones
- **[v1.0](milestones/v1.0-ROADMAP.md)** Kids Prompting Game Standalone & GitHub Pages (Shipped 2026-11-07)
- **[v1.1](milestones/v1.1-ROADMAP.md)** Rebrand, Tech Debt, & KSSR Tahun 1 Integration (Shipped 2026-11-07)
- **[v1.2](milestones/v1.2-ROADMAP.md)** 3D Planetary Hub, Subject Cartography & Rocket Return (Shipped 2026-11-09)
- 🚧 **v1.3 Kid-Friendly UX, Game Feel & Visual Polish** — Phases 14–17 (In Progress)

## Overview

v1.3 refines the existing title → map/planet hub → lesson → completion journey for primary-school learners. It establishes shared journey cues, makes the core experience usable on mobile and with assistive input, adds restrained feedback that respects reduced-motion and sound settings, then certifies visual consistency and the existing bilingual, pixel-art/planetary, route, progress, and static-export contracts. No new curriculum, backend, dependencies, or progression economy is introduced.

## Phases

- [ ] **Phase 14: Journey Clarity & Shared Interaction Language** - Make the next action, current location, and return path clear in both locales.
- [ ] **Phase 15: Mobile-First Responsive Accessibility** - Keep core screens and interactions usable across viewport sizes and input modes.
- [ ] **Phase 16: Proportional, Reduced-Motion-Safe Game Feel** - Give meaningful actions immediate, accessible, non-blocking feedback.
- [ ] **Phase 17: Visual Audit & Release Certification** - Confirm the refined experience is coherent and preserves the product's brand and release contracts.

## Phase Details

### Phase 14: Journey Clarity & Shared Interaction Language
**Goal**: Children can tell where they are, what to do next, and how to return across the title, map/planet hub, and lesson journey using clear, bilingual interaction cues.
**Depends on**: Phase 13 (v1.2 complete)
**Requirements**: CLAR-01, CLAR-02, CLAR-03
**Success Criteria** (what must be TRUE):
  1. On the title, map/planet hub, and lesson screens, the primary next action is identifiable from a concise text label and is not indicated by an unlabeled icon alone.
  2. Changed navigation labels and instructions are concise, concrete, and available in both Bahasa Melayu and English, with no silent fallback when changing locale.
  3. Children can identify their current location and return to the appropriate previous hub from core screens without losing locally saved progress.
**Plans**: 9 plans
Plans:
**Wave 1**
- [ ] 14-01-PLAN.md — Deliver the two-step title welcome and equal destination choices
- [ ] 14-06-PLAN.md — Show localized lesson section context and locked-next guidance
- [ ] 14-07-PLAN.md — Create bounded offline typography comparison artifacts

**Wave 2** *(blocked on Wave 1 completion)*
- [ ] 14-02-PLAN.md — Add visible shared and hub navigation labels
- [ ] 14-08-PLAN.md — Complete bilingual section-title source for the remaining lessons

**Wave 3** *(blocked on Wave 2 completion)*
- [ ] 14-03-PLAN.md — Add independent localized map and planetary tips

**Wave 4** *(blocked on Wave 3 completion)*
- [ ] 14-04-PLAN.md — Define and propagate allowlisted lesson origins

**Wave 5** *(blocked on Wave 4 completion)*
- [ ] 14-05-PLAN.md — Route lesson return, recovery, and completion to the originating hub

**Wave 6** *(blocked on Wave 5 completion)*
- [ ] 14-09-PLAN.md — Wire lesson section titles, ordinals, and visible lock guidance
**UI hint**: yes

### Phase 15: Mobile-First Responsive Accessibility
**Goal**: Children can reach, read, and operate the core title, map/planet hub, and lesson experiences on narrow and wide screens using touch or keyboard.
**Depends on**: Phase 14
**Requirements**: A11Y-01, A11Y-02, A11Y-03, A11Y-04
**Success Criteria** (what must be TRUE):
  1. At narrow mobile and desktop sizes, including translated copy, core screens and lesson interactions remain usable without clipped controls or unintended horizontal overflow.
  2. Primary controls are comfortably touch-sized and expose understandable hover, pressed, disabled, and keyboard-focus states where applicable.
  3. A learner can complete core navigation and lesson interactions with a keyboard, following a logical focus order with a visible focus indicator.
  4. Text and controls remain legible on themed backgrounds, and essential instructions and status remain understandable without relying on color, sound, or motion.
**Plans**: TBD
**UI hint**: yes

### Phase 16: Proportional, Reduced-Motion-Safe Game Feel
**Goal**: Meaningful selections, answers, progress changes, and completion give learners quick, satisfying feedback without blocking input or excluding learners who disable motion or sound.
**Depends on**: Phase 15
**Requirements**: FEEL-01, FEEL-02, FEEL-03
**Success Criteria** (what must be TRUE):
  1. Meaningful selections, lesson answers, progress changes, and completion events receive immediate visual feedback that distinguishes success, error, and neutral outcomes.
  2. High-value progress and completion moments use brief, purposeful motion and optional audio that are proportional, do not block interaction, and honor reduced-motion preferences.
  3. Learners can understand feedback and continue or retry when animation or sound is unavailable or disabled; feedback is not communicated by color alone.
**Plans**: TBD
**UI hint**: yes

### Phase 17: Visual Audit & Release Certification
**Goal**: The title, map/planet hub, lessons, and completion experience feel like one polished Sekolah Prompt-Fu product, and the release preserves its established identity and delivery behavior.
**Depends on**: Phase 16
**Requirements**: VIS-01, VIS-02
**Success Criteria** (what must be TRUE):
  1. Across title, map/planet hub, and lesson screens, typography, spacing, controls, and card treatments share a clear hierarchy while retaining distinct planetary themes.
  2. Reviewers can verify that the polished experience retains its pixel-art/planetary identity, existing routes and learning flows, bilingual behavior, and static-export architecture.
  3. The fresh release build passes the existing project verification gates and its exported core routes and assets are present and usable.
**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 14 → 15 → 16 → 17.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 14. Journey Clarity & Shared Interaction Language | 0/9 | Not started | - |
| 15. Mobile-First Responsive Accessibility | 0/TBD | Not started | - |
| 16. Proportional, Reduced-Motion-Safe Game Feel | 0/TBD | Not started | - |
| 17. Visual Audit & Release Certification | 0/TBD | Not started | - |
