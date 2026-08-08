from fastapi import APIRouter, UploadFile, File, HTTPException, status
from typing import Dict, Any
from app.services.document_intelligence.upload_service import UploadService
from app.services.document_intelligence.parser_engine import DocumentParserEngine
from app.services.document_intelligence.section_detector import classify_raw_sections
from app.services.document_intelligence.normalizer_engine import normalize_candidate_data
from app.services.document_intelligence.quality_engine import DocumentQualityAuditor
from app.services.document_intelligence.smart_block_detector import SmartBlockDetector
from app.services.document_intelligence.validator_engine import ValidatorEngine
from app.services.ats_x.ats_scoring_engine import ATSScoringEngine

router = APIRouter(prefix="/api/v1/document", tags=["Document Intelligence Platform"])

from app.services.document_intelligence.ingestion_pipeline import DocumentIngestionPipeline

@router.post("/parse")
async def parse_document_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    CV OPTIMETER AI ENTERPRISE PIPELINE ENDPOINT
    Executes DocumentIngestionPipeline, builds DocumentSession, and evaluates 12-Dimension ATS.
    """
    contents = await file.read()
    filename = file.filename or "uploaded_cv.pdf"

    try:
        session = DocumentIngestionPipeline.process_document(contents, filename, file.content_type or "")
        normalized_cv = session.candidate_cv
        sections = classify_raw_sections(normalized_cv.get("rawSections", {}))
        audits = DocumentQualityAuditor.audit_cv_quality(normalized_cv)
        blocks = SmartBlockDetector.detect_visual_blocks(normalized_cv)
        validation_audit = ValidatorEngine.validate_and_audit(normalized_cv)
        ats_result = ATSScoringEngine.evaluate_cv_ats_x(normalized_cv)

        return {
            "session": session.model_dump(),
            "candidateCv": normalized_cv,
            "detectedSections": sections,
            "qualityAudits": audits,
            "validationAudit": validation_audit,
            "smartBlocks": blocks,
            "ats": ats_result,
            "sourceMap": session.source_map,
            "confidence": session.confidence,
            "metadata": {
                "filename": filename,
                "parsedSuccessfully": True,
                "atsScore": ats_result.get("overallScore", 85)
            }
        }
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Ingestion Error: {str(e)}")
