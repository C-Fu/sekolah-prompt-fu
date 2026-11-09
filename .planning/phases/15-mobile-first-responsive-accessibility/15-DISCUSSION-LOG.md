# Phase 15: Mobile-First Responsive Accessibility - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-11-09
**Phase:** 15-Mobile-First Responsive Accessibility
**Areas discussed:** Small-screen layout, Planet navigation, Lesson activities, Readable controls

---

## Small-screen layout

### On a narrow phone, how should the title screen’s two equally important destination choices appear?

| Option | Selected |
|--------|----------|
| Stacked cards |  |
| Side-by-side cards |  |
| Swipeable choices |  |

**User's choice:** Stacked full-width cards with labels and explanations visible


### On short phone screens, what should take priority when the lesson footer competes with the activity for space?

| Option | Selected |
|--------|----------|
| Footer stays visible |  |
| Footer follows content |  |
| Collapsible footer |  |

**User's choice:** Compact labeled footer stays visible; activity scrolls above without obscured content


### How should planet details and actions fit on a narrow or short screen?

| Option | Selected |
|--------|----------|
| Scroll details panel |  |
| Compact summary first |  |
| Full-screen details |  |

**User's choice:** Keep return and selection reachable; scroll details panel rather than clip


### When a screen has long Malay or English labels, which tradeoff should win?

| Option | Selected |
|--------|----------|
| Wrap and grow | ✓ |
| Shorten copy |  |
| Truncate labels |  |

**User's choice:** Wrap and grow controls/cards vertically; preserve full labels

---

## Planet navigation

### For learners who cannot drag or click the 3D scene, which way should planet selection primarily work?

| Option | Selected |
|--------|----------|
| Planet strip |  |
| Canvas keyboard keys |  |
| List view toggle |  |

**User's choice:** Existing named planet strip serves as complete keyboard/touch alternative


### Once a planet is selected, how should keyboard/touch users reach its geological region pins?

| Option | Selected |
|--------|----------|
| Named region list |  |
| Focusable 3D pins |  |
| Next/previous regions |  |

**User's choice:** Text-labeled region selector alongside 3D pins, same selection and mission actions


### Should selecting a planet or region automatically move keyboard focus into its details?

| Option | Selected |
|--------|----------|
| Keep on chooser |  |
| Move to details |  |
| Focus action |  |

**User's choice:** Keep focus on chooser; details and action next in reading order, announce selected name/status


### If WebGL is unavailable or slow, what should still be reachable?

| Option | Selected |
|--------|----------|
| Full text path | ✓ |
| Planet links only |  |
| Map redirect |  |

**User's choice:** Full text path: planet selection, named regions, details and mission links

---

## Lesson activities

### For drag-and-drop exercises, what equivalent should children use with keyboard or when dragging on a phone is difficult?

| Option | Selected |
|--------|----------|
| Tap/select then place |  |
| Dropdown answer |  |
| Keyboard drag mode |  |

**User's choice:** Tap/select item then destination; dragging optional shortcut


### When a learner places an item in the wrong spot, what should happen?

| Option | Selected |
|--------|----------|
| Explain and retry |  |
| Reset whole task |  |
| Auto-correct |  |

**User's choice:** Keep item selectable; short text explanation and retry another target


### As a child tabs through lesson sections, how should locked or unavailable choices behave?

| Option | Selected |
|--------|----------|
| Explain at action |  |
| Skip locked controls |  |
| Focus every section |  |

**User's choice:** Keep visible Next action and adjacent reason with focusable guidance explaining unlock; coordinate with Phase 14


### After an answer changes state, how should a keyboard or screen-reader learner learn what happened?

| Option | Selected |
|--------|----------|
| Brief text status |  |
| Move to result |  |
| Visual state only |  |

**User's choice:** Keep focus at answer and display/announce short success or retry status nearby

---

## Readable controls

### For the main title, map, planet and lesson actions, how should touch target size be treated?

| Option | Selected |
|--------|----------|
| Generous by default | ✓ |
| Only mobile sizing |  |
| Keep visual size |  |

**User's choice:** Generous by default; roomy tap areas even for compact icons and labels


### What should keyboard focus look like on bright, dark, and planetary backgrounds?

| Option | Selected |
|--------|----------|
| Strong outline |  |
| Theme-colored glow |  |
| Underline only |  |

**User's choice:** Strong two-tone/high-contrast outline across themes


### If themed art makes instructional text hard to read, which fix best preserves the existing look?

| Option | Selected |
|--------|----------|
| Readable surface |  |
| Change text color |  |
| Dim whole backdrop |  |

**User's choice:** Sufficiently opaque readable surface/scrim under essential text


### How should controls express selection or disabled status without color or sound?

| Option | Selected |
|--------|----------|
| Text + shape |  |
| Icons + shape |  |
| Text alone |  |

**User's choice:** Short visible words plus icon/shape/border change; never color-only

---

## the agent's Discretion

Exact responsive breakpoints, UI structure and accessibility implementation details were left to research and planning.

## Deferred Ideas

None.
