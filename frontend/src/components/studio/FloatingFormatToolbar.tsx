"use client";

import React from "react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Sparkles, Wand2, Plus, Minus, Globe, Maximize2, Minimize2 } from "lucide-react";

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
      className="fixed z-50 flex items-center gap-1 p-1.5 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl text-white text-xs animate-in fade-in zoom-in-95 duration-150"
      style={{ top: `${Math.max(12, position.top - 52)}px`, left: `${position.left}px` }}
    >
      <button
        onClick={() => onApplyFormat("bold")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Negrita (Ctrl+B)"
      >
        <Bold className="w-3.5 h-3.5 text-slate-200" />
      </button>
      <button
        onClick={() => onApplyFormat("italic")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Cursiva (Ctrl+I)"
      >
        <Italic className="w-3.5 h-3.5 text-slate-200" />
      </button>
      <button
        onClick={() => onApplyFormat("underline")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
        title="Subrayado (Ctrl+U)"
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

      {/* Inline AI Quick Actions */}
      <button
        onClick={() => onAIAction("rewrite_star")}
        className="flex items-center gap-1 px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition"
        title="Reescribir con Fórmula STAR"
      >
        <Sparkles className="w-3 h-3" />
        <span>Reescribir</span>
      </button>

      <button
        onClick={() => onAIAction("ats_optimize")}
        className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-semibold transition"
        title="Mejorar Impacto ATS"
      >
        <Wand2 className="w-3 h-3" />
        <span>Mejorar</span>
      </button>

      <button
        onClick={() => onAIAction("shorten")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition"
        title="Acortar Texto"
      >
        <Minimize2 className="w-3.5 h-3.5 text-sky-400" />
      </button>

      <button
        onClick={() => onAIAction("expand")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition"
        title="Expandir Texto con Métricas"
      >
        <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
      </button>

      <button
        onClick={() => onAIAction("translate")}
        className="p-1.5 hover:bg-slate-800 rounded-lg transition"
        title="Traducir (ES / EN)"
      >
        <Globe className="w-3.5 h-3.5 text-indigo-400" />
      </button>
    </div>
  );
};
