"use client";

import React from "react";
import { History, RotateCcw, X } from "lucide-react";
import { useResumeStore } from "@/lib/store/useResumeStore";

interface VisualVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualVersionModal: React.FC<VisualVersionModalProps> = ({ isOpen, onClose }) => {
  const { undo, canUndo } = useResumeStore();

  if (!isOpen) return null;

  const versions = [
    { id: "v4", name: "v4.0 Production Release", date: "Today", atsScore: 98, status: "Active" },
    { id: "v3", name: "v3.0 STAR Metrics Optimized", date: "Yesterday", atsScore: 92, status: "Saved" },
    { id: "v2", name: "v2.0 Executive Summary Added", date: "3 days ago", atsScore: 84, status: "Saved" },
    { id: "v1", name: "v1.0 Initial PDF Import", date: "1 week ago", atsScore: 72, status: "Saved" }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base">Visual Revision History</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {versions.map((ver) => (
            <div
              key={ver.id}
              className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-slate-200">{ver.name}</span>
                  {ver.status === "Active" && (
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                      CURRENT ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{ver.date} • ATS Score: {ver.atsScore}/100</span>
              </div>

              {ver.status !== "Active" && (
                <button
                  onClick={() => {
                    if (canUndo) undo();
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-blue-400" />
                  <span>Restore</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
