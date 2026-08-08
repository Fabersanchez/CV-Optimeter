"""
CV OPTIMETER VISUAL FIDELITY ENGINE - SPACE UTILIZATION ENGINE
Calculates layout density, occupied printable area vs whitespace, and detects excessive empty pages.
"""

from typing import List, Dict, Any
from pydantic import BaseModel, Field
from .document_geometry import DocumentGeometry


class SpaceUtilizationMetrics(BaseModel):
    total_printable_area_pt2: float = 405105.2  # A4 printable area (pt^2)
    occupied_text_area_pt2: float = 0.0
    whitespace_area_pt2: float = 0.0
    utilization_percentage: float = 0.0
    density_status: str = "BALANCED"  # SPARSE | BALANCED | DENSE | OVERFLOW
    page_utilizations: List[float] = Field(default_factory=list)


class SpaceUtilizationEngine:
    PAGE_WIDTH = 595.27
    PAGE_HEIGHT = 841.89
    MARGIN = 36.0
    PRINTABLE_AREA = (PAGE_WIDTH - 2 * MARGIN) * (PAGE_HEIGHT - 2 * MARGIN)  # ~405105.2 pt^2

    @staticmethod
    def calculate_space_utilization(geometry: DocumentGeometry) -> SpaceUtilizationMetrics:
        if not geometry.pages:
            return SpaceUtilizationMetrics()

        page_utils: List[float] = []
        total_occupied = 0.0

        for page in geometry.pages:
            page_occ = sum((e.width * e.height) for e in page.elements if e.width > 0 and e.height > 0)
            # Apply padding factor for text line height
            page_occ_padded = page_occ * 1.6
            p_util = min(1.0, page_occ_padded / SpaceUtilizationEngine.PRINTABLE_AREA)
            page_utils.append(round(p_util * 100, 1))
            total_occupied += page_occ_padded

        avg_util = sum(page_utils) / len(page_utils) if page_utils else 50.0

        status = "BALANCED"
        if avg_util < 25.0:
            status = "SPARSE"
        elif avg_util > 85.0:
            status = "OVERFLOW"
        elif avg_util > 65.0:
            status = "DENSE"

        return SpaceUtilizationMetrics(
            total_printable_area_pt2=round(SpaceUtilizationEngine.PRINTABLE_AREA, 1),
            occupied_text_area_pt2=round(total_occupied, 1),
            whitespace_area_pt2=round(max(0.0, SpaceUtilizationEngine.PRINTABLE_AREA - total_occupied), 1),
            utilization_percentage=round(avg_util, 1),
            density_status=status,
            page_utilizations=page_utils
        )
