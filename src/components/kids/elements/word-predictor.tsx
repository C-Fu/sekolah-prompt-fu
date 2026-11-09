"use client";

import { useState, useEffect, useId, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionIdentity } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface WordPredictorProps {
  title?: string;
  instruction?: string;
  sentence: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  aiThinking?: string;
  successMessage?: string;
}

interface SavedState {
  selectedAnswer: string | null;
  submitted: boolean;
}

export function WordPredictor({
  title,
  instruction,
  sentence,
  options,
  correctAnswer,
  explanation,
  aiThinking,
  successMessage,
}: WordPredictorProps) {
  const t = useTranslations("kids.wordPredictor");
  const tActivity = useTranslations("kids.activity");
  const levelSlug = useLevelSlug();
  const scope = useSectionIdentity();
  const componentId = useId();

  const optionButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const retryButtonRef = useRef<HTMLButtonElement | null>(null);
  
  // Register that this Section has an interactive element requiring completion,
  // routed through the Section scope so it binds to the containing Section even while
  // offscreen (all Sections stay mounted).
  useEffect(() => {
    scope?.registerRequirement(true);
  }, [scope]);

  const displayTitle = title || t("title");
  const displayInstruction = instruction || t("instruction");

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved state
  useEffect(() => {
    if (!levelSlug) {
      setIsLoaded(true);
      return;
    }
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && typeof saved.submitted === "boolean") {
      setSelectedAnswer(saved.selectedAnswer);
      setSubmitted(saved.submitted);
    }
    setIsLoaded(true);
  }, [levelSlug, componentId]);

  // Save state
  useEffect(() => {
    if (!levelSlug || !isLoaded) return;
    saveComponentState<SavedState>(levelSlug, componentId, {
      selectedAnswer,
      submitted,
    });
  }, [levelSlug, componentId, selectedAnswer, submitted, isLoaded]);

  const isCorrect = selectedAnswer === correctAnswer;

  const handleSelect = (option: string) => {
    if (submitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    const wasCorrect = selectedAnswer === correctAnswer;
    setSubmitted(true);
    // Mark the containing Section complete only on the correct answer, keyed by its
    // resolved Section index (both persisted and in-memory), never the cursor.
    if (wasCorrect && levelSlug && scope) {
      const index = scope.getIndex();
      if (index !== null) markSectionCompleted(levelSlug, index);
      scope.markComplete();
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setTimeout(() => {
      submitButtonRef.current?.focus();
    }, 0);
  };

  // Keep focus stable on state transitions (D-12: keep focus at answer or stable equivalent)
  useEffect(() => {
    if (submitted) {
      if (!isCorrect) {
        retryButtonRef.current?.focus();
      } else if (selectedAnswer && optionButtonsRef.current[selectedAnswer]) {
        optionButtonsRef.current[selectedAnswer]?.focus();
      }
    }
  }, [submitted, isCorrect, selectedAnswer]);

  const currentStatusText = useCallback((): string => {
    if (submitted) {
      if (isCorrect) return `🎉 ${successMessage || t("correct")}`;
      return `🤔 ${t("tryAgain")} ${explanation}`;
    }
    if (selectedAnswer) {
      return `${tActivity("selected")}: "${selectedAnswer}". ${t("check")}`;
    }
    return displayInstruction;
  }, [submitted, isCorrect, successMessage, t, explanation, selectedAnswer, tActivity, displayInstruction]);

  if (!isLoaded) return null;

  // Render sentence with blank
  const renderSentence = () => {
    const parts = sentence.split("___");
    return (
      <span>
        {parts[0]}
        <span className={cn(
          "inline-block min-w-[80px] px-3 py-1 mx-1 rounded-lg border-2 text-center font-bold",
          !submitted && "bg-yellow-100 border-yellow-500 text-yellow-800 border-dashed",
          submitted && isCorrect && "bg-green-100 border-green-600 text-green-800 border-solid",
          submitted && !isCorrect && "bg-red-100 border-red-500 text-red-800 border-dashed"
        )}>
          {selectedAnswer || "???"}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div className="my-4 p-4 pixel-panel pixel-panel-indigo bg-indigo-50/95 border-4 border-[#6366F1] rounded-xl">
      {/* Title */}
      <h3 className="text-xl font-bold text-[#4338CA] mb-2 flex items-center gap-2">
        🧠 {displayTitle}
      </h3>
      <p className="text-[#5D4037] mb-4 m-0">{displayInstruction}</p>

      {/* Accessible live status announcer */}
      <div
        data-testid="word-predictor-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-lg font-medium px-4 py-2 bg-white border border-[#6366F1]/40 rounded-lg text-[#4338CA] mb-4"
      >
        {currentStatusText()}
      </div>

      {/* AI Brain visualization with fully opaque backing */}
      <div
        className="bg-white p-4 mb-4 border-2 border-[#6366F1]"
        style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl" aria-hidden="true">🤖</span>
          <span className="font-medium text-[#4338CA]">{t("aiThinks")}</span>
        </div>
        <p className="text-lg text-[#2C1810] m-0">
          {renderSentence()}
        </p>
      </div>

      {/* Thinking bubble with fully opaque backing */}
      {!submitted && (
        <div
          className="bg-[#F0F9FF] p-3 mb-4 border-2 border-[#0EA5E9] italic text-[#0369A1]"
          style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
        >
          💭 {aiThinking || t("thinkingDefault")}
        </div>
      )}

      {/* Options - native buttons sized >=44px */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const showCorrect = submitted && option === correctAnswer;
          const showWrong = submitted && isSelected && !isCorrect;

          return (
            <button
              key={index}
              ref={(el) => { optionButtonsRef.current[option] = el; }}
              type="button"
              onClick={() => handleSelect(option)}
              aria-disabled={submitted}
              aria-pressed={isSelected}
              className={cn(
                "p-3 min-h-[44px] min-w-[44px] border-2 font-bold text-lg transition-all flex items-center justify-center gap-1.5",
                !submitted && !isSelected && "bg-white border-[#6366F1] text-[#4338CA] hover:bg-indigo-50 cursor-pointer shadow-sm",
                !submitted && isSelected && "bg-indigo-100 border-[#4338CA] text-[#4338CA] ring-2 ring-[#4338CA] scale-105 cursor-pointer",
                showCorrect && "bg-green-100 border-green-600 text-green-800 border-solid ring-2 ring-green-500",
                showWrong && "bg-red-100 border-red-500 text-red-800 border-dashed ring-2 ring-red-400",
                submitted && !showCorrect && !showWrong && "opacity-50 cursor-not-allowed",
                submitted && (showCorrect || showWrong) && "cursor-default"
              )}
              style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
            >
              {showCorrect && <span className="text-green-700" aria-hidden="true">✓ </span>}
              {showWrong && <span className="text-red-700" aria-hidden="true">✗ </span>}
              <span>{option}</span>
              {!submitted && isSelected && (
                <span aria-hidden="true" className="text-xs bg-[#4338CA] text-white px-1.5 py-0.5 rounded font-bold ml-1">
                  ✓ {tActivity("selected")}
                </span>
              )}
              {showCorrect && (
                <span aria-hidden="true" className="text-xs bg-green-200 border border-green-600 text-green-900 px-1.5 py-0.5 rounded font-bold ml-1">
                  {tActivity("correct")}
                </span>
              )}
              {showWrong && (
                <span aria-hidden="true" className="text-xs bg-red-200 border border-red-500 text-red-900 px-1.5 py-0.5 rounded font-bold ml-1">
                  {tActivity("incorrect")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Submit / Reset Actions - min 44px hitboxes */}
      <div data-testid="word-predictor-actions" className="flex gap-2 min-h-[48px] items-center mb-4">
        {!submitted ? (
          <button
            ref={submitButtonRef}
            type="button"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            aria-disabled={!selectedAnswer}
            className={cn(
              "w-full py-3 min-h-[44px] min-w-[44px] font-bold text-lg transition-all",
              selectedAnswer
                ? "bg-[#6366F1] hover:bg-[#4F46E5] text-white cursor-pointer shadow-sm"
                : "bg-gray-200 text-gray-400 opacity-60 cursor-not-allowed"
            )}
            style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
          >
            {t("check")}
          </button>
        ) : !isCorrect ? (
          <button
            ref={retryButtonRef}
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 min-h-[44px] min-w-[44px] font-bold text-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white cursor-pointer shadow-sm"
            style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
          >
            {t("retry")}
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 border-2 border-green-600 rounded text-green-800 font-bold text-lg min-h-[44px]">
            <span>✓ {tActivity("correct")}</span>
          </div>
        )}
      </div>

      {/* Result feedback with fully opaque backing */}
      {submitted && (
        <div 
          className={cn(
            "p-4 border-2 mb-4 animate-in fade-in zoom-in-95 duration-300",
            isCorrect ? "bg-green-100 border-green-600" : "bg-orange-100 border-orange-500"
          )}
          style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
        >
          <p className={cn(
            "font-bold text-lg mb-2 m-0",
            isCorrect ? "text-green-800" : "text-orange-800"
          )}>
            {isCorrect ? `🎉 ${successMessage || t("correct")}` : `🤔 ${t("tryAgain")}`}
          </p>
          <p className="text-[#2C1810] m-0">{explanation}</p>
        </div>
      )}
    </div>
  );
}
