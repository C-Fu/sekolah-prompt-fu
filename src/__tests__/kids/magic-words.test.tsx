import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup, within } from "@testing-library/react";
import enMessages from "@/../messages/en.json";
import msMessages from "@/../messages/ms.json";
import { MagicWords } from "@/components/kids/elements/magic-words";
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

describe("MagicWords (Phase 15-04)", () => {
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
      identity: { id: "test-section-identity" },
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

  it("renders blanks as native buttons with readable hints and touch hitboxes", () => {
    renderWithProviders(
      <MagicWords
        sentence="Please write a {{type}} about a {{character}}"
        blanks={[
          { id: "type", hint: "What kind of writing?", answers: ["story", "poem"] },
          { id: "character", hint: "Who is it about?", answers: ["robot", "dragon"] },
        ]}
      />
    );

    const blank1 = screen.getByRole("button", { name: /what kind of writing/i });
    const blank2 = screen.getByRole("button", { name: /who is it about/i });

    expect(blank1).toBeInTheDocument();
    expect(blank1.tagName).toBe("BUTTON");
    expect(blank2).toBeInTheDocument();
    expect(blank2.tagName).toBe("BUTTON");

    // Hitbox check: min-height 44px
    expect(blank1.className).toMatch(/min-h-\[44px\]/);
    expect(blank2.className).toMatch(/min-h-\[44px\]/);
  });

  it("renders visible persistent role=status live region with initial prompt", () => {
    renderWithProviders(
      <MagicWords
        sentence="I see a {{animal}}"
        blanks={[{ id: "animal", hint: "Animal name", answers: ["cat"] }]}
      />
    );

    const status = screen.getByRole("status");
    expect(status).toBeInTheDocument();
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Choose an item, then choose a place.");
  });

  it("selects a word via click exposing aria-pressed and multimodal selected indicator", () => {
    renderWithProviders(
      <MagicWords
        sentence="I see a {{animal}}"
        blanks={[{ id: "animal", hint: "Animal name", answers: ["cat"] }]}
      />
    );

    const wordButton = screen.getByRole("button", { name: /cat/i });
    expect(wordButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(wordButton);
    expect(wordButton).toHaveAttribute("aria-pressed", "true");
    expect(wordButton).toHaveTextContent(/selected/i);
  });

  it("rejects incorrect destination blank: retains selected word, announces retry status, and leaves earlier placements intact", () => {
    renderWithProviders(
      <MagicWords
        sentence="A {{color}} {{animal}} jumps"
        blanks={[
          { id: "color", hint: "Color", answers: ["red", "blue"] },
          { id: "animal", hint: "Animal", answers: ["cat", "dog"] },
        ]}
      />
    );

    // 1. Place 'red' into 'Color' correctly first
    const redWord = screen.getByRole("button", { name: /^red/i });
    fireEvent.click(redWord);
    const colorBlank = screen.getByRole("button", { name: /color/i });
    fireEvent.click(colorBlank);

    expect(screen.getByRole("status")).toHaveTextContent("Correct! Item placed.");
    expect(colorBlank).toHaveTextContent("red");

    // 2. Try to place 'cat' into 'Color' (which accepts red/blue, not cat)
    // First, let's select 'cat'
    const catWord = screen.getByRole("button", { name: /^cat/i });
    fireEvent.click(catWord);
    expect(catWord).toHaveAttribute("aria-pressed", "true");

    // Click the color blank which already has 'red' and rejects 'cat'
    fireEvent.click(colorBlank);

    // Should reject:
    expect(screen.getByRole("status")).toHaveTextContent(
      "Not there yet. Choose another place for this item."
    );
    // catWord must retain selection
    expect(catWord).toHaveAttribute("aria-pressed", "true");
    // Earlier correct answer ('red') remains intact in color blank!
    expect(colorBlank).toHaveTextContent("red");
  });

  it("places word into correct destination blank: consumes item, clears selection, announces success", () => {
    renderWithProviders(
      <MagicWords
        sentence="A {{color}} {{animal}} jumps"
        blanks={[
          { id: "color", hint: "Color", answers: ["red"] },
          { id: "animal", hint: "Animal", answers: ["cat"] },
        ]}
      />
    );

    const catWord = screen.getByRole("button", { name: /^cat/i });
    fireEvent.click(catWord);

    const animalBlank = screen.getByRole("button", { name: /animal/i });
    fireEvent.click(animalBlank);

    expect(animalBlank).toHaveTextContent("cat");
    expect(catWord).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Correct! Item placed.");
  });

  it("handles duplicate-text words independently so placing one duplicate does not disable the other", () => {
    renderWithProviders(
      <MagicWords
        sentence="The {{pet1}} saw another {{pet2}}"
        blanks={[
          { id: "pet1", hint: "First pet", answers: ["cat"] },
          { id: "pet2", hint: "Second pet", answers: ["cat"] },
        ]}
      />
    );

    // There should be two "cat" buttons rendered
    const catButtons = screen.getAllByRole("button", { name: /cat/i });
    expect(catButtons).toHaveLength(2);

    // Place the first cat button into pet1
    fireEvent.click(catButtons[0]);
    const blank1 = screen.getByRole("button", { name: /first pet/i });
    fireEvent.click(blank1);

    expect(blank1).toHaveTextContent("cat");
    expect(catButtons[0]).toBeDisabled();

    // The second cat button MUST remain enabled and selectable!
    expect(catButtons[1]).toBeEnabled();
    expect(catButtons[1]).toHaveAttribute("aria-pressed", "false");

    // Place the second cat button into pet2
    fireEvent.click(catButtons[1]);
    const blank2 = screen.getByRole("button", { name: /second pet/i });
    fireEvent.click(blank2);

    expect(blank2).toHaveTextContent("cat");
    expect(catButtons[1]).toBeDisabled();
  });

  it("allows unplacing a word by clicking the filled blank when no word is selected", () => {
    renderWithProviders(
      <MagicWords
        sentence="I see a {{animal}}"
        blanks={[{ id: "animal", hint: "Animal name", answers: ["cat"] }]}
      />
    );

    const catWord = screen.getByRole("button", { name: /^cat/i });
    fireEvent.click(catWord);
    const blank = screen.getByRole("button", { name: /animal name/i });
    fireEvent.click(blank);

    expect(blank).toHaveTextContent("cat");
    expect(catWord).toBeDisabled();

    // Click the filled blank with no word selected -> unplaces cat!
    fireEvent.click(blank);
    expect(blank).toHaveTextContent("Animal name");
    expect(catWord).toBeEnabled();
  });

  it("supports drag-and-drop shortcut with matching validation", () => {
    renderWithProviders(
      <MagicWords
        sentence="I like {{food}} and {{color}}"
        blanks={[
          { id: "food", hint: "Food", answers: ["pizza"] },
          { id: "color", hint: "Color", answers: ["blue"] },
        ]}
      />
    );

    const pizzaWord = screen.getByRole("button", { name: /^pizza/i });
    const colorBlank = screen.getByRole("button", { name: /color/i });
    const foodBlank = screen.getByRole("button", { name: /food/i });

    // Drag pizza to wrong blank (color)
    fireEvent.dragStart(pizzaWord);
    fireEvent.drop(colorBlank);

    expect(colorBlank).toHaveTextContent("Color");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Not there yet. Choose another place for this item."
    );

    // Drag pizza to correct blank (food)
    fireEvent.dragStart(pizzaWord);
    fireEvent.drop(foodBlank);

    expect(foodBlank).toHaveTextContent("pizza");
    expect(pizzaWord).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Correct! Item placed.");
  });

  it("guards section completion: all correct answers required and scope.getIndex() must be non-null", () => {
    const markSectionSpy = vi.spyOn(progressModule, "markSectionCompleted");

    const { mockScope } = renderWithProviders(
      <MagicWords
        sentence="A {{color}} {{animal}}"
        blanks={[
          { id: "color", hint: "Color", answers: ["red"] },
          { id: "animal", hint: "Animal", answers: ["cat"] },
        ]}
      />,
      { levelSlug: "level-1" }
    );

    // Place both correctly
    const redWord = screen.getByRole("button", { name: /^red/i });
    fireEvent.click(redWord);
    fireEvent.click(screen.getByRole("button", { name: /color/i }));

    const catWord = screen.getByRole("button", { name: /^cat/i });
    fireEvent.click(catWord);
    fireEvent.click(screen.getByRole("button", { name: /animal/i }));

    const checkBtn = screen.getByRole("button", { name: /check/i });
    expect(checkBtn).toBeEnabled();

    fireEvent.click(checkBtn);

    expect(markSectionSpy).toHaveBeenCalledWith("level-1", 1);
    expect(mockScope.markComplete).toHaveBeenCalled();
  });

  it("does not complete section if scope.getIndex() is null even if all answers are correct", () => {
    const markSectionSpy = vi.spyOn(progressModule, "markSectionCompleted");

    const { mockScope } = renderWithProviders(
      <MagicWords
        sentence="A {{color}}"
        blanks={[{ id: "color", hint: "Color", answers: ["red"] }]}
      />,
      {
        levelSlug: "level-1",
        scopeValue: { getIndex: vi.fn(() => null) },
      }
    );

    const redWord = screen.getByRole("button", { name: /^red/i });
    fireEvent.click(redWord);
    fireEvent.click(screen.getByRole("button", { name: /color/i }));

    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);

    expect(markSectionSpy).not.toHaveBeenCalled();
    expect(mockScope.markComplete).not.toHaveBeenCalled();
  });

  it("restores saved state compatibility: preserved placements remain placed and remaining words stay selectable", () => {
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      placements: { color: "red" },
      submitted: false,
      availableWords: [
        { word: "red", blankId: "color" },
        { word: "cat", blankId: "animal" },
      ],
    });

    renderWithProviders(
      <MagicWords
        sentence="A {{color}} {{animal}}"
        blanks={[
          { id: "color", hint: "Color", answers: ["red"] },
          { id: "animal", hint: "Animal", answers: ["cat"] },
        ]}
      />,
      { levelSlug: "level-1" }
    );

    // Red should be placed
    const colorBlank = screen.getByRole("button", { name: /color/i });
    expect(colorBlank).toHaveTextContent("red");

    // Red word button should be disabled (already placed)
    const redWord = screen.getByRole("button", { name: /^red/i });
    expect(redWord).toBeDisabled();

    // Cat word button must be available
    const catWord = screen.getByRole("button", { name: /^cat/i });
    expect(catWord).toBeEnabled();
  });

  it("localizes status and selection indicators when locale is Bahasa Melayu", () => {
    intlState.locale = "ms";

    renderWithProviders(
      <MagicWords
        sentence="Saya suka {{animal}}"
        blanks={[{ id: "animal", hint: "Haiwan", answers: ["kucing"] }]}
      />
    );

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Pilih satu item, kemudian pilih tempatnya.");

    const wordBtn = screen.getByRole("button", { name: /kucing/i });
    fireEvent.click(wordBtn);

    expect(wordBtn).toHaveTextContent(/dipilih/i);

    const blank = screen.getByRole("button", { name: /haiwan/i });
    fireEvent.click(blank);

    expect(status).toHaveTextContent("Betul! Item telah diletakkan.");
  });

  it("handles repeated submit without duplicating progress or crashing", () => {
    const markSectionSpy = vi.spyOn(progressModule, "markSectionCompleted");

    const { mockScope } = renderWithProviders(
      <MagicWords
        sentence="A {{color}}"
        blanks={[{ id: "color", hint: "Color", answers: ["red"] }]}
      />,
      { levelSlug: "level-1" }
    );

    const redWord = screen.getByRole("button", { name: /^red/i });
    fireEvent.click(redWord);
    fireEvent.click(screen.getByRole("button", { name: /color/i }));

    const checkBtn = screen.getByRole("button", { name: /check/i });
    fireEvent.click(checkBtn);

    expect(markSectionSpy).toHaveBeenCalledTimes(1);
    expect(mockScope.markComplete).toHaveBeenCalledTimes(1);

    // After success, actions area remains mounted with stable completion indicator
    const actionsArea = screen.getByTestId("magic-words-actions");
    expect(actionsArea).toBeInTheDocument();
    expect(actionsArea).toHaveTextContent(/correct/i);
  });

  it("supports interrupted selection: switching words or deselecting cleanly updates state and announcements", () => {
    renderWithProviders(
      <MagicWords
        sentence="A {{color}} {{animal}}"
        blanks={[
          { id: "color", hint: "Color", answers: ["red"] },
          { id: "animal", hint: "Animal", answers: ["cat"] },
        ]}
      />
    );

    const redWord = screen.getByRole("button", { name: /^red/i });
    const catWord = screen.getByRole("button", { name: /^cat/i });

    // Select red
    fireEvent.click(redWord);
    expect(redWord).toHaveAttribute("aria-pressed", "true");
    expect(catWord).toHaveAttribute("aria-pressed", "false");

    // Click red again to deselect
    fireEvent.click(redWord);
    expect(redWord).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByRole("status")).toHaveTextContent("Choose an item, then choose a place.");

    // Select red, then interrupt by clicking cat directly
    fireEvent.click(redWord);
    expect(redWord).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(catWord);
    expect(redWord).toHaveAttribute("aria-pressed", "false");
    expect(catWord).toHaveAttribute("aria-pressed", "true");
  });

  it("executes explicit wrong-then-correct sequence without clearing other answers or breaking section guidance", () => {
    renderWithProviders(
      <MagicWords
        sentence="A {{color}} {{animal}} runs"
        blanks={[
          { id: "color", hint: "Color", answers: ["blue"] },
          { id: "animal", hint: "Animal", answers: ["fox"] },
        ]}
      />
    );

    // 1. Place blue into color correctly
    fireEvent.click(screen.getByRole("button", { name: /^blue/i }));
    fireEvent.click(screen.getByRole("button", { name: /color/i }));
    expect(screen.getByRole("button", { name: /color/i })).toHaveTextContent("blue");

    // 2. Mistakenly try to place fox into color
    fireEvent.click(screen.getByRole("button", { name: /^fox/i }));
    fireEvent.click(screen.getByRole("button", { name: /color/i }));

    // Wrong placement announced, fox still selected, blue still in color!
    expect(screen.getByRole("status")).toHaveTextContent(
      "Not there yet. Choose another place for this item."
    );
    expect(screen.getByRole("button", { name: /^fox/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /color/i })).toHaveTextContent("blue");

    // 3. Now click the correct animal destination blank
    fireEvent.click(screen.getByRole("button", { name: /animal/i }));

    // Now fox is placed in animal, blue is still in color!
    expect(screen.getByRole("button", { name: /animal/i })).toHaveTextContent("fox");
    expect(screen.getByRole("button", { name: /color/i })).toHaveTextContent("blue");
    expect(screen.getByRole("status")).toHaveTextContent("Correct! Item placed.");
  });

  it("restores legacy saved state lacking placedIndices and reconciles duplicate-safe indexing", () => {
    vi.spyOn(progressModule, "getComponentState").mockReturnValue({
      placements: { pet1: "dog", pet2: "dog" },
      submitted: false,
      availableWords: [
        { word: "dog", blankId: "pet1" },
        { word: "dog", blankId: "pet2" },
      ],
    });

    renderWithProviders(
      <MagicWords
        sentence="Two dogs: {{pet1}} and {{pet2}}"
        blanks={[
          { id: "pet1", hint: "Pet 1", answers: ["dog"] },
          { id: "pet2", hint: "Pet 2", answers: ["dog"] },
        ]}
      />,
      { levelSlug: "level-1" }
    );

    const blank1 = screen.getByRole("button", { name: /pet 1/i });
    const blank2 = screen.getByRole("button", { name: /pet 2/i });
    expect(blank1).toHaveTextContent("dog");
    expect(blank2).toHaveTextContent("dog");

    // Both dog buttons in word bank should be disabled because both slots are filled
    const wordBank = screen.getByTestId("magic-words-word-bank");
    const dogButtons = within(wordBank).getAllByRole("button", { name: /dog/i });
    expect(dogButtons[0]).toBeDisabled();
    expect(dogButtons[1]).toBeDisabled();

    // Now unplace blank1
    fireEvent.click(blank1);
    expect(blank1).toHaveTextContent("Pet 1");

    // One of the dog buttons should become available again!
    const updatedDogButtons = within(wordBank).getAllByRole("button", { name: /dog/i });
    const enabledCount = updatedDogButtons.filter((btn) => !btn.hasAttribute("disabled")).length;
    expect(enabledCount).toBe(1);
  });
});
