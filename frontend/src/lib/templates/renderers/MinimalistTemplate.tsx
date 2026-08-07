"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function MinimalistTemplate({ data, onUpdateContact, onUpdateSummary }: TemplateProps) {
  return (
    <div className="bg-white text-slate-900 font-sans max-w-4xl mx-auto shadow-xl rounded-sm border border-slate-200 text-xs p-10 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <InlineText
          value={data.contact.name}
          onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
          tag="h1"
          className="text-3xl font-light tracking-wide text-slate-900"
        />
        <InlineText
          value={data.contact.title}
          onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
          tag="p"
          className="text-xs font-semibold text-slate-500 tracking-wider uppercase"
        />
        <div className="flex gap-4 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
          <span>{data.contact.email}</span>
          <span>{data.contact.phone}</span>
          <span>{data.contact.location}</span>
          <span>{data.contact.linkedin}</span>
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">About</p>
          <InlineText
            value={data.summary}
            onSave={(val) => onUpdateSummary && onUpdateSummary(val)}
            multiline
            tag="p"
            className="text-slate-700 leading-relaxed text-xs"
          />
        </div>
      )}

      {/* Experience */}
      <div className="space-y-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Experience</p>
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-slate-900 text-sm">{exp.role} <span className="text-slate-400 font-normal">/ {exp.company}</span></span>
                <span className="text-[10px] text-slate-400 font-mono">{exp.startDate} – {exp.endDate}</span>
              </div>
              <ul className="space-y-1 text-slate-600 mt-2 pl-3 list-disc">
                {exp.bullets.map((b, idx) => (
                  <li key={idx}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="space-y-2 pt-4 border-t border-slate-100">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Capabilities</p>
        <p className="text-slate-700 text-xs">{data.skillGroups.flatMap(s => s.skills).join("  •  ")}</p>
      </div>
    </div>
  );
}
