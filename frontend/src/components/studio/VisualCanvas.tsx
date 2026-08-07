"use client";

import React, { useState } from "react";
import { ResumeData, ThemeConfig, TemplateCategory } from "@/types/resume";
import { templateComponentMap } from "@/lib/templates/registry";
import { ZoomIn, ZoomOut, Maximize2, FileCheck, Grid, Eye } from "lucide-react";
import { SmartGridOverlay } from "./SmartGridOverlay";
import { FloatingFormatToolbar } from "./FloatingFormatToolbar";

interface VisualCanvasProps {
  data: ResumeData;
  theme: ThemeConfig;
  activeTemplate: TemplateCategory;
  onUpdateContact: (field: any, val: string) => void;
  onUpdateSummary: (val: string) => void;
  onUpdateExperience: (id: string, field: any, val: any) => void;
}

export function VisualCanvas({
  data,
  theme,
  activeTemplate,
  onUpdateContact,
  onUpdateSummary,
  onUpdateExperience
}: VisualCanvasProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [toolbarVisible, setToolbarVisible] = useState<boolean>(false);
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number }>({ top: 200, left: 400 });

  const TemplateComponent = templateComponentMap[activeTemplate] || templateComponentMap["ats-professional"];

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
      {/* Floating Contextual Formatting Toolbar */}
      <FloatingFormatToolbar
        visible={toolbarVisible}
        position={toolbarPos}
        onApplyFormat={(fmt, val) => console.log("Format applied:", fmt, val)}
        onAIAction={(action) => console.log("AI Action:", action)}
      />

      {/* Top Floating Zoom & Canvas Controls */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-4 py-2 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5 text-slate-200">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>A4 Document Canvas</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50">
            Figma Render Engine
          </span>
        </div>

        {/* Zoom & Grid Toggle Controls */}
        <div className="flex items-center gap-2">
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
            <button onClick={handleZoomOut} className="text-slate-400 hover:text-white" title="Zoom Out (Ctrl -)">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-200 font-bold w-12 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="text-slate-400 hover:text-white" title="Zoom In (Ctrl +)">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleResetZoom} className="text-slate-400 hover:text-white border-l border-slate-800 pl-1.5 ml-1" title="Reset Zoom (100%)">
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main A4 Document Canvas View */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto flex justify-center items-start relative">
        <div
          className="w-full max-w-4xl transition-transform duration-200 origin-top shadow-2xl relative"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <SmartGridOverlay visible={showGrid} />
          <TemplateComponent
            data={data}
            theme={theme}
            onUpdateContact={onUpdateContact}
            onUpdateSummary={onUpdateSummary}
            onUpdateExperience={onUpdateExperience}
          />
        </div>
      </div>
    </div>
  );
}
