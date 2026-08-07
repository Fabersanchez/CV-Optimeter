from typing import List, Dict, Any

class NotificationEngine:
    @staticmethod
    def get_smart_notifications() -> List[Dict[str, Any]]:
        return [
            {
                "id": "notif-01",
                "type": "REMINDER",
                "title": "AWS Certification Exam Target Date",
                "message": "You are 60% complete with AWS Solutions Architect preparation.",
                "dueDate": "2026-09-30"
            },
            {
                "id": "notif-02",
                "type": "INSIGHT",
                "title": "LinkedIn Optimization Milestone",
                "message": "Your LinkedIn Profile Score reached 96/100.",
                "dueDate": "Today"
            }
        ]
