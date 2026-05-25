"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type FontSizeLevel = "xs" | "sm" | "md" | "lg" | "xl";

export interface FontSizeConfig {
  level: FontSizeLevel;
  label: string;
  baseSize: number;
  buttonHeight: number;
  spacing: number;
  iconSize: number;
}

export const FONT_SIZE_CONFIGS: Record<FontSizeLevel, FontSizeConfig> = {
  xs: { level: "xs", label: "작은 글씨",      baseSize: 14, buttonHeight: 44, spacing: 1,    iconSize: 20 },
  sm: { level: "sm", label: "약간 작은 글씨",  baseSize: 16, buttonHeight: 48, spacing: 1.1,  iconSize: 22 },
  md: { level: "md", label: "중간 글씨",      baseSize: 18, buttonHeight: 52, spacing: 1.2,  iconSize: 24 },
  lg: { level: "lg", label: "약간 큰 글씨",    baseSize: 20, buttonHeight: 56, spacing: 1.35, iconSize: 28 },
  xl: { level: "xl", label: "큰 글씨",        baseSize: 24, buttonHeight: 64, spacing: 1.5,  iconSize: 32 },
};

interface FontSizeContextType {
  fontSizeLevel: FontSizeLevel;
  setFontSizeLevel: (level: FontSizeLevel) => void;
  config: FontSizeConfig;
}

const FontSizeContext = createContext<FontSizeContextType | null>(null);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSizeLevel, setFontSizeLevelState] = useState<FontSizeLevel>("md");

  useEffect(() => {
    const saved = localStorage.getItem("parentFontSize") as FontSizeLevel | null;
    if (saved && FONT_SIZE_CONFIGS[saved]) {
      setFontSizeLevelState(saved);
    }
  }, []);

  function setFontSizeLevel(level: FontSizeLevel) {
    setFontSizeLevelState(level);
    localStorage.setItem("parentFontSize", level);
  }

  const config = FONT_SIZE_CONFIGS[fontSizeLevel];

  return (
    <FontSizeContext.Provider value={{ fontSizeLevel, setFontSizeLevel, config }}>
      <div
        style={{
          "--parent-font-base":    `${config.baseSize}px`,
          "--parent-font-title":   `${config.baseSize * 1.3}px`,
          "--parent-font-caption": `${config.baseSize * 0.85}px`,
          "--parent-btn-height":   `${config.buttonHeight}px`,
          "--parent-spacing":      `${config.spacing}`,
          "--parent-icon-size":    `${config.iconSize}px`,
        } as React.CSSProperties}
      >
        {children}
      </div>
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const ctx = useContext(FontSizeContext);
  if (!ctx) throw new Error("useFontSize must be used within FontSizeProvider");
  return ctx;
}
