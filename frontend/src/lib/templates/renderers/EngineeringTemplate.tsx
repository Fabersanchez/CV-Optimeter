"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function EngineeringTemplate({ data, theme, onUpdateContact, onUpdateSummary }: TemplateProps) {
  const accent = theme.primaryColor || "#0284c7";

  return (
    <div className="bg-white text-slate-900 font-sans max-w-4xl mx-auto shadow-2xl rounded-sm border border-slate-200 text-xs p-8 space-y-6">
      <div className="border-b-4 pb-4" style={{ borderColor: accent }}>
        <InlineText
          value={data.contact.name}
          onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
          tag="h1"
          className="text-3xl font-extrabold text-slate-900 uppercase tracking-tight"
        />
        <InlineText
          value={data.contact.title}
          onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
          tag="p"
          className="text-xs font-bold font-mono mt-0.5"
          style={{ color: accent }}
        />
        <div className="flex gap-4 text-[10px] text-slate-600 font-mono mt-2">
          <span>{data.contact.email}</span> | <span>{data.contact.phone}</span> | <span>{data.contact.linkedin}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 rounded mb-2 text-slate-900 border-l-4" style={{ borderColor: accent }}>
          Engineering Profile & Architecture Focus
        </h2>
        <InlineText
          value={data.summary}
          onSave={(val) => onUpdateSummary && onUpdateSummary(val)}
          multiline
          tag="p"
          className="text-slate-700 leading-relaxed"
        />
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 rounded mb-3 text-slate-900 border-l-4" style={{ borderColor: accent }}>
          Technical Skills & Infrastructure Matrix
        </h2>
        <div className="space-y-1.5">
          {data.skillGroups.map((sg) => (
            <div key={sg.id} className="text-slate-700 font-mono text-[11px]">
              <span className="font-bold text-slate-900">{sg.category}: </span>
              <span>{sg.skills.join(" • ")}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 rounded mb-3 text-slate-900 border-l-4" style={{ borderColor: accent }}>
          Engineering & Software Projects Track
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span className="text-sm">{exp.role} <span style={{ color: accent }}>— {exp.company}</span></span>
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
    </div>
  );
}
