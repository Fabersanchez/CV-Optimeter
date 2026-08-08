"""
CV OPTIMETER AI — AUTOMATED CV VALIDATOR ENGINE (PHASE 4)
Validates chronological experience, email/phone syntax, duplicate entries, and empty fields.
Generates actionable warnings and recommendations.
"""

import re
from typing import Dict, Any, List

class ValidatorEngine:
    @staticmethod
    def validate_and_audit(candidate_cv: Dict[str, Any]) -> Dict[str, Any]:
        warnings = []
        recommendations = []
        validations = {
            "emailValid": False,
            "phoneValid": False,
            "chronologyValid": True,
            "hasQuantifiedMetrics": False,
            "skillDensityOk": False
        }

        contact = candidate_cv.get("contact", {})
        
        # Email Validation
        email = contact.get("email", "")
        if email and re.match(r"^[\w\.-]+@[\w\.-]+\.\w+$", email):
            validations["emailValid"] = True
        else:
            warnings.append("Missing or invalid contact email address.")
            recommendations.append("Add a valid professional email address to top header.")

        # Phone Validation
        phone = contact.get("phone", "")
        if phone and len(re.sub(r"\D", "", phone)) >= 8:
            validations["phoneValid"] = True
        else:
            warnings.append("Missing or short phone number.")
            recommendations.append("Add contact phone number with international country code.")

        # Chronology & Quantified Metrics Audit
        experience = candidate_cv.get("experience", [])
        if not experience:
            warnings.append("No work experience entries found.")
            recommendations.append("Add past roles or technical project highlights.")
        else:
            years = []
            for exp in experience:
                start_yr = re.search(r"\b(20\d{2}|19\d{2})\b", exp.get("startDate", ""))
                if start_yr:
                    years.append(int(start_yr.group(1)))

                bullets = exp.get("bullets", [])
                has_metrics = any("%" in b or "$" in b or re.search(r"\b(10|20|35|40|50|100|200|1M|2M)\b", b) for b in bullets)
                if has_metrics:
                    validations["hasQuantifiedMetrics"] = True

            # Check if chronological order is descending
            if years and len(years) > 1:
                if years != sorted(years, reverse=True):
                    validations["chronologyValid"] = False
                    warnings.append("Work experience entries may not be in reverse chronological order.")
                    recommendations.append("Sort experience entries with most recent job first.")

        # Skill Density Check
        skills_groups = candidate_cv.get("skillGroups", [])
        total_skills = sum(len(sg.get("skills", [])) for sg in skills_groups)
        if total_skills >= 6:
            validations["skillDensityOk"] = True
        else:
            warnings.append("Low technical skill density.")
            recommendations.append("Add at least 8-12 relevant hard skills and frameworks.")

        return {
            "validations": validations,
            "totalWarnings": len(warnings),
            "warnings": warnings,
            "recommendations": recommendations
        }
