import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageToggle } from "@/components/kids/layout/language-toggle";
import * as providersModule from "@/components/providers";

describe("LanguageToggle", () => {
  it("renders BM and EN buttons with proper aria labels", () => {
    vi.spyOn(providersModule, "useLocalePreference").mockReturnValue({
      locale: "en",
      setUserLocale: vi.fn(),
      isSwitching: false,
    });

    render(<LanguageToggle />);

    expect(screen.getByRole("group", { name: "Language selection" })).toBeInTheDocument();
    const bmBtn = screen.getByRole("button", { name: "Tukar ke Bahasa Melayu" });
    const enBtn = screen.getByRole("button", { name: "Switch to English" });

    expect(bmBtn).toBeInTheDocument();
    expect(enBtn).toBeInTheDocument();
    expect(bmBtn).toHaveAttribute("aria-pressed", "false");
    expect(enBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights BM as active when locale is 'ms'", () => {
    vi.spyOn(providersModule, "useLocalePreference").mockReturnValue({
      locale: "ms",
      setUserLocale: vi.fn(),
      isSwitching: false,
    });

    render(<LanguageToggle />);

    const bmBtn = screen.getByRole("button", { name: "Tukar ke Bahasa Melayu" });
    const enBtn = screen.getByRole("button", { name: "Switch to English" });

    expect(bmBtn).toHaveAttribute("aria-pressed", "true");
    expect(enBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("calls setUserLocale with 'ms' when BM is clicked", () => {
    const setUserLocale = vi.fn().mockResolvedValue({ status: "switched" });
    vi.spyOn(providersModule, "useLocalePreference").mockReturnValue({
      locale: "en",
      setUserLocale,
      isSwitching: false,
    });

    render(<LanguageToggle />);

    const bmBtn = screen.getByRole("button", { name: "Tukar ke Bahasa Melayu" });
    fireEvent.click(bmBtn);

    expect(setUserLocale).toHaveBeenCalledWith("ms");
  });

  it("calls setUserLocale with 'en' when EN is clicked", () => {
    const setUserLocale = vi.fn().mockResolvedValue({ status: "switched" });
    vi.spyOn(providersModule, "useLocalePreference").mockReturnValue({
      locale: "ms",
      setUserLocale,
      isSwitching: false,
    });

    render(<LanguageToggle />);

    const enBtn = screen.getByRole("button", { name: "Switch to English" });
    fireEvent.click(enBtn);

    expect(setUserLocale).toHaveBeenCalledWith("en");
  });

  it("does not trigger setUserLocale when clicking the already-active locale", () => {
    const setUserLocale = vi.fn();
    vi.spyOn(providersModule, "useLocalePreference").mockReturnValue({
      locale: "en",
      setUserLocale,
      isSwitching: false,
    });

    render(<LanguageToggle />);

    const enBtn = screen.getByRole("button", { name: "Switch to English" });
    fireEvent.click(enBtn);

    expect(setUserLocale).not.toHaveBeenCalled();
  });
});
