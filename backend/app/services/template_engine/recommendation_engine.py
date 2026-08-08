"""
CV OPTIMETER TEMPLATE REGISTRY - AI TEMPLATE RECOMMENDATION ENGINE
Analyzes CandidateCVSchema, seniority, industry, content density, and optional Job Description to rank templates with natural language explanations.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field
from .template_definition import TemplateDefinition
from .template_registry import template_registry


class TemplateRecommendationItem(BaseModel):
    template_id: str
    template_name: str
    compatibility_score: int  # 0 - 100
    reasons: List[str]
    badge: str
    ats_rating: int


class TemplateRecommendationResult(BaseModel):
    candidate_name: str
    top_recommendations: List[TemplateRecommendationItem]
    analysis_summary: str


class TemplateRecommendationEngine:
    @staticmethod
    def recommend_templates(
        candidate_cv: Dict[str, Any],
        job_description: Optional[str] = None
    ) -> TemplateRecommendationResult:
        contact = candidate_cv.get("contact", {})
        candidate_name = contact.get("name", "Candidate")
        title = contact.get("title", "").lower()
        summary = candidate_cv.get("summary", "").lower()
        experiences = candidate_cv.get("experience", [])
        skills = [s for sg in candidate_cv.get("skillGroups", []) for s in sg.get("skills", [])]

        word_count = len(summary.split()) + sum(len(e.get("description", "").split()) for e in experiences)

        # Seniority detection
        is_executive = any(kw in title for kw in ["vp", "vice president", "director", "head of", "chief", "cto", "ceo", "cfo", "executive"]) or len(experiences) >= 4
        is_tech = any(kw in title or kw in summary for kw in ["developer", "engineer", "architect", "data", "python", "full stack", "devops", "cloud"])
        is_finance = any(kw in title or kw in summary for kw in ["financial", "banking", "cpa", "analyst", "invest", "quant"])
        is_academic = any(kw in title or kw in summary for kw in ["phd", "researcher", "professor", "postdoc", "publication"])
        is_creative = any(kw in title or kw in summary for kw in ["designer", "ux", "ui", "creative", "artist", "animator"])

        all_templates = template_registry.list_all()
        scored_items: List[TemplateRecommendationItem] = []

        for template in all_templates:
            score = 80
            reasons = []

            # Rule 1: High ATS Safety
            if template.ats.safe:
                score += 5
                reasons.append("Estructura 100% segura para filtros ATS institucionales.")

            # Rule 2: Executive Seniority Match
            if is_executive and template.metadata.categories and "Executive" in template.metadata.categories:
                score += 12
                reasons.append("Cabecera ejecutiva con jerarquía visual ideal para roles directivos/C-suite.")

            # Rule 3: Tech Role Match
            if is_tech and ("Technology" in template.metadata.categories or "Engineering" in template.metadata.categories):
                score += 12
                reasons.append("Soporta etiquetas de tecnologías, repositorios y stack técnico con fuente monospace.")

            # Rule 4: Creative Role Match
            if is_creative and "Creative" in template.metadata.categories:
                score += 10
                reasons.append("Diseño split de 2 columnas optimizado para portafolios visuales y diseño UX.")

            # Rule 5: Finance Match
            if is_finance and "Finance" in template.metadata.categories:
                score += 10
                reasons.append("Formato sobrio de alta densidad para métricas financieras y análisis cuantitativo.")

            # Rule 6: Academic Match
            if is_academic and "Academic" in template.metadata.categories:
                score += 12
                reasons.append("Tipografía serif académica estructurada para publicaciones e investigación.")

            # Rule 7: High Content Density
            if word_count > 450 and template.layout.columns == 1:
                score += 3
                reasons.append("Aprovechamiento A4 balanceado para CVs de alta densidad de contenido.")

            # Job Description keyword booster
            if job_description:
                jd_lower = job_description.lower()
                if "ats" in jd_lower and template.ats.parse_rate_rating >= 98:
                    score += 5
                    reasons.append("Alineado a vacante con requisitos estrictos de parseo ATS.")

            final_score = min(99, max(65, score))
            scored_items.append(
                TemplateRecommendationItem(
                    template_id=template.id,
                    template_name=template.name,
                    compatibility_score=final_score,
                    reasons=reasons[:3],
                    badge=template.metadata.badge,
                    ats_rating=template.ats.parse_rate_rating
                )
            )

        scored_items.sort(key=lambda x: x.compatibility_score, reverse=True)
        top_3 = scored_items[:3]

        summary_msg = f"Analizado perfil de '{candidate_name}' ({len(experiences)} experiencias, {len(skills)} skills). Se identificaron las 3 mejores plantillas compatibles."

        return TemplateRecommendationResult(
            candidate_name=candidate_name,
            top_recommendations=top_3,
            analysis_summary=summary_msg
        )
