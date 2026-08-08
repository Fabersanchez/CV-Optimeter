"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ResumeData, ThemeConfig, TemplateCategory } from "@/types/resume";
import { defaultTheme, ATSDetails, evaluateATSLocal } from "./useResumeStore";

export type ViewMode = "ORIGINAL" | "EDITABLE" | "COMPARISON" | "OVERLAY";
export type ProcessingStatus =
  | "IDLE"
  | "UPLOADING"
  | "PARSING"
  | "NORMALIZING"
  | "STRUCTURING"
  | "VALIDATING"
  | "READY"
  | "RENDERING"
  | "ERROR";

export interface OriginalFile {
  filename: string;
  mime_type: string;
  extension: string;
  size: number;
  file_hash?: string;
  page_count: number;
  content_b64?: string;
}

export interface SourceMapItem {
  source_document: string;
  page: number;
  source_text: string;
  confidence: number;
}

export interface Asset {
  asset_id: string;
  source: string;
  mime_type: string;
  usage: string;
  url_or_b64: string;
}

export interface DocumentFidelityMetrics {
  overall: number;
  extraction_accuracy: number;
  section_accuracy: number;
  field_accuracy: number;
  asset_accuracy: number;
  render_accuracy: number;
}

export interface DocumentSession {
  session_id: string;
  document_id: string;
  original_file: OriginalFile;
  raw_content: string;
  normalized_content: string;
  candidate_cv: ResumeData;
  source_map: Record<string, SourceMapItem>;
  assets: Asset[];
  template: TemplateCategory;
  processing_status: ProcessingStatus;
  processing_errors: string[];
  processing_warnings: string[];
  version: number;
  confidence: Record<string, number>;
  fidelity: DocumentFidelityMetrics;
}

export const emptyResumeData: ResumeData = {
  id: "",
  title: "",
  contact: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    photoUrl: ""
  },
  summary: "",
  experience: [],
  education: [],
  skillGroups: [],
  projects: [],
  certifications: [],
  languages: [],
  achievements: [],
  socialLinks: [],
  customSections: [],
  sectionOrder: ["summary", "experience", "skills", "education", "certifications", "languages"]
};

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

interface DocumentSessionContextType {
  currentSession: DocumentSession | null;
  viewMode: ViewMode;
  overlayOpacity: number;
  activeTemplate: TemplateCategory;
  theme: ThemeConfig;
  atsDetails: ATSDetails | null;
  isProcessing: boolean;
  uploadProgress: number;
  stageDescription: string;
  error: string | null;
  setViewMode: (mode: ViewMode) => void;
  setOverlayOpacity: (op: number) => void;
  setActiveTemplate: (tmpl: TemplateCategory) => void;
  uploadDocument: (file: File) => Promise<DocumentSession>;
  updateCandidateCv: (newCv: ResumeData) => Promise<void>;
  changeTemplate: (templateId: TemplateCategory) => void;
  clearSession: () => void;
}

const DocumentSessionContext = createContext<DocumentSessionContextType | null>(null);

export function DocumentSessionProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<DocumentSession | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("EDITABLE");
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50);
  const [activeTemplate, setActiveTemplate] = useState<TemplateCategory>("ats-professional");
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [atsDetails, setAtsDetails] = useState<ATSDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [stageDescription, setStageDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = useCallback(async (file: File): Promise<DocumentSession> => {
    setIsProcessing(true);
    setUploadProgress(5);
    setStageDescription("Validando archivo y creando sesión...");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.detail || "Error uploading document.");
      }

      const result = await response.json();
      const sessionId = result.session_id;

      // Status Polling Loop
      return new Promise<DocumentSession>((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 60;

        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const statusRes = await fetch(`${API_BASE_URL}/documents/${sessionId}/status`);
            if (!statusRes.ok) {
              clearInterval(pollInterval);
              setIsProcessing(false);
              reject(new Error("Failed to fetch session status"));
              return;
            }

            const statusData = await statusRes.json();
            const sessionData: DocumentSession = statusData.session;
            const currentStatus = statusData.status;

            setUploadProgress(statusData.progress || 10);
            setStageDescription(statusData.stage_description || "Procesando...");

            if (currentStatus === "COMPLETED") {
              clearInterval(pollInterval);

              const cvData: ResumeData = {
                id: sessionData.candidate_cv?.id || `cv-${Date.now()}`,
                title: sessionData.candidate_cv?.title || `${file.name} CV`,
                contact: {
                  name: sessionData.candidate_cv?.contact?.name || "",
                  title: sessionData.candidate_cv?.contact?.title || "",
                  email: sessionData.candidate_cv?.contact?.email || "",
                  phone: sessionData.candidate_cv?.contact?.phone || "",
                  location: sessionData.candidate_cv?.contact?.location || "",
                  linkedin: sessionData.candidate_cv?.contact?.linkedin || "",
                  github: sessionData.candidate_cv?.contact?.github || "",
                  website: sessionData.candidate_cv?.contact?.website || "",
                  photoUrl: sessionData.candidate_cv?.contact?.photoUrl || ""
                },
                summary: sessionData.candidate_cv?.summary || "",
                experience: (sessionData.candidate_cv?.experience || []).map((e: any, i: number) => ({
                  id: e.id || `exp-${i + 1}`,
                  company: e.company || "",
                  role: e.role || e.position || "",
                  location: e.location || "",
                  startDate: e.startDate || "",
                  endDate: e.endDate || "Present",
                  current: e.current || false,
                  description: e.description || "",
                  bullets: e.bullets || e.responsibilities || []
                })),
                education: (sessionData.candidate_cv?.education || []).map((edu: any, i: number) => ({
                  id: edu.id || `edu-${i + 1}`,
                  institution: edu.institution || "",
                  degree: edu.degree || "",
                  field: edu.field || "",
                  location: edu.location || "",
                  startDate: edu.startDate || "",
                  endDate: edu.endDate || "",
                  gpa: edu.gpa || "",
                  description: edu.description || ""
                })),
                skillGroups: sessionData.candidate_cv?.skillGroups || [],
                projects: sessionData.candidate_cv?.projects || [],
                certifications: sessionData.candidate_cv?.certifications || [],
                languages: sessionData.candidate_cv?.languages || [],
                achievements: sessionData.candidate_cv?.achievements || [],
                socialLinks: sessionData.candidate_cv?.socialLinks || [],
                customSections: sessionData.candidate_cv?.customSections || [],
                sectionOrder: sessionData.candidate_cv?.sectionOrder || [
                  "summary", "experience", "skills", "education", "certifications", "languages"
                ]
              };

              const updatedSession: DocumentSession = {
                ...sessionData,
                candidate_cv: cvData
              };

              setCurrentSession(updatedSession);
              if (statusData.ats) setAtsDetails(statusData.ats);
              else setAtsDetails(evaluateATSLocal(cvData));

              setIsProcessing(false);
              resolve(updatedSession);
            } else if (currentStatus === "FAILED" || currentStatus === "TIMEOUT" || currentStatus === "CANCELLED") {
              clearInterval(pollInterval);
              setIsProcessing(false);
              const errMsg = statusData.error_message || `Sesión finalizada con estado: ${currentStatus}`;
              setError(errMsg);
              reject(new Error(errMsg));
            } else if (attempts >= maxAttempts) {
              clearInterval(pollInterval);
              setIsProcessing(false);
              setError("El procesamiento excedió el tiempo límite.");
              reject(new Error("Timeout waiting for document processing"));
            }
          } catch (pollErr: any) {
            clearInterval(pollInterval);
            setIsProcessing(false);
            reject(pollErr);
          }
        }, 300);
      });
    } catch (err: any) {
      console.error("DocumentSession Ingestion Failed:", err);
      setError(err.message || "Failed to ingest document.");
      setIsProcessing(false);
      throw err;
    }
  }, []);

  const updateCandidateCv = useCallback(async (newCv: ResumeData) => {
    if (!currentSession) return;
    const updatedSession: DocumentSession = {
      ...currentSession,
      candidate_cv: newCv,
      version: currentSession.version + 1
    };
    setCurrentSession(updatedSession);
    setAtsDetails(evaluateATSLocal(newCv));
  }, [currentSession]);

  const changeTemplate = useCallback((templateId: TemplateCategory) => {
    setActiveTemplate(templateId);
    if (currentSession) {
      setCurrentSession((prev) => prev ? { ...prev, template: templateId } : null);
    }
  }, [currentSession]);

  const clearSession = useCallback(() => {
    setCurrentSession(null);
    setAtsDetails(null);
  }, []);

  return React.createElement(
    DocumentSessionContext.Provider,
    {
      value: {
        currentSession,
        viewMode,
        overlayOpacity,
        activeTemplate,
        theme,
        atsDetails,
        isProcessing,
        uploadProgress,
        stageDescription,
        error,
        setViewMode,
        setOverlayOpacity,
        setActiveTemplate,
        uploadDocument,
        updateCandidateCv,
        changeTemplate,
        clearSession
      }
    },
    children
  );
}

export function useDocumentSessionStore() {
  const context = useContext(DocumentSessionContext);
  if (!context) {
    // Fallback instance if context provider is omitted
    return {
      currentSession: null,
      viewMode: "EDITABLE" as ViewMode,
      overlayOpacity: 50,
      activeTemplate: "ats-professional" as TemplateCategory,
      theme: defaultTheme,
      atsDetails: null,
      isProcessing: false,
      uploadProgress: 0,
      stageDescription: "",
      error: null,
      setViewMode: () => {},
      setOverlayOpacity: () => {},
      setActiveTemplate: () => {},
      uploadDocument: async () => { throw new Error("DocumentSessionProvider missing"); },
      updateCandidateCv: async () => {},
      changeTemplate: () => {},
      clearSession: () => {}
    };
  }
  return context;
}
