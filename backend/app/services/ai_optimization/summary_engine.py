from typing import Dict, Any

class SummaryEngine:
    TONE_TEMPLATES = {
        "Executive": "Seasoned Executive Leader with 8+ years of experience steering high-impact technology initiatives, managing cross-functional engineering organizations, and driving enterprise digital transformation yielding 40%+ ROI.",
        "Corporate": "Results-oriented Professional specializing in enterprise system architecture, business process optimization, and scalable software delivery within Fortune 500 corporate environments.",
        "Technology": "High-throughput Senior Software Engineer & Systems Architect proficient in Python, TypeScript, React, Next.js, and cloud microservices. Proven track record scaling platforms to 2M+ daily requests.",
        "Academic": "Dedicated Researcher and Computer Science Specialist with focus on distributed algorithms, artificial intelligence, and formal system verification.",
        "Creative": "Innovative Product & Design Engineer blending technical architecture with modern UI/UX design systems to deliver world-class SaaS experiences.",
        "ATS Friendly": "Results-driven Senior Full Stack Engineer experienced in Python, React, Next.js, FastAPI, PostgreSQL, Docker, and AWS. Proven track record reducing system latency by 35% and accelerating release velocity."
    }

    @classmethod
    def generate_summary(cls, title: str = "Senior Engineer", tone: str = "Executive") -> str:
        return cls.TONE_TEMPLATES.get(tone, cls.TONE_TEMPLATES["Executive"])
