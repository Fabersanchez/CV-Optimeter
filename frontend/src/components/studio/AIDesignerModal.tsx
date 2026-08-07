"use client";

import React, { useState } from "react";
import { Sparkles, Wand2, X } from "lucide-react";
import { useResumeStore } from "@/lib/store/useResumeStore";

interface AIDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIDesignerModal: React.FC<AIDesignerModalProps> = ({ isOpen, onClose }) => {
  const [promptText, setPromptText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { setTheme, applyAllAIImprovements } = useResumeStore();

  if (!isOpen) return null;

  const handleApplyPresetPrompt = (preset: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      if (preset.includes("Harvard")) {
        setTheme((prev) => ({ ...prev, primaryColor: "#0f172a", fontPairing: "inter" }));
      } else if (preset.includes("Apple")) {
        setTheme((prev) => ({ ...prev, primaryColor: "#1d1d1f", borderRadius: "sm" }));
      } else if (preset.includes("Google")) {
        setTheme((prev) => ({ ...prev, primaryColor: "#1a73e8", fontPairing: "roboto" }));
      } else if (preset.includes("Tesla")) {
        setTheme((prev) => ({ ...prev, primaryColor: "#cc0000", borderRadius: "none" }));
      } else if (preset.includes("ATS")) {
        setTheme((prev) => ({ ...prev, primaryColor: "#1e3a8a", fontPairing: "inter" }));
      }
      applyAllAIImprovements();
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">Conversational AI Layout Designer</h3>
              <p className="text-xs text-slate-400">Graphically transform document layout, fonts, and colors</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Prompts */}
        <div className="space-y-2 mb-6">
          <p className="text-xs font-medium text-slate-400">Quick Design Presets:</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Diseña un CV tipo Harvard",
              "Haz un estilo Apple Minimal",
              "Estilo Google Tech Architect",
              "Optimízalo para Amazon ATS"
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPresetPrompt(preset)}
                disabled={isProcessing}
                className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl text-xs text-slate-200 font-medium text-left transition-all hover:border-blue-500/50 flex items-center justify-between"
              >
                <span>{preset}</span>
                <Wand2 className="w-3.5 h-3.5 text-blue-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt Box */}
        <div className="space-y-3">
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Describe your target design style (e.g., 'Make it look like a Senior Staff Engineer resume for Microsoft with high visual hierarchy')..."
            className="w-full h-24 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />
          <button
            onClick={() => handleApplyPresetPrompt(promptText || "Diseña un CV tipo Harvard")}
            disabled={isProcessing}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            {isProcessing ? (
              <span>Applying AI Design Metrics...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Apply AI Graphic Transformation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
