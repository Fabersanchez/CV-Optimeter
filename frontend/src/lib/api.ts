const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface ParsedCVData {
  raw_text: string;
  filename: string;
  word_count: number;
  contact_info: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
  sections: {
    summary: string;
    experience: string;
    education: string;
    skills: string;
    projects: string;
    certifications: string;
  };
  extracted_skills: string[];
}

export interface ATSAnalysisResult {
  overall_score: number;
  grade: string;
  grade_color: string;
  breakdown: {
    action_verbs: { score: number; max: number; count: number };
    measurable_metrics: { score: number; max: number; count: number };
    hard_skills: { score: number; max: number; count: number };
    formatting_structure: { score: number; max: number };
    brevity_length: { score: number; max: number; word_count: number };
  };
  diagnostics: Array<{ severity: string; category: string; message: string }>;
  recommendations: string[];
  found_skills: string[];
  found_action_verbs: string[];
  metrics_detected: string[];
}

export async function uploadCVFile(file: File): Promise<ParsedCVData> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/cv/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to upload file" }));
    throw new Error(errorData.detail || "Error uploading file.");
  }

  const result = await res.json();
  return result.data;
}

export async function analyzeATS(parsedCV: ParsedCVData, jobDesc: string = ""): Promise<ATSAnalysisResult> {
  const res = await fetch(`${API_BASE}/ats/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ parsed_cv: parsedCV, target_job_description: jobDesc }),
  });

  if (!res.ok) {
    throw new Error("Failed to calculate ATS score.");
  }

  const result = await res.json();
  return result.analysis;
}

export async function matchCVToJob(cvText: string, jobDescription: string) {
  const res = await fetch(`${API_BASE}/ats/match-job`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cv_text: cvText, job_description: jobDescription }),
  });

  if (!res.ok) {
    throw new Error("Failed to match job description.");
  }

  const result = await res.json();
  return result.match;
}

export async function rewriteBulletPoint(bulletText: string, tone: string = "executive", targetRole: string = "") {
  const res = await fetch(`${API_BASE}/ai/rewrite-bullet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bullet_text: bulletText, tone, target_role: targetRole }),
  });

  if (!res.ok) {
    throw new Error("Failed to rewrite bullet point.");
  }

  const result = await res.json();
  return result.result;
}

export async function generateCoverLetter(params: {
  candidate_name?: string;
  current_role?: string;
  company_name: string;
  target_role: string;
  job_description?: string;
  cv_text?: string;
  tone?: string;
}) {
  const res = await fetch(`${API_BASE}/cover-letter/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to generate cover letter.");
  }

  const result = await res.json();
  return result.data;
}

export async function optimizeLinkedIn(params: {
  cv_summary?: string;
  target_role?: string;
  extracted_skills?: string[];
}) {
  const res = await fetch(`${API_BASE}/linkedin/optimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Failed to optimize LinkedIn profile.");
  }

  const result = await res.json();
  return result.data;
}

export async function fetchDashboardMetrics() {
  const res = await fetch(`${API_BASE}/metrics/stats`);
  if (!res.ok) {
    throw new Error("Failed to fetch dashboard metrics.");
  }
  const result = await res.json();
  return result.metrics;
}
