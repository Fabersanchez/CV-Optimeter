"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { useDocumentSessionStore } from "@/lib/store/useDocumentSessionStore";
import { StudioToolbar } from "./StudioToolbar";
import { VisualCanvas } from "./VisualCanvas";
import { RightStudioPanel } from "./RightStudioPanel";
import { AIDesignerModal } from "./AIDesignerModal";
import { VisualVersionModal } from "./VisualVersionModal";
import { UploadManagerModal } from "./UploadManagerModal";
import { VisualTemplateSelectorModal } from "./VisualTemplateSelectorModal";
import { ExportModal } from "./ExportModal";
import { useKeyboardShortcuts } from "@/lib/studio/useKeyboardShortcuts";
import { Sparkles, History, LayoutGrid, Maximize2, Minimize2 } from "lucide-react";

export function ResumeStudio() {
  const store = useResumeStore();
  const sessionStore = useDocumentSessionStore();

  const [activePanel, setActivePanel] = useState<"templates" | "theme" | "sections" | "ai">("templates");
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [isAIDesignerOpen, setIsAIDesignerOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false);

  // Enable Figma-Style Keyboard Shortcuts (Ctrl+K opens AI Designer)
  useKeyboardShortcuts(() => setIsAIDesignerOpen(true));

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Top Global Toolbar */}
      <StudioToolbar
        canUndo={store.canUndo}
        canRedo={store.canRedo}
        onUndo={store.undo}
        onRedo={store.redo}
        activePanel={activePanel}
        setActivePanel={(panel) => {
          setActivePanel(panel);
          if (panel === "templates") {
            setIsTemplateSelectorOpen(true);
          }
        }}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenUploadModal={() => setIsUploadOpen(true)}
      />

      {/* Secondary Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between z-10 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTemplateSelectorOpen(true)}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700/60 flex items-center gap-1.5 transition-all"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-400" />
            <span>Seleccionar Plantilla</span>
          </button>

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

        {/* Smart Resize Canvas Toggle */}
        <button
          onClick={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
          className={`px-3 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isRightPanelCollapsed
              ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
              : "bg-slate-800 text-slate-400 border-slate-700/60 hover:text-white"
          }`}
          title={isRightPanelCollapsed ? "Restore Panel" : "Smart Expand Canvas (Full Screen)"}
        >
          {isRightPanelCollapsed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          <span>{isRightPanelCollapsed ? "Mostrar Panel" : "Expandir Canvas"}</span>
        </button>
      </div>

      {/* Main Workspace: Central Canvas + Dynamic Right Panel */}
      <div className="flex flex-1 overflow-hidden relative">
        <main className={`flex-1 transition-all duration-300 h-full overflow-hidden ${isRightPanelCollapsed ? "w-full" : "w-[75%]"}`}>
          <VisualCanvas
            data={sessionStore.currentSession?.candidate_cv || store.data}
            theme={store.theme}
            activeTemplate={sessionStore.activeTemplate || store.activeTemplate}
            session={sessionStore.currentSession}
            viewMode={sessionStore.viewMode}
            overlayOpacity={sessionStore.overlayOpacity}
            onToggleViewMode={sessionStore.setViewMode}
            onSetOverlayOpacity={sessionStore.setOverlayOpacity}
            onUpdateContact={(field, val) => {
              store.updateContact(field, val);
              if (sessionStore.currentSession) {
                const updatedCv = {
                  ...sessionStore.currentSession.candidate_cv,
                  contact: { ...sessionStore.currentSession.candidate_cv.contact, [field]: val }
                };
                sessionStore.updateCandidateCv(updatedCv);
              }
            }}
            onUpdateSummary={(val) => {
              store.updateSummary(val);
              if (sessionStore.currentSession) {
                sessionStore.updateCandidateCv({ ...sessionStore.currentSession.candidate_cv, summary: val });
              }
            }}
            onUpdateExperience={(id, field, val) => {
              store.updateExperience(id, field, val);
              if (sessionStore.currentSession) {
                const updatedExp = sessionStore.currentSession.candidate_cv.experience.map((e) =>
                  e.id === id ? { ...e, [field]: val } : e
                );
                sessionStore.updateCandidateCv({ ...sessionStore.currentSession.candidate_cv, experience: updatedExp });
              }
            }}
          />
        </main>

        <RightStudioPanel
          activeTemplate={sessionStore.activeTemplate || store.activeTemplate}
          theme={store.theme}
          onSelectTemplate={(id) => {
            store.changeTemplate(id);
            sessionStore.changeTemplate(id);
          }}
          onUpdateTheme={store.updateTheme}
          onAddComponent={store.addComponentBlock}
          onApplyAllAI={store.applyAllAIImprovements}
          onSendAIPrompt={store.applyAIPrompt}
          isCollapsed={isRightPanelCollapsed}
          onToggleCollapse={() => setIsRightPanelCollapsed(!isRightPanelCollapsed)}
        />
      </div>

      {/* === MODALS === */}
      <VisualTemplateSelectorModal
        isOpen={isTemplateSelectorOpen}
        onClose={() => setIsTemplateSelectorOpen(false)}
        activeTemplate={sessionStore.activeTemplate || store.activeTemplate}
        theme={store.theme}
        onSelectTemplate={(id) => {
          store.changeTemplate(id);
          sessionStore.changeTemplate(id);
        }}
        onUpdateTheme={store.updateTheme}
      />

      <UploadManagerModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentImported={(importedData) => {
          store.importDocument(importedData);
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={sessionStore.currentSession?.candidate_cv || store.data}
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
