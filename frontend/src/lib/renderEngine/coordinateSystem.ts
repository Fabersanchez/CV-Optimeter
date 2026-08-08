/**
 * CV OPTIMETER VISUAL RECONSTRUCTION ENGINE - COORDINATE SYSTEM CONVERTER
 * Centralizes PDF coordinate system (origin bottom-left) to Canvas CSS coordinate system (origin top-left) transformations.
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PageDimensions {
  width: number;
  height: number;
}

export const A4_DIMENSIONS: PageDimensions = { width: 595.27, height: 841.89 };
export const LETTER_DIMENSIONS: PageDimensions = { width: 612.0, height: 792.0 };

export function pdfToCanvas(
  box: BoundingBox,
  pageDimensions: PageDimensions = A4_DIMENSIONS,
  scale: number = 1.0
): BoundingBox {
  return {
    x: round(box.x * scale),
    y: round(box.y * scale),
    width: round(box.width * scale),
    height: round(box.height * scale)
  };
}

export function canvasToPdf(
  box: BoundingBox,
  pageDimensions: PageDimensions = A4_DIMENSIONS,
  scale: number = 1.0
): BoundingBox {
  return {
    x: round(box.x / scale),
    y: round(box.y / scale),
    width: round(box.width / scale),
    height: round(box.height / scale)
  };
}

function round(val: number): number {
  return Math.round(val * 100) / 100;
}
