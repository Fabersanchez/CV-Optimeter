from typing import Dict, Any

class AnalyticsEngine:
    @staticmethod
    def get_dashboard_metrics() -> Dict[str, Any]:
        return {
            "atsScore": 98,
            "visualScore": 96,
            "professionalScore": 94,
            "completenessScore": 98,
            "interviewReadiness": 92,
            "linkedinScore": 96,
            "portfolioScore": 90,
            "careerScore": 95,
            "radarDimensions": [
                {"subject": "ATS Optimization", "score": 98, "fullMark": 100},
                {"subject": "Visual Design", "score": 96, "fullMark": 100},
                {"subject": "STAR Metrics", "score": 95, "fullMark": 100},
                {"subject": "Technical Stack", "score": 94, "fullMark": 100},
                {"subject": "Interview Readiness", "score": 92, "fullMark": 100},
                {"subject": "LinkedIn Brand", "score": 96, "fullMark": 100}
            ]
        }
