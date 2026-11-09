"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  type LessonOrigin,
  DEFAULT_LESSON_ORIGIN,
  parseLessonOrigin,
  resolveOriginRoute,
} from "@/lib/kids/lesson-origin";

export interface LessonOriginContextValue {
  origin: LessonOrigin;
  returnRoute: string;
  hubLabelKey: "level.map" | "level.planets";
}

const LessonOriginContext = createContext<LessonOriginContextValue>({
  origin: DEFAULT_LESSON_ORIGIN,
  returnRoute: resolveOriginRoute(DEFAULT_LESSON_ORIGIN),
  hubLabelKey: "level.map",
});

export interface LessonOriginProviderProps {
  children: React.ReactNode;
  initialOrigin?: LessonOrigin;
}

export function LessonOriginProvider({
  children,
  initialOrigin,
}: LessonOriginProviderProps) {
  const [origin, setOrigin] = useState<LessonOrigin>(() => {
    return initialOrigin ? parseLessonOrigin(initialOrigin) : DEFAULT_LESSON_ORIGIN;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const queryOrigin = params.get("origin");
      if (queryOrigin) {
        setOrigin(parseLessonOrigin(queryOrigin));
      }
    }
  }, []);

  const value: LessonOriginContextValue = {
    origin,
    returnRoute: resolveOriginRoute(origin),
    hubLabelKey: origin === "planets" ? "level.planets" : "level.map",
  };

  return (
    <LessonOriginContext.Provider value={value}>
      {children}
    </LessonOriginContext.Provider>
  );
}

export function useLessonOrigin(): LessonOriginContextValue {
  return useContext(LessonOriginContext);
}
