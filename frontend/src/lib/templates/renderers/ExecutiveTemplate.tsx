"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function ExecutiveTemplate({ data, theme, onUpdateContact, onUpdateSummary }: TemplateProps) {
  const primaryColor = theme.primaryColor || "#0f172a";

  return (
    <div className="bg-white text-slate-900 font-sans max-w-4xl mx-auto shadow-2xl rounded-sm border border-slate-200 text-xs overflow-hidden">
      {/* Executive Navy Header Band */}
      <div className="p-8 text-white space-y-2" style={{ backgroundColor: primaryColor }}>
        <InlineText
          value={data.contact.name}
          onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
          tag="h1"
          className="text-3xl font-extrabold tracking-wide uppercase"
        />
        <InlineText
          value={data.contact.title}
          onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
          tag="p"
          className="text-xs text-sky-200 font-medium tracking-wider uppercase"
        />
        <div className="pt-2 border-t border-white/20 flex flex-wrap gap-4 text-[11px] text-slate-300">
          <span>{data.contact.email}</span>
          <span>• {data.contact.phone}</span>
          <span>• {data.contact.location}</span>
          <span>• {data.contact.linkedin}</span>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Executive Summary */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
            Executive Profile
          </h2>
          <InlineText
            value={data.summary}
            onSave={(val) => onUpdateSummary && onUpdateSummary(val)}
            multiline
            tag="p"
            className="text-slate-700 leading-relaxed text-xs"
          />
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
            Career Track & Leadership
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">{exp.role} <span className="text-slate-500 font-normal">| {exp.company}</span></span>
                  <span className="text-[10px] text-slate-500 font-bold">{exp.startDate} – {exp.endDate}</span>
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

        {/* Skills */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
            Core Competencies
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {data.skillGroups.map((sg) => (
              <div key={sg.id} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <p className="font-bold text-slate-900 text-[11px] mb-1">{sg.category}</p>
                <p className="text-[10px] text-slate-600">{sg.skills.join(" • ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
