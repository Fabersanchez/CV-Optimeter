"use client";

import React from "react";

interface SmartGridOverlayProps {
  visible: boolean;
}

export const SmartGridOverlay: React.FC<SmartGridOverlayProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 opacity-40">
      {/* Outer Margin Guidelines */}
      <div className="absolute inset-8 border border-dashed border-sky-400/50" />

      {/* Center Axis Guideline */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] border-r border-dashed border-sky-400/50" />

      {/* Baseline Grid Guides */}
      <div className="absolute top-1/4 left-0 right-0 h-[1px] border-b border-dashed border-sky-400/30" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] border-b border-dashed border-sky-400/30" />
      <div className="absolute top-3/4 left-0 right-0 h-[1px] border-b border-dashed border-sky-400/30" />

      {/* Alignment Badge */}
      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-sky-500/80 text-white text-[10px] font-mono rounded">
        GRID SNAP ACTIVE (8px)
      </div>
    </div>
  );
};
