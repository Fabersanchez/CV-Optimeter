from typing import Dict, Any, List

class InterviewSimulatorEngine:
    MOCK_QUESTIONS = {
        "Technical": [
            "How do you design a real-time data streaming pipeline handling 2M+ daily requests in FastAPI and Redis?",
            "Explain how you handle database connection pooling and query optimization in PostgreSQL under high load."
        ],
        "HR": [
            "Tell me about a time you had to resolve a technical disagreement with a team member.",
            "Why are you interested in transitioning to our senior engineering team?"
        ],
        "Management": [
            "How do you mentor junior developers while ensuring tight product sprint deadlines are met?",
            "Describe your strategy for technical debt management during rapid SaaS feature rollouts."
        ]
    }

    @classmethod
    def start_mock_session(cls, category: str = "Technical") -> Dict[str, Any]:
        questions = cls.MOCK_QUESTIONS.get(category, cls.MOCK_QUESTIONS["Technical"])
        return {
            "category": category,
            "totalQuestions": len(questions),
            "questions": questions,
            "instructions": "Answer using the STAR method (Situation, Task, Action, Result)."
        }

    @classmethod
    def evaluate_response(cls, question: str, user_response: str) -> Dict[str, Any]:
        resp_len = len(user_response.split())
        has_star = any(w in user_response.lower() for w in ["result", "metrics", "%", "increased", "reduced", "led", "architected"])

        clarity_score = min(100, resp_len * 2) if resp_len >= 30 else 60
        confidence_score = 92 if has_star else 70

        return {
            "question": question,
            "clarityScore": clarity_score,
            "confidenceScore": confidence_score,
            "starMethodologyUsed": has_star,
            "feedback": "Strong technical articulation. Adding specific percentage ROI metrics will elevate your answer to executive caliber."
        }
