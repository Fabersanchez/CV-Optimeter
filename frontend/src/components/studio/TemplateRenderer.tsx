"use client";

import React from "react";
import { ResumeData, ThemeConfig, TemplateCategory } from "@/types/resume";
import { templateComponentMap } from "@/lib/templates/registry";
import { getTypographyConfig, computeLayoutMetrics, getPaginationCSSRules } from "@/lib/renderEngine";

export interface TemplateRendererProps {
  data: ResumeData;
  theme: ThemeConfig;
  activeTemplate: TemplateCategory;
  onUpdateContact?: (field: any, val: string) => void;
  onUpdateSummary?: (val: string) => void;
  onUpdateExperience?: (id: string, field: any, val: any) => void;
  readOnly?: boolean;
}

export function TemplateRenderer({
  data,
  theme,
  activeTemplate,
  onUpdateContact,
  onUpdateSummary,
  onUpdateExperience,
  readOnly = false
}: TemplateRendererProps) {
  const SelectedTemplateComponent =
    templateComponentMap[activeTemplate] || templateComponentMap["ats-professional"];

  const typography = getTypographyConfig(theme);
  const layout = computeLayoutMetrics(data, theme);
  const paginationCss = getPaginationCSSRules();

  const hasContent = Boolean(
    data && (data.contact?.name || data.summary || (data.experience && data.experience.length > 0))
  );

  if (!hasContent) {
    return (
      <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-16 flex flex-col items-center justify-center text-center space-y-4 min-h-[600px]">
        <div className="p-4 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-100">No Document Loaded</h3>
        <p className="text-xs text-slate-400 max-w-md">
          Sube tu CV en formato PDF, DOCX, TXT o Markdown para extraer tu información real y renderizarla en cualquier plantilla profesional.
        </p>
      </div>
    );
  }

  return (
    <div
      className="cv-document-root w-full bg-white text-slate-900 shadow-2xl transition-all duration-200 min-h-[1123px] relative overflow-hidden"
      style={{
        fontFamily: typography.fontFamily,
        padding: layout.pagePadding,
        lineHeight: typography.lineHeight,
        letterSpacing: typography.letterSpacing
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: paginationCss }} />

      <SelectedTemplateComponent
        data={data}
        theme={theme}
        onUpdateContact={readOnly ? undefined : onUpdateContact}
        onUpdateSummary={readOnly ? undefined : onUpdateSummary}
        onUpdateExperience={readOnly ? undefined : onUpdateExperience}
      />
    </div>
  );
}
