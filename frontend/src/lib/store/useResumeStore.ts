import { useState, useCallback, useEffect } from "react";
import {
  ResumeData,
  ThemeConfig,
  TemplateCategory,
  ContactInfo,
  WorkExperience,
  EducationItem,
  SkillGroup,
  ProjectItem,
  SectionType
} from "@/types/resume";

export const initialResumeData: ResumeData = {
  id: "cv-001",
  title: "Senior Full Stack Engineer Resume",
  contact: {
    name: "Alex Morgan",
    title: "Senior Full Stack & AI Systems Architect",
    email: "alex.morgan@devmail.io",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Open to Remote)",
    linkedin: "linkedin.com/in/alex-morgan-tech",
    github: "github.com/alex-morgan",
    website: "alexmorgan.dev"
  },
  summary:
    "Results-driven Senior Software Engineer with 6+ years of experience architecting high-throughput microservices, real-time web applications, and AI-backed SaaS platforms. Track record of scaling cloud infrastructure to handle 2M+ daily requests while reducing latency by 45%.",
  experience: [
    {
      id: "exp-1",
      company: "TechPulse Innovations",
      role: "Senior Full Stack Developer",
      location: "San Francisco, CA",
      startDate: "2023",
      endDate: "Present",
      current: true,
      description: "Spearheaded core SaaS backend architecture and real-time frontend dashboard.",
      bullets: [
        "Architected scalable real-time data streaming pipeline using FastAPI and Redis, handling 2M+ daily events with 99.99% uptime.",
        "Engineered Next.js 14 glassmorphic web dashboard, improving core web vitals and user session duration by 35%.",
        "Mentored cross-functional team of 6 engineers and established CI/CD automated testing standards."
      ]
    },
    {
      id: "exp-2",
      company: "CloudScale Systems",
      role: "Software Engineer",
      location: "Austin, TX",
      startDate: "2020",
      endDate: "2023",
      current: false,
      description: "Developed distributed web applications and cloud integrations.",
      bullets: [
        "Developed RESTful APIs and PostgreSQL database schemas serving 100k+ active SaaS users.",
        "Increased automated unit and integration test coverage from 60% to 92%, reducing production bugs by 40%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      field: "Computer Science",
      location: "Berkeley, CA",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.85 / 4.0",
      description: "Focus on Distributed Systems, Algorithms, and Artificial Intelligence."
    }
  ],
  skillGroups: [
    {
      id: "sg-1",
      category: "Languages & Frameworks",
      skills: ["Python", "TypeScript", "JavaScript", "React", "Next.js", "FastAPI", "Node.js", "HTML5/CSS3"]
    },
    {
      id: "sg-2",
      category: "Backend & Databases",
      skills: ["PostgreSQL", "Redis", "SQLAlchemy", "REST API", "GraphQL", "Microservices"]
    },
    {
      id: "sg-3",
      category: "DevOps & Cloud",
      skills: ["Docker", "Kubernetes", "AWS (EC2, S3, RDS)", "Git", "GitHub Actions", "CI/CD"]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "CV Optimeter AI SaaS Platform",
      role: "Lead Architect & Creator",
      link: "https://cvoptimeter.ai",
      startDate: "2026",
      endDate: "Present",
      description: "Enterprise-grade AI resume optimizer and ATS scoring platform.",
      bullets: [
        "Built 0-100 multi-category ATS audit scoring engine and STAR bullet point rewriter.",
        "Designed modular Next.js frontend with live visual studio and dual AI fallback engine."
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2024"
    }
  ],
  customSections: [],
  sectionOrder: ["summary", "experience", "skills", "education", "projects", "certifications"]
};

export const defaultTheme: ThemeConfig = {
  primaryColor: "#0284c7",
  secondaryColor: "#0f172a",
  accentColor: "#38bdf8",
  textColor: "#0f172a",
  backgroundColor: "#ffffff",
  fontPairing: "inter",
  fontSizeScale: "normal",
  spacingDensity: "normal",
  borderRadius: "md",
  layoutColumns: 1,
  headerStyle: "left-aligned",
  dividerStyle: "solid"
};

export function useResumeStore() {
  const [data, setData] = useState<ResumeData>(initialResumeData);
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme);
  const [activeTemplate, setActiveTemplate] = useState<TemplateCategory>("ats-professional");
  
  // History Stack for Undo / Redo
  const [past, setPast] = useState<ResumeData[]>([]);
  const [future, setFuture] = useState<ResumeData[]>([]);

  const pushState = useCallback((newData: ResumeData) => {
    setPast((prev) => [...prev, data]);
    setData(newData);
    setFuture([]);
  }, [data]);

  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setFuture((prev) => [data, ...prev]);
    setData(previous);
    setPast(newPast);
  }, [past, data]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setPast((prev) => [...prev, data]);
    setData(next);
    setFuture(newFuture);
  }, [future, data]);

  // Contact Info Mutations
  const updateContact = useCallback((field: keyof ContactInfo, value: string) => {
    pushState({
      ...data,
      contact: { ...data.contact, [field]: value }
    });
  }, [data, pushState]);

  // Summary Mutation
  const updateSummary = useCallback((summary: string) => {
    pushState({ ...data, summary });
  }, [data, pushState]);

  // Experience Mutations
  const updateExperience = useCallback((id: string, field: keyof WorkExperience, value: any) => {
    const updated = data.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    pushState({ ...data, experience: updated });
  }, [data, pushState]);

  const addExperience = useCallback(() => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      role: "Job Title",
      location: "City, Country",
      startDate: "2024",
      endDate: "Present",
      current: true,
      description: "Brief role summary",
      bullets: ["Accomplished key objective yielding quantifiable growth."]
    };
    pushState({ ...data, experience: [newExp, ...data.experience] });
  }, [data, pushState]);

  const removeExperience = useCallback((id: string) => {
    pushState({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id)
    });
  }, [data, pushState]);

  const duplicateExperience = useCallback((id: string) => {
    const target = data.experience.find((exp) => exp.id === id);
    if (!target) return;
    const copy: WorkExperience = {
      ...target,
      id: `exp-${Date.now()}`,
      company: `${target.company} (Copy)`
    };
    pushState({ ...data, experience: [...data.experience, copy] });
  }, [data, pushState]);

  // Education Mutations
  const updateEducation = useCallback((id: string, field: keyof EducationItem, value: any) => {
    const updated = data.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    pushState({ ...data, education: updated });
  }, [data, pushState]);

  const addEducation = useCallback(() => {
    const newEdu: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "University / Institute",
      degree: "Degree / Certification",
      field: "Field of Study",
      location: "City, Country",
      startDate: "2020",
      endDate: "2024"
    };
    pushState({ ...data, education: [...data.education, newEdu] });
  }, [data, pushState]);

  const removeEducation = useCallback((id: string) => {
    pushState({
      ...data,
      education: data.education.filter((edu) => edu.id !== id)
    });
  }, [data, pushState]);

  // Skill Group Mutations
  const updateSkillGroup = useCallback((id: string, category: string, skills: string[]) => {
    const updated = data.skillGroups.map((sg) =>
      sg.id === id ? { ...sg, category, skills } : sg
    );
    pushState({ ...data, skillGroups: updated });
  }, [data, pushState]);

  // Section Ordering Mutation
  const reorderSections = useCallback((newOrder: SectionType[]) => {
    pushState({ ...data, sectionOrder: newOrder });
  }, [data, pushState]);

  // Theme & Template Mutations
  const updateTheme = useCallback((partialTheme: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...partialTheme }));
  }, []);

  const changeTemplate = useCallback((templateId: TemplateCategory) => {
    setActiveTemplate(templateId);
  }, []);

  return {
    data,
    theme,
    activeTemplate,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
    updateContact,
    updateSummary,
    updateExperience,
    addExperience,
    removeExperience,
    duplicateExperience,
    updateEducation,
    addEducation,
    removeEducation,
    updateSkillGroup,
    reorderSections,
    updateTheme,
    changeTemplate,
    setData,
    setTheme
  };
}
