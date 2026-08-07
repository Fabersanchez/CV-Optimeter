import re
from typing import Dict, List, Any

SECTION_PATTERNS = {
    "summary": [
        r"\b(summary|profile|about|professional summary|resumen|perfil|perfil profesional|extracto|about me)\b"
    ],
    "experience": [
        r"\b(experience|work experience|employment|professional experience|career|work history|trayectoria|experiencia|experiencia laboral|historial laboral)\b"
    ],
    "education": [
        r"\b(education|academic|academic background|studies|formaci[oó]n|estudios|educaci[oó]n|titulaci[oó]n)\b"
    ],
    "skills": [
        r"\b(skills|technical skills|core competencies|competencies|habilidades|competencias|tecnolog[ií]as|tech stack|herramientas)\b"
    ],
    "projects": [
        r"\b(projects|key projects|portfolio|proyectos|proyectos destacados)\b"
    ],
    "certifications": [
        r"\b(certifications|certificates|licenses|certificaciones|certificados|licencias)\b"
    ],
    "languages": [
        r"\b(languages|idiomas|lenguas)\b"
    ],
    "achievements": [
        r"\b(achievements|awards|honors|logros|premios|reconocimientos)\b"
    ],
    "publications": [
        r"\b(publications|papers|publicaciones|investigaciones)\b"
    ]
}

def detect_section_type(header_text: str) -> str:
    """Classifies an arbitrary section header into a canonical section key."""
    text = header_text.strip().lower()
    for section_type, patterns in SECTION_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                return section_type
    return "custom"

def classify_raw_sections(sections_dict: Dict[str, str]) -> Dict[str, str]:
    """Maps a dictionary of raw section headers -> section content into canonical keys."""
    classified = {}
    for header, content in sections_dict.items():
        canonical_key = detect_section_type(header)
        classified[canonical_key] = content
    return classified
