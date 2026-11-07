"use client";

import { useLocalePreference } from "@/components/providers";
import { cn } from "@/lib/utils";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const localePref = useLocalePreference();
  const currentLocale = localePref?.locale || "en";
  const isBM = currentLocale === "ms";
  const isSwitching = localePref?.isSwitching || false;

  const handleSelect = async (target: "ms" | "en") => {
    if (isSwitching || currentLocale === target) return;
    if (localePref?.setUserLocale) {
      await localePref.setUserLocale(target);
    }
  };

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={cn(
        "flex items-center h-8 bg-[#2C1810] border-2 border-[#8B4513] pixel-border-sm p-0.5 rounded gap-0.5 text-xs font-bold font-mono select-none",
        isSwitching && "opacity-75 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        onClick={() => handleSelect("ms")}
        aria-pressed={isBM}
        aria-label="Tukar ke Bahasa Melayu"
        className={cn(
          "px-2 py-0.5 rounded transition-colors flex items-center gap-1",
          isBM
            ? "bg-[#FFD700] text-[#8B4513] shadow-sm font-extrabold"
            : "text-[#D2B48C] hover:text-white hover:bg-[#4A3728]"
        )}
      >
        <span>BM</span>
      </button>

      <span className="text-[#8B4513] text-[10px]">|</span>

      <button
        type="button"
        onClick={() => handleSelect("en")}
        aria-pressed={!isBM}
        aria-label="Switch to English"
        className={cn(
          "px-2 py-0.5 rounded transition-colors flex items-center gap-1",
          !isBM
            ? "bg-[#FFD700] text-[#8B4513] shadow-sm font-extrabold"
            : "text-[#D2B48C] hover:text-white hover:bg-[#4A3728]"
        )}
      >
        <span>EN</span>
      </button>
    </div>
  );
}
