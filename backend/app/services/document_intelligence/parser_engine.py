import os
import re
from typing import Dict, Any
from .section_detector import detect_section_type
from .normalizer_engine import normalize_candidate_data

def parse_text_into_cv_structure(raw_text: str, filename: str = "document.pdf") -> Dict[str, Any]:
    lines = [line.strip() for line in raw_text.split("\n") if line.strip()]

    contact = {
        "name": lines[0] if lines else "Candidate Name",
        "title": lines[1] if len(lines) > 1 else "Professional Title",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin": "",
        "github": ""
    }

    # Extract email & phone via regex
    email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", raw_text)
    if email_match:
        contact["email"] = email_match.group(0)

    phone_match = re.search(r"\+?\d[\d\-\s\(\)]{8,}\d", raw_text)
    if phone_match:
        contact["phone"] = phone_match.group(0).strip()

    linkedin_match = re.search(r"linkedin\.com/in/[\w\-]+", raw_text, re.I)
    if linkedin_match:
        contact["linkedin"] = f"https://{linkedin_match.group(0)}"

    github_match = re.search(r"github\.com/[\w\-]+", raw_text, re.I)
    if github_match:
        contact["github"] = f"https://{github_match.group(0)}"

    # Mock extracted structure from text
    parsed_cv = {
        "id": f"cv-{os.urandom(4).hex()}",
        "title": f"Parsed {filename}",
        "contact": contact,
        "summary": "Experienced software developer skilled in building web platforms, cloud microservices, and AI features.",
        "experience": [
            {
                "id": "exp-p1",
                "company": "Enterprise Tech Corp",
                "role": "Senior Developer",
                "location": "San Francisco, CA",
                "startDate": "2022",
                "endDate": "Present",
                "current": True,
                "description": "Led core web development and backend API infrastructure.",
                "bullets": [
                    "Architected high-performance FastAPI microservices handling 1M+ daily events.",
                    "Improved core web vitals and reduced latency by 35%."
                ]
            }
        ],
        "education": [
            {
                "id": "edu-p1",
                "institution": "State University",
                "degree": "Bachelor of Science",
                "field": "Computer Science",
                "location": "City, Country",
                "startDate": "2018",
                "endDate": "2022"
            }
        ],
        "skillGroups": [
            {
                "id": "sg-p1",
                "category": "Core Tech Stack",
                "skills": ["Python", "TypeScript", "React", "Next.js", "FastAPI", "PostgreSQL", "Docker"]
            }
        ],
        "projects": [],
        "certifications": [],
        "languages": [
            {"id": "lang-p1", "language": "English", "proficiency": "Native"}
        ],
        "achievements": [],
        "sectionOrder": ["summary", "experience", "skills", "education", "languages"],
        "metadata": {
            "sourceFormat": filename.split(".")[-1].upper() if "." in filename else "TXT",
            "totalWordCount": len(raw_text.split()),
            "estimatedPageCount": max(1, len(raw_text.split()) // 350)
        }
    }

    return normalize_candidate_data(parsed_cv)
