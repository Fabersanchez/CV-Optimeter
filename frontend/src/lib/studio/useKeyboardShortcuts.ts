"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";

export function useKeyboardShortcuts(onOpenSearch?: () => void) {
  const { undo, redo } = useResumeStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Ctrl + Z / Cmd + Z (Undo)
      if (isCtrlOrCmd && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      }

      // Ctrl + Shift + Z / Cmd + Shift + Z / Ctrl + Y (Redo)
      if ((isCtrlOrCmd && e.shiftKey && e.key.toLowerCase() === "z") || (isCtrlOrCmd && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        redo();
      }

      // Ctrl + K / Cmd + K (Quick Search / AI Command Bar)
      if (isCtrlOrCmd && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (onOpenSearch) onOpenSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, onOpenSearch]);
}
