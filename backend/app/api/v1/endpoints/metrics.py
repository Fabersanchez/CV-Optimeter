from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter()

@router.get("/stats")
async def get_user_metrics() -> Dict[str, Any]:
    """Returns analytics & progression metrics for the user dashboard."""
    return {
        "status": "success",
        "metrics": {
            "total_analyses": 14,
            "average_ats_score": 82,
            "interview_conversion_increase": "+45%",
            "top_matched_role": "Senior Full Stack Engineer",
            "score_history": [
                {"date": "2026-07-15", "score": 58},
                {"date": "2026-07-20", "score": 67},
                {"date": "2026-07-28", "score": 75},
                {"date": "2026-08-02", "score": 84},
                {"date": "2026-08-07", "score": 92}
            ],
            "category_scores": {
                "action_verbs": 90,
                "measurable_metrics": 85,
                "hard_skills": 95,
                "formatting_structure": 100,
                "brevity_length": 88
            }
        }
    }
