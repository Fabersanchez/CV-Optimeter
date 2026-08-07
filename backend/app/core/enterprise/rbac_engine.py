from typing import Dict, List

ROLES_PERMISSIONS_MATRIX: Dict[str, List[str]] = {
    "Guest": ["view:public_templates"],
    "Free": ["view:public_templates", "edit:basic_cv", "export:html"],
    "Pro": ["view:all_templates", "edit:full_cv", "export:pdf_html", "use:ai_copilot"],
    "Premium": ["view:all_templates", "edit:full_cv", "export:pdf_html_docx", "use:ai_copilot_pro", "use:ats_x_simulations"],
    "Business": ["view:all_templates", "edit:full_cv", "export:all", "use:ai_copilot_pro", "use:ats_x_simulations", "org:manage_teams"],
    "Enterprise": ["view:all_templates", "edit:full_cv", "export:all", "use:ai_copilot_enterprise", "use:ats_x_simulations", "org:manage_workspaces", "api:public_access"],
    "Admin": ["manage:users", "manage:subscriptions", "view:audit_logs", "manage:feature_flags"],
    "SuperAdmin": ["*"]
}

class RBACEngine:
    @staticmethod
    def check_permission(user_role: str, required_permission: str) -> bool:
        user_perms = ROLES_PERMISSIONS_MATRIX.get(user_role, [])
        if "*" in user_perms:
            return True
        return required_permission in user_perms
