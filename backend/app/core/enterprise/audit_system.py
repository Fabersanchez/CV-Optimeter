import datetime
from typing import List, Dict, Any

class AuditSystemEngine:
    def __init__(self):
        self.audit_logs: List[Dict[str, Any]] = [
            {
                "id": "audit-01",
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "userId": "usr-01",
                "userEmail": "alex.morgan@devmail.io",
                "action": "DOCUMENT_IMPORT",
                "resource": "jane_doe_cv.pdf",
                "status": "SUCCESS",
                "ipAddress": "127.0.0.1"
            },
            {
                "id": "audit-02",
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "userId": "usr-01",
                "userEmail": "alex.morgan@devmail.io",
                "action": "ATS_X_SIMULATION",
                "resource": "Taleo/Workday Audit",
                "status": "SUCCESS",
                "ipAddress": "127.0.0.1"
            }
        ]

    def log_event(self, user_id: str, user_email: str, action: str, resource: str, status: str = "SUCCESS") -> Dict[str, Any]:
        entry = {
            "id": f"audit-{len(self.audit_logs) + 1:02d}",
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "userId": user_id,
            "userEmail": user_email,
            "action": action,
            "resource": resource,
            "status": status,
            "ipAddress": "127.0.0.1"
        }
        self.audit_logs.append(entry)
        return entry

    def get_logs(self) -> List[Dict[str, Any]]:
        return self.audit_logs
