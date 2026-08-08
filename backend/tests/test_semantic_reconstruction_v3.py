"""
CV OPTIMETER SEMANTIC ENGINE V3.0 - REAL WORLD QA TEST SUITE
Verifies real CV document parsing, zero text bleeding into summary, clean Experience & Education extraction, and zero fake demo candidate data.
"""

from app.services.document_intelligence.parsers import ExtractedDocumentResult
from app.services.document_intelligence.section_classifier import MultilingualSectionClassifier
from app.services.document_intelligence.date_entity_parser import DateEntityParser
from app.services.document_intelligence.experience_extractor import ExperienceExtractor
from app.services.document_intelligence.semantic_validation_engine import SemanticValidationEngine
from app.services.document_intelligence.cv_schema import CandidateCVSchema

REAL_SPANISH_CV_TEXT = """
CARLOS EDUARDO SILVA
Auxiliar Técnico de Contenedores Refrigerados & Logistics Specialist
carlos.silva@email.com | +57 300 987 6543 | Cartagena, Colombia | linkedin.com/in/carlossilva

PERFIL PROFESIONAL
Técnico especializado en mantenimiento, inspección PTI y monitoreo de unidades de refrigeración Reefer en instalaciones portuarias. 8 años de experiencia garantizando la cadena de frío para exportación marítima.

EXPERIENCIA LABORAL

Sociedad Portuaria de Cartagena | Auxiliar Técnico de Contenedores
Septiembre 2021 - Presente
- Monitoreo continuo de unidades Reefers y control de temperatura en patio.
- Ejecución de protocolos PTI (Pre-Trip Inspection) previo a embarque.
- Configuración de atmósfera controlada para productos perecederos.
- Calibración y registro de sensores USDA para exportación de frutas.

Servicios Portuarios del Caribe S.A. | Inspector Técnico Reefer
Mayo 2018 - Agosto 2021
- Inspección estructural y eléctrica de unidades Carrier, Thermo King y Daikin.
- Detección y reparación rápida de fallas en compresores e intercambiadores.

EDUCACIÓN ACADÉMICA
SENA Regional Bolívar | Tecnólogo en Mantenimiento Electromecánico
2015 - 2017

APTITUDES Y COMPETENCIAS
Monitoreo Reefer, Protocolos PTI, Atmósfera Controlada, Sensores USDA, Carrier, Thermo King, Daikin, PLC Industrial, Normativa ISO 1496
"""


def test_semantic_reconstruction_v3_suite():
    print("=== CV OPTIMETER SEMANTIC RECONSTRUCTION V3.0 QA SUITE ===")

    # 1. Parse Real Spanish CV
    extracted = ExtractedDocumentResult(
        clean_text=REAL_SPANISH_CV_TEXT,
        photo_base64="data:image/jpeg;base64,mockphotobyte",
        engine_used="PyMuPDF",
        format_detected="PDF",
        page_count=1
    )

    schema = MultilingualSectionClassifier.classify_and_build_schema(extracted, "Carlos_Silva_CV.pdf")

    # 2. Verify Candidate Contact Details
    contact = schema["contact"]
    assert contact["name"] == "CARLOS EDUARDO SILVA", f"FAIL: Name extracted incorrectly ({contact['name']})"
    assert contact["email"] == "carlos.silva@email.com", f"FAIL: Email extracted incorrectly ({contact['email']})"
    assert contact["phone"] == "+57 300 987 6543", f"FAIL: Phone extracted incorrectly ({contact['phone']})"
    print(f"[OK] Candidate Contact Extracted: {contact['name']} | {contact['email']} | {contact['phone']}")

    # 3. Verify Professional Summary (ZERO BLEED)
    summary = schema["summary"]
    assert "Septiembre 2021" not in summary, "FAIL: Experience date bled into summary!"
    assert "Sociedad Portuaria" not in summary, "FAIL: Company name bled into summary!"
    assert "Técnico especializado en mantenimiento" in summary, "FAIL: Real profile missing from summary"
    print(f"[OK] Professional Summary Clean (0 Bleed): '{summary[:80]}...'")

    # 4. Verify Experience Entities
    experiences = schema["experience"]
    assert len(experiences) >= 2, f"FAIL: Expected at least 2 experience items, got {len(experiences)}"
    exp1 = experiences[0]
    assert exp1["company"] != "", "FAIL: Company name missing from experience 1"
    assert exp1["startDate"] != "", "FAIL: Start date missing from experience 1"
    assert len(exp1["bullets"]) >= 3, f"FAIL: Expected at least 3 bullets in experience 1, got {len(exp1['bullets'])}"
    print(f"[OK] Experience Item 1: Position='{exp1['role']}', Company='{exp1['company']}', Dates='{exp1['startDate']} - {exp1['endDate']}', Bullets={len(exp1['bullets'])}")

    # 5. Verify Education & Skills
    education = schema["education"]
    assert len(education) >= 1, "FAIL: Education missing"
    skills = schema["skillGroups"][0]["skills"]
    assert len(skills) >= 5, f"FAIL: Expected skills, got {len(skills)}"
    print(f"[OK] Education Extracted: {education[0]['institution']} | Skills Count={len(skills)}")

    # 6. Verify Semantic Validation Engine
    assert schema.get("semantic_confidence", 0) >= 0.85, f"FAIL: Low semantic confidence ({schema.get('semantic_confidence')})"
    print(f"[OK] Semantic Validation Engine Confidence: {schema.get('semantic_confidence')} (Requires Review={schema.get('requires_review')})")

    # 7. Verify Schema Integrity
    candidate_model = CandidateCVSchema.model_validate(schema)
    assert candidate_model.contact.name == "CARLOS EDUARDO SILVA", "FAIL: Schema name validation"
    assert len(candidate_model.experience) >= 2, "FAIL: Schema experience count validation"
    print("[OK] CandidateCVSchema Pydantic Model Validated 100%")

    print("\n[OK] ALL SEMANTIC RECONSTRUCTION V3.0 QA TESTS PASSED 100%!\n")


if __name__ == "__main__":
    test_semantic_reconstruction_v3_suite()
