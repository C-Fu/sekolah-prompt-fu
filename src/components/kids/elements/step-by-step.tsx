"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionIdentity } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface StepByStepProps {
  title?: string;
  problem: string;
  wrongAnswer: string;
  steps: string[];
  rightAnswer: string;
  magicWords?: string;
  successMessage?: string;
}

interface SavedState {
  magicWordsAdded: boolean;
  revealedSteps: number;
  completed: boolean;
}

export function StepByStep({
  title,
  problem,
  wrongAnswer,
  steps,
  rightAnswer,
  magicWords = "Let's think step by step",
  successMessage,
}: StepByStepProps) {
  const t = useTranslations("kids.stepByStep");
  const tActivity = useTranslations("kids.activity");
  const levelSlug = useLevelSlug();
  const scope = useSectionIdentity();
  const componentId = useId();
  
  const magicWordsButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextStepButtonRef = useRef<HTMLButtonElement | null>(null);
  const retryButtonRef = useRef<HTMLButtonElement | null>(null);

  // Register that this Section has an interactive element requiring completion,
  // routed through the Section scope so it binds to the containing Section.
  useEffect(() => {
    scope?.registerRequirement(true);
  }, [scope]);
  
  const displayTitle = title || t("title");

  const [magicWordsAdded, setMagicWordsAdded] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state
  useEffect(() => {
    if (!levelSlug) {
      setIsLoaded(true);
      return;
    }
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && typeof saved.magicWordsAdded === 'boolean') {
      setMagicWordsAdded(saved.magicWordsAdded);
      setRevealedSteps(saved.revealedSteps || 0);
      setCompleted(saved.completed || false);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state
  useEffect(() => {
    if (!levelSlug || !isLoaded) return;
    saveComponentState<SavedState>(levelSlug, componentId, {
      magicWordsAdded,
      revealedSteps,
      completed,
    });
  }, [levelSlug, componentId, magicWordsAdded, revealedSteps, completed, isLoaded]);

  const handleAddMagicWords = () => {
    if (magicWordsAdded) return;
    setMagicWordsAdded(true);
  };

  const handleRevealNextStep = () => {
    if (revealedSteps < steps.length) {
      const newRevealed = revealedSteps + 1;
      setRevealedSteps(newRevealed);
      if (newRevealed === steps.length) {
        setCompleted(true);
        // Mark the containing Section complete, keyed by its resolved index.
        if (levelSlug && scope) {
          const idx = scope.getIndex();
          if (idx !== null) markSectionCompleted(levelSlug, idx);
          scope.markComplete();
        }
      }
    }
  };

  const handleReset = () => {
    setMagicWordsAdded(false);
    setRevealedSteps(0);
    setCompleted(false);
    setTimeout(() => {
      magicWordsButtonRef.current?.focus();
    }, 0);
  };

  const currentStatusText = useCallback((): string => {
    if (completed) {
      return `🎉 ${t("withMagic")} ${rightAnswer}`;
    }
    if (magicWordsAdded) {
      return `✨ ${t("magicWordsActive")} (${revealedSteps}/${steps.length}) ${t("nextStep")}`;
    }
    return `🧠 ${displayTitle}. ${t("addMagicWords")}`;
  }, [completed, magicWordsAdded, revealedSteps, steps.length, rightAnswer, t, displayTitle]);

  if (!isLoaded) return null;

  return (
    <div className="my-4 p-4 bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] border-4 border-[#3B82F6] rounded-xl">
      {/* Title */}
      <h3 className="text-xl font-bold text-[#1D4ED8] mb-4 flex items-center gap-2">
        🧠 {displayTitle}
      </h3>

      {/* Accessible live status announcer */}
      <div
        data-testid="step-by-step-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-base font-medium px-4 py-2 bg-white/95 border-2 border-blue-300 rounded-lg text-[#1D4ED8] mb-4"
      >
        {currentStatusText()}
      </div>

      {/* Problem */}
      <div className="bg-white/90 rounded-lg p-4 mb-4 border-2 border-[#3B82F6]">
        <div className="text-sm font-medium text-[#3B82F6] mb-2">{t("problem")}</div>
        <p className="text-lg font-medium text-[#2C1810] m-0">{problem}</p>
      </div>

      {/* Wrong answer (before magic words) */}
      {!magicWordsAdded && (
        <div className="bg-red-50 rounded-lg p-4 mb-4 border-2 border-red-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl" aria-hidden="true">😕</span>
            <span className="font-bold text-red-600">{t("withoutMagic")}</span>
          </div>
          <p className="text-[#5D4037] m-0">{wrongAnswer}</p>
        </div>
      )}

      {/* Magic words button */}
      <button
        ref={magicWordsButtonRef}
        type="button"
        onClick={handleAddMagicWords}
        aria-pressed={magicWordsAdded}
        aria-disabled={magicWordsAdded ? "true" : undefined}
        className={cn(
          "w-full min-h-[44px] p-4 mb-4 rounded-lg border-4 transition-all text-left active:scale-[0.99] motion-reduce:active:scale-100",
          "focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2",
          magicWordsAdded
            ? "border-[#8B5CF6] border-solid bg-purple-50 cursor-default"
            : "border-[#8B5CF6] border-dashed bg-purple-50 hover:bg-purple-100 cursor-pointer group"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">✨</span>
            <span className="text-lg font-bold text-[#7C3AED]">
              {magicWordsAdded ? t("magicWordsActive") : t("addMagicWords")}
            </span>
            <span className="text-2xl" aria-hidden="true">✨</span>
          </div>
          {magicWordsAdded && (
            <span className="text-xs font-bold text-purple-700 bg-purple-200/80 px-2 py-0.5 rounded border border-purple-300">
              ✓ {tActivity("selected")}
            </span>
          )}
        </div>
        <div className="text-[#8B5CF6] font-medium mt-1">&ldquo;{magicWords}&rdquo;</div>
      </button>

      {/* Steps revealed after magic words */}
      {magicWordsAdded && (
        <>
          {/* Steps */}
          <div className="space-y-2 mb-4">
            {steps.map((step, index) => {
              const isRevealed = index < revealedSteps;
              return (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all duration-300",
                    isRevealed
                      ? "bg-green-50 border-green-500 border-solid animate-in fade-in slide-in-from-left-4"
                      : "bg-gray-100 border-gray-300 border-dashed"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                      isRevealed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-500"
                    )}>
                      {isRevealed ? "✓" : index + 1}
                    </span>
                    <span className={cn(
                      "font-medium",
                      isRevealed ? "text-green-800" : "text-gray-400"
                    )}>
                      {isRevealed ? step : "???"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reveal next step button */}
          <button
            ref={nextStepButtonRef}
            type="button"
            onClick={handleRevealNextStep}
            aria-disabled={completed ? "true" : undefined}
            className={cn(
              "w-full min-h-[44px] p-3 rounded-lg font-bold text-white transition-all text-center",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2",
              completed
                ? "bg-emerald-600 border-2 border-emerald-700 cursor-default"
                : "bg-[#3B82F6] hover:bg-[#2563EB] cursor-pointer"
            )}
          >
            {completed
              ? `✓ ${tActivity("correct")}: ${t("withMagic")}`
              : `${t("nextStep")} (${revealedSteps + 1}/${steps.length})`}
          </button>

          {/* Correct answer revealed */}
          {completed && (
            <div className="mt-4 bg-green-100 rounded-lg p-4 border-2 border-green-500 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl" aria-hidden="true">🎉</span>
                <span className="font-bold text-green-700">{t("withMagic")}</span>
              </div>
              <p className="text-green-800 font-medium m-0">{rightAnswer}</p>
              {successMessage && (
                <p className="text-[#5D4037] mt-2 m-0">{successMessage}</p>
              )}
            </div>
          )}
        </>
      )}

      {/* Reset button */}
      {(magicWordsAdded || completed) && (
        <button
          ref={retryButtonRef}
          type="button"
          onClick={handleReset}
          className="mt-4 min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-lg font-bold bg-gray-600 hover:bg-gray-700 text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
}
