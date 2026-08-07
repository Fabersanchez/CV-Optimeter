from fastapi import APIRouter
from typing import Dict, Any, List, Optional
from ..services.ats_x.ats_scoring_engine import ATSScoringEngine
from ..services.ats_x.keyword_intelligence import KeywordIntelligenceEngine
from ..services.ats_x.achievement_analyzer import AchievementAnalyzer
from ..services.ats_x.ats_simulator import ATSSimulatorEngine
from ..services.ats_x.report_generator import ReportGeneratorEngine

router = APIRouter(prefix="/api/v1/ats-x", tags=["ATS-X Intelligence Engine"])

@router.post("/analyze")
async def analyze_ats_endpoint(cv_data: Dict[str, Any], job_keywords: Optional[List[str]] = None) -> Dict[str, Any]:
    """Runs 12-dimension ATS scoring, keyword intelligence, STAR achievement analysis, and ATS vendor simulations."""
    target_kw = job_keywords or []
    evaluation = ATSScoringEngine.evaluate_cv_ats_x(cv_data)
    
    summary = cv_data.get("summary", "")
    exp_list = cv_data.get("experience", [])
    full_text = f"{summary} {' '.join([exp.get('description', '') for exp in exp_list])}"
    
    keywords = KeywordIntelligenceEngine.analyze_keywords(full_text, job_offer_keywords=target_kw)
    star_analysis = AchievementAnalyzer.analyze_achievements(exp_list)
    simulations = ATSSimulatorEngine.simulate_all_ats(cv_data, evaluation["overallScore"])
    executive_report = ReportGeneratorEngine.generate_audit_report(cv_data, evaluation, [])

    return {
        "scoringBreakdown": evaluation,
        "keywordIntelligence": keywords,
        "starAchievementAnalysis": star_analysis,
        "vendorSimulations": simulations,
        "executiveReport": executive_report
    }
