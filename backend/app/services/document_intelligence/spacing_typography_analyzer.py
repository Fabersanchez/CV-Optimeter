"""
CV OPTIMETER VISUAL FIDELITY ENGINE - SPACING & TYPOGRAPHY ANALYZER
Measures page margins, section gaps, line heights, and maps original fonts to Design System font fallbacks.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from .document_geometry import DocumentGeometry, DocumentElement


class SpacingAnalysisResult(BaseModel):
    page_margin_top: float = 36.0
    page_margin_bottom: float = 36.0
    page_margin_left: float = 36.0
    page_margin_right: float = 36.0
    section_gap: float = 18.0
    paragraph_gap: float = 10.0
    line_height_scale: float = 1.45
    spacing_density: str = "normal"  # compact | normal | spacious


class TypographyAnalysisResult(BaseModel):
    detected_heading_font: str = "Inter"
    detected_body_font: str = "Inter"
    fallback_font_pairing: str = "inter"  # inter | roboto | fira-code | merriweather | outfit
    heading_font_size: float = 16.0
    body_font_size: float = 10.0
    is_monospace: bool = False
    is_serif: bool = False


class SpacingTypographyAnalyzer:
    @staticmethod
    def analyze_spacing_and_typography(geometry: DocumentGeometry) -> Dict[str, Any]:
        if not geometry.pages:
            return {
                "spacing": SpacingAnalysisResult().model_dump(),
                "typography": TypographyAnalysisResult().model_dump()
            }

        elements = geometry.pages[0].elements
        if not elements:
            return {
                "spacing": SpacingAnalysisResult().model_dump(),
                "typography": TypographyAnalysisResult().model_dump()
            }

        # Margins calculation
        min_x = min(e.x for e in elements)
        min_y = min(e.y for e in elements)
        max_x1 = max(e.x + e.width for e in elements)
        max_y1 = max(e.y + e.height for e in elements)
        p_w = geometry.pages[0].width
        p_h = geometry.pages[0].height

        m_left = max(24.0, min_x)
        m_right = max(24.0, p_w - max_x1)
        m_top = max(24.0, min_y)
        m_bottom = max(24.0, p_h - max_y1)

        # Fonts detection
        fonts = [e.font_family for e in elements if e.font_family]
        fonts_lower = [f.lower() for f in fonts]

        is_mono = any("code" in f or "mono" in f or "courier" in f or "fira" in f for f in fonts_lower)
        is_serif = any("serif" in f or "georgia" in f or "times" in f or "merriweather" in f for f in fonts_lower)

        font_pairing = "inter"
        if is_mono:
            font_pairing = "fira-code"
        elif is_serif:
            font_pairing = "merriweather"
        elif any("roboto" in f for f in fonts_lower):
            font_pairing = "roboto"
        elif any("outfit" in f for f in fonts_lower):
            font_pairing = "outfit"

        heading_sizes = [e.font_size for e in elements if e.font_weight == "bold" or e.font_size >= 14.0]
        body_sizes = [e.font_size for e in elements if e.font_size <= 12.0]

        avg_h_size = sum(heading_sizes)/len(heading_sizes) if heading_sizes else 16.0
        avg_b_size = sum(body_sizes)/len(body_sizes) if body_sizes else 10.0

        spacing_res = SpacingAnalysisResult(
            page_margin_top=round(m_top, 1),
            page_margin_bottom=round(m_bottom, 1),
            page_margin_left=round(m_left, 1),
            page_margin_right=round(m_right, 1),
            spacing_density="compact" if avg_b_size < 9.5 else "normal"
        )

        typography_res = TypographyAnalysisResult(
            detected_heading_font=fonts[0] if fonts else "Inter",
            detected_body_font=fonts[1] if len(fonts) > 1 else "Inter",
            fallback_font_pairing=font_pairing,
            heading_font_size=round(avg_h_size, 1),
            body_font_size=round(avg_b_size, 1),
            is_monospace=is_mono,
            is_serif=is_serif
        )

        return {
            "spacing": spacing_res.model_dump(),
            "typography": typography_res.model_dump()
        }
