from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.ai_optimizer import AIOptimizerService

router = APIRouter()

class RewriteBulletRequest(BaseModel):
    bullet_text: str
    tone: Optional[str] = "executive"
    target_role: Optional[str] = ""

class GenerateSummaryRequest(BaseModel):
    current_summary: Optional[str] = ""
    experience_text: str
    target_role: Optional[str] = "Senior Professional"

@router.post("/rewrite-bullet")
async def rewrite_bullet(request: RewriteBulletRequest):
    """Rewrites a single experience bullet point into STAR format with metrics."""
    if not request.bullet_text.strip():
        raise HTTPException(status_code=400, detail="Bullet text cannot be empty.")
    
    result = AIOptimizerService.rewrite_bullet_point(
        request.bullet_text,
        request.tone or "executive",
        request.target_role or ""
    )
    return {
        "status": "success",
        "result": result
    }

@router.post("/generate-summary")
async def generate_summary(request: GenerateSummaryRequest):
    """Generates an executive professional summary."""
    summary = AIOptimizerService.generate_summary(
        request.current_summary or "",
        request.experience_text,
        request.target_role or "Senior Professional"
    )
    return {
        "status": "success",
        "summary": summary
    }
