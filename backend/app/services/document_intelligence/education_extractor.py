"""
CV OPTIMETER SEMANTIC ENGINE V3.0 - EDUCATION EXTRACTOR
Extracts structured education entities (institution, degree, field, location, startDate, endDate).
"""

import re
from typing import List, Dict, Any
from .date_entity_parser import DateEntityParser


class EducationExtractor:
    @staticmethod
    def extract_educations(section_text: str) -> List[Dict[str, Any]]:
        return EducationExtractor.extract_education(section_text)

    @staticmethod
    def extract_education(section_text: str) -> List[Dict[str, Any]]:
        if not section_text.strip():
            return []

        lines = [l.strip() for l in section_text.split("\n") if l.strip()]
        educations: List[Dict[str, Any]] = []

        for idx, line in enumerate(lines):
            start_d, end_d, _ = DateEntityParser.extract_date_range(line)
            
            degree_match = re.search(r"(?i)\b(grado|máster|master|licenciatura|ingeniería|bachelor|master|phd|doctorado|diplomatura|tecnicatura|técnico|certificate|diploma)\b", line)
            degree_found = degree_match.group(0) if degree_match else ""

            parts = [p.strip() for p in line.split("|") if p.strip()]
            inst = parts[0] if parts else line

            educations.append({
                "id": f"edu-{idx + 1}",
                "institution": inst,
                "degree": degree_found or "Degree / Qualification",
                "field": "",
                "location": parts[1] if len(parts) > 1 else "",
                "startDate": start_d,
                "endDate": end_d
            })

        return educations[:4]
