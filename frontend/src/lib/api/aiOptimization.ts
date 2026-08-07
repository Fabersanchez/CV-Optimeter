import { ResumeData } from "@/types/resume";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface AIOptimizationResult {
  optimizedCV: ResumeData;
  diffComparison: {
    totalChanges: number;
    overallConfidence: number;
    changes: Array<{
      section: string;
      whatChanged: string;
      whyChanged: string;
      expectedImpact: string;
      confidenceScore: number;
    }>;
  };
}

export async function optimizeCV(
  cvData: ResumeData,
  targetSection?: string,
  tone: string = "Executive"
): Promise<AIOptimizationResult> {
  const url = new URL(`${API_BASE_URL}/ai-optimization/optimize`);
  if (targetSection) url.searchParams.append("target_section", targetSection);
  url.searchParams.append("tone", tone);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cvData)
  });

  if (!res.ok) {
    throw new Error(`Failed to optimize CV: ${res.statusText}`);
  }

  return await res.json();
}
