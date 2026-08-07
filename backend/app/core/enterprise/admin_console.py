from typing import Dict, Any

class AdminConsoleEngine:
    @staticmethod
    def get_system_health() -> Dict[str, Any]:
        return {
            "systemStatus": "HEALTHY",
            "uptimePercentage": "99.99%",
            "activeUserSessions": 128,
            "cpuUtilization": "14%",
            "memoryUsage": "42%",
            "databaseConnections": "18 / 100",
            "fastapiResponseTimeMs": 18,
            "nextjsBuildStatus": "COMPILED_CLEAN"
        }
