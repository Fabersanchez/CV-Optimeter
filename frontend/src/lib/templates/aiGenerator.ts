import { ThemeConfig, FontPairing } from "@/types/resume";

export function generateAITheme(prompt: string): ThemeConfig {
  const pLower = prompt.toLowerCase();

  let primaryColor = "#0284c7"; // Sky blue default
  let fontPairing: FontPairing = "inter";
  let headerStyle: "left-aligned" | "centered" | "banner" | "split" = "left-aligned";

  if (pLower.includes("fintech") || pLower.includes("banking") || pLower.includes("navy")) {
    primaryColor = "#0f172a";
    fontPairing = "roboto";
    headerStyle = "centered";
  } else if (pLower.includes("emerald") || pLower.includes("green") || pLower.includes("health")) {
    primaryColor = "#059669";
    fontPairing = "inter";
  } else if (pLower.includes("purple") || pLower.includes("executive") || pLower.includes("luxury")) {
    primaryColor = "#4338ca";
    fontPairing = "outfit";
    headerStyle = "banner";
  } else if (pLower.includes("code") || pLower.includes("developer") || pLower.includes("tech")) {
    primaryColor = "#0284c7";
    fontPairing = "fira-code";
  }

  return {
    primaryColor,
    secondaryColor: "#0f172a",
    accentColor: "#38bdf8",
    textColor: "#0f172a",
    backgroundColor: "#ffffff",
    fontPairing,
    fontSizeScale: "normal",
    spacingDensity: "normal",
    borderRadius: "md",
    layoutColumns: 1,
    headerStyle,
    dividerStyle: "solid"
  };
}
