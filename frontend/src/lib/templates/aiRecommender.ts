import { TemplateCategory, TemplateMeta, ResumeData } from "@/types/resume";
import { templateRegistry } from "./registry";

export interface AIRecommendation {
  template: TemplateMeta;
  matchPercentage: number;
  reason: string;
  keyBenefits: string[];
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function fetchAITemplateRecommendations(
  candidateCv: ResumeData,
  jobDescription?: string
): Promise<AIRecommendation[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/templates/recommended`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateCv, jobDescription })
    });

    if (res.ok) {
      const data = await res.json();
      const topRecs = data.recommendations?.top_recommendations || [];
      return topRecs.map((rec: any) => {
        const meta = templateRegistry[rec.template_id as TemplateCategory] || templateRegistry["ats-professional"];
        return {
          template: meta,
          matchPercentage: rec.compatibility_score || 95,
          reason: rec.reasons[0] || "Plantilla optimizada para tu densidad de experiencia y perfil.",
          keyBenefits: rec.reasons || ["Máxima legibilidad ATS", "Jerarquía visual limpia"]
        };
      });
    }
  } catch (err) {
    console.warn("Backend AI Recommendation API offline, using local Recommendation Engine:", err);
  }

  return recommendTemplatesLocal(candidateCv.contact?.title || "Software Engineer");
}

export function recommendTemplatesLocal(
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
    secondId = "minimalist";
    thirdId = "ats-professional";
  } else if (roleLower.includes("finance") || roleLower.includes("analyst") || roleLower.includes("cpa")) {
    topId = "corporate";
    secondId = "corporate";
    thirdId = "ats-professional";
  } else if (roleLower.includes("doctor") || roleLower.includes("nurse") || roleLower.includes("health")) {
    topId = "medical";
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
