from fastapi import APIRouter, UploadFile, File, HTTPException, status
from typing import Dict, Any
from app.services.parser_service import DocumentParserService

router = APIRouter()

@router.post("/upload", response_model=Dict[str, Any])
async def upload_and_parse_cv(file: UploadFile = File(...)):
    """Uploads a PDF or DOCX resume and extracts structured content, contact info, and skills."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")
    
    ext = file.filename.split(".")[-1].lower()
    if ext not in ["pdf", "docx", "doc", "txt"]:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '.{ext}'. Please upload a PDF or DOCX file."
        )

    try:
        content = await file.read()
        parsed_data = DocumentParserService.parse_document(content, file.filename)
        return {
            "status": "success",
            "message": "File parsed successfully.",
            "data": parsed_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing document: {str(e)}"
        )
