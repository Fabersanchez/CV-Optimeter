from typing import List, Dict, Any

class RoadmapGeneratorEngine:
    @staticmethod
    def generate_roadmap(match_result: Dict[str, Any], missing_skills: List[str]) -> List[Dict[str, Any]]:
        roadmap = []

        if missing_skills:
            roadmap.append({
                "id": "step-01",
                "priority": "HIGH",
                "action": f"Add missing target skills: {', '.join(missing_skills[:3])}",
                "reason": "Directly required by job description keywords.",
                "estimatedEffort": "3 mins",
                "difficulty": "Easy",
                "expectedBenefit": "+15% Match Score"
            })

        roadmap.append({
            "id": "step-02",
            "priority": "HIGH",
            "action": "Execute 1-Click 'Optimizar para esta Vacante'",
            "reason": "Reorders experience bullets to highlight relevant tech stack.",
            "estimatedEffort": "1 min",
            "difficulty": "Instant",
            "expectedBenefit": "+20% ATS Keyword Alignment"
        })

        roadmap.append({
            "id": "step-03",
            "priority": "MEDIUM",
            "action": "Tailor Professional Summary to Target Role Title",
            "reason": "Ensures top banner alignment with recruiter search query.",
            "estimatedEffort": "2 mins",
            "difficulty": "Easy",
            "expectedBenefit": "+10% Recruiter Impression"
        })

        return roadmap
