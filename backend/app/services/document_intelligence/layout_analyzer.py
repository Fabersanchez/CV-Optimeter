"""
CV OPTIMETER VISUAL FIDELITY ENGINE - LAYOUT ANALYZER
Classifies document column structure (1-column vs 2-column split/sidebar), headers, footers, and section blocks based on element geometry.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from .document_geometry import DocumentGeometry, DocumentElement


class LayoutSectionBlock(BaseModel):
    id: str
    section_name: str
    column_index: int = 0  # 0 = main column, 1 = sidebar column
    element_ids: List[str] = Field(default_factory=list)
    start_y: float = 0.0
    end_y: float = 0.0


class LayoutAnalysisResult(BaseModel):
    layout_type: str = "1-column"  # 1-column | 2-column-split | 2-column-sidebar
    column_count: int = 1
    column_ratios: List[float] = Field(default_factory=lambda: [1.0])
    has_header_banner: bool = False
    has_photo: bool = False
    header_height: float = 120.0
    sections: List[LayoutSectionBlock] = Field(default_factory=list)
    sidebar_left: bool = True


class LayoutAnalyzer:
    @staticmethod
    def analyze_layout(geometry: DocumentGeometry) -> LayoutAnalysisResult:
        if not geometry.pages:
            return LayoutAnalysisResult()

        page1 = geometry.pages[0]
        elements = page1.elements
        p_width = page1.width

        if not elements:
            return LayoutAnalysisResult()

        # Check element x-coordinates distribution to determine columns
        left_column_elements = [e for e in elements if e.x < p_width * 0.4]
        right_column_elements = [e for e in elements if e.x >= p_width * 0.4]

        total_elems = len(elements)
        left_ratio = len(left_column_elements) / total_elems if total_elems > 0 else 0.0
        right_ratio = len(right_column_elements) / total_elems if total_elems > 0 else 0.0

        layout_type = "1-column"
        column_count = 1
        column_ratios = [1.0]
        sidebar_left = True

        # If significant overlap of elements in both left (<40%) and right (>=40%) regions
        if left_ratio >= 0.25 and right_ratio >= 0.35:
            column_count = 2
            if left_ratio < right_ratio:
                layout_type = "2-column-sidebar"
                column_ratios = [0.35, 0.65]
                sidebar_left = True
            else:
                layout_type = "2-column-split"
                column_ratios = [0.5, 0.5]
                sidebar_left = False

        # Header height calculation
        header_elems = [e for e in elements if e.y < 150.0]
        max_header_y = max((e.y + e.height) for e in header_elems) if header_elems else 120.0
        has_banner = any(e.alignment == "center" for e in header_elems)

        return LayoutAnalysisResult(
            layout_type=layout_type,
            column_count=column_count,
            column_ratios=column_ratios,
            has_header_banner=has_banner,
            header_height=round(max_header_y, 1),
            sidebar_left=sidebar_left
        )
