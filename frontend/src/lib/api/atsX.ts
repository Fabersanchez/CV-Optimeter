import { ResumeData } from "@/types/resume";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface ATSXAnalysisResult {
  overallScore: number;
  dimensions: {
    atsCompatibility: number;
    visualQuality: number;
    readability: number;
    hierarchy: number;
    workExperience: number;
    education: number;
    skillsDensity: number;
    quantifiedAchievements: number;
    actionVerbs: number;
    consistency: number;
    keywordMatch: number;
    professionalImpact: number;
  };
  keywordAnalysis: {
    hardSkillsFound: string[];
    actionVerbsCount: number;
    actionVerbsFound: string[];
    weakWordsFound: string[];
    missingRecommendedKeywords: string[];
    keywordDensityScore: number;
  };
  achievementAnalysis: {
    totalBullets: number;
    quantifiedBullets: number;
    quantifiedRatio: number;
    achievementScore: number;
  };
  simulations: Record<string, {
    name: string;
    score: number;
    status: "PASS" | "REVIEW" | "FAIL";
    description: string;
  }>;
}

export async function runATSXAnalysis(cvData: ResumeData): Promise<ATSXAnalysisResult> {
  const res = await fetch(`${API_BASE_URL}/ats-x/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cvData)
  });

  if (!res.ok) {
    throw new Error(`Failed to run ATS-X analysis: ${res.statusText}`);
  }

  return await res.json();
}
