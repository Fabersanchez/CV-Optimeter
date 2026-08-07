"use client";

import React from "react";
import { ResumeData, ThemeConfig, TemplateCategory } from "@/types/resume";
import { templateComponentMap } from "@/lib/templates/registry";

interface StudioCanvasProps {
  data: ResumeData;
  theme: ThemeConfig;
  activeTemplate: TemplateCategory;
  onUpdateContact: (field: any, val: string) => void;
  onUpdateSummary: (val: string) => void;
  onUpdateExperience: (id: string, field: any, val: any) => void;
}

export function StudioCanvas({
  data,
  theme,
  activeTemplate,
  onUpdateContact,
  onUpdateSummary,
  onUpdateExperience
}: StudioCanvasProps) {
  const TemplateComponent = templateComponentMap[activeTemplate] || templateComponentMap["ats-professional"];

  return (
    <div className="flex-1 p-6 md:p-10 overflow-y-auto max-h-[calc(100vh-120px)] flex justify-center bg-slate-950/60">
      <div className="w-full max-w-4xl transition-all duration-300 transform">
        <TemplateComponent
          data={data}
          theme={theme}
          onUpdateContact={onUpdateContact}
          onUpdateSummary={onUpdateSummary}
          onUpdateExperience={onUpdateExperience}
        />
      </div>
    </div>
  );
}
