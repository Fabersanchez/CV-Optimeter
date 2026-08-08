from app.services.job_intelligence.job_parser import JobParserEngine
from app.services.job_intelligence.semantic_match import SemanticMatchEngine
from app.services.job_intelligence.competitiveness import CompetitivenessEngine
from app.services.job_intelligence.roadmap_generator import RoadmapGeneratorEngine
from app.services.job_intelligence.vacancy_optimizer import VacancyOptimizerEngine

def test_job_intelligence_suite():
    sample_job_text = """
    Senior Full Stack Engineer
    MetaScale Systems Inc.
    Location: Remote (USA)
    Salary: $140,000 - $180,000 USD

    Requirements:
    - 5+ years of experience with Python, TypeScript, React, Next.js, FastAPI, PostgreSQL, Redis, and Docker.
    - Experience architecting microservices and scalable SaaS platforms.
    """

    sample_cv = {
        "id": "cv-job-01",
        "title": "Senior Engineer Resume",
        "contact": {
            "name": "Alex Morgan",
            "title": "Senior Software Architect",
            "email": "alex.morgan@devmail.io"
        },
        "summary": "Experienced engineer in web platforms.",
        "experience": [
            {
                "id": "exp-1",
                "company": "TechPulse",
                "role": "Senior Developer",
                "bullets": ["Architected microservices in Python and FastAPI handling 2M+ daily requests."]
            }
        ],
        "skillGroups": [
            {
                "id": "sg-1",
                "category": "Core Tech",
                "skills": ["Python", "TypeScript", "React", "FastAPI"]
            }
        ]
    }

    print("--- 1. Testing Job Parser Engine ---")
    parsed_job = JobParserEngine.parse_job_description(sample_job_text)
    assert parsed_job["roleTitle"] == "Senior Full Stack Engineer"
    assert "Python" in parsed_job["requiredSkills"]
    print(f"[OK] Job Description Parsed: {parsed_job['roleTitle']} @ {parsed_job['company']}")

    print("\n--- 2. Testing Semantic Match Engine & Skill Gap Detector ---")
    match_res = SemanticMatchEngine.match_cv_to_job(sample_cv, parsed_job)
    assert match_res["overallMatch"] >= 50
    assert len(match_res["skillsGap"]["fulfilledSkills"]) > 0
    print(f"[OK] Overall Match Score: {match_res['overallMatch']}%, Skills Covered: {len(match_res['skillsGap']['fulfilledSkills'])} items")

    print("\n--- 3. Testing Competitiveness & Application Readiness Engine ---")
    readiness = CompetitivenessEngine.evaluate_readiness(match_res["overallMatch"])
    assert readiness["readinessLevel"] in ["NOT_READY", "PARTIALLY_READY", "READY_TO_APPLY", "HIGHLY_COMPETITIVE"]
    print(f"[OK] Readiness Level: {readiness['readinessLabel']}")

    print("\n--- 4. Testing Actionable Roadmap Generator ---")
    roadmap = RoadmapGeneratorEngine.generate_roadmap(match_res, match_res["skillsGap"]["missingSkills"])
    assert len(roadmap) >= 2
    print(f"[OK] Generated Action Roadmap with {len(roadmap)} Prioritized Steps")

    print("\n--- 5. Testing 1-Click Vacancy Optimizer ---")
    tailored = VacancyOptimizerEngine.optimize_cv_for_job(sample_cv, parsed_job)
    assert "MetaScale Systems Inc." in tailored["summary"]
    print(f"[OK] CV Tailored for Vacancy @ {parsed_job['company']}")

    print("\n[OK] ALL JOB INTELLIGENCE PLATFORM TESTS PASSED 100%!")

if __name__ == "__main__":
    test_job_intelligence_suite()
