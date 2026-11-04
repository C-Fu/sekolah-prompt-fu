import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import {
  DragDropPrompt,
  ExampleMatcher,
  LevelComplete,
  MagicWords,
  Panel,
  PromptDoctor,
  PromptLab,
  PromptParts,
  PromptVsMistake,
  Section,
  StepByStep,
  WordPredictor,
} from "@/components/kids/elements";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    table: ({ ref: _ref, ...props }: ComponentPropsWithoutRef<"table"> & { ref?: unknown }) => (
      <div className="my-6 w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm" {...props} />
      </div>
    ),
    thead: ({ ref: _ref, ...props }: ComponentPropsWithoutRef<"thead"> & { ref?: unknown }) => (
      <thead className="bg-muted/50" {...props} />
    ),
    tbody: ({ ref: _ref, ...props }: ComponentPropsWithoutRef<"tbody"> & { ref?: unknown }) => (
      <tbody {...props} />
    ),
    th: ({ ref: _ref, ...props }: ComponentPropsWithoutRef<"th"> & { ref?: unknown }) => (
      <th className="border border-border px-4 py-2 text-start font-semibold" {...props} />
    ),
    td: ({ ref: _ref, ...props }: ComponentPropsWithoutRef<"td"> & { ref?: unknown }) => (
      <td className="border border-border px-4 py-2" {...props} />
    ),
    tr: ({ ref: _ref, ...props }: ComponentPropsWithoutRef<"tr"> & { ref?: unknown }) => (
      <tr className="even:bg-muted/30" {...props} />
    ),
    // Kids components used by src/content/kids/**/*.mdx.
    // `Section` MUST stay bound to the real exported component from
    // src/components/kids/elements/level-slides.tsx so its section registry
    // (used by LevelSlides and interactive descendants) keeps working.
    Section,
    Panel,
    PromptVsMistake,
    MagicWords,
    DragDropPrompt,
    LevelComplete,
    PromptParts,
    ExampleMatcher,
    PromptDoctor,
    StepByStep,
    PromptLab,
    WordPredictor,
  };
}