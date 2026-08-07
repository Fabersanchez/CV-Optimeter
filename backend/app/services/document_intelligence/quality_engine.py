from typing import List, Dict, Any

class DocumentQualityAuditor:
    @staticmethod
    def audit_cv_quality(cv_data: Dict[str, Any]) -> Dict[str, Any]:
        observations = []
        ats_score = 100
        visual_score = 100

        contact = cv_data.get("contact", {})
        if not contact.get("email"):
            ats_score -= 15
            observations.append({
                "severity": "CRITICAL",
                "category": "Contact Info",
                "issue": "Missing Email Address",
                "impact": "Recruiters and ATS parsers cannot contact candidate",
                "recommendation": "Add a valid professional email address to top header."
            })
        if not contact.get("phone"):
            ats_score -= 10
            observations.append({
                "severity": "WARNING",
                "category": "Contact Info",
                "issue": "Missing Phone Number",
                "impact": "Reduces ATS recruiter search filtering match",
                "recommendation": "Add phone number with international country code."
            })
        if not contact.get("linkedin"):
            visual_score -= 5
            observations.append({
                "severity": "INFO",
                "category": "Social Presence",
                "issue": "Missing LinkedIn Profile URL",
                "impact": "Lower recruiter trust score",
                "recommendation": "Include custom LinkedIn URL in contact block."
            })

        summary = cv_data.get("summary", "")
        if not summary or len(summary.split()) < 20:
            ats_score -= 10
            visual_score -= 10
            observations.append({
                "severity": "WARNING",
                "category": "Professional Summary",
                "issue": "Short or Missing Summary",
                "impact": "Reduces keyword density for ATS parsing",
                "recommendation": "Expand summary to 3-4 sentences highlighting core tech stack and metrics."
            })

        experience = cv_data.get("experience", [])
        if not experience:
            ats_score -= 25
            observations.append({
                "severity": "CRITICAL",
                "category": "Work Experience",
                "issue": "No Work Experience Found",
                "impact": "Major ATS score penalty",
                "recommendation": "Add past roles or relevant technical projects."
            })
        else:
            for idx, exp in enumerate(experience):
                bullets = exp.get("bullets", [])
                has_metrics = any("%" in b or "$" in b or "20" in b or "30" in b for b in bullets)
                if not has_metrics:
                    ats_score -= 5
                    visual_score -= 5
                    observations.append({
                        "severity": "WARNING",
                        "category": "Work Experience",
                        "issue": f"Role '{exp.get('role', 'Job')}' lacks quantified metrics",
                        "impact": "Recruiters prioritize candidates with measurable achievements",
                        "recommendation": "Use STAR framework to add percentages or ROI numbers."
                    })

        skills = cv_data.get("skillGroups", [])
        total_skills = sum(len(sg.get("skills", [])) for sg in skills)
        if total_skills < 5:
            ats_score -= 15
            observations.append({
                "severity": "WARNING",
                "category": "Skills Density",
                "issue": "Low Technical Skill Density",
                "impact": "Misses ATS keyword indexing filters",
                "recommendation": "Add at least 8-12 relevant hard skills and tools."
            })

        return {
            "atsScore": max(30, ats_score),
            "visualScore": max(40, visual_score),
            "totalObservations": len(observations),
            "observations": observations
        }
