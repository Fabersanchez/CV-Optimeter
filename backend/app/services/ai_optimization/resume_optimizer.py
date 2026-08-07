from typing import Dict, Any, Optional
from .star_engine import STAREngine
from .summary_engine import SummaryEngine
from .skills_optimizer import SkillsOptimizerEngine
from .diff_comparator import DiffComparatorEngine

class ResumeOptimizerEngine:
    def __init__(self):
        self.star_engine = STAREngine()
        self.skills_optimizer = SkillsOptimizerEngine()

    def optimize_cv(self, cv_data: Dict[str, Any], target_section: Optional[str] = None, tone: str = "Executive") -> Dict[str, Any]:
        optimized = cv_data.copy()

        # Selective or Massive Section Optimization
        if not target_section or target_section == "summary":
            optimized["summary"] = SummaryEngine.generate_summary(
                title=cv_data.get("contact", {}).get("title", "Senior Engineer"),
                tone=tone
            )

        if not target_section or target_section == "experience":
            opt_exp = []
            for exp in cv_data.get("experience", []):
                new_exp = exp.copy()
                new_exp["bullets"] = self.star_engine.rewrite_bullets(
                    role=exp.get("role", ""),
                    company=exp.get("company", ""),
                    bullets=exp.get("bullets", []),
                    methodology="STAR"
                )
                opt_exp.append(new_exp)
            optimized["experience"] = opt_exp

        if not target_section or target_section == "skills":
            optimized["skillGroups"] = self.skills_optimizer.optimize_skills(
                cv_data.get("skillGroups", [])
            )

        diff = DiffComparatorEngine.generate_diff_comparison(cv_data, optimized)

        return {
            "optimizedCV": optimized,
            "diffComparison": diff
        }
