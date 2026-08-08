"""
DOCUMENT INTELLIGENCE ENGINE V2 - DOCUMENT NORMALIZER
Cleans Unicode encodings, whitespace, control characters, and PDF stream artifacts while preserving raw_content.
"""

import re
import unicodedata
from typing import Dict, Any, List


class DocumentNormalizer:
    @staticmethod
    def normalize_text(text: str) -> str:
        """
        Normalizes raw text string:
        1. Normalizes Unicode characters (NFC format).
        2. Replaces control characters and non-printable bytes.
        3. Cleans duplicate header lines and PDF stream garbage (%EOF, obj, etc.).
        4. Preserves layout paragraph boundaries.
        """
        if not text:
            return ""

        # Unicode Normalization (NFC)
        normalized = unicodedata.normalize("NFC", text)

        # Replace non-printable control characters except \n, \r, \t
        normalized = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]", "", normalized)

        # Clean noise patterns
        normalized = re.sub(r"%PDF-\d\.\d", "", normalized, flags=re.I)
        normalized = re.sub(r"\b(obj|endobj|stream|endstream|xref|trailer|startxref|%EOF)\b", "", normalized, flags=re.I)
        normalized = re.sub(r"/[A-Za-z0-9_]+\b", "", normalized)

        lines = normalized.split("\n")
        clean_lines: List[str] = []
        previous_line = ""

        for line in lines:
            s = line.strip()
            # Skip empty or binary stream noise lines
            if not s or s.lower() in ["null", "none", "undefined", "%eof", "20 null"]:
                continue
            if re.match(r"^\d+(\s+\d+)*$", s) and len(s) < 10:
                continue
            # Header deduplication
            if s == previous_line and len(s) < 30:
                continue

            clean_lines.append(s)
            previous_line = s

        return "\n".join(clean_lines).strip()

    @staticmethod
    def normalize_email(email_str: str) -> str:
        match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", email_str)
        return match.group(0).lower() if match else email_str.strip()

    @staticmethod
    def normalize_phone(phone_str: str) -> str:
        cleaned = re.sub(r"[^\d\+\-\s\(\)]", "", phone_str)
        return cleaned.strip()

    @staticmethod
    def normalize_date_string(date_str: str) -> str:
        if not date_str:
            return ""
        d_lower = date_str.lower().strip()
        if "present" in d_lower or "actualidad" in d_lower or "actual" in d_lower or "currently" in d_lower:
            return "Present"
        match = re.search(r"\b(19|20)\d{2}\b", date_str)
        return match.group(0) if match else date_str.strip()

    @staticmethod
    def normalize_skill_list(skills: List[str]) -> List[str]:
        seen = set()
        normalized = []
        for s in skills:
            cleaned = s.strip()
            if cleaned and cleaned.lower() not in seen and len(cleaned) <= 35:
                seen.add(cleaned.lower())
                normalized.append(cleaned)
        return normalized

    @staticmethod
    def normalize_candidate_cv(candidate_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Applies normalization rules to contact details, dates, and skill groups."""
        if "contact" in candidate_dict:
            c = candidate_dict["contact"]
            c["name"] = c.get("name", "").strip()
            c["title"] = c.get("title", "").strip()
            c["email"] = DocumentNormalizer.normalize_email(c.get("email", ""))
            c["phone"] = DocumentNormalizer.normalize_phone(c.get("phone", ""))
            
            if c.get("linkedin") and not c["linkedin"].startswith("http"):
                c["linkedin"] = f"https://{c['linkedin'].lstrip('/')}"
            if c.get("github") and not c["github"].startswith("http"):
                c["github"] = f"https://{c['github'].lstrip('/')}"

        if "experience" in candidate_dict:
            for exp in candidate_dict["experience"]:
                exp["company"] = exp.get("company", "").strip()
                exp["role"] = exp.get("role", "").strip()
                exp["startDate"] = DocumentNormalizer.normalize_date_string(exp.get("startDate", ""))
                exp["endDate"] = DocumentNormalizer.normalize_date_string(exp.get("endDate", ""))

        if "education" in candidate_dict:
            for edu in candidate_dict["education"]:
                edu["institution"] = edu.get("institution", "").strip()
                edu["degree"] = edu.get("degree", "").strip()
                edu["startDate"] = DocumentNormalizer.normalize_date_string(edu.get("startDate", ""))
                edu["endDate"] = DocumentNormalizer.normalize_date_string(edu.get("endDate", ""))

        if "skillGroups" in candidate_dict:
            for sg in candidate_dict["skillGroups"]:
                sg["skills"] = DocumentNormalizer.normalize_skill_list(sg.get("skills", []))

        return candidate_dict


def normalize_candidate_data(candidate_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Backward compatibility wrapper"""
    return DocumentNormalizer.normalize_candidate_cv(candidate_dict)
