"""
CV OPTIMETER VISUAL RECONSTRUCTION ENGINE - REGION & SIDEBAR DETECTOR
Detects visual regions: SidebarRegion (left or right, background colors, width, height), MainRegion, and HeaderRegion based on geometric element clustering.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from .document_geometry import DocumentElement, PageGeometryModel


class VisualRegionModel(BaseModel):
    region_id: str
    region_type: str  # SIDEBAR_LEFT | SIDEBAR_RIGHT | MAIN_BODY | HEADER_BANNER | FOOTER_BAR
    x: float = 0.0
    y: float = 0.0
    width: float = 595.27
    height: float = 841.89
    background_color: Optional[str] = None
    background_pattern: Optional[str] = None
    elements: List[DocumentElement] = Field(default_factory=list)


class PageVisualLayoutModel(BaseModel):
    page_number: int
    layout_type: str = "ONE_COLUMN"  # ONE_COLUMN | TWO_COLUMN | TWO_COLUMN_SIDEBAR | HEADER_PLUS_BODY
    has_sidebar: bool = False
    sidebar_position: str = "LEFT"  # LEFT | RIGHT | NONE
    regions: List[VisualRegionModel] = Field(default_factory=list)


class RegionDetector:
    @staticmethod
    def detect_page_regions(page_geo: PageGeometryModel) -> PageVisualLayoutModel:
        elements = page_geo.elements
        p_width = page_geo.width
        p_height = page_geo.height

        if not elements:
            return PageVisualLayoutModel(page_number=page_geo.page_number)

        # Detect background elements or sidebar background fill
        bg_elements = [e for e in elements if e.type in ["BACKGROUND", "RECTANGLE"] and e.background_color]
        sidebar_bg_color = None
        sidebar_x = 0.0
        sidebar_w = p_width * 0.35

        for bg in bg_elements:
            if bg.height > p_height * 0.5 and bg.width < p_width * 0.45:
                sidebar_bg_color = bg.background_color
                sidebar_x = bg.x
                sidebar_w = bg.width
                break

        # Horizontal distribution analysis of text elements
        left_elems = [e for e in elements if e.x < p_width * 0.38 and e.type != "BACKGROUND"]
        main_elems = [e for e in elements if e.x >= p_width * 0.38 and e.type != "BACKGROUND"]

        total_content_elems = len(left_elems) + len(main_elems)
        left_ratio = len(left_elems) / total_content_elems if total_content_elems > 0 else 0.0

        has_sidebar = sidebar_bg_color is not None or left_ratio >= 0.20
        layout_type = "ONE_COLUMN"
        sidebar_pos = "NONE"

        regions: List[VisualRegionModel] = []

        if has_sidebar:
            layout_type = "TWO_COLUMN_SIDEBAR"
            sidebar_pos = "LEFT" if sidebar_x < p_width * 0.3 else "RIGHT"

            # 1. Sidebar Region
            regions.append(
                VisualRegionModel(
                    region_id="reg-sidebar",
                    region_type="SIDEBAR_LEFT" if sidebar_pos == "LEFT" else "SIDEBAR_RIGHT",
                    x=round(sidebar_x, 2),
                    y=0.0,
                    width=round(sidebar_w, 2),
                    height=p_height,
                    background_color=sidebar_bg_color or "#0f172a",
                    elements=left_elems
                )
            )

            # 2. Main Body Region
            main_x = sidebar_w if sidebar_pos == "LEFT" else 0.0
            main_w = p_width - sidebar_w
            regions.append(
                VisualRegionModel(
                    region_id="reg-main",
                    region_type="MAIN_BODY",
                    x=round(main_x, 2),
                    y=0.0,
                    width=round(main_w, 2),
                    height=p_height,
                    elements=main_elems
                )
            )
        else:
            # 1-Column Layout Region
            regions.append(
                VisualRegionModel(
                    region_id="reg-main-1col",
                    region_type="MAIN_BODY",
                    x=0.0,
                    y=0.0,
                    width=p_width,
                    height=p_height,
                    elements=elements
                )
            )

        return PageVisualLayoutModel(
            page_number=page_geo.page_number,
            layout_type=layout_type,
            has_sidebar=has_sidebar,
            sidebar_position=sidebar_pos,
            regions=regions
        )
