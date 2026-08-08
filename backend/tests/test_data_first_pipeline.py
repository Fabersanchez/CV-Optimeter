"""
CV OPTIMETER DATA-FIRST ARCHITECTURE - END-TO-END PIPELINE QA SUITE
Executes End-to-End: Upload -> DocumentIngestionPipeline -> CandidateCVSchema -> CVSchemaValidator -> Template Selection -> ResumeRenderEngine -> ContentIntegrityChecker -> PDFRenderService.
"""

from app.services.document_intelligence.ingestion_pipeline import DocumentIngestionPipeline
from app.services.document_intelligence.validator_engine import ValidatorEngine
from app.services.document_intelligence.content_integrity_checker import ContentIntegrityChecker
from app.services.template_engine.resume_render_engine import ResumeRenderEngine
from app.services.template_engine.pdf_render_service import PDFRenderService

REAL_CV_BYTES = """
CARLOS EDUARDO SILVA
Auxiliar Técnico de Contenedores Refrigerados & Logistics Specialist
carlos.silva@email.com | +57 300 987 6543 | Cartagena, Colombia

PERFIL PROFESIONAL
Técnico especializado en mantenimiento, inspección PTI y monitoreo de unidades de refrigeración Reefer en instalaciones portuarias. 8 años de experiencia garantizando la cadena de frío.

EXPERIENCIA LABORAL

Sociedad Portuaria de Cartagena | Auxiliar Técnico de Contenedores
Septiembre 2021 - Presente
- Monitoreo continuo de unidades Reefers y control de temperatura en patio.
- Ejecución de protocolos PTI (Pre-Trip Inspection) previo a embarque.
- Configuración de atmósfera controlada para productos perecederos.

Servicios Portuarios del Caribe S.A. | Inspector Técnico Reefer
Mayo 2018 - Agosto 2021
- Inspección estructural y eléctrica de unidades Carrier, Thermo King y Daikin.

EDUCACIÓN ACADÉMICA
SENA Regional Bolívar | Tecnólogo en Mantenimiento Electromecánico
2015 - 2017

APTITUDES Y COMPETENCIAS
Monitoreo Reefer, Protocolos PTI, Atmósfera Controlada, Carrier, Thermo King, Daikin
""".encode("utf-8")


def test_data_first_end_to_end_pipeline():
    print("=== CV OPTIMETER DATA-FIRST PIPELINE END-TO-END QA SUITE ===")

    # STEP 1: Ingest Document Payload
    session = DocumentIngestionPipeline.process_document(REAL_CV_BYTES, "Carlos_Silva_CV.txt")
    assert session.session_id is not None, "FAIL: DocumentSession creation failed"
    print(f"[OK] Step 1 - DocumentIngestionPipeline: Created DocumentSession '{session.session_id}'")

    # STEP 2: CandidateCVSchema Single Source of Truth
    cv = session.candidate_cv
    assert cv["contact"]["name"] == "CARLOS EDUARDO SILVA", f"FAIL: Candidate name mismatch ({cv['contact']['name']})"
    assert cv["contact"]["email"] == "carlos.silva@email.com", f"FAIL: Candidate email mismatch ({cv['contact']['email']})"
    assert len(cv["experience"]) >= 2, f"FAIL: Expected at least 2 experience entries, got {len(cv['experience'])}"
    print(f"[OK] Step 2 - CandidateCVSchema: Name='{cv['contact']['name']}' | Email='{cv['contact']['email']}' | Experiences={len(cv['experience'])}")

    # STEP 3: CVSchemaValidator Audit
    val_audit = ValidatorEngine.validate_and_audit(cv)
    assert val_audit["validations"]["emailValid"], "FAIL: Schema validation failed"
    print(f"[OK] Step 3 - CVSchemaValidator: Audit Passed (Email Valid={val_audit['validations']['emailValid']})")

    # STEP 4 & 5: Apply Multiple Templates & Render
    for t_id in ["ats-professional", "executive", "technology", "minimalist"]:
        rendered = ResumeRenderEngine.render_candidate_cv(session.session_id, cv, t_id)
        assert len(rendered.html_content) > 200, f"FAIL: Render html too short for template {t_id}"
        
        # STEP 6: ContentIntegrityChecker (Zero Data Loss)
        integrity = ContentIntegrityChecker.verify_integrity(cv, rendered.html_content)
        assert integrity.is_valid, f"FAIL: Content integrity lost on template {t_id}: {integrity.missing_fields}"
        assert integrity.preservation_score == 100.0, f"FAIL: Preservation score below 100% ({integrity.preservation_score}%)"
        print(f"[OK] Step 4-6 - RenderEngine + Integrity Checker on '{t_id}': Preservation Score={integrity.preservation_score}% (Zero Data Loss)")

    # STEP 7: Production PDF Export
    rendered_doc = ResumeRenderEngine.render_candidate_cv(session.session_id, cv, "ats-professional")
    pdf_bytes = PDFRenderService.generate_pdf_bytes(rendered_doc)
    assert len(pdf_bytes) > 200, "FAIL: PDF bytes generation failed"
    print(f"[OK] Step 7 - PDFRenderService: Generated production PDF bytes ({len(pdf_bytes)} bytes)")

    print("\n[OK] ALL DATA-FIRST END-TO-END PIPELINE TESTS PASSED 100%!\n")


if __name__ == "__main__":
    test_data_first_end_to_end_pipeline()
