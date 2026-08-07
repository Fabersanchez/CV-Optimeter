import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.ats_x.ats_scoring_engine import ATSScoringEngine
from app.services.ats_x.keyword_intelligence import KeywordIntelligenceEngine
from app.services.ats_x.achievement_analyzer import AchievementAnalyzer
from app.services.ats_x.ats_simulator import ATSSimulatorEngine
from app.services.ats_x.ai_recommendation_engine import AIRecommendationEngine
from app.services.ats_x.report_generator import ReportGeneratorEngine

def test_ats_x_suite():
    sample_cv = {
        "id": "cv-test-01",
        "title": "Senior Engineer Resume",
        "contact": {
            "name": "Alex Morgan",
            "title": "Senior Software Architect",
            "email": "alex.morgan@devmail.io",
            "phone": "+1 (555) 234-5678",
            "location": "San Francisco, CA",
            "linkedin": "https://linkedin.com/in/alex-morgan",
            "github": "https://github.com/alex-morgan"
        },
        "summary": "Results-driven Senior Software Engineer with 6+ years of experience architecting high-throughput microservices, real-time web applications, and AI platforms.",
        "experience": [
            {
                "id": "exp-1",
                "company": "TechPulse",
                "role": "Senior Full Stack Developer",
                "startDate": "2023",
                "endDate": "Present",
                "bullets": [
                    "Architected scalable real-time pipeline using FastAPI and Redis, handling 2M+ daily requests with 99.99% uptime.",
                    "Improved core web vitals and reduced latency by 35%."
                ]
            }
        ],
        "education": [
            {
                "id": "edu-1",
                "institution": "UC Berkeley",
                "degree": "B.S. Computer Science",
                "startDate": "2016",
                "endDate": "2020"
            }
        ],
        "skillGroups": [
            {
                "id": "sg-1",
                "category": "Languages & Frameworks",
                "skills": ["Python", "TypeScript", "React", "Next.js", "FastAPI", "PostgreSQL", "Docker", "AWS", "Git"]
            }
        ]
    }

    print("--- 1. Testing 12-Dimension ATSScoringEngine ---")
    eval_result = ATSScoringEngine.evaluate_cv_ats_x(sample_cv)
    print(f"DEBUG: overallScore={eval_result['overallScore']}")
    assert eval_result["overallScore"] >= 60
    assert len(eval_result["dimensions"]) == 12
    print(f"[OK] Overall ATS-X Score: {eval_result['overallScore']}/100 across 12 dimensions")

    print("\n--- 2. Testing ATS Simulator Profiles ---")
    sims = eval_result["simulations"]
    assert "taleo" in sims and "workday" in sims and "greenhouse" in sims and "lever" in sims
    print(f"[OK] Taleo Status: {sims['taleo']['status']}, Workday Score: {sims['workday']['score']}")

    print("\n--- 3. Testing Keyword Intelligence Engine ---")
    kw = KeywordIntelligenceEngine.analyze_keywords(sample_cv["summary"])
    assert "python" in kw["missingRecommendedKeywords"] or kw["keywordDensityScore"] > 0
    print(f"[OK] Keyword Density Score: {kw['keywordDensityScore']}")

    print("\n--- 4. Testing Achievement Analyzer ---")
    ach = AchievementAnalyzer.analyze_achievements(sample_cv["experience"])
    assert ach["quantifiedBullets"] > 0
    print(f"[OK] Quantified Ratio: {ach['quantifiedRatio']}%")

    print("\n--- 5. Testing AI Recommendation Engine & Executive Report ---")
    recs = AIRecommendationEngine.generate_recommendations(sample_cv, eval_result)
    report = ReportGeneratorEngine.generate_audit_report(sample_cv, eval_result, recs)
    assert report["overallScore"] == eval_result["overallScore"]
    print(f"[OK] Executive Report Generated for Candidate: {report['candidateName']}")

    print("\n[OK] ALL ATS-X INTELLIGENCE ENGINE TESTS PASSED 100%!")

if __name__ == "__main__":
    test_ats_x_suite()
