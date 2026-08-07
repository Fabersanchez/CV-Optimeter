from typing import Dict, Any

class ATSSimulatorEngine:
    PROFILES = {
        "taleo": {
            "name": "Oracle Taleo Enterprise",
            "strictHeaderParsing": True,
            "keywordWeight": 0.45,
            "formattingPenalty": 0.20,
            "description": "Enterprise ATS with strict single-column header parsing and keyword frequency indexing."
        },
        "workday": {
            "name": "Workday Recruiting",
            "strictHeaderParsing": True,
            "keywordWeight": 0.40,
            "formattingPenalty": 0.15,
            "description": "Widely used corporate ATS prioritizing exact section title matches and experience duration."
        },
        "greenhouse": {
            "name": "Greenhouse Software",
            "strictHeaderParsing": False,
            "keywordWeight": 0.30,
            "formattingPenalty": 0.05,
            "description": "Modern tech-focused ATS favoring clean visual layout, project links, and quantifiable achievements."
        },
        "lever": {
            "name": "Lever Hire",
            "strictHeaderParsing": False,
            "keywordWeight": 0.30,
            "formattingPenalty": 0.05,
            "description": "SaaS talent platform highlighting skill badges and GitHub/LinkedIn social profiles."
        },
        "icims": {
            "name": "iCIMS Talent Cloud",
            "strictHeaderParsing": True,
            "keywordWeight": 0.40,
            "formattingPenalty": 0.20,
            "description": "High-volume ATS with strict document parsing and certification verification."
        }
    }

    @classmethod
    def simulate_all_ats(cls, cv_data: Dict[str, Any], base_ats_score: int) -> Dict[str, Any]:
        results = {}
        for key, profile in cls.PROFILES.items():
            penalty = 0
            if profile["strictHeaderParsing"] and len(cv_data.get("experience", [])) < 1:
                penalty += 15

            simulated_score = max(40, min(100, int(base_ats_score - penalty)))
            results[key] = {
                "name": profile["name"],
                "score": simulated_score,
                "status": "PASS" if simulated_score >= 80 else "REVIEW" if simulated_score >= 65 else "FAIL",
                "description": profile["description"]
            }
        return results
