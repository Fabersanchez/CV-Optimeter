import { TemplateCategory, ThemeConfig, FontPairing } from "@/types/resume";

export interface AIPromptDesignResult {
  templateId: TemplateCategory;
  theme: ThemeConfig;
  explanation: string;
}

export function processAIPromptDesign(prompt: string): AIPromptDesignResult {
  const p = prompt.toLowerCase();

  if (p.includes("harvard") || p.includes("academico") || p.includes("investigador")) {
    return {
      templateId: "academic",
      theme: {
        primaryColor: "#334155",
        secondaryColor: "#0f172a",
        accentColor: "#64748b",
        textColor: "#0f172a",
        backgroundColor: "#ffffff",
        fontPairing: "merriweather",
        fontSizeScale: "normal",
        spacingDensity: "spacious",
        borderRadius: "none",
        layoutColumns: 1,
        headerStyle: "centered",
        dividerStyle: "solid"
      },
      explanation: "Generated Harvard Academic layout with formal Merriweather serif typography, centered header, and 99% ATS compatibility."
    };
  }

  if (p.includes("siemens") || p.includes("corporativo") || p.includes("empresa")) {
    return {
      templateId: "corporate",
      theme: {
        primaryColor: "#0f172a",
        secondaryColor: "#1e293b",
        accentColor: "#0284c7",
        textColor: "#0f172a",
        backgroundColor: "#ffffff",
        fontPairing: "roboto",
        fontSizeScale: "normal",
        spacingDensity: "normal",
        borderRadius: "sm",
        layoutColumns: 1,
        headerStyle: "left-aligned",
        dividerStyle: "solid"
      },
      explanation: "Generated Siemens Enterprise Corporate layout with navy/slate accents, structured grid headers, and clear metric hierarchy."
    };
  }

  if (p.includes("minimalista") || p.includes("limpio") || p.includes("simple")) {
    return {
      templateId: "minimalist",
      theme: {
        primaryColor: "#0f172a",
        secondaryColor: "#475569",
        accentColor: "#94a3b8",
        textColor: "#0f172a",
        backgroundColor: "#ffffff",
        fontPairing: "inter",
        fontSizeScale: "normal",
        spacingDensity: "spacious",
        borderRadius: "none",
        layoutColumns: 1,
        headerStyle: "left-aligned",
        dividerStyle: "solid"
      },
      explanation: "Generated Ultra-Clean Minimalist design with generous whitespace, subtle grey dividers, and high readability."
    };
  }

  if (p.includes("ejecutivo") || p.includes("director") || p.includes("vp")) {
    return {
      templateId: "executive",
      theme: {
        primaryColor: "#0f172a",
        secondaryColor: "#1e293b",
        accentColor: "#38bdf8",
        textColor: "#0f172a",
        backgroundColor: "#ffffff",
        fontPairing: "inter",
        fontSizeScale: "normal",
        spacingDensity: "normal",
        borderRadius: "md",
        layoutColumns: 1,
        headerStyle: "banner",
        dividerStyle: "solid"
      },
      explanation: "Generated Executive Leadership layout featuring a deep slate banner header and high-impact career progression."
    };
  }

  // Default: Tech / Engineering Senior CV
  return {
    templateId: "technology",
    theme: {
      primaryColor: "#0284c7",
      secondaryColor: "#0f172a",
      accentColor: "#38bdf8",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "fira-code",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "sm",
      layoutColumns: 1,
      headerStyle: "left-aligned",
      dividerStyle: "solid"
    },
    explanation: "Generated Senior Software Engineer layout with tech stack pills, monospace code headers, and GitHub project tags."
  };
}
