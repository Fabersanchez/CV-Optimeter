"""
CV OPTIMETER TEMPLATE REGISTRY - TEMPLATE IMPORTER & LICENSE AUDITOR
Inspects external template manifests (license.md), audits license permissions, and normalizes descriptors into TemplateDefinition.
"""

from typing import Dict, Any, Tuple
from .template_definition import (
    TemplateDefinition,
    TemplateState,
    LicenseManifest,
    SourceType
)


class TemplateImporter:
    @staticmethod
    def audit_license(manifest: Dict[str, Any]) -> LicenseManifest:
        source_type_str = manifest.get("source_type", "external").lower()
        source_type = (
            SourceType.ORIGINAL if source_type_str == "original"
            else SourceType.ADAPTED if source_type_str == "adapted"
            else SourceType.EXTERNAL
        )

        license_type = manifest.get("license", manifest.get("license_type", "Proprietary"))
        author = manifest.get("author", "External Contributor")
        source_url = manifest.get("source_url")
        license_url = manifest.get("license_url")
        
        commercial_use = bool(manifest.get("commercial_use", True))
        modification_allowed = bool(manifest.get("modification_allowed", True))
        redistribution_allowed = bool(manifest.get("redistribution_allowed", True))
        attribution_required = bool(manifest.get("attribution_required", False))

        # Check if license is ambiguous or forbidden
        is_safe = (commercial_use and modification_allowed and redistribution_allowed)
        if license_type.lower() in ["unknown", "restricted", "gpl-3.0", "non-commercial"]:
            is_safe = False

        return LicenseManifest(
            source_type=source_type,
            license_type=license_type,
            author=author,
            source_url=source_url,
            license_url=license_url,
            attribution_required=attribution_required,
            commercial_use=commercial_use,
            modification_allowed=modification_allowed,
            redistribution_allowed=redistribution_allowed,
            verified=is_safe
        )

    @staticmethod
    def import_external_template(template_payload: Dict[str, Any]) -> Tuple[TemplateDefinition, str]:
        manifest = template_payload.get("license", template_payload.get("manifest", {}))
        license_manifest = TemplateImporter.audit_license(manifest)

        # Build TemplateDefinition
        template_id = template_payload.get("id", "external-template-01")
        name = template_payload.get("name", "External Imported Template")
        slug = template_payload.get("slug", template_id.replace(" ", "-").lower())
        description = template_payload.get("description", "Imported external document layout.")

        state = TemplateState.READY if license_manifest.verified else TemplateState.LICENSE_REVIEW_REQUIRED

        definition = TemplateDefinition(
            id=template_id,
            name=name,
            slug=slug,
            version=template_payload.get("version", "1.0.0"),
            description=description,
            state=state,
            license=license_manifest,
            metadata=template_payload.get("metadata", {}),
            layout=template_payload.get("layout", {}),
            typography=template_payload.get("typography", {}),
            colors=template_payload.get("colors", {}),
            ats=template_payload.get("ats", {}),
            quality=template_payload.get("quality", {})
        )

        message = (
            "Template imported successfully and verified for production."
            if state == TemplateState.READY
            else "WARNING: License permissions ambiguous. Quarantined under LICENSE_REVIEW_REQUIRED state."
        )

        return (definition, message)
