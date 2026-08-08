"use client";

import React from "react";
import { pdfToCanvas, A4_DIMENSIONS } from "./coordinateSystem";

export interface RenderElementNode {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  font_family?: string;
  font_size?: number;
  font_weight?: string;
  color?: string;
  background_color?: string;
  source_map?: string;
}

export interface RenderRegionNode {
  region_id: string;
  region_type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  background_color?: string;
  elements: RenderElementNode[];
}

export interface RenderPageNode {
  page_number: number;
  width: number;
  height: number;
  page_format?: string;
  layout_type?: string;
  regions: RenderRegionNode[];
}

export interface DocumentRenderModel {
  session_id: string;
  total_pages: number;
  page_format?: string;
  pages: RenderPageNode[];
}

interface DocumentRendererProps {
  renderModel?: DocumentRenderModel | null;
  scale?: number;
  onSelectElement?: (elementId: string) => void;
}

export function DocumentRenderer({
  renderModel,
  scale = 1.0,
  onSelectElement
}: DocumentRendererProps) {
  if (!renderModel || !renderModel.pages || renderModel.pages.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-8 py-6">
      {renderModel.pages.map((page) => (
        <div
          key={page.page_number}
          className="relative bg-white shadow-2xl overflow-hidden border border-slate-300 transition-transform duration-150 origin-top"
          style={{
            width: `${page.width * scale}px`,
            height: `${page.height * scale}px`
          }}
        >
          {page.regions.map((region) => (
            <div
              key={region.region_id}
              className="absolute overflow-hidden"
              style={{
                left: `${region.x * scale}px`,
                top: `${region.y * scale}px`,
                width: `${region.width * scale}px`,
                height: `${region.height * scale}px`,
                backgroundColor: region.background_color || "transparent"
              }}
            >
              {region.elements.map((elem) => {
                const isBg = elem.type === "BACKGROUND" || elem.type === "RECTANGLE";
                if (isBg) {
                  return (
                    <div
                      key={elem.id}
                      className="absolute rounded"
                      style={{
                        left: `${elem.x * scale}px`,
                        top: `${elem.y * scale}px`,
                        width: `${elem.width * scale}px`,
                        height: `${elem.height * scale}px`,
                        backgroundColor: elem.background_color || "#f1f5f9"
                      }}
                    />
                  );
                }

                return (
                  <div
                    key={elem.id}
                    onClick={() => onSelectElement && onSelectElement(elem.id)}
                    className="absolute cursor-pointer hover:ring-2 hover:ring-sky-500 rounded transition-all whitespace-pre-wrap leading-tight"
                    style={{
                      left: `${elem.x * scale}px`,
                      top: `${elem.y * scale}px`,
                      width: `${elem.width * scale}px`,
                      height: `${elem.height * scale}px`,
                      fontSize: `${(elem.font_size || 10) * scale}px`,
                      fontFamily: elem.font_family || "Inter, sans-serif",
                      fontWeight: elem.font_weight || "normal",
                      color: elem.color || "#0f172a"
                    }}
                  >
                    {elem.text}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
