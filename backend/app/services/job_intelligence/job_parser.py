import re
from typing import Dict, Any, List

HARD_SKILLS_CATALOG = [
    "python", "typescript", "javascript", "react", "next.js", "fastapi", "node.js",
    "postgresql", "redis", "docker", "kubernetes", "aws", "git", "ci/cd", "rest api",
    "graphql", "microservices", "sql", "html5", "css3", "tailwind", "pytest", "redux"
]

class JobParserEngine:
    @staticmethod
    def parse_job_description(job_text: str, source_url: str = "") -> Dict[str, Any]:
        text_lower = job_text.lower()
        lines = [line.strip() for line in job_text.split("\n") if line.strip()]

        role_title = "Senior Software Engineer"
        company_name = "Target Enterprise Corp"

        if lines:
            role_title = lines[0]
        if len(lines) > 1 and ("inc" in lines[1].lower() or "corp" in lines[1].lower() or "ltd" in lines[1].lower() or "co" in lines[1].lower()):
            company_name = lines[1]

        # Extract hard skills
        extracted_skills = [skill.title() for skill in HARD_SKILLS_CATALOG if skill in text_lower]

        # Extract years of experience
        exp_match = re.search(r"(\d+)\+?\s*(?:years|años)", text_lower)
        required_exp = int(exp_match.group(1)) if exp_match else 5

        # Extract salary range if available
        salary_match = re.search(r"\$\d+[\d,]*\s*-\s*\$\d+[\d,]*", job_text)
        salary_range = salary_match.group(0) if salary_match else "$120,000 - $160,000 USD"

        return {
            "roleTitle": role_title,
            "company": company_name,
            "sourceUrl": source_url,
            "requiredSkills": extracted_skills,
            "requiredExperienceYears": required_exp,
            "location": "Remote / USA",
            "salaryRange": salary_range,
            "responsibilities": [
                "Architect and deliver scalable full-stack web features.",
                "Collaborate with product leads to deliver enterprise SaaS solutions.",
                "Optimize database performance and cloud microservices."
            ]
        }
