from typing import List, Dict, Any

class AIRecommendationEngine:
    @staticmethod
    def generate_recommendations(cv_data: Dict[str, Any], evaluation: Dict[str, Any]) -> List[Dict[str, Any]]:
        recommendations = []

        # Check contact
        contact = cv_data.get("contact", {})
        if not contact.get("linkedin"):
            recommendations.append({
                "id": "rec-01",
                "title": "Add LinkedIn Custom Profile URL",
                "reason": "Recruiters and Lever/Greenhouse ATS index custom social URLs.",
                "expectedImpact": "+5% Visual Impact & Trust",
                "atsLift": 5,
                "priority": "HIGH",
                "estimatedEffort": "2 mins",
                "difficulty": "Easy",
                "actionType": "update_contact"
            })

        # Check STAR metrics
        ach = evaluation.get("achievementAnalysis", {})
        if ach.get("quantifiedRatio", 0) < 50:
            recommendations.append({
                "id": "rec-02",
                "title": "Quantify Work Experience Achievements (STAR)",
                "reason": "Only " + str(ach.get("quantifiedRatio", 0)) + "% of bullet points contain metrics (% or $).",
                "expectedImpact": "+15% ATS Match & Executive Readiness",
                "atsLift": 15,
                "priority": "CRITICAL",
                "estimatedEffort": "5 mins",
                "difficulty": "Medium",
                "actionType": "apply_star_metrics"
            })

        # Check Skill Matrix Density
        kw = evaluation.get("keywordAnalysis", {})
        if len(kw.get("hardSkillsFound", [])) < 8:
            recommendations.append({
                "id": "rec-03",
                "title": "Expand Hard Skills Matrix",
                "reason": "Missing key industry frameworks: " + ", ".join(kw.get("missingRecommendedKeywords", [])[:3]),
                "expectedImpact": "+10% ATS Keyword Filtering",
                "atsLift": 10,
                "priority": "HIGH",
                "estimatedEffort": "3 mins",
                "difficulty": "Easy",
                "actionType": "add_hard_skills"
            })

        return recommendations
