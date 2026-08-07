"use client";

import React from "react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Sparkles, Wand2, FileText, Plus, Minus } from "lucide-react";

interface FloatingFormatToolbarProps {
  visible: boolean;
  position: { top: number; left: number };
  onApplyFormat: (format: string, value?: any) => void;
  onAIAction: (action: string) => void;
}

export const FloatingFormatToolbar: React.FC<FloatingFormatToolbarProps> = ({
  visible,
  position,
  onApplyFormat,
  onAIAction
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed z-50 flex items-center gap-1 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl text-white text-xs animate-in fade-in zoom-in-95 duration-150"
      style={{ top: `${position.top - 48}px`, left: `${position.left}px` }}
    >
      <button
        onClick={() => onApplyFormat("bold")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Negrita"
      >
        <Bold className="w-3.5 h-3.5 text-slate-200" />
      </button>
      <button
        onClick={() => onApplyFormat("italic")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Cursiva"
      >
        <Italic className="w-3.5 h-3.5 text-slate-200" />
      </button>
      <button
        onClick={() => onApplyFormat("underline")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Subrayado"
      >
        <Underline className="w-3.5 h-3.5 text-slate-200" />
      </button>

      <div className="h-4 w-[1px] bg-slate-700 mx-1" />

      <button
        onClick={() => onApplyFormat("align", "left")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Alinear Izquierda"
      >
        <AlignLeft className="w-3.5 h-3.5 text-slate-200" />
      </button>
      <button
        onClick={() => onApplyFormat("align", "center")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Centrar"
      >
        <AlignCenter className="w-3.5 h-3.5 text-slate-200" />
      </button>
      <button
        onClick={() => onApplyFormat("align", "right")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Alinear Derecha"
      >
        <AlignRight className="w-3.5 h-3.5 text-slate-200" />
      </button>

      <div className="h-4 w-[1px] bg-slate-700 mx-1" />

      <button
        onClick={() => onAIAction("rewrite_star")}
        className="flex items-center gap-1 px-2 py-1 bg-blue-600/80 hover:bg-blue-500 rounded-lg text-white font-medium transition-colors"
        title="Reescribir con IA (Fórmula STAR)"
      >
        <Sparkles className="w-3 h-3" />
        <span>STAR</span>
      </button>

      <button
        onClick={() => onAIAction("ats_optimize")}
        className="flex items-center gap-1 px-2 py-1 bg-emerald-600/80 hover:bg-emerald-500 rounded-lg text-white font-medium transition-colors"
        title="Optimizar para ATS"
      >
        <Wand2 className="w-3 h-3" />
        <span>ATS</span>
      </button>
    </div>
  );
};
