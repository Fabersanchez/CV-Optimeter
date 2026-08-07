export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  role: string;
  link: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: "Native" | "Fluent" | "Professional" | "Intermediate";
}

export interface AchievementItem {
  id: string;
  title: string;
  impact: string;
  metric: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export type SectionType =
  | "summary"
  | "experience"
  | "skills"
  | "education"
  | "projects"
  | "certifications"
  | "languages"
  | "achievements"
  | "custom";

export interface ResumeData {
  id: string;
  title: string;
  contact: ContactInfo;
  summary: string;
  experience: WorkExperience[];
  education: EducationItem[];
  skillGroups: SkillGroup[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  achievements: AchievementItem[];
  socialLinks: SocialLink[];
  customSections: CustomSection[];
  sectionOrder: SectionType[];
}

export type TemplateCategory =
  | "ats-professional"
  | "executive"
  | "corporate"
  | "technology"
  | "engineering"
  | "medical"
  | "finance"
  | "legal-marketing"
  | "academic"
  | "creative"
  | "minimalist"
  | "startup"
  | "ai-generated";

export type FontPairing =
  | "inter"
  | "roboto"
  | "playfair"
  | "fira-code"
  | "outfit"
  | "merriweather";

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  fontPairing: FontPairing;
  fontSizeScale: "compact" | "normal" | "large";
  spacingDensity: "compact" | "normal" | "spacious";
  borderRadius: "none" | "sm" | "md" | "full";
  layoutColumns: 1 | 2;
  headerStyle: "centered" | "left-aligned" | "banner" | "split";
  dividerStyle: "solid" | "dashed" | "gradient" | "none";
}

export interface TemplateMeta {
  id: TemplateCategory;
  name: string;
  categoryName: string;
  description: string;
  recommendedFor: string[];
  atsScoreRating: number;
  visualScoreRating: number;
  badge: string;
  badgeColor: string;
  previewGradient: string;
  defaultTheme: ThemeConfig;
}
