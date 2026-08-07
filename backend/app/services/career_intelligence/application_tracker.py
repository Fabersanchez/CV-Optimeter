from typing import List, Dict, Any

class ApplicationTrackerEngine:
    def __init__(self):
        self.applications: List[Dict[str, Any]] = [
            {
                "id": "app-01",
                "company": "TechPulse Innovations",
                "role": "Senior Full Stack Developer",
                "status": "INTERVIEWING",
                "appliedDate": "2026-08-01",
                "nextStep": "Technical Architecture Screen"
            },
            {
                "id": "app-02",
                "company": "CloudScale Systems",
                "role": "Software Architect",
                "status": "APPLIED",
                "appliedDate": "2026-08-05",
                "nextStep": "Awaiting Recruiter Review"
            }
        ]

    def add_application(self, company: str, role: str, status: str = "APPLIED") -> Dict[str, Any]:
        new_app = {
            "id": f"app-{len(self.applications) + 1:02d}",
            "company": company,
            "role": role,
            "status": status,
            "appliedDate": "2026-08-07",
            "nextStep": "Follow up with hiring manager"
        }
        self.applications.append(new_app)
        return new_app

    def get_pipeline(self) -> List[Dict[str, Any]]:
        return self.applications
