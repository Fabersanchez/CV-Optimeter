import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.ai_optimization.star_engine import STAREngine
from app.services.ai_optimization.summary_engine import SummaryEngine
from app.services.ai_optimization.skills_optimizer import SkillsOptimizerEngine
from app.services.ai_optimization.resume_dna_engine import ResumeDNAEngine
from app.services.ai_optimization.diff_comparator import DiffComparatorEngine
from app.services.ai_optimization.resume_optimizer import ResumeOptimizerEngine

def test_ai_optimization_suite():
    sample_cv = {
        "id": "cv-ai-01",
        "title": "Senior Engineer Resume",
        "contact": {
            "name": "Alex Morgan",
            "title": "Senior Software Architect",
            "email": "alex.morgan@devmail.io"
        },
        "summary": "Full stack engineer building web applications.",
        "experience": [
            {
                "id": "exp-1",
                "company": "TechCorp",
                "role": "Senior Developer",
                "bullets": ["Managed software engineering team and built web dashboards."]
            }
        ],
        "skillGroups": [
            {
                "id": "sg-1",
                "category": "Core Skills",
                "skills": ["Python", "TypeScript", "React"]
            }
        ]
    }

    print("--- 1. Testing STAREngine (STAR, XYZ, CAR, PAR) ---")
    star = STAREngine()
    star_res = star.rewrite_bullets("Senior Developer", "TechCorp", sample_cv["experience"][0]["bullets"], methodology="STAR")
    xyz_res = star.rewrite_bullets("Senior Developer", "TechCorp", sample_cv["experience"][0]["bullets"], methodology="XYZ")
    assert len(star_res) == 1 and "%" in star_res[0]
    assert len(xyz_res) == 1 and "Accomplished" in xyz_res[0]
    print("[OK] STAREngine & XYZ Rewriter Rewrote Experience Bullets Correctly")

    print("\n--- 2. Testing Multi-Tone Summary Engine ---")
    summary = SummaryEngine.generate_summary(title="Senior Engineer", tone="Executive")
    assert "Executive Leader" in summary or "8+ years" in summary
    print("[OK] Summary Engine Generated Multi-Tone Summaries")

    print("\n--- 3. Testing Skills Optimizer Engine ---")
    opt_skills = SkillsOptimizerEngine.optimize_skills(sample_cv["skillGroups"])
    assert "Agile Execution" in opt_skills[0]["skills"]
    print("[OK] Skills Optimizer Added Industry Power Terms")

    print("\n--- 4. Testing Resume DNA Engine ---")
    dna = ResumeDNAEngine()
    prof = dna.update_dna("accept_improvement", {})
    assert prof["acceptedImprovementsCount"] == 1
    print("[OK] Resume DNA Profile Updated Candidate Preferences")

    print("\n--- 5. Testing Resume Optimizer & Diff Comparator ---")
    optimizer = ResumeOptimizerEngine()
    result = optimizer.optimize_cv(sample_cv, tone="Executive")
    assert result["optimizedCV"]["summary"] != sample_cv["summary"]
    assert result["diffComparison"]["totalChanges"] > 0
    print(f"[OK] Resume Optimizer Generated {result['diffComparison']['totalChanges']} Changes with {result['diffComparison']['overallConfidence']}% Confidence")

    print("\n[OK] ALL AI OPTIMIZATION ENGINE TESTS PASSED 100%!")

if __name__ == "__main__":
    test_ai_optimization_suite()
