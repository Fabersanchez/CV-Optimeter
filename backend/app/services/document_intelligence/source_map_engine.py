"""
DOCUMENT INTELLIGENCE ENGINE V2 - SOURCE MAP & CONFIDENCE ENGINE
Calculates field traceability (SourceMap) and extraction confidence scores for CandidateCVSchema.
"""

import re
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class SourceMapItem(BaseModel):
    source_document: str = ""
    page: int = 1
    source_text: str = ""
    coordinates: Optional[Dict[str, float]] = None
    confidence: float = 0.0


class SourceMapEngine:
    @staticmethod
    def generate_source_map(
        candidate_cv: Dict[str, Any],
        raw_text: str,
        filename: str = "document.pdf",
        page_count: int = 1
    ) -> Dict[str, SourceMapItem]:
        source_map: Dict[str, SourceMapItem] = {}
        lines = [l.strip() for l in raw_text.split("\n") if l.strip()]

        def find_snippet_confidence(val: str) -> tuple[int, str, float]:
            if not val or not isinstance(val, str) or len(val.strip()) < 2:
                return (1, "", 0.0)
            val_clean = val.strip().lower()
            for idx, line in enumerate(lines):
                line_clean = line.lower()
                if val_clean in line_clean:
                    # Estimate page
                    estimated_page = max(1, int((idx / max(1, len(lines))) * page_count) + 1)
                    # Higher confidence if exact match
                    confidence = 0.99 if val_clean == line_clean else 0.92
                    return (estimated_page, line[:120], confidence)
                # Substring token match
                tokens = [t for t in val_clean.split() if len(t) > 3]
                if tokens and any(t in line_clean for t in tokens):
                    estimated_page = max(1, int((idx / max(1, len(lines))) * page_count) + 1)
                    return (estimated_page, line[:120], 0.85)

            return (1, val[:60], 0.70)

        # Contact Info Traceability
        contact = candidate_cv.get("contact", {})
        for field_name in ["name", "title", "email", "phone", "location", "linkedin", "github"]:
            val = contact.get(field_name, "")
            if val:
                pg, text_snippet, conf = find_snippet_confidence(val)
                source_map[f"contact.{field_name}"] = SourceMapItem(
                    source_document=filename,
                    page=pg,
                    source_text=text_snippet,
                    confidence=conf
                )

        # Summary Traceability
        summary = candidate_cv.get("summary", "")
        if summary:
            pg, text_snippet, conf = find_snippet_confidence(summary[:40])
            source_map["summary"] = SourceMapItem(
                source_document=filename,
                page=pg,
                source_text=text_snippet,
                confidence=conf
            )

        # Experience Traceability
        for idx, exp in enumerate(candidate_cv.get("experience", [])):
            for f in ["company", "role", "startDate", "endDate"]:
                v = exp.get(f, "")
                if v:
                    pg, text_snippet, conf = find_snippet_confidence(v)
                    source_map[f"experience[{idx}].{f}"] = SourceMapItem(
                        source_document=filename,
                        page=pg,
                        source_text=text_snippet,
                        confidence=conf
                    )

        # Education Traceability
        for idx, edu in enumerate(candidate_cv.get("education", [])):
            for f in ["institution", "degree", "field"]:
                v = edu.get(f, "")
                if v:
                    pg, text_snippet, conf = find_snippet_confidence(v)
                    source_map[f"education[{idx}].{f}"] = SourceMapItem(
                        source_document=filename,
                        page=pg,
                        source_text=text_snippet,
                        confidence=conf
                    )

        return source_map


class ConfidenceEngine:
    @staticmethod
    def calculate_confidence(candidate_cv: Dict[str, Any], source_map: Dict[str, SourceMapItem]) -> Dict[str, float]:
        confidences: Dict[str, float] = {}

        # Contact confidence
        contact_scores = [item.confidence for key, item in source_map.items() if key.startswith("contact.")]
        confidences["contact"] = round(sum(contact_scores) / max(1, len(contact_scores)), 2) if contact_scores else 0.50

        # Summary confidence
        confidences["summary"] = round(source_map.get("summary", SourceMapItem()).confidence or 0.80, 2)

        # Experience confidence
        exp_scores = [item.confidence for key, item in source_map.items() if key.startswith("experience[")]
        confidences["experience"] = round(sum(exp_scores) / max(1, len(exp_scores)), 2) if exp_scores else 0.85

        # Education confidence
        edu_scores = [item.confidence for key, item in source_map.items() if key.startswith("education[")]
        confidences["education"] = round(sum(edu_scores) / max(1, len(edu_scores)), 2) if edu_scores else 0.85

        # Overall confidence score
        all_scores = [item.confidence for item in source_map.values()]
        confidences["overall"] = round(sum(all_scores) / max(1, len(all_scores)), 2) if all_scores else 0.88

        return confidences
