"use client";

import React, { useState } from "react";
import { Sparkles, Send, Bot, User, CheckCircle2, Wand2, ArrowUpRight } from "lucide-react";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

interface AICopilotTabProps {
  onApplyAll: () => void;
  onSendPrompt: (promptText: string) => void;
}

export function AICopilotTab({ onApplyAll, onSendPrompt }: AICopilotTabProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "¡Hola! Soy tu AI Career & Design Coach. Puedo optimizar tu CV para pasar el filtro ATS de cualquier empresa (Google, Amazon, Harvard, Siemens) o reescribir tus logros con métricas cuantitativas.",
      timestamp: "Ahora"
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  const presets = [
    "Optimiza mi CV",
    "Hazlo ATS",
    "Hazlo Ejecutivo",
    "Hazlo Harvard",
    "Hazlo Google",
    "Hazlo Amazon",
    "Hazlo Microsoft",
    "Hazlo Creativo",
    "Hazlo para esta oferta"
  ];

  const handleSend = (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isProcessing) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsProcessing(true);

    // Call store mutation handler
    onSendPrompt(text);

    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `¡Listo! He aplicado la transformación "${text}" a tu currículum. La tipografía, disposición y jerarquía visual se han actualizado en el lienzo A4 en tiempo real.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsProcessing(false);
    }, 600);
  };

  const handleApplyAll = () => {
    onApplyAll();
    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: "¡Todas las mejoras han sido aplicadas! Se estructuraron los logros con el marco STAR y se optimizó la densidad de palabras clave. Tu Score ATS ha subido a 98/100.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="flex flex-col h-full space-y-4 text-xs">
      {/* Header Gauges */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase">ATS Score</span>
          <p className="text-xl font-extrabold text-emerald-400 font-mono">98<span className="text-xs text-slate-500 font-normal">/100</span></p>
          <span className="text-[9px] text-emerald-400 font-semibold">+18% vs baseline</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase">Visual Grade</span>
          <p className="text-xl font-extrabold text-sky-400 font-mono">96<span className="text-xs text-slate-500 font-normal">/100</span></p>
          <span className="text-[9px] text-sky-400 font-semibold">Executive Grade</span>
        </div>
      </div>

      {/* Apply All Action */}
      <button
        onClick={handleApplyAll}
        className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition shrink-0"
      >
        <Wand2 className="w-4 h-4 text-white" />
        <span>Aplicar todas las mejoras</span>
      </button>

      {/* Quick Preset Action Chips */}
      <div className="space-y-1.5 shrink-0">
        <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Comandos Rápidos</p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(preset)}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] font-medium flex items-center gap-1 transition"
            >
              <span>{preset}</span>
              <ArrowUpRight className="w-3 h-3 text-blue-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[160px] bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
              }`}
            >
              {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
              }`}
            >
              <p className="text-[11px]">{m.text}</p>
              <span className="text-[8px] opacity-60 block mt-1 text-right">{m.timestamp}</span>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-slate-400 text-[11px] italic">
            <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span>AI Copilot está transformando tu documento...</span>
          </div>
        )}
      </div>

      {/* Bottom Chat Input */}
      <div className="relative shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder="Escribe un comando (e.g. Hazlo tipo Google)..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-3 pr-9 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isProcessing}
          className="absolute right-2 top-2 text-blue-400 hover:text-blue-300 disabled:opacity-30 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
