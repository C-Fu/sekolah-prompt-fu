"use client";

import { useState, useEffect, useId, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionIdentity } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface Example {
  input: string;
  output: string;
}

interface ExampleMatcherProps {
  title?: string;
  instruction?: string;
  examples: Example[];
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface SavedState {
  selectedAnswer: string | null;
  submitted: boolean;
}

export function ExampleMatcher({
  title,
  instruction,
  examples,
  question,
  options,
  correctAnswer,
  explanation,
}: ExampleMatcherProps) {
  const t = useTranslations("kids.exampleMatcher");
  const tActivity = useTranslations("kids.activity");
  const levelSlug = useLevelSlug();
  const scope = useSectionIdentity();
  const componentId = useId();

  const optionButtonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const retryButtonRef = useRef<HTMLButtonElement | null>(null);
  
  // Register that this Section has an interactive element requiring completion.
  // Registering through the Section scope keeps the requirement attached to the
  // containing Section even while it is offscreen (the Section stays mounted).
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
    if (saved) {
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
    // Mark the containing Section complete only on the correct answer, binding both the
    // persisted completion and the in-memory lock to the resolved Section index (never
    // the navigation cursor). Refuse writes before the identity resolves.
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
      if (isCorrect) return `🎉 ${t("correct")}`;
      return `🤔 ${t("tryAgain")}${explanation ? ` ${explanation}` : ""}`;
    }
    if (selectedAnswer) {
      return `${tActivity("selected")}: "${selectedAnswer}". ${t("check")}`;
    }
    return displayInstruction;
  }, [submitted, isCorrect, selectedAnswer, explanation, t, tActivity, displayInstruction]);

  if (!isLoaded) return null;

  return (
    <div className="my-4 p-4 bg-gradient-to-br from-[#E0E7FF] to-[#C7D2FE] border-4 border-[#6366F1] rounded-xl">
      {/* Title */}
      <h3 className="text-xl font-bold text-[#4338CA] mb-2 flex items-center gap-2">
        🧩 {displayTitle}
      </h3>
      <p className="text-[#5D4037] mb-4 m-0">{displayInstruction}</p>

      {/* Accessible live status announcer */}
      <div
        data-testid="example-matcher-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-lg font-medium px-4 py-2 bg-indigo-50/80 border border-indigo-200 rounded-md text-[#4338CA] mb-4"
      >
        {currentStatusText()}
      </div>

      {/* Examples Pattern */}
      <div className="bg-white/80 rounded-lg p-4 mb-4 border-2 border-[#6366F1]">
        <div className="text-sm font-medium text-[#4338CA] mb-2">{t("pattern")}</div>
        <div className="space-y-2">
          {examples.map((example, index) => (
            <div key={index} className="flex items-center gap-3 text-lg">
              <span className="px-3 py-1 bg-[#E0E7FF] rounded-lg font-medium">{example.input}</span>
              <span className="text-[#6366F1] font-bold">→</span>
              <span className="px-3 py-1 bg-[#C7D2FE] rounded-lg font-medium">{example.output}</span>
            </div>
          ))}
          {/* Question row */}
          <div className="flex items-center gap-3 text-lg pt-2 border-t-2 border-dashed border-[#6366F1]">
            <span className="px-3 py-1 bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-lg font-medium">
              {question}
            </span>
            <span className="text-[#6366F1] font-bold">→</span>
            <span className="px-3 py-1 bg-gray-100 rounded-lg font-medium text-gray-700">
              {submitted ? (isCorrect ? selectedAnswer : `${selectedAnswer} ✗`) : "???"}
            </span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {options.map((option) => {
          const isSelected = selectedAnswer === option;
          const showCorrect = submitted && option === correctAnswer;
          const showWrong = submitted && isSelected && !isCorrect;

          return (
            <button
              key={option}
              ref={(el) => { optionButtonsRef.current[option] = el; }}
              type="button"
              onClick={() => handleSelect(option)}
              aria-disabled={submitted}
              aria-pressed={isSelected}
              className={cn(
                "px-4 py-3 min-h-[44px] min-w-[44px] rounded-lg border-2 text-xl font-bold transition-all flex items-center justify-center gap-1.5",
                !submitted && !isSelected && "bg-white border-gray-300 hover:border-[#6366F1] hover:bg-[#E0E7FF] cursor-pointer",
                !submitted && isSelected && "bg-[#C7D2FE] border-[#6366F1] ring-2 ring-[#6366F1] scale-105 cursor-pointer",
                showCorrect && "bg-green-100 border-green-600 text-green-800 border-solid ring-2 ring-green-500",
                showWrong && "bg-red-100 border-red-500 text-red-800 border-dashed ring-2 ring-red-400",
                submitted && !showCorrect && !showWrong && "opacity-50 cursor-not-allowed",
                submitted && (showCorrect || showWrong) && "cursor-default"
              )}
            >
              {showCorrect && <span className="text-green-700" aria-hidden="true">✓</span>}
              {showWrong && <span className="text-red-700" aria-hidden="true">✗</span>}
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

      {/* Submit/Reset buttons */}
      <div data-testid="example-matcher-actions" className="flex gap-2 min-h-[48px] items-center">
        {!submitted ? (
          <button
            ref={submitButtonRef}
            type="button"
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            aria-disabled={!selectedAnswer}
            className={cn(
              "px-6 py-2.5 min-h-[44px] min-w-[44px] rounded-lg font-bold text-lg text-white transition-all",
              selectedAnswer
                ? "bg-[#6366F1] hover:bg-[#4F46E5] cursor-pointer shadow-sm"
                : "bg-gray-300 opacity-60 cursor-not-allowed"
            )}
          >
            {t("check")}
          </button>
        ) : !isCorrect ? (
          <button
            ref={retryButtonRef}
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 min-h-[44px] min-w-[44px] rounded-lg font-bold text-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white cursor-pointer shadow-sm"
          >
            {t("retry")}
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 border-2 border-green-600 rounded-lg text-green-800 font-bold text-lg min-h-[44px]">
            <span>✓ {tActivity("correct")}</span>
          </div>
        )}
      </div>

      {/* Result feedback */}
      {submitted && (
        <div className={cn(
          "mt-4 p-4 rounded-lg border-2 animate-in fade-in zoom-in-95 duration-300",
          isCorrect
            ? "bg-green-100 border-green-500"
            : "bg-amber-100 border-amber-500"
        )}>
          <p className={cn(
            "font-bold text-lg m-0",
            isCorrect ? "text-green-700" : "text-amber-700"
          )}>
            {isCorrect ? t("correct") : t("tryAgain")}
          </p>
          {explanation && (
            <p className="text-[#5D4037] mt-2 m-0">{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
