import { TemplateMeta, TemplateCategory } from "@/types/resume";
import { ATSProfessionalTemplate } from "./renderers/ATSProfessionalTemplate";
import { ExecutiveTemplate } from "./renderers/ExecutiveTemplate";
import { CorporateTemplate } from "./renderers/CorporateTemplate";
import { ModernTemplate } from "./renderers/ModernTemplate";
import { MinimalistTemplate } from "./renderers/MinimalistTemplate";
import { CreativeTemplate } from "./renderers/CreativeTemplate";
import { AcademicTemplate } from "./renderers/AcademicTemplate";
import { EngineeringTemplate } from "./renderers/EngineeringTemplate";
import { TechnologyTemplate } from "./renderers/TechnologyTemplate";
import { HealthcareTemplate } from "./renderers/HealthcareTemplate";
import { FinanceTemplate } from "./renderers/FinanceTemplate";
import { LegalMarketingTemplate } from "./renderers/LegalMarketingTemplate";

export const templateRegistry: Record<TemplateCategory, TemplateMeta> = {
  "ats-professional": {
    id: "ats-professional",
    name: "ATS Professional",
    categoryName: "ATS Optimization",
    description: "Ultra-clean single column layout guaranteed for 99%+ ATS parser pass rates.",
    recommendedFor: ["Software Engineers", "Data Scientists", "General Industry"],
    atsScoreRating: 99,
    badge: "99% ATS Pass Rate",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    previewGradient: "from-sky-600 to-indigo-600",
    defaultTheme: {
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
    }
  },
  "executive": {
    id: "executive",
    name: "Executive Leadership",
    categoryName: "Executive & C-Suite",
    description: "Deep navy header band tailored for Vice Presidents, Directors, and Senior Executives.",
    recommendedFor: ["VPs", "Directors", "CEOs", "C-Level Leadership"],
    atsScoreRating: 95,
    badge: "Executive Favorite",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    previewGradient: "from-slate-900 to-slate-800",
    defaultTheme: {
      primaryColor: "#0f172a",
      secondaryColor: "#1e293b",
      accentColor: "#38bdf8",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "inter",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "md",
      layoutColumns: 1,
      headerStyle: "banner",
      dividerStyle: "solid"
    }
  },
  "corporate": {
    id: "corporate",
    name: "Corporate Standard",
    categoryName: "Enterprise",
    description: "Structured corporate grid layout with subtle vertical accent bars.",
    recommendedFor: ["Project Managers", "Consultants", "Business Analysts"],
    atsScoreRating: 96,
    badge: "Corporate Choice",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    previewGradient: "from-blue-700 to-slate-800",
    defaultTheme: {
      primaryColor: "#1e293b",
      secondaryColor: "#334155",
      accentColor: "#0284c7",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "roboto",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "sm",
      layoutColumns: 1,
      headerStyle: "left-aligned",
      dividerStyle: "solid"
    }
  },
  "modern": {
    id: "modern",
    name: "Modern Glass",
    categoryName: "Modern Tech",
    description: "Dynamic layout featuring skill pills and cyan accent highlights.",
    recommendedFor: ["Frontend Developers", "Product Designers", "SaaS Roles"],
    atsScoreRating: 94,
    badge: "Modern UI",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    previewGradient: "from-sky-500 to-teal-500",
    defaultTheme: {
      primaryColor: "#0ea5e9",
      secondaryColor: "#0f172a",
      accentColor: "#38bdf8",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "outfit",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "md",
      layoutColumns: 1,
      headerStyle: "left-aligned",
      dividerStyle: "gradient"
    }
  },
  "minimalist": {
    id: "minimalist",
    name: "Minimalist Clean",
    categoryName: "Minimalist",
    description: "High-contrast typography with generous whitespace and elegant divider lines.",
    recommendedFor: ["UX Designers", "Architects", "Writers"],
    atsScoreRating: 97,
    badge: "Ultra Clean",
    badgeColor: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    previewGradient: "from-slate-700 to-slate-900",
    defaultTheme: {
      primaryColor: "#0f172a",
      secondaryColor: "#475569",
      accentColor: "#64748b",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "inter",
      fontSizeScale: "normal",
      spacingDensity: "spacious",
      borderRadius: "none",
      layoutColumns: 1,
      headerStyle: "left-aligned",
      dividerStyle: "solid"
    }
  },
  "creative": {
    id: "creative",
    name: "Creative Split 2-Column",
    categoryName: "Creative & Design",
    description: "Split 2-column layout with dark left sidebar for contact details and skills.",
    recommendedFor: ["UI/UX Designers", "Animators", "Marketing Leads"],
    atsScoreRating: 88,
    badge: "Visual Impact",
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    previewGradient: "from-purple-600 to-pink-600",
    defaultTheme: {
      primaryColor: "#38bdf8",
      secondaryColor: "#0f172a",
      accentColor: "#f43f5e",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "outfit",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "md",
      layoutColumns: 2,
      headerStyle: "split",
      dividerStyle: "solid"
    }
  },
  "academic": {
    id: "academic",
    name: "Academic CV",
    categoryName: "Academic & Research",
    description: "Formal serif layout tailored for professors, researchers, and PhD candidates.",
    recommendedFor: ["Researchers", "Professors", "PhD Candidates"],
    atsScoreRating: 98,
    badge: "Research Ready",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    previewGradient: "from-amber-700 to-slate-800",
    defaultTheme: {
      primaryColor: "#475569",
      secondaryColor: "#1e293b",
      accentColor: "#94a3b8",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "merriweather",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "none",
      layoutColumns: 1,
      headerStyle: "centered",
      dividerStyle: "solid"
    }
  },
  "engineering": {
    id: "engineering",
    name: "Engineering & DevOps",
    categoryName: "Engineering",
    description: "Structured layout with technical infrastructure matrix and metrics highlights.",
    recommendedFor: ["DevOps Engineers", "Cloud Architects", "Site Reliability"],
    atsScoreRating: 97,
    badge: "Tech Matrix",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    previewGradient: "from-indigo-700 to-blue-900",
    defaultTheme: {
      primaryColor: "#0284c7",
      secondaryColor: "#0f172a",
      accentColor: "#38bdf8",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "fira-code",
      fontSizeScale: "compact",
      spacingDensity: "compact",
      borderRadius: "sm",
      layoutColumns: 1,
      headerStyle: "left-aligned",
      dividerStyle: "solid"
    }
  },
  "technology": {
    id: "technology",
    name: "Technology Stack",
    categoryName: "Full Stack Tech",
    description: "Monospace code headers with framework pills and GitHub repository tags.",
    recommendedFor: ["Full Stack Developers", "Backend Engineers"],
    atsScoreRating: 96,
    badge: "Code Stack",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    previewGradient: "from-cyan-600 to-blue-800",
    defaultTheme: {
      primaryColor: "#0284c7",
      secondaryColor: "#0f172a",
      accentColor: "#38bdf8",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "fira-code",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "sm",
      layoutColumns: 1,
      headerStyle: "left-aligned",
      dividerStyle: "solid"
    }
  },
  "healthcare": {
    id: "healthcare",
    name: "Healthcare Clinical",
    categoryName: "Healthcare",
    description: "Clean emerald blue tones tailored for medical practitioners and nurses.",
    recommendedFor: ["Physicians", "Nurses", "Medical Specialists"],
    atsScoreRating: 98,
    badge: "Clinical Focus",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    previewGradient: "from-emerald-600 to-teal-800",
    defaultTheme: {
      primaryColor: "#059669",
      secondaryColor: "#064e3b",
      accentColor: "#34d399",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "roboto",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "md",
      layoutColumns: 1,
      headerStyle: "left-aligned",
      dividerStyle: "solid"
    }
  },
  "finance": {
    id: "finance",
    name: "Financial Analyst",
    categoryName: "Finance & Banking",
    description: "Formal dark slate layout emphasizing financial metrics and deal flow.",
    recommendedFor: ["Financial Analysts", "Investment Bankers", "CPAs"],
    atsScoreRating: 98,
    badge: "Finance Ready",
    badgeColor: "bg-slate-500/10 text-slate-300 border-slate-500/20",
    previewGradient: "from-slate-800 to-slate-950",
    defaultTheme: {
      primaryColor: "#0f172a",
      secondaryColor: "#1e293b",
      accentColor: "#0284c7",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "inter",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "none",
      layoutColumns: 1,
      headerStyle: "centered",
      dividerStyle: "solid"
    }
  },
  "legal-marketing": {
    id: "legal-marketing",
    name: "Legal & Strategic Marketing",
    categoryName: "Legal & Growth",
    description: "Balanced indigo layout highlighting strategic initiatives and compliance.",
    recommendedFor: ["Attorneys", "Legal Counsel", "Growth Marketers"],
    atsScoreRating: 96,
    badge: "Strategic Impact",
    badgeColor: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    previewGradient: "from-indigo-600 to-purple-800",
    defaultTheme: {
      primaryColor: "#4338ca",
      secondaryColor: "#1e1b4b",
      accentColor: "#818cf8",
      textColor: "#0f172a",
      backgroundColor: "#ffffff",
      fontPairing: "inter",
      fontSizeScale: "normal",
      spacingDensity: "normal",
      borderRadius: "md",
      layoutColumns: 1,
      headerStyle: "left-aligned",
      dividerStyle: "solid"
    }
  }
};

export const templateComponentMap: Record<TemplateCategory, React.ComponentType<any>> = {
  "ats-professional": ATSProfessionalTemplate,
  "executive": ExecutiveTemplate,
  "corporate": CorporateTemplate,
  "modern": ModernTemplate,
  "minimalist": MinimalistTemplate,
  "creative": CreativeTemplate,
  "academic": AcademicTemplate,
  "engineering": EngineeringTemplate,
  "technology": TechnologyTemplate,
  "healthcare": HealthcareTemplate,
  "finance": FinanceTemplate,
  "legal-marketing": LegalMarketingTemplate
};
