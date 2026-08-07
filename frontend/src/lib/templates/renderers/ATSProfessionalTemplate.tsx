"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function ATSProfessionalTemplate({ data, theme, onUpdateContact, onUpdateSummary, onUpdateExperience }: TemplateProps) {
  const primaryColor = theme.primaryColor || "#0284c7";

  return (
    <div className="bg-white text-slate-900 font-sans p-8 max-w-4xl mx-auto shadow-xl rounded-sm border border-slate-200 text-xs space-y-6">
      {/* Header */}
      <div className="border-b-2 pb-4" style={{ borderColor: primaryColor }}>
        <InlineText
          value={data.contact.name}
          onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
          tag="h1"
          className="text-2xl font-extrabold tracking-tight uppercase text-slate-900"
        />
        <InlineText
          value={data.contact.title}
          onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
          tag="p"
          className="text-sm font-semibold mt-1"
          style={{ color: primaryColor }}
        />
        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 mt-2">
          <span>{data.contact.email}</span> • <span>{data.contact.phone}</span> • <span>{data.contact.location}</span> • <span className="font-semibold">{data.contact.linkedin}</span>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: primaryColor }}>
            Professional Summary
          </h2>
          <InlineText
            value={data.summary}
            onSave={(val) => onUpdateSummary && onUpdateSummary(val)}
            multiline
            tag="p"
            className="text-slate-700 leading-relaxed"
          />
        </div>
      )}

      {/* Experience */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: primaryColor, borderColor: primaryColor }}>
          Work Experience
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{exp.role} — <span style={{ color: primaryColor }}>{exp.company}</span></span>
                <span className="text-[10px] text-slate-500 font-mono">{exp.startDate} – {exp.endDate}</span>
              </div>
              <p className="text-[11px] text-slate-600 italic">{exp.location}</p>
              <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1 pl-1">
                {exp.bullets.map((b, idx) => (
                  <li key={idx} className="leading-normal">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: primaryColor }}>
          Technical & Core Skills
        </h2>
        <div className="space-y-1.5">
          {data.skillGroups.map((sg) => (
            <div key={sg.id} className="text-slate-700">
              <span className="font-bold text-slate-900">{sg.category}: </span>
              <span>{sg.skills.join(", ")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: primaryColor }}>
          Education
        </h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="flex justify-between items-baseline">
            <div>
              <span className="font-bold text-slate-900">{edu.degree} in {edu.field}</span>
              <span className="text-slate-600"> — {edu.institution}</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">{edu.startDate} – {edu.endDate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
