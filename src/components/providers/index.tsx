"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import {
  loadMessages,
  readPersistedLocale,
  transitionLocale,
  type LocaleTransitionResult,
} from "@/lib/i18n/client";

interface ProvidersProps {
  children: React.ReactNode;
  /** Deterministic (request-independent) default locale used for the initial render. */
  locale: string;
  /** Messages matching the default locale (used for the initial render). */
  messages: AbstractIntlMessages;
}

export interface LocalePreferenceContextValue {
  /** The currently effective provider locale. */
  locale: string;
  /**
   * Select a user locale. Validates the target, invalidates locale-incompatible
   * interaction state for a genuine change, and switches messages/locale atomically.
   * Returns the transition result so callers can surface an invalidation failure.
   */
  setUserLocale: (target: string) => Promise<LocaleTransitionResult>;
  /** True while a locale switch is loading its message bundle. */
  isSwitching: boolean;
}

const LocalePreferenceContext = createContext<LocalePreferenceContextValue | null>(null);

/** Access the client locale preference signal (provider locale + switch action). */
export function useLocalePreference(): LocalePreferenceContextValue | null {
  return useContext(LocalePreferenceContext);
}

/**
 * Kids-compatible shared shell provider.
 *
 * Wraps the app in the translation provider only (session/theme/branding wrappers were
 * the retired non-kids shell). It owns the single `locale`/`messages` pair so a client
 * locale switch updates both atomically, and it exposes a validated, persisted
 * preference signal (01-17) without any request-time locale lookup.
 *
 * Hydration contract: the initial render always uses the deterministic `locale`/`messages`
 * props (so server and client markup match). A previously saved preference is restored
 * *after* mount; that restoration treats the default as a transient rendering value and
 * does NOT invalidate the saved locale's own Section completions or drafts. Only a
 * genuine user-initiated change to a different locale invalidates locale-incompatible
 * interaction state.
 */
export function Providers({ children, locale: initialLocale, messages: initialMessages }: ProvidersProps) {
  const [state, setState] = useState<{ locale: string; messages: AbstractIntlMessages }>({
    locale: initialLocale,
    messages: initialMessages,
  });
  const [isSwitching, setIsSwitching] = useState(false);

  // Guards the restoration + switch effects against React StrictMode double-invocation
  // and against racing unmounts.
  const restoredRef = useRef(false);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Keep the effective locale in a ref so the switch callback reads the latest value
  // without being re-created (and without stale closures).
  const localeRef = useRef(state.locale);
  localeRef.current = state.locale;

  // Restore a saved preference after the deterministic default has hydrated. This is NOT
  // a user-initiated change: it must not invalidate the saved locale's own completions.
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const saved = readPersistedLocale();
    if (!saved || saved === localeRef.current) return;

    let cancelled = false;
    setIsSwitching(true);
    loadMessages(saved)
      .then((messages) => {
        if (cancelled || !mountedRef.current) return;
        setState({ locale: saved, messages });
      })
      .finally(() => {
        if (!cancelled && mountedRef.current) setIsSwitching(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setUserLocale = useCallback(async (target: string): Promise<LocaleTransitionResult> => {
    const result = transitionLocale(target, localeRef.current);
    if (!result.ok || !result.changed) {
      // No-op (same locale) or invalidation failure: retain the current effective locale.
      return result;
    }

    setIsSwitching(true);
    const messages = await loadMessages(result.locale);
    if (mountedRef.current) {
      setState({ locale: result.locale, messages });
      setIsSwitching(false);
    }
    return result;
  }, []);

  const contextValue = useMemo<LocalePreferenceContextValue>(
    () => ({ locale: state.locale, setUserLocale, isSwitching }),
    [state.locale, setUserLocale, isSwitching]
  );

  return (
    <LocalePreferenceContext.Provider value={contextValue}>
      <NextIntlClientProvider locale={state.locale} messages={state.messages}>
        {children}
        <Toaster position="bottom-right" />
      </NextIntlClientProvider>
    </LocalePreferenceContext.Provider>
  );
}