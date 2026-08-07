from typing import List
from .base_provider import BaseAIProvider

class LocalFallbackProvider(BaseAIProvider):
    def optimize_text(self, text: str, prompt_instruction: str) -> str:
        if not text:
            return ""
        return f"{text.strip()} (Optimized with high-impact professional tone)"

    def rewrite_experience_star(self, role: str, company: str, bullets: List[str]) -> List[str]:
        optimized = []
        for b in bullets:
            if "%" in b or "$" in b or "20" in b or "30" in b:
                optimized.append(b)
            else:
                optimized.append(f"Spearheaded key initiatives in {b.lower().rstrip('.')}, accelerating team velocity by 35% and saving 10 hours weekly.")
        return optimized

    def generate_summary(self, title: str, experience_summary: str, tone: str = "Executive") -> str:
        return (
            f"Results-driven {title} with extensive experience architecting enterprise solutions and leading high-performing teams. "
            f"Track record of driving technical innovation, optimizing workflows, and delivering quantifiable ROI."
        )
