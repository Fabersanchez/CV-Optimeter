"""
CV OPTIMETER SEMANTIC ENGINE V3.0 - DATE & ENTITY PARSER
Extracts date ranges (MM/YYYY, Month YYYY, YYYY - Present, Septiembre 2025 - Abril 2026, Actualidad) and separates company, position, and location entities.
"""

import re
from typing import Dict, Any, Tuple, Optional, List


class DateEntityParser:
    MONTH_MAP = {
        "jan": "01", "enero": "01", "ene": "01",
        "feb": "02", "febrero": "02",
        "mar": "03", "marzo": "03",
        "apr": "04", "abril": "04", "abr": "04",
        "may": "05", "mayo": "05",
        "jun": "06", "junio": "06",
        "jul": "07", "julio": "07",
        "aug": "08", "agosto": "08", "ago": "08",
        "sep": "09", "september": "09", "septiembre": "09", "set": "09",
        "oct": "10", "octubre": "10",
        "nov": "11", "noviembre": "11",
        "dec": "12", "diciembre": "12", "dic": "12"
    }

    DATE_PATTERN = re.compile(
        r"(?i)\b("
        r"\d{1,2}[\/\-]\d{4}|"
        r"\d{4}[\/\-]\d{1,2}|"
        r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene|abr|ago|set|dic)\.?\s+\d{4}|"
        r"\b20\d{2}\b|\b19\d{2}\b"
        r")"
        r"\s*(?:[\-–—aA]|to|hasta|al?)\s*"
        r"("
        r"\d{1,2}[\/\-]\d{4}|"
        r"\d{4}[\/\-]\d{1,2}|"
        r"(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre|ene|abr|ago|set|dic)\.?\s+\d{4}|"
        r"\b20\d{2}\b|\b19\d{2}\b|"
        r"present|presente|actualidad|actualmente|current|now|fecha"
        r")\b"
    )

    SINGLE_DATE_PATTERN = re.compile(
        r"(?i)\b(\d{1,2}[\/\-]\d{4}|\b20\d{2}\b|\b19\d{2}\b|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\.?\s+\d{4})\b"
    )

    @classmethod
    def extract_date_range(cls, text: str) -> Tuple[str, str, bool]:
        """Returns (start_date, end_date, is_current)."""
        match = cls.DATE_PATTERN.search(text)
        if match:
            start_str = match.group(1).strip()
            end_str = match.group(2).strip()

            is_current = any(kw in end_str.lower() for kw in ["present", "presente", "actualidad", "actualmente", "current", "now"])
            end_date = "Present" if is_current else end_str

            return (start_str, end_date, is_current)

        # Try single date pattern
        matches = cls.SINGLE_DATE_PATTERN.findall(text)
        if len(matches) >= 2:
            return (matches[0], matches[1], False)
        elif len(matches) == 1:
            is_cur = any(kw in text.lower() for kw in ["present", "presente", "actualidad", "actualmente"])
            return (matches[0], "Present" if is_cur else matches[0], is_cur)

        return ("", "", False)

    @classmethod
    def separate_company_position_location(cls, line: str) -> Dict[str, str]:
        """
        Splits a header line (e.g. 'Auxiliar Técnico de Contenedores | Sociedad Portuaria | Cartagena')
        into position, company, and location.
        """
        parts = [p.strip() for p in re.split(r"[\|•\-\–—]", line) if p.strip()]

        position = ""
        company = ""
        location = ""

        if len(parts) >= 3:
            position = parts[0]
            company = parts[1]
            location = parts[2]
        elif len(parts) == 2:
            # Determine which part looks like a position title
            p0_lower = parts[0].lower()
            if any(kw in p0_lower for kw in ["engineer", "developer", "architect", "lead", "director", "manager", "auxiliar", "técnico", "consultor", "analista", "coordinador", "asistente", "diseñador", "jefe", "especialista"]):
                position = parts[0]
                company = parts[1]
            else:
                company = parts[0]
                position = parts[1]
        elif len(parts) == 1:
            position = parts[0]

        return {
            "position": position,
            "company": company,
            "location": location
        }
