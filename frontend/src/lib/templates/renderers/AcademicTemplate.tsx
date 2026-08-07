"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function AcademicTemplate({ data, theme, onUpdateContact, onUpdateSummary }: TemplateProps) {
  const accent = theme.primaryColor || "#475569";

  return (
    <div className="bg-white text-slate-900 font-serif max-w-4xl mx-auto shadow-2xl rounded-sm border border-slate-200 text-xs p-10 space-y-6">
      <div className="text-center border-b pb-4 border-slate-300">
        <InlineText
          value={data.contact.name}
          onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
          tag="h1"
          className="text-3xl font-bold tracking-tight text-slate-900"
        />
        <InlineText
          value={data.contact.title}
          onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
          tag="p"
          className="text-xs font-semibold text-slate-600 italic mt-1"
        />
        <div className="flex justify-center gap-3 text-[11px] text-slate-600 mt-2 font-sans">
          <span>{data.contact.email}</span> • <span>{data.contact.phone}</span> • <span>{data.contact.location}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-2 font-sans">
          Academic Profile & Research Interests
        </h2>
        <InlineText
          value={data.summary}
          onSave={(val) => onUpdateSummary && onUpdateSummary(val)}
          multiline
          tag="p"
          className="text-slate-800 leading-relaxed text-xs"
        />
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3 font-sans">
          Education & Academic Background
        </h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="space-y-0.5 mb-3">
            <div className="flex justify-between items-baseline font-bold text-slate-900">
              <span>{edu.degree} in {edu.field}</span>
              <span className="text-[10px] text-slate-600 font-mono">{edu.startDate} – {edu.endDate}</span>
            </div>
            <p className="text-[11px] text-slate-700 italic">{edu.institution}, {edu.location}</p>
            {edu.gpa && <p className="text-[10px] text-slate-600 font-sans">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-1 mb-3 font-sans">
          Professional Appointments & Teaching
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role}, <span className="font-semibold italic">{exp.company}</span></span>
                <span className="text-[10px] text-slate-600 font-mono">{exp.startDate} – {exp.endDate}</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-800 mt-1">
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
