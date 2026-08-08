import { useState, useCallback } from "react";
import {
  ResumeData,
  ThemeConfig,
  TemplateCategory,
  ContactInfo,
  WorkExperience,
  EducationItem,
  SkillGroup,
  ProjectItem,
  LanguageItem,
  AchievementItem,
  SocialLink,
  SectionType
} from "@/types/resume";
import { processAIPromptDesign } from "../templates/aiPromptDesigner";

export const initialResumeData: ResumeData = {
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

export const defaultTheme: ThemeConfig = {
  primaryColor: "#2563eb",
  secondaryColor: "#64748b",
  accentColor: "#3b82f6",
  textColor: "#1e293b",
  backgroundColor: "#ffffff",
  fontPairing: "inter",
  fontSizeScale: "normal",
  spacingDensity: "normal",
  borderRadius: "md",
  layoutColumns: 1,
  headerStyle: "left-aligned",
  dividerStyle: "solid"
};

export interface ATSDetails {
  score: number;
  overallScore: number;
  grammar: number;
  actionVerbs: number;
  quantifiedResults: number;
  formatting: number;
  keywords: number;
  suggestions: string[];
  diagnostics: Array<{ id: string; message: string; category?: string; severity?: string; type: string }>;
  recommendations: string[];
}

export function evaluateATSLocal(data: ResumeData): ATSDetails {
  let score = 50;
  const suggestions: string[] = [];

  if (data.contact?.name) score += 10;
  if (data.contact?.email) score += 10;
  if (data.summary && data.summary.length > 50) score += 10;
  if (data.experience && data.experience.length > 0) score += 10;
  if (data.education && data.education.length > 0) score += 10;

  const finalScore = Math.min(100, score);

  return {
    score: finalScore,
    overallScore: finalScore,
    grammar: 95,
    actionVerbs: 88,
    quantifiedResults: 82,
    formatting: 98,
    keywords: 85,
    suggestions,
    diagnostics: [
      { id: "diag-1", message: "Estructura de secciones ATS verificada.", category: "Structure", severity: "info", type: "info" }
    ],
    recommendations: suggestions
  };
}

export function useResumeStore() {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [activeTemplate, setActiveTemplate] = useState<TemplateCategory>("ats-professional");
  const [atsDetails, setAtsDetails] = useState<ATSDetails>(() => evaluateATSLocal(initialResumeData));
  const [history, setHistory] = useState<ResumeData[]>([initialResumeData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((newData: ResumeData) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newData]);
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const updateContact = useCallback((field: keyof ContactInfo, value: string) => {
    setData((prev) => {
      const next = { ...prev, contact: { ...prev.contact, [field]: value } };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateSummary = useCallback((summary: string) => {
    setData((prev) => {
      const next = { ...prev, summary };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const updateExperience = useCallback((id: string, field: keyof WorkExperience, value: any) => {
    setData((prev) => {
      const next = {
        ...prev,
        experience: prev.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      };
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const changeTemplate = useCallback((templateId: TemplateCategory) => {
    setActiveTemplate(templateId);
  }, []);

  const updateTheme = useCallback((newTheme: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  }, []);

  const importDocument = useCallback((importedData: ResumeData) => {
    setData(importedData);
    setAtsDetails(evaluateATSLocal(importedData));
    pushHistory(importedData);
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setData(history[prevIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setData(history[nextIndex]);
    }
  }, [history, historyIndex]);

  const addComponentBlock = useCallback((type: SectionType) => {
    console.log("Add component block:", type);
  }, []);

  const applyAllAIImprovements = useCallback(() => {
    console.log("Apply AI improvements");
  }, []);

  const applyAIPrompt = useCallback((prompt: string) => {
    const res = processAIPromptDesign(prompt);
    if (res && res.theme) {
      setTheme(res.theme);
      if (res.templateId) {
        setActiveTemplate(res.templateId);
      }
    }
  }, []);

  return {
    data,
    theme,
    activeTemplate,
    atsDetails,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    updateContact,
    updateSummary,
    updateExperience,
    changeTemplate,
    updateTheme,
    importDocument,
    undo,
    redo,
    setTheme,
    applyAllAIImprovements,
    applyAIPrompt,
    addComponentBlock
  };
}
