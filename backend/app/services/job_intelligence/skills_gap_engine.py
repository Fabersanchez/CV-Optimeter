from typing import List, Dict, Any

class SkillsGapEngine:
    @staticmethod
    def evaluate_skills_gap(cv_skills: List[str], required_skills: List[str]) -> Dict[str, Any]:
        cv_skills_lower = {s.lower() for s in cv_skills}
        
        fulfilled = []
        missing = []

        for req in required_skills:
            if req.lower() in cv_skills_lower:
                fulfilled.append(req)
            else:
                missing.append(req)

        coverage_ratio = (len(fulfilled) / max(1, len(required_skills))) * 100

        return {
            "fulfilledSkills": fulfilled,
            "missingSkills": missing,
            "coveragePercentage": round(coverage_ratio, 1),
            "matchCategory": "HIGH" if coverage_ratio >= 75 else "MEDIUM" if coverage_ratio >= 50 else "LOW"
        }
