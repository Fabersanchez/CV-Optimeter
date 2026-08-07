from typing import Dict, Any, List

class ResumeDNAEngine:
    def __init__(self):
        self.dna_profile = {
            "candidateId": "cv-001",
            "preferredTone": "Executive",
            "favoriteTemplates": ["ats-professional", "technology"],
            "targetIndustry": "Technology / SaaS",
            "seniorityLevel": "Senior / Lead",
            "acceptedImprovementsCount": 0,
            "rejectedImprovementsCount": 0,
            "customPowerKeywords": ["Architecture", "System Scaling", "High Throughput"]
        }

    def update_dna(self, action: str, item_data: Dict[str, Any]) -> Dict[str, Any]:
        if action == "accept_improvement":
            self.dna_profile["acceptedImprovementsCount"] += 1
        elif action == "reject_improvement":
            self.dna_profile["rejectedImprovementsCount"] += 1
        elif action == "set_tone":
            self.dna_profile["preferredTone"] = item_data.get("tone", "Executive")
        return self.dna_profile

    def get_dna_profile(self) -> Dict[str, Any]:
        return self.dna_profile
