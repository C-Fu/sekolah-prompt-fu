"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionIdentity } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface Improvement {
  label: string;
  prompt: string;
  response: string;
}

interface PromptLabProps {
  title?: string;
  scenario: string;
  basePrompt: string;
  baseResponse: string;
  improvements: Improvement[];
  successMessage?: string;
}

interface SavedState {
  appliedImprovements: number[];
  completed: boolean;
}

export function PromptLab({
  title,
  scenario,
  basePrompt,
  baseResponse,
  improvements,
  successMessage,
}: PromptLabProps) {
  const t = useTranslations("kids.promptLab");
  const tActivity = useTranslations("kids.activity");
  const levelSlug = useLevelSlug();
  const scope = useSectionIdentity();
  const componentId = useId();
  
  const improvementButtonsRef = useRef<Record<number, HTMLButtonElement | null>>({});
  const retryButtonRef = useRef<HTMLButtonElement | null>(null);

  // Register that this Section has an interactive element requiring completion,
  // routed through the Section scope so it binds to the containing Section.
  useEffect(() => {
    scope?.registerRequirement(true);
  }, [scope]);
  
  const displayTitle = title || t("title");

  const [appliedImprovements, setAppliedImprovements] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state
  useEffect(() => {
    if (!levelSlug) {
      setIsLoaded(true);
      return;
    }
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && saved.appliedImprovements && Array.isArray(saved.appliedImprovements)) {
      setAppliedImprovements(saved.appliedImprovements);
      setCompleted(saved.completed || false);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state
  useEffect(() => {
    if (!levelSlug || !isLoaded) return;
    saveComponentState<SavedState>(levelSlug, componentId, {
      appliedImprovements,
      completed,
    });
  }, [levelSlug, componentId, appliedImprovements, completed, isLoaded]);

  const handleApplyImprovement = (index: number) => {
    if (appliedImprovements.includes(index) || completed) return;
    
    const newApplied = [...appliedImprovements, index];
    setAppliedImprovements(newApplied);
    
    if (newApplied.length === improvements.length) {
      setCompleted(true);
      // Mark the containing Section complete, keyed by its resolved index.
      if (levelSlug && scope) {
        const idx = scope.getIndex();
        if (idx !== null) markSectionCompleted(levelSlug, idx);
        scope.markComplete();
      }
    }
  };

  const handleReset = () => {
    setAppliedImprovements([]);
    setCompleted(false);
    setTimeout(() => {
      improvementButtonsRef.current[0]?.focus();
    }, 0);
  };

  // Get current prompt based on applied improvements
  const getCurrentPrompt = () => {
    if (appliedImprovements.length === 0) return basePrompt;
    // Return the prompt from the highest applied improvement
    const maxApplied = Math.max(...appliedImprovements);
    return improvements[maxApplied].prompt;
  };

  // Get current response based on improvements
  const getCurrentResponse = () => {
    if (appliedImprovements.length === 0) return baseResponse;
    // Return the response from the highest applied improvement
    const maxApplied = Math.max(...appliedImprovements);
    return improvements[maxApplied].response;
  };

  const progressPercentage = improvements.length > 0 ? (appliedImprovements.length / improvements.length) * 100 : 0;

  const currentStatusText = useCallback((): string => {
    if (completed) {
      return `🎉 ${successMessage || t("success")}`;
    }
    if (appliedImprovements.length > 0) {
      return `🔬 ${t("progress")}: ${appliedImprovements.length}/${improvements.length}. ${t("addDetails")}`;
    }
    return `🔬 ${displayTitle}. ${t("addDetails")}`;
  }, [completed, appliedImprovements.length, improvements.length, successMessage, t, displayTitle]);

  if (!isLoaded) return null;

  return (
    <div className="my-4 p-4 bg-gradient-to-br from-[#D1FAE5] to-[#A7F3D0] border-4 border-[#10B981] rounded-xl">
      {/* Title */}
      <h3 className="text-xl font-bold text-[#047857] mb-2 flex items-center gap-2">
        🔬 {displayTitle}
      </h3>
      <p className="text-[#5D4037] mb-4 m-0">{scenario}</p>

      {/* Accessible live status announcer */}
      <div
        data-testid="prompt-lab-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-base font-medium px-4 py-2 bg-white/95 border-2 border-emerald-300 rounded-lg text-[#047857] mb-4"
      >
        {currentStatusText()}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#047857]">{t("progress")}</span>
          <span className="text-sm font-medium text-[#047857]">{appliedImprovements.length}/{improvements.length}</span>
        </div>
        <div className="h-3 bg-green-200 rounded-full overflow-hidden border-2 border-[#10B981]">
          <div
            className="h-full bg-[#10B981] transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Current prompt */}
      <div className="bg-white/90 rounded-lg p-4 mb-4 border-2 border-[#10B981]">
        <div className="text-sm font-medium text-[#047857] mb-2">{t("yourPrompt")}</div>
        <p className="text-lg font-medium text-[#2C1810] m-0">
          &ldquo;{getCurrentPrompt()}&rdquo;
        </p>
      </div>

      {/* AI Response */}
      <div className={cn(
        "rounded-lg p-4 mb-4 border-2 transition-all duration-300",
        completed
          ? "bg-green-100 border-green-500"
          : "bg-gray-50 border-gray-300"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl" aria-hidden="true">🤖</span>
          <span className={cn(
            "font-medium text-sm",
            completed ? "text-green-700" : "text-gray-600"
          )}>
            {t("aiSays")}
          </span>
        </div>
        <p className="text-[#5D4037] m-0 italic">&ldquo;{getCurrentResponse()}&rdquo;</p>
      </div>

      {/* Improvement buttons */}
      <div className="space-y-2 mb-4">
        <div className="text-sm font-bold text-[#047857] mb-2">{t("addDetails")}</div>
        {improvements.map((improvement, index) => {
          const isApplied = appliedImprovements.includes(index);
          return (
            <button
              key={index}
              ref={(el) => {
                improvementButtonsRef.current[index] = el;
              }}
              type="button"
              onClick={() => handleApplyImprovement(index)}
              aria-pressed={isApplied}
              aria-disabled={isApplied || completed ? "true" : undefined}
              className={cn(
                "w-full min-h-[44px] p-3 rounded-lg border-2 text-left transition-all flex items-center justify-between gap-3",
                "focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2",
                isApplied
                  ? "bg-emerald-100 border-emerald-600 border-solid"
                  : "bg-white border-[#10B981] border-dashed hover:bg-emerald-50 cursor-pointer"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0" aria-hidden="true">{isApplied ? "✅" : "➕"}</span>
                <div className="font-bold text-base text-[#047857]">{improvement.label}</div>
              </div>
              {isApplied && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded border border-emerald-400 shrink-0">
                  ✓ {tActivity("correct")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Success message */}
      {completed && (
        <div className="p-4 bg-green-100 border-2 border-green-500 rounded-lg mb-4 animate-in fade-in zoom-in-95 duration-300">
          <p className="font-bold text-green-700 text-lg m-0">
            🎉 {successMessage || t("success")}
          </p>
        </div>
      )}

      {/* Reset button */}
      {(completed || appliedImprovements.length > 0) && (
        <button
          ref={retryButtonRef}
          type="button"
          onClick={handleReset}
          className="min-h-[44px] min-w-[44px] px-6 py-2.5 rounded-lg font-bold bg-[#047857] hover:bg-[#065F46] text-white cursor-pointer transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
}
