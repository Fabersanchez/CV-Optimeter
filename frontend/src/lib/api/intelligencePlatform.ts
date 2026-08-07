import { ResumeData } from "@/types/resume";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface ExecutiveDashboardMetrics {
  atsScore: number;
  visualScore: number;
  professionalScore: number;
  completenessScore: number;
  interviewReadiness: number;
  linkedinScore: number;
  portfolioScore: number;
  careerScore: number;
  radarDimensions: Array<{
    subject: string;
    score: number;
    fullMark: number;
  }>;
}

export interface CandidateDNAResult {
  candidateId: string;
  candidateName: string;
  primaryTitle: string;
  targetIndustry: string;
  seniorityLevel: string;
  primaryLanguage: string;
  topSkills: string[];
  preferredTemplates: string[];
  preferredTone: string;
  certifications: string[];
}

export async function fetchDashboardMetrics(): Promise<ExecutiveDashboardMetrics> {
  const res = await fetch(`${API_BASE_URL}/intelligence/dashboard`);
  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard metrics: ${res.statusText}`);
  }
  return await res.json();
}

export async function fetchCandidateDNA(cvData: ResumeData): Promise<CandidateDNAResult> {
  const res = await fetch(`${API_BASE_URL}/intelligence/resume-dna`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cvData)
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch candidate DNA: ${res.statusText}`);
  }
  return await res.json();
}
