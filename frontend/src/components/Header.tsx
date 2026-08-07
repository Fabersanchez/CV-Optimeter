"use client";

import React from "react";
import { Sparkles, ShieldCheck, Zap, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-brand-300">
              CV Optimeter <span className="text-brand-400 font-mono text-sm px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20">AI v1.0</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium">Enterprise ATS Optimization & Career AI Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          ATS Engine Online
        </div>

        <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-300" />
          </div>
          <div className="hidden sm:block text-left text-xs">
            <p className="font-semibold text-slate-200">Executive Plan</p>
            <p className="text-slate-400">Pro Candidate</p>
          </div>
        </div>
      </div>
    </header>
  );
}
