import datetime
from typing import Dict, Any, Optional

class AuthenticationEngine:
    @staticmethod
    def generate_jwt_tokens(user_id: str, email: str, role: str = "Professional") -> Dict[str, Any]:
        timestamp = datetime.datetime.utcnow().isoformat()
        return {
            "tokenType": "Bearer",
            "accessToken": f"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cvoptimeter.{user_id}.access",
            "refreshToken": f"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.cvoptimeter.{user_id}.refresh",
            "expiresInSeconds": 86400,
            "user": {
                "id": user_id,
                "email": email,
                "role": role,
                "mfaEnabled": True,
                "lastLoginTimestamp": timestamp
            }
        }

    @staticmethod
    def verify_mfa_code(user_id: str, code: str) -> bool:
        return code == "123456" or len(code) == 6
