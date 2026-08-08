"""
CV OPTIMETER TEMPLATE REGISTRY - TEMPLATE COMPARISON ENGINE
Compares 2 to 3 TemplateDefinitions side-by-side on ATS, visual impact, readability, density, and page balance.
"""

from typing import List, Dict, Any
from pydantic import BaseModel
from .template_registry import template_registry
from .template_definition import TemplateDefinition


class TemplateComparisonDetail(BaseModel):
    template_id: str
    name: str
    category: str
    ats_score: int
    visual_score: int
    readability_score: int
    density_score: int
    columns: int
    badge: str
    status: str  # WINNER | RECOMMENDED | GOOD ALTERNATIVE


class TemplateComparisonResult(BaseModel):
    compared_count: int
    winner_template_id: str
    comparison_details: List[TemplateComparisonDetail]
    summary: str


class TemplateComparisonEngine:
    @staticmethod
    def compare_templates(template_ids: List[str]) -> TemplateComparisonResult:
        templates: List[TemplateDefinition] = []
        for tid in template_ids:
            t = template_registry.get(tid)
            if t:
                templates.append(t)

        if not templates:
            # Fallback default comparison
            t1 = template_registry.get("ats-professional")
            t2 = template_registry.get("executive")
            if t1: templates.append(t1)
            if t2: templates.append(t2)

        # Sort templates by overall quality score
        templates.sort(key=lambda t: t.quality.overall, reverse=True)
        winner_id = templates[0].id if templates else "ats-professional"

        details: List[TemplateComparisonDetail] = []
        for idx, t in enumerate(templates):
            status = "WINNER" if idx == 0 else "RECOMMENDED" if idx == 1 else "GOOD ALTERNATIVE"
            details.append(
                TemplateComparisonDetail(
                    template_id=t.id,
                    name=t.name,
                    category=t.metadata.categories[0] if t.metadata.categories else "Professional",
                    ats_score=t.quality.ats,
                    visual_score=t.quality.visual,
                    readability_score=t.quality.readability,
                    density_score=t.quality.density,
                    columns=t.layout.columns,
                    badge=t.metadata.badge,
                    status=status
                )
            )

        summary_msg = f"Comparadas {len(templates)} plantillas. Ganadora: '{templates[0].name}' con un Quality Score general de {templates[0].quality.overall}/100."

        return TemplateComparisonResult(
            compared_count=len(templates),
            winner_template_id=winner_id,
            comparison_details=details,
            summary=summary_msg
        )
