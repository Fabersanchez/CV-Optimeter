import { ResumeData } from "@/types/resume";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export interface QualityAuditResult {
  atsScore: number;
  visualScore: number;
  totalObservations: number;
  observations: Array<{
    severity: "CRITICAL" | "WARNING" | "INFO";
    category: string;
    issue: string;
    impact: string;
    recommendation: string;
  }>;
}

export async function importDocumentIntelligence(file: File): Promise<ResumeData> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/document/import`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    throw new Error(`Failed to import document: ${res.statusText}`);
  }

  return await res.json();
}

export async function auditDocumentQuality(cvData: ResumeData): Promise<QualityAuditResult> {
  const res = await fetch(`${API_BASE_URL}/document/quality-audit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cvData)
  });

  if (!res.ok) {
    throw new Error(`Failed to perform quality audit: ${res.statusText}`);
  }

  return await res.json();
}

export async function normalizeCandidateCV(cvData: ResumeData): Promise<ResumeData> {
  const res = await fetch(`${API_BASE_URL}/document/normalize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cvData)
  });

  if (!res.ok) {
    throw new Error(`Failed to normalize CV data: ${res.statusText}`);
  }

  return await res.json();
}
