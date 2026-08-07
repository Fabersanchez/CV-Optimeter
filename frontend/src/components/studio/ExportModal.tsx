"use client";

import React, { useState } from "react";
import { Download, FileCode, Printer, X, Check } from "lucide-react";
import { ResumeData } from "@/types/resume";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
}

export function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  const [downloaded, setDownloaded] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrintPDF = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    setDownloaded("html");
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${data.contact.name} - Resume</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; line-height: 1.6; }
    h1 { font-size: 26px; margin-bottom: 4px; color: #0f172a; text-transform: uppercase; }
    .title { font-size: 14px; font-weight: bold; color: #0284c7; margin-bottom: 16px; }
    .contact { font-size: 12px; color: #64748b; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px; }
    h2 { font-size: 14px; color: #0284c7; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 24px; }
    .content { font-size: 13px; }
  </style>
</head>
<body>
  <h1>${data.contact.name}</h1>
  <div class="title">${data.contact.title}</div>
  <div class="contact">${data.contact.email} | ${data.contact.phone} | ${data.contact.location} | ${data.contact.linkedin}</div>

  <h2>Professional Summary</h2>
  <div class="content">${data.summary}</div>

  <h2>Experience</h2>
  <div class="content">
    ${data.experience.map(e => `
      <div style="margin-bottom: 12px;">
        <strong>${e.role} — ${e.company}</strong> (${e.startDate} – ${e.endDate})
        <ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.contact.name.replace(/\s+/g, "_")}_Resume.html`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloaded(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 max-w-lg w-full space-y-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            Export Studio High-Fidelity Output
          </h2>
          <p className="text-xs text-slate-400">Download your resume in ATS-compatible formats.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePrintPDF}
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Printer className="w-6 h-6 text-brand-400" />
              <div>
                <p className="text-xs font-bold text-slate-200 group-hover:text-brand-300">Export as High-Res PDF</p>
                <p className="text-[11px] text-slate-400">Print to vector PDF ready for job applications.</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400">PDF</span>
          </button>

          <button
            onClick={handleDownloadHTML}
            className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-left transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <FileCode className="w-6 h-6 text-sky-400" />
              <div>
                <p className="text-xs font-bold text-slate-200 group-hover:text-sky-300">Export as Clean HTML</p>
                <p className="text-[11px] text-slate-400">Web-standard HTML file with inline CSS.</p>
              </div>
            </div>
            {downloaded === "html" ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                <Check className="w-4 h-4" /> Saved!
              </span>
            ) : (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-400">HTML</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
