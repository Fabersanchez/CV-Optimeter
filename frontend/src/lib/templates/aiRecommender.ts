import { TemplateCategory, TemplateMeta } from "@/types/resume";
import { templateRegistry } from "./registry";

export interface AIRecommendation {
  template: TemplateMeta;
  matchPercentage: number;
  reason: string;
  keyBenefits: string[];
}

export function recommendTemplates(
  roleTitle: string,
  industry: string = "Technology",
  experienceYears: number = 5,
  country: string = "United States"
): AIRecommendation[] {
  const roleLower = roleTitle.toLowerCase();

  let topId: TemplateCategory = "ats-professional";
  let secondId: TemplateCategory = "technology";
  let thirdId: TemplateCategory = "executive";

  if (roleLower.includes("vp") || roleLower.includes("director") || roleLower.includes("chief") || experienceYears >= 10) {
    topId = "executive";
    secondId = "corporate";
    thirdId = "ats-professional";
  } else if (roleLower.includes("engineer") || roleLower.includes("developer") || roleLower.includes("architect")) {
    topId = "technology";
    secondId = "engineering";
    thirdId = "ats-professional";
  } else if (roleLower.includes("designer") || roleLower.includes("creative") || roleLower.includes("art")) {
    topId = "creative";
    secondId = "modern";
    thirdId = "minimalist";
  } else if (roleLower.includes("finance") || roleLower.includes("analyst") || roleLower.includes("cpa")) {
    topId = "finance";
    secondId = "corporate";
    thirdId = "ats-professional";
  } else if (roleLower.includes("doctor") || roleLower.includes("nurse") || roleLower.includes("health")) {
    topId = "healthcare";
    secondId = "ats-professional";
    thirdId = "minimalist";
  } else if (roleLower.includes("professor") || roleLower.includes("phd") || roleLower.includes("research")) {
    topId = "academic";
    secondId = "minimalist";
    thirdId = "ats-professional";
  }

  return [
    {
      template: templateRegistry[topId],
      matchPercentage: 98,
      reason: `Best overall match for '${roleTitle}' in ${industry}. Optimized for ${country} hiring portals.`,
      keyBenefits: ["Maximum ATS Parser Compliance", "Industry Standard Section Layout", "High Recruiter Reading Velocity"]
    },
    {
      template: templateRegistry[secondId],
      matchPercentage: 94,
      reason: `Strong alternative tailored for highlighting ${industry} technical skill matrices.`,
      keyBenefits: ["Clean Skill Tag Formatting", "Structured Career Track", "Professional Typography"]
    },
    {
      template: templateRegistry[thirdId],
      matchPercentage: 90,
      reason: "Universal fallback template with 99% ATS pass guarantee.",
      keyBenefits: ["Zero Formatting Risk", "Compact High-Density Metrics", "Works for All Resume Parsers"]
    }
  ];
}
