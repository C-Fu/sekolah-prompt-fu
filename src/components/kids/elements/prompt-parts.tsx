"use client";

import { useState, useEffect, useId, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionIdentity } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

type PartType = "role" | "task" | "context" | "constraint";

interface PromptPart {
  text: string;
  type: PartType;
}

interface PromptPartsProps {
  title?: string;
  instruction?: string;
  parts: PromptPart[];
  successMessage?: string;
}

interface SavedState {
  assignments: Record<number, PartType | null>;
  completed: boolean;
}

const partColors: Record<PartType, { bg: string; border: string; text: string; emoji: string }> = {
  role: { bg: "bg-purple-100", border: "border-purple-400", text: "text-purple-700", emoji: "🎭" },
  task: { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-700", emoji: "✏️" },
  context: { bg: "bg-green-100", border: "border-green-400", text: "text-green-700", emoji: "📖" },
  constraint: { bg: "bg-orange-100", border: "border-orange-400", text: "text-orange-700", emoji: "📏" },
};

export function PromptParts({ title, instruction, parts, successMessage }: PromptPartsProps) {
  const t = useTranslations("kids.promptParts");
  const tActivity = useTranslations("kids.activity");
  const levelSlug = useLevelSlug();
  const scope = useSectionIdentity();
  const componentId = useId();

  const partButtonsRef = useRef<Record<number, HTMLButtonElement | null>>({});
  const categoryButtonsRef = useRef<Record<PartType, HTMLButtonElement | null>>({
    role: null,
    task: null,
    context: null,
    constraint: null,
  });
  const retryButtonRef = useRef<HTMLButtonElement | null>(null);
  
  // Register that this Section has an interactive element requiring completion,
  // routed through the Section scope so it binds to the containing Section.
  useEffect(() => {
    scope?.registerRequirement(true);
  }, [scope]);
  
  const displayTitle = title || t("title");
  const displayInstruction = instruction || t("instruction");

  const [assignments, setAssignments] = useState<Record<number, PartType | null>>({});
  const [selectedPart, setSelectedPart] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state
  useEffect(() => {
    if (!levelSlug) {
      setIsLoaded(true);
      return;
    }
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved) {
      setAssignments(saved.assignments || {});
      setCompleted(saved.completed || false);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state
  useEffect(() => {
    if (!levelSlug || !isLoaded) return;
    saveComponentState<SavedState>(levelSlug, componentId, {
      assignments,
      completed,
    });
  }, [levelSlug, componentId, assignments, completed, isLoaded]);

  // Check if all parts are correctly assigned
  const checkCompletion = (newAssignments: Record<number, PartType | null>) => {
    const allAssigned = parts.every((_, index) => newAssignments[index] !== undefined && newAssignments[index] !== null);
    const allCorrect = parts.every((part, index) => newAssignments[index] === part.type);
    if (allAssigned && allCorrect) {
      setCompleted(true);
      // Mark the containing Section complete, keyed by its resolved index (never the
      // navigation cursor).
      if (levelSlug && scope) {
        const index = scope.getIndex();
        if (index !== null) markSectionCompleted(levelSlug, index);
        scope.markComplete();
      }
    }
  };

  const handlePartClick = (index: number) => {
    if (completed) return;
    setSelectedPart(selectedPart === index ? null : index);
  };

  const handleCategoryClick = (category: PartType) => {
    if (completed || selectedPart === null) return;
    
    const targetIndex = selectedPart;
    const newAssignments = { ...assignments, [targetIndex]: category };
    setAssignments(newAssignments);
    setSelectedPart(null);
    checkCompletion(newAssignments);
  };

  const handleReset = () => {
    setAssignments({});
    setCompleted(false);
    setSelectedPart(null);
    setTimeout(() => {
      partButtonsRef.current[0]?.focus();
    }, 0);
  };

  const getAssignmentStatus = (index: number): "correct" | "wrong" | null => {
    const assigned = assignments[index];
    if (assigned === undefined || assigned === null) return null;
    return assigned === parts[index].type ? "correct" : "wrong";
  };

  const score = parts.filter((part, index) => assignments[index] === part.type).length;

  const currentStatusText = useCallback((): string => {
    if (completed) {
      return `🎉 ${successMessage || t("success")}`;
    }
    if (selectedPart !== null) {
      const part = parts[selectedPart];
      return `${tActivity("selected")}: "${part?.text ?? ""}". ${t("pickCategory")}`;
    }
    const assignedCount = Object.keys(assignments).length;
    if (assignedCount > 0) {
      return `${t("score")}: ${score}/${parts.length}. ${displayInstruction}`;
    }
    return displayInstruction;
  }, [completed, successMessage, t, selectedPart, parts, tActivity, assignments, score, displayInstruction]);

  if (!isLoaded) return null;

  return (
    <div className="my-4 p-4 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] border-4 border-[#D97706] rounded-xl">
      {/* Title */}
      <h3 className="text-xl font-bold text-[#92400E] mb-2 flex items-center gap-2">
        🧩 {displayTitle}
      </h3>
      <p className="text-[#92400E] mb-4 m-0">{displayInstruction}</p>

      {/* Accessible live status announcer */}
      <div
        data-testid="prompt-parts-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-lg font-medium px-4 py-2 bg-yellow-50/90 border border-yellow-300 rounded-lg text-[#92400E] mb-4"
      >
        {currentStatusText()}
      </div>

      {/* Score */}
      <div className="mb-4 text-base font-bold text-[#92400E]">
        {t("score")}: {score}/{parts.length}
      </div>

      {/* Prompt pieces to categorize */}
      <div className="bg-white/80 rounded-lg p-4 mb-4 border-2 border-[#D97706]">
        <div className="flex flex-wrap gap-2">
          {parts.map((part, index) => {
            const status = getAssignmentStatus(index);
            const isSelected = selectedPart === index;
            const assigned = assignments[index];
            const colors = assigned ? partColors[assigned] : null;

            return (
              <button
                key={index}
                ref={(el) => { partButtonsRef.current[index] = el; }}
                type="button"
                onClick={() => handlePartClick(index)}
                aria-disabled={completed}
                aria-pressed={isSelected}
                className={cn(
                  "px-3 py-2 min-h-[44px] min-w-[44px] rounded-lg border-2 transition-all text-base font-medium inline-flex items-center gap-1.5",
                  !assigned && !isSelected && "bg-gray-100 border-gray-300 text-gray-700 hover:border-[#D97706] cursor-pointer",
                  !assigned && isSelected && "bg-yellow-100 border-[#D97706] text-[#92400E] ring-2 ring-[#D97706] scale-105 cursor-pointer",
                  assigned && colors && `${colors.bg} ${colors.border} ${colors.text} cursor-pointer`,
                  status === "correct" && "border-green-600 border-solid ring-2 ring-green-500",
                  status === "wrong" && "border-red-500 border-dashed ring-2 ring-red-400",
                  completed && "cursor-default"
                )}
              >
                {status === "correct" && <span className="font-bold text-green-700" aria-hidden="true">✓</span>}
                {status === "wrong" && <span className="font-bold text-red-700" aria-hidden="true">✗</span>}
                <span>{part.text}</span>
                {isSelected && (
                  <span aria-hidden="true" className="text-xs bg-yellow-200 border border-yellow-600 text-yellow-900 font-bold px-1.5 py-0.5 rounded ml-1">
                    ✓ {tActivity("selected")}
                  </span>
                )}
                {assigned && (
                  <span aria-hidden="true" className="text-xs bg-white/70 border border-current font-bold px-1.5 py-0.5 rounded ml-1">
                    {t(`types.${assigned}`)}
                  </span>
                )}
                {status === "correct" && (
                  <span aria-hidden="true" className="text-xs bg-green-200 border border-green-600 text-green-900 font-bold px-1.5 py-0.5 rounded ml-1">
                    {tActivity("correct")}
                  </span>
                )}
                {status === "wrong" && (
                  <span aria-hidden="true" className="text-xs bg-red-200 border border-red-500 text-red-900 font-bold px-1.5 py-0.5 rounded ml-1">
                    {tActivity("incorrect")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category buttons - stable native buttons that remain mounted to preserve keyboard focus */}
      <div data-testid="prompt-parts-categories" className="mb-4">
        <div className="text-sm font-medium text-[#92400E] mb-2">{t("pickCategory")}</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(partColors) as PartType[]).map((type) => {
            const colors = partColors[type];
            const isCategoryDisabled = completed || selectedPart === null;
            return (
              <button
                key={type}
                ref={(el) => { categoryButtonsRef.current[type] = el; }}
                type="button"
                onClick={() => handleCategoryClick(type)}
                aria-disabled={isCategoryDisabled}
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] min-w-[44px] rounded-lg border-2 font-bold transition-all",
                  colors.bg,
                  colors.border,
                  colors.text,
                  isCategoryDisabled
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:scale-105 cursor-pointer shadow-sm"
                )}
              >
                <span className="text-xl" aria-hidden="true">{colors.emoji}</span>
                <span>{t(`types.${type}`)}</span>
              </button>
            );
          })}
        </div>
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
      {(Object.keys(assignments).length > 0 || completed) && (
        <button
          ref={retryButtonRef}
          type="button"
          onClick={handleReset}
          className="px-6 py-2.5 min-h-[44px] min-w-[44px] rounded-lg font-bold bg-[#D97706] hover:bg-[#B45309] text-white cursor-pointer"
        >
          {t("retry")}
        </button>
      )}
    </div>
  );
}
