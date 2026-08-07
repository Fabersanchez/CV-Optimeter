from typing import List, Dict, Any

class PluginArchitectureManager:
    REGISTERED_PLUGINS = [
        {"id": "plugin-workday", "name": "Workday ATS Sync", "category": "ATS Integration", "status": "INSTALLED", "version": "1.4.0"},
        {"id": "plugin-greenhouse", "name": "Greenhouse Software Connector", "category": "ATS Integration", "status": "INSTALLED", "version": "2.1.0"},
        {"id": "plugin-lever", "name": "Lever Hire Webhook", "category": "ATS Integration", "status": "INSTALLED", "version": "1.8.0"},
        {"id": "plugin-successfactors", "name": "SAP SuccessFactors Sync", "category": "Enterprise HR", "status": "AVAILABLE", "version": "1.0.0"},
        {"id": "plugin-indeed", "name": "Indeed Auto-Importer", "category": "Job Boards", "status": "INSTALLED", "version": "1.2.0"}
    ]

    @classmethod
    def get_plugins(cls) -> List[Dict[str, Any]]:
        return cls.REGISTERED_PLUGINS
