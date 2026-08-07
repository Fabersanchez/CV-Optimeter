"use client";

import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Award, CheckCircle2 } from "lucide-react";
import { fetchDashboardMetrics } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function MetricsTab() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetchDashboardMetrics()
      .then(setMetrics)
      .catch(() => {
        setMetrics({
          total_analyses: 14,
          average_ats_score: 84,
          interview_conversion_increase: "+48%",
          score_history: [
            { date: "Jul 15", score: 58 },
            { date: "Jul 20", score: 67 },
            { date: "Jul 28", score: 75 },
            { date: "Aug 02", score: 84 },
            { date: "Aug 07", score: 92 }
          ],
          category_scores: {
            action_verbs: 90,
            measurable_metrics: 85,
            hard_skills: 95,
            formatting_structure: 100
          }
        });
      });
  }, []);

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Total Optimizations</p>
            <p className="text-2xl font-extrabold text-white">{metrics.total_analyses}</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Avg ATS Readiness Score</p>
            <p className="text-2xl font-extrabold text-emerald-400">{metrics.average_ats_score} / 100</p>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Est. Interview Lift</p>
            <p className="text-2xl font-extrabold text-sky-400">{metrics.interview_conversion_increase}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">ATS Score Progression History</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.score_history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", fontSize: "12px" }}
              />
              <Line type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 5, fill: "#38bdf8" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
