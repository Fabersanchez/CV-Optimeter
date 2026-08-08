from fastapi import APIRouter
from typing import Dict, Any
from app.services.career_intelligence.career_coach_engine import CareerCoachEngine
from app.services.career_intelligence.cover_letter_engine import CoverLetterEngine
from app.services.career_intelligence.linkedin_optimizer import LinkedInOptimizerEngine
from app.services.career_intelligence.interview_simulator import InterviewSimulatorEngine
from app.services.career_intelligence.career_roadmap_engine import CareerRoadmapEngine
from app.services.career_intelligence.networking_assistant import NetworkingAssistantEngine
from app.services.career_intelligence.application_tracker import ApplicationTrackerEngine

router = APIRouter(prefix="/api/v1/career", tags=["Career Intelligence Platform"])
tracker_service = ApplicationTrackerEngine()

@router.post("/coach")
async def career_coach_endpoint(cv_data: Dict[str, Any], query_text: str):
    """Profile-grounded AI Career Coach Q&A advisor."""
    return CareerCoachEngine.answer_career_query(cv_data, query_text)

@router.post("/cover-letter")
async def cover_letter_endpoint(cv_data: Dict[str, Any], company_name: str = "Target Company", job_title: str = "Senior Engineer", tone: str = "Corporate"):
    """Generates custom cover letter across multiple tones."""
    return CoverLetterEngine.generate_cover_letter(cv_data, company_name=company_name, job_title=job_title, tone=tone)

@router.post("/linkedin")
async def linkedin_endpoint(cv_data: Dict[str, Any]):
    """Generates LinkedIn headlines, About summary, and LinkedIn Score."""
    return LinkedInOptimizerEngine.optimize_linkedin_profile(cv_data)

@router.post("/interview-simulate")
async def interview_simulate_endpoint(category: str = "Technical"):
    """Starts dynamic mock interview simulation session."""
    return InterviewSimulatorEngine.start_mock_session(category=category)

@router.post("/interview-evaluate")
async def interview_evaluate_endpoint(question: str, user_response: str):
    """Evaluates candidate mock interview response using STAR framework."""
    return InterviewSimulatorEngine.evaluate_response(question, user_response)

@router.post("/roadmap")
async def roadmap_endpoint(target_role: str = "Staff Software Architect", timeline_months: int = 12):
    """Generates 12-24 month career growth roadmap with milestones."""
    return CareerRoadmapEngine.generate_career_roadmap(target_role=target_role, timeline_months=timeline_months)

@router.post("/networking")
async def networking_endpoint(recipient_role: str = "Engineering Recruiter", company_name: str = "MetaScale Systems", candidate_title: str = "Senior Engineer"):
    """Generates personalized networking outreach message."""
    return NetworkingAssistantEngine.generate_outreach_message(recipient_role=recipient_role, company_name=company_name, candidate_title=candidate_title)

@router.get("/tracker")
async def get_tracker_pipeline():
    """Retrieves current job application pipeline."""
    return tracker_service.get_pipeline()

@router.post("/tracker")
async def add_tracker_application(company: str, role: str, status: str = "APPLIED"):
    """Adds new job application to pipeline tracker."""
    return tracker_service.add_application(company, role, status=status)
