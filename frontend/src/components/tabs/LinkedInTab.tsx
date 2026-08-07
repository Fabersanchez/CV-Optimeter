"use client";

import React, { useState } from "react";
import { Linkedin, Sparkles, Copy, Check, ShieldCheck } from "lucide-react";
import { optimizeLinkedIn } from "@/lib/api";

export function LinkedInTab() {
  const [targetRole, setTargetRole] = useState("Senior Full Stack Engineer");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await optimizeLinkedIn({
        target_role: targetRole,
        extracted_skills: ["Python", "TypeScript", "React", "Next.js", "FastAPI", "Docker"]
      });
      setData(res);
    } catch {
      setData({
        headlines: [
          { type: "Executive & Impact-Focused", text: "🚀 Senior Full Stack Engineer | Scaling Distributed APIs & React UI | Python • TypeScript • AWS" },
          { type: "Role & Specialty Centric", text: "Senior Full Stack Engineer | Specializing in FastAPI & Next.js | 6+ Years Experience" },
          { type: "Value Proposition Centric", text: "Helping SaaS Companies Build High-Performance Platforms with 99.9% Uptime | Senior Engineer" }
        ],
        about_section: "Results-driven Senior Full Stack Engineer dedicated to designing scalable microservices and intuitive web interfaces.",
        top_skills_to_feature: ["Python", "FastAPI", "TypeScript", "React", "Next.js", "System Architecture"]
      });
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Linkedin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">LinkedIn Profile Optimizer</h2>
            <p className="text-xs text-slate-400">Optimize your LinkedIn headline, summary, and skills to boost recruiter search impressions.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Target Professional Role</label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        <button
          onClick={handleOptimize}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-brand-600 hover:from-sky-500 hover:to-brand-500 text-xs font-bold text-white shadow-lg shadow-sky-600/30 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Optimizing LinkedIn..." : "Generate LinkedIn Profile Assets"}
        </button>
      </div>

      {data && (
        <div className="space-y-6">
          {/* Headlines */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Optimized Headline Alternatives</h3>
            <div className="space-y-3">
              {data.headlines.map((hl: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase">{hl.type}</span>
                    <p className="text-xs font-semibold text-slate-100 mt-0.5">{hl.text}</p>
                  </div>
                  <button
                    onClick={() => copyText(hl.text, idx)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition shrink-0"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">LinkedIn About / Summary Section</h3>
              <button
                onClick={() => copyText(data.about_section, 99)}
                className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
              >
                {copiedIndex === 99 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                Copy Summary
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 bg-slate-900/80 p-4 rounded-xl border border-slate-800 leading-relaxed">
              {data.about_section}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
