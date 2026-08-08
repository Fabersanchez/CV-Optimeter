"use client";

import React, { useState } from "react";
import { DocumentSession } from "@/lib/store/useDocumentSessionStore";
import { FileText, Download, ZoomIn, ZoomOut, Maximize2, ShieldCheck, FileCode, ArrowLeft, ArrowRight } from "lucide-react";

interface OriginalDocumentViewerProps {
  session: DocumentSession;
}

export function OriginalDocumentViewer({ session }: OriginalDocumentViewerProps) {
  const [zoom, setZoom] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = session.original_file?.page_count || 1;

  const handleZoomIn = () => setZoom((prev) => Math.min(250, prev + 25));
  const handleZoomOut = () => setZoom((prev) => Math.max(50, prev - 25));
  const handleResetZoom = () => setZoom(100);

  const fileExt = session.original_file?.extension?.toLowerCase() || "pdf";
  const b64Data = session.original_file?.content_b64;

  const downloadOriginalFile = () => {
    if (!b64Data) return;
    const link = document.createElement("a");
    link.href = `data:${session.original_file.mime_type};base64,${b64Data}`;
    link.download = session.original_file.filename || "original_document";
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950/95 overflow-hidden relative border-l border-slate-800">
      {/* Top Floating Controls Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between z-10 text-slate-200">
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">{session.original_file?.filename || "Original File"}</span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-slate-800 border border-slate-700 text-slate-400 uppercase">
                {fileExt}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {(session.original_file?.size ? (session.original_file.size / 1024).toFixed(1) : 0)} KB • Original Upload Reference
            </p>
          </div>
        </div>

        {/* Zoom & Page Navigation */}
        <div className="flex items-center gap-3">
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-xs">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-300">
                Pág {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 text-slate-400 hover:text-white disabled:opacity-40"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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

          <button
            onClick={downloadOriginalFile}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" /> Descargar Original
          </button>
        </div>
      </div>

      {/* Main Canvas View for Original File */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto flex justify-center items-start relative">
        <div
          className="w-full max-w-4xl transition-transform duration-200 origin-top shadow-2xl relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {fileExt === "pdf" && b64Data ? (
            <object
              data={`data:application/pdf;base64,${b64Data}`}
              type="application/pdf"
              className="w-full h-[1100px] rounded-xl"
            >
              <iframe
                src={`data:application/pdf;base64,${b64Data}`}
                className="w-full h-[1100px] rounded-xl"
                title="Original PDF Document"
              />
            </object>
          ) : (
            <div className="p-8 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed bg-slate-950 rounded-xl max-h-[1000px] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-slate-400 text-[11px]">
                <span className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-sky-400" /> Original Extracted Document Content
                </span>
                <span>Format: {fileExt.toUpperCase()}</span>
              </div>
              {session.raw_content || session.normalized_content || "No raw content available for preview."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
