"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function CreativeTemplate({ data, theme, onUpdateContact, onUpdateSummary }: TemplateProps) {
  const sidebarBg = theme.secondaryColor || "#0f172a";
  const brandColor = theme.primaryColor || "#38bdf8";

  return (
    <div className="bg-white text-slate-900 font-sans max-w-4xl mx-auto shadow-2xl rounded-sm border border-slate-200 text-xs grid grid-cols-3 overflow-hidden min-h-[900px]">
      {/* Left Sidebar */}
      <div className="p-6 text-slate-100 space-y-6" style={{ backgroundColor: sidebarBg }}>
        <div className="space-y-2">
          <InlineText
            value={data.contact.name}
            onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
            tag="h1"
            className="text-xl font-extrabold tracking-tight text-white leading-tight"
          />
          <InlineText
            value={data.contact.title}
            onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
            tag="p"
            className="text-[11px] font-medium"
            style={{ color: brandColor }}
          />
        </div>

        <div className="space-y-2 text-[10px] text-slate-300 border-t border-slate-700 pt-4">
          <p className="font-bold text-slate-400 uppercase tracking-wider">Contact</p>
          <p>{data.contact.email}</p>
          <p>{data.contact.phone}</p>
          <p>{data.contact.location}</p>
          <p className="truncate" style={{ color: brandColor }}>{data.contact.linkedin}</p>
        </div>

        <div className="space-y-3 border-t border-slate-700 pt-4">
          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Technical Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {data.skillGroups.flatMap((sg) => sg.skills).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-200 border border-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-700 pt-4">
          <p className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Education</p>
          {data.education.map((edu) => (
            <div key={edu.id} className="text-[10px]">
              <p className="font-bold text-slate-200">{edu.degree}</p>
              <p className="text-slate-400">{edu.institution}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Right Content */}
      <div className="col-span-2 p-8 space-y-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-2" style={{ color: sidebarBg, borderColor: sidebarBg }}>
            Profile Overview
          </h2>
          <InlineText
            value={data.summary}
            onSave={(val) => onUpdateSummary && onUpdateSummary(val)}
            multiline
            tag="p"
            className="text-slate-700 leading-relaxed text-xs"
          />
        </div>

        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider border-b-2 pb-1 mb-3" style={{ color: sidebarBg, borderColor: sidebarBg }}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-sm">{exp.role} — <span style={{ color: brandColor }}>{exp.company}</span></span>
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
    </div>
  );
}
