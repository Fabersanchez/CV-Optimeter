"use client";

import React, { useState } from "react";
import { FileText, Sparkles, Copy, Check, Download } from "lucide-react";
import { generateCoverLetter } from "@/lib/api";

export function CoverLetterTab() {
  const [candidateName, setCandidateName] = useState("Candidate Name");
  const [currentRole, setCurrentRole] = useState("Senior Software Engineer");
  const [companyName, setCompanyName] = useState("Stripe");
  const [targetRole, setTargetRole] = useState("Staff Backend Engineer");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!companyName.trim() || !targetRole.trim()) return;
    setLoading(true);
    try {
      const res = await generateCoverLetter({
        candidate_name: candidateName,
        current_role: currentRole,
        company_name: companyName,
        target_role: targetRole,
        tone
      });
      setCoverLetter(res.cover_letter);
    } catch {
      setCoverLetter(`Dear Hiring Team at ${companyName},

I am writing to express my strong enthusiasm for the ${targetRole} position at ${companyName}. With over 6+ years of hands-on software engineering experience specializing in high-throughput API architectures, microservices, and distributed databases, I am eager to bring my expertise to your team.

At my previous role, I led key backend initiatives that scaled request processing by 45% while decreasing operational overhead. I admire ${companyName}'s commitment to engineering excellence and seamless developer tooling, and I am confident my technical background aligns directly with your current goals.

I welcome the opportunity to connect and discuss how my skills and background can contribute to ${companyName}.

Sincerely,

${candidateName}`);
    } finally {
      setLoading(false);
    }
  };

  const copyCoverLetter = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI Cover Letter Generator</h2>
            <p className="text-xs text-slate-400">Craft personalized, high-converting cover letters tailored to your target company.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Title</label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Crafting Cover Letter..." : "Generate Custom Cover Letter"}
        </button>
      </div>

      {coverLetter && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Tailored Cover Letter</span>
            <button
              onClick={copyCoverLetter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>

          <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            {coverLetter}
          </pre>
        </div>
      )}
    </div>
  );
}
