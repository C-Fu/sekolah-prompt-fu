"use client";

import { useState, useCallback, useEffect, useId } from "react";
import { useTranslations } from "next-intl";
import { Check, RefreshCw, Sparkles, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionIdentity } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface BlankConfig {
  id?: string;
  hint: string;
  answers: string[]; // Words to choose from (all are correct)
  emoji?: string;
}

interface MagicWordsProps {
  title?: string;
  sentence: string; // Use _ for blanks
  blanks: BlankConfig[];
  successMessage?: string;
}

interface AvailableWord {
  word: string;
  blankId: string;
}

interface SavedState {
  placements: Record<string, string>;
  submitted: boolean;
  availableWords: AvailableWord[];
  placedIndices?: Record<string, number>;
}

export function MagicWords({
  title,
  sentence,
  blanks,
  successMessage,
}: MagicWordsProps) {
  const t = useTranslations("kids.magicWords");
  const tActivity = useTranslations("kids.activity");
  const levelSlug = useLevelSlug();
  const scope = useSectionIdentity();
  const componentId = useId();
  const displayTitle = title || t("title");
  
  // Register that this Section has an interactive element requiring completion.
  // Routed through the Section scope so the requirement attaches to the containing
  // Section even while it is offscreen.
  useEffect(() => {
    scope?.registerRequirement(true);
  }, [scope]);
  
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [placedIndices, setPlacedIndices] = useState<Record<string, number>>({});
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [draggedWordIndex, setDraggedWordIndex] = useState<number | null>(null);
  const [availableWords, setAvailableWords] = useState<AvailableWord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Generate IDs for blanks if not provided
  const blanksWithIds = blanks.map((blank, index) => ({
    ...blank,
    id: blank.id || `blank-${index}`,
  }));

  // Load saved state on mount
  useEffect(() => {
    const shuffleWords = () => {
      const words = blanksWithIds.flatMap((blank) => 
        blank.answers.map((answer) => ({ word: answer, blankId: blank.id! }))
      );
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
      return words;
    };

    if (!levelSlug) {
      setPlacements({});
      setPlacedIndices({});
      setAvailableWords(shuffleWords());
      setIsLoaded(true);
      return;
    }
    
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && saved.placements && saved.availableWords && saved.availableWords.length > 0) {
      setPlacements(saved.placements);
      setSubmitted(saved.submitted || false);
      setAvailableWords(saved.availableWords);

      // Reconstruct placedIndices from saved placements and availableWords
      if (saved.placedIndices && Object.keys(saved.placedIndices).length > 0) {
        setPlacedIndices(saved.placedIndices);
      } else {
        const restoredIndices: Record<string, number> = {};
        const usedIndices = new Set<number>();
        for (const [blankId, word] of Object.entries(saved.placements)) {
          const matchIdx = saved.availableWords.findIndex(
            (item, idx) => !usedIndices.has(idx) && item.word.toLowerCase() === word.toLowerCase()
          );
          if (matchIdx !== -1) {
            restoredIndices[blankId] = matchIdx;
            usedIndices.add(matchIdx);
          }
        }
        setPlacedIndices(restoredIndices);
      }
    } else {
      setPlacements({});
      setPlacedIndices({});
      setAvailableWords(shuffleWords());
    }
    setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSlug, componentId]);

  // Save state when it changes
  useEffect(() => {
    if (!levelSlug || !isLoaded || availableWords.length === 0) return;
    
    saveComponentState<SavedState>(levelSlug, componentId, {
      placements,
      submitted,
      availableWords,
      placedIndices,
    });
  }, [levelSlug, componentId, placements, submitted, availableWords, placedIndices, isLoaded]);

  const checkAnswer = useCallback((blankId: string, value: string): boolean => {
    const blank = blanksWithIds.find((b) => b.id === blankId);
    if (!blank) return false;
    return blank.answers.some((answer) => answer.toLowerCase() === value.toLowerCase());
  }, [blanksWithIds]);

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) return null;

  const allCorrect = submitted && blanksWithIds.every((blank) => checkAnswer(blank.id, placements[blank.id] || ""));
  const score = blanksWithIds.filter((blank) => checkAnswer(blank.id, placements[blank.id] || "")).length;

  const isWordUsed = (index: number) => {
    return Object.values(placedIndices).includes(index);
  };

  const handleWordClick = (index: number) => {
    if (submitted || isWordUsed(index)) return;

    if (selectedWordIndex === index) {
      setSelectedWordIndex(null);
      setStatusMessage(tActivity("itemDestinationPrompt"));
    } else {
      setSelectedWordIndex(index);
      setStatusMessage(`${tActivity("selected")}: ${availableWords[index].word}`);
    }
  };

  const handleBlankClick = (blankId: string) => {
    if (submitted) return;

    const targetBlank = blanksWithIds.find((b) => b.id === blankId);
    if (!targetBlank) return;

    // Case 1: A word is selected
    if (selectedWordIndex !== null) {
      const selectedItem = availableWords[selectedWordIndex];
      if (!selectedItem) return;

      const isValid = targetBlank.answers.some(
        (answer) => answer.toLowerCase() === selectedItem.word.toLowerCase()
      );

      if (isValid) {
        // Correct placement
        const newPlacedIndices = { ...placedIndices };
        const prevIndex = placedIndices[blankId];
        if (prevIndex !== undefined) {
          delete newPlacedIndices[blankId];
        }
        newPlacedIndices[blankId] = selectedWordIndex;
        setPlacedIndices(newPlacedIndices);

        const newPlacements = { ...placements, [blankId]: selectedItem.word };
        setPlacements(newPlacements);

        setSelectedWordIndex(null);
        setStatusMessage(tActivity("correctPlacement"));
      } else {
        // Wrong placement - retain selected item, keep earlier placements intact
        setStatusMessage(tActivity("wrongPlacement"));
      }
      return;
    }

    // Case 2: No word is selected, but blank already has a placed word
    if (placements[blankId]) {
      const newPlacements = { ...placements };
      delete newPlacements[blankId];
      setPlacements(newPlacements);

      const newPlacedIndices = { ...placedIndices };
      delete newPlacedIndices[blankId];
      setPlacedIndices(newPlacedIndices);

      setStatusMessage(tActivity("itemDestinationPrompt"));
    }
  };

  const handleDragStart = (index: number) => {
    if (submitted || isWordUsed(index)) return;
    setDraggedWordIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedWordIndex(null);
  };

  const handleDrop = (blankId: string) => {
    if (submitted || draggedWordIndex === null) return;

    const targetBlank = blanksWithIds.find((b) => b.id === blankId);
    if (!targetBlank) return;

    const draggedItem = availableWords[draggedWordIndex];
    if (!draggedItem) return;

    const isValid = targetBlank.answers.some(
      (answer) => answer.toLowerCase() === draggedItem.word.toLowerCase()
    );

    if (isValid) {
      const newPlacedIndices = { ...placedIndices };
      const prevIndex = placedIndices[blankId];
      if (prevIndex !== undefined) {
        delete newPlacedIndices[blankId];
      }
      newPlacedIndices[blankId] = draggedWordIndex;
      setPlacedIndices(newPlacedIndices);

      const newPlacements = { ...placements, [blankId]: draggedItem.word };
      setPlacements(newPlacements);

      setSelectedWordIndex(null);
      setStatusMessage(tActivity("correctPlacement"));
    } else {
      setStatusMessage(tActivity("wrongPlacement"));
    }

    setDraggedWordIndex(null);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Guard exact correctness: require all blanks to be non-empty and correct before completing section
    const areAllBlanksCorrect =
      blanksWithIds.length > 0 &&
      blanksWithIds.every((blank) =>
        Boolean(placements[blank.id]) && checkAnswer(blank.id, placements[blank.id] || "")
      );
    if (areAllBlanksCorrect && levelSlug && scope) {
      const index = scope.getIndex();
      if (index !== null) {
        markSectionCompleted(levelSlug, index);
        scope.markComplete();
      }
    }
  };

  const handleReset = () => {
    setPlacements({});
    setPlacedIndices({});
    setSelectedWordIndex(null);
    setSubmitted(false);
    setStatusMessage(tActivity("itemDestinationPrompt"));
  };

  const currentStatusText = () => {
    if (submitted) {
      if (allCorrect) {
        return `🎉 ${successMessage || tActivity("correctPlacement")}`;
      } else {
        return `${score} / ${blanksWithIds.length} ${t("correct")}! ${t("tryAgain")}`;
      }
    }
    return statusMessage || tActivity("itemDestinationPrompt");
  };

  // Parse sentence and render with native button drop zones
  const renderSentence = () => {
    const parts = sentence.split(/(_+|\{\{[^}]+\}\})/g);
    let blankIndex = 0;

    return parts.map((part, index) => {
      if (/^_+$/.test(part) || /^\{\{[^}]+\}\}$/.test(part)) {
        const blank = blanksWithIds[blankIndex];
        if (!blank) return <span key={index}>{part}</span>;
        
        const blankId = blank.id;
        const placedWord = placements[blankId];
        const isCorrect = submitted && checkAnswer(blankId, placedWord || "");
        const isWrong = submitted && !isCorrect;

        blankIndex++;

        return (
          <span key={index} className="inline-flex items-center gap-1 mx-1 my-1">
            <button
              type="button"
              onClick={() => handleBlankClick(blankId)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(blankId)}
              aria-label={placedWord ? `${blank.hint}: ${placedWord}` : blank.hint}
              className={cn(
                "px-3 py-2 border-2 rounded-lg min-w-[100px] min-h-[44px] text-xl text-center font-medium transition-all text-[#2C1810]",
                !placedWord && "bg-white border-purple-400 border-dashed hover:border-purple-600 cursor-pointer",
                placedWord && !submitted && "bg-purple-100 border-purple-500 border-solid cursor-pointer",
                isCorrect && "border-green-500 border-solid bg-green-50",
                isWrong && "border-red-400 border-solid bg-red-50",
                selectedWordIndex !== null && !placedWord && "border-purple-600 ring-2 ring-purple-300"
              )}
              title={blank.hint}
            >
              {placedWord || blank.hint}
            </button>
            {submitted && isCorrect && <Check className="h-6 w-6 text-green-500" />}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="my-4 pixel-panel pixel-panel-purple overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          <span className="font-bold text-2xl text-[#2C1810]">{displayTitle}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Sentence with blanks */}
        <div className="text-xl leading-relaxed p-4 bg-purple-50 flex flex-wrap items-center text-[#2C1810]" style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}>
          {renderSentence()}
        </div>

        {/* Word bank */}
        <div data-testid="magic-words-word-bank" className="p-4 bg-purple-100" style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}>
          <p className="text-lg font-medium text-purple-700 mb-3 m-0">
            {t("dragOrTap")}
          </p>
          <div className="flex flex-wrap gap-2">
            {availableWords.map(({ word, blankId: origBlankId }, index) => {
              const isUsed = isWordUsed(index);
              const isSelected = selectedWordIndex === index;
              return (
                <button
                  key={`${origBlankId}-${index}`}
                  type="button"
                  draggable={!submitted && !isUsed}
                  onDragStart={() => handleDragStart(index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleWordClick(index)}
                  disabled={submitted || isUsed}
                  aria-pressed={isSelected}
                  aria-disabled={submitted || isUsed}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 border-2 min-h-[44px] text-xl font-medium transition-all text-[#2C1810]",
                    !isUsed && !submitted && !isSelected && "bg-white border-purple-300 hover:border-purple-500 hover:shadow-md cursor-pointer",
                    isSelected && "bg-purple-100 border-purple-600 ring-2 ring-purple-500 font-bold shadow-sm",
                    isUsed && "bg-gray-100 border-gray-400 text-gray-500 opacity-60 cursor-not-allowed border-dashed",
                    submitted && "cursor-default"
                  )}
                  style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
                >
                  {!submitted && !isUsed && <GripVertical className="h-5 w-5 text-purple-400 shrink-0" />}
                  {isUsed && <Check className="h-5 w-5 text-gray-500 shrink-0" />}
                  <span>{word}</span>
                  {isSelected && (
                    <span className="text-xs bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded ml-1">
                      ✓ {tActivity("selected")}
                    </span>
                  )}
                  {isUsed && (
                    <span className="text-xs bg-gray-200 border border-gray-400 text-gray-700 font-bold px-1.5 py-0.5 rounded ml-1">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accessible live status */}
        <div
          data-testid="magic-words-status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-lg font-medium px-4 py-2 bg-purple-50/80 border border-purple-200 rounded-md text-[#2C1810]"
        >
          {currentStatusText()}
        </div>

        {/* Result banner if submitted */}
        {submitted && (
          <div
            className={cn(
              "p-4 text-center",
              allCorrect
                ? "bg-green-100 border-2 border-green-300"
                : "bg-amber-100 border-2 border-amber-300"
            )}
            style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
          >
            {allCorrect ? (
              <p className="font-bold text-xl m-0 text-green-800">🎉 {successMessage || "Amazing!"}</p>
            ) : (
              <p className="font-bold text-lg m-0 text-amber-800">
                {score} / {blanksWithIds.length} {t("correct")}! {t("tryAgain")}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 min-h-[48px] items-center" data-testid="magic-words-actions">
          {!submitted ? (
            <Button 
              onClick={handleSubmit} 
              className="rounded-full h-12 text-xl px-6 font-bold"
              disabled={Object.keys(placements).length < blanksWithIds.length}
            >
              <Check className="h-5 w-5 mr-2" />
              {t("check")}
            </Button>
          ) : !allCorrect ? (
            <Button onClick={handleReset} variant="outline" className="rounded-full h-12 text-xl px-6 font-bold">
              <RefreshCw className="h-5 w-5 mr-2" />
              {t("retry")}
            </Button>
          ) : (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 border-2 border-green-600 rounded-full text-green-800 font-bold text-lg">
              <Check className="h-5 w-5 text-green-700" />
              <span>{tActivity("correctPlacement")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
