"use client";

import React, { useState } from "react";
import { DocumentSession } from "@/lib/store/useDocumentSessionStore";
import { ResumeData, ThemeConfig, TemplateCategory } from "@/types/resume";
import { OriginalDocumentViewer } from "./OriginalDocumentViewer";
import { TemplateRenderer } from "./TemplateRenderer";
import { Columns, ShieldCheck, Eye, Sparkles } from "lucide-react";

interface RenderComparisonViewerProps {
  session: DocumentSession;
  data: ResumeData;
  theme: ThemeConfig;
  activeTemplate: TemplateCategory;
  onUpdateContact: (field: any, val: string) => void;
  onUpdateSummary: (val: string) => void;
  onUpdateExperience: (id: string, field: any, val: any) => void;
}

export function RenderComparisonViewer({
  session,
  data,
  theme,
  activeTemplate,
  onUpdateContact,
  onUpdateSummary,
  onUpdateExperience
}: RenderComparisonViewerProps) {
  const [zoom, setZoom] = useState<number>(85);

  return (
    <div className="flex-1 flex flex-col bg-slate-950/95 overflow-hidden border-l border-slate-800">
      {/* Sub-Header Banner */}
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Columns className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">Modo Comparativa Visual (Side-by-Side)</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="text-slate-400">Panel Izquierdo: Documento Original</span>
          <span className="text-blue-400 font-bold">│</span>
          <span className="text-sky-400">Panel Derecho: Reconstrucción CV Optimeter</span>
        </div>
      </div>

      {/* Side-by-Side Dual Container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden divider-x border-slate-800">
        {/* Left Pane: Original File Viewer */}
        <div className="flex flex-col border-r border-slate-800 overflow-hidden relative">
          <OriginalDocumentViewer session={session} />
        </div>

        {/* Right Pane: CV Optimeter Reconstructed Render */}
        <div className="flex flex-col overflow-y-auto bg-slate-900/60 p-6 flex justify-center items-center">
          <div className="shadow-2xl transition-all duration-200" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            <TemplateRenderer
              activeTemplate={activeTemplate}
              data={data}
              theme={theme}
              onUpdateContact={onUpdateContact}
              onUpdateSummary={onUpdateSummary}
              onUpdateExperience={onUpdateExperience}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
