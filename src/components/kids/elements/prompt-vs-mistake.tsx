"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PixelRobot, PixelStar } from "./pixel-art";
import { useLevelSlug, useSectionIdentity } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface PromptVsMistakeProps {
  question: string;
  good: string;
  bad: string;
  explanation?: string;
  peromfuMessage?: string;
}

interface SavedState {
  selected: "good" | "bad" | null;
  showResult: boolean;
  order: string[];
}

export function PromptVsMistake({
  question,
  good,
  bad,
  explanation,
  peromfuMessage,
}: PromptVsMistakeProps) {
  const t = useTranslations("kids.quiz");
  const tActivity = useTranslations("kids.activity");
  const levelSlug = useLevelSlug();
  const scope = useSectionIdentity();
  const componentId = useId();
  
  const optionButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const retryButtonRef = useRef<HTMLButtonElement | null>(null);

  // Register that this Section has an interactive element requiring completion,
  // routed through the Section scope so it binds to the containing Section even while
  // offscreen (all Sections stay mounted).
  useEffect(() => {
    scope?.registerRequirement(true);
  }, [scope]);
  
  const [selected, setSelected] = useState<"good" | "bad" | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const randomOrder = Math.random() > 0.5 ? ["good", "bad"] : ["bad", "good"];
    
    if (!levelSlug) {
      setOrder(randomOrder);
      setIsLoaded(true);
      return;
    }
    
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && saved.order && saved.order.length > 0) {
      setSelected(saved.selected);
      setShowResult(saved.showResult);
      setOrder(saved.order);
    } else {
      setOrder(randomOrder);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state when it changes
  useEffect(() => {
    if (!levelSlug || !isLoaded || order.length === 0) return;
    
    saveComponentState<SavedState>(levelSlug, componentId, {
      selected,
      showResult,
      order,
    });
  }, [levelSlug, componentId, selected, showResult, order, isLoaded]);

  const isCorrect = selected === "good";

  const handleSelect = (choice: "good" | "bad") => {
    setSelected(choice);
    setShowResult(true);
    // Mark the containing Section complete only on the correct answer, keyed by its
    // resolved Section index (both persisted and in-memory), never the cursor.
    if (choice === "good" && levelSlug && scope) {
      const index = scope.getIndex();
      if (index !== null) markSectionCompleted(levelSlug, index);
      scope.markComplete();
    }
  };

  const handleReset = () => {
    const previous = selected;
    setSelected(null);
    setShowResult(false);
    // Return focus to previously selected option or first available
    setTimeout(() => {
      const target = previous || order[0];
      if (target && optionButtonsRef.current[target]) {
        optionButtonsRef.current[target]?.focus();
      }
    }, 0);
  };
  
  const currentStatusText = useCallback((): string => {
    if (showResult) {
      if (isCorrect) {
        return `🎉 ${t("correct")} ${t("goodLabel")}${explanation ? ` ${explanation}` : ""}`;
      }
      return `🤔 ${t("incorrect")} ${t("badLabel")}. ${t("tryAgain")}${explanation ? ` ${explanation}` : ""}`;
    }
    return question;
  }, [showResult, isCorrect, t, explanation, question]);

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) return null;

  const options = order.map((type) => ({
    type: type as "good" | "bad",
    text: type === "good" ? good : bad,
  }));

  // Pixel clip-path for consistent styling (stepped corners like pixel-panel)
  const pixelClipPath = "polygon(0 8px, 8px 8px, 8px 0, calc(100% - 8px) 0, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 8px calc(100% - 8px), 0 calc(100% - 8px))";
  const smallPixelClipPath = "polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))";

  return (
    <div className="my-2">
      {/* Question card with Peromfu */}
      <div className="flex items-center gap-2 mb-2">
        <div className="shrink-0">
          <PixelRobot className="w-8 h-10" />
        </div>
        <div className="flex-1 relative">
          {/* Speech bubble */}
          <div 
            className="bg-white p-2 shadow-md border-2 border-[#8B4513] relative ml-2"
            style={{ clipPath: pixelClipPath }}
          >
            {/* Arrow pointing left */}
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-[#8B4513] border-b-[6px] border-b-transparent" />
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-r-[6px] border-r-white border-b-[5px] border-b-transparent" />
            <p className="text-base font-bold text-[#2C1810] m-0">
              {question}
            </p>
          </div>
        </div>
      </div>

      {/* Accessible live status announcer */}
      <div
        data-testid="prompt-vs-mistake-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-base font-medium px-4 py-2 bg-amber-50/95 border-2 border-amber-300 rounded-lg text-[#2C1810] mb-3"
      >
        {currentStatusText()}
      </div>

      {/* Choice cards - stacked on mobile, side by side on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(({ type, text }, index) => {
          const isGood = type === "good";
          const isSelected = selected === type;
          
          return (
            <button
              key={type}
              ref={(el) => {
                optionButtonsRef.current[type] = el;
              }}
              type="button"
              onClick={() => {
                if (showResult) return;
                handleSelect(type);
              }}
              aria-pressed={isSelected}
              aria-disabled={showResult ? "true" : undefined}
              className={cn(
                "w-full min-h-[44px] min-w-[44px] text-left transition-all duration-300 overflow-hidden border-2",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2",
                !showResult && "border-amber-400 border-solid hover:scale-[1.01] hover:shadow-lg cursor-pointer",
                showResult && isGood && "border-green-600 border-solid scale-100 cursor-default",
                showResult && !isGood && "border-red-500 border-dashed scale-100 cursor-default"
              )}
              style={{ clipPath: pixelClipPath }}
            >
              <div className={cn(
                "p-1 transition-colors h-full",
                !showResult && "bg-gradient-to-br from-[#FFB347] to-[#FF8C00]",
                showResult && isGood && "bg-gradient-to-br from-[#4ADE80] to-[#16A34A]",
                showResult && !isGood && "bg-gradient-to-br from-[#FB7185] to-[#E11D48]"
              )}>
                <div 
                  className={cn(
                    "bg-white p-3 transition-colors h-full flex flex-col justify-between",
                    showResult && isGood && "bg-[#F0FDF4]",
                    showResult && !isGood && "bg-[#FFF1F2]"
                  )}
                  style={{ clipPath: smallPixelClipPath }}
                >
                  {/* Option label & outcome badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className={cn(
                          "w-7 h-7 flex items-center justify-center text-sm font-bold text-white shrink-0",
                          !showResult && "bg-[#F59E0B]",
                          showResult && isGood && "bg-[#22C55E]",
                          showResult && !isGood && "bg-[#EF4444]"
                        )}
                        style={{ clipPath: smallPixelClipPath }}
                      >
                        {showResult ? (isGood ? <PixelCheckIcon /> : <PixelXIcon />) : (index === 0 ? "A" : "B")}
                      </span>
                      {showResult && (
                        <span className={cn(
                          "text-sm font-bold flex items-center gap-1",
                          isGood ? "text-[#16A34A]" : "text-[#DC2626]"
                        )}>
                          <span>{isGood ? "✓" : "✗"}</span>
                          <span>{isGood ? tActivity("correct") : tActivity("incorrect")}</span>
                          <span className="text-xs opacity-75">({isGood ? t("goodLabel") : t("badLabel")})</span>
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#8B4513] border border-amber-300">
                        {tActivity("selected")}
                      </span>
                    )}
                  </div>
                  
                  {/* Prompt text */}
                  <div 
                    className={cn(
                      "p-2.5 border flex-1 flex items-center rounded",
                      showResult && isGood ? "bg-green-50 border-green-200" :
                      showResult && !isGood ? "bg-red-50 border-red-200" :
                      "bg-[#FEF3C7] border-[#F59E0B]/30"
                    )}
                    style={{ clipPath: smallPixelClipPath }}
                  >
                    <p className="text-base text-[#2C1810] m-0 whitespace-pre-wrap leading-relaxed">
                      &ldquo;{text}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div 
          className={cn(
            "mt-3 p-4 text-center animate-in fade-in zoom-in-95 duration-300 bg-white/95",
            isCorrect 
              ? "border-2 border-[#22C55E] border-solid"
              : "border-2 border-[#F59E0B] border-dashed"
          )}
          style={{ clipPath: pixelClipPath }}
        >
          <p className="text-base font-bold text-[#2C1810] m-0 flex items-center justify-center gap-2">
            {isCorrect ? (
              <><PixelStar filled className="w-4 h-4 inline" /> {t("correct")} <PixelStar filled className="w-4 h-4 inline" /></>
            ) : t("incorrect")}
          </p>
          {explanation && (
            <p className="text-sm text-[#5D4037] m-0 mt-2">{explanation}</p>
          )}
          {peromfuMessage && (
            <div 
              className="flex items-center justify-center gap-2 mt-3 bg-amber-50/80 p-2 border border-amber-200"
              style={{ clipPath: smallPixelClipPath }}
            >
              <PixelRobot className="w-6 h-7 shrink-0" />
              <p className="text-sm text-[#5D4037] m-0">{peromfuMessage}</p>
            </div>
          )}
          {!isCorrect && (
            <button 
              ref={retryButtonRef}
              type="button"
              onClick={handleReset} 
              className="mt-3 inline-flex items-center justify-center gap-2 min-h-[44px] min-w-[44px] px-5 py-2.5 bg-[#8B4513] hover:bg-[#A0522D] text-white text-base font-bold transition-colors cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2"
              style={{ clipPath: smallPixelClipPath }}
            >
              <PixelRefreshIcon />
              <span>{t("tryAgain")}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Pixel art icons
function PixelCheckIcon() {
  return (
    <svg viewBox="0 0 12 12" className="w-5 h-5" style={{ imageRendering: "pixelated" }} aria-hidden="true">
      <rect x="2" y="6" width="2" height="2" fill="currentColor" />
      <rect x="4" y="8" width="2" height="2" fill="currentColor" />
      <rect x="6" y="6" width="2" height="2" fill="currentColor" />
      <rect x="8" y="4" width="2" height="2" fill="currentColor" />
      <rect x="10" y="2" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelXIcon() {
  return (
    <svg viewBox="0 0 12 12" className="w-5 h-5" style={{ imageRendering: "pixelated" }} aria-hidden="true">
      <rect x="2" y="2" width="2" height="2" fill="currentColor" />
      <rect x="8" y="2" width="2" height="2" fill="currentColor" />
      <rect x="4" y="4" width="2" height="2" fill="currentColor" />
      <rect x="6" y="4" width="2" height="2" fill="currentColor" />
      <rect x="4" y="6" width="2" height="2" fill="currentColor" />
      <rect x="6" y="6" width="2" height="2" fill="currentColor" />
      <rect x="2" y="8" width="2" height="2" fill="currentColor" />
      <rect x="8" y="8" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelRefreshIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4" style={{ imageRendering: "pixelated" }} aria-hidden="true">
      <rect x="6" y="1" width="4" height="2" fill="currentColor" />
      <rect x="4" y="3" width="2" height="2" fill="currentColor" />
      <rect x="10" y="3" width="2" height="2" fill="currentColor" />
      <rect x="2" y="5" width="2" height="4" fill="currentColor" />
      <rect x="12" y="5" width="2" height="4" fill="currentColor" />
      <rect x="2" y="7" width="2" height="4" fill="currentColor" />
      <rect x="12" y="9" width="2" height="2" fill="currentColor" />
      <rect x="4" y="11" width="2" height="2" fill="currentColor" />
      <rect x="10" y="11" width="2" height="2" fill="currentColor" />
      <rect x="6" y="13" width="4" height="2" fill="currentColor" />
      <rect x="12" y="3" width="3" height="2" fill="currentColor" />
      <rect x="1" y="11" width="3" height="2" fill="currentColor" />
    </svg>
  );
}
