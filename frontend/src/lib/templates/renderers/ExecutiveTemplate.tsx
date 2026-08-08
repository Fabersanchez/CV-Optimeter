"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function ExecutiveTemplate({ data, theme, onUpdateContact, onUpdateSummary, onUpdateExperience }: TemplateProps) {
  const primaryColor = theme.primaryColor || "#0f172a";

  return (
    <div className="bg-white text-slate-900 font-sans text-xs w-full overflow-hidden">
      {/* Executive Header Band */}
      <div className="p-6 md:p-8 text-white space-y-2" style={{ backgroundColor: primaryColor }}>
        <InlineText
          value={data.contact.name || "Executive Candidate"}
          onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
          tag="h1"
          className="text-3xl font-extrabold tracking-wide uppercase"
        />
        {data.contact.title && (
          <InlineText
            value={data.contact.title}
            onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
            tag="p"
            className="text-xs text-sky-200 font-medium tracking-wider uppercase"
          />
        )}
        <div className="pt-2 border-t border-white/20 flex flex-wrap items-center gap-3 text-[11px] text-slate-200">
          {data.contact.email && <span>{data.contact.email}</span>}
          {data.contact.phone && <span>• {data.contact.phone}</span>}
          {data.contact.location && <span>• {data.contact.location}</span>}
          {data.contact.linkedin && <span>• {data.contact.linkedin}</span>}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* Executive Summary */}
        {data.summary && (
          <div>
            <h2 className="cv-section-heading text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
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
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="cv-section-heading text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
              Career Track & Leadership
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp) => (
                <div key={exp.id} className="cv-experience-item space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-sm">
                      <InlineText
                        value={exp.role}
                        onSave={(val) => onUpdateExperience && onUpdateExperience(exp.id, "role", val)}
                      />
                      {exp.company && (
                        <span className="text-slate-500 font-normal">
                          {" "}|{" "}
                          <InlineText
                            value={exp.company}
                            onSave={(val) => onUpdateExperience && onUpdateExperience(exp.id, "company", val)}
                          />
                        </span>
                      )}
                    </span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-[10px] text-slate-500 font-bold ml-2 shrink-0">{exp.startDate} – {exp.endDate}</span>
                    )}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1">
                      {exp.bullets.map((b, idx) => (
                        <li key={idx} className="cv-bullet-item">
                          <InlineText
                            value={b}
                            onSave={(val) => {
                              if (onUpdateExperience) {
                                const updatedBullets = [...exp.bullets];
                                updatedBullets[idx] = val;
                                onUpdateExperience(exp.id, "bullets", updatedBullets);
                              }
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skillGroups && data.skillGroups.length > 0 && (
          <div>
            <h2 className="cv-section-heading text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
              Core Competencies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {data.skillGroups.map((sg) => (
                <div key={sg.id} className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <p className="font-bold text-slate-900 text-[11px] mb-1">{sg.category}</p>
                  <p className="text-[10px] text-slate-600">{sg.skills.join(" • ")}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div>
            <h2 className="cv-section-heading text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-2">
              Academic Background
            </h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id} className="cv-education-item flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree || edu.field ? `${edu.degree} ${edu.field}` : "Academic Degree"}</span>
                    {edu.institution && <span className="text-slate-600"> — {edu.institution}</span>}
                  </div>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-[10px] text-slate-500 font-mono ml-2 shrink-0">{edu.startDate} – {edu.endDate}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
