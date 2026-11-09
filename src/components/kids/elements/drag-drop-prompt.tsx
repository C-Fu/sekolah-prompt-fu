"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLevelSlug, useSectionIdentity } from "@/components/kids/providers/level-context";
import { getComponentState, saveComponentState, markSectionCompleted } from "@/lib/kids/progress";

interface DragDropPromptProps {
  title?: string;
  instruction?: string;
  pieces: string[];
  correctOrder: number[];
  successMessage?: string;
}

interface SavedState {
  currentOrder: number[];
  submitted: boolean;
  shuffledPieces: number[];
}

export function DragDropPrompt({
  title,
  instruction,
  pieces,
  correctOrder,
  successMessage,
}: DragDropPromptProps) {
  const t = useTranslations("kids.dragDrop");
  const tActivity = useTranslations("kids.activity");
  const levelSlug = useLevelSlug();
  const scope = useSectionIdentity();
  const componentId = useId();
  const displayTitle = title || t("title");
  const displayInstruction = instruction || t("instruction");
  
  // Register that this Section has an interactive element requiring completion.
  // Routed through the Section scope so the requirement attaches to the containing
  // Section even while it is offscreen.
  useEffect(() => {
    scope?.registerRequirement(true);
  }, [scope]);

  const [shuffledPieces, setShuffledPieces] = useState<number[]>([]);
  const [currentOrder, setCurrentOrder] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0); // Y offset for dragged item
  const [targetIndex, setTargetIndex] = useState<number | null>(null); // Where item will drop
  const dragStateRef = useRef<{ startY: number; draggedIndex: number } | null>(null);
  const targetIndexRef = useRef<number | null>(null); // Ref to access current target in event handlers
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = useRef(0);

  // Load saved state on mount
  useEffect(() => {
    const shuffle = () => {
      const indices = pieces.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      return indices;
    };

    if (!levelSlug) {
      const shuffled = shuffle();
      setShuffledPieces(shuffled);
      setCurrentOrder(shuffled);
      setIsLoaded(true);
      return;
    }
    
    const saved = getComponentState<SavedState>(levelSlug, componentId);
    if (saved && saved.shuffledPieces && saved.shuffledPieces.length > 0 && saved.currentOrder) {
      setShuffledPieces(saved.shuffledPieces);
      setCurrentOrder(saved.currentOrder);
      setSubmitted(saved.submitted || false);
    } else {
      const shuffled = shuffle();
      setShuffledPieces(shuffled);
      setCurrentOrder(shuffled);
    }
    setIsLoaded(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelSlug, componentId]);

  // Save state when it changes
  useEffect(() => {
    if (!levelSlug || !isLoaded || currentOrder.length === 0) return;
    
    saveComponentState<SavedState>(levelSlug, componentId, {
      currentOrder,
      submitted,
      shuffledPieces,
    });
  }, [levelSlug, componentId, currentOrder, submitted, shuffledPieces, isLoaded]);

  // Shared move operation for select-destination, arrows, and dragging
  const reorderPosition = useCallback((fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= currentOrder.length ||
      toIndex >= currentOrder.length
    ) {
      return;
    }

    setCurrentOrder((prev) => {
      const newOrder = [...prev];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);
      return newOrder;
    });
    setStatusMessage(tActivity("correctPlacement"));
    setSubmitted(false);
  }, [currentOrder.length, tActivity]);

  // Shared drag move handler for both touch and mouse
  const handleDragMove = useCallback((currentY: number) => {
    const state = dragStateRef.current;
    if (!state) return;
    
    const deltaY = currentY - state.startY;
    
    // Update drag offset for visual feedback
    setDragOffset(deltaY);
    
    // Calculate target position based on how far we've dragged
    const positionShift = Math.round(deltaY / (itemHeight.current || 56));
    const newTargetIndex = Math.max(0, Math.min(pieces.length - 1, state.draggedIndex + positionShift));
    setTargetIndex(newTargetIndex);
    targetIndexRef.current = newTargetIndex; // Keep ref in sync
  }, [pieces.length]);

  // Event listeners for drag movement (touch and mouse)
  useEffect(() => {
    const container = containerRef.current;
    if (!container || (submitted && isCorrect()) || !isLoaded) return;

    const onTouchMove = (e: TouchEvent) => {
      if (!dragStateRef.current) return;
      e.preventDefault();
      handleDragMove(e.touches[0].clientY);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragStateRef.current) return;
      e.preventDefault();
      handleDragMove(e.clientY);
    };

    container.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("mousemove", onMouseMove);
    
    return () => {
      container.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, [submitted, isLoaded, handleDragMove]);

  // Unified drag start handler for both touch and mouse
  const handlePointerStart = useCallback((position: number, clientY: number, element: HTMLDivElement | null) => {
    if ((submitted && isCorrect()) || !element) return;
    const rect = element.getBoundingClientRect();
    itemHeight.current = rect.height + 8; // height + gap
    setDraggedIndex(position);
    setTargetIndex(position);
    setDragOffset(0);
    dragStateRef.current = { startY: clientY, draggedIndex: position };
    targetIndexRef.current = position; // Initialize target ref
  }, [submitted]);

  // Listen for mouseup anywhere to end drag
  useEffect(() => {
    const onMouseUp = () => {
      const state = dragStateRef.current;
      const target = targetIndexRef.current;
      if (!state) return;
      
      // Apply the reorder if target changed
      if (target !== null && state.draggedIndex !== target) {
        reorderPosition(state.draggedIndex, target);
      }
      
      setDraggedIndex(null);
      setTargetIndex(null);
      setDragOffset(0);
      dragStateRef.current = null;
      targetIndexRef.current = null;
    };
    
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [reorderPosition]);

  const isCorrect = useCallback(() => {
    if (currentOrder.length !== correctOrder.length || currentOrder.length === 0) return false;
    return currentOrder.every((pieceIndex, position) => pieceIndex === correctOrder[position]);
  }, [currentOrder, correctOrder]);

  const correct = isCorrect();

  // Move piece up (swap with previous)
  const moveUp = (position: number) => {
    if (position === 0) return;
    reorderPosition(position, position - 1);
  };

  // Move piece down (swap with next)
  const moveDown = (position: number) => {
    if (position === currentOrder.length - 1) return;
    reorderPosition(position, position + 1);
  };

  // Unified drag end handler (for touch)
  const handlePointerEnd = () => {
    if (draggedIndex !== null && targetIndex !== null && draggedIndex !== targetIndex) {
      reorderPosition(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
    setTargetIndex(null);
    setDragOffset(0);
    dragStateRef.current = null;
  };

  // Native button piece selection
  const handlePieceClick = (pieceIndex: number) => {
    if (selectedPieceIndex === pieceIndex) {
      setSelectedPieceIndex(null);
      setStatusMessage(tActivity("itemDestinationPrompt"));
    } else {
      setSelectedPieceIndex(pieceIndex);
      setStatusMessage(`${tActivity("selected")}: ${pieces[pieceIndex]}`);
    }
  };

  // Native button destination position selection
  const handleDestinationClick = (destPos: number) => {
    if (selectedPieceIndex !== null) {
      const fromPos = currentOrder.indexOf(selectedPieceIndex);
      if (fromPos !== -1) {
        reorderPosition(fromPos, destPos);
      }
      setSelectedPieceIndex(null);
    } else {
      setStatusMessage(tActivity("itemDestinationPrompt"));
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Mark the containing Section complete only on the exact correct order, binding the
    // persisted and in-memory completion to its resolved Section index.
    if (isCorrect() && levelSlug && scope) {
      const index = scope.getIndex();
      if (index !== null) {
        markSectionCompleted(levelSlug, index);
        scope.markComplete();
      }
    }
  };

  const currentStatusText = () => {
    if (submitted) {
      if (correct) {
        return `🎉 ${successMessage || t("success")}`;
      } else {
        return t("almost");
      }
    }
    if (selectedPieceIndex !== null) {
      return `${tActivity("selected")}: ${pieces[selectedPieceIndex]}`;
    }
    return statusMessage || tActivity("itemDestinationPrompt");
  };

  // Don't render until loaded to prevent hydration mismatch
  if (!isLoaded) return null;

  return (
    <div className="my-4 p-4 pixel-panel">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <PixelPuzzleIcon />
        <span className="font-bold text-2xl text-[#2C1810]">{displayTitle}</span>
      </div>
      <p className="text-lg text-[#8B7355] mb-4 m-0">{displayInstruction}</p>

      {/* Accessible live status announcer */}
      <div
        data-testid="drag-drop-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="text-lg font-medium px-4 py-2 bg-[#FEF3C7] border border-[#D97706]/40 rounded-md text-[#2C1810] mb-4"
      >
        {currentStatusText()}
      </div>

      {/* Pieces with native destination buttons, piece select buttons, and up/down arrow controls */}
      <div ref={containerRef} className="space-y-2 mb-4">
        {currentOrder.map((pieceIndex, position) => {
          const isCorrectPiece = submitted && pieceIndex === correctOrder[position];
          const isWrongPiece = submitted && pieceIndex !== correctOrder[position];
          const isDragging = draggedIndex === position;
          const isSelected = selectedPieceIndex === pieceIndex;
          
          // Calculate transform for visual drag feedback
          let transform = "";
          if (draggedIndex !== null && targetIndex !== null) {
            if (isDragging) {
              transform = `translateY(${dragOffset}px) scale(1.02)`;
            } else if (draggedIndex < targetIndex) {
              if (position > draggedIndex && position <= targetIndex) {
                transform = `translateY(-${itemHeight.current}px)`;
              }
            } else if (draggedIndex > targetIndex) {
              if (position >= targetIndex && position < draggedIndex) {
                transform = `translateY(${itemHeight.current}px)`;
              }
            }
          }
          
          return (
            <div
              key={pieceIndex}
              data-testid={`drag-drop-row-${position}`}
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                e.preventDefault();
                handlePointerStart(position, e.clientY, e.currentTarget as HTMLDivElement);
              }}
              onTouchStart={(e) => {
                if ((e.target as HTMLElement).closest("button")) return;
                handlePointerStart(position, e.touches[0].clientY, e.currentTarget as HTMLDivElement);
              }}
              onTouchEnd={handlePointerEnd}
              className={cn(
                "flex items-center gap-2 p-2 border-2 select-none",
                (!submitted || !correct) && "bg-white border-[#D97706] hover:bg-[#FEF3C7]",
                isDragging && "z-10 shadow-lg border-[#3B82F6] bg-[#EFF6FF]",
                !isDragging && draggedIndex !== null && "transition-transform duration-150",
                isCorrectPiece && "bg-[#DCFCE7] border-[#16A34A]",
                isWrongPiece && "bg-[#FEE2E2] border-[#DC2626]",
                isSelected && "ring-2 ring-blue-500 border-blue-500"
              )}
              style={{ 
                clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)",
                transform: transform || undefined,
              }}
            >
              {/* Drag Grip Cue */}
              <div className="shrink-0 text-[#D97706] cursor-grab active:cursor-grabbing p-1 touch-none" aria-hidden="true">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Destination position button */}
              <button
                type="button"
                onClick={() => handleDestinationClick(position)}
                aria-label={t("position", { position: position + 1 })}
                title={t("position", { position: position + 1 })}
                className={cn(
                  "w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center font-bold rounded-md text-lg shrink-0 transition-all cursor-pointer",
                  selectedPieceIndex !== null
                    ? "bg-[#D97706] text-white hover:bg-[#B45309] ring-2 ring-[#D97706]/50"
                    : "bg-[#D97706] text-white"
                )}
              >
                {position + 1}
              </button>
              
              {/* Piece select button */}
              <button
                type="button"
                onClick={() => handlePieceClick(pieceIndex)}
                aria-pressed={isSelected}
                className={cn(
                  "flex-1 px-4 py-3 min-h-[44px] text-xl font-medium text-left border-2 rounded transition-all cursor-pointer",
                  isSelected
                    ? "bg-blue-50 border-blue-600 ring-2 ring-blue-500 font-bold"
                    : "bg-white border-amber-300 hover:border-amber-500 hover:bg-amber-50/50",
                  isCorrectPiece && "bg-[#DCFCE7] border-[#16A34A]",
                  isWrongPiece && "bg-[#FEE2E2] border-[#DC2626]"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#2C1810]">{pieces[pieceIndex]}</span>
                  {isSelected && (
                    <span className="text-xs bg-blue-600 text-white font-bold px-2 py-1 rounded shrink-0">
                      ✓ {tActivity("selected")}
                    </span>
                  )}
                </div>
              </button>
              
              {/* Up/Down arrows */}
              <div className="flex flex-col gap-1 shrink-0">
                {/* Up arrow */}
                <button
                  type="button"
                  onClick={() => moveUp(position)}
                  disabled={position === 0 || (submitted && correct)}
                  aria-label={t("moveUp")}
                  title={t("moveUp")}
                  className={cn(
                    "w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border-2 transition-all",
                    position === 0 || (submitted && correct)
                      ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed border-dashed"
                      : "bg-[#FEF3C7] border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white active:scale-95 cursor-pointer"
                  )}
                  style={{ clipPath: "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)" }}
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                
                {/* Down arrow */}
                <button
                  type="button"
                  onClick={() => moveDown(position)}
                  disabled={position === currentOrder.length - 1 || (submitted && correct)}
                  aria-label={t("moveDown")}
                  title={t("moveDown")}
                  className={cn(
                    "w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center border-2 transition-all",
                    position === currentOrder.length - 1 || (submitted && correct)
                      ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed border-dashed"
                      : "bg-[#FEF3C7] border-[#D97706] text-[#D97706] hover:bg-[#D97706] hover:text-white active:scale-95 cursor-pointer"
                  )}
                  style={{ clipPath: "polygon(2px 0, calc(100% - 2px) 0, 100% 2px, 100% calc(100% - 2px), calc(100% - 2px) 100%, 2px 100%, 0 calc(100% - 2px), 0 2px)" }}
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              
              {/* Status indicator */}
              {submitted && (
                <span className="w-8 h-8 flex items-center justify-center text-xl shrink-0" aria-hidden="true">
                  {isCorrectPiece ? "✓" : "✗"}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview */}
      <div 
        data-testid="drag-drop-result-preview" 
        className="bg-[#FEF3C7]/50 p-4 mb-4 border-2 border-[#D97706]/30" 
        style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
      >
        <span className="text-lg text-[#8B7355]">{t("result")}: </span>
        <span className="text-xl text-[#2C1810]">
          {currentOrder.map((i) => pieces[i]).join(" ")}
        </span>
      </div>

      {/* Result feedback banner */}
      {submitted && (
        <div 
          className={cn(
            "p-4 mt-4 mb-4 text-center",
            correct ? "bg-[#DCFCE7] border-2 border-[#16A34A]" : "bg-[#FEF3C7] border-2 border-[#D97706]"
          )}
          style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
        >
          {correct ? (
            <p className="font-bold text-xl m-0 text-[#16A34A]">🎉 {successMessage || t("success")}</p>
          ) : (
            <p className="font-bold text-lg m-0 text-[#D97706]">{t("almost")}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted || !correct ? (
          <button 
            type="button"
            onClick={handleSubmit} 
            className="px-6 py-3 min-h-[44px] bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-xl transition-colors cursor-pointer"
            style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}
          >
            {t("check")}
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-100 border-2 border-green-600 rounded-full text-green-800 font-bold text-lg">
            <span>✓ {successMessage || t("success")}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PixelPuzzleIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-5 h-5 inline-block text-[#3B82F6]" style={{ imageRendering: "pixelated" }}>
      <rect x="2" y="2" width="5" height="5" fill="currentColor" />
      <rect x="9" y="2" width="5" height="5" fill="currentColor" />
      <rect x="2" y="9" width="5" height="5" fill="currentColor" />
      <rect x="9" y="9" width="5" height="5" fill="currentColor" />
      <rect x="7" y="4" width="2" height="2" fill="currentColor" />
      <rect x="4" y="7" width="2" height="2" fill="currentColor" />
    </svg>
  );
}
