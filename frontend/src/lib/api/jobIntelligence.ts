import { ResumeData } from "@/types/resume";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface JobAnalysisResult {
  roleTitle: string;
  company: string;
  requiredSkills: string[];
  requiredExperienceYears: number;
  location: string;
  salaryRange: string;
}

export interface JobMatchResult {
  match: {
    overallMatch: number;
    technicalMatch: number;
    experienceMatch: number;
    educationMatch: number;
    atsMatch: number;
    skillsGap: {
      fulfilledSkills: string[];
      missingSkills: string[];
      coveragePercentage: number;
    };
  };
  readiness: {
    readinessLevel: string;
    readinessLabel: string;
    badgeColor: string;
    strengths: string[];
    weaknesses: string[];
    risks: string[];
  };
  roadmap: Array<{
    id: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    action: string;
    reason: string;
    estimatedEffort: string;
    difficulty: string;
    expectedBenefit: string;
  }>;
}

export async function parseJobOffer(jobText: string, url: string = ""): Promise<JobAnalysisResult> {
  const params = new URLSearchParams({ job_text: jobText, source_url: url });
  const res = await fetch(`${API_BASE_URL}/job-intelligence/parse-job?${params.toString()}`, {
    method: "POST"
  });

  if (!res.ok) {
    throw new Error(`Failed to parse job description: ${res.statusText}`);
  }

  return await res.json();
}

export async function matchCVToJobOffer(cvData: ResumeData, jobData: JobAnalysisResult): Promise<JobMatchResult> {
  const res = await fetch(`${API_BASE_URL}/job-intelligence/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_data: cvData, job_data: jobData })
  });

  if (!res.ok) {
    throw new Error(`Failed to match CV to job offer: ${res.statusText}`);
  }

  return await res.json();
}

export async function optimizeForJobVacancy(cvData: ResumeData, jobData: JobAnalysisResult): Promise<ResumeData> {
  const res = await fetch(`${API_BASE_URL}/job-intelligence/optimize-for-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_data: cvData, job_data: jobData })
  });

  if (!res.ok) {
    throw new Error(`Failed to optimize CV for vacancy: ${res.statusText}`);
  }

  return await res.json();
}
