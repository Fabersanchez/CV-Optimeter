from fastapi import APIRouter
from typing import Dict, Any
from app.services.intelligence_platform.analytics_engine import AnalyticsEngine
from app.services.intelligence_platform.resume_dna_engine import ResumeDNAEngine
from app.services.intelligence_platform.career_evolution_engine import CareerEvolutionEngine
from app.services.intelligence_platform.benchmark_engine import BenchmarkEngine
from app.services.intelligence_platform.goals_engine import GoalsEngine
from app.services.intelligence_platform.notification_engine import NotificationEngine
from app.services.intelligence_platform.insights_engine import RecruiterInsightsEngine

router = APIRouter(prefix="/api/v1/intelligence", tags=["Intelligence Platform & Analytics"])
goals_service = GoalsEngine()

@router.get("/dashboard")
async def get_dashboard_metrics():
    """Retrieves Executive Analytics Dashboard metrics and radar dimensions."""
    return AnalyticsEngine.get_dashboard_metrics()

@router.post("/resume-dna")
async def get_resume_dna(cv_data: Dict[str, Any]):
    """Retrieves Candidate Resume DNA Profile."""
    return ResumeDNAEngine.get_permanent_dna(cv_data)

@router.get("/career-evolution")
async def get_career_evolution():
    """Retrieves Career Evolution Trajectory across revisions."""
    return CareerEvolutionEngine.get_career_trajectory()

@router.get("/benchmark")
async def get_peer_benchmark(target_role: str = "Senior Full Stack Engineer"):
    """Retrieves Peer Benchmark comparison metrics."""
    return BenchmarkEngine.evaluate_peer_benchmark(target_role=target_role)

@router.get("/goals")
async def get_goals():
    """Retrieves career goals list."""
    return goals_service.get_goals()

@router.post("/goals")
async def add_goal(title: str, priority: str = "HIGH", target_date: str = "2026-09-30"):
    """Adds a new career goal to progress tracker."""
    return goals_service.add_goal(title, priority=priority, target_date=target_date)

@router.get("/notifications")
async def get_notifications():
    """Retrieves smart notification reminders."""
    return NotificationEngine.get_smart_notifications()

@router.get("/insights")
async def get_recruiter_insights():
    """Retrieves executive strengths, weaknesses, and recruiter insights."""
    return RecruiterInsightsEngine.get_recruiter_insights()
