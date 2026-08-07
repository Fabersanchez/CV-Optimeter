import re
from typing import Dict, Any, List

class JobMatcherService:
    """Matches CV text against target Job Description to detect keyword gaps and fit percentage."""

    COMMON_KEYWORDS = [
        "Python", "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Docker", "Kubernetes",
        "AWS", "Cloud", "PostgreSQL", "SQL", "MongoDB", "Redis", "REST API", "GraphQL", "CI/CD",
        "Agile", "Scrum", "Microservices", "System Design", "Unit Testing", "TDD", "Git",
        "Product Management", "Data Engineering", "Machine Learning", "ETL", "Leadership",
        "Security", "DevOps", "Cybersecurity", "UI/UX Design", "Figma", "Customer Success"
    ]

    @classmethod
    def match_cv_to_job(cls, cv_text: str, job_description: str) -> Dict[str, Any]:
        if not cv_text or not job_description:
            return {
                "match_percentage": 0,
                "present_keywords": [],
                "missing_keywords": [],
                "recommendations": ["Please upload a valid CV and paste a complete Job Description."]
            }

        # Extract keywords present in Job Description
        job_keywords = cls._extract_job_keywords(job_description)
        cv_keywords = cls._extract_job_keywords(cv_text)

        present = [kw for kw in job_keywords if kw.lower() in cv_text.lower()]
        missing = [kw for kw in job_keywords if kw.lower() not in cv_text.lower()]

        if job_keywords:
            match_pct = int((len(present) / len(job_keywords)) * 100)
        else:
            match_pct = 70  # Default baseline

        recommendations = []
        if missing:
            recommendations.append(f"Add critical missing hard skills to your Skills section: {', '.join(missing[:5])}.")
        if match_pct < 60:
            recommendations.append("Tailor your work experience bullet points using terms directly from the job description responsibilities.")
        elif match_pct >= 85:
            recommendations.append("High match score! Your resume aligns strongly with this position requirements.")

        return {
            "match_percentage": match_pct,
            "job_keywords_count": len(job_keywords),
            "present_keywords": present,
            "missing_keywords": missing,
            "recommendations": recommendations,
            "match_level": "Excellent Fit" if match_pct >= 80 else ("Moderate Fit" if match_pct >= 60 else "Requires Optimization")
        }

    @classmethod
    def _extract_job_keywords(cls, text: str) -> List[str]:
        found = []
        for kw in cls.COMMON_KEYWORDS:
            pattern = r'\b' + re.escape(kw) + r'\b'
            if re.search(pattern, text, re.IGNORECASE):
                found.append(kw)

        # Extract uppercase multi-letter words (e.g. SOC2, GCP, HIPAA, ROI)
        caps = re.findall(r'\b[A-Z]{2,6}\b', text)
        for c in caps:
            if c not in found and len(c) > 1 and c not in ["AND", "FOR", "THE", "YOU", "WITH"]:
                found.append(c)

        return list(dict.fromkeys(found))
