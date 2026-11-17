# Phase 15: Mobile-First Responsive Accessibility - Pattern Map

**Mapped:** 2026-11-09  
**Files classified:** 27 likely new/modified files (four activity files are audit candidates; planner can narrow).  
**Analogs found:** 27/27 closest starting implementations; see No Analog Found for missing *required behaviors*. Existing files are not accessibility-complete.

## File Classification

| New/Modified file | Role | Data flow | Closest tracked analog | Match |
|---|---|---|---|---|
| src/components/kids/layout/kids-home-content.tsx | component | event-driven navigation | itself | exact |
| src/components/kids/layout/kids-header.tsx | component | event-driven navigation | itself | exact |
| src/components/kids/elements/progress-map.tsx | component | event-driven navigation | itself | exact |
| src/components/kids/planets/planetary-explorer.tsx | component/orchestrator | event-driven selection, request-response routing | itself | exact |
| src/components/kids/planets/planetary-hud.tsx | component | event-driven selection | itself | exact |
| src/components/kids/planets/planetary-canvas.tsx | component | event-driven rendering | itself | exact |
| src/components/kids/layout/level-content-wrapper.tsx | component | event-driven gated navigation | itself | exact |
| src/components/kids/elements/magic-words.tsx | component | event-driven answer, local persistence | itself; prompt-parts.tsx | exact/role-match |
| src/components/kids/elements/drag-drop-prompt.tsx | component | event-driven reorder, local persistence | itself; prompt-parts.tsx | exact/role-match |
| src/components/kids/elements/prompt-parts.tsx | component | event-driven classify, local persistence | itself | exact audit |
| src/components/kids/elements/example-matcher.tsx | component | event-driven answer, local persistence | word-predictor.tsx | exact audit |
| src/components/kids/elements/word-predictor.tsx | component | event-driven answer, local persistence | itself | exact audit |
| src/components/kids/elements/prompt-vs-mistake.tsx, prompt-doctor.tsx, prompt-lab.tsx, step-by-step.tsx | components | event-driven answer, local persistence | prompt-parts.tsx/word-predictor.tsx | role-match audit; edit only where applicable |
| src/app/globals.css | config/styles | transform | itself | exact |
| messages/en.json, messages/ms.json | config/i18n | transform | each other | exact |
| src/__tests__/kids/home-navigation.test.tsx, header-navigation.test.tsx | tests | event-driven navigation | themselves | exact |
| src/__tests__/kids/planetary-explorer.test.tsx, planetary-hud.test.tsx, planetary-canvas.test.tsx | tests | event-driven selection/fallback | themselves | exact |
| src/__tests__/kids/level-locale.test.tsx | test | event-driven gated completion | itself | exact |
| src/__tests__/kids/magic-words.test.tsx, drag-drop-prompt.test.tsx (proposed Wave 0) | tests | event-driven keyboard/touch retry | level-locale.test.tsx:621–692 | role-match |

No new backend, route, migration, controller or dependency. All named existing analog files have non-empty git ls-files results. Proposed test paths are new (not analogs). Localization is BM under locale ms and EN under en.

## Pattern Assignments

### src/components/kids/layout/kids-home-content.tsx — title navigation
**Analog:** itself. **Imports** (lines 1–8):
~~~tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { analyticsKids } from "@/lib/analytics";
~~~
**Core** (lines 19–22, 73–80, 104–108):
~~~tsx
<div className="h-full flex flex-col">
  <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto mb-6">
      <Link href="/map" onClick={() => analyticsKids.startGame()} className="pixel-panel pixel-panel-green p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform group cursor-pointer">
      <Link href="/planets" onClick={() => analyticsKids.exploreSolarSystem()} className="pixel-panel pixel-panel-blue p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform group cursor-pointer">
~~~
Keep equal-priority links, visible explanations (lines 89–95, 118–123) and in-flow fixed footer (142–182); audit small screen/long-label wrapping rather than inventing routes. **Test:** home-navigation.test.tsx:58–87, 105–125 asserts two links, exact routes and full EN/BM text.

### src/components/kids/layout/kids-header.tsx — shared navigation
**Analog:** itself. **Imports:** lines 3–12 (next/link, next-intl, level progress and local controls). **Core** (lines 112–120, 137–160):
~~~tsx
<button onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? t("header.closeMenu") : t("header.openMenu")}>
  <PixelMenuIcon />
</button>
<Link href="/map" onClick={() => setMenuOpen(false)}><span>{t("header.map")}</span></Link>
~~~
Preserve desktop named links at 83–110 and mobile named links; header fixed h-14 and controls h-8 (45–81, 112–116) are *not* a touch-size pattern. Check narrow stats/locale collisions and target sizes. **Test:** header-navigation.test.tsx:66–120.

### src/components/kids/elements/progress-map.tsx — Earth map
**Analog:** itself. **Imports:** lines 3–12 (useTranslations, level/progress APIs, buildLessonUrl). **Core** (55–61, 113–121, 537–545):
~~~tsx
const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
<div ref={scrollRef} className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide flex justify-center" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
  <div className="relative h-full min-h-[400px] min-w-full" style={{ width: mapWidth + "px", imageRendering: "pixelated" }}>
<Link href={buildLessonUrl(level.slug, "map")} className="group cursor-pointer">{nodeContent}</Link>
~~~
Keep wide art scroll *local*, not document-wide. Do not copy tiny w-10 h-10 controls (91–110), hidden-on-mobile subtitle (77–79), whitespace-nowrap world/level text (185–192, 526–533), or inaccessible locked-node-only div (537–539). Empty state and named planet route: 210–226. **Test:** header-navigation.test.tsx:123–149.

### src/components/kids/planets/planetary-explorer.tsx — selection owner
**Analog:** itself. **Imports:** lines 3–28 show next/navigation, next-intl, typed PLANET_WORLDS/getPlanetWorld/resolveMissionRoute, origin utility, optional scene builders and HUD. **Core** (61–64, 85–116):
~~~tsx
const [mode, setMode] = useState<ExplorerMode>(initialMode);
const [activePlanetId, setActivePlanetId] = useState<PlanetId | null>(initialPlanetId);
const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(initialFeatureIndex);
const handleSelectPlanet = useCallback((planetId: PlanetId) => {
  setActivePlanetId(planetId);
  setActiveFeatureIndex(0);
  setMode('planet-cartography');
}, []);
const handleSelectFeature = useCallback((feature: PlanetFeature, index: number) => {
  setActiveFeatureIndex(index);
  cartographyRef.current?.focusFeature(index);
}, []);
const destRoute = resolveMissionRoute(activePlanet.id, feature);
router.push(attachOriginToRoute(destRoute, 'planets'));
~~~
Planet chooser native buttons currently at 217–249; raycast invokes same selection (158–170, 271–278). **Critical change:** chooser inside overview canvas branch (141–143, 217–251) unmounts when mode changes and loses focus. Keep stable text chooser outside keyed canvas; then region chooser, details and mission in reading order, with visible+announced localized selection. Do not depend on renderer onInit. Only route via resolver, not displayed text. **Test:** planetary-explorer.test.tsx:126–154, 177–231; extend to focus/no-WebGL/delayed WebGL.

### src/components/kids/planets/planetary-hud.tsx — region/details/mission
**Analog:** itself. **Imports:** lines 3–6 use Link, next-intl and typed planet model. **Core** (102–115, 212–221):
~~~tsx
{planet.features.map((feat, idx) => {
  const isActive = feat.id === activeFeature.id;
  const localizedFeatName = isMs ? feat.nameMs : feat.name;
  return <button key={feat.id} type="button" onClick={() => onSelectFeature(feat, idx)}>{localizedFeatName}</button>;
})}
<button type="button" onClick={() => onLaunchMission(activeFeature)}><span>{t('launchMission')}</span></button>
~~~
Keep same handler/feature identity and localized names; add selected semantics and visible selected status, maintain focus on button. **Do not copy** clipping at 53–56 and 95–100, truncated feature name (122–126), line-clamped geology/objective/description (184–209). Allow panel to scroll while return/chooser/mission stay reachable. **Test:** planetary-hud.test.tsx:99–136, 138–185, 187–223 checks seven features, action and BM.

### src/components/kids/planets/planetary-canvas.tsx — optional visualization
**Analog:** itself. **Imports:** lines 1–7 (Three.js/OrbitControls, React, types). **Error + cleanup** (74–86, 136–145, 166–182):
~~~tsx
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
} catch (err) {
  console.warn('PlanetaryCanvas: WebGL context creation failed or unavailable', err);
  return;
}
return () => {
  cancelAnimationFrame(animationFrameId);
  resizeObserver.disconnect();
  if (typeof cleanupInit === 'function') cleanupInit();
  controls.dispose();
  renderer.dispose();
};
return <div ref={containerRef} data-testid="planetary-canvas-container">{children}</div>;
~~~
Preserve GPU scene traversal/disposal at 147–170 (abridged excerpt above); text path must be operable when WebGL missing or slow. **Test:** planetary-canvas.test.tsx:84–150 uses renderer/ResizeObserver mocks and asserts children and unmount.

### src/components/kids/layout/level-content-wrapper.tsx — lesson flow/footer
**Analog:** itself. **Imports:** lines 3–18 (level-context, progress/theme, intl, origin). **Core guard/scroll** (162–183, 216–239, 284–298):
~~~tsx
const canNavigateToSection = (targetSection: number): boolean => {
  if (targetSection === currentSection) return true;
  if (targetSection < currentSection && targetSection <= highestVisitedSection) return true;
  return false;
};
const goToNext = () => {
  if (!isLastSection && currentComplete) setCurrentSection((prev) => prev + 1);
};
<div className="h-full flex flex-col">
  <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center p-4">
if (!identity) return false; // unresolved → fail closed
if (!registry.sectionRequiresCompletionByIdentity(identity)) return true;
return registry.isSectionCompleteByIdentity(identity);
~~~
Retain all sections mounted, origin-aware return and in-flow shrink-0 footer (331–337). Error/absent → translated ComingSoon (197–208), load catch (102–130). Lock reason adjacent at 363–371, but Next is natively disabled with title (373–389): keyboard cannot discover reason there. Keep fail-closed guard; provide keyboard-reachable reason (focusable aria-disabled non-activating Next + aria-describedby OR separate reachable explanation). Dots are w-4 h-4/hardcoded English (438–455); title truncates (224–229). **Test:** level-locale.test.tsx:288–323, 394–430, 571–619; existing dot-label assertion at 222–226 may need update.

### src/components/kids/elements/magic-words.tsx + drag-drop-prompt.tsx — two-step activity
**Analogs:** own persistence/completion; closest existing two-step selection is tracked prompt-parts.tsx:50–53, 96–108, 137–195. **Imports:** magic-words.tsx:3–9 and drag-drop-prompt.tsx:3–8 use useId, useSectionIdentity and local progress helpers. **Pattern to adapt** (prompt-parts.tsx:50–53, 96–108, 147–150, 178–190):
~~~tsx
const [assignments, setAssignments] = useState<Record<number, PartType | null>>({});
const [selectedPart, setSelectedPart] = useState<number | null>(null);
const handlePartClick = (index: number) => {
  if (completed) return;
  setSelectedPart(selectedPart === index ? null : index);
};
const handleCategoryClick = (category: PartType) => {
  if (completed || selectedPart === null) return;
  const newAssignments = { ...assignments, [selectedPart]: category };
  setAssignments(newAssignments);
  setSelectedPart(null);
  checkCompletion(newAssignments);
};
<button key={index} onClick={() => handlePartClick(index)} disabled={completed}>...</button>
<button key={type} onClick={() => handleCategoryClick(type)}>...</button>
~~~
Keep saved-state load/save shape in magic-words.tsx:25–29, 62–104 and drag-drop-prompt.tsx:18–22, 57–99, and identity-scoped correct-answer completion like drag-drop-prompt.tsx:224–233:
~~~tsx
if (isCorrect() && levelSlug && scope) {
  const index = scope.getIndex();
  if (index !== null) markSectionCompleted(levelSlug, index);
  scope.markComplete();
}
~~~
Do NOT copy MagicWords implicit first-empty slot (143–159), clickable non-keyboard span (205–222), word-string-only used check with duplicates (118, 253–255), or completion on any filled blanks (169–179). Do NOT copy DragDropPrompt reset-to-shuffled after wrong attempt (235–238), drag row preventDefault (277–285), arrow w-10 h-8 (310–339), or answer/submit controls disappearing when submitted (378–396). Select by stable item identity, then destination native button; incorrect leaves item available and other correct work intact; drag shortcut uses same validation. Keep focus on answer; show short visible localized nearby status (mounted live region). prompt-parts.tsx itself conditionally mounts destinations (171–196), so adapt to preserve focus on updates. **Tests:** level-locale.test.tsx:621–692 covers scoped identity only; proposed focused test files cover wrong retry, duplicate words, keyboard/touch and persisted state.

### Other activity audit — prompt-parts.tsx, example-matcher.tsx, word-predictor.tsx, prompt-vs-mistake.tsx, prompt-doctor.tsx, prompt-lab.tsx, step-by-step.tsx
**Analog:** word-predictor.tsx for selection/save; prompt-parts.tsx for two-step. **Imports:** word-predictor.tsx:3–7. **Core** (word-predictor.tsx:54–75, 86–96):
~~~tsx
const saved = getComponentState<SavedState>(levelSlug, componentId);
if (saved && typeof saved.submitted === "boolean") {
  setSelectedAnswer(saved.selectedAnswer);
  setSubmitted(saved.submitted);
}
saveComponentState<SavedState>(levelSlug, componentId, { selectedAnswer, submitted });
if (selectedAnswer === correctAnswer && levelSlug && scope) {
  const index = scope.getIndex();
  if (index !== null) markSectionCompleted(levelSlug, index);
  scope.markComplete();
}
~~~
ExampleMatcher options/result (example-matcher.tsx:139–163, 191–209) use native buttons, border/icon and explanatory text; preserve answer validation/persistence, but conditional result panel is *not* an existing live-status pattern. Check answer-button disabling after submit (word-predictor.tsx:156–165) for focus loss, touch dimensions, full translated text; audit other four named components only where relevant. **Tests:** level-locale.test.tsx:529–619, 695–809.

### src/app/globals.css and messages/en.json + messages/ms.json
**Analogs:** own tracked styles and parallel bundles. **CSS:** globals.css:654–681 pixel-btn background/hover/active; 709–738 opaque pixel-panel variants; 118–129 base/container. Add two-tone focus-visible treatment; current base outline-ring/50 alone is insufficient and clip-path on pixel-btn may clip outline. Check actual bright/dark browser rendering and override interplay with button variants. **I18n:** messages/en.json:116–133, 293–310, 386–402 parallels messages/ms.json:116–133, 293–310, 386–402, e.g.:
~~~json
"navigation": { "back": "Back", "next": "Next", "completeFirst": "Complete the activity first to continue." },
"magicWords": { "check": "Check!", "retry": "Retry", "tryAgain": "Try again!" },
"planets": { "backToOrbit": "Return to Orbit", "launchMission": "Start Mission" }
~~~
Add matching EN/BM keys for new status, selected/locked words, help text, dot/scroll labels; do not introduce English literals in BM controls. Existing inline isMs branch in planetary-hud.tsx:37–45 is partial; use next-intl namespaces for new messages.

### Tests: navigation, planets, canvas, lesson lock and proposed activity files
**Analogs:** planetary-explorer.test.tsx:1–43 locale-bundle mock, 53–81 WebGL mock, 126–154/177–231 selection/route; planetary-hud.test.tsx:187–223 BM; home-navigation.test.tsx:58–87/105–125 routes+copy; header-navigation.test.tsx:89–120 menu; level-locale.test.tsx:571–619/621–692 completion. **Test excerpt** (planetary-explorer.test.tsx:185–196, 209–216):
~~~tsx
const targetFeat = marsWorld.features[2];
const featBtn = screen.getByTestId('feature-button-' + targetFeat.id);
fireEvent.click(featBtn);
expect(screen.getByTestId('telemetry-card')).toHaveTextContent(targetFeat.name);
const launchBtn = screen.getByRole('button', { name: /start mission/i });
fireEvent.click(launchBtn);
expect(handleLaunch).toHaveBeenCalledWith(marsWorld, activeFeat);
~~~
Extend tests with userEvent.tab()/keyboard, document.activeElement, selected semantics, visible role=status, renderer throw/no-init and delayed path, BM/EN and wrong retry/duplicates. jsdom tests do not prove scroll, contrast, hit size or focus appearance; manual rendered viewport checkpoint required.

## Shared Patterns

- **Routes and progress, no auth:** static Link route for title (kids-home-content.tsx:76–80); resolveMissionRoute + attachOriginToRoute for mission (planetary-explorer.tsx:105–117); getComponentState/saveComponentState in lessons (drag-drop-prompt.tsx:76–99). No auth middleware, server response formatting or DB transactions to copy.
- **Fail-closed validation:** level-content-wrapper.tsx:284–298 refuses unresolved identity, drag-drop-prompt.tsx:224–233 marks completion only on correct order, magic-words.tsx:106–110 checks allowed answer (but its submission completion condition is defective at 169–179). Guard item/target against provided choices; locked sections remain inaccessible.
- **Error handling:** level-content-wrapper.tsx:102–130, 186–208 handles loading/error/absent with localized return; planetary-canvas.tsx:74–86 catches renderer failure. Keep text navigation usable during both failure and slow rendering, never redirect.
- **Focus, live feedback, touch and readable surfaces:** native buttons in planetary-hud.tsx:110–137, opaque panels globals.css:709–738, key parity across both message files. A two-tone focus outline, persistent live status and duplicate-safe retries are NEW behavior, not already present; implement per 15-RESEARCH.md:124–134, 162–183 and verify in browser.

## No Analog Found

| Requirement lacking existing exact implementation | Role | Flow | Why |
|---|---|---|---|
| Two-tone high-contrast clipped-safe focus + persistent localized polite per-answer status | config/component | transform/event-driven | Existing CSS/answers use color and conditional panels only; apply research pattern. |
| Renderer-independent, focus-stable planet chooser across modes | component | event-driven | Existing chooser unmounts on mode switch; extend orchestrator. |
| Duplicate-safe, non-consuming incorrect select-item → destination retry | component | event-driven | prompt-parts.tsx is only partial selection analog and lacks this correctness contract. |

## Metadata

**Search scope:** tracked src/components/kids/{layout,elements,planets}, src/__tests__/kids, src/app/globals.css, messages/{en,ms}.json. **Files scanned:** 22 tracked files read fully plus grep of interactive kids element handlers. **Pattern extraction:** 2026-11-09. No AGENTS.md, .claude/skills or .agents/skills present. Phase 16 motion/audio and A11Y-05 text sizing are out of scope.
