"use client";

import React, { useRef } from "react";
import { Undo2, Redo2, Palette, LayoutGrid, Sparkles, Download, Upload } from "lucide-react";
import { importDocumentIntelligence } from "@/lib/api/documentIntelligence";

interface StudioToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  activePanel: "templates" | "theme" | "sections" | "ai";
  setActivePanel: (panel: "templates" | "theme" | "sections" | "ai") => void;
  onOpenExport: () => void;
  onImportData?: (data: any) => void;
}

export function StudioToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  activePanel,
  setActivePanel,
  onOpenExport,
  onImportData
}: StudioToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await importDocumentIntelligence(file);
      if (onImportData) {
        onImportData(parsed);
      }
    } catch (err) {
      console.warn("Document Intelligence parse fallback:", err);
    }
  };

  return (
    <div className="glass-panel border-b border-slate-800/80 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md,.html"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <button
          onClick={() => setActivePanel("templates")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            activePanel === "templates"
              ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Plantillas (13)</span>
        </button>

        <button
          onClick={() => setActivePanel("theme")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            activePanel === "theme"
              ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Colores & Tema</span>
        </button>

        <button
          onClick={() => setActivePanel("ai")}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
            activePanel === "ai"
              ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span>AI Copilot</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        {/* Import Document Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition flex items-center gap-2"
          title="Import PDF, DOCX, TXT, MD or HTML"
        >
          <Upload className="w-4 h-4 text-sky-400" />
          <span>Importar CV</span>
        </button>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onOpenExport}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CV</span>
        </button>
      </div>
    </div>
  );
}
