"""
DOCUMENT INTELLIGENCE ENGINE V2 - HYBRID MULTI-PASS PDF PARSER
Strategy:
  Pass 1: pdfplumber (High-Precision Table & Layout Parsing)
  Pass 2: PyMuPDF (fitz) (Fast Structural Rendering & Image Extraction)
  Pass 3: pdfminer.six (Deep PDF Token Parsing)
  Pass 4: OCR (Fallback for scanned PDF images)
"""

import io
import re
import time
import base64
from typing import Optional, List
from PIL import Image

import fitz  # PyMuPDF
import pdfplumber
import pypdf
from pdfminer.high_level import extract_text as pdfminer_extract_text

from .base_parser import BaseDocumentParser, ExtractedDocumentResult

try:
    import pytesseract
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False


def sanitize_pdf_text_output(raw_text: str) -> str:
    """
    Strips raw PDF stream objects, font encodings, and binary stream garbage.
    Guarantees zero %EOF or PDF stream leakage.
    """
    if not raw_text:
        return ""

    clean = raw_text

    # Eradicate raw PDF headers, trailers, object blocks, and stream markers line-by-line
    clean = re.sub(r"%PDF-\d\.\d", "", clean, flags=re.I)
    clean = re.sub(r"<<[\s\S]*?>>", "", clean)
    clean = re.sub(r"\d+\s+\d+\s+R\s*\[[\s\S]*?\]", "", clean, flags=re.I)
    clean = re.sub(r"\b\d+\s+\d+\s+obj\b", "", clean, flags=re.I)
    clean = re.sub(r"\bendobj\b", "", clean, flags=re.I)
    clean = re.sub(r"\bstream\b[\s\S]*?\bendstream\b", "", clean, flags=re.I)
    clean = re.sub(r"/[A-Za-z0-9_]+\b", "", clean)
    clean = re.sub(r"\b\d+\s+\d+\s+R\b", "", clean)
    clean = re.sub(r"\b(xref|trailer|startxref|%EOF)\b", "", clean, flags=re.I)
    clean = re.sub(r"[^\x20-\x7E\xA0-\xFF\n\r\t]", " ", clean)

    # Filter out stream noise lines
    clean_lines = []
    for line in clean.split("\n"):
        s = line.strip()
        if len(s) < 2:
            continue
        if re.search(r"^\d+(\s+\d+)*$", s):
            continue
        if re.search(r"^\d+\s*R$", s, re.I):
            continue
        if s.lower() in ["null", "none", "undefined", "20 null", "%eof"]:
            continue
        if s.startswith("[") and s.endswith("]"):
            continue
        clean_lines.append(s)

    return "\n".join(clean_lines).strip()


class PdfParser(BaseDocumentParser):
    def parse(self, file_bytes: bytes, filename: str = "document.pdf") -> ExtractedDocumentResult:
        start_time = time.time()
        extracted_text = ""
        engine_used = "pdfplumber"
        page_count = 1
        photo_base64: Optional[str] = None

        # ------------------------------------------------------------------
        # PASS 1: pdfplumber
        # ------------------------------------------------------------------
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                page_count = len(pdf.pages)
                pages_text = []
                for p in pdf.pages:
                    txt = p.extract_text(layout=True) or p.extract_text()
                    if txt:
                        pages_text.append(txt)
                extracted_text = "\n".join(pages_text)
        except Exception as e:
            print(f"[PdfParser Pass 1 Exception] pdfplumber failed: {e}")
            extracted_text = ""

        # Clean output from Pass 1
        clean_pass1 = sanitize_pdf_text_output(extracted_text)

        # ------------------------------------------------------------------
        # PASS 2: PyMuPDF (fitz) (If Pass 1 produced insufficient text)
        # ------------------------------------------------------------------
        if len(clean_pass1.split()) < 30:
            try:
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                page_count = len(doc)
                pages_text = []
                for page in doc:
                    txt = page.get_text("text")
                    if txt:
                        pages_text.append(txt)
                fitz_text = "\n".join(pages_text)
                clean_pass2 = sanitize_pdf_text_output(fitz_text)
                if len(clean_pass2.split()) > len(clean_pass1.split()):
                    clean_pass1 = clean_pass2
                    engine_used = "PyMuPDF (fitz)"
            except Exception as e:
                print(f"[PdfParser Pass 2 Exception] PyMuPDF failed: {e}")

        # ------------------------------------------------------------------
        # PASS 3: pdfminer.six (If Pass 1 & Pass 2 produced < 30 words)
        # ------------------------------------------------------------------
        if len(clean_pass1.split()) < 30:
            try:
                miner_text = pdfminer_extract_text(io.BytesIO(file_bytes))
                clean_pass3 = sanitize_pdf_text_output(miner_text)
                if len(clean_pass3.split()) > len(clean_pass1.split()):
                    clean_pass1 = clean_pass3
                    engine_used = "pdfminer.six"
            except Exception as e:
                print(f"[PdfParser Pass 3 Exception] pdfminer.six failed: {e}")

        # ------------------------------------------------------------------
        # PASS 4: OCR (For image-only / scanned PDFs)
        # ------------------------------------------------------------------
        if len(clean_pass1.split()) < 20 and OCR_AVAILABLE:
            try:
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                ocr_pages = []
                for page in doc:
                    pix = page.get_pixmap(dpi=150)
                    img = Image.open(io.BytesIO(pix.tobytes()))
                    ocr_text = pytesseract.image_to_string(img, lang="eng+spa")
                    if ocr_text:
                        ocr_pages.append(ocr_text)
                ocr_result = "\n".join(ocr_pages)
                clean_ocr = sanitize_pdf_text_output(ocr_result)
                if len(clean_ocr.split()) > 15:
                    clean_pass1 = clean_ocr
                    engine_used = "OCR (Tesseract)"
            except Exception as e:
                print(f"[PdfParser Pass 4 Exception] OCR failed: {e}")

        # ------------------------------------------------------------------
        # CANDIDATE PHOTO EXTRACTION (PyMuPDF Image Extraction)
        # ------------------------------------------------------------------
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                for img_info in page.get_images():
                    xref = img_info[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    ext = base_image["ext"]

                    # Filter candidate profile photo based on dimensions
                    img = Image.open(io.BytesIO(image_bytes))
                    width, height = img.size
                    if 120 <= width <= 800 and 120 <= height <= 800:
                        aspect_ratio = width / float(height)
                        if 0.65 <= aspect_ratio <= 1.35:
                            b64 = base64.b64encode(image_bytes).decode("utf-8")
                            photo_base64 = f"data:image/{ext};base64,{b64}"
                            break
                if photo_base64:
                    break
        except Exception as e:
            print(f"[PdfParser Photo Extraction Warning]: {e}")

        # If no photo embedded in PDF, keep photo_base64 as None (NO fake stock photo injection)
        if not photo_base64:
            photo_base64 = None

        elapsed_ms = (time.time() - start_time) * 1000

        return ExtractedDocumentResult(
            clean_text=clean_pass1,
            photo_base64=photo_base64,
            engine_used=engine_used,
            format_detected="PDF",
            page_count=page_count,
            execution_time_ms=elapsed_ms,
            extraction_metadata={"word_count": len(clean_pass1.split()), "ocr_triggered": "OCR" in engine_used}
        )
