from typing import Dict, Any, List

class LinkedInOptimizerService:
    """Optimizes LinkedIn profile assets (Headlines, About Section, Featured Skills)."""

    @classmethod
    def optimize_profile(cls, cv_summary: str, target_role: str, extracted_skills: List[str]) -> Dict[str, Any]:
        role = target_role if target_role else "Senior Specialist & Industry Leader"
        top_skills = extracted_skills[:6] if extracted_skills else ["Strategic Planning", "Project Management", "Leadership", "System Architecture"]

        headline_1 = f"🚀 {role} | Transforming Operations & Driving Scalable Growth | { ' • '.join(top_skills[:3]) }"
        headline_2 = f"{role} | Ex-Tech Lead | Specializing in {top_skills[0] if top_skills else 'Innovation'} & High-Impact Delivery"
        headline_3 = f"Helping Companies Scale with {top_skills[0] if top_skills else 'Data-Driven Strategy'} & {top_skills[1] if len(top_skills)>1 else 'Leadership'} | {role}"

        about_section = f"""I am a passionate {role} with over 6+ years of experience spearheading technology and business initiatives. My mission is to build robust, scalable systems that turn complex challenges into competitive advantages.

💡 Core Expertise:
• {', '.join(top_skills[:4])}
• Cross-functional Team Leadership & Agile Execution
• Quantifiable Business & Process Optimization

📈 Impact Highlights:
- Led high-priority projects delivering multi-million dollar growth and 30%+ efficiency gains.
- Mentored technical teams and established high-performing development cultures.

📫 Let's Connect: Open to strategic leadership roles, advisory positions, and high-growth opportunities."""

        return {
            "headlines": [
                {"type": "Executive & Impact-Focused", "text": headline_1},
                {"type": "Role & Specialty Centric", "text": headline_2},
                {"type": "Value Proposition Centric", "text": headline_3}
            ],
            "about_section": about_section,
            "top_skills_to_feature": top_skills + ["Cross-Functional Collaboration", "KPI Optimization"]
        }
