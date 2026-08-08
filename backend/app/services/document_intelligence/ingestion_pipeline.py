"""
CV OPTIMETER IMPORT PIPELINE V3 - DOCUMENT INGESTION PIPELINE
Executes 9-stage asynchronous/synchronous document ingestion with step-by-step state machine transitions and zero infinite loading.
"""

import time
import base64
from typing import Dict, Any, Optional
from app.services.document_intelligence.document_session import document_session_store, DocumentSession
from app.services.document_intelligence.document_geometry import GeometryExtractor
from app.services.document_intelligence.section_classifier import MultilingualSectionClassifier
from app.services.document_intelligence.experience_extractor import ExperienceExtractor
from app.services.document_intelligence.education_extractor import EducationExtractor
from app.services.document_intelligence.semantic_validation_engine import SemanticValidationEngine
from app.services.document_intelligence.document_reconstruction_engine import DocumentReconstructionEngine
from app.services.document_intelligence.visual_fidelity_engine import VisualFidelityEngine
from app.services.document_intelligence.source_map_engine import SourceMapEngine
from app.services.document_intelligence.document_event_bus import document_event_bus, DocumentEventType


class DocumentIngestionPipeline:
    @staticmethod
    def process_document(
        file_bytes: bytes,
        filename: str,
        content_type: str = "application/pdf",
        session_id: Optional[str] = None
    ) -> DocumentSession:
        if not session_id:
            session = document_session_store.create_session(filename, file_bytes, content_type)
            session_id = session.session_id

        document_event_bus.emit(session_id, DocumentEventType.DOCUMENT_UPLOAD_STARTED, message="Upload started", details={"filename": filename})
        document_event_bus.emit(session_id, DocumentEventType.DOCUMENT_UPLOADED, message="Document uploaded", details={"filename": filename})

        try:
            # Stage 1: File Validation (15%)
            document_session_store.update_state(
                session_id, "VALIDATING", 15, "file_validation", "Validando tipo y estructura de archivo..."
            )
            document_event_bus.emit(session_id, DocumentEventType.DOCUMENT_PARSING_STARTED, message="Parsing started", details={"size": len(file_bytes)})
            if not file_bytes or len(file_bytes) == 0:
                raise ValueError("Uploaded file payload is empty (0 bytes).")

            # Stage 2: Parsing & Multiformat Extraction (30%)
            document_session_store.update_state(
                session_id, "PARSING", 30, "parsing_geometry", "Parseando formato de documento..."
            )
            
            raw_text = ""
            geometry = None
            is_pdf = filename.lower().endswith(".pdf") or file_bytes.startswith(b"%PDF")
            is_docx = filename.lower().endswith((".docx", ".doc"))

            if is_pdf:
                geometry = GeometryExtractor.extract_pdf_geometry(file_bytes, session_id)
                extracted_lines = [elem.text for p in geometry.pages for elem in p.elements if elem.text]
                raw_text = "\n".join(extracted_lines)

            if not raw_text or not is_pdf:
                # Text / DOCX / Markdown / HTML / Fallback Text Parser
                try:
                    raw_text = file_bytes.decode("utf-8", errors="ignore")
                except Exception:
                    raw_text = str(file_bytes)

            if not geometry:
                # Build dummy geometry for text/docx documents
                geometry = GeometryExtractor.extract_pdf_geometry(b"", session_id)

            # Stage 3: Raw Text Extraction & Section Classification (45%)
            document_session_store.update_state(
                session_id, "EXTRACTING", 45, "extracting_content", "Extrayendo secciones principales y experiencia..."
            )

            # Stage 4: Multilingual Classification (60%)
            document_session_store.update_state(
                session_id, "NORMALIZING", 60, "classifying_sections", "Clasificando secciones en CandidateCVSchema..."
            )
            classified = MultilingualSectionClassifier.classify_and_structure(raw_text)

            # Stage 5: Entity Extractors (70%)
            exp_list = ExperienceExtractor.extract_experiences(raw_text)
            edu_list = EducationExtractor.extract_educations(raw_text)

            contact_name = classified.get("contact", {}).get("name") or filename.split(".")[0].replace("_", " ").title()
            email = classified.get("contact", {}).get("email") or "candidate@email.com"

            candidate_cv = {
                "id": f"cv-{session_id[-8:]}",
                "title": f"{contact_name} Resume",
                "contact": {
                    "name": contact_name,
                    "title": classified.get("contact", {}).get("title", ""),
                    "email": email,
                    "phone": classified.get("contact", {}).get("phone", ""),
                    "location": classified.get("contact", {}).get("location", ""),
                    "linkedin": classified.get("contact", {}).get("linkedin", ""),
                    "github": classified.get("contact", {}).get("github", ""),
                    "website": classified.get("contact", {}).get("website", ""),
                    "photoUrl": None
                },
                "summary": classified.get("summary", ""),
                "experience": exp_list or classified.get("experience", []),
                "education": edu_list or classified.get("education", []),
                "skillGroups": classified.get("skillGroups", []),
                "projects": classified.get("projects", []),
                "certifications": classified.get("certifications", []),
                "languages": classified.get("languages", []),
                "achievements": [],
                "socialLinks": [],
                "customSections": [],
                "sectionOrder": ["summary", "experience", "skills", "education", "certifications", "languages"]
            }

            # Stage 6: Semantic Validation (78%)
            document_session_store.update_state(
                session_id, "VALIDATING", 78, "semantic_validation", "Validando coherencia y reglas semánticas..."
            )
            validation_res = SemanticValidationEngine.validate_candidate_schema(candidate_cv)
            candidate_cv = validation_res.sanitized_schema

            # Stage 7: Document Render Model Assembly (86%)
            document_session_store.update_state(
                session_id, "BUILDING_RENDER_MODEL", 86, "building_render_model", "Construyendo modelo de renderizado por regiones..."
            )
            render_model = DocumentReconstructionEngine.reconstruct_render_model(session_id, geometry, candidate_cv)

            # Stage 8: Template Application & Visual Rendering (94%)
            document_session_store.update_state(
                session_id, "RENDERING", 94, "rendering_document", "Aplicando plantilla visual y verificando fidelidad QA..."
            )
            fidelity_report = VisualFidelityEngine.evaluate_reconstruction_fidelity(session_id, geometry, render_model, candidate_cv)

            # Save completed session data
            session = document_session_store.get_session(session_id)
            session.raw_content = raw_text
            session.normalized_content = raw_text
            session.candidate_cv = candidate_cv
            session.source_map = SourceMapEngine.generate_source_map(candidate_cv, raw_text, filename, 1)
            session.confidence = {"overall": validation_res.overall_confidence}

            document_event_bus.emit(session_id, DocumentEventType.DOCUMENT_VALIDATED, message="Validated", details={"candidate_name": contact_name})
            document_event_bus.emit(session_id, DocumentEventType.ATS_ANALYSIS_COMPLETED, message="ATS Evaluated", details={"confidence": validation_res.overall_confidence})
            document_event_bus.emit(session_id, DocumentEventType.DOCUMENT_RENDERED, message="Rendered", details={"template": session.template})
            document_event_bus.emit(session_id, DocumentEventType.DOCUMENT_SESSION_READY, message="Session Ready", details={"session_id": session_id})

            # Stage 9: Pipeline Completed (100%)
            document_session_store.update_state(
                session_id, "COMPLETED", 100, "completed", "¡DocumentSession procesada exitosamente!"
            )

            return session

        except Exception as e:
            print(f"[DocumentIngestionPipeline Error]: {e}")
            document_session_store.update_state(
                session_id,
                status="FAILED",
                progress=0,
                step="failed",
                description="Error durante el procesamiento del documento.",
                error_code="PIPELINE_PROCESSING_ERROR",
                error_message=str(e)
            )
            session = document_session_store.get_session(session_id)
            if session:
                return session
            raise e
