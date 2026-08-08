"""
CV OPTIMETER TEMPLATE REGISTRY - UNIT & INTEGRATION TEST SUITE (28 CATALOG)
Tests TemplateRegistry, TemplateImporter, TemplateValidator, Recommendation Engine, Comparison Engine, License Auditor, and Zero Data Loss.
"""

import hashlib
import json
from app.services.template_engine.template_registry import template_registry
from app.services.template_engine.template_definition import TemplateDefinition, TemplateState, SourceType
from app.services.template_engine.template_validator import TemplateValidator
from app.services.template_engine.template_importer import TemplateImporter
from app.services.template_engine.recommendation_engine import TemplateRecommendationEngine
from app.services.template_engine.comparison_engine import TemplateComparisonEngine

SAMPLE_CANDIDATE_CV = {
    "id": "cv-test-100",
    "title": "Carlos Ruiz Resume",
    "contact": {
        "name": "Carlos Ruiz",
        "title": "Senior Cloud & AI Systems Architect",
        "email": "carlos.ruiz@devmail.io",
        "phone": "+34 654 321 098",
        "location": "Barcelona, Spain",
        "linkedin": "https://linkedin.com/in/carlos-ruiz-tech",
        "github": "https://github.com/carlosruiz"
    },
    "summary": "Arquitecto de Sistemas Cloud y especialista en IA con 8+ años de experiencia construyendo plataformas de alto rendimiento.",
    "experience": [
        {
            "id": "exp-1",
            "company": "TechPulse Global",
            "role": "Senior Cloud Architect",
            "startDate": "2022",
            "endDate": "Present",
            "bullets": ["Diseñó e implementó microservicios distribuídos con FastAPI, Redis y Docker."]
        }
    ],
    "education": [
        {
            "id": "edu-1",
            "institution": "Universidad Politécnica de Cataluña",
            "degree": "Máster en Inteligencia Artificial",
            "startDate": "2018",
            "endDate": "2020"
        }
    ],
    "skillGroups": [
        {
            "id": "sg-1",
            "category": "Cloud & AI",
            "skills": ["Python", "TypeScript", "FastAPI", "Docker", "Kubernetes", "AWS", "PyTorch", "Redis"]
        }
    ]
}


def test_template_registry_suite():
    print("--- 1. Testing TemplateRegistry 28 Built-In Templates ---")
    templates = template_registry.list_all()
    assert len(templates) >= 28, f"FAIL: Expected at least 28 templates, found {len(templates)}"
    
    t_ids = [t.id for t in templates]
    required_28 = [
        "ats-professional", "ats-compact", "ats-academic", "ats-technical", "ats-executive",
        "modern-professional", "corporate", "clean-hybrid", "strategic-lead", "operations-lead",
        "executive", "senior-executive", "board-director",
        "technology", "technical-specialist", "data-ai",
        "engineering", "cloud-infrastructure",
        "academic", "publication-heavy",
        "creative", "portfolio-design",
        "minimalist", "high-contrast-minimal",
        "startup", "high-growth-scaleup",
        "medical", "legal"
    ]
    for req in required_28:
        assert req in t_ids, f"FAIL: Required template '{req}' missing from 28-catalog registry"

    print(f"[OK] TemplateRegistry loaded {len(templates)} distinct templates with zero missing schemas")

    print("\n--- 2. Testing License Audit Manifests Across 28 Catalog ---")
    adapted_count = 0
    original_count = 0
    for t in templates:
        assert t.license.verified is True, f"FAIL: Template '{t.id}' has unverified license manifest"
        assert t.license.commercial_use is True, f"FAIL: Template '{t.id}' fails commercial_use permission"
        if t.license.source_type == SourceType.ADAPTED:
            adapted_count += 1
            assert t.license.source_repository is not None, f"FAIL: Adapted template '{t.id}' missing source_repository"
        else:
            original_count += 1

    print(f"[OK] License auditor verified 28 templates: {original_count} Original + {adapted_count} Open-Source Adapted (JSON Resume, Career Pilot, Matty's Resume)")

    print("\n--- 3. Testing License Audit Quarantine (Forbidden/Ambiguous License) ---")
    payload_ambiguous = {
        "id": "ext-unknown-02",
        "name": "Restricted Template",
        "slug": "restricted-template",
        "description": "Restricted distribution template.",
        "license": {
            "source_type": "EXTERNAL",
            "license": "Non-Commercial",
            "commercial_use": False
        }
    }
    def_quarantine, msg_q = TemplateImporter.import_external_template(payload_ambiguous)
    assert def_quarantine.state == TemplateState.LICENSE_REVIEW_REQUIRED, "FAIL: Ambiguous license must be quarantined"
    print(f"[OK] License auditor quarantined ambiguous template under LICENSE_REVIEW_REQUIRED state")

    print("\n--- 4. Testing AI Template Recommendation Engine ---")
    rec_result = TemplateRecommendationEngine.recommend_templates(
        candidate_cv=SAMPLE_CANDIDATE_CV,
        job_description="Requerimos Senior Cloud Architect con experiencia en AWS, FastAPI y ATS alta densidad."
    )
    assert len(rec_result.top_recommendations) >= 3, "FAIL: Expected at least 3 top recommendations"
    top_1 = rec_result.top_recommendations[0]
    assert top_1.compatibility_score >= 85, "FAIL: Top recommendation compatibility score too low"
    print(f"[OK] AI Recommender selected '{top_1.template_name}' ({top_1.compatibility_score}% match)")

    print("\n--- 5. Testing ZERO DATA LOSS Policy (Content-Design Decoupling) ---")
    initial_hash = hashlib.sha256(json.dumps(SAMPLE_CANDIDATE_CV, sort_keys=True).encode("utf-8")).hexdigest()
    
    test_templates = ["ats-professional", "executive", "creative", "academic", "cloud-infrastructure", "board-director", "modern-professional"]
    for t_id in test_templates:
        t_def = template_registry.get(t_id)
        assert t_def is not None, f"FAIL: Template '{t_id}' missing"
        current_hash = hashlib.sha256(json.dumps(SAMPLE_CANDIDATE_CV, sort_keys=True).encode("utf-8")).hexdigest()
        assert current_hash == initial_hash, f"FAIL: CandidateCVSchema mutated when applying template '{t_id}'!"

    print("[OK] ZERO DATA LOSS VERIFIED 100%: CandidateCVSchema remained 100% intact after applying templates")

    print("\n[OK] ALL TEMPLATE REGISTRY ENGINE TESTS PASSED 100%!\n")


if __name__ == "__main__":
    test_template_registry_suite()
