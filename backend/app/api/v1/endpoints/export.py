from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from typing import Dict, Any
from app.services.export_service import ExportService

router = APIRouter()

class ExportRequest(BaseModel):
    parsed_cv: Dict[str, Any]
    format: str = "html" # html, docx, pdf

@router.post("/render")
async def export_resume(request: ExportRequest):
    """Exports parsed CV data to HTML or plain text."""
    if not request.parsed_cv:
        raise HTTPException(status_code=400, detail="Missing parsed CV data.")
    
    html_content = ExportService.generate_html(request.parsed_cv)
    
    if request.format == "html":
        return Response(content=html_content, media_type="text/html")
    
    return {
        "status": "success",
        "format": request.format,
        "html_preview": html_content
    }
