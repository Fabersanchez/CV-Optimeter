"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Search, Sparkles, Award, Eye, Layers, Filter } from "lucide-react";
import { TemplateCategory, ThemeConfig } from "@/types/resume";
import { templateRegistry } from "@/lib/templates/registry";
import { fetchAITemplateRecommendations, AIRecommendation } from "@/lib/templates/aiRecommender";
import { useDocumentSessionStore } from "@/lib/store/useDocumentSessionStore";
import { TemplateDetailModal } from "./TemplateDetailModal";
import { TemplateComparisonModal } from "./TemplateComparisonModal";

interface VisualTemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTemplate: TemplateCategory;
  theme: ThemeConfig;
  onSelectTemplate: (id: TemplateCategory) => void;
  onUpdateTheme: (partial: Partial<ThemeConfig>) => void;
}

const CATEGORIES = [
  "Todas", "ATS", "Professional", "Executive", "Corporate",
  "Technology", "Engineering", "Finance", "Medical", "Legal",
  "Academic", "Minimal", "Creative", "Startup"
];

const COLOR_SWATCHES = [
  { label: "Dark Gray", value: "#475569" },
  { label: "Royal Blue", value: "#2563eb" },
  { label: "Sky Blue", value: "#0284c7" },
  { label: "Cyan", value: "#0891b2" },
  { label: "Teal", value: "#0d9488" },
  { label: "Emerald", value: "#059669" },
  { label: "Gold", value: "#d97706" },
  { label: "Rose", value: "#e11d48" },
  { label: "Navy", value: "#0f172a" },
  { label: "Slate", value: "#334155" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Indigo", value: "#4f46e5" }
];

export const VisualTemplateSelectorModal: React.FC<VisualTemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  activeTemplate,
  theme,
  onSelectTemplate,
  onUpdateTheme
}) => {
  const sessionStore = useDocumentSessionStore();
  const [selectedColor, setSelectedColor] = useState(theme.primaryColor || "#0284c7");
  const [activeTab, setActiveTab] = useState<"GALLERY" | "AI_RECOMMENDED">("GALLERY");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [detailTemplate, setDetailTemplate] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const [aiRecs, setAiRecs] = useState<AIRecommendation[]>([]);

  useEffect(() => {
    if (isOpen && sessionStore.currentSession?.candidate_cv) {
      fetchAITemplateRecommendations(sessionStore.currentSession.candidate_cv)
        .then((recs) => setAiRecs(recs))
        .catch((e) => console.warn(e));
    }
  }, [isOpen, sessionStore.currentSession]);

  if (!isOpen) return null;

  const handleSelectColor = (color: string) => {
    setSelectedColor(color);
    onUpdateTheme({ primaryColor: color, accentColor: color });
  };

  const toggleComparisonId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setComparisonIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const templates = Object.values(templateRegistry).filter((tpl) => {
    const matchesCat =
      selectedCategory === "Todas" ||
      tpl.categoryName.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      {/* Sub-modals */}
      <TemplateDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        template={detailTemplate}
        onApplyTemplate={(id) => {
          onSelectTemplate(id);
          onClose();
        }}
      />

      <TemplateComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        selectedTemplateIds={comparisonIds}
        onApplyTemplate={(id) => {
          onSelectTemplate(id);
          onClose();
        }}
      />

      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header & Tabs */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">CV Optimeter Template Registry</h2>
            
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab("GALLERY")}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "GALLERY" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Biblioteca (20)</span>
              </button>
              <button
                onClick={() => setActiveTab("AI_RECOMMENDED")}
                className={`px-3 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  activeTab === "AI_RECOMMENDED" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Recomendación IA</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparisonIds.length > 0 && (
              <button
                onClick={() => setIsComparisonOpen(true)}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 transition"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Comparar ({comparisonIds.length})</span>
              </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery View Tab */}
        {activeTab === "GALLERY" ? (
          <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1 text-slate-200">
            {/* Search Bar & Color Swatches */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar plantilla por rol o tecnología..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Swatches */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-[10px] text-slate-400 font-mono mr-1">Color:</span>
                {COLOR_SWATCHES.map((swatch, idx) => {
                  const isActive = selectedColor.toLowerCase() === swatch.value.toLowerCase();
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectColor(swatch.value)}
                      style={{ backgroundColor: swatch.value }}
                      className={`w-5 h-5 rounded-full transition-transform border ${
                        isActive ? "scale-110 border-white ring-2 ring-blue-400" : "border-transparent hover:scale-105"
                      }`}
                      title={swatch.label}
                    />
                  );
                })}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl border transition shrink-0 ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white border-blue-500 font-bold"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template Cards Grid (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {templates.map((tpl) => {
                const isSelected = activeTemplate === tpl.id;
                const isCompared = comparisonIds.includes(tpl.id);

                return (
                  <div
                    key={tpl.id}
                    onClick={() => {
                      onSelectTemplate(tpl.id);
                      onClose();
                    }}
                    className={`group cursor-pointer rounded-2xl border-2 p-3 transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "border-blue-500 bg-blue-600/10 shadow-lg ring-2 ring-blue-500/20"
                        : "border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-950"
                    }`}
                  >
                    {/* Visual Card Thumbnail Header */}
                    <div className="space-y-2">
                      <div className={`h-24 rounded-xl bg-gradient-to-br ${tpl.previewGradient} p-3 flex flex-col justify-between shadow-inner relative overflow-hidden`}>
                        <div className="flex justify-between items-start">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${tpl.badgeColor}`}>
                            {tpl.badge}
                          </span>

                          <button
                            onClick={(e) => toggleComparisonId(tpl.id, e)}
                            className={`p-1 rounded-lg border text-[9px] font-mono flex items-center gap-1 transition ${
                              isCompared
                                ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                                : "bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-900"
                            }`}
                            title="Seleccionar para comparar"
                          >
                            <Award className="w-3 h-3" />
                            <span>{isCompared ? "Comparando" : "Comparar"}</span>
                          </button>
                        </div>

                        <div className="text-white">
                          <p className="text-xs font-bold truncate">{tpl.name}</p>
                          <p className="text-[10px] text-white/80 font-mono">ATS: {tpl.atsScoreRating}/100</p>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{tpl.description}</p>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailTemplate(tpl);
                          setIsDetailOpen(true);
                        }}
                        className="text-[11px] text-slate-400 hover:text-blue-400 font-semibold flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> Detalles
                      </button>

                      {isSelected ? (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Activa
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-blue-400 group-hover:translate-x-0.5 transition">
                          Aplicar →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* AI Recommended Tab */
          <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1 text-slate-200">
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-500/40">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-200">Recomendaciones Sintetizadas por IA</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Analizado tu CandidateCVSchema. La IA determinó las 3 plantillas con mayor compatibilidad ATS y densidad visual.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {aiRecs.map((rec, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                        {rec.matchPercentage}% Compatibilidad
                      </span>
                      <h4 className="font-bold text-slate-100 text-sm">{rec.template?.name}</h4>
                    </div>

                    <p className="text-xs text-sky-300 font-medium">"{rec.reason}"</p>

                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] text-slate-400 font-mono">
                      {rec.keyBenefits.map((b, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                          ✓ {b}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTemplate(rec.template.id);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition shrink-0"
                  >
                    <span>Aplicar Recomenda</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
