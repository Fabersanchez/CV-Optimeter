"use client";

import React, { useState } from "react";
import { Sparkles, CheckCircle2, Wand2, ArrowUpRight, Zap, RefreshCw, Send } from "lucide-react";

interface AICopilotPanelProps {
  onApplyAll: () => void;
  onSendPrompt: (promptText: string) => void;
}

export function AICopilotPanel({ onApplyAll, onSendPrompt }: AICopilotPanelProps) {
  const [promptInput, setPromptInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAppliedMsg, setLastAppliedMsg] = useState<string | null>(null);

  const presets = [
    "Diseña un CV tipo Harvard",
    "Diseña un CV para Siemens",
    "Diseña un CV minimalista",
    "Diseña un CV ejecutivo"
  ];

  const handleSendPrompt = (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    onSendPrompt(text);
    setLastAppliedMsg(`Applied AI Design: "${text}"`);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  const handleApplyAll = () => {
    onApplyAll();
    setLastAppliedMsg("Applied all AI improvements! ATS Score lifted to 98/100.");
    setTimeout(() => setLastAppliedMsg(null), 4000);
  };

  return (
    <aside className="w-80 glass-panel border-r border-slate-800/80 p-4 shrink-0 flex flex-col justify-between overflow-y-auto max-h-[calc(100vh-120px)] space-y-5">
      <div className="space-y-5">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">AI Copilot Assistant</h2>
              <p className="text-[10px] text-slate-400">Real-Time Designer & ATS Auditor</p>
            </div>
          </div>
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ONLINE
          </span>
        </div>

        {/* Live Gauges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase">ATS Score</span>
            <p className="text-2xl font-extrabold text-emerald-400 font-mono">98 <span className="text-xs font-normal text-slate-500">/100</span></p>
            <span className="text-[9px] text-emerald-400 font-semibold">+18% vs baseline</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-center space-y-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Visual Impact</span>
            <p className="text-2xl font-extrabold text-sky-400 font-mono">96 <span className="text-xs font-normal text-slate-500">/100</span></p>
            <span className="text-[9px] text-sky-400 font-semibold">Executive Grade</span>
          </div>
        </div>

        {/* Actionable AI Audits */}
        <div className="space-y-2">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Smart Audit Suggestions</p>
          
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-[11px]">STAR Metrics Optimization</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">+12% ATS</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Quantified achievements added to experience bullet points.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 text-[11px]">Hard Skills Density</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">+8% Design</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Added technical skills matrix tags matching target roles.
            </p>
          </div>
        </div>

        {/* Apply All Improvements Button */}
        <button
          onClick={handleApplyAll}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-500 hover:to-sky-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition flex items-center justify-center gap-2"
        >
          <Wand2 className="w-4 h-4" />
          Aplicar todas las mejoras
        </button>

        {lastAppliedMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{lastAppliedMsg}</span>
          </div>
        )}

        {/* AI Prompt Graphic Designer Chat */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Conversational AI Graphic Designer</p>
          
          <div className="flex flex-wrap gap-1.5">
            {presets.map((pr, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(pr)}
                className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center gap-1"
              >
                <span>{pr}</span>
                <ArrowUpRight className="w-3 h-3 text-brand-400" />
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(promptInput)}
              placeholder="e.g. Diseña un CV tipo Harvard..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={() => handleSendPrompt(promptInput)}
              disabled={loading}
              className="absolute right-2 top-2 text-brand-400 hover:text-brand-300"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
