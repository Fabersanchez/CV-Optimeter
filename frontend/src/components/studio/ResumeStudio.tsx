"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { StudioToolbar } from "./StudioToolbar";
import { StudioSidebar } from "./StudioSidebar";
import { StudioCanvas } from "./StudioCanvas";
import { ExportModal } from "./ExportModal";

export function ResumeStudio() {
  const store = useResumeStore();
  const [activePanel, setActivePanel] = useState<"templates" | "theme" | "sections" | "ai">("templates");
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans">
      <StudioToolbar
        canUndo={store.canUndo}
        canRedo={store.canRedo}
        onUndo={store.undo}
        onRedo={store.redo}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <StudioSidebar
          activePanel={activePanel}
          activeTemplate={store.activeTemplate}
          theme={store.theme}
          roleTitle={store.data.contact.title}
          onSelectTemplate={store.changeTemplate}
          onUpdateTheme={store.updateTheme}
        />

        <StudioCanvas
          data={store.data}
          theme={store.theme}
          activeTemplate={store.activeTemplate}
          onUpdateContact={store.updateContact}
          onUpdateSummary={store.updateSummary}
          onUpdateExperience={store.updateExperience}
        />
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={store.data}
      />
    </div>
  );
}
