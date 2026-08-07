import { ResumeData } from "@/types/resume";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface CareerCoachResponse {
  query: string;
  answer: string;
  readinessScore: number;
  nextActionItems: string[];
}

export interface LinkedInOptimizationResult {
  linkedinScore: number;
  headlineOptions: string[];
  aboutSummary: string;
  recommendedSkillBadges: string[];
  improvementSuggestions: string[];
}

export async function askCareerCoach(cvData: ResumeData, queryText: string): Promise<CareerCoachResponse> {
  const url = new URL(`${API_BASE_URL}/career/coach`);
  url.searchParams.append("query_text", queryText);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cvData)
  });

  if (!res.ok) {
    throw new Error(`Failed to ask career coach: ${res.statusText}`);
  }

  return await res.json();
}

export async function generateCoverLetterAPI(
  cvData: ResumeData,
  companyName: string = "Target Company",
  jobTitle: string = "Senior Engineer",
  tone: string = "Corporate"
): Promise<{ coverLetterText: string }> {
  const url = new URL(`${API_BASE_URL}/career/cover-letter`);
  url.searchParams.append("company_name", companyName);
  url.searchParams.append("job_title", jobTitle);
  url.searchParams.append("tone", tone);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cvData)
  });

  if (!res.ok) {
    throw new Error(`Failed to generate cover letter: ${res.statusText}`);
  }

  return await res.json();
}

export async function optimizeLinkedInAPI(cvData: ResumeData): Promise<LinkedInOptimizationResult> {
  const res = await fetch(`${API_BASE_URL}/career/linkedin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cvData)
  });

  if (!res.ok) {
    throw new Error(`Failed to optimize LinkedIn profile: ${res.statusText}`);
  }

  return await res.json();
}
