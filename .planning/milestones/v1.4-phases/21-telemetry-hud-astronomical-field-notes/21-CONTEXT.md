# Phase 21: Telemetry HUD & Coming Soon Worlds — Context

**Gathered:** 2026-11-17  
**Status:** Locked & Decided

<domain>
Telemetry HUD overlay for planetary cartography, province selection, and "Coming Soon" status for non-curriculum outer worlds.
</domain>

<canonical_refs>
- `src/components/kids/planets/planetary-hud.tsx` — Main glassmorphic HUD overlay
- `messages/en.json` & `messages/ms.json` — Localization dictionaries
- `src/components/kids/planets/planetary-explorer.tsx` — Explorer component
</canonical_refs>

<decisions>
### 1. Minimal & Clean Telemetry HUD (No extra cycling field notes UI)
- **Decision:** Do NOT add separate cycling field notes tabs or complicated drawer UI. Keep the existing clean telemetry layout (coordinates, elevation, geology, objective) intact for curriculum planets to preserve simplicity and avoid visual clutter.
- **Rationale:** Per user instruction: "what is this? what field notes? I mentioned that I just want to change the 3D planets?". The primary focus is the 3D planetary rendering, not adding complicated fact widget carousels.

### 2. Outer Worlds Status ("Akan Datang / Coming Soon")
- **Decision:** For outer planets (Jupiter, Saturn, Uranus, Neptune) that currently have no province missions:
  - Display a clean "Coming Soon / Akan Datang" badge and informative message in the HUD card:
    - *EN:* "Coming Soon — New subject worlds (e.g. Sejarah, Sains) will arrive in future updates!"
    - *MS:* "Akan Datang — Dunia subjek baharu (cth. Sejarah, Sains) akan tiba dalam kemas kini akan datang!"
  - Do not show dead mission launch buttons or confusing empty error states.
</decisions>
