from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.services.linkedin_service import LinkedInOptimizerService

router = APIRouter()

class LinkedInOptimizationRequest(BaseModel):
    cv_summary: Optional[str] = ""
    target_role: Optional[str] = ""
    extracted_skills: Optional[List[str]] = []

@router.post("/optimize")
async def optimize_linkedin(request: LinkedInOptimizationRequest):
    """Generates optimized LinkedIn headline options, About summary, and key skills to feature."""
    result = LinkedInOptimizerService.optimize_profile(
        request.cv_summary or "",
        request.target_role or "Senior Professional",
        request.extracted_skills or []
    )
    return {
        "status": "success",
        "data": result
    }
