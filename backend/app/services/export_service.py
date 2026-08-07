import io
from typing import Dict, Any
from jinja2 import Template

class ExportService:
    """Generates formatted HTML, DOCX, and PDF representations of optimized resumes."""

    HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ contact_info.name }} - Resume</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1a202c; line-height: 1.6; }
        h1 { font-size: 26px; margin-bottom: 4px; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
        .contact { font-size: 13px; color: #475569; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
        h2 { font-size: 16px; color: #2563eb; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 24px; letter-spacing: 0.5px; }
        .section-content { font-size: 14px; margin-bottom: 16px; white-space: pre-line; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .skill-tag { background: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; border: 1px solid #bfdbfe; }
    </style>
</head>
<body>
    <h1>{{ contact_info.name }}</h1>
    <div class="contact">
        {{ contact_info.email }} | {{ contact_info.phone }} | {{ contact_info.linkedin }}
    </div>

    {% if sections.summary %}
    <h2>Professional Summary</h2>
    <div class="section-content">{{ sections.summary }}</div>
    {% endif %}

    {% if sections.experience %}
    <h2>Work Experience</h2>
    <div class="section-content">{{ sections.experience }}</div>
    {% endif %}

    {% if extracted_skills %}
    <h2>Technical & Core Skills</h2>
    <div class="skills-grid">
        {% for skill in extracted_skills %}
        <span class="skill-tag">{{ skill }}</span>
        {% endfor %}
    </div>
    {% endif %}

    {% if sections.education %}
    <h2>Education</h2>
    <div class="section-content">{{ sections.education }}</div>
    {% endif %}
</body>
</html>
"""

    @classmethod
    def generate_html(cls, parsed_cv: Dict[str, Any]) -> str:
        template = Template(cls.HTML_TEMPLATE)
        return template.render(
            contact_info=parsed_cv.get("contact_info", {}),
            sections=parsed_cv.get("sections", {}),
            extracted_skills=parsed_cv.get("extracted_skills", [])
        )
