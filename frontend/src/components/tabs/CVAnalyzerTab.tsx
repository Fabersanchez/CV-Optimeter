"use client";

import React, { useState } from "react";
import { UploadCloud, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, FileText, Zap, ChevronRight } from "lucide-react";
import { ParsedCVData, ATSAnalysisResult, uploadCVFile, analyzeATS } from "@/lib/api";
import { ScoreGauge } from "@/components/ScoreGauge";

interface CVAnalyzerTabProps {
  parsedData: ParsedCVData | null;
  setParsedData: (data: ParsedCVData | null) => void;
  atsResult: ATSAnalysisResult | null;
  setAtsResult: (res: ATSAnalysisResult | null) => void;
}

export function CVAnalyzerTab({ parsedData, setParsedData, atsResult, setAtsResult }: CVAnalyzerTabProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const parsed = await uploadCVFile(file);
      setParsedData(parsed);
      const ats = await analyzeATS(parsed);
      setAtsResult(ats);
    } catch (err: any) {
      setError(err.message || "Failed to process document.");
    } finally {
      setLoading(false);
    }
  };

  const loadSampleCV = async () => {
    setLoading(true);
    setError(null);
    const mockParsed: ParsedCVData = {
      filename: "Alex_Morgan_Resume_2026.pdf",
      raw_text: "Alex Morgan\nalex.morgan@devmail.io | +1 (555) 234-5678 | linkedin.com/in/alex-morgan-tech\n\nPROFESSIONAL SUMMARY\nResults-driven Senior Software Engineer with 6+ years of experience building high-performance web platforms and distributed microservices using Python, TypeScript, React, and PostgreSQL.\n\nEXPERIENCE\nSenior Full Stack Developer | TechPulse Innovations (2023 - Present)\n• Spearheaded migration of legacy monolith to FastAPI microservices, reducing API response times by 45%.\n• Architected scalable real-time data streaming pipeline using Redis and Docker, handling 2M+ daily requests.\n• Managed cross-functional team of 6 engineers to deliver enterprise SaaS product 2 weeks ahead of deadline.\n\nSoftware Engineer | CloudScale Systems (2020 - 2023)\n• Developed responsive web applications using React, Next.js, and Tailwind CSS.\n• Increased test coverage from 60% to 92% with unit and end-to-end integration tests.\n\nTECHNICAL SKILLS\nPython, JavaScript, TypeScript, React, Next.js, FastAPI, Node.js, PostgreSQL, Redis, Docker, AWS, Git, REST API, GraphQL, CI/CD",
      word_count: 320,
      contact_info: {
        name: "Alex Morgan",
        email: "alex.morgan@devmail.io",
        phone: "+1 (555) 234-5678",
        linkedin: "https://linkedin.com/in/alex-morgan-tech",
        github: "https://github.com/alex-morgan"
      },
      sections: {
        summary: "Results-driven Senior Software Engineer with 6+ years of experience building high-performance web platforms.",
        experience: "Senior Full Stack Developer | TechPulse Innovations (2023 - Present)\n• Spearheaded migration of legacy monolith to FastAPI microservices, reducing API response times by 45%.\n• Architected scalable real-time data streaming pipeline using Redis and Docker, handling 2M+ daily requests.\n• Managed cross-functional team of 6 engineers to deliver enterprise SaaS product 2 weeks ahead of deadline.",
        education: "B.S. Computer Science | University of Technology (2016 - 2020)",
        skills: "Python, JavaScript, TypeScript, React, Next.js, FastAPI, Node.js, PostgreSQL, Redis, Docker, AWS",
        projects: "CV Optimeter AI SaaS Platform",
        certifications: "AWS Certified Solutions Architect"
      },
      extracted_skills: ["Python", "JavaScript", "TypeScript", "React", "Next.js", "FastAPI", "Node.js", "PostgreSQL", "Redis", "Docker", "AWS", "Git", "REST API", "GraphQL"]
    };

    setParsedData(mockParsed);
    try {
      const ats = await analyzeATS(mockParsed);
      setAtsResult(ats);
    } catch {
      // Fallback local ATS state if offline
      setAtsResult({
        overall_score: 92,
        grade: "A+ (ATS Ready)",
        grade_color: "emerald",
        breakdown: {
          action_verbs: { score: 20, max: 20, count: 6 },
          measurable_metrics: { score: 18, max: 20, count: 4 },
          hard_skills: { score: 24, max: 25, count: 14 },
          formatting_structure: { score: 18, max: 20 },
          brevity_length: { score: 12, max: 15, word_count: 320 }
        },
        diagnostics: [
          { severity: "LOW", category: "Quantifiable Impact", message: "Consider adding 1 more metric in the CloudScale role to reach maximum ATS quantification." }
        ],
        recommendations: [
          "Include target job keywords when tailoring this resume for specific roles.",
          "Keep contact header formatted clearly at the top."
        ],
        found_skills: mockParsed.extracted_skills,
        found_action_verbs: ["spearheaded", "architected", "managed", "developed", "increased"],
        metrics_detected: ["45%", "2M+", "2 weeks", "60%", "92%"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 justify-center md:justify-start">
              <UploadCloud className="w-5 h-5 text-brand-400" />
              Upload & Analyze Resume
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Upload your PDF or DOCX file for instant AI parsing and multi-category ATS scoring engine analysis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={loadSampleCV}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition border border-slate-700 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-brand-400" />
              Load Demo Resume
            </button>

            <label className="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-xs font-semibold text-white shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2">
              <UploadCloud className="w-4 h-4" />
              {loading ? "Processing..." : "Upload PDF / DOCX"}
              <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {atsResult && parsedData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gauge & Metrics Breakdown */}
          <div className="space-y-6">
            <ScoreGauge score={atsResult.overall_score} />

            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Score Breakdown</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Action Verbs & Impact</span>
                    <span className="font-mono font-bold text-brand-400">{atsResult.breakdown.action_verbs.score}/20</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800">
                    <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${(atsResult.breakdown.action_verbs.score / 20) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Measurable Metrics</span>
                    <span className="font-mono font-bold text-sky-400">{atsResult.breakdown.measurable_metrics.score}/20</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800">
                    <div className="h-1.5 rounded-full bg-sky-500" style={{ width: `${(atsResult.breakdown.measurable_metrics.score / 20) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Hard Skills & Keywords</span>
                    <span className="font-mono font-bold text-emerald-400">{atsResult.breakdown.hard_skills.score}/25</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800">
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${(atsResult.breakdown.hard_skills.score / 25) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Formatting & Structure</span>
                    <span className="font-mono font-bold text-purple-400">{atsResult.breakdown.formatting_structure.score}/20</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800">
                    <div className="h-1.5 rounded-full bg-purple-500" style={{ width: `${(atsResult.breakdown.formatting_structure.score / 20) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostics & Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Extracted Contact Info */}
            <div className="glass-panel p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Parsed Candidate Profile</h3>
                <span className="text-[10px] text-slate-400">{parsedData.word_count} words parsed</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Name</p>
                  <p className="font-medium text-slate-200 truncate">{parsedData.contact_info.name}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Email</p>
                  <p className="font-medium text-slate-200 truncate">{parsedData.contact_info.email}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Phone</p>
                  <p className="font-medium text-slate-200 truncate">{parsedData.contact_info.phone}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">LinkedIn</p>
                  <p className="font-medium text-brand-400 truncate">{parsedData.contact_info.linkedin !== "Not detected" ? "Connected" : "Missing"}</p>
                </div>
              </div>
            </div>

            {/* Diagnostics List */}
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">ATS Audit Diagnostics</h3>
              {atsResult.diagnostics.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  No critical formatting or structural issues detected!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {atsResult.diagnostics.map((diag, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3 text-xs">
                      {diag.severity === "HIGH" ? (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      ) : diag.severity === "MEDIUM" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <Zap className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200">{diag.category}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            diag.severity === "HIGH" ? "bg-rose-500/20 text-rose-300" :
                            diag.severity === "MEDIUM" ? "bg-amber-500/20 text-amber-300" : "bg-sky-500/20 text-sky-300"
                          }`}>
                            {diag.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-0.5">{diag.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Extracted Skills Cloud */}
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Detected Hard Skills ({parsedData.extracted_skills.length})</h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.extracted_skills.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
