import re
from typing import List, Dict, Any

class AchievementAnalyzer:
    @staticmethod
    def analyze_achievements(experience_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        total_bullets = 0
        quantified_bullets = 0
        metrics_found = []

        for exp in experience_list:
            for bullet in exp.get("bullets", []):
                total_bullets += 1
                # Detect %, $, x multiplier, M/k scale, users, or time savings
                matches = re.findall(r"(\d+(?:\.\d+)?%|\$\d+[\d,]*|\b\d+M\b|\b\d+k\b|\b\d+\s*x\b|\b\d+\s*users\b|\b\d+\s*hours\b)", bullet, re.IGNORECASE)
                if matches:
                    quantified_bullets += 1
                    metrics_found.extend(matches)

        quantified_ratio = (quantified_bullets / max(1, total_bullets)) * 100

        return {
            "totalBullets": total_bullets,
            "quantifiedBullets": quantified_bullets,
            "quantifiedRatio": round(quantified_ratio, 1),
            "metricsFound": metrics_found,
            "achievementScore": min(100, int(quantified_ratio * 1.25))
        }
