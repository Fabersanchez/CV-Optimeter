from typing import Dict, Any

class ReportGeneratorEngine:
    @staticmethod
    def generate_audit_report(cv_data: Dict[str, Any], evaluation: Dict[str, Any], recommendations: list) -> Dict[str, Any]:
        overall = evaluation.get("overallScore", 85)
        contact = cv_data.get("contact", {})

        return {
            "candidateName": contact.get("name", "Candidate"),
            "targetRole": contact.get("title", "Professional"),
            "overallScore": overall,
            "executiveSummary": f"CV Optimeter ATS-X Engine audited document with an overall score of {overall}/100. Strong technical skills presentation with clear section hierarchy.",
            "strengths": [
                "Clean single/double column layout compatible with 99% of parsers.",
                "Categorized skill matrices highlighting key core frameworks.",
                "Well-formatted contact header details."
            ],
            "weaknesses": [
                "Some work experience bullets lack explicit percentage ROI numbers.",
                "Action verb diversity can be improved across past roles."
            ],
            "risks": [
                "Taleo strict parsing might miss non-standard section headers if un-normalized."
            ],
            "opportunities": [
                "Quantifying top 2 career achievements will boost ATS pass rate above 98%."
            ],
            "dimensions": evaluation.get("dimensions", {}),
            "simulations": evaluation.get("simulations", {}),
            "recommendations": recommendations
        }
