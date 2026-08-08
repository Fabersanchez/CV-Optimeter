"use client";

import React, { useState } from "react";
import { DocumentSession } from "@/lib/store/useDocumentSessionStore";
import { ResumeData, ThemeConfig, TemplateCategory } from "@/types/resume";
import { TemplateRenderer } from "./TemplateRenderer";
import { Layers, Sliders, Eye } from "lucide-react";

interface OverlayDocumentViewerProps {
  session: DocumentSession;
  data: ResumeData;
  theme: ThemeConfig;
  activeTemplate: TemplateCategory;
  opacity: number;
  onOpacityChange: (val: number) => void;
  onUpdateContact: (field: any, val: string) => void;
  onUpdateSummary: (val: string) => void;
  onUpdateExperience: (id: string, field: any, val: any) => void;
}

export function OverlayDocumentViewer({
  session,
  data,
  theme,
  activeTemplate,
  opacity,
  onOpacityChange,
  onUpdateContact,
  onUpdateSummary,
  onUpdateExperience
}: OverlayDocumentViewerProps) {
  const fileExt = session.original_file?.extension?.toLowerCase() || "pdf";
  const b64Data = session.original_file?.content_b64;

  return (
    <div className="flex-1 flex flex-col bg-slate-950/95 overflow-hidden border-l border-slate-800 relative">
      {/* Top Floating Controls */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between z-20 text-xs text-slate-200">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">Modo Capas Superpuestas (Overlay)</span>
        </div>

        {/* Opacity Slider Control */}
        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-mono text-slate-300">Opacidad Render: <strong className="text-sky-400">{opacity}%</strong></span>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="w-32 accent-sky-500 cursor-pointer"
          />

          <div className="flex items-center gap-1 pl-2 border-l border-slate-800 font-mono text-[10px]">
            {[0, 25, 50, 75, 100].map((v) => (
              <button
                key={v}
                onClick={() => onOpacityChange(v)}
                className={`px-1.5 py-0.5 rounded ${
                  opacity === v ? "bg-sky-500 text-white font-bold" : "bg-slate-900 text-slate-400 hover:text-white"
                }`}
              >
                {v}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layer Stack Area */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center items-start relative bg-slate-900/40">
        <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-800">
          {/* Bottom Layer: Original PDF / Document Stream */}
          <div className="w-[794px] h-[1123px] bg-white relative z-0 flex items-center justify-center">
            {fileExt === "pdf" && b64Data ? (
              <iframe
                src={`data:application/pdf;base64,${b64Data}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none pointer-events-none"
                title="Original Layer"
              />
            ) : (
              <div className="p-8 text-slate-800 text-xs font-mono whitespace-pre-wrap overflow-y-auto max-h-full">
                {session.raw_content || "Document Layer Placeholder"}
              </div>
            )}
          </div>

          {/* Top Layer: CV Optimeter Render with Adjustable Opacity */}
          <div
            className="absolute inset-0 z-10 pointer-events-auto transition-opacity duration-150"
            style={{ opacity: opacity / 100 }}
          >
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
