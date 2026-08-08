from app.services.document_intelligence.parser_engine import parse_text_into_cv_structure
from app.services.document_intelligence.section_detector import detect_section_type
from app.services.document_intelligence.normalizer_engine import normalize_candidate_data
from app.services.document_intelligence.quality_engine import DocumentQualityAuditor
from app.services.document_intelligence.smart_block_detector import SmartBlockDetector
from app.services.document_intelligence.version_model import DocumentVersionModel

def test_document_intelligence_pipeline():
    sample_resume_text = """
    Jane Doe
    Lead Data Architect & AI Engineer
    jane.doe@ai-enterprise.io
    +1 (555) 987-6543
    San Francisco, CA
    linkedin.com/in/janedoe-ai
    github.com/janedoe-ai

    Resumen Profesional
    Senior AI Engineer with 8+ years of experience architecting LLM pipelines and distributed data platforms.

    Trayectoria Profesional
    Lead AI Architect | MetaScale Systems (2022 - Present)
    - Architected real-time streaming RAG pipeline serving 5M daily queries with 35% latency drop.
    - Managed engineering team of 10 data scientists.

    Formación Académica
    Master of Science in Computer Science | Stanford University (2018 - 2020)

    Competencias Técnicas
    Python, PyTorch, FastAPI, PostgreSQL, Redis, Docker, Kubernetes, AWS
    """

    print("--- 1. Testing Parser Engine & Section Detector ---")
    parsed = parse_text_into_cv_structure(sample_resume_text, filename="jane_doe_cv.pdf")
    assert parsed["contact"]["name"] == "Jane Doe"
    assert parsed["contact"]["email"] == "jane.doe@ai-enterprise.io"
    print("[OK] Parser Engine Extracted Contact Correctly")

    print("\n--- 2. Testing Section Detector ---")
    assert detect_section_type("Trayectoria Profesional") == "experience"
    assert detect_section_type("Formación Académica") == "education"
    assert detect_section_type("Competencias Técnicas") == "skills"
    print("[OK] Section Detector Mapped International Headers Correctly")

    print("\n--- 3. Testing Normalizer Engine ---")
    normalized = normalize_candidate_data(parsed)
    assert normalized["contact"]["linkedin"] == "https://linkedin.com/in/janedoe-ai"
    print("[OK] Normalizer Engine Cleaned URLs & Contact Details")

    print("\n--- 4. Testing Document Quality Engine ---")
    audit = DocumentQualityAuditor.audit_cv_quality(normalized)
    assert audit["atsScore"] >= 80
    print(f"[OK] Quality Audit Score: {audit['atsScore']}/100, Total Observations: {audit['totalObservations']}")

    print("\n--- 5. Testing Smart Block Detector ---")
    blocks = SmartBlockDetector.detect_visual_blocks(normalized)
    assert len(blocks) >= 3
    print(f"[OK] Smart Block Detector Generated {len(blocks)} Visual Blocks")

    print("\n--- 6. Testing Document Version Control ---")
    vm = DocumentVersionModel()
    snap = vm.create_snapshot(normalized, author="Jane Doe", change_description="Imported PDF CV")
    assert snap["versionId"] == "v-1"
    print(f"[OK] Created Version Snapshot: {snap['versionId']}")

    print("\n[OK] ALL DOCUMENT INTELLIGENCE TESTS PASSED 100%!")

if __name__ == "__main__":
    test_document_intelligence_pipeline()
