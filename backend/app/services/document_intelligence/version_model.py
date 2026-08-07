import datetime
from typing import Dict, Any, List

class DocumentVersionModel:
    def __init__(self):
        self.revisions: List[Dict[str, Any]] = []

    def create_snapshot(self, cv_data: Dict[str, Any], author: str = "User", change_description: str = "Auto-save") -> Dict[str, Any]:
        snapshot = {
            "versionId": f"v-{len(self.revisions) + 1}",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "author": author,
            "changeDescription": change_description,
            "data": cv_data
        }
        self.revisions.append(snapshot)
        return snapshot

    def get_version_history(self) -> List[Dict[str, Any]]:
        return [
            {
                "versionId": r["versionId"],
                "timestamp": r["timestamp"],
                "author": r["author"],
                "changeDescription": r["changeDescription"]
            }
            for r in self.revisions
        ]
