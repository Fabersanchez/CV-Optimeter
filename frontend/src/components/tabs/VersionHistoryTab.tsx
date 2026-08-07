"use client";

import React from "react";
import { History, GitCommit, ArrowRight, RotateCcw } from "lucide-react";

export function VersionHistoryTab() {
  const versions = [
    {
      version: "v1.3 (Current)",
      date: "2026-08-07 10:15 AM",
      atsScore: 92,
      changes: "Added STAR metrics to TechPulse roles, included FastAPI & Next.js skills.",
      active: true
    },
    {
      version: "v1.2",
      date: "2026-08-02 04:30 PM",
      atsScore: 84,
      changes: "Quantified lead developer experience with % improvements.",
      active: false
    },
    {
      version: "v1.1",
      date: "2026-07-28 11:00 AM",
      atsScore: 75,
      changes: "Fixed contact header formatting and email structure.",
      active: false
    },
    {
      version: "v1.0 (Original)",
      date: "2026-07-15 09:00 AM",
      atsScore: 58,
      changes: "Initial PDF document import.",
      active: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Version Control & Revision History</h2>
            <p className="text-xs text-slate-400">Track iterations, audit ATS score improvements, and restore previous iterations.</p>
          </div>
        </div>

        <div className="space-y-3">
          {versions.map((ver, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
              ver.active ? "bg-brand-500/10 border-brand-500/30" : "bg-slate-900/60 border-slate-800"
            }`}>
              <div className="flex items-start gap-3">
                <GitCommit className={`w-5 h-5 mt-0.5 ${ver.active ? "text-brand-400" : "text-slate-500"}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-100">{ver.version}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ver.date}</span>
                    {ver.active && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{ver.changes}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs font-mono font-bold text-emerald-400">ATS: {ver.atsScore}/100</span>
                {!ver.active && (
                  <button className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition">
                    <RotateCcw className="w-3.5 h-3.5" /> Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
