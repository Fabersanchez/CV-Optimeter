"use client";

import React, { useState, useEffect, useRef } from "react";

interface InlineTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  tag?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  style?: React.CSSProperties;
}

function cleanDisplayValue(val: string): string {
  if (!val) return "";
  const s = val.trim();
  if (s.toLowerCase() === "null" || s.toLowerCase() === "undefined") return "";
  // If string contains raw PDF font stream markers (e.g. 0 16 0 R [ 0 [ 750...)
  if (/\d+\s+\d+\s+R/i.test(s) || /\[\s*\d+\s+0\s+0/i.test(s) || /^\d+\s*null$/i.test(s)) {
    return "";
  }
  return s;
}

export function InlineText({
  value,
  onSave,
  className = "",
  placeholder = "Click to edit...",
  multiline = false,
  tag = "span",
  style
}: InlineTextProps) {
  const displayVal = cleanDisplayValue(value);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(displayVal);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setText(cleanDisplayValue(value));
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ("select" in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== displayVal) {
      onSave(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setText(displayVal);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full bg-blue-50/90 text-slate-900 border border-blue-400 rounded px-2 py-1 outline-none font-sans text-xs focus:ring-2 focus:ring-blue-400 transition ${className}`}
          rows={3}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full bg-blue-50/90 text-slate-900 border border-blue-400 rounded px-1.5 py-0.5 outline-none font-sans focus:ring-2 focus:ring-blue-400 transition ${className}`}
      />
    );
  }

  const Component = tag as any;

  return (
    <Component
      onClick={() => setIsEditing(true)}
      title="Click or double-click to edit text inline"
      style={style}
      className={`cursor-pointer hover:bg-sky-500/10 hover:outline hover:outline-1 hover:outline-sky-400 rounded px-1 transition duration-150 relative group inline-block ${className}`}
    >
      {text || <span className="italic opacity-50">{placeholder}</span>}
    </Component>
  );
}
