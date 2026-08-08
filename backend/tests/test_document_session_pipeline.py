"""
CV OPTIMETER AI ENTERPRISE QA TEST SUITE - DOCUMENT SESSION PIPELINE
Verifies DocumentSession creation, DocumentIngestionPipeline, SourceMap, EventBus, and API Contract.
"""

from app.services.document_intelligence.ingestion_pipeline import DocumentIngestionPipeline
from app.services.document_intelligence.document_session import document_session_store, ProcessingStatus
from app.services.document_intelligence.document_event_bus import document_event_bus
from app.services.document_intelligence.source_map_engine import SourceMapEngine, ConfidenceEngine

SAMPLE_TXT_CV = """
MARIA GONZALEZ
Senior Cloud Architect & DevOps Engineer
maria.gonzalez@techcorp.io | +34 612 345 678 | Madrid, Spain
linkedin.com/in/maria-gonzalez-dev

RESUMEN PROFESIONAL
Arquitecta Cloud con más de 7 años de experiencia diseñando e implementando arquitecturas distribuidas en AWS y Azure.

EXPERIENCIA LABORAL
Senior Cloud Engineer | InnovaTech Solutions
2022 - Presente
- Lideró la migración de microservicios con FastAPI y Kubernetes reduciendo latencia en un 40%.
- Implementó pipelines de CI/CD automatizados con GitHub Actions.

Cloud Engineer | DataScale Systems
2019 - 2022
- Diseñó bases de datos PostgreSQL de alta disponibilidad atendiendo 500k consultas diarias.

EDUCACION ACADEMICA
Universidad Politécnica de Madrid
Grado en Ingeniería Informática (2015 - 2019)

HABILIDADES TECNICAS
Python, TypeScript, AWS, Docker, Kubernetes, Terraform, PostgreSQL, Redis, CI/CD
"""

def test_document_session_pipeline_suite():
    print("--- 1. Testing DocumentIngestionPipeline Execution ---")
    session = DocumentIngestionPipeline.process_document(
        file_bytes=SAMPLE_TXT_CV.encode("utf-8"),
        filename="Maria_Gonzalez_CV.txt",
        content_type="text/plain"
    )

    assert session.session_id.startswith("session-"), "FAIL: session_id invalid format"
    assert session.document_id.startswith("doc-"), "FAIL: document_id invalid format"
    assert session.processing_status == ProcessingStatus.READY, "FAIL: Processing status not READY"
    assert session.candidate_cv["contact"]["name"] == "MARIA GONZALEZ", f"FAIL: Expected 'MARIA GONZALEZ', got '{session.candidate_cv['contact']['name']}'"
    assert session.candidate_cv["contact"]["email"] == "maria.gonzalez@techcorp.io", "FAIL: Email mismatch"
    assert len(session.candidate_cv["experience"]) > 0, f"FAIL: Expected experience items, got {len(session.candidate_cv['experience'])}"
    print("[OK] DocumentIngestionPipeline processed candidate CV correctly with 0 fake data")

    print("\n--- 2. Testing SourceMapEngine & Traceability ---")
    assert "contact.name" in session.source_map, "FAIL: contact.name missing from source_map"
    assert "contact.email" in session.source_map, "FAIL: contact.email missing from source_map"
    assert session.source_map["contact.email"].confidence >= 0.90, "FAIL: Low confidence score for email"
    print("[OK] SourceMapEngine generated field-level traceability & confidence metrics")

    print("\n--- 3. Testing ConfidenceEngine Summary ---")
    assert session.confidence.get("overall", 0) > 0.80, "FAIL: Overall confidence below threshold"
    print(f"[OK] ConfidenceEngine overall score: {session.confidence.get('overall')}")

    print("\n--- 4. Testing DocumentEventBus Emissions ---")
    events = document_event_bus.get_events(session.session_id)
    assert len(events) >= 4, f"FAIL: Expected at least 4 lifecycle events, got {len(events)}"
    event_types = [e.event_type for e in events]
    assert "DOCUMENT_UPLOAD_STARTED" in event_types, "FAIL: DOCUMENT_UPLOAD_STARTED missing"
    assert "DOCUMENT_SESSION_READY" in event_types, "FAIL: DOCUMENT_SESSION_READY missing"
    print(f"[OK] DocumentEventBus tracked {len(events)} lifecycle events successfully")

    print("\n--- 5. Testing DocumentSessionStore Persistence & Schema Updating ---")
    retrieved = document_session_store.get_session(session.session_id)
    assert retrieved is not None, "FAIL: Session not found in store"
    
    # Test patch schema
    updated_cv = session.candidate_cv
    updated_cv["contact"]["title"] = "Principal Cloud Architect"
    document_session_store.update_candidate_cv(session.session_id, updated_cv)
    
    updated_session = document_session_store.get_session(session.session_id)
    assert updated_session.candidate_cv["contact"]["title"] == "Principal Cloud Architect", "FAIL: Schema update failed"
    assert updated_session.version == 2, "FAIL: Version increment failed"
    print("[OK] DocumentSessionStore updated candidate schema and bumped state version to v2")

    print("\n[OK] ALL DOCUMENT SESSION PIPELINE TESTS PASSED 100%!\n")


if __name__ == "__main__":
    test_document_session_pipeline_suite()
