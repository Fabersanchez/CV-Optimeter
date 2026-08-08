"use client";

import React, { useState } from "react";
import { ResumeData, ThemeConfig, TemplateCategory } from "@/types/resume";
import { TemplateRenderer } from "./TemplateRenderer";
import { ZoomIn, ZoomOut, Maximize2, FileCheck, Grid, Eye, Terminal, Layers, Columns, Sliders, Award } from "lucide-react";
import { SmartGridOverlay } from "./SmartGridOverlay";
import { FloatingFormatToolbar } from "./FloatingFormatToolbar";
import { DocumentSession, ViewMode } from "@/lib/store/useDocumentSessionStore";
import { OriginalDocumentViewer } from "./OriginalDocumentViewer";
import { RenderComparisonViewer } from "./RenderComparisonViewer";
import { OverlayDocumentViewer } from "./OverlayDocumentViewer";
import { DocumentDebuggerModal } from "./DocumentDebuggerModal";
import { VisualFidelityScorecard } from "./VisualFidelityScorecard";

interface VisualCanvasProps {
  data: ResumeData;
  theme: ThemeConfig;
  activeTemplate: TemplateCategory;
  session?: DocumentSession | null;
  viewMode?: ViewMode;
  overlayOpacity?: number;
  onToggleViewMode?: (mode: ViewMode) => void;
  onSetOverlayOpacity?: (opacity: number) => void;
  onUpdateContact: (field: any, val: string) => void;
  onUpdateSummary: (val: string) => void;
  onUpdateExperience: (id: string, field: any, val: any) => void;
}

export function VisualCanvas({
  data,
  theme,
  activeTemplate,
  session,
  viewMode = "EDITABLE",
  overlayOpacity = 50,
  onToggleViewMode,
  onSetOverlayOpacity,
  onUpdateContact,
  onUpdateSummary,
  onUpdateExperience
}: VisualCanvasProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [toolbarVisible, setToolbarVisible] = useState<boolean>(false);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number }>({ top: 200, left: 400 });
  const [showDebugger, setShowDebugger] = useState<boolean>(false);
  const [showScorecard, setShowScorecard] = useState<boolean>(false);

  const handleZoomIn = () => setZoom((prev) => Math.min(300, prev + 25));
  const handleZoomOut = () => setZoom((prev) => Math.max(25, prev - 25));
  const handleResetZoom = () => setZoom(100);

  const handleTextSelection = (e: React.MouseEvent) => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      setToolbarPos({ top: e.clientY, left: e.clientX - 100 });
      setToolbarVisible(true);
    } else {
      setToolbarVisible(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/90 overflow-hidden relative" onMouseUp={handleTextSelection}>
      {/* Document Session Debugger Modal */}
      <DocumentDebuggerModal
        isOpen={showDebugger}
        onClose={() => setShowDebugger(false)}
        session={session || null}
      />

      {/* Visual Fidelity Scorecard Modal */}
      {session && (
        <VisualFidelityScorecard
          isOpen={showScorecard}
          onClose={() => setShowScorecard(false)}
          session={session}
        />
      )}

      {/* Floating Contextual Formatting Toolbar */}
      <FloatingFormatToolbar
        visible={toolbarVisible}
        position={toolbarPos}
        onApplyFormat={(fmt, val) => console.log("Format applied:", fmt, val)}
        onAIAction={(action) => console.log("AI Action:", action)}
      />

      {/* Top Floating Controls Header with 4 VIEW MODES */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 flex flex-wrap items-center justify-between z-10 gap-2">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
          {/* 4 View Modes Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 font-mono text-xs">
            <button
              onClick={() => onToggleViewMode && onToggleViewMode("ORIGINAL")}
              disabled={!session}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                viewMode === "ORIGINAL" ? "bg-sky-500 text-white shadow" : "text-slate-400 hover:text-slate-200 disabled:opacity-30"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Original</span>
            </button>
            <button
              onClick={() => onToggleViewMode && onToggleViewMode("EDITABLE")}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                viewMode === "EDITABLE" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Editable CV</span>
            </button>
            <button
              onClick={() => onToggleViewMode && onToggleViewMode("COMPARISON")}
              disabled={!session}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                viewMode === "COMPARISON" ? "bg-amber-500 text-slate-950 font-bold shadow" : "text-slate-400 hover:text-slate-200 disabled:opacity-30"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Comparativa</span>
            </button>
            <button
              onClick={() => onToggleViewMode && onToggleViewMode("OVERLAY")}
              disabled={!session}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1.5 ${
                viewMode === "OVERLAY" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-slate-200 disabled:opacity-30"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Overlay (Capas)</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50 hidden lg:inline">
            {viewMode === "ORIGINAL" ? "Original PDF Stream" : viewMode === "COMPARISON" ? "Side-by-Side View" : viewMode === "OVERLAY" ? "Dual-Layer Opacity Mode" : "CandidateCVSchema Model"}
          </span>
        </div>

        {/* Diagnostic Buttons, Grid & Zoom */}
        <div className="flex items-center gap-2">
          {session && (
            <>
              <button
                onClick={() => setShowScorecard(true)}
                className="px-2.5 py-1 rounded-xl bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 hover:bg-emerald-600/30 transition"
                title="Ver Scorecard de Fidelidad QA"
              >
                <Award className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">QA Scorecard</span>
              </button>

              <button
                onClick={() => setShowDebugger(true)}
                className="px-2.5 py-1 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-mono flex items-center gap-1.5 hover:bg-purple-600/30 transition"
                title="Inspect Document Session Debugger"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Debug Session</span>
              </button>
            </>
          )}

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              showGrid
                ? "bg-sky-500/20 text-sky-400 border-sky-500/40"
                : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
            }`}
            title="Toggle Smart Grid Overlay"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Smart Grid</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
            <button onClick={handleZoomOut} className="text-slate-400 hover:text-white" title="Zoom Out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-200 font-bold w-12 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="text-slate-400 hover:text-white" title="Zoom In">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleResetZoom} className="text-slate-400 hover:text-white border-l border-slate-800 pl-1.5 ml-1" title="Reset Zoom">
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Render Active View Mode */}
      {viewMode === "ORIGINAL" && session ? (
        <OriginalDocumentViewer session={session} />
      ) : viewMode === "COMPARISON" && session ? (
        <RenderComparisonViewer
          session={session}
          data={data}
          theme={theme}
          activeTemplate={activeTemplate}
          onUpdateContact={onUpdateContact}
          onUpdateSummary={onUpdateSummary}
          onUpdateExperience={onUpdateExperience}
        />
      ) : viewMode === "OVERLAY" && session ? (
        <OverlayDocumentViewer
          session={session}
          data={data}
          theme={theme}
          activeTemplate={activeTemplate}
          opacity={overlayOpacity}
          onOpacityChange={(op) => onSetOverlayOpacity && onSetOverlayOpacity(op)}
          onUpdateContact={onUpdateContact}
          onUpdateSummary={onUpdateSummary}
          onUpdateExperience={onUpdateExperience}
        />
      ) : (
        /* EDITABLE VIEW MODE */
        <div className="flex-1 p-6 md:p-10 overflow-y-auto flex justify-center items-start relative">
          <div
            className="w-full max-w-4xl transition-transform duration-200 origin-top shadow-2xl relative"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <SmartGridOverlay visible={showGrid} />
            <TemplateRenderer
              data={data}
              theme={theme}
              activeTemplate={activeTemplate}
              onUpdateContact={onUpdateContact}
              onUpdateSummary={onUpdateSummary}
              onUpdateExperience={onUpdateExperience}
            />
          </div>
        </div>
      )}
    </div>
  );
}
