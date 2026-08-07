export interface ThemePreset {
  id: string;
  name: string;
  category: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontHeading: string;
  fontBody: string;
  borderRadius: string;
  borderStyle: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
    primaryColor: "#0f172a",
    secondaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    textColor: "#1e293b",
    fontHeading: "Inter",
    fontBody: "Inter",
    borderRadius: "4px",
    borderStyle: "1px solid #e2e8f0"
  },
  {
    id: "apple-inspired",
    name: "Apple Inspired",
    category: "Modern Minimal",
    primaryColor: "#1d1d1f",
    secondaryColor: "#0071e3",
    backgroundColor: "#fbfbfd",
    textColor: "#1d1d1f",
    fontHeading: "Inter",
    fontBody: "Inter",
    borderRadius: "12px",
    borderStyle: "1px solid #e5e5e7"
  },
  {
    id: "google-inspired",
    name: "Google Inspired",
    category: "Tech & Corporate",
    primaryColor: "#1a73e8",
    secondaryColor: "#34a853",
    backgroundColor: "#ffffff",
    textColor: "#202124",
    fontHeading: "Roboto",
    fontBody: "Roboto",
    borderRadius: "8px",
    borderStyle: "1px solid #dadce0"
  },
  {
    id: "tesla-inspired",
    name: "Tesla Inspired",
    category: "Futuristic & Tech",
    primaryColor: "#cc0000",
    secondaryColor: "#111111",
    backgroundColor: "#ffffff",
    textColor: "#111111",
    fontHeading: "Outfit",
    fontBody: "Inter",
    borderRadius: "2px",
    borderStyle: "1px solid #111111"
  },
  {
    id: "modern-ats",
    name: "Modern ATS",
    category: "ATS Optimized",
    primaryColor: "#1e3a8a",
    secondaryColor: "#2563eb",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    fontHeading: "Arial",
    fontBody: "Arial",
    borderRadius: "0px",
    borderStyle: "1px solid #cbd5e1"
  },
  {
    id: "creative-luxury",
    name: "Luxury",
    category: "Creative & Design",
    primaryColor: "#78350f",
    secondaryColor: "#d97706",
    backgroundColor: "#fffbeb",
    textColor: "#451a03",
    fontHeading: "Outfit",
    fontBody: "Inter",
    borderRadius: "6px",
    borderStyle: "1px solid #fde68a"
  }
];

export class ThemeEngine {
  static getTheme(themeId: string): ThemePreset {
    return THEME_PRESETS.find(t => t.id === themeId) || THEME_PRESETS[0];
  }
}
