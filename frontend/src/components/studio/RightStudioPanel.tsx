"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Sparkles,
  Layers,
  Sliders,
  Palette,
  History,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { ScoreGauge } from "@/components/ScoreGauge";
import { TemplateCategory, ThemeConfig, SectionType } from "@/types/resume";
import { templateRegistry } from "@/lib/templates/registry";
import { ThemeCustomizer } from "./ThemeCustomizer";
import { PropertyInspector } from "./PropertyInspector";
import { AICopilotTab } from "./AICopilotTab";

interface RightStudioPanelProps {
  activeTemplate: TemplateCategory;
  theme: ThemeConfig;
  onSelectTemplate: (id: TemplateCategory) => void;
  onUpdateTheme: (partial: Partial<ThemeConfig>) => void;
  onAddComponent: (type: SectionType) => void;
  onApplyAllAI: () => void;
  onSendAIPrompt: (prompt: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export type RightPanelTab =
  | "templates"
  | "ai"
  | "components"
  | "inspector"
  | "theme"
  | "versions"
  | "ats";

export function RightStudioPanel({
  activeTemplate,
  theme,
  onSelectTemplate,
  onUpdateTheme,
  onAddComponent,
  onApplyAllAI,
  onSendAIPrompt,
  isCollapsed,
  onToggleCollapse
}: RightStudioPanelProps) {
  const [activeTab, setActiveTab] = useState<RightPanelTab>("templates");
  const { atsDetails } = useResumeStore();

  if (isCollapsed) {
    return (
      <button
        onClick={onToggleCollapse}
        className="fixed right-3 top-20 z-30 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white shadow-xl hover:bg-slate-800 transition"
        title="Open Studio Panel"
      >
        <ChevronLeft className="w-5 h-5 text-blue-400" />
      </button>
    );
  }

  const templates = Object.values(templateRegistry);

  const availableComponents: Array<{ type: SectionType; label: string; desc: string }> = [
    { type: "experience", label: "Bloque de Experiencia", desc: "Línea de tiempo laboral con logros cuantificados STAR" },
    { type: "skills", label: "Matriz de Habilidades", desc: "Insignias de competencias y frameworks" },
    { type: "education", label: "Historial Académico", desc: "Títulos, universidades e investigación" },
    { type: "projects", label: "Proyectos & Portafolio", desc: "Tarjetas de proyectos con repositorios" },
    { type: "languages", label: "Competencia de Idiomas", desc: "Tags de dominio multilingüe" },
    { type: "achievements", label: "Insignias de Logros", desc: "Distinciones y premios profesionales" },
    { type: "certifications", label: "Certificaciones", desc: "Credenciales de la industria" }
  ];

  return (
    <aside className="w-80 glass-panel border-l border-slate-800/80 p-4 shrink-0 flex flex-col h-full bg-slate-950/95 text-slate-100 relative transition-all duration-300">
      {/* Header & Collapse Toggle */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sliders className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Panel Inteligente</h2>
        </div>

        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition"
          title="Collapse Panel (Smart Expand Canvas)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-3 border-b border-slate-800 shrink-0 text-[10px]">
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
            activeTab === "templates" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Plantillas</span>
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
            activeTab === "ai" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>AI Copilot</span>
        </button>

        <button
          onClick={() => setActiveTab("components")}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
            activeTab === "components" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Componentes</span>
        </button>

        <button
          onClick={() => setActiveTab("inspector")}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
            activeTab === "inspector" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab("theme")}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
            activeTab === "theme" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tema</span>
        </button>

        <button
          onClick={() => setActiveTab("ats")}
          className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
            activeTab === "ats" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ATS Live</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Tab 1: Plantillas */}
        {activeTab === "templates" && (
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>13 Categorías Premium</span>
              <span className="text-blue-400">Zero Data Loss</span>
            </div>

            <div className="space-y-2.5">
              {templates.map((tpl) => {
                const isSelected = activeTemplate === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => onSelectTemplate(tpl.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition space-y-2 ${
                      isSelected
                        ? "bg-blue-600/10 border-blue-500 shadow-md shadow-blue-500/10"
                        : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 text-xs">{tpl.name}</span>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${tpl.badgeColor}`}>
                        {tpl.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">{tpl.description}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[9px] font-mono">
                      <span className="text-emerald-400">ATS: {tpl.atsScoreRating}/100</span>
                      <span className="text-sky-400">Visual: {tpl.visualScoreRating}/100</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: AI Copilot */}
        {activeTab === "ai" && (
          <AICopilotTab onApplyAll={onApplyAllAI} onSendPrompt={onSendAIPrompt} />
        )}

        {/* Tab 3: Componentes */}
        {activeTab === "components" && (
          <div className="space-y-3 text-xs">
            <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Librería de Componentes</p>
            <div className="space-y-2">
              {availableComponents.map((comp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-200 text-xs">{comp.label}</p>
                    <p className="text-[10px] text-slate-400">{comp.desc}</p>
                  </div>
                  <button
                    onClick={() => onAddComponent(comp.type)}
                    className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-semibold text-[10px] border border-blue-500/30 transition shrink-0"
                  >
                    + Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Inspector */}
        {activeTab === "inspector" && <PropertyInspector />}

        {/* Tab 5: Colores & Tema */}
        {activeTab === "theme" && (
          <ThemeCustomizer theme={theme} onUpdateTheme={onUpdateTheme} />
        )}

        {/* Tab 6: Live ATS Score & Audit */}
        {activeTab === "ats" && (
          <div className="space-y-4 text-xs">
            <ScoreGauge score={atsDetails.score} />

            <div className="space-y-2">
              <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Diagnóstico de Optimización</h4>
              {atsDetails.diagnostics.length === 0 ? (
                <p className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 font-semibold">
                  ¡Excelente! Tu hoja de vida cumple con el 100% de los criterios ATS.
                </p>
              ) : (
                atsDetails.diagnostics.map((diag, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400">{diag.category}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 uppercase">
                        {diag.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{diag.message}</p>
                  </div>
                ))
              )}
            </div>

            {atsDetails.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Recomendaciones Clave</h4>
                <ul className="space-y-1.5">
                  {atsDetails.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
