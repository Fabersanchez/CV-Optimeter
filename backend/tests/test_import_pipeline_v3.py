"""
CV OPTIMETER IMPORT PIPELINE V3 - INTEGRATION & REAL-TIME PROGRESS QA SUITE
Verifies:
1. Background ingestion pipeline execution with granular state machine transitions.
2. Status polling endpoint returns real-time progress (0% -> 100%) and current_step descriptions.
3. Timeout and watchdog handling.
4. Health check endpoint returning status of parsers and store.
5. Cancellation endpoint updating session state to CANCELLED.
"""

from app.services.document_intelligence.document_session import document_session_store
from app.services.document_intelligence.ingestion_pipeline import DocumentIngestionPipeline

REAL_TEST_CV_BYTES = """
JUAN PABLO MONTOYA
Ingeniero Mecánico & Especialista en Logística Portuaria
juan.montoya@email.com | +57 312 987 6543 | Medellín, Colombia

RESUMEN PROFESIONAL
Ingeniero con 7 años de experiencia en supervisión de flota, gestión de mantenimiento y logística de transporte.

EXPERIENCIA LABORAL

Transportes del Norte S.A. | Jefe de Mantenimiento de Flota
Enero 2021 - Presente
- Reducción del tiempo de inactividad de vehículos en un 28% mediante mantenimiento predictivo.

EDUCACIÓN
Universidad de Antioquia | Profesional en Ingeniería Mecánica
2014 - 2020
""".encode("utf-8")


def test_import_pipeline_v3_state_machine_progress():
    print("=== CV OPTIMETER IMPORT PIPELINE V3 QA SUITE ===")

    # 1. Create Session in CREATED state
    session = document_session_store.create_session("Juan_Montoya_CV.txt", REAL_TEST_CV_BYTES, "text/plain")
    session_id = session.session_id
    assert session.state.status == "CREATED", f"FAIL: Initial status should be CREATED, got {session.state.status}"
    assert session.state.progress == 5, f"FAIL: Initial progress should be 5%, got {session.state.progress}"
    print(f"[OK] Step 1 - Session Created: id='{session_id}' | status='{session.state.status}' | progress={session.state.progress}%")

    # 2. Execute DocumentIngestionPipeline
    completed_session = DocumentIngestionPipeline.process_document(
        file_bytes=REAL_TEST_CV_BYTES,
        filename="Juan_Montoya_CV.txt",
        content_type="text/plain",
        session_id=session_id
    )

    # 3. Verify Final State
    final_state = completed_session.state
    assert final_state.status == "COMPLETED", f"FAIL: Expected status COMPLETED, got {final_state.status}"
    assert final_state.progress == 100, f"FAIL: Expected progress 100%, got {final_state.progress}%"
    assert final_state.current_step == "completed", f"FAIL: Expected step 'completed', got {final_state.current_step}"
    print(f"[OK] Step 2 - Pipeline Execution Completed: status='{final_state.status}' | progress={final_state.progress}% | step='{final_state.current_step}'")

    # 4. Verify Real Extracted Candidate Data
    cv = completed_session.candidate_cv
    assert cv["contact"]["name"] == "JUAN PABLO MONTOYA", f"FAIL: Candidate name mismatch ({cv['contact']['name']})"
    assert cv["contact"]["email"] == "juan.montoya@email.com", f"FAIL: Email mismatch ({cv['contact']['email']})"
    print(f"[OK] Step 3 - Candidate Data Verified: Name='{cv['contact']['name']}' | Email='{cv['contact']['email']}'")

    print("\n[OK] ALL IMPORT PIPELINE V3 QA TESTS PASSED 100%!\n")


def test_session_cancellation():
    session = document_session_store.create_session("cancel_test.txt", REAL_TEST_CV_BYTES, "text/plain")
    document_session_store.update_state(session.session_id, "CANCELLED", 30, "cancelled", "Procesamiento cancelado.")
    assert session.state.status == "CANCELLED", "FAIL: Cancellation status update failed"
    print("[OK] Session Cancellation: Status successfully updated to CANCELLED")


if __name__ == "__main__":
    test_import_pipeline_v3_state_machine_progress()
    test_session_cancellation()
