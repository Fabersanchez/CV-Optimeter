import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.intelligence_platform.resume_dna_engine import ResumeDNAEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.intelligence_platform.career_evolution_engine import CareerEvolutionEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.intelligence_platform.analytics_engine import AnalyticsEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.intelligence_platform.benchmark_engine import BenchmarkEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.intelligence_platform.goals_engine import GoalsEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.intelligence_platform.notification_engine import NotificationEngine  # type: ignore # pyrefly: ignore [missing-import]
from app.services.intelligence_platform.insights_engine import RecruiterInsightsEngine  # type: ignore # pyrefly: ignore [missing-import]

def test_intelligence_platform_suite():
    sample_cv = {
        "id": "cv-intel-01",
        "contact": {
            "name": "Alex Morgan",
            "title": "Senior Software Architect"
        },
        "skillGroups": [
            {
                "id": "sg-1",
                "skills": ["Python", "TypeScript", "React", "FastAPI", "AWS", "Redis", "Docker", "Kubernetes"]
            }
        ]
    }

    print("--- 1. Testing Resume DNA Engine ---")
    dna = ResumeDNAEngine.get_permanent_dna(sample_cv)
    assert dna["candidateName"] == "Alex Morgan"
    assert len(dna["topSkills"]) == 8
    print(f"[OK] Permanent Candidate DNA Generated for: {dna['candidateName']}")

    print("\n--- 2. Testing Career Evolution Engine ---")
    evo = CareerEvolutionEngine.get_career_trajectory()
    assert len(evo["evolutionTrajectory"]) == 3
    print(f"[OK] Career Trajectory Lift: {evo['totalAtsLift']}")

    print("\n--- 3. Testing Analytics Dashboard Engine ---")
    dash = AnalyticsEngine.get_dashboard_metrics()
    assert dash["atsScore"] == 98
    assert len(dash["radarDimensions"]) == 6
    print(f"[OK] Dashboard Metrics Aggregated: ATS={dash['atsScore']}, Visual={dash['visualScore']}")

    print("\n--- 4. Testing Peer Benchmark Engine ---")
    bench = BenchmarkEngine.evaluate_peer_benchmark("Senior Software Architect")
    assert bench["percentileRanking"] == "Top 8%"
    print(f"[OK] Peer Benchmark Percentile: {bench['percentileRanking']}")

    print("\n--- 5. Testing Goals & Smart Notification Engines ---")
    goals_svc = GoalsEngine()
    goals = goals_svc.get_goals()
    notifs = NotificationEngine.get_smart_notifications()
    assert len(goals) >= 3
    assert len(notifs) >= 2
    print(f"[OK] Goals & Smart Notifications Active ({len(goals)} Goals, {len(notifs)} Notifications)")

    print("\n--- 6. Testing Recruiter Insights Engine ---")
    insights = RecruiterInsightsEngine.get_recruiter_insights()
    assert len(insights["topStrengths"]) >= 3
    print(f"[OK] Recruiter Insights Generated ({len(insights['topStrengths'])} Strengths)")

    print("\n[OK] ALL INTELLIGENCE PLATFORM TESTS PASSED 100%!")

if __name__ == "__main__":
    test_intelligence_platform_suite()
