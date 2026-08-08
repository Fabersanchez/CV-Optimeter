import json
import urllib.request
from typing import Dict, Any
from app.core.config import settings

class CoverLetterService:
    """Generates tailored, high-converting Cover Letters based on candidate CV and Job Description."""

    @classmethod
    def generate_cover_letter(cls, candidate_name: str, current_role: str, company_name: str, target_role: str, job_description: str, cv_text: str, tone: str = "professional") -> Dict[str, Any]:
        if settings.OPENAI_API_KEY:
            try:
                letter = cls._call_openai_cover_letter(candidate_name, current_role, company_name, target_role, job_description, cv_text, tone)
                return {"cover_letter": letter, "company_name": company_name, "target_role": target_role}
            except Exception:
                pass

        return {
            "cover_letter": cls._local_cover_letter_template(candidate_name, current_role, company_name, target_role, tone),
            "company_name": company_name,
            "target_role": target_role
        }

    @staticmethod
    def _local_cover_letter_template(name: str, role: str, company: str, target_role: str, tone: str) -> str:
        name = name if name and name != "Candidate Profile" else "Candidate Name"
        company = company if company else "Target Company"
        target_role = target_role if target_role else "Senior Role"

        return f"""Dear Hiring Team at {company},

I am writing to express my enthusiastic interest in the {target_role} position. With a strong track record as a {role}, I have consistently focused on delivering scalable, high-impact business outcomes and leading cross-functional teams toward technical and operational excellence.

Throughout my career, I have specialized in optimizing key operational frameworks, introducing metrics-driven execution, and architecting solutions that drive quantifiable growth. At {company}, I am particularly drawn to your mission of innovation and market leadership, and I am confident that my experience in strategy execution and problem-solving makes me a compelling fit for your team.

Key highlights of my background that align with your requirements include:
• Proven experience leading high-stakes technical and business initiatives from inception to delivery.
• Track record of accelerating delivery pipelines while maintaining a 30%+ increase in process efficiency.
• Strong passion for collaborating across departments to align strategic roadmaps with corporate objectives.

I would welcome the opportunity to discuss how my background and strategic vision can contribute to the continued success of {company}. Thank you for your time and consideration.

Sincerely,

{name}
"""

    @classmethod
    def _call_openai_cover_letter(cls, name: str, role: str, company: str, target_role: str, job_desc: str, cv_text: str, tone: str) -> str:
        prompt = f"""Write a compelling 4-paragraph cover letter for {name} applying for {target_role} at {company}.
Tone: {tone}
Candidate experience context: "{cv_text[:800]}"
Job Description context: "{job_desc[:800]}"
Return ONLY the raw cover letter text."""

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
        }
        body = {
            "model": settings.OPENAI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }

        req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data['choices'][0]['message']['content'].strip()
