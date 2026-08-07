"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function ModernTemplate({ data, theme, onUpdateContact, onUpdateSummary }: TemplateProps) {
  const brandColor = theme.primaryColor || "#0ea5e9";

  return (
    <div className="bg-white text-slate-900 font-sans max-w-4xl mx-auto shadow-2xl rounded-lg border border-slate-200 text-xs p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6" style={{ borderColor: brandColor }}>
        <div className="space-y-1">
          <InlineText
            value={data.contact.name}
            onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
            tag="h1"
            className="text-3xl font-extrabold tracking-tight text-slate-900"
          />
          <InlineText
            value={data.contact.title}
            onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
            tag="p"
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: brandColor }}
          />
        </div>

        <div className="text-right text-[11px] text-slate-600 space-y-1 font-medium">
          <p>{data.contact.email}</p>
          <p>{data.contact.phone}</p>
          <p>{data.contact.location}</p>
          <p className="font-semibold" style={{ color: brandColor }}>{data.contact.linkedin}</p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <InlineText
          value={data.summary}
          onSave={(val) => onUpdateSummary && onUpdateSummary(val)}
          multiline
          tag="p"
          className="text-slate-700 leading-relaxed"
        />
      </div>

      {/* Experience */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: brandColor }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }}></span>
          Work Experience
        </h2>
        <div className="space-y-5 border-l-2 pl-4 ml-1" style={{ borderColor: `${brandColor}30` }}>
          {data.experience.map((exp) => (
            <div key={exp.id} className="relative space-y-1">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span className="text-sm">{exp.role} <span style={{ color: brandColor }}>@ {exp.company}</span></span>
                <span className="text-[10px] text-slate-500 font-mono">{exp.startDate} – {exp.endDate}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1">
                {exp.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Tags */}
      <div>
        <h2 className="text-xs font-extrabold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: brandColor }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }}></span>
          Core Technical Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skillGroups.flatMap((sg) => sg.skills).map((skill, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-md text-[11px] font-semibold border" style={{ backgroundColor: `${brandColor}10`, borderColor: `${brandColor}30`, color: brandColor }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
