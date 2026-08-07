from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.cover_letter_service import CoverLetterService

router = APIRouter()

class CoverLetterRequest(BaseModel):
    candidate_name: Optional[str] = "Candidate Profile"
    current_role: Optional[str] = "Senior Specialist"
    company_name: str
    target_role: str
    job_description: Optional[str] = ""
    cv_text: Optional[str] = ""
    tone: Optional[str] = "professional"

@router.post("/generate")
async def generate_cover_letter(request: CoverLetterRequest):
    """Generates a customized, high-converting cover letter."""
    if not request.company_name or not request.target_role:
        raise HTTPException(status_code=400, detail="Company Name and Target Role are required.")
    
    result = CoverLetterService.generate_cover_letter(
        request.candidate_name or "Candidate Profile",
        request.current_role or "Senior Specialist",
        request.company_name,
        request.target_role,
        request.job_description or "",
        request.cv_text or "",
        request.tone or "professional"
    )
    return {
        "status": "success",
        "data": result
    }
