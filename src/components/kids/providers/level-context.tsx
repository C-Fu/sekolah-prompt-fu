"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from "react";

/**
 * Section identity + ordered navigation registry (01-15).
 *
 * Compiled MDX Sections are all mounted at once, so the old "navigation cursor ==
 * section index" model cannot identify an individual Section. Instead each mounted
 * Section owns a stable identity object; the wrapper resolves identities to ordered
 * indexes from real document order after commit.
 *
 * Backward compatibility (until 01-16 migrates the nine interactive consumers):
 * the legacy numeric signatures remain callable, but they only write the legacy sink.
 * Navigation locking is driven exclusively by *identity-scoped* requirements, so a
 * legacy cursor write can never unlock a mounted interactive Section (fail closed).
 */

export type SectionIdentity = { readonly id: string };

interface SectionRecord {
  identity: SectionIdentity;
  element: HTMLElement | null;
  requiresCompletion: boolean;
  completed: boolean;
}

interface LevelContextType {
  levelSlug: string;
  setLevelSlug: (slug: string) => void;
  currentSection: number;
  setCurrentSection: (section: number | ((prev: number) => number)) => void;
  completedSections: Set<number>;
  markSectionComplete: (section: number) => void;
  isSectionComplete: (section: number) => boolean;
  resetSectionProgress: () => void;
  // Track sections that have interactive elements requiring completion
  sectionsWithRequirements: Set<number>;
  registerSectionRequirement: (section: number) => void;
  sectionRequiresCompletion: (section: number) => boolean;

  // --- identity registry (01-15) ---
  totalSections: number;
  /** Ordered identities, index-aligned with the resolved document order. */
  ordering: SectionIdentity[];
  indexByIdentity: Map<string, number>;
  /** True once at least one mounted section has an identity-scoped requirement. */
  hasIdentityRequirements: boolean;
  registerSection: (identity: SectionIdentity, element: HTMLElement | null) => void;
  unregisterSection: (identity: SectionIdentity) => void;
  /** Mark an identity's section as requiring completion (identity-scoped). */
  registerRequirementByIdentity: (
    identity: SectionIdentity,
    required: boolean
  ) => void;
  resolveIndex: (identity: SectionIdentity) => number | null;
  sectionRequiresCompletionByIdentity: (identity: SectionIdentity) => boolean;
  isSectionCompleteByIdentity: (identity: SectionIdentity) => boolean;
  /** Identity-scoped completion write; refuses unresolved identities. */
  markSectionCompleteByIdentity: (identity: SectionIdentity) => boolean;
}

const noop = () => {};

const LevelContext = createContext<LevelContextType>({
  levelSlug: "",
  setLevelSlug: noop,
  currentSection: 0,
  setCurrentSection: noop,
  completedSections: new Set(),
  markSectionComplete: noop,
  isSectionComplete: () => false,
  resetSectionProgress: noop,
  sectionsWithRequirements: new Set(),
  registerSectionRequirement: noop,
  sectionRequiresCompletion: () => false,
  totalSections: 0,
  ordering: [],
  indexByIdentity: new Map(),
  hasIdentityRequirements: false,
  registerSection: noop,
  unregisterSection: noop,
  registerRequirementByIdentity: noop,
  resolveIndex: () => null,
  sectionRequiresCompletionByIdentity: () => false,
  isSectionCompleteByIdentity: () => false,
  markSectionCompleteByIdentity: () => false,
});

let identityCounter = 0;
export function createSectionIdentity(): SectionIdentity {
  identityCounter += 1;
  return { id: `section-${identityCounter}` };
}

export function LevelProvider({
  children,
  levelSlug: initialSlug = "",
}: {
  children: ReactNode;
  levelSlug?: string;
}) {
  const [levelSlug, setLevelSlug] = useState(initialSlug);
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [sectionsWithRequirements, setSectionsWithRequirements] = useState<Set<number>>(
    new Set()
  );

  // Identity registry. Mutated in refs (no re-render storms); a version counter triggers
  // the order recomputation + a re-render after commit. Callbacks read refs so the
  // registry surface stays referentially stable across renders (avoids Section effect
  // churn / infinite update loops).
  const recordsRef = useRef<Map<string, SectionRecord>>(new Map());
  const orderingRef = useRef<SectionIdentity[]>([]);
  const indexRef = useRef<Map<string, number>>(new Map());
  const completedRef = useRef<Set<number>>(new Set());
  const [registryVersion, setRegistryVersion] = useState(0);

  // Mirror of the resolved order, exposed reactively to consumers (index-aligned).
  const [ordering, setOrdering] = useState<SectionIdentity[]>([]);

  // Update if initialSlug changes
  useEffect(() => {
    if (initialSlug) {
      setLevelSlug(initialSlug);
    }
  }, [initialSlug]);

  // Reset transient state when the level (mount tree) changes. Completed levels/stars
  // live in slug-scoped kids-progress and are intentionally preserved (01-17 owns
  // clearing locale-incompatible section completions). Skipped on the initial mount so
  // it cannot wipe Sections that registered in their own mount-era layout effects.
  const didMountRef = useRef(false);
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    recordsRef.current = new Map();
    orderingRef.current = [];
    indexRef.current = new Map();
    completedRef.current = new Set();
    setOrdering([]);
    setCurrentSection(0);
    setCompletedSections(new Set());
    setSectionsWithRequirements(new Set());
    setRegistryVersion((v) => v + 1);
  }, [levelSlug]);

  const registerSection = useCallback(
    (identity: SectionIdentity, element: HTMLElement | null) => {
      const existing = recordsRef.current.get(identity.id);
      if (existing) {
        if (existing.element === element) return; // idempotent (StrictMode re-registration)
        existing.element = element;
      } else {
        recordsRef.current.set(identity.id, {
          identity,
          element,
          requiresCompletion: false,
          completed: false,
        });
      }
      setRegistryVersion((v) => v + 1);
    },
    []
  );

  const unregisterSection = useCallback((identity: SectionIdentity) => {
    if (!recordsRef.current.has(identity.id)) return;
    recordsRef.current.delete(identity.id);
    setRegistryVersion((v) => v + 1);
  }, []);

  const registerRequirementByIdentity = useCallback(
    (identity: SectionIdentity, required: boolean) => {
      const record = recordsRef.current.get(identity.id);
      if (!record) return; // unresolved identity: fail closed, do not register
      if (record.requiresCompletion === required) return;
      record.requiresCompletion = required;
      setRegistryVersion((v) => v + 1);
    },
    []
  );

  // Recompute ordered indexes from real DOM document order after every commit where
  // the registry changed. Sections without a resolved element sort last, stably.
  useLayoutEffect(() => {
    const records = Array.from(recordsRef.current.values());
    const withElements = records.filter((r) => r.element);
    const withoutElements = records.filter((r) => !r.element);

    withElements.sort((a, b) => {
      const ea = a.element!;
      const eb = b.element!;
      if (ea === eb) return 0;
      const pos = ea.compareDocumentPosition(eb);
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
      return 0;
    });

    const ordered = [...withElements, ...withoutElements];
    const indexByIdentity = new Map<string, number>();
    ordered.forEach((r, i) => indexByIdentity.set(r.identity.id, i));

    const identities = ordered.map((r) => r.identity);
    const changed =
      orderingRef.current.length !== identities.length ||
      orderingRef.current.some((id, i) => id.id !== identities[i].id);

    orderingRef.current = identities;
    indexRef.current = indexByIdentity;
    if (changed) {
      setOrdering(identities);
    }
  }, [registryVersion]);

  // Clamp the cursor if the section count shrinks (e.g. locale content change).
  useEffect(() => {
    const total = ordering.length;
    if (total > 0 && currentSection > total - 1) {
      setCurrentSection(total - 1);
    }
  }, [ordering.length, currentSection]);

  const markSectionComplete = useCallback((section: number) => {
    // Legacy sink only: does not satisfy identity-scoped requirements (fail closed).
    completedRef.current = new Set(completedRef.current).add(section);
    setCompletedSections((prev) => {
      if (prev.has(section)) return prev;
      const newSet = new Set(prev);
      newSet.add(section);
      return newSet;
    });
  }, []);

  const isSectionComplete = useCallback(
    (section: number) => completedRef.current.has(section),
    []
  );

  const resetSectionProgress = useCallback(() => {
    completedRef.current = new Set();
    setCompletedSections(new Set());
    setSectionsWithRequirements(new Set());
    setCurrentSection(0);
  }, []);

  const registerSectionRequirement = useCallback((section: number) => {
    setSectionsWithRequirements((prev) => {
      if (prev.has(section)) return prev;
      const newSet = new Set(prev);
      newSet.add(section);
      return newSet;
    });
  }, []);

  const sectionRequiresCompletion = useCallback(
    (section: number) => sectionsWithRequirements.has(section),
    [sectionsWithRequirements]
  );

  const resolveIndex = useCallback(
    (identity: SectionIdentity) => indexRef.current.get(identity.id) ?? null,
    []
  );

  const sectionRequiresCompletionByIdentity = useCallback(
    (identity: SectionIdentity) =>
      recordsRef.current.get(identity.id)?.requiresCompletion ?? false,
    []
  );

  const isSectionCompleteByIdentity = useCallback((identity: SectionIdentity) => {
    const index = indexRef.current.get(identity.id);
    if (index === undefined) return false;
    return completedRef.current.has(index);
  }, []);

  const markSectionCompleteByIdentity = useCallback((identity: SectionIdentity) => {
    const index = indexRef.current.get(identity.id);
    if (index === undefined) return false; // refuse unresolved identity
    if (completedRef.current.has(index)) return true;
    completedRef.current = new Set(completedRef.current).add(index);
    setCompletedSections((prev) => {
      if (prev.has(index)) return prev;
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
    return true;
  }, []);

  const hasIdentityRequirements = useMemo(
    () => Array.from(recordsRef.current.values()).some((r) => r.requiresCompletion),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [registryVersion]
  );

  const value: LevelContextType = {
    levelSlug,
    setLevelSlug,
    currentSection,
    setCurrentSection,
    completedSections,
    markSectionComplete,
    isSectionComplete,
    resetSectionProgress,
    sectionsWithRequirements,
    registerSectionRequirement,
    sectionRequiresCompletion,
    totalSections: ordering.length,
    ordering,
    indexByIdentity: indexRef.current,
    hasIdentityRequirements,
    registerSection,
    unregisterSection,
    registerRequirementByIdentity,
    resolveIndex,
    sectionRequiresCompletionByIdentity,
    isSectionCompleteByIdentity,
    markSectionCompleteByIdentity,
  };

  const registry = useMemo<SectionRegistry>(
    () => ({
      createIdentity: createSectionIdentity,
      registerSection,
      unregisterSection,
      registerRequirementByIdentity,
      resolveIndex,
      sectionRequiresCompletionByIdentity,
      isSectionCompleteByIdentity,
      markSectionCompleteByIdentity,
    }),
    [
      registerSection,
      unregisterSection,
      registerRequirementByIdentity,
      resolveIndex,
      sectionRequiresCompletionByIdentity,
      isSectionCompleteByIdentity,
      markSectionCompleteByIdentity,
    ]
  );

  return (
    <LevelContext.Provider value={value}>
      <RegistryContext.Provider value={registry}>{children}</RegistryContext.Provider>
    </LevelContext.Provider>
  );
}

export function useLevelSlug(): string {
  return useContext(LevelContext).levelSlug;
}

export function useSetLevelSlug(): (slug: string) => void {
  return useContext(LevelContext).setLevelSlug;
}

export function useSectionNavigation() {
  const context = useContext(LevelContext);
  const scope = useContext(SectionScopeContext);
  // Stable wrapper that routes the legacy numeric signature to the containing Section
  // identity (ignoring the passed cursor), falling back to the legacy sink outside any
  // Section. Memoized so legacy `useEffect([currentSection, registerSectionRequirement])`
  // deps do not churn every render.
  const registerSectionRequirement = useMemo(
    () => (scope ? () => scope.registerRequirement(true) : context.registerSectionRequirement),
    [scope, context.registerSectionRequirement]
  );
  return {
    currentSection: context.currentSection,
    setCurrentSection: context.setCurrentSection,
    completedSections: context.completedSections,
    markSectionComplete: context.markSectionComplete,
    isSectionComplete: context.isSectionComplete,
    resetSectionProgress: context.resetSectionProgress,
    sectionsWithRequirements: context.sectionsWithRequirements,
    registerSectionRequirement,
    sectionRequiresCompletion: context.sectionRequiresCompletion,
    totalSections: context.totalSections,
    ordering: context.ordering,
  };
}

/** Identity-registry surface consumed by `Section` (01-15). */
export interface SectionRegistry {
  createIdentity: () => SectionIdentity;
  registerSection: (identity: SectionIdentity, element: HTMLElement | null) => void;
  unregisterSection: (identity: SectionIdentity) => void;
  registerRequirementByIdentity: (identity: SectionIdentity, required: boolean) => void;
  resolveIndex: (identity: SectionIdentity) => number | null;
  sectionRequiresCompletionByIdentity: (identity: SectionIdentity) => boolean;
  isSectionCompleteByIdentity: (identity: SectionIdentity) => boolean;
  markSectionCompleteByIdentity: (identity: SectionIdentity) => boolean;
}

// Stable registry surface: the underlying callbacks are all `useCallback`-stable, so
// this object is memoized once per provider to avoid re-render loops in Section.
const RegistryContext = createContext<SectionRegistry>({
  createIdentity: createSectionIdentity,
  registerSection: noop,
  unregisterSection: noop,
  registerRequirementByIdentity: noop,
  resolveIndex: () => null,
  sectionRequiresCompletionByIdentity: () => false,
  isSectionCompleteByIdentity: () => false,
  markSectionCompleteByIdentity: () => false,
});

export function useSectionRegistry(): SectionRegistry {
  return useContext(RegistryContext);
}

// --- Section-scoped identity context ---

export interface SectionScopeValue {
  identity: SectionIdentity;
  /** Identity-scoped requirement registration routed from legacy consumers. */
  registerRequirement: (required: boolean) => void;
  markComplete: () => boolean;
  isComplete: () => boolean;
  requiresCompletion: () => boolean;
  /** Resolved ordered index, or null before the registry commits. */
  index: number | null;
  /** Ordered index once the registry has committed; null before then. */
  getIndex: () => number | null;
}

export const SectionScopeContext = createContext<SectionScopeValue | null>(null);

/**
 * Resolve the containing Section identity for a mounted interactive descendant.
 * Returns `null` outside any Section (e.g. a bare rendered Section in isolation).
 */
export function useSectionIdentity(): SectionScopeValue | null {
  return useContext(SectionScopeContext);
}