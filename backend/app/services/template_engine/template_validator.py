"""
CV OPTIMETER TEMPLATE REGISTRY - TEMPLATE VALIDATOR & NORMALIZER
Audits TemplateDefinition schemas for layout constraints, ATS compliance, font availability, and license safety.
"""

from typing import Dict, Any, List, Tuple
from .template_definition import TemplateDefinition, TemplateState


class TemplateValidator:
    @staticmethod
    def validate_template(definition: TemplateDefinition) -> Tuple[bool, List[str]]:
        errors: List[str] = []

        if not definition.id or len(definition.id.strip()) < 2:
            errors.append("Template ID must be non-empty.")

        if not definition.name or len(definition.name.strip()) < 2:
            errors.append("Template name must be non-empty.")

        if definition.layout.columns not in [1, 2]:
            errors.append("Layout columns must be 1 or 2.")

        if definition.ats.parse_rate_rating < 60:
            errors.append("ATS parse rating score below minimum safety threshold of 60.")

        if definition.state == TemplateState.LICENSE_REVIEW_REQUIRED:
            errors.append("Template requires explicit license review before publication.")

        if not definition.license.verified:
            errors.append("License manifest verification failed.")

        is_valid = len(errors) == 0
        return (is_valid, errors)
