"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { StudioToolbar } from "./StudioToolbar";
import { AICopilotPanel } from "./AICopilotPanel";
import { VisualCanvas } from "./VisualCanvas";
import { ResourceLibrary } from "./ResourceLibrary";
import { PropertyInspector } from "./PropertyInspector";
import { AIDesignerModal } from "./AIDesignerModal";
import { VisualVersionModal } from "./VisualVersionModal";
import { ExportModal } from "./ExportModal";
import { useKeyboardShortcuts } from "@/lib/studio/useKeyboardShortcuts";
import { Sliders, Sparkles, History } from "lucide-react";

export function ResumeStudio() {
  const store = useResumeStore();
  const [activePanel, setActivePanel] = useState<"templates" | "theme" | "sections" | "ai">("templates");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [isAIDesignerOpen, setIsAIDesignerOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);

  // Enable Figma-Style Keyboard Shortcuts
  useKeyboardShortcuts(() => setIsAIDesignerOpen(true));

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
        onImportData={store.setData}
      />

      {/* Secondary Figma Mode Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between z-10 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAIDesignerOpen(true)}
            className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-white rounded-lg shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Designer</span>
          </button>

          <button
            onClick={() => setIsVersionModalOpen(true)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg border border-slate-700/60 flex items-center gap-1.5 transition-all"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>Visual Versions</span>
          </button>
        </div>

        <button
          onClick={() => setShowInspector(!showInspector)}
          className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            showInspector
              ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
              : "bg-slate-800 text-slate-400 border-slate-700/60 hover:text-white"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>{showInspector ? "Hide Inspector" : "Figma Inspector"}</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: AI Copilot (20%) */}
        <AICopilotPanel
          onApplyAll={store.applyAllAIImprovements}
          onSendPrompt={store.applyAIPrompt}
        />

        {/* Central Panel: Visual Document Canvas (60%) */}
        <VisualCanvas
          data={store.data}
          theme={store.theme}
          activeTemplate={store.activeTemplate}
          onUpdateContact={store.updateContact}
          onUpdateSummary={store.updateSummary}
          onUpdateExperience={store.updateExperience}
        />

        {/* Right Panel: Resource Library or Figma Property Inspector */}
        {showInspector ? (
          <PropertyInspector />
        ) : (
          <ResourceLibrary
            activeTemplate={store.activeTemplate}
            theme={store.theme}
            onSelectTemplate={store.changeTemplate}
            onUpdateTheme={store.updateTheme}
            onAddComponent={store.addComponentBlock}
          />
        )}
      </div>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={store.data}
      />
      <AIDesignerModal
        isOpen={isAIDesignerOpen}
        onClose={() => setIsAIDesignerOpen(false)}
      />
      <VisualVersionModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
      />
    </div>
  );
}
