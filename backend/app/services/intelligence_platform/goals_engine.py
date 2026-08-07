from typing import List, Dict, Any

class GoalsEngine:
    def __init__(self):
        self.goals: List[Dict[str, Any]] = [
            {
                "id": "goal-01",
                "title": "Achieve 98/100 ATS Score",
                "progress": 100,
                "priority": "HIGH",
                "targetDate": "2026-08-01",
                "status": "COMPLETED",
                "impact": "+35% Interview Callback Rate"
            },
            {
                "id": "goal-02",
                "title": "Obtain AWS Solutions Architect Associate Certification",
                "progress": 60,
                "priority": "HIGH",
                "targetDate": "2026-09-30",
                "status": "IN_PROGRESS",
                "impact": "+15% Target Salary Offer Leverage"
            },
            {
                "id": "goal-03",
                "title": "Connect with 10 Senior Engineering Hiring Managers on LinkedIn",
                "progress": 40,
                "priority": "MEDIUM",
                "targetDate": "2026-08-31",
                "status": "IN_PROGRESS",
                "impact": "Direct Referral Pipelines"
            }
        ]

    def add_goal(self, title: str, priority: str = "HIGH", target_date: str = "2026-09-30") -> Dict[str, Any]:
        new_goal = {
            "id": f"goal-{len(self.goals) + 1:02d}",
            "title": title,
            "progress": 0,
            "priority": priority,
            "targetDate": target_date,
            "status": "IN_PROGRESS",
            "impact": "High Career Growth"
        }
        self.goals.append(new_goal)
        return new_goal

    def get_goals(self) -> List[Dict[str, Any]]:
        return self.goals
