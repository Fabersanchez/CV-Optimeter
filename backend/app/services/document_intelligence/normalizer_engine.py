import re
from typing import Dict, Any, List

def normalize_email(email_str: str) -> str:
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", email_str)
    return match.group(0).lower() if match else email_str.strip()

def normalize_phone(phone_str: str) -> str:
    cleaned = re.sub(r"[^\d\+\-\s\(\)]", "", phone_str)
    return cleaned.strip()

def normalize_date_string(date_str: str) -> str:
    if not date_str:
        return ""
    d_lower = date_str.lower().strip()
    if "present" in d_lower or "actualidad" in d_lower or "actual" in d_lower or "currently" in d_lower:
        return "Present"
    match = re.search(r"\b(19|20)\d{2}\b", date_str)
    return match.group(0) if match else date_str.strip()

def normalize_skill_list(skills: List[str]) -> List[str]:
    seen = set()
    normalized = []
    for s in skills:
        cleaned = s.strip()
        if cleaned and cleaned.lower() not in seen:
            seen.add(cleaned.lower())
            normalized.append(cleaned)
    return normalized

def normalize_candidate_data(candidate_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Applies normalization rules to contact details, dates, and skill groups."""
    if "contact" in candidate_dict:
        c = candidate_dict["contact"]
        c["email"] = normalize_email(c.get("email", ""))
        c["phone"] = normalize_phone(c.get("phone", ""))
        
        # LinkedIn / GitHub URL clean
        if c.get("linkedin") and not c["linkedin"].startswith("http"):
            c["linkedin"] = f"https://{c['linkedin'].lstrip('/')}"
        if c.get("github") and not c["github"].startswith("http"):
            c["github"] = f"https://{c['github'].lstrip('/')}"

    if "experience" in candidate_dict:
        for exp in candidate_dict["experience"]:
            exp["startDate"] = normalize_date_string(exp.get("startDate", ""))
            exp["endDate"] = normalize_date_string(exp.get("endDate", ""))

    if "education" in candidate_dict:
        for edu in candidate_dict["education"]:
            edu["startDate"] = normalize_date_string(edu.get("startDate", ""))
            edu["endDate"] = normalize_date_string(edu.get("endDate", ""))

    if "skillGroups" in candidate_dict:
        for sg in candidate_dict["skillGroups"]:
            sg["skills"] = normalize_skill_list(sg.get("skills", []))

    return candidate_dict
