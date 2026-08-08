"use client";

import React, { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useDocumentSessionStore } from "@/lib/store/useDocumentSessionStore";
import { ResumeData } from "@/types/resume";

interface UploadManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentImported: (data: ResumeData) => void;
}

export function UploadManagerModal({
  isOpen,
  onClose,
  onDocumentImported
}: UploadManagerModalProps) {
  const sessionStore = useDocumentSessionStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"IDLE" | "UPLOADING" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("File size exceeds maximum allowed limit of 15MB.");
      setStatus("ERROR");
      return;
    }

    setSelectedFile(file);
    setStatus("UPLOADING");
    setErrorMessage(null);

    try {
      // Ingest file using DocumentSession pipeline
      const session = await sessionStore.uploadDocument(file);

      setStatus("SUCCESS");

      setTimeout(() => {
        if (session && session.candidate_cv) {
          onDocumentImported(session.candidate_cv);
        }
        onClose();
        resetState();
      }, 600);
    } catch (err: any) {
      console.error("Document Ingestion Error:", err);
      setStatus("ERROR");
      setErrorMessage(err.message || "No pudimos interpretar completamente esta sección.");
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setStatus("IDLE");
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-slate-100 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Import Candidate CV</h2>
              <p className="text-[11px] text-slate-400">PDF, DOCX, DOC, TXT, RTF, Markdown, HTML</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4">
          {status === "IDLE" && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileSelect(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragOver ? "border-blue-500 bg-blue-600/10 scale-[1.01]" : "border-slate-800 hover:border-slate-700 bg-slate-950/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt,.rtf,.md,.html,.htm"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
              />
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-3 shadow-inner">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-200">Click to upload or drag & drop your resume file</p>
              <p className="text-[10px] text-slate-500 mt-1">Maximum file size: 15MB</p>
              <div className="flex justify-center gap-1.5 mt-3 text-[9px] font-mono text-slate-400">
                <span>PDF</span> • <span>DOCX</span> • <span>DOC</span> • <span>TXT</span> • <span>RTF</span> • <span>MD</span> • <span>HTML</span>
              </div>
            </div>
          )}

          {status === "UPLOADING" && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 text-blue-400 text-xs font-bold">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span>Procesando DocumentSession Pipeline...</span>
              </div>

              <div className="space-y-1.5">
                <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${sessionStore.uploadProgress}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>{sessionStore.stageDescription}</span>
                  <span>{sessionStore.uploadProgress}%</span>
                </div>
              </div>
            </div>
          )}

          {status === "SUCCESS" && (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs font-bold text-emerald-300">DocumentSession Creada e Importada Exitosamente</p>
              <p className="text-[10px] text-emerald-400/80">Sincronizando schema real en el lienzo A4 y ATS...</p>
            </div>
          )}

          {status === "ERROR" && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <p className="leading-snug">{errorMessage || "No pudimos interpretar completamente esta sección."}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-rose-500/20">
                <button
                  onClick={resetState}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-semibold text-[11px] border border-rose-500/30 flex items-center gap-1 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reintentar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
