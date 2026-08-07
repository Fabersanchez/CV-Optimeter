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

export function InlineText({
  value,
  onSave,
  className = "",
  placeholder = "Click to edit...",
  multiline = false,
  tag = "span",
  style
}: InlineTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if ('select' in inputRef.current) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value) {
      onSave(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    } else if (e.key === "Escape") {
      setText(value);
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
