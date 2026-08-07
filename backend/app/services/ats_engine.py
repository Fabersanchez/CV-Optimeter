import re
from typing import Dict, Any, List

class ATSEngineService:
    """Professional ATS Analyzer calculating ATS readiness score (0-100) and actionable diagnostics."""

    ACTION_VERBS = [
        "achieved", "accelerated", "architected", "built", "spearheaded", "developed", "executed",
        "engineered", "optimized", "increased", "reduced", "led", "managed", "implemented",
        "transformed", "launched", "automated", "created", "designed", "scaled", "boosted",
        "generated", "delivering", "maximized", "streamlined", "orchestrated", "expanded"
    ]

    WEAK_PHRASES = [
        "responsible for", "worked on", "helped with", "assisted in", "duties included",
        "team player", "hard worker", "detail oriented", "think outside the box"
    ]

    @classmethod
    def analyze_resume(cls, parsed_cv: Dict[str, Any], target_job_description: str = "") -> Dict[str, Any]:
        text = parsed_cv.get("raw_text", "")
        contact_info = parsed_cv.get("contact_info", {})
        skills = parsed_cv.get("extracted_skills", [])
        sections = parsed_cv.get("sections", {})
        word_count = parsed_cv.get("word_count", 0)

        # 1. Action Verbs Evaluation (Max 20)
        action_verb_count = 0
        found_action_verbs = []
        for verb in cls.ACTION_VERBS:
            matches = len(re.findall(r'\b' + verb + r'\b', text, re.IGNORECASE))
            if matches > 0:
                action_verb_count += matches
                found_action_verbs.append(verb)
        
        action_score = min(20, int((action_verb_count / 8) * 20))

        # 2. Measurable Metrics Evaluation (Max 20)
        # Matches percentages (35%), dollars ($50k, 1M+), numbers with multipliers (100+, 2.5x)
        metric_matches = re.findall(r'(\d+%\s*|\$\d+[\d,]*[kKmMbB]?|\b\d+\+\s*|\b\d+\.\d+x\b|\b\d+\s+(?:users|clients|projects|team members|percent|reduction|increase|revenue)\b)', text, re.IGNORECASE)
        metric_count = len(metric_matches)
        metrics_score = min(20, int((metric_count / 5) * 20))

        # 3. Keyword Density & Hard Skills (Max 25)
        skill_score = min(25, int((len(skills) / 10) * 25))

        # 4. Formatting & Parsing Readiness (Max 20)
        formatting_issues = []
        formatting_score = 20

        # Check contact details
        if contact_info.get("email") == "Not detected":
            formatting_score -= 5
            formatting_issues.append({"severity": "HIGH", "category": "Contact Info", "message": "No valid email address found in the top document header."})
        if contact_info.get("phone") == "Not detected":
            formatting_score -= 3
            formatting_issues.append({"severity": "MEDIUM", "category": "Contact Info", "message": "Phone number was not automatically parsed."})
        if contact_info.get("linkedin") == "Not detected":
            formatting_score -= 2
            formatting_issues.append({"severity": "LOW", "category": "Online Presence", "message": "Adding a clean LinkedIn profile URL boosts recruiter outreach."})

        # Check section presence
        if not sections.get("summary"):
            formatting_score -= 3
            formatting_issues.append({"severity": "MEDIUM", "category": "Structure", "message": "Missing Professional Summary section."})
        if not sections.get("experience"):
            formatting_score -= 5
            formatting_issues.append({"severity": "HIGH", "category": "Structure", "message": "Missing work experience header or structure."})

        formatting_score = max(0, formatting_score)

        # 5. Brevity & Word Count Structure (Max 15)
        length_score = 15
        if word_count < 200:
            length_score = 5
            formatting_issues.append({"severity": "HIGH", "category": "Brevity", "message": "Resume length is too short (< 200 words). Add key achievements and experience."})
        elif word_count > 1200:
            length_score = 8
            formatting_issues.append({"severity": "MEDIUM", "category": "Brevity", "message": "Resume exceeds recommended length (> 1200 words). Keep it concise (1-2 pages)."})

        # Check weak phrases
        weak_found = []
        for phrase in cls.WEAK_PHRASES:
            if re.search(r'\b' + re.escape(phrase) + r'\b', text, re.IGNORECASE):
                weak_found.append(phrase)

        if weak_found:
            formatting_issues.append({
                "severity": "MEDIUM",
                "category": "Tone & Wording",
                "message": f"Replace generic weak phrases ({', '.join(weak_found[:3])}) with strong action verbs."
            })

        # Calculate Overall Score (0 - 100)
        overall_score = action_score + metrics_score + skill_score + formatting_score + length_score
        overall_score = min(100, max(0, overall_score))

        # Determine Tier Grade
        if overall_score >= 85:
            grade = "A+ (ATS Ready)"
            grade_color = "emerald"
        elif overall_score >= 70:
            grade = "B (Good Potential)"
            grade_color = "blue"
        elif overall_score >= 50:
            grade = "C (Needs Optimization)"
            grade_color = "amber"
        else:
            grade = "D (High Risk of Rejection)"
            grade_color = "rose"

        # Actionable Recommendations
        recommendations = []
        if metrics_score < 15:
            recommendations.append("Quantify at least 3 bullet points with numbers, %, or financial impact (e.g. 'Increased sales by 35%').")
        if action_score < 15:
            recommendations.append("Start each bullet point in your Experience section with strong action verbs (e.g., Architected, Spearheaded, Accelerated).")
        if skill_score < 18:
            recommendations.append("Add a dedicated 'Technical Skills' section listing relevant frameworks, databases, and methodologies.")
        if contact_info.get("linkedin") == "Not detected":
            recommendations.append("Include your updated LinkedIn URL in the header.")

        return {
            "overall_score": overall_score,
            "grade": grade,
            "grade_color": grade_color,
            "breakdown": {
                "action_verbs": {"score": action_score, "max": 20, "count": action_verb_count},
                "measurable_metrics": {"score": metrics_score, "max": 20, "count": metric_count},
                "hard_skills": {"score": skill_score, "max": 25, "count": len(skills)},
                "formatting_structure": {"score": formatting_score, "max": 20},
                "brevity_length": {"score": length_score, "max": 15, "word_count": word_count}
            },
            "diagnostics": formatting_issues,
            "recommendations": recommendations,
            "found_skills": skills,
            "found_action_verbs": found_action_verbs[:10],
            "metrics_detected": metric_matches[:6]
        }
