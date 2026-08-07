import { ResumeData, ThemeConfig } from "@/types/resume";

export interface TemplateProps {
  data: ResumeData;
  theme: ThemeConfig;
  onUpdateContact?: (field: any, val: string) => void;
  onUpdateSummary?: (val: string) => void;
  onUpdateExperience?: (id: string, field: any, val: any) => void;
}
