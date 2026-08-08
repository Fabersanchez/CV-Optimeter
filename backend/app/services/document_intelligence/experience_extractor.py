"""
CV OPTIMETER SEMANTIC ENGINE V3.0 - EXPERIENCE EXTRACTOR
Extracts structured experience entities (company, position, location, startDate, endDate, responsibilities).
Guarantees zero text bleeding into summary and prevents lumps.
"""

import re
from typing import List, Dict, Any, Optional
from .date_entity_parser import DateEntityParser


class ExperienceExtractor:
    @staticmethod
    def extract_experiences(section_text: str, full_document_text: str = "") -> List[Dict[str, Any]]:
        target_text = section_text.strip()
        if not target_text:
            return []

        lines = [l.strip() for l in target_text.split("\n") if l.strip()]
        experiences: List[Dict[str, Any]] = []
        current_exp: Optional[Dict[str, Any]] = None

        for line in lines:
            start_date, end_date, is_current = DateEntityParser.extract_date_range(line)
            has_date = bool(start_date)

            # If current_exp exists and is missing dates, update dates from standalone date line
            if has_date and current_exp is not None and not current_exp.get("startDate") and len(line.split()) <= 6:
                current_exp["startDate"] = start_date
                current_exp["endDate"] = end_date
                current_exp["current"] = is_current
                continue

            # Check if line indicates a new experience header (has date or company/role separator)
            is_header = has_date or (
                len(line) < 70 and not line.startswith(("-", "•", "*", "–")) and ("|" in line or any(
                    kw in line.lower() for kw in ["inc", "corp", "ltd", "sa", "sl", "s.a.", "s.l.", "company", "group", "portuaria", "banco", "hospital", "universidad", "servicios"]
                ))
            )

            if (has_date or is_header) and current_exp is not None and (len(current_exp.get("bullets", [])) > 0 or (current_exp.get("startDate") and current_exp.get("company"))):
                experiences.append(current_exp)
                current_exp = None

            if current_exp is None:
                entities = DateEntityParser.separate_company_position_location(line)
                current_exp = {
                    "id": f"exp-{len(experiences) + 1}",
                    "company": entities["company"],
                    "role": entities["position"] or "Professional Role",
                    "location": entities["location"],
                    "startDate": start_date,
                    "endDate": end_date,
                    "current": is_current,
                    "description": "",
                    "bullets": []
                }
            else:
                bullet = line.lstrip("-*•–— ").strip()
                if bullet and not has_date:
                    current_exp["bullets"].append(bullet)

        if current_exp and (current_exp.get("role") or current_exp.get("company") or current_exp.get("bullets")):
            experiences.append(current_exp)

        return experiences
