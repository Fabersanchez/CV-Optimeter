"use client";

import React from "react";
import {
  Sparkles,
  FileSearch,
  Target,
  FileText,
  Linkedin,
  BarChart3,
  History,
  Download,
  LayoutTemplate
} from "lucide-react";

export type TabType =
  | "studio"
  | "analyzer"
  | "rewriter"
  | "matcher"
  | "cover-letter"
  | "linkedin"
  | "metrics"
  | "history"
  | "export";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems: Array<{ id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }> = [
    { id: "studio", label: "Resume Studio", icon: LayoutTemplate, badge: "Visual" },
    { id: "analyzer", label: "ATS Diagnostics", icon: FileSearch },
    { id: "rewriter", label: "AI STAR Rewriter", icon: Sparkles, badge: "AI" },
    { id: "matcher", label: "Job Matcher", icon: Target },
    { id: "cover-letter", label: "Cover Letter AI", icon: FileText },
    { id: "linkedin", label: "LinkedIn Optimizer", icon: Linkedin },
    { id: "metrics", label: "Analytics Panel", icon: BarChart3 },
    { id: "history", label: "Version Control", icon: History },
    { id: "export", label: "Export Studio", icon: Download },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0 min-h-[calc(100vh-73px)]">
      <div className="space-y-1">
        <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 py-2">Platform Core</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-brand-600 to-sky-600 text-white shadow-md shadow-brand-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${
                    isActive ? "bg-white/20 text-white" : "bg-brand-500/10 text-brand-400 border border-brand-500/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-850 border border-slate-800 text-center">
        <p className="text-xs font-semibold text-slate-300">Need Enterprise API?</p>
        <p className="text-[11px] text-slate-400 mt-1">Connect FastAPI ATS Service directly to your HR workflow.</p>
        <a
          href="http://127.0.0.1:8000/api/v1/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-2.5 text-xs font-bold text-brand-400 hover:text-brand-300 underline"
        >
          View OpenAPI Swagger Docs &rarr;
        </a>
      </div>
    </aside>
  );
}
