"use client";

import React, { useState } from "react";
import { DocumentSession } from "@/lib/store/useDocumentSessionStore";
import { X, Code, FileText, MapPin, Layers, Terminal, Sparkles } from "lucide-react";

interface DocumentDebuggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: DocumentSession | null;
}

export function DocumentDebuggerModal({ isOpen, onClose, session }: DocumentDebuggerModalProps) {
  const [activeTab, setActiveTab] = useState<"SCHEMA" | "RAW" | "NORMALIZED" | "SOURCEMAP" | "ASSETS">("SCHEMA");

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100 relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">Document Session Debugger</h2>
              <p className="text-[11px] text-slate-400">
                Session ID: <span className="font-mono text-purple-300">{session.session_id}</span> • Version: v{session.version}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 border-b border-slate-800 font-mono text-xs overflow-x-auto pb-2">
          {(["SCHEMA", "RAW", "NORMALIZED", "SOURCEMAP", "ASSETS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition ${
                activeTab === tab
                  ? "bg-purple-600/20 text-purple-300 border-purple-500/40"
                  : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Viewer */}
        <div className="flex-1 overflow-y-auto py-4 font-mono text-xs text-slate-300">
          {activeTab === "SCHEMA" && (
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-emerald-400">
              {JSON.stringify(session.candidate_cv, null, 2)}
            </pre>
          )}

          {activeTab === "RAW" && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap text-slate-300">
              {session.raw_content || "No raw content extracted."}
            </div>
          )}

          {activeTab === "NORMALIZED" && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap text-sky-300">
              {session.normalized_content || "No normalized content available."}
            </div>
          )}

          {activeTab === "SOURCEMAP" && (
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-amber-300">
              {JSON.stringify(session.source_map, null, 2)}
            </pre>
          )}

          {activeTab === "ASSETS" && (
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-x-auto text-purple-300">
              {JSON.stringify(session.assets, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
