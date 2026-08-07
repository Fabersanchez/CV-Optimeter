import re
from typing import Dict, List, Any

HARD_SKILLS_KEYWORDS = [
    "python", "typescript", "javascript", "react", "next.js", "fastapi", "node.js",
    "postgresql", "redis", "docker", "kubernetes", "aws", "git", "ci/cd", "rest api",
    "graphql", "microservices", "sql", "html5", "css3", "tailwind", "pytest", "redux"
]

ACTION_VERBS = [
    "architected", "spearheaded", "engineered", "developed", "scaled", "led", "mentored",
    "optimized", "increased", "reduced", "delivered", "built", "implemented", "designed"
]

WEAK_WORDS = [
    "responsible for", "helped with", "worked on", "handled", "assisted", "participated in"
]

class KeywordIntelligenceEngine:
    @staticmethod
    def analyze_keywords(text_content: str, job_offer_keywords: List[str] = None) -> Dict[str, Any]:
        text_lower = text_content.lower()

        found_hard_skills = [skill for skill in HARD_SKILLS_KEYWORDS if skill in text_lower]
        found_action_verbs = [verb for verb in ACTION_VERBS if verb in text_lower]
        found_weak_words = [weak for weak in WEAK_WORDS if weak in text_lower]

        missing_recommended = [skill for skill in HARD_SKILLS_KEYWORDS if skill not in text_lower][:5]

        return {
            "hardSkillsFound": found_hard_skills,
            "actionVerbsCount": len(found_action_verbs),
            "actionVerbsFound": found_action_verbs,
            "weakWordsFound": found_weak_words,
            "missingRecommendedKeywords": missing_recommended,
            "keywordDensityScore": min(100, len(found_hard_skills) * 12 + len(found_action_verbs) * 8)
        }
