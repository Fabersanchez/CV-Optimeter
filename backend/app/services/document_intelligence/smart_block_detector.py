from typing import List, Dict, Any

class SmartBlockDetector:
    @staticmethod
    def detect_visual_blocks(cv_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        blocks = []

        if cv_data.get("contact"):
            c = cv_data["contact"]
            blocks.append({
                "id": "block-header-01",
                "type": "HeaderBlock",
                "label": "Contact & Header Banner",
                "data": {
                    "name": c.get("name", ""),
                    "title": c.get("title", ""),
                    "contactItems": [c.get("email"), c.get("phone"), c.get("location")]
                }
            })

        if cv_data.get("experience"):
            blocks.append({
                "id": "block-exp-timeline",
                "type": "TimelineCardBlock",
                "label": "Work Experience Timeline",
                "itemCount": len(cv_data["experience"]),
                "data": cv_data["experience"]
            })

        if cv_data.get("skillGroups"):
            blocks.append({
                "id": "block-skills-grid",
                "type": "SkillsGridBlock",
                "label": "Categorized Skills Matrix",
                "itemCount": len(cv_data["skillGroups"]),
                "data": cv_data["skillGroups"]
            })

        if cv_data.get("education"):
            blocks.append({
                "id": "block-edu-cards",
                "type": "EducationCardBlock",
                "label": "Education & Academic History",
                "itemCount": len(cv_data["education"]),
                "data": cv_data["education"]
            })

        if cv_data.get("languages"):
            blocks.append({
                "id": "block-languages-badge",
                "type": "LanguagesBadgeBlock",
                "label": "Multilingual Proficiency Badges",
                "itemCount": len(cv_data["languages"]),
                "data": cv_data["languages"]
            })

        return blocks
