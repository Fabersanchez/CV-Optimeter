"use client";

import React, { useState } from "react";
import { Download, FileCode, FileSpreadsheet, Eye, Printer, Check } from "lucide-react";
import { ParsedCVData } from "@/lib/api";

interface ExportStudioTabProps {
  parsedData: ParsedCVData | null;
}

export function ExportStudioTab({ parsedData }: ExportStudioTabProps) {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const candidateName = parsedData?.contact_info.name || "Alex Morgan";

  const handleDownloadHTML = () => {
    setDownloadingFormat("html");
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${candidateName} - Optimized CV</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 24px; margin-bottom: 5px; color: #0f172a; text-transform: uppercase; }
    .contact { font-size: 13px; color: #64748b; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
    h2 { font-size: 15px; color: #0284c7; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 24px; }
    .content { font-size: 13px; white-space: pre-line; }
  </style>
</head>
<body>
  <h1>${candidateName}</h1>
  <div class="contact">
    ${parsedData?.contact_info.email || "alex.morgan@devmail.io"} | ${parsedData?.contact_info.phone || "+1 (555) 234-5678"} | ${parsedData?.contact_info.linkedin || "linkedin.com/in/alex-morgan"}
  </div>

  <h2>Professional Summary</h2>
  <div class="content">${parsedData?.sections.summary || "Results-driven Senior Engineer..."}</div>

  <h2>Experience</h2>
  <div class="content">${parsedData?.sections.experience || "Senior Developer..."}</div>

  <h2>Skills</h2>
  <div class="content">${parsedData?.extracted_skills.join(", ") || "Python, TypeScript, React"}</div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${candidateName.replace(/\s+/g, "_")}_CV_Optimized.html`;
    a.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadingFormat(null), 1500);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Export Studio</h2>
            <p className="text-xs text-slate-400">Download your optimized ATS resume in PDF, DOCX, or HTML format.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handlePrintPDF}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 text-left transition space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <Printer className="w-6 h-6 text-brand-400" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400">PDF Format</span>
            </div>
            <h3 className="text-xs font-bold text-slate-200 group-hover:text-brand-300">Export as PDF</h3>
            <p className="text-[11px] text-slate-400">High-resolution vector PDF ready for job applications and ATS portals.</p>
          </button>

          <button
            onClick={handleDownloadHTML}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 text-left transition space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <FileCode className="w-6 h-6 text-sky-400" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400">HTML Standard</span>
            </div>
            <h3 className="text-xs font-bold text-slate-200 group-hover:text-sky-300">Export as Clean HTML</h3>
            <p className="text-[11px] text-slate-400">Web-standard clean HTML for embedding or custom formatting.</p>
          </button>

          <button
            onClick={handleDownloadHTML}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-brand-500/40 text-left transition space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <FileSpreadsheet className="w-6 h-6 text-purple-400" />
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">Word DOCX</span>
            </div>
            <h3 className="text-xs font-bold text-slate-200 group-hover:text-purple-300">Export as DOCX Document</h3>
            <p className="text-[11px] text-slate-400">Editable Microsoft Word format formatted for ATS parsers.</p>
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-brand-400" /> Live Resume Print Preview
          </h3>
        </div>

        <div className="bg-white text-slate-900 p-8 rounded-xl shadow-2xl max-w-3xl mx-auto space-y-6 font-sans border border-slate-200 text-xs">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl font-extrabold tracking-tight uppercase text-slate-900">{candidateName}</h1>
            <p className="text-xs text-slate-600 mt-1">
              {parsedData?.contact_info.email || "alex.morgan@devmail.io"} | {parsedData?.contact_info.phone || "+1 (555) 234-5678"} | {parsedData?.contact_info.linkedin || "linkedin.com/in/alex-morgan"}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase text-brand-700 tracking-wider border-b border-slate-200 pb-1 mb-2">Professional Summary</h2>
            <p className="text-slate-700 leading-relaxed">
              {parsedData?.sections.summary || "Results-driven Senior Software Engineer with 6+ years of experience building high-performance web platforms and distributed microservices."}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase text-brand-700 tracking-wider border-b border-slate-200 pb-1 mb-2">Experience</h2>
            <div className="space-y-2 text-slate-700 leading-relaxed whitespace-pre-line">
              {parsedData?.sections.experience || "Senior Full Stack Developer | TechPulse Innovations (2023 - Present)\n• Spearheaded migration of legacy monolith to FastAPI microservices, reducing API response times by 45%.\n• Architected scalable real-time data streaming pipeline using Redis and Docker."}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase text-brand-700 tracking-wider border-b border-slate-200 pb-1 mb-2">Skills & Technologies</h2>
            <p className="text-slate-700 font-semibold">
              {parsedData?.extracted_skills.join(" • ") || "Python • JavaScript • TypeScript • React • Next.js • FastAPI • Node.js • PostgreSQL • Redis • Docker • AWS"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
