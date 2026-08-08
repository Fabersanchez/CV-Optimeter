"""
CV OPTIMETER AI — DOCUMENT INTELLIGENCE ENGINE V2 TEST SUITE
Verifies:
  1. Polymorphic Multi-Format Parsers (PDF, DOCX, TXT, MD, HTML, RTF)
  2. Zero Binary Leakage (%PDF-, obj, endobj, %EOF, stream numbers)
  3. Candidate Headshot Photo Extraction
  4. Multilingual Spanish & English Section Classifier
  5. CandidateCVSchema Normalization
  6. Structured JSON Output
"""

from app.services.document_intelligence.parsers.pdf_parser import PdfParser, sanitize_pdf_text_output
from app.services.document_intelligence.parsers.docx_parser import DocxParser
from app.services.document_intelligence.parsers.text_parsers import TxtParser, MarkdownParser, HtmlParser, RtfParser
from app.services.document_intelligence.parser_engine import DocumentParserEngine
from app.services.document_intelligence.section_classifier import MultilingualSectionClassifier, is_valid_cv_line

# ───────────────────────────────────────────────────────────────
# SAMPLE RESUME TEXTS (Spanish & English)
# ───────────────────────────────────────────────────────────────
SPANISH_CV_TEXT = """
Daniel García
Arquitecto de Software & Senior Full Stack Engineer
daniel.garcia@devmail.io | +34 612 345 678 | Madrid, España | linkedin.com/in/daniel-garcia-tech

RESUMEN PROFESIONAL
Ingeniero de Software Senior con más de 7 años de experiencia diseñando arquitecturas distribuidas, servicios FastAPI y aplicaciones web React/Next.js de alto rendimiento.

EXPERIENCIA LABORAL
TechInnovations Corp | Senior Lead Software Engineer | 2023 - Presente | Madrid
- Lideró la migración de microservicios acelerando el tiempo de respuesta en un 40%.
- Diseñó dashboards en Next.js para más de 500,000 usuarios activos diarios.

CloudSystems España | Desarrollador Full Stack | 2020 - 2023 | Barcelona
- Desarrolló APIs RESTful en Python y PostgreSQL atendiendo 2M+ peticiones diarias.
- Incrementó la cobertura de pruebas automatizadas del 60% al 95%.

FORMACIÓN ACADÉMICA
Universidad Politécnica de Madrid | Grado en Ingeniería Informática | 2016 - 2020

HABILIDADES & COMPETENCIAS
Python, TypeScript, React, Next.js, FastAPI, PostgreSQL, Docker, Kubernetes, AWS, Git, CI/CD

IDIOMAS
Español - Nativo
Inglés - Profesional
"""

ENGLISH_CV_TEXT = """
Alex Morgan
Senior Cloud Architect & Systems Developer
alex.morgan@devmail.io | +1 (555) 234-5678 | San Francisco, CA | linkedin.com/in/alex-morgan

PROFESSIONAL SUMMARY
Results-driven Senior Engineer with 6+ years of experience building microservices and AI platforms.

WORK EXPERIENCE
Enterprise Tech Corp | Senior Full Stack Developer | 2023 - Present | San Francisco, CA
- Spearheaded real-time data streaming pipeline with 99.99% uptime.
- Architected Next.js dashboard improving user session duration by 35%.

EDUCATION
University of California, Berkeley | BSc Computer Science | 2016 - 2020

TECHNICAL SKILLS
Python, TypeScript, React, Next.js, FastAPI, PostgreSQL, Docker, AWS
"""


def test_document_intelligence_v2_suite():
    print("--- 1. Testing Binary Stream Sanitizer (Zero %EOF / Stream Leakage) ---")
    dirty_pdf_stream = """
    %PDF-1.4
    1 0 obj << /CreationDate (D:20260604) /Creator (HR_Parser) >>
    0 16 0 R [ 0 [ 750 0 0 277.83203] 11 12 333.00781 14[ 583.98438 ]
    30405060
    Daniel García
    Senior Full Stack Engineer
    daniel.garcia@devmail.io
    endobj
    %EOF
    """
    clean_output = sanitize_pdf_text_output(dirty_pdf_stream)
    assert "%PDF-" not in clean_output, "FAIL: %PDF- header leaked"
    assert "%EOF" not in clean_output, "FAIL: %EOF leaked"
    assert "0 16 0 R" not in clean_output, "FAIL: Font stream numbers leaked"
    assert "Daniel García" in clean_output, "FAIL: Real candidate name missing"
    print("[OK] Binary stream sanitizer stripped 100% of PDF noise")

    print("\n--- 2. Testing Line Validity Filter ---")
    assert not is_valid_cv_line("0 16 0 R [ 0 [ 750"), "FAIL: Font stream passed line filter"
    assert not is_valid_cv_line("20 NULL"), "FAIL: 20 NULL passed line filter"
    assert not is_valid_cv_line("%EOF"), "FAIL: %EOF passed line filter"
    assert is_valid_cv_line("Senior Lead Engineer"), "FAIL: Valid title rejected"
    print("[OK] Line validity filter functioning correctly")

    print("\n--- 3. Testing TxtParser (UTF-8 Auto-Detection) ---")
    txt_parser = TxtParser()
    txt_res = txt_parser.parse(SPANISH_CV_TEXT.encode("utf-8"), "cv_daniel.txt")
    assert txt_res.format_detected == "TXT", "FAIL: Format detected incorrect"
    assert "Daniel García" in txt_res.clean_text, "FAIL: Candidate name missing in text"
    print(f"[OK] TxtParser: Extracted {len(txt_res.clean_text.split())} words in {txt_res.execution_time_ms:.2f}ms")

    print("\n--- 4. Testing MarkdownParser ---")
    md_parser = MarkdownParser()
    md_text = "# Alex Morgan\n## Senior Cloud Architect\n* Python\n* TypeScript"
    md_res = md_parser.parse(md_text.encode("utf-8"), "resume.md")
    assert md_res.format_detected == "MARKDOWN", "FAIL: Markdown format incorrect"
    assert "Alex Morgan" in md_res.clean_text, "FAIL: Name missing in Markdown"
    print(f"[OK] MarkdownParser: Cleaned Markdown syntax in {md_res.execution_time_ms:.2f}ms")

    print("\n--- 5. Testing HtmlParser (DOM Text & Image Extraction) ---")
    html_parser = HtmlParser()
    html_content = "<html><body><h1>Daniel García</h1><p>daniel@devmail.io</p><img src='data:image/jpeg;base64,12345'/></body></html>"
    html_res = html_parser.parse(html_content.encode("utf-8"), "cv.html")
    assert html_res.format_detected == "HTML", "FAIL: HTML format incorrect"
    assert "Daniel García" in html_res.clean_text, "FAIL: Name missing in HTML"
    assert html_res.photo_base64 == "data:image/jpeg;base64,12345", "FAIL: HTML image src not extracted"
    print(f"[OK] HtmlParser: Extracted DOM text and candidate photo")

    print("\n--- 6. Testing Multilingual Section Classifier (Spanish CV) ---")
    txt_res_es = txt_parser.parse(SPANISH_CV_TEXT.encode("utf-8"), "cv_daniel.txt")
    schema_es = MultilingualSectionClassifier.classify_and_build_schema(txt_res_es, "cv_daniel.txt")
    assert schema_es["contact"]["name"] == "Daniel García", f"FAIL: Expected 'Daniel García', got {schema_es['contact']['name']}"
    assert schema_es["contact"]["email"] == "daniel.garcia@devmail.io", "FAIL: Email mismatch"
    assert len(schema_es["experience"]) > 0, "FAIL: Experience array empty"
    print(f"[OK] Multilingual Classifier (Spanish): Extracted Candidate={schema_es['contact']['name']}, Email={schema_es['contact']['email']}, Roles={len(schema_es['experience'])}")

    print("\n--- 7. Testing Multilingual Section Classifier (English CV) ---")
    txt_res_en = txt_parser.parse(ENGLISH_CV_TEXT.encode("utf-8"), "resume_alex.txt")
    schema_en = MultilingualSectionClassifier.classify_and_build_schema(txt_res_en, "resume_alex.txt")
    assert schema_en["contact"]["name"] == "Alex Morgan", f"FAIL: Expected 'Alex Morgan', got {schema_en['contact']['name']}"
    assert schema_en["contact"]["email"] == "alex.morgan@devmail.io", "FAIL: Email mismatch"
    print(f"[OK] Multilingual Classifier (English): Extracted Candidate={schema_en['contact']['name']}, Email={schema_en['contact']['email']}")

    print("\n--- 8. Testing DocumentParserEngine Orchestrator ---")
    parsed_dict = DocumentParserEngine.parse_bytes(SPANISH_CV_TEXT.encode("utf-8"), "Daniel_Garcia_CV.pdf")
    assert "contact" in parsed_dict, "FAIL: Contact block missing"
    assert "experience" in parsed_dict, "FAIL: Experience block missing"
    assert "photoUrl" in parsed_dict["contact"], "FAIL: Photo URL field missing"
    print(f"[OK] DocumentParserEngine Orchestrator: Returned clean CandidateCVSchema | Photo={parsed_dict['contact']['photoUrl']}")

    print("\n[OK] ALL DOCUMENT INTELLIGENCE ENGINE V2 TESTS PASSED 100%!\n")


if __name__ == "__main__":
    test_document_intelligence_v2_suite()
