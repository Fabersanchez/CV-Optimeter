"""
DOCUMENT INTELLIGENCE ENGINE V2 - PARSER ORCHESTRATOR
Polymorphic Router for PDF, DOCX, DOC, TXT, RTF, MD, and HTML files.
"""

from typing import Dict, Any
from .parsers import (
    BaseDocumentParser,
    ExtractedDocumentResult,
    PdfParser,
    DocxParser,
    TxtParser,
    RtfParser,
    MarkdownParser,
    HtmlParser
)
from .section_classifier import MultilingualSectionClassifier
from .normalizer_engine import normalize_candidate_data

class DocumentParserEngine:
    @staticmethod
    def get_parser_for_filename(filename: str) -> BaseDocumentParser:
        ext = filename.lower().split(".")[-1] if "." in filename else "pdf"

        if ext == "pdf":
            return PdfParser()
        elif ext in ["docx", "doc"]:
            return DocxParser()
        elif ext == "rtf":
            return RtfParser()
        elif ext in ["md", "markdown"]:
            return MarkdownParser()
        elif ext in ["html", "htm"]:
            return HtmlParser()
        else:
            return TxtParser()

    @staticmethod
    def parse_bytes(file_bytes: bytes, filename: str = "document.pdf") -> Dict[str, Any]:
        """
        Main entry point for multi-format document parsing.
        Executes specialized format parser -> multilingual classifier -> CandidateCVSchema.
        """
        parser = DocumentParserEngine.get_parser_for_filename(filename)
        extracted_result: ExtractedDocumentResult = parser.parse(file_bytes, filename)

        # Classify sections and build normalized CandidateCVSchema dict
        cv_dict = MultilingualSectionClassifier.classify_and_build_schema(extracted_result, filename)
        
        return normalize_candidate_data(cv_dict)


def parse_text_into_cv_structure(raw_text: str, filename: str = "document.pdf") -> Dict[str, Any]:
    """Backward compatibility bridge for raw text inputs"""
    txt_parser = TxtParser()
    extracted = txt_parser.parse(raw_text.encode("utf-8"), filename)
    cv_dict = MultilingualSectionClassifier.classify_and_build_schema(extracted, filename)
    return normalize_candidate_data(cv_dict)
