"""
DOCUMENT INTELLIGENCE ENGINE V2 - DOCX & DOC PARSER
Reads Word documents using python-docx and extracts embedded candidate headshots.
"""

import io
import time
import base64
from typing import Optional
from PIL import Image
import docx

from .base_parser import BaseDocumentParser, ExtractedDocumentResult

class DocxParser(BaseDocumentParser):
    def parse(self, file_bytes: bytes, filename: str = "document.docx") -> ExtractedDocumentResult:
        start_time = time.time()
        paragraphs = []
        photo_base64: Optional[str] = None
        engine_used = "python-docx"

        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            
            # Paragraph text extraction
            for p in doc.paragraphs:
                txt = p.text.strip()
                if txt:
                    paragraphs.append(txt)

            # Table text extraction
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join([cell.text.strip() for cell in row.cells if cell.text.strip()])
                    if row_text:
                        paragraphs.append(row_text)

            # Candidate Photo Extraction from Word Document Relationships
            for rel in doc.part.rels.values():
                if "image" in rel.target_ref:
                    img_part = rel.target_part
                    img_bytes = img_part.blob
                    try:
                        img = Image.open(io.BytesIO(img_bytes))
                        w, h = img.size
                        if 100 <= w <= 800 and 100 <= h <= 800:
                            aspect_ratio = w / float(h)
                            if 0.65 <= aspect_ratio <= 1.35:
                                b64 = base64.b64encode(img_bytes).decode("utf-8")
                                ext = img.format.lower() if img.format else "jpeg"
                                photo_base64 = f"data:image/{ext};base64,{b64}"
                                break
                    except Exception:
                        continue
        except Exception as e:
            print(f"[DocxParser Exception]: {e}")
            paragraphs = [file_bytes.decode("utf-8", errors="ignore")]

        if not photo_base64:
            photo_base64 = None

        clean_text = "\n".join(paragraphs).strip()
        elapsed_ms = (time.time() - start_time) * 1000

        return ExtractedDocumentResult(
            clean_text=clean_text,
            photo_base64=photo_base64,
            engine_used=engine_used,
            format_detected="DOCX",
            page_count=max(1, len(clean_text.split()) // 350),
            execution_time_ms=elapsed_ms,
            extraction_metadata={"word_count": len(clean_text.split())}
        )
