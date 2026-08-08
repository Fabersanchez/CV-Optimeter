/**
 * CV OPTIMETER AI — DYNAMIC LAYOUT & FLOW ENGINE (RENDER ENGINE V2 2026)
 * Calculates dynamic margins, section spacing, column gaps, and vertical flow
 * to eliminate white gaps while maintaining editorial legibility.
 */

import { ResumeData, ThemeConfig } from "@/types/resume";

export interface ComputedLayoutMetrics {
  pagePadding: string;
  sectionGap: string;
  itemGap: string;
  headerMarginBottom: string;
  photoSize: string;
  columns: number;
  columnGap: string;
  densityMode: "compact" | "normal" | "spacious";
}

export function computeLayoutMetrics(data: ResumeData, theme: ThemeConfig): ComputedLayoutMetrics {
  // Calculate total word count in document
  const totalWords = (data.summary || "").split(/\s+/).length +
    (data.experience || []).flatMap((e) => (e.bullets || []).concat(e.role, e.company)).join(" ").split(/\s+/).length;

  // Determine dynamic density mode to optimize page space
  let densityMode: "compact" | "normal" | "spacious" = theme.spacingDensity || "normal";
  if (totalWords > 450) {
    densityMode = "compact";
  } else if (totalWords < 180) {
    densityMode = "spacious";
  }

  let pagePadding = "2rem"; // 32px
  let sectionGap = "1.25rem"; // 20px
  let itemGap = "0.75rem"; // 12px
  let headerMarginBottom = "1rem";

  if (densityMode === "compact") {
    pagePadding = "1.5rem"; // 24px
    sectionGap = "0.875rem"; // 14px
    itemGap = "0.5rem"; // 8px
    headerMarginBottom = "0.75rem";
  } else if (densityMode === "spacious") {
    pagePadding = "2.5rem"; // 40px
    sectionGap = "1.75rem"; // 28px
    itemGap = "1rem"; // 16px
    headerMarginBottom = "1.25rem";
  }

  return {
    pagePadding,
    sectionGap,
    itemGap,
    headerMarginBottom,
    photoSize: "4.5rem", // 72px square/round
    columns: theme.layoutColumns || 1,
    columnGap: "1.5rem",
    densityMode
  };
}
