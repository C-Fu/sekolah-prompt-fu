"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { type TipScreenId, isTipDismissed, dismissTip } from "@/lib/kids/journey-preferences";

export interface JourneyTipProps {
  screenId: TipScreenId;
  message: string;
  dismissLabel: string;
  className?: string;
  onDismiss?: () => void;
}

export function JourneyTip({
  screenId,
  message,
  dismissLabel,
  className,
  onDismiss,
}: JourneyTipProps) {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true); // default true before mount to avoid SSR flash

  useEffect(() => {
    setMounted(true);
    setDismissed(isTipDismissed(screenId));
  }, [screenId]);

  if (!mounted || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    dismissTip(screenId);
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      role="region"
      aria-label="Guidance Tip"
      data-testid={`journey-tip-${screenId}`}
      className={cn(
        "inline-flex items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 text-white border border-[#DAA520] shadow-lg text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200 pointer-events-auto",
        className
      )}
    >
      <span className="text-base select-none" aria-hidden="true">💡</span>
      <span className="font-medium text-[#FEF3C7] leading-tight">{message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        className="px-2.5 py-1 rounded-lg bg-[#FFD700] hover:bg-[#FFC000] text-[#2C1810] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shrink-0 active:scale-95"
      >
        {dismissLabel}
      </button>
    </div>
  );
}
