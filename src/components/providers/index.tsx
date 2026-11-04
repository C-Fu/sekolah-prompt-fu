"use client";

import { Toaster } from "@/components/ui/sonner";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

/**
 * Kids-compatible shared shell provider.
 *
 * This wraps the app in the translation provider only. Session, theme and
 * branding wrappers were part of the retired non-kids shell and are no longer
 * rendered here. `locale`/`messages` are preserved as props so client locale
 * switching and persisted preference can be layered in without another shell
 * rewrite.
 */
export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
      <Toaster position="bottom-right" />
    </NextIntlClientProvider>
  );
}