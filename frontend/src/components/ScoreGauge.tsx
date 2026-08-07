"use client";

import React from "react";
import { formatScoreGrade } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const { grade, label, color } = formatScoreGrade(score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass-panel relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />

      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="text-slate-800"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="text-brand-400 transition-all duration-1000 ease-out"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-extrabold text-white tracking-tight">{score}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ATS Score</span>
        </div>
      </div>

      <div className={`mt-3 px-3.5 py-1 rounded-full text-xs font-bold border ${color}`}>
        Grade {grade}: {label}
      </div>
    </div>
  );
}
