from fastapi import APIRouter
from typing import Dict, Any, Optional
from ..services.job_intelligence.job_parser import JobParserEngine
from ..services.job_intelligence.semantic_match import SemanticMatchEngine
from ..services.job_intelligence.competitiveness import CompetitivenessEngine
from ..services.job_intelligence.roadmap_generator import RoadmapGeneratorEngine
from ..services.job_intelligence.vacancy_optimizer import VacancyOptimizerEngine

router = APIRouter(prefix="/api/v1/job-intelligence", tags=["Job Intelligence Platform"])

@router.post("/parse-job")
async def parse_job_endpoint(job_text: str, source_url: str = ""):
    """Parses job offer description text or URL into structured requirements."""
    return JobParserEngine.parse_job_description(job_text, source_url=source_url)

@router.post("/match")
async def match_job_endpoint(cv_data: Dict[str, Any], job_data: Dict[str, Any]):
    """Runs semantic matching, skills gap detection, application readiness, and roadmap generation."""
    match = SemanticMatchEngine.match_cv_to_job(cv_data, job_data)
    readiness = CompetitivenessEngine.evaluate_readiness(match["overallMatch"])
    roadmap = RoadmapGeneratorEngine.generate_roadmap(match, match["skillsGap"]["missingSkills"])

    return {
        "match": match,
        "readiness": readiness,
        "roadmap": roadmap
    }

@router.post("/optimize-for-job")
async def optimize_for_job_endpoint(cv_data: Dict[str, Any], job_data: Dict[str, Any]):
    """Tailors CV for specific job vacancy in 1 click."""
    return VacancyOptimizerEngine.optimize_cv_for_job(cv_data, job_data)
