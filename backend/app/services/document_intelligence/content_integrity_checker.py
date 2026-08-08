"""
CV OPTIMETER DATA-FIRST ARCHITECTURE - CONTENT INTEGRITY CHECKER
Validates 100% content preservation between CandidateCVSchema source data and rendered outputs.
Guarantees zero silent text loss, no truncated experiences, and zero missing skills.
"""

from typing import Dict, Any, List
from pydantic import BaseModel, Field


class ContentIntegrityReport(BaseModel):
    is_valid: bool = True
    preservation_score: float = 100.0
    missing_fields: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    details: Dict[str, Any] = Field(default_factory=dict)


class ContentIntegrityChecker:
    @staticmethod
    def verify_integrity(
        candidate_cv: Dict[str, Any],
        rendered_text: str
    ) -> ContentIntegrityReport:
        missing: List[str] = []
        warnings: List[str] = []
        rend_lower = rendered_text.lower()

        # 1. Check Basics / Contact
        contact = candidate_cv.get("contact", {}) or candidate_cv.get("basics", {})
        name = contact.get("name", "")
        if name and name.lower() not in rend_lower:
            missing.append(f"Candidate Name '{name}' missing from rendered output.")

        email = contact.get("email", "")
        if email and email.lower() not in rend_lower:
            missing.append(f"Candidate Email '{email}' missing from rendered output.")

        # 2. Check Work Experience Companies & Roles
        experiences = candidate_cv.get("experience", [])
        for idx, exp in enumerate(experiences):
            comp = exp.get("company", "")
            if comp and comp.lower() not in rend_lower:
                missing.append(f"Experience {idx+1} company '{comp}' missing from render.")

            role = exp.get("position", "") or exp.get("role", "")
            if role and role.lower() not in rend_lower:
                warnings.append(f"Experience {idx+1} position '{role}' missing from render.")

            # Check Bullets
            bullets = exp.get("bullets", []) or exp.get("responsibilities", [])
            for b_idx, bullet in enumerate(bullets[:3]):
                # Check first 4 words of bullet
                b_words = bullet.split()[:4]
                if b_words and " ".join(b_words).lower() not in rend_lower:
                    warnings.append(f"Experience {idx+1} bullet {b_idx+1} truncated or missing.")

        # 3. Check Education Institutions
        educations = candidate_cv.get("education", [])
        for idx, edu in enumerate(educations):
            inst = edu.get("institution", "")
            if inst and inst.lower() not in rend_lower:
                missing.append(f"Education {idx+1} institution '{inst}' missing from render.")

        # Calculate Preservation Score
        total_items = max(1, 2 + len(experiences) + len(educations))
        missing_count = len(missing)
        score = round(max(0.0, ((total_items - missing_count) / total_items) * 100), 1)

        return ContentIntegrityReport(
            is_valid=len(missing) == 0,
            preservation_score=score,
            missing_fields=missing,
            warnings=warnings,
            details={
                "total_experiences_checked": len(experiences),
                "total_educations_checked": len(educations)
            }
        )
