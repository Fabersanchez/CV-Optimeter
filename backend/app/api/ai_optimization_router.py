from fastapi import APIRouter
from typing import Dict, Any, Optional, List
from ..services.ai_optimization.resume_optimizer import ResumeOptimizerEngine
from ..services.ai_optimization.star_engine import STAREngine
from ..services.ai_optimization.summary_engine import SummaryEngine
from ..services.ai_optimization.resume_dna_engine import ResumeDNAEngine

router = APIRouter(prefix="/api/v1/ai-optimization", tags=["AI Optimization Engine"])
optimizer = ResumeOptimizerEngine()
star_engine = STAREngine()
dna_engine = ResumeDNAEngine()

@router.post("/optimize")
async def optimize_cv_endpoint(cv_data: Dict[str, Any], target_section: Optional[str] = None, tone: str = "Executive"):
    """Performs full or selective section optimization."""
    return optimizer.optimize_cv(cv_data, target_section=target_section, tone=tone)

@router.post("/rewrite-star")
async def rewrite_star_endpoint(role: str, company: str, bullets: List[str], methodology: str = "STAR"):
    """Rewrites work experience bullets using STAR, XYZ, CAR, or PAR methodology."""
    return star_engine.rewrite_bullets(role, company, bullets, methodology=methodology)

@router.post("/summary")
async def generate_summary_endpoint(title: str = "Senior Engineer", tone: str = "Executive"):
    """Generates a professional summary option for a specific tone."""
    return SummaryEngine.generate_summary(title=title, tone=tone)

@router.get("/resume-dna")
async def get_resume_dna():
    """Retrieves current candidate Resume DNA profile."""
    return dna_engine.get_dna_profile()
