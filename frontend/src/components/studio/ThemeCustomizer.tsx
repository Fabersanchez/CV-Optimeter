"use client";

import React from "react";
import { ThemeConfig, FontPairing } from "@/types/resume";

interface ThemeCustomizerProps {
  theme: ThemeConfig;
  onUpdateTheme: (partial: Partial<ThemeConfig>) => void;
}

export function ThemeCustomizer({ theme, onUpdateTheme }: ThemeCustomizerProps) {
  const colorSwatches = [
    { name: "Sky Blue", value: "#0284c7" },
    { name: "Emerald", value: "#059669" },
    { name: "Executive Slate", value: "#0f172a" },
    { name: "Indigo", value: "#4338ca" },
    { name: "Rose", value: "#e11d48" },
    { name: "Amber", value: "#d97706" },
  ];

  const fontOptions: Array<{ id: FontPairing; label: string }> = [
    { id: "inter", label: "Inter (Modern Sans)" },
    { id: "roboto", label: "Roboto (Clean Corporate)" },
    { id: "fira-code", label: "Fira Code (Technical Code)" },
    { id: "outfit", label: "Outfit (Creative Geometric)" },
    { id: "merriweather", label: "Merriweather (Academic Serif)" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Primary Accent Color</h3>
        <div className="grid grid-cols-6 gap-2">
          {colorSwatches.map((swatch) => (
            <button
              key={swatch.value}
              onClick={() => onUpdateTheme({ primaryColor: swatch.value })}
              className={`w-7 h-7 rounded-full transition transform hover:scale-110 flex items-center justify-center ${
                theme.primaryColor === swatch.value ? "ring-2 ring-brand-400 ring-offset-2 ring-offset-slate-900" : ""
              }`}
              style={{ backgroundColor: swatch.value }}
              title={swatch.name}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Typography Family</h3>
        <select
          value={theme.fontPairing}
          onChange={(e) => onUpdateTheme({ fontPairing: e.target.value as FontPairing })}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
        >
          {fontOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">Layout Columns</h3>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onUpdateTheme({ layoutColumns: 1 })}
            className={`py-2 rounded-xl text-xs font-semibold border transition ${
              theme.layoutColumns === 1
                ? "bg-brand-500/10 border-brand-500 text-brand-400"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            1 Column (ATS Standard)
          </button>

          <button
            onClick={() => onUpdateTheme({ layoutColumns: 2 })}
            className={`py-2 rounded-xl text-xs font-semibold border transition ${
              theme.layoutColumns === 2
                ? "bg-brand-500/10 border-brand-500 text-brand-400"
                : "bg-slate-900 border-slate-800 text-slate-400"
            }`}
          >
            2 Columns (Visual Split)
          </button>
        </div>
      </div>
    </div>
  );
}
