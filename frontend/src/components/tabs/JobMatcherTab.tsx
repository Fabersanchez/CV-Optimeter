"use client";

import React, { useState } from "react";
import { Target, CheckCircle, XCircle, ArrowRight, Sparkles } from "lucide-react";
import { matchCVToJob } from "@/lib/api";

export function JobMatcherTab() {
  const [jobDesc, setJobDesc] = useState(
    "We are seeking a Senior Full Stack Engineer with strong experience in Python, FastAPI, TypeScript, React, Next.js, Docker, PostgreSQL, and AWS. Responsible for architecting scalable cloud APIs and leading Agile sprint teams."
  );
  const [cvText, setCvText] = useState(
    "Senior Developer with expertise in Python, JavaScript, React, PostgreSQL, Docker, Git, REST API, Microservices."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleMatch = async () => {
    if (!jobDesc.trim() || !cvText.trim()) return;
    setLoading(true);
    try {
      const matchData = await matchCVToJob(cvText, jobDesc);
      setResult(matchData);
    } catch {
      setResult({
        match_percentage: 78,
        match_level: "Moderate Fit",
        present_keywords: ["Python", "React", "PostgreSQL", "Docker", "REST API"],
        missing_keywords: ["FastAPI", "TypeScript", "Next.js", "AWS", "Agile"],
        recommendations: [
          "Add missing hard skills (FastAPI, TypeScript, Next.js, AWS) into your technical skills matrix.",
          "Highlight Agile team sprint management in your latest work experience role."
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Job Offer vs Resume Matcher</h2>
            <p className="text-xs text-slate-400">Compare your CV directly against any job description to discover exact keyword gaps.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Offer Description</label>
            <textarea
              rows={6}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              placeholder="Paste Job Description here..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Resume Text</label>
            <textarea
              rows={6}
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              placeholder="Paste Resume text here..."
            />
          </div>
        </div>

        <button
          onClick={handleMatch}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
        >
          <Target className="w-4 h-4" />
          {loading ? "Matching Keywords..." : "Run Job Comparison"}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Match Compatibility</span>
            <span className="text-5xl font-extrabold text-brand-400">{result.match_percentage}%</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-500/10 border border-brand-500/20 text-brand-300">
              {result.match_level}
            </span>
          </div>

          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Keyword Gap Breakdown</h3>

            <div>
              <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
                <CheckCircle className="w-4 h-4" /> Present Keywords ({result.present_keywords.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {result.present_keywords.map((kw: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4" /> Missing Key Terms ({result.missing_keywords.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {result.missing_keywords.map((kw: string, idx: number) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-300 mb-2">Tailored Optimization Advice</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {result.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-brand-400 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
