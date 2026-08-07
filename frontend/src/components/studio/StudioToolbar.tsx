"use client";

import React from "react";
import { Undo2, Redo2, Palette, LayoutGrid, Sparkles, Download, Eye, FileText } from "lucide-react";

interface StudioToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  activePanel: "templates" | "theme" | "sections" | "ai";
  setActivePanel: (panel: "templates" | "theme" | "sections" | "ai") => void;
  onOpenExport: () => void;
}

export function StudioToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  activePanel,
  setActivePanel,
  onOpenExport
}: StudioToolbarProps) {
  return (
    <div className="glass-panel border-b border-slate-800/80 px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
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
          <span>Templates (12)</span>
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
          <span>Theme & Styling</span>
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
          <span>AI Recommender</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
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
          <span>Export CV</span>
        </button>
      </div>
    </div>
  );
}
