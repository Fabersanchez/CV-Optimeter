"use client";

import React, { useState } from "react";
import { Search, LayoutGrid, Layers, Palette, Type, Layout, Star, Plus, Check } from "lucide-react";
import { TemplateCategory, ThemeConfig, SectionType } from "@/types/resume";
import { templateRegistry } from "@/lib/templates/registry";
import { ThemeCustomizer } from "./ThemeCustomizer";

interface ResourceLibraryProps {
  activeTemplate: TemplateCategory;
  theme: ThemeConfig;
  onSelectTemplate: (id: TemplateCategory) => void;
  onUpdateTheme: (partial: Partial<ThemeConfig>) => void;
  onAddComponent: (type: SectionType) => void;
}

export function ResourceLibrary({
  activeTemplate,
  theme,
  onSelectTemplate,
  onUpdateTheme,
  onAddComponent
}: ResourceLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"templates" | "components" | "colors" | "typography" | "layouts">("templates");
  const [addedComponent, setAddedComponent] = useState<string | null>(null);

  const templates = Object.values(templateRegistry).filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableComponents: Array<{ type: SectionType; label: string; desc: string }> = [
    { type: "experience", label: "Work Experience Block", desc: "Timeline of career roles and STAR metric accomplishments" },
    { type: "skills", label: "Technical Skills Matrix", desc: "Categorized skill badges and frameworks" },
    { type: "education", label: "Education & Academic Block", desc: "Degrees, institutions, and research GPA" },
    { type: "projects", label: "Projects & Portfolio Cards", desc: "Key project highlights and repository links" },
    { type: "languages", label: "Language Proficiency", desc: "Multilingual capability tags" },
    { type: "achievements", label: "Achievement Cards", desc: "Key career impact badges" },
    { type: "certifications", label: "Certifications Block", desc: "Industry accredited credentials" }
  ];

  const handleAddComponent = (comp: { type: SectionType; label: string }) => {
    onAddComponent(comp.type);
    setAddedComponent(comp.label);
    setTimeout(() => setAddedComponent(null), 2000);
  };

  return (
    <aside className="w-80 glass-panel border-l border-slate-800/80 p-4 shrink-0 overflow-y-auto max-h-[calc(100vh-120px)] space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates, components..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        />
      </div>

      {/* Library Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
            activeTab === "templates" ? "bg-brand-500 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Plantillas
        </button>
        <button
          onClick={() => setActiveTab("components")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
            activeTab === "components" ? "bg-brand-500 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Componentes
        </button>
        <button
          onClick={() => setActiveTab("colors")}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
            activeTab === "colors" ? "bg-brand-500 text-white" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Colores & Tema
        </button>
      </div>

      {/* Tab 1: Plantillas Gallery */}
      {activeTab === "templates" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">13 Premium Categories</span>
            <span className="text-[10px] text-brand-400 font-semibold">Zero Data Loss</span>
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
                      ? "bg-brand-500/10 border-brand-500 shadow-md"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{tpl.name}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${tpl.badgeColor}`}>
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

      {/* Tab 2: Insertable Component Blocks */}
      {activeTab === "components" && (
        <div className="space-y-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase">1-Click Component Library</span>

          {addedComponent && (
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Added {addedComponent} to Canvas!
            </div>
          )}

          <div className="space-y-2">
            {availableComponents.map((comp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-200">{comp.label}</p>
                  <p className="text-[10px] text-slate-400">{comp.desc}</p>
                </div>
                <button
                  onClick={() => handleAddComponent(comp)}
                  className="p-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 transition shrink-0"
                  title="Insert Component onto Canvas"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Colores & Tema Customizer */}
      {activeTab === "colors" && (
        <ThemeCustomizer theme={theme} onUpdateTheme={onUpdateTheme} />
      )}
    </aside>
  );
}
