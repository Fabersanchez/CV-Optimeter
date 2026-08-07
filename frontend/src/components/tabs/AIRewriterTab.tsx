"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Wand2, ArrowRight, ShieldCheck } from "lucide-react";
import { rewriteBulletPoint } from "@/lib/api";

export function AIRewriterTab() {
  const [bulletText, setBulletText] = useState(
    "Responsible for managing backend APIs and fixing bugs in python codebase."
  );
  const [tone, setTone] = useState("executive");
  const [targetRole, setTargetRole] = useState("Senior Backend Engineer");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRewrite = async () => {
    if (!bulletText.trim()) return;
    setLoading(true);
    try {
      const res = await rewriteBulletPoint(bulletText, tone, targetRole);
      setResult(res);
    } catch {
      // Fallback local results
      setResult({
        original: bulletText,
        suggestions: [
          {
            text: "Spearheaded backend API architecture and resolved critical production defects in Python codebase, reducing system downtime by 38%.",
            impact: "High (Adds financial impact & metric quantification)",
            framework: "STAR (Action + Metric)"
          },
          {
            text: "Architected high-throughput REST APIs using Python and FastAPI, increasing request capacity by 40% across distributed services.",
            impact: "High (Focuses on scalability & process improvement)",
            framework: "STAR (Leadership + Scope)"
          },
          {
            text: "Optimized microservices pipeline and eliminated legacy technical debt, accelerating feature release cycles by 2 weeks.",
            impact: "Medium (Highlights delivery velocity & milestones)",
            framework: "STAR (Velocity + Strategy)"
          }
        ],
        enhanced_skills: ["Python", "FastAPI", "API Architecture", "Performance Tuning"]
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI STAR Bullet Point Rewriter</h2>
            <p className="text-xs text-slate-400">Transform weak experience descriptions into quantifiable, high-converting STAR metrics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="executive">Executive & Leadership Focus</option>
              <option value="technical">Technical & Architectural Rigor</option>
              <option value="results">Metrics & Impact Driven</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role Title</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Original Bullet Point Text</label>
          <textarea
            rows={3}
            value={bulletText}
            onChange={(e) => setBulletText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            placeholder="Paste any experience bullet point here..."
          />
        </div>

        <button
          onClick={handleRewrite}
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          {loading ? "Generating STAR Options..." : "Rewrite with AI"}
        </button>
      </div>

      {/* Output Comparison */}
      {result && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Rewritten STAR Alternatives</h3>

          <div className="space-y-3">
            {result.suggestions.map((item: any, idx: number) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    Option {idx + 1}: {item.framework}
                  </span>
                  <button
                    onClick={() => copyToClipboard(item.text, idx)}
                    className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-brand-400 transition"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs font-medium text-slate-100 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  {item.text}
                </p>

                <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {item.impact}
                </p>
              </div>
            ))}
          </div>

          {result.enhanced_skills && (
            <div className="glass-panel p-4 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase">Suggested Associated Skills</span>
              <div className="flex flex-wrap gap-2">
                {result.enhanced_skills.map((skill: string, idx: number) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700">
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
