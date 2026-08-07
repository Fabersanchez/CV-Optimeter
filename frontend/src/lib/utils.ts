import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreGrade(score: number) {
  if (score >= 85) return { grade: "A+", label: "ATS Ready", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  if (score >= 70) return { grade: "B", label: "Good Potential", color: "text-sky-400 bg-sky-500/10 border-sky-500/30" };
  if (score >= 50) return { grade: "C", label: "Needs Optimization", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
  return { grade: "D", label: "High Risk", color: "text-rose-400 bg-rose-500/10 border-rose-500/30" };
}
