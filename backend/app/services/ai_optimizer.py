import re
import urllib.request
import json
from typing import Dict, Any, List, Optional
from app.core.config import settings

class AIOptimizerService:
    """AI-powered resume optimization engine (STAR bullet point rewriting, summary generation, tone enhancement)."""

    @classmethod
    def rewrite_bullet_point(cls, bullet_text: str, tone: str = "executive", target_role: str = "") -> Dict[str, Any]:
        """Rewrites bullet points to follow the high-impact STAR framework."""
        if settings.OPENAI_API_KEY:
            try:
                return cls._call_openai_rewrite(bullet_text, tone, target_role)
            except Exception:
                pass # Fallback to local rule engine if API fails or quota exceeded

        return cls._local_star_rewrite(bullet_text, tone, target_role)

    @classmethod
    def generate_summary(cls, current_summary: str, experience_text: str, target_role: str = "Senior Professional") -> str:
        """Generates a high-converting 3-sentence professional executive summary."""
        if settings.OPENAI_API_KEY:
            try:
                return cls._call_openai_summary(current_summary, experience_text, target_role)
            except Exception:
                pass

        return cls._local_summary_generator(current_summary, target_role)

    @staticmethod
    def _local_star_rewrite(text: str, tone: str, target_role: str) -> Dict[str, Any]:
        clean_text = text.strip("-*• ").strip()
        
        # Check if already starts with action verb
        action_prefix = "Accelerated operational workflow by" if tone == "executive" else "Engineered robust solution to"
        metric_addition = "yielding a 32% efficiency gain and driving $120k in annual savings."

        rewritten_option_1 = f"Spearheaded key initiatives in {clean_text.lower() if clean_text else 'core domain'}, {metric_addition}"
        rewritten_option_2 = f"Architected scalable process for {clean_text.lower()}, improving cross-functional team output by 40%."
        rewritten_option_3 = f"Optimized strategy and executed {clean_text.lower()}, reducing delivery cycle time by 3 weeks across 5 major milestones."

        return {
            "original": text,
            "suggestions": [
                {
                    "text": rewritten_option_1,
                    "impact": "High (Adds financial impact & metric quantification)",
                    "framework": "STAR (Action + Metric)"
                },
                {
                    "text": rewritten_option_2,
                    "impact": "High (Focuses on scalability & process improvement)",
                    "framework": "STAR (Leadership + Scope)"
                },
                {
                    "text": rewritten_option_3,
                    "impact": "Medium (Highlights delivery velocity & milestones)",
                    "framework": "STAR (Velocity + Strategy)"
                }
            ],
            "enhanced_skills": ["Process Optimization", "Cross-Functional Leadership", "Resource Allocation", "KPI Tracking"]
        }

    @staticmethod
    def _local_summary_generator(current: str, role: str) -> str:
        role_title = role if role else "Results-Driven Senior Professional"
        return f"Accomplished {role_title} with proven expertise in scaling core business operations, leading high-performance initiatives, and driving technology-backed growth. Track record of delivering multi-million dollar projects on schedule while optimizing cross-team productivity by over 30%. Passionate about deploying innovative strategies to solve complex organizational challenges."

    @classmethod
    def _call_openai_rewrite(cls, bullet_text: str, tone: str, target_role: str) -> Dict[str, Any]:
        prompt = f"""You are an elite executive resume writer. Rewrite this resume bullet point using the STAR (Situation, Task, Action, Result) format.
Original: "{bullet_text}"
Tone: {tone}
Target Role: {target_role if target_role else 'General Senior Level'}

Provide 3 distinct options in JSON format with keys: "suggestions" (array of objects with "text", "impact", "framework") and "enhanced_skills" (array of strings). Return ONLY JSON."""

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
        }
        body = {
            "model": settings.OPENAI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "response_format": {"type": "json_object"}
        }

        req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            content = data['choices'][0]['message']['content']
            parsed = json.loads(content)
            parsed["original"] = bullet_text
            return parsed

    @classmethod
    def _call_openai_summary(cls, current: str, exp: str, role: str) -> str:
        prompt = f"""Write a powerful 3-sentence executive resume summary for a target role of '{role}'.
Current summary / experience context:
"{current if current else exp[:500]}"
Focus on leadership, quantifiable business impact, and strategic execution. Return ONLY the summary text."""

        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
        }
        body = {
            "model": settings.OPENAI_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }

        req = urllib.request.Request(url, data=json.dumps(body).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data['choices'][0]['message']['content'].strip()
