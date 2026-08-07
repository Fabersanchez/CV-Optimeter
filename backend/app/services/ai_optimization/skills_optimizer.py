from typing import List, Dict, Any

class SkillsOptimizerEngine:
    @staticmethod
    def optimize_skills(skill_groups: List[Dict[str, Any]], target_industry: str = "Technology") -> List[Dict[str, Any]]:
        optimized_groups = []
        for sg in skill_groups:
            skills = sg.get("skills", [])
            # Deduplicate and add key industry power skills
            clean_skills = list(dict.fromkeys(skills))
            if "Agile Execution" not in clean_skills:
                clean_skills.append("Agile Execution")
            if "CI/CD Pipelines" not in clean_skills:
                clean_skills.append("CI/CD Pipelines")
            
            optimized_groups.append({
                "id": sg.get("id", "sg-opt"),
                "category": sg.get("category", "Core Skills"),
                "skills": clean_skills
            })
        return optimized_groups
