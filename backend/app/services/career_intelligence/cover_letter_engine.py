from typing import Dict, Any

class CoverLetterEngine:
    @staticmethod
    def generate_cover_letter(cv_data: Dict[str, Any], company_name: str = "Target Company", job_title: str = "Senior Engineer", tone: str = "Corporate") -> Dict[str, Any]:
        c = cv_data.get("contact", {})
        candidate_name = c.get("name", "Alex Morgan")
        email = c.get("email", "alex.morgan@devmail.io")
        phone = c.get("phone", "+1 (555) 234-5678")

        letter_text = (
            f"Dear Hiring Manager at {company_name},\n\n"
            f"I am writing to express my strong interest in the {job_title} position. With over 6+ years of hands-on experience "
            f"architecting high-throughput microservices, real-time web applications, and SaaS platforms, I have built systems "
            f"that scale seamlessly to handle millions of daily events while maintaining 99.99% uptime.\n\n"
            f"At my recent engineering roles, I spearheaded key backend API optimizations that reduced latency by 35% and "
            f"accelerated team delivery velocity. What excites me most about {company_name} is your commitment to technical excellence "
            f"and product innovation.\n\n"
            f"I would welcome the opportunity to discuss how my technical expertise in Python, TypeScript, React, FastAPI, and AWS "
            f"can add immediate value to your engineering team.\n\n"
            f"Sincerely,\n"
            f"{candidate_name}\n"
            f"{email} | {phone}"
        )

        return {
            "company": company_name,
            "jobTitle": job_title,
            "tone": tone,
            "coverLetterText": letter_text
        }
