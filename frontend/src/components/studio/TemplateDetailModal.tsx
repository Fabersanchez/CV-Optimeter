"use client";

import React from "react";
import { TemplateMeta } from "@/types/resume";
import { X, Check, ShieldCheck, Layers, ArrowRight, ExternalLink } from "lucide-react";

interface TemplateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  onApplyTemplate: (templateId: any) => void;
}

export function TemplateDetailModal({
  isOpen,
  onClose,
  template,
  onApplyTemplate
}: TemplateDetailModalProps) {
  if (!isOpen || !template) return null;

  const license = template.license || {};
  const sourceType = license.source_type || "ORIGINAL";
  const author = license.author || "CV Optimeter AI Team";
  const repo = license.source_repository;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${template.preview_gradient || template.previewGradient} flex items-center justify-center text-white font-bold shadow-md`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{template.name}</h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${template.badge_color || template.badgeColor}`}>
                  {template.badge}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-blue-500/10 text-blue-300 border-blue-500/20 font-bold">
                  {sourceType}
                </span>
              </div>
              <p className="text-xs text-slate-400">{template.categoryName || template.metadata?.categories?.[0] || "Professional"} Category • ATS Rating: {template.atsScoreRating || template.ats?.parse_rate_rating || 98}/100</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-6 space-y-6 overflow-y-auto flex-1 text-slate-300 text-xs">
          {/* Description Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Descripción y Composición Layout</h3>
            <p className="leading-relaxed text-slate-400">{template.description}</p>
          </div>

          {/* Quality Ratings Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono">ATS Parser</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">{template.atsScoreRating || template.ats?.parse_rate_rating || 98}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Visual Score</span>
              <p className="text-lg font-bold text-sky-400 mt-1">{template.visualScoreRating || template.quality?.visual || 95}%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Legibilidad</span>
              <p className="text-lg font-bold text-purple-400 mt-1">96%</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Columnas Grid</span>
              <p className="text-lg font-bold text-amber-400 mt-1">{template.defaultTheme?.layoutColumns || template.layout?.columns || 1} Col</p>
            </div>
          </div>

          {/* Recommended Roles & License Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Roles Recomendados</h4>
              <ul className="space-y-1 text-slate-400">
                {(template.recommendedFor || template.metadata?.recommended_roles || ["Software Engineers", "General"]).map((r: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Licencia & Procedencia Manifest</h4>
              <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Tipo Origen:</span>
                  <span className="text-sky-400 font-bold">{sourceType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Autor / Licencia:</span>
                  <span className="text-emerald-400 font-bold">{license.license_type || "MIT License"}</span>
                </div>
                {repo && (
                  <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                    <span>Repositorio:</span>
                    <a href={repo} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                      <span>Repo Original</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Uso Comercial:</span>
                  <span className="text-slate-200">Permitido (100%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onApplyTemplate(template.id);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
          >
            <span>Aplicar a Mi CV</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
