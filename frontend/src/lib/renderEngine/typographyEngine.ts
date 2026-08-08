/**
 * CV OPTIMETER AI — TYPOGRAPHY ENGINE (RENDER ENGINE V2 2026)
 * Controls font family, font weight, line height, letter spacing, and scale.
 */

import { ThemeConfig } from "@/types/resume";

export interface TypographyConfig {
  fontFamily: string;
  bodyFontSize: string;
  headerFontSize: string;
  titleFontSize: string;
  lineHeight: number;
  letterSpacing: string;
  sectionHeaderTransform: "uppercase" | "capitalize" | "none";
}

export function getTypographyConfig(theme: ThemeConfig): TypographyConfig {
  const fontPairing = theme.fontPairing || "inter";
  const fontSizeScale = theme.fontSizeScale || "normal";

  let fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
  if (fontPairing === "roboto") {
    fontFamily = "'Roboto', 'Helvetica Neue', sans-serif";
  } else if (fontPairing === "merriweather" || fontPairing === "playfair") {
    fontFamily = "'Merriweather', 'Georgia', serif";
  } else if (fontPairing === "fira-code") {
    fontFamily = "'Fira Code', 'Courier New', monospace";
  }

  let bodyFontSize = "12px";
  let headerFontSize = "22px";
  let titleFontSize = "13px";

  if (fontSizeScale === "compact") {
    bodyFontSize = "11px";
    headerFontSize = "20px";
    titleFontSize = "12px";
  } else if (fontSizeScale === "large") {
    bodyFontSize = "13px";
    headerFontSize = "24px";
    titleFontSize = "14px";
  }

  return {
    fontFamily,
    bodyFontSize,
    headerFontSize,
    titleFontSize,
    lineHeight: 1.45,
    letterSpacing: fontPairing === "fira-code" ? "-0.02em" : "normal",
    sectionHeaderTransform: "uppercase"
  };
}
