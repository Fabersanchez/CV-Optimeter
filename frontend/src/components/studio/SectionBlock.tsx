"use client";

import React from "react";
import { GripVertical, Copy, Trash2, Plus } from "lucide-react";

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

export function SectionBlock({ title, children, onAdd, onDuplicate, onDelete }: SectionBlockProps) {
  return (
    <div className="group relative border border-transparent hover:border-brand-500/30 rounded-xl p-2 transition duration-200">
      <div className="absolute -left-7 top-3 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shadow-lg text-slate-400">
        <span title="Drag to reorder section"><GripVertical className="w-3.5 h-3.5 cursor-grab" /></span>
        {onDuplicate && (
          <button onClick={onDuplicate} title="Duplicate Block" className="hover:text-brand-400">
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} title="Delete Block" className="hover:text-rose-400">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition">
          {title}
        </span>
        {onAdd && (
          <button
            onClick={onAdd}
            className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1 text-[10px] font-bold text-brand-400 hover:text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20"
          >
            <Plus className="w-3 h-3" /> Add {title} Item
          </button>
        )}
      </div>

      {children}
    </div>
  );
}
