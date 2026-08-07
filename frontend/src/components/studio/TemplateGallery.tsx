"use client";

import React from "react";
import { TemplateCategory } from "@/types/resume";
import { templateRegistry } from "@/lib/templates/registry";
import { Check, Sparkles } from "lucide-react";

interface TemplateGalleryProps {
  activeTemplate: TemplateCategory;
  onSelectTemplate: (id: TemplateCategory) => void;
}

export function TemplateGallery({ activeTemplate, onSelectTemplate }: TemplateGalleryProps) {
  const templates = Object.values(templateRegistry);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Template Catalog (12)</h3>
        <span className="text-[10px] text-brand-400 font-semibold">100% Swappable • Zero Data Loss</span>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
        {templates.map((tpl) => {
          const isSelected = activeTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 space-y-2 relative group ${
                isSelected
                  ? "bg-brand-500/10 border-brand-500 shadow-md shadow-brand-500/20"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{tpl.name}</span>
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md border ${tpl.badgeColor}`}>
                  {tpl.badge}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">{tpl.description}</p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 font-mono">ATS Rating: {tpl.atsScoreRating}/100</span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-brand-400">
                    <Check className="w-3.5 h-3.5" /> Active
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
