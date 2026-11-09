import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, within } from "@testing-library/react";
import enMessages from "@/../messages/en.json";
import msMessages from "@/../messages/ms.json";
import { DragDropPrompt } from "@/components/kids/elements/drag-drop-prompt";
import { LevelProvider, SectionScopeContext, type SectionScopeValue } from "@/components/kids/providers/level-context";
import * as progressModule from "@/lib/kids/progress";

// Mutable locale for testing bilingual copy
const intlState = vi.hoisted(() => ({
  locale: "en",
}));

vi.mock("next-intl", () => ({
  useLocale: () => intlState.locale,
  useTranslations: (namespace?: string) => {
    const messages = (intlState.locale === "ms" ? msMessages : enMessages) as Record<string, unknown>;
    return (key: string, values?: Record<string, unknown>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const keys = fullKey.split(".");
      let val: unknown = messages;
      for (const k of keys) {
        if (val && typeof val === "object") {
          val = (val as Record<string, unknown>)[k];
        } else {
          val = undefined;
          break;
        }
      }
      if (typeof val === "string") {
        if (values) {
          return Object.entries(values).reduce(
            (acc, [vKey, vVal]) => acc.replace(`{${vKey}}`, String(vVal)),
            val
          );
        }
        return val;
      }
      return key;
    };
  },
}));

describe("DragDropPrompt (Phase 15-05)", () => {
  beforeEach(() => {
    intlState.locale = "en";
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  function renderWithProviders(
    ui: React.ReactElement,
    options?: {
      levelSlug?: string;
      scopeValue?: Partial<SectionScopeValue>;
    }
  ) {
    const mockScope: SectionScopeValue = {
      identity: { id: "test-drag-drop-section" },
      registerRequirement: vi.fn(),
      markComplete: vi.fn(() => true),
      isComplete: vi.fn(() => false),
      requiresCompletion: vi.fn(() => true),
      index: 1,
      getIndex: vi.fn(() => 1),
      ...options?.scopeValue,
    };

    return {
      ...render(
        <LevelProvider levelSlug={options?.levelSlug || "test-level"}>
          <SectionScopeContext.Provider value={mockScope}>
            {ui}
          </SectionScopeContext.Provider>
        </LevelProvider>
      ),
      mockScope,
    };
  }

  it("renders piece items and destination-position buttons as native buttons with >=44x44 CSS px hitboxes", () => {
    renderWithProviders(
      <DragDropPrompt
        pieces={["First step", "Second step", "Third step"]}
        correctOrder={[0, 1, 2]}
      />
    );

    // Destination-position buttons for positions 1, 2, 3
    const pos1 = screen.getByRole("button", { name: /position 1/i });
    const pos2 = screen.getByRole("button", { name: /position 2/i });
    const pos3 = screen.getByRole("button", { name: /position 3/i });

    expect(pos1).toBeInTheDocument();
    expect(pos1.tagName).toBe("BUTTON");
    expect(pos1.className).toMatch(/min-w-\[44px\]/);
    expect(pos1.className).toMatch(/min-h-\[44px\]/);

    expect(pos2).toBeInTheDocument();
    expect(pos3).toBeInTheDocument();

    // Piece items as native buttons
    const piece1 = screen.getByRole("button", { name: /first step/i });
    const piece2 = screen.getByRole("button", { name: /second step/i });
    const piece3 = screen.getByRole("button", { name: /third step/i });

    expect(piece1).toBeInTheDocument();
    expect(piece1.tagName).toBe("BUTTON");
    expect(piece1.className).toMatch(/min-h-\[44px\]/);

    expect(piece2).toBeInTheDocument();
    expect(piece3).toBeInTheDocument();

    // Up and Down move buttons with localized names and >=44x44 CSS px hitboxes
    const moveUpButtons = screen.getAllByRole("button", { name: /move up/i });
    const moveDownButtons = screen.getAllByRole("button", { name: /move down/i });

    expect(moveUpButtons).toHaveLength(3);
    expect(moveDownButtons).toHaveLength(3);

    expect(moveUpButtons[0].className).toMatch(/min-w-\[44px\]/);
    expect(moveUpButtons[0].className).toMatch(/min-h-\[44px\]/);
    expect(moveDownButtons[0].className).toMatch(/min-w-\[44px\]/);
    expect(moveDownButtons[0].className).toMatch(/min-h-\[44px\]/);
  });

  it("renders visible persistent role=status live region with initial prompt", () => {
    renderWithProviders(
      <DragDropPrompt
        pieces={["A", "B", "C"]}
        correctOrder={[0, 1, 2]}
      />
    );

    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Choose an item, then choose a place.");
  });

  it("selects a piece via keyboard or click, exposing aria-pressed and multimodal Selected indicator", () => {
    renderWithProviders(
      <DragDropPrompt
        pieces={["Act as a teacher", "Explain gravity", "Keep it simple"]}
        correctOrder={[0, 1, 2]}
      />
    );

    const piece = screen.getByRole("button", { name: /act as a teacher/i });
    expect(piece).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(piece);
    expect(piece).toHaveAttribute("aria-pressed", "true");
    expect(piece).toHaveTextContent(/selected/i);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/act as a teacher/i);
  });

  it("reorders pieces via select-item-then-select-destination by index identity", () => {
    // Initial state: pieces are shuffled or ordered. Let's provide mock component state
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [2, 0, 1], // Piece 2 is at position 0, Piece 0 is at position 1, Piece 1 is at position 2
      shuffledPieces: [2, 0, 1],
      submitted: false,
    });

    renderWithProviders(
      <DragDropPrompt
        pieces={["First", "Second", "Third"]}
        correctOrder={[0, 1, 2]}
      />,
      { levelSlug: "level-1" }
    );

    // Initial order: Third (index 2) is at Position 1 (pos 0)
    // First (index 0) is at Position 2 (pos 1)
    // Second (index 1) is at Position 3 (pos 2)
    const preview = screen.getByTestId("drag-drop-result-preview");
    expect(preview).toHaveTextContent("Third First Second");

    // Select "Third" (currently at position 0)
    const thirdPiece = screen.getByRole("button", { name: /third/i });
    fireEvent.click(thirdPiece);
    expect(thirdPiece).toHaveAttribute("aria-pressed", "true");

    // Click destination position 3 (index 2) to move "Third" to position 3
    const pos3Btn = screen.getByRole("button", { name: /position 3/i });
    fireEvent.click(pos3Btn);

    // After moving Third to position 3: order should be First Second Third ([0, 1, 2])
    expect(preview).toHaveTextContent("First Second Third");
    expect(screen.getByRole("status")).toHaveTextContent("Correct! Item placed.");
  });

  it("handles identical piece text without conflating piece index identity", () => {
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [2, 0, 1],
      shuffledPieces: [2, 0, 1],
      submitted: false,
    });

    renderWithProviders(
      <DragDropPrompt
        pieces={["Repeat", "Repeat", "Repeat"]}
        correctOrder={[0, 1, 2]}
      />,
      { levelSlug: "level-1" }
    );

    const pieceButtons = screen.getAllByRole("button", { name: /repeat/i });
    expect(pieceButtons).toHaveLength(3);

    // Select the first piece button in view (which corresponds to piece index 2 at position 0)
    fireEvent.click(pieceButtons[0]);
    expect(pieceButtons[0]).toHaveAttribute("aria-pressed", "true");
    expect(pieceButtons[1]).toHaveAttribute("aria-pressed", "false");
    expect(pieceButtons[2]).toHaveAttribute("aria-pressed", "false");

    // Move it to position 2
    const pos2Btn = screen.getByRole("button", { name: /position 2/i });
    fireEvent.click(pos2Btn);

    // Piece buttons must remain 3 distinct items
    const updatedButtons = screen.getAllByRole("button", { name: /repeat/i });
    expect(updatedButtons).toHaveLength(3);
  });

  it("moves pieces via Up and Down arrow buttons, with terminal positions disabled", () => {
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [0, 1, 2],
      shuffledPieces: [0, 1, 2],
      submitted: false,
    });

    renderWithProviders(
      <DragDropPrompt
        pieces={["Piece A", "Piece B", "Piece C"]}
        correctOrder={[0, 1, 2]}
      />,
      { levelSlug: "level-1" }
    );

    const moveUpButtons = screen.getAllByRole("button", { name: /move up/i });
    const moveDownButtons = screen.getAllByRole("button", { name: /move down/i });

    // Terminal positions:
    // Position 0 Up button is disabled
    expect(moveUpButtons[0]).toBeDisabled();
    // Position 0 Down button is enabled
    expect(moveDownButtons[0]).toBeEnabled();

    // Position 2 Down button is disabled (last position)
    expect(moveDownButtons[2]).toBeDisabled();
    // Position 2 Up button is enabled
    expect(moveUpButtons[2]).toBeEnabled();

    // Position 1 (middle): both enabled
    expect(moveUpButtons[1]).toBeEnabled();
    expect(moveDownButtons[1]).toBeEnabled();

    // Click Down on Position 0 (Piece A moves to Position 1, swapping with Piece B)
    fireEvent.click(moveDownButtons[0]);

    const preview = screen.getByTestId("drag-drop-result-preview");
    expect(preview).toHaveTextContent("Piece B Piece A Piece C");
  });

  it("supports interrupted selection: switching pieces or deselecting cleanly updates state and announcements", () => {
    renderWithProviders(
      <DragDropPrompt
        pieces={["Alpha", "Beta", "Gamma"]}
        correctOrder={[0, 1, 2]}
      />
    );

    const alpha = screen.getByRole("button", { name: /alpha/i });
    const beta = screen.getByRole("button", { name: /beta/i });

    // Select Alpha
    fireEvent.click(alpha);
    expect(alpha).toHaveAttribute("aria-pressed", "true");
    expect(beta).toHaveAttribute("aria-pressed", "false");

    // Click Alpha again to deselect
    fireEvent.click(alpha);
    expect(alpha).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("Choose an item, then choose a place.");

    // Select Alpha, then switch directly to Beta
    fireEvent.click(alpha);
    expect(alpha).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(beta);
    expect(alpha).toHaveAttribute("aria-pressed", "false");
    expect(beta).toHaveAttribute("aria-pressed", "true");
  });

  it("guards against drag-interruption: interrupted drag leaves order intact without duplicating pieces", () => {
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [0, 1, 2],
      shuffledPieces: [0, 1, 2],
      submitted: false,
    });

    renderWithProviders(
      <DragDropPrompt
        pieces={["P1", "P2", "P3"]}
        correctOrder={[0, 1, 2]}
      />,
      { levelSlug: "level-1" }
    );

    const rows = screen.getAllByTestId(/drag-drop-row-/);
    expect(rows).toHaveLength(3);

    // Start drag on row 0
    fireEvent.touchStart(rows[0], { touches: [{ clientY: 100 }] });
    // End touch without movement
    fireEvent.touchEnd(rows[0]);

    const preview = screen.getByTestId("drag-drop-result-preview");
    expect(preview).toHaveTextContent("P1 P2 P3");
  });

  it("localizes status, button labels, and selection indicators in Bahasa Melayu", () => {
    intlState.locale = "ms";

    renderWithProviders(
      <DragDropPrompt
        pieces={["Langkah 1", "Langkah 2"]}
        correctOrder={[0, 1]}
      />
    );

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Pilih satu item, kemudian pilih tempatnya.");

    const pos1 = screen.getByRole("button", { name: /kedudukan 1/i });
    expect(pos1).toBeInTheDocument();

    const piece = screen.getByRole("button", { name: /langkah 1/i });
    fireEvent.click(piece);

    expect(piece).toHaveTextContent(/dipilih/i);
  });

  it("reports wrong order on submit in persistent role=status without resetting currentOrder, keeping controls operable", () => {
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [1, 0], // Wrong order (correct is [0, 1])
      shuffledPieces: [1, 0],
      submitted: false,
    });

    renderWithProviders(
      <DragDropPrompt
        pieces={["Step One", "Step Two"]}
        correctOrder={[0, 1]}
      />,
      { levelSlug: "level-1" }
    );

    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);

    // Status reports almost / retry in persistent role=status
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Almost! Keep reordering.");

    // currentOrder is NOT reset or shuffled!
    const preview = screen.getByTestId("drag-drop-result-preview");
    expect(preview).toHaveTextContent("Step Two Step One");

    // Controls remain operable
    const pieceOne = screen.getByRole("button", { name: /step one/i });
    const pos1Btn = screen.getByRole("button", { name: /position 1/i });
    expect(pieceOne).toBeEnabled();
    expect(pos1Btn).toBeEnabled();
  });

  it("allows correcting a wrong order in place and resubmitting until exact correctOrder completes section", () => {
    const markSectionSpy = vi.spyOn(progressModule, "markSectionCompleted");

    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [1, 0], // Wrong
      shuffledPieces: [1, 0],
      submitted: false,
    });

    const { mockScope } = renderWithProviders(
      <DragDropPrompt
        pieces={["Step One", "Step Two"]}
        correctOrder={[0, 1]}
      />,
      { levelSlug: "level-1" }
    );

    // 1. Submit wrong order
    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);

    expect(screen.getByRole("status")).toHaveTextContent("Almost! Keep reordering.");
    expect(markSectionSpy).not.toHaveBeenCalled();
    expect(mockScope.markComplete).not.toHaveBeenCalled();

    // 2. Correct the order in place: select Step One and place at Position 1
    const stepOne = screen.getByRole("button", { name: /step one/i });
    fireEvent.click(stepOne);
    const pos1Btn = screen.getByRole("button", { name: /position 1/i });
    fireEvent.click(pos1Btn);

    const preview = screen.getByTestId("drag-drop-result-preview");
    expect(preview).toHaveTextContent("Step One Step Two");

    // 3. Resubmit
    fireEvent.click(checkBtn);

    expect(markSectionSpy).toHaveBeenCalledWith("level-1", 1);
    expect(mockScope.markComplete).toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent(/perfect/i);
  });

  it("guards section completion: requires exact correctOrder and non-null scope.getIndex()", () => {
    const markSectionSpy = vi.spyOn(progressModule, "markSectionCompleted");

    const { mockScope } = renderWithProviders(
      <DragDropPrompt
        pieces={["A", "B", "C"]}
        correctOrder={[0, 1, 2]}
      />,
      {
        levelSlug: "level-1",
        scopeValue: { getIndex: vi.fn(() => null) },
      }
    );

    // Force correct order via component state
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [0, 1, 2],
      shuffledPieces: [0, 1, 2],
      submitted: false,
    });

    // Even if check is clicked on correct order, null getIndex fails closed
    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);

    expect(markSectionSpy).not.toHaveBeenCalled();
    expect(mockScope.markComplete).not.toHaveBeenCalled();
  });

  it("keeps focused submit element stable across wrong submission", () => {
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [1, 0], // Wrong
      shuffledPieces: [1, 0],
      submitted: false,
    });

    renderWithProviders(
      <DragDropPrompt
        pieces={["First", "Second"]}
        correctOrder={[0, 1]}
      />,
      { levelSlug: "level-1" }
    );

    const checkBtn = screen.getByRole("button", { name: /check/i });
    checkBtn.focus();
    expect(document.activeElement).toBe(checkBtn);

    fireEvent.click(checkBtn);

    // The Check button remains mounted and focused!
    expect(document.activeElement).toBe(checkBtn);
    expect(checkBtn).toBeInTheDocument();
  });

  it("handles repeated Check clicks idempotently without duplicating completion", () => {
    const markSectionSpy = vi.spyOn(progressModule, "markSectionCompleted");

    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [0, 1], // Correct
      shuffledPieces: [0, 1],
      submitted: false,
    });

    const { mockScope } = renderWithProviders(
      <DragDropPrompt
        pieces={["A", "B"]}
        correctOrder={[0, 1]}
      />,
      { levelSlug: "level-1" }
    );

    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);

    expect(markSectionSpy).toHaveBeenCalledTimes(1);
    expect(mockScope.markComplete).toHaveBeenCalledTimes(1);

    // Actions area displays completion indicator
    const actionsArea = screen.getByTestId("drag-drop-actions");
    expect(actionsArea).toBeInTheDocument();
    expect(actionsArea).toHaveTextContent(/perfect/i);
  });

  it("restores saved state compatibility preserving currentOrder and allowing in-place edits", () => {
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      currentOrder: [1, 0],
      shuffledPieces: [1, 0],
      submitted: true,
    });

    renderWithProviders(
      <DragDropPrompt
        pieces={["Part 1", "Part 2"]}
        correctOrder={[0, 1]}
      />,
      { levelSlug: "level-1" }
    );

    // Restores saved currentOrder
    const preview = screen.getByTestId("drag-drop-result-preview");
    expect(preview).toHaveTextContent("Part 2 Part 1");

    // Order is wrong, so controls and Check button remain operable
    const part1 = screen.getByRole("button", { name: /part 1/i });
    expect(part1).toBeEnabled();

    // Reorder in place
    fireEvent.click(part1);
    const pos1 = screen.getByRole("button", { name: /position 1/i });
    fireEvent.click(pos1);

    expect(preview).toHaveTextContent("Part 1 Part 2");
  });
});
