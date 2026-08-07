"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function CorporateTemplate({ data, theme, onUpdateContact, onUpdateSummary }: TemplateProps) {
  const primary = theme.primaryColor || "#1e293b";

  return (
    <div className="bg-white text-slate-900 font-sans max-w-4xl mx-auto shadow-2xl rounded-sm border border-slate-200 text-xs p-8 space-y-6">
      <div className="flex justify-between items-end border-b-2 pb-4" style={{ borderColor: primary }}>
        <div>
          <InlineText
            value={data.contact.name}
            onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
            tag="h1"
            className="text-2xl font-bold tracking-tight text-slate-900 uppercase"
          />
          <InlineText
            value={data.contact.title}
            onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
            tag="p"
            className="text-xs font-semibold text-slate-600 uppercase"
          />
        </div>
        <div className="text-right text-[11px] text-slate-600">
          <p>{data.contact.email} | {data.contact.phone}</p>
          <p>{data.contact.location} | {data.contact.linkedin}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-900 border-l-4 pl-2" style={{ borderColor: primary }}>
          Executive Summary
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
        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-900 border-l-4 pl-2" style={{ borderColor: primary }}>
          Professional Experience
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role} — <span style={{ color: primary }}>{exp.company}</span></span>
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
