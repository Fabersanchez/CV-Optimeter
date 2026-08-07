from typing import Dict, Any

class ResumeDNAEngine:
    @staticmethod
    def get_permanent_dna(cv_data: Dict[str, Any]) -> Dict[str, Any]:
        contact = cv_data.get("contact", {})
        skills_list = [s for sg in cv_data.get("skillGroups", []) for s in sg.get("skills", [])]

        return {
            "candidateId": cv_data.get("id", "cv-001"),
            "candidateName": contact.get("name", "Alex Morgan"),
            "primaryTitle": contact.get("title", "Senior Full Stack & AI Systems Architect"),
            "targetIndustry": "Technology / Enterprise SaaS",
            "seniorityLevel": "Senior / Architect",
            "primaryLanguage": "English (Native)",
            "secondaryLanguage": "Spanish (Fluent)",
            "topSkills": skills_list[:8],
            "preferredTemplates": ["ats-professional", "technology", "executive"],
            "preferredTone": "Executive",
            "certifications": ["AWS Certified Solutions Architect – Associate"],
            "careerAspiration": "Staff Software Architect @ High-Growth Tech"
        }
