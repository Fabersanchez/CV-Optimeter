"use client";

import React from "react";
import { Sparkles, ArrowRightLeft, Maximize2, Minimize2, Check } from "lucide-react";

interface AIQuickActionsMenuProps {
  visible: boolean;
  position: { top: number; left: number };
  onSelectAction: (action: string) => void;
}

export const AIQuickActionsMenu: React.FC<AIQuickActionsMenuProps> = ({ visible, position, onSelectAction }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-2xl w-48 text-xs text-slate-200 animate-in fade-in duration-150"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
        AI Quick Block Actions
      </div>

      <button
        onClick={() => onSelectAction("convert_star")}
        className="w-full px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-left flex items-center justify-between transition-colors"
      >
        <span>Convert to STAR Metric</span>
        <Sparkles className="w-3 h-3 text-blue-400" />
      </button>

      <button
        onClick={() => onSelectAction("convert_xyz")}
        className="w-full px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-left flex items-center justify-between transition-colors"
      >
        <span>Convert to XYZ Formula</span>
        <ArrowRightLeft className="w-3 h-3 text-emerald-400" />
      </button>

      <button
        onClick={() => onSelectAction("expand")}
        className="w-full px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-left flex items-center justify-between transition-colors"
      >
        <span>Expand Detail</span>
        <Maximize2 className="w-3 h-3 text-slate-400" />
      </button>

      <button
        onClick={() => onSelectAction("reduce")}
        className="w-full px-2.5 py-1.5 hover:bg-slate-800 rounded-lg text-left flex items-center justify-between transition-colors"
      >
        <span>Reduce Concisely</span>
        <Minimize2 className="w-3 h-3 text-slate-400" />
      </button>
    </div>
  );
};
