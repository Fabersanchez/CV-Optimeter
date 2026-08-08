"""
CV OPTIMETER SEMANTIC ENGINE V3.0 - SEMANTIC VALIDATION ENGINE
Enforces strict structural sanity rules:
- SUMMARY_CANNOT_CONTAIN_DATE_RANGE
- SUMMARY_CANNOT_CONTAIN_COMPANY
- SUMMARY_CANNOT_CONTAIN_EXPERIENCE_BLOCK
- EXPERIENCE_MUST_HAVE_POSITION_OR_COMPANY
Calculates semantic extraction confidence (0.0 to 1.0) and triggers review if summary contains experience bleed.
"""

import re
from typing import Dict, Any, List, Tuple
from .date_entity_parser import DateEntityParser


class SemanticValidationError(BaseModel if False else object):
    rule_id: str
    message: str
    severity: str  # WARNING | ERROR


class SemanticValidationResult:
    def __init__(self, sanitized_schema: Dict[str, Any], overall_confidence: float, errors: List[Dict[str, str]]):
        self.sanitized_schema = sanitized_schema
        self.overall_confidence = overall_confidence
        self.errors = errors


class SemanticValidationEngine:
    @staticmethod
    def validate_candidate_schema(candidate_cv: Dict[str, Any]) -> SemanticValidationResult:
        schema, conf, errs = SemanticValidationEngine.validate_and_sanitize_schema(candidate_cv)
        return SemanticValidationResult(schema, conf, errs)

    @staticmethod
    def validate_and_sanitize_schema(candidate_cv: Dict[str, Any]) -> Tuple[Dict[str, Any], float, List[Dict[str, str]]]:
        summary = candidate_cv.get("summary", "").strip()
        experiences = candidate_cv.get("experience", [])
        errors: List[Dict[str, str]] = []
        confidence = 1.0

        # Rule 1: SUMMARY_CANNOT_CONTAIN_DATE_RANGE
        start_d, end_d, _ = DateEntityParser.extract_date_range(summary)
        if start_d or end_d:
            confidence -= 0.15
            errors.append({
                "rule_id": "SUMMARY_CANNOT_CONTAIN_DATE_RANGE",
                "message": f"Summary text contains date range ('{start_d} - {end_d}'). Experience bleed detected.",
                "severity": "WARNING"
            })
            # Clean date range lines out of summary
            cleaned_summary_lines = []
            for line in summary.split("\n"):
                s_d, e_d, _ = DateEntityParser.extract_date_range(line)
                if not (s_d or e_d):
                    cleaned_summary_lines.append(line)
            candidate_cv["summary"] = "\n".join(cleaned_summary_lines).strip()

        # Rule 2: SUMMARY_CANNOT_CONTAIN_EXPERIENCE_BLOCK
        if re.search(r"(?i)\b(responsabilidades|responsibilities|logros|bullet|monitoreo|desarrollo de)\b", summary) and len(summary.split()) > 100:
            confidence -= 0.20
            errors.append({
                "rule_id": "SUMMARY_CANNOT_CONTAIN_EXPERIENCE_BLOCK",
                "message": "Summary exceeds 100 words and contains experience bullet keywords. Trimming bleed.",
                "severity": "WARNING"
            })
            # Keep only first 2 paragraphs for summary
            paras = summary.split("\n\n")
            candidate_cv["summary"] = paras[0].strip()

        # Rule 3: EXPERIENCE_MUST_HAVE_POSITION_OR_COMPANY
        for idx, exp in enumerate(experiences):
            if not exp.get("role") and not exp.get("company"):
                confidence -= 0.10
                errors.append({
                    "rule_id": "EXPERIENCE_MUST_HAVE_POSITION_OR_COMPANY",
                    "message": f"Experience item {idx+1} lacks both company and role title.",
                    "severity": "ERROR"
                })

        candidate_cv["semantic_confidence"] = round(max(0.5, confidence), 2)
        candidate_cv["requires_review"] = len(errors) > 0 or confidence < 0.85

        return (candidate_cv, round(max(0.5, confidence), 2), errors)
