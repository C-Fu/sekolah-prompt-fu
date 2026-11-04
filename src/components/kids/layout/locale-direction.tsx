"use client";

import { useLocale } from "next-intl";
import { isRtlLocale } from "@/lib/i18n/config";

/**
 * Client locale direction wrapper (01-17).
 *
 * The kids layout is a server component and must not resolve the locale at request time
 * (`getLocale`). Direction can only follow the *client* provider locale, so this thin
 * client child reads `useLocale()` and applies `dir="rtl|ltr"` to the layout's existing
 * wrapper element. Its initial render uses the provider's deterministic default locale and
 * then re-renders after hydration when a saved preference is restored.
 */
export function LocaleDirection({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);

  return (
    <div
      className={className}
      data-theme="light"
      dir={isRtl ? "rtl" : "ltr"}
      style={style}
    >
      {children}
    </div>
  );
}