"use client";

import React from "react";
import { Sliders, Type, Palette, LayoutGrid } from "lucide-react";
import { THEME_PRESETS } from "@/lib/studio/ThemeEngine";
import { useResumeStore } from "@/lib/store/useResumeStore";

export const PropertyInspector: React.FC = () => {
  const { theme, updateTheme } = useResumeStore();

  return (
    <div className="w-80 border-l border-slate-800 bg-slate-900/95 backdrop-blur-xl flex flex-col h-full text-slate-200">
      {/* Inspector Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h3 className="font-semibold text-sm">Figma Inspector</h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
          LIVE METRICS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Theme Engine Preset Section */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            <span>Theme Engine Preset</span>
          </label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {THEME_PRESETS.map((t) => (
              <button
                key={t.id}
                onClick={() => updateTheme({ primaryColor: t.primaryColor, secondaryColor: t.secondaryColor })}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  theme.primaryColor === t.primaryColor
                    ? "border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10"
                    : "border-slate-800 bg-slate-800/40 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: t.primaryColor }}
                  />
                  <span className="text-xs font-semibold truncate">{t.name}</span>
                </div>
                <span className="text-[10px] text-slate-400 block truncate">{t.category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Typography Controls */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-blue-400" />
            <span>Typography Metrics</span>
          </label>
          <div className="space-y-3 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Letter Spacing (Tracking)</span>
                <span className="font-mono text-slate-200">0.02em</span>
              </div>
              <input
                type="range"
                min="-0.05"
                max="0.2"
                step="0.01"
                defaultValue="0.02"
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Line Height (Leading)</span>
                <span className="font-mono text-slate-200">1.4</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                defaultValue="1.4"
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Canvas Layout Spacing */}
        <div>
          <label className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            <span>Document Bounds & Spacing</span>
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-800/30 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Page Padding</span>
              <input
                type="number"
                defaultValue={32}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-200"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Section Gap</span>
              <input
                type="number"
                defaultValue={16}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs font-mono text-slate-200"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
