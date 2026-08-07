from typing import Dict, Any, List

class OrganizationEngine:
    def __init__(self):
        self.organizations: List[Dict[str, Any]] = [
            {
                "id": "org-01",
                "name": "TechPulse Innovations Corp",
                "tier": "Enterprise",
                "workspaces": [
                    {"id": "ws-01", "name": "Engineering Team Workspace", "memberCount": 12},
                    {"id": "ws-02", "name": "Executive Hiring Workspace", "memberCount": 4}
                ],
                "activeMembers": 16,
                "maxMembersAllowed": 50
            }
        ]

    def get_organization_details(self, org_id: str = "org-01") -> Dict[str, Any]:
        for org in self.organizations:
            if org["id"] == org_id:
                return org
        return self.organizations[0]
