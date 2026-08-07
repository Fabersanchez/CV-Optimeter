"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function FinanceTemplate({ data, theme, onUpdateContact, onUpdateSummary }: TemplateProps) {
  const brand = theme.primaryColor || "#0f172a";

  return (
    <div className="bg-white text-slate-900 font-sans max-w-4xl mx-auto shadow-2xl rounded-sm border border-slate-200 text-xs p-8 space-y-6">
      <div className="text-center border-b-2 pb-4" style={{ borderColor: brand }}>
        <InlineText
          value={data.contact.name}
          onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
          tag="h1"
          className="text-2xl font-extrabold tracking-wide uppercase text-slate-900"
        />
        <InlineText
          value={data.contact.title}
          onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
          tag="p"
          className="text-xs font-semibold text-slate-600 uppercase mt-1"
        />
        <div className="flex justify-center gap-3 text-[10px] text-slate-600 mt-2">
          <span>{data.contact.email}</span> • <span>{data.contact.phone}</span> • <span>{data.contact.location}</span> • <span>{data.contact.linkedin}</span>
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2" style={{ borderColor: brand }}>
          Financial Summary & Key Accomplishments
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-3" style={{ borderColor: brand }}>
          Professional Experience & Deal Flow
        </h2>
        <div className="space-y-4">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role} | {exp.company}</span>
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
