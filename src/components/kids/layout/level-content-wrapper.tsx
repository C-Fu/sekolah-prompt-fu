"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useMDXComponents } from "@/../mdx-components";
import {
  useSectionNavigation,
  useSectionRegistry,
  useSetLevelSlug,
} from "@/components/kids/providers/level-context";
import { getLevelBySlug } from "@/lib/kids/levels";
import { getThemeForLevelSlug, PLANET_THEMES } from "@/components/kids/layout/planet-background";
import { analyticsKids } from "@/lib/analytics";
import type { CompiledLevelContent } from "@/lib/kids/level-content";

interface LevelContentWrapperProps {
  levelSlug: string;
  levelNumber: string;
  /**
   * Optional content loader injection point (tests/storybook). Defaults to the
   * bounded client MDX selector; production callers omit it.
   */
  loadContent?: (locale: string, slug: string) => Promise<{
    Component: CompiledLevelContent;
    effectiveLocale: string;
  } | null>;
}

type LoadState =
  | { status: "loading" }
  | { status: "ready"; Component: CompiledLevelContent }
  | { status: "absent" }
  | { status: "error" };

/**
 * Level content host (01-15).
 *
 * The server passes a validated slug; this client component selects the compiled MDX
 * (bounded locale import, English fallback), renders it through the MDX registry, and
 * drives navigation from the ordered Section identity registry.
 *
 * Locking is identity-scoped and fail-closed: a mounted interactive Section locks Next
 * until its own requirement is resolved and complete. Legacy cursor writes cannot
 * unlock it (until 01-16 migrates the nine consumers to identity completion).
 */
export function LevelContentWrapper({
  levelSlug,
  levelNumber: _levelNumber,
  loadContent,
}: LevelContentWrapperProps) {
  void _levelNumber;
  const t = useTranslations("kids");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const components = useMDXComponents({});
  const setLevelSlug = useSetLevelSlug();
  const { currentSection, setCurrentSection, totalSections } = useSectionNavigation();

  // Keep the (optional) injected loader in a ref so the selection effect depends only on
  // locale/slug and cannot re-run on every render when a caller passes an inline fn.
  const loadContentRef = useRef(loadContent);
  loadContentRef.current = loadContent;

  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [highestVisitedSection, setHighestVisitedSection] = useState(0);
  const [contentCommitted, setContentCommitted] = useState(false);

  // Set the level slug and track the level view.
  useEffect(() => {
    setLevelSlug(levelSlug);
    const level = getLevelBySlug(levelSlug);
    if (level) {
      analyticsKids.viewLevel(levelSlug, level.world);
    }
    return () => setLevelSlug("");
  }, [levelSlug, setLevelSlug]);

  // Reset cursor + visited state and force a fresh MDX mount when locale/slug changes.
  useEffect(() => {
    setCurrentSection(0);
    setHighestVisitedSection(0);
    setContentCommitted(false);
  }, [levelSlug, locale, setCurrentSection]);

  // Select compiled MDX for the validated slug + current provider locale.
  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    // Lazy import keeps locale selection out of the server render path.
    const injected = loadContentRef.current;
    const loader = injected
      ? Promise.resolve(injected)
      : import("@/lib/kids/level-content").then((m) => m.loadLevelContent);

    loader
      .then((load) => load(locale, levelSlug))
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setState({ status: "absent" });
          return;
        }
        setState({ status: "ready", Component: result.Component });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [locale, levelSlug]);

  // Track the highest section visited.
  useEffect(() => {
    setHighestVisitedSection((prev) => Math.max(prev, currentSection));
  }, [currentSection]);

  // Mark that the MDX subtree has committed so a genuine zero-Section result can show
  // the comingSoon state instead of an indefinite loading indicator.
  useEffect(() => {
    if (state.status === "ready") {
      const id = requestAnimationFrame(() => setContentCommitted(true));
      return () => cancelAnimationFrame(id);
    }
    setContentCommitted(false);
  }, [state.status]);

  const hasSections = totalSections > 0;

  // Clamp cursor if section count changed (e.g. locale switch).
  useEffect(() => {
    if (hasSections && currentSection > totalSections - 1) {
      setCurrentSection(totalSections - 1);
    }
  }, [hasSections, totalSections, currentSection, setCurrentSection]);

  const isFirstSection = currentSection === 0;
  const isLastSection = hasSections && currentSection === totalSections - 1;

  // Identity-scoped lock state for the *current* section.
  const currentComplete = useCurrentSectionComplete(currentSection);

  const canNavigateToSection = (targetSection: number): boolean => {
    if (targetSection === currentSection) return true;
    if (targetSection < currentSection && targetSection <= highestVisitedSection) return true;
    return false;
  };

  const goToNext = () => {
    if (!isLastSection && currentComplete) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (!isFirstSection) {
      setCurrentSection((prev) => prev - 1);
    }
  };

  const handleDotClick = (targetSection: number) => {
    if (canNavigateToSection(targetSection)) {
      setCurrentSection(targetSection);
    }
  };

  // Loading: show translated loading indicator, never wrong-locale MDX.
  if (state.status === "loading") {
    return (
      <div className="h-full flex items-center justify-center">
        <p role="status" className="text-[#5D4037] pixel-panel p-6">
          {tCommon("loading")}
        </p>
      </div>
    );
  }

  // Absent (unregistered slug) or error → comingSoon panel with a map link.
  if (state.status === "absent" || state.status === "error") {
    return <ComingSoon label={t("level.comingSoon")} backLabel={t("level.backToMap")} />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Content area — all Sections stay mounted; the active one is visible. */}
      <div className="flex-1 min-h-0 overflow-y-auto flex items-center justify-center p-4">
        <div className="w-full max-w-2xl my-auto prose max-w-none kids-prose-pixel">
          {/* Keyed by locale + slug so a locale/slug change remounts a fresh Section tree. */}
          <state.Component key={`${locale}/${levelSlug}`} components={components} />
        </div>
      </div>

      {contentCommitted && !hasSections ? (
        <div className="shrink-0 p-4">
          <ComingSoon label={t("level.comingSoon")} backLabel={t("level.backToMap")} />
        </div>
      ) : (
        <NavigationFooter
          totalSections={totalSections}
          currentSection={currentSection}
          isFirstSection={isFirstSection}
          isLastSection={isLastSection}
          highestVisitedSection={highestVisitedSection}
          currentComplete={currentComplete}
          canNavigateToSection={canNavigateToSection}
          onPrev={goToPrev}
          onNext={goToNext}
          onDotClick={handleDotClick}
          accentColor={PLANET_THEMES[getThemeForLevelSlug(levelSlug)].accentColor}
          labels={{
            back: t("navigation.back"),
            next: t("navigation.next"),
            map: t("level.map"),
            completeFirst: t("navigation.completeFirst"),
          }}
        />
      )}
    </div>
  );
}

/**
 * Identity-scoped completion state for the current section index.
 *
 * Fail-closed: a section whose scoped requirement is registered but not complete is
 * locked. Until 01-16 migrates the consumers, the requirement is registered through
 * the Section scope (legacy call routed by identity), while completion remains a
 * legacy write that does not satisfy the identity requirement — so such sections stay
 * locked rather than being unlocked by a cursor write.
 */
function useCurrentSectionComplete(currentSection: number): boolean {
  const registry = useSectionRegistry();
  const { totalSections, ordering, completedSections } = useSectionNavigation();

  return useMemo(() => {
    if (totalSections === 0) return true; // no mounted sections yet: not navigable anyway
    const identity = ordering[currentSection];
    if (!identity) return false; // unresolved → fail closed
    if (!registry.sectionRequiresCompletionByIdentity(identity)) return true;
    return registry.isSectionCompleteByIdentity(identity);
    // `completedSections` is the reactive signal for identity-scoped completion writes
    // (markSectionCompleteByIdentity updates it), so the lock must recompute when it
    // changes — otherwise an interactive Section would never unlock after a correct
    // answer (01-16).
  }, [registry, currentSection, totalSections, ordering, completedSections]);
}

interface NavigationFooterProps {
  totalSections: number;
  currentSection: number;
  isFirstSection: boolean;
  isLastSection: boolean;
  highestVisitedSection: number;
  currentComplete: boolean;
  canNavigateToSection: (target: number) => boolean;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (target: number) => void;
  accentColor?: string;
  labels: { back: string; next: string; map: string; completeFirst: string };
}

function NavigationFooter({
  totalSections,
  currentSection,
  isFirstSection,
  isLastSection,
  highestVisitedSection,
  currentComplete,
  canNavigateToSection,
  onPrev,
  onNext,
  onDotClick,
  accentColor,
  labels,
}: NavigationFooterProps) {
  return (
    <div
      className="shrink-0 bg-[#2C1810] border-t-4 transition-colors duration-500"
      style={{ borderTopColor: accentColor || "#8B4513" }}
    >
      <div className="max-w-2xl mx-auto py-3 px-4 flex flex-col gap-3 sm:gap-0">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrev}
            disabled={isFirstSection}
            className={cn(
              "pixel-btn px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-xl",
              isFirstSection && "opacity-0 pointer-events-none"
            )}
          >
            <span className="flex items-center gap-1">
              <PixelArrowLeft />
              {labels.back}
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <SectionDots
              totalSections={totalSections}
              currentSection={currentSection}
              highestVisitedSection={highestVisitedSection}
              canNavigateToSection={canNavigateToSection}
              onDotClick={onDotClick}
            />
          </div>

          {!isLastSection ? (
            <button
              onClick={onNext}
              disabled={!currentComplete}
              className={cn(
                "pixel-btn px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-xl",
                currentComplete
                  ? "pixel-btn-green"
                  : "opacity-50 cursor-not-allowed bg-[#4A3728] border-[#8B4513]"
              )}
              title={!currentComplete ? labels.completeFirst : undefined}
            >
              <span className="flex items-center gap-1">
                {!currentComplete && <PixelLockIcon />}
                {labels.next}
                <PixelArrowRight />
              </span>
            </button>
          ) : (
            <Link
              href="/map"
              className="pixel-btn pixel-btn-amber px-4 py-2 sm:px-6 sm:py-3 text-base sm:text-xl"
            >
              <span className="flex items-center gap-1">
                <PixelMapIcon />
                {labels.map}
              </span>
            </Link>
          )}
        </div>

        <div className="flex sm:hidden items-center justify-center gap-2">
          <SectionDots
            totalSections={totalSections}
            currentSection={currentSection}
            highestVisitedSection={highestVisitedSection}
            canNavigateToSection={canNavigateToSection}
            onDotClick={onDotClick}
          />
        </div>
      </div>
    </div>
  );
}

function SectionDots({
  totalSections,
  currentSection,
  highestVisitedSection,
  canNavigateToSection,
  onDotClick,
}: {
  totalSections: number;
  currentSection: number;
  highestVisitedSection: number;
  canNavigateToSection: (target: number) => boolean;
  onDotClick: (target: number) => void;
}) {
  return (
    <>
      {Array.from({ length: totalSections }).map((_, i) => {
        const canNavigate = canNavigateToSection(i);
        const isVisited = i <= highestVisitedSection;
        const isCurrent = i === currentSection;
        return (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            disabled={!canNavigate}
            className={cn(
              "w-4 h-4 border-2 transition-all",
              isCurrent
                ? "bg-[#22C55E] border-[#16A34A]"
                : isVisited && i < currentSection
                ? "bg-[#3B82F6] border-[#2563EB]"
                : "bg-[#2C1810] border-[#4A3728] opacity-50 cursor-not-allowed"
            )}
            style={{
              clipPath:
                "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)",
            }}
            aria-label={`Go to section ${i + 1}${!canNavigate ? " (locked)" : ""}`}
          />
        );
      })}
    </>
  );
}

function ComingSoon({ label, backLabel }: { label: string; backLabel: string }) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center pixel-panel p-6">
        <p className="text-[#5D4037] mb-4">{label}</p>
        <Link
          href="/map"
          className="pixel-btn pixel-btn-green px-4 py-2 inline-flex items-center gap-2"
        >
          <PixelMapIcon />
          {backLabel}
        </Link>
      </div>
    </div>
  );
}

// Pixel art icons
function PixelArrowLeft() {
  return (
    <svg viewBox="0 0 12 12" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
      <rect x="4" y="5" width="6" height="2" fill="currentColor" />
      <rect x="2" y="5" width="2" height="2" fill="currentColor" />
      <rect x="4" y="3" width="2" height="2" fill="currentColor" />
      <rect x="4" y="7" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelArrowRight() {
  return (
    <svg viewBox="0 0 12 12" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="5" width="6" height="2" fill="currentColor" />
      <rect x="8" y="5" width="2" height="2" fill="currentColor" />
      <rect x="6" y="3" width="2" height="2" fill="currentColor" />
      <rect x="6" y="7" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelMapIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" style={{ imageRendering: "pixelated" }}>
      <rect x="5" y="1" width="6" height="2" fill="currentColor" />
      <rect x="4" y="2" width="8" height="2" fill="currentColor" />
      <rect x="3" y="3" width="10" height="4" fill="currentColor" />
      <rect x="4" y="7" width="8" height="2" fill="currentColor" />
      <rect x="5" y="9" width="6" height="2" fill="currentColor" />
      <rect x="6" y="11" width="4" height="2" fill="currentColor" />
      <rect x="7" y="13" width="2" height="2" fill="currentColor" />
      <rect x="5" y="4" width="2" height="2" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

function PixelLockIcon() {
  return (
    <svg viewBox="0 0 12 14" className="w-3 h-3.5" style={{ imageRendering: "pixelated" }}>
      <rect x="1" y="6" width="10" height="8" fill="currentColor" />
      <rect x="3" y="2" width="2" height="4" fill="currentColor" />
      <rect x="7" y="2" width="2" height="4" fill="currentColor" />
      <rect x="3" y="1" width="6" height="2" fill="currentColor" />
      <rect x="5" y="9" width="2" height="3" fill="#2C1810" />
    </svg>
  );
}