"use client";

import React from "react";
import { TemplateProps } from "../types";
import { InlineText } from "@/components/studio/InlineText";

export function ATSProfessionalTemplate({ data, theme, onUpdateContact, onUpdateSummary, onUpdateExperience }: TemplateProps) {
  const primaryColor = theme.primaryColor || "#0284c7";

  return (
    <div className="bg-white text-slate-900 font-sans text-xs space-y-5 w-full">
      {/* Header */}
      <div className="border-b-2 pb-4 flex justify-between items-start" style={{ borderColor: primaryColor }}>
        <div className="flex-1">
          <InlineText
            value={data.contact.name || "Candidate Name"}
            onSave={(val) => onUpdateContact && onUpdateContact("name", val)}
            tag="h1"
            className="text-2xl font-extrabold tracking-tight uppercase text-slate-900"
          />
          {data.contact.title && (
            <InlineText
              value={data.contact.title}
              onSave={(val) => onUpdateContact && onUpdateContact("title", val)}
              tag="p"
              className="text-sm font-semibold mt-1"
              style={{ color: primaryColor }}
            />
          )}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 mt-2">
            {data.contact.email && (
              <InlineText value={data.contact.email} onSave={(val) => onUpdateContact && onUpdateContact("email", val)} />
            )}
            {data.contact.email && data.contact.phone && <span>•</span>}
            {data.contact.phone && (
              <InlineText value={data.contact.phone} onSave={(val) => onUpdateContact && onUpdateContact("phone", val)} />
            )}
            {(data.contact.email || data.contact.phone) && data.contact.location && <span>•</span>}
            {data.contact.location && (
              <InlineText value={data.contact.location} onSave={(val) => onUpdateContact && onUpdateContact("location", val)} />
            )}
            {data.contact.linkedin && (
              <>
                <span>•</span>
                <InlineText value={data.contact.linkedin} onSave={(val) => onUpdateContact && onUpdateContact("linkedin", val)} className="font-semibold" />
              </>
            )}
          </div>
        </div>

        {/* Candidate Profile Photo (if available) */}
        {data.contact.photoUrl && (
          <div className="ml-4 shrink-0">
            <img
              src={data.contact.photoUrl}
              alt={data.contact.name}
              className="w-16 h-16 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: primaryColor }}
            />
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <div>
          <h2 className="cv-section-heading text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: primaryColor }}>
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
      {data.experience && data.experience.length > 0 && (
        <div>
          <h2 className="cv-section-heading text-xs font-bold uppercase tracking-wider border-b pb-1 mb-3" style={{ color: primaryColor, borderColor: primaryColor }}>
            Work Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className="cv-experience-item space-y-1">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {exp.role && (
                      <InlineText
                        value={exp.role}
                        onSave={(val) => onUpdateExperience && onUpdateExperience(exp.id, "role", val)}
                      />
                    )}
                    {exp.role && exp.company && <span>—</span>}
                    {exp.company && (
                      <InlineText
                        value={exp.company}
                        onSave={(val) => onUpdateExperience && onUpdateExperience(exp.id, "company", val)}
                        style={{ color: primaryColor }}
                      />
                    )}
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{exp.startDate} – {exp.endDate}</span>
                  )}
                </div>
                {exp.location && (
                  <InlineText
                    value={exp.location}
                    onSave={(val) => onUpdateExperience && onUpdateExperience(exp.id, "location", val)}
                    tag="p"
                    className="text-[11px] text-slate-600 italic"
                  />
                )}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-slate-700 mt-1 pl-1">
                    {exp.bullets.map((b, idx) => (
                      <li key={idx} className="cv-bullet-item leading-normal">
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
          <h2 className="cv-section-heading text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: primaryColor }}>
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
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div>
          <h2 className="cv-section-heading text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2" style={{ color: primaryColor, borderColor: primaryColor }}>
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="cv-education-item flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree || edu.field ? `${edu.degree} ${edu.field}` : "Education Degree"}</span>
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
  );
}
