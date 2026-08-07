from typing import Dict, Any, List
from .skills_gap_engine import SkillsGapEngine

class SemanticMatchEngine:
    @staticmethod
    def match_cv_to_job(cv_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        cv_skills = [s for sg in cv_data.get("skillGroups", []) for s in sg.get("skills", [])]
        req_skills = job_data.get("requiredSkills", ["Python", "TypeScript", "React", "FastAPI"])

        skills_gap = SkillsGapEngine.evaluate_skills_gap(cv_skills, req_skills)
        technical_score = int(skills_gap["coveragePercentage"])

        # Experience Match
        exp_list = cv_data.get("experience", [])
        experience_score = 90 if len(exp_list) >= 2 else 65

        # Education Match
        edu_list = cv_data.get("education", [])
        education_score = 95 if edu_list else 70

        # ATS Match
        ats_score = int(technical_score * 0.4 + experience_score * 0.3 + education_score * 0.3)
        overall_match = int(technical_score * 0.35 + experience_score * 0.30 + ats_score * 0.35)

        return {
            "overallMatch": max(50, min(99, overall_match)),
            "technicalMatch": technical_score,
            "experienceMatch": experience_score,
            "educationMatch": education_score,
            "atsMatch": ats_score,
            "skillsGap": skills_gap
        }
