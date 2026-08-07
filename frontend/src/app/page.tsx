"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar, TabType } from "@/components/Sidebar";
import { ResumeStudio } from "@/components/studio/ResumeStudio";
import { CVAnalyzerTab } from "@/components/tabs/CVAnalyzerTab";
import { AIRewriterTab } from "@/components/tabs/AIRewriterTab";
import { JobMatcherTab } from "@/components/tabs/JobMatcherTab";
import { CoverLetterTab } from "@/components/tabs/CoverLetterTab";
import { LinkedInTab } from "@/components/tabs/LinkedInTab";
import { MetricsTab } from "@/components/tabs/MetricsTab";
import { VersionHistoryTab } from "@/components/tabs/VersionHistoryTab";
import { ExportStudioTab } from "@/components/tabs/ExportStudioTab";
import { ParsedCVData, ATSAnalysisResult } from "@/lib/api";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("studio");
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header />

      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === "studio" && <ResumeStudio />}

          {activeTab === "analyzer" && (
            <div className="p-6 md:p-8">
              <CVAnalyzerTab
                parsedData={parsedData}
                setParsedData={setParsedData}
                atsResult={atsResult}
                setAtsResult={setAtsResult}
              />
            </div>
          )}

          {activeTab === "rewriter" && <div className="p-6 md:p-8"><AIRewriterTab /></div>}

          {activeTab === "matcher" && <div className="p-6 md:p-8"><JobMatcherTab /></div>}

          {activeTab === "cover-letter" && <div className="p-6 md:p-8"><CoverLetterTab /></div>}

          {activeTab === "linkedin" && <div className="p-6 md:p-8"><LinkedInTab /></div>}

          {activeTab === "metrics" && <div className="p-6 md:p-8"><MetricsTab /></div>}

          {activeTab === "history" && <div className="p-6 md:p-8"><VersionHistoryTab /></div>}

          {activeTab === "export" && <div className="p-6 md:p-8"><ExportStudioTab parsedData={parsedData} /></div>}
        </main>
      </div>
    </div>
  );
}
