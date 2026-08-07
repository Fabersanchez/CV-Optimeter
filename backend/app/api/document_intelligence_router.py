from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Dict, Any
from ..services.document_intelligence.parser_engine import DocumentParserEngine
from ..services.document_intelligence.section_detector import SectionDetectorEngine
from ..services.document_intelligence.normalizer_engine import NormalizerEngine
from ..services.document_intelligence.quality_engine import QualityEngine
from ..services.document_intelligence.smart_block_detector import SmartBlockDetectorEngine

router = APIRouter(prefix="/api/v1/document", tags=["Document Intelligence Platform"])

@router.post("/parse")
async def parse_document_endpoint(file: UploadFile = File(...)) -> Dict[str, Any]:
    """Parses PDF, DOCX, DOC, TXT, RTF, Markdown into normalized CandidateCVSchema."""
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty document payload.")

    parsed_cv = DocumentParserEngine.parse_bytes(contents, file.filename or "uploaded_cv.pdf")
    sections = SectionDetectorEngine.detect_sections(parsed_cv)
    normalized_cv = NormalizerEngine.normalize_cv(parsed_cv)
    audits = QualityEngine.audit_cv(normalized_cv)
    blocks = SmartBlockDetectorEngine.detect_blocks(normalized_cv)

    return {
        "candidateCv": normalized_cv.dict(),
        "detectedSections": sections,
        "qualityAudits": audits,
        "smartBlocks": blocks
    }
