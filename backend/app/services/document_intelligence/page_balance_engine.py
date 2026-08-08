"""
CV OPTIMETER VISUAL FIDELITY ENGINE - PAGE BALANCE & PAGINATION ENGINE
Enforces keep-together rules for ExperienceBlocks, prevents orphan headers/bullets, and balances page density without cutting candidate content.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class PaginationBlockRule(BaseModel):
    block_id: str
    block_type: str  # ExperienceBlock | EducationBlock | SkillBlock | TextBlock
    keep_together: bool = True
    keep_with_next: bool = True
    min_bullets_per_page: int = 2
    estimated_height_pt: float = 80.0
    target_page: int = 1


class PageBalanceResult(BaseModel):
    total_pages: int = 1
    page_fill_ratios: List[float] = Field(default_factory=lambda: [0.85])
    orphan_warnings: List[str] = Field(default_factory=list)
    has_overflow: bool = False
    keep_together_applied_count: int = 0


class PageBalanceEngine:
    PAGE_HEIGHT_PT = 841.89  # A4 height
    USABLE_HEIGHT_PT = 760.0  # Height after top/bottom margins

    @staticmethod
    def calculate_page_balance(
        candidate_cv: Dict[str, Any],
        layout_type: str = "1-column"
    ) -> PageBalanceResult:
        experiences = candidate_cv.get("experience", [])
        educations = candidate_cv.get("education", [])
        summary = candidate_cv.get("summary", "")
        skills = candidate_cv.get("skillGroups", [])

        # Estimate heights of blocks
        current_y = 120.0  # Header area
        current_page = 1
        page_heights: List[float] = [120.0]
        keep_together_count = 0
        orphan_warnings: List[str] = []

        # 1. Summary Block
        if summary:
            sum_height = max(40.0, len(summary.split()) * 0.4)
            current_y += sum_height
            page_heights[0] += sum_height

        # 2. Experience Blocks with keep-together rule
        for exp in experiences:
            bullets = exp.get("bullets", [])
            exp_height = 45.0 + (len(bullets) * 14.0)  # Company/role line + bullet lines

            # Check if block causes overflow on current page
            if current_y + exp_height > PageBalanceEngine.USABLE_HEIGHT_PT:
                # Keep-together rule: move entire ExperienceBlock to next page instead of splitting role and bullets
                current_page += 1
                page_heights.append(100.0)  # Top margin + Section header
                current_y = 100.0 + exp_height
                page_heights[-1] += exp_height
                keep_together_count += 1
            else:
                current_y += exp_height
                page_heights[-1] += exp_height

        # 3. Education Blocks
        for edu in educations:
            edu_height = 40.0
            if current_y + edu_height > PageBalanceEngine.USABLE_HEIGHT_PT:
                current_page += 1
                page_heights.append(100.0)
                current_y = 100.0 + edu_height
                page_heights[-1] += edu_height
            else:
                current_y += edu_height
                page_heights[-1] += edu_height

        fill_ratios = [round(h / PageBalanceEngine.USABLE_HEIGHT_PT, 2) for h in page_heights]

        # Check for orphan pages (less than 15% filled on last page)
        if len(fill_ratios) > 1 and fill_ratios[-1] < 0.15:
            orphan_warnings.append(f"Página {len(fill_ratios)} contiene solo {int(fill_ratios[-1]*100)}% de contenido. Se ajustará la densidad.")

        return PageBalanceResult(
            total_pages=current_page,
            page_fill_ratios=fill_ratios,
            orphan_warnings=orphan_warnings,
            has_overflow=any(r > 1.0 for r in fill_ratios),
            keep_together_applied_count=keep_together_count
        )
