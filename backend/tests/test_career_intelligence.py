import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.career_intelligence.career_coach_engine import CareerCoachEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.career_intelligence.cover_letter_engine import CoverLetterEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.career_intelligence.linkedin_optimizer import LinkedInOptimizerEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.career_intelligence.interview_simulator import InterviewSimulatorEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.career_intelligence.career_roadmap_engine import CareerRoadmapEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.career_intelligence.networking_assistant import NetworkingAssistantEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.career_intelligence.application_tracker import ApplicationTrackerEngine  # type: ignore # pyrefly: ignore [missing-import]

def test_career_intelligence_suite():
    sample_cv = {
        "id": "cv-career-01",
        "contact": {
            "name": "Alex Morgan",
            "title": "Senior Full Stack & AI Systems Architect",
            "email": "alex.morgan@devmail.io"
        },
        "summary": "Senior engineer building scalable web platforms.",
        "experience": [
            {
                "id": "exp-1",
                "company": "TechPulse",
                "role": "Senior Developer",
                "bullets": ["Led development of microservices in FastAPI."]
            }
        ]
    }

    print("--- 1. Testing AI Career Coach Engine ---")
    coach_res = CareerCoachEngine.answer_career_query(sample_cv, "Am I ready for a Senior Architect position?")
    assert coach_res["readinessScore"] >= 80
    print(f"[OK] Career Coach Answered Query (Readiness Score: {coach_res['readinessScore']})")

    print("\n--- 2. Testing Cover Letter Engine ---")
    letter = CoverLetterEngine.generate_cover_letter(sample_cv, company_name="MetaScale", job_title="Staff Architect")
    assert "MetaScale" in letter["coverLetterText"]
    print(f"[OK] Cover Letter Generated for {letter['company']}")

    print("\n--- 3. Testing LinkedIn Optimizer Engine ---")
    li = LinkedInOptimizerEngine.optimize_linkedin_profile(sample_cv)
    assert li["linkedinScore"] >= 90
    print(f"[OK] LinkedIn Score: {li['linkedinScore']}/100 with {len(li['headlineOptions'])} Headlines")

    print("\n--- 4. Testing Dynamic Interview Simulator ---")
    mock = InterviewSimulatorEngine.start_mock_session("Technical")
    eval_resp = InterviewSimulatorEngine.evaluate_response(mock["questions"][0], "I architected the database schema using Redis caching resulting in 35% latency drop.")
    assert eval_resp["starMethodologyUsed"] is True
    print(f"[OK] Interview Feedback: STAR Methodology Used = {eval_resp['starMethodologyUsed']}")

    print("\n--- 5. Testing Career Growth Roadmap Engine ---")
    roadmap = CareerRoadmapEngine.generate_career_roadmap("Staff Software Architect")
    assert len(roadmap["phases"]) == 3
    print(f"[OK] Career Growth Roadmap Generated ({len(roadmap['phases'])} Phases)")

    print("\n--- 6. Testing Networking Assistant & Application Tracker ---")
    outreach = NetworkingAssistantEngine.generate_outreach_message("Engineering Manager", "MetaScale")
    assert "MetaScale" in outreach["outreachMessage"]
    
    tracker = ApplicationTrackerEngine()
    pipeline = tracker.get_pipeline()
    assert len(pipeline) >= 2
    print(f"[OK] Application Tracker Pipeline Managed ({len(pipeline)} Applications)")

    print("\n[OK] ALL CAREER INTELLIGENCE PLATFORM TESTS PASSED 100%!")

if __name__ == "__main__":
    test_career_intelligence_suite()
