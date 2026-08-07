from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.services.ats_engine import ATSEngineService
from app.services.job_matcher import JobMatcherService

router = APIRouter()

class AnalyzeCVRequest(BaseModel):
    parsed_cv: Dict[str, Any]
    target_job_description: Optional[str] = ""

class MatchJobRequest(BaseModel):
    cv_text: str
    job_description: str

@router.post("/analyze")
async def analyze_ats(request: AnalyzeCVRequest):
    """Calculates comprehensive ATS Score (0-100), issue diagnostics, and actionable recommendations."""
    if not request.parsed_cv:
        raise HTTPException(status_code=400, detail="Missing parsed CV data.")
    
    result = ATSEngineService.analyze_resume(request.parsed_cv, request.target_job_description or "")
    return {
        "status": "success",
        "analysis": result
    }

@router.post("/match-job")
async def match_job(request: MatchJobRequest):
    """Compares CV content against a Job Description to calculate match % and keyword gaps."""
    if not request.cv_text or not request.job_description:
        raise HTTPException(status_code=400, detail="Both CV text and Job Description are required.")
    
    match_result = JobMatcherService.match_cv_to_job(request.cv_text, request.job_description)
    return {
        "status": "success",
        "match": match_result
    }
