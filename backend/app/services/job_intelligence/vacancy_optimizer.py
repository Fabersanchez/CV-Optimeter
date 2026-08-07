from typing import Dict, Any

class VacancyOptimizerEngine:
    @staticmethod
    def optimize_cv_for_job(cv_data: Dict[str, Any], job_data: Dict[str, Any]) -> Dict[str, Any]:
        tailored = cv_data.copy()

        role = job_data.get("roleTitle", "Target Role")
        company = job_data.get("company", "Target Company")
        req_skills = job_data.get("requiredSkills", [])

        # Tailor summary
        tailored["summary"] = (
            f"Results-driven Senior Engineer with proven track record delivering scalable SaaS solutions. "
            f"Tailored for {role} at {company}, specializing in {', '.join(req_skills[:4])} and high-throughput systems."
        )

        # Prioritize required skills into first skill group
        if tailored.get("skillGroups"):
            sg_list = tailored["skillGroups"]
            existing = sg_list[0].get("skills", [])
            merged = list(dict.fromkeys(req_skills + existing))
            sg_list[0]["skills"] = merged
            tailored["skillGroups"] = sg_list

        return tailored
