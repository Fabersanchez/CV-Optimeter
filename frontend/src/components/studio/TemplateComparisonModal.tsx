"use client";

import React, { useState, useEffect } from "react";
import { X, Award, Check, Layers, ArrowRight } from "lucide-react";
import { templateRegistry } from "@/lib/templates/registry";
import { TemplateMeta } from "@/types/resume";

interface TemplateComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateIds: string[];
  onApplyTemplate: (templateId: any) => void;
}

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export function TemplateComparisonModal({
  isOpen,
  onClose,
  selectedTemplateIds,
  onApplyTemplate
}: TemplateComparisonModalProps) {
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedTemplateIds.length > 0) {
      setLoading(true);
      fetch(`${API_BASE_URL}/templates/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateIds: selectedTemplateIds })
      })
        .then((res) => res.json())
        .then((data) => {
          setComparisonData(data.comparison);
          setLoading(false);
        })
        .catch((err) => {
          console.warn("Backend Comparison API offline, using client fallback:", err);
          setLoading(false);
        });
    }
  }, [isOpen, selectedTemplateIds]);

  if (!isOpen) return null;

  const templatesToCompare: TemplateMeta[] = selectedTemplateIds
    .map((id) => templateRegistry[id as keyof typeof templateRegistry])
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">Template Side-by-Side Comparison</h2>
              <p className="text-[11px] text-slate-400">Comparativa técnica de ATS, legibilidad visual y densidad grid.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-Side Grid */}
        <div className="py-6 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templatesToCompare.map((t, idx) => {
              const status = idx === 0 ? "WINNER" : idx === 1 ? "RECOMMENDED" : "GOOD ALTERNATIVE";
              const statusColor =
                status === "WINNER"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : status === "RECOMMENDED"
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                  : "bg-slate-800 text-slate-300 border-slate-700";

              return (
                <div key={t.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${statusColor}`}>
                        {status}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {t.id}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-100 text-sm">{t.name}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">ATS Rating:</span>
                        <span className="text-emerald-400 font-bold">{t.atsScoreRating}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Visual Impact:</span>
                        <span className="text-sky-400 font-bold">{t.visualScoreRating}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Grid Layout:</span>
                        <span className="text-slate-200">{t.defaultTheme?.layoutColumns || 1} Col</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onApplyTemplate(t.id);
                      onClose();
                    }}
                    className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold flex items-center justify-center gap-1.5 transition mt-4"
                  >
                    <span>Aplicar Plantilla</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
