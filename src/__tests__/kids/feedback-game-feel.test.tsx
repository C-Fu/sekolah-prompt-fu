import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MagicWords } from "@/components/kids/elements/magic-words";
import { DragDropPrompt } from "@/components/kids/elements/drag-drop-prompt";

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    return (key: string) => {
      const msgs: Record<string, string> = {
        title: "Magic Words",
        dragOrTap: "Drag or tap words into blanks",
        check: "Check",
        retry: "Retry",
        itemDestinationPrompt: "Choose an item, then choose a place.",
        correctPlacement: "Correct! Item placed.",
        wrongPlacement: "Not there yet. Choose another place for this item.",
        selected: "Selected",
        correct: "Correct",
        incorrect: "Incorrect",
        instruction: "Arrange the prompt",
        moveUp: "Move up",
        moveDown: "Move down",
        position: "Position",
        result: "Result",
      };
      return msgs[key] || `${namespace}.${key}`;
    };
  },
}));

vi.mock("@/components/kids/providers/level-context", () => ({
  useLevelSlug: () => "1-1-test",
  useSectionIdentity: () => ({
    registerRequirement: vi.fn(),
    getIndex: () => 0,
    markComplete: vi.fn(),
  }),
}));

describe("Interactive activities feedback and game feel (FEEL-01, FEEL-03)", () => {
  it("MagicWords provides tactile selection state and distinct icons/text on submit", () => {
    render(
      <MagicWords
        sentence="I want to learn _."
        blanks={[
          {
            hint: "topic",
            answers: ["coding"],
          },
        ]}
      />
    );

    // Initial state: prompt message
    const status = screen.getByTestId("magic-words-status");
    expect(status).toHaveTextContent("Choose an item, then choose a place.");

    // Click word to select
    const wordButton = screen.getByRole("button", { name: /coding/i });
    fireEvent.click(wordButton);
    expect(wordButton).toHaveAttribute("aria-pressed", "true");
    expect(wordButton).toHaveTextContent("Selected");

    // Click blank to place
    const blankButton = screen.getByRole("button", { name: /topic/i });
    fireEvent.click(blankButton);
    expect(blankButton).toHaveTextContent("coding");

    // Submit answer
    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);

    // Verify Check icon exists alongside visual feedback (not color alone)
    expect(screen.getByTestId("magic-words-check-icon")).toBeInTheDocument();
  });

  it("DragDropPrompt provides immediate piece selection and non-color-only icons on submit", () => {
    render(
      <DragDropPrompt
        pieces={["First", "Second"]}
        correctOrder={[0, 1]}
      />
    );

    // Select piece
    const piece = screen.getByRole("button", { name: /First/i });
    fireEvent.click(piece);
    expect(piece).toHaveAttribute("aria-pressed", "true");
    expect(piece).toHaveTextContent("Selected");

    // Click check button
    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);

    // Status icon rendered
    expect(screen.getByTestId("drag-drop-status-icon-0")).toBeInTheDocument();
  });
});
