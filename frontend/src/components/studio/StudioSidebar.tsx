"use client";

import React, { useState } from "react";
import { TemplateCategory, ThemeConfig } from "@/types/resume";
import { TemplateGallery } from "./TemplateGallery";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { recommendTemplatesLocal, AIRecommendation } from "@/lib/templates/aiRecommender";
import { Sparkles, Check } from "lucide-react";

interface StudioSidebarProps {
  activePanel: "templates" | "theme" | "sections" | "ai";
  activeTemplate: TemplateCategory;
  theme: ThemeConfig;
  roleTitle: string;
  onSelectTemplate: (id: TemplateCategory) => void;
  onUpdateTheme: (partial: Partial<ThemeConfig>) => void;
}

export function StudioSidebar({
  activePanel,
  activeTemplate,
  theme,
  roleTitle,
  onSelectTemplate,
  onUpdateTheme
}: StudioSidebarProps) {
  const [aiPrompt, setAiPrompt] = useState(roleTitle || "Senior Software Engineer");
  const recommendations = recommendTemplatesLocal(aiPrompt);

  return (
    <aside className="w-80 glass-panel border-r border-slate-800/80 p-4 shrink-0 overflow-y-auto max-h-[calc(100vh-120px)] space-y-6">
      {activePanel === "templates" && (
        <TemplateGallery activeTemplate={activeTemplate} onSelectTemplate={onSelectTemplate} />
      )}

      {activePanel === "theme" && (
        <ThemeCustomizer theme={theme} onUpdateTheme={onUpdateTheme} />
      )}

      {activePanel === "ai" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">AI Template Recommender</h3>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-400">Target Role Title</label>
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              placeholder="e.g. Senior Data Scientist"
            />
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-[10px] font-extrabold uppercase text-slate-400">Top Recommended Templates</p>

            {recommendations.map((rec: AIRecommendation, idx: number) => (
              <div
                key={idx}
                onClick={() => onSelectTemplate(rec.template.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-2 ${
                  activeTemplate === rec.template.id
                    ? "bg-brand-500/10 border-brand-500 shadow-md"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{rec.template.name}</span>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rec.matchPercentage}% Match
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">{rec.reason}</p>

                <div className="space-y-1 pt-1 border-t border-slate-800">
                  {rec.keyBenefits.map((b: string, bIdx: number) => (
                    <p key={bIdx} className="text-[9px] text-slate-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" /> {b}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activePanel === "sections" && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Section Manager</h3>
          <p className="text-xs text-slate-400">Reorder sections by dragging or moving on the visual canvas.</p>
        </div>
      )}
    </aside>
  );
}
