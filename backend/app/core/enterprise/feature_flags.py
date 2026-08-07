from typing import Dict, Any

class FeatureFlagEngine:
    FLAGS = {
        "ats_x_v2": True,
        "ai_copilot_pro": True,
        "enterprise_sso": True,
        "multi_llm_provider_switching": True,
        "realtime_collaboration_beta": False
    }

    @classmethod
    def get_all_flags(cls) -> Dict[str, bool]:
        return cls.FLAGS

    @classmethod
    def is_enabled(cls, flag_name: str) -> bool:
        return cls.FLAGS.get(flag_name, False)
