from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAIProvider(ABC):
    @abstractmethod
    def optimize_text(self, text: str, prompt_instruction: str) -> str:
        pass

    @abstractmethod
    def rewrite_experience_star(self, role: str, company: str, bullets: List[str]) -> List[str]:
        pass

    @abstractmethod
    def generate_summary(self, title: str, experience_summary: str, tone: str = "Executive") -> str:
        pass
