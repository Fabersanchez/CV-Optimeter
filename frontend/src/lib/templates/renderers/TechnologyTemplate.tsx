"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function TechnologyTemplate({ data, theme, onUpdateContact, onUpdateSummary }: TemplateProps) {
  const accent = theme.primaryColor || "#0284c7";

  return (
    <div className="bg-white text-slate-900 font-sans max-w-4xl mx-auto shadow-2xl rounded-sm border border-slate-200 text-xs p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 pb-5" style={{ borderColor: accent }}>
        <div>
          <InlineText
            value={data.contact.name}
            onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
            tag="h1"
            className="text-2xl font-mono font-extrabold text-slate-900 tracking-tight"
          />
          <InlineText
            value={data.contact.title}
            onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
            tag="p"
            className="text-xs font-mono font-bold mt-0.5"
            style={{ color: accent }}
          />
        </div>
        <div className="text-right text-[10px] font-mono text-slate-600 space-y-0.5">
          <p>{data.contact.email}</p>
          <p>{data.contact.phone}</p>
          <p>{data.contact.github}</p>
        </div>
      </div>

      {/* Summary */}
      <div>
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
          // Professional Summary
        </h2>
        <InlineText
          value={data.summary}
          onSave={(val) => onUpdateSummary && onUpdateSummary(val)}
          multiline
          tag="p"
          className="text-slate-700 leading-relaxed"
        />
      </div>

      {/* Technical Skills Stack */}
      <div>
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>
          // Tech Stack & Tooling
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {data.skillGroups.map((sg) => (
            <div key={sg.id} className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <p className="font-mono font-bold text-[10px] text-slate-900 mb-1">{sg.category}</p>
              <div className="flex flex-wrap gap-1">
                {sg.skills.map((sk, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-sky-50 text-sky-700 border border-sky-200">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engineering Experience */}
      <div>
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider mb-3" style={{ color: accent }}>
          // Engineering Experience
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="font-bold text-slate-900">{exp.role} <span style={{ color: accent }}>@ {exp.company}</span></span>
                <span className="text-[10px] text-slate-500">{exp.startDate} – {exp.endDate}</span>
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
    </div>
  );
}
