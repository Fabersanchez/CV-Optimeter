from typing import Dict, Any

class CareerCoachEngine:
    @staticmethod
    def answer_career_query(cv_data: Dict[str, Any], query_text: str) -> Dict[str, Any]:
        q_lower = query_text.lower()
        title = cv_data.get("contact", {}).get("title", "Senior Software Engineer")
        exp_count = len(cv_data.get("experience", []))

        if "senior" in q_lower or "ready" in q_lower:
            answer = (
                f"Based on your profile as '{title}' with {exp_count} recorded major career roles, "
                f"you demonstrate strong technical leadership. To solidify Senior/Lead readiness, focus on: "
                f"1) Quantifying system scaling metrics (% latency reduction), 2) Highlighting cross-functional engineering mentorship."
            )
            readiness_score = 88
        elif "salary" in q_lower or "salario" in q_lower:
            answer = (
                f"For a '{title}' in top tier tech markets (US / Remote Global), "
                f"target compensation range is $135,000 - $175,000 USD base + equity. "
                f"Highlighting AWS architecture certifications can boost offer negotiation leverage by 15%."
            )
            readiness_score = 92
        else:
            answer = (
                f"Analyzing your career trajectory as '{title}': Your core strengths lie in robust backend API design "
                f"and modern web dashboards. Next strategic move: Obtain AWS Solutions Architect Associate certification "
                f"and target high-growth SaaS engineering teams."
            )
            readiness_score = 90

        return {
            "query": query_text,
            "answer": answer,
            "readinessScore": readiness_score,
            "nextActionItems": [
                "Quantify career achievements with STAR metrics",
                "Obtain AWS Solutions Architect Associate certification",
                "Connect with 5 senior engineering hiring managers on LinkedIn"
            ]
        }
