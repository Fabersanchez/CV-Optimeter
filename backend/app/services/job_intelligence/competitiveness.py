from typing import Dict, Any

class CompetitivenessEngine:
    @staticmethod
    def evaluate_readiness(overall_match: int) -> Dict[str, Any]:
        if overall_match >= 85:
            level = "HIGHLY_COMPETITIVE"
            label = "Altamente Competitivo"
            color = "emerald"
        elif overall_match >= 70:
            level = "READY_TO_APPLY"
            label = "Listo para Aplicar"
            color = "sky"
        elif overall_match >= 55:
            level = "PARTIALLY_READY"
            label = "Parcialmente Listo"
            color = "amber"
        else:
            level = "NOT_READY"
            label = "No Listo"
            color = "rose"

        return {
            "readinessLevel": level,
            "readinessLabel": label,
            "badgeColor": color,
            "strengths": ["Strong technical foundation", "Quantified experience metrics"],
            "weaknesses": ["Missing 2 target keywords from job description"],
            "risks": ["ATS keyword index ratio below 80% if un-optimized"]
        }
