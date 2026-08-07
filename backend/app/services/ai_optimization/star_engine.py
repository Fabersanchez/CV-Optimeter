from typing import List, Dict, Any
from .providers.local_fallback import LocalFallbackProvider

class STAREngine:
    def __init__(self, provider=None):
        self.provider = provider or LocalFallbackProvider()

    def rewrite_bullets(self, role: str, company: str, bullets: List[str], methodology: str = "STAR") -> List[str]:
        if methodology.upper() == "XYZ":
            # XYZ formula: Accomplished [X], as measured by [Y], by doing [Z]
            return [
                f"Accomplished 35% performance growth in {b.lower().rstrip('.')}, as measured by daily automated telemetry, by implementing modular architecture."
                if "%" not in b else b
                for b in bullets
            ]
        elif methodology.upper() == "CAR":
            # CAR formula: Context, Action, Result
            return [
                f"In high-scale enterprise environment: Spearheaded implementation of {b.lower().rstrip('.')}, resulting in 40% efficiency gains."
                if "%" not in b else b
                for b in bullets
            ]
        elif methodology.upper() == "PAR":
            # PAR formula: Problem, Action, Result
            return [
                f"Resolved infrastructure latency bottleneck by re-engineering {b.lower().rstrip('.')}, driving 99.99% uptime."
                if "%" not in b else b
                for b in bullets
            ]
        
        # Default STAR methodology
        return self.provider.rewrite_experience_star(role, company, bullets)
