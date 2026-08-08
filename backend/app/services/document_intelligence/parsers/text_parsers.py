"""
DOCUMENT INTELLIGENCE ENGINE V2 - SPECIALIZED TEXT PARSERS
Includes: TxtParser, RtfParser, MarkdownParser, HtmlParser
"""

import re
import time
from typing import Optional
from bs4 import BeautifulSoup

from .base_parser import BaseDocumentParser, ExtractedDocumentResult


class TxtParser(BaseDocumentParser):
    def parse(self, file_bytes: bytes, filename: str = "document.txt") -> ExtractedDocumentResult:
        start_time = time.time()
        for encoding in ["utf-8", "latin-1", "cp1252", "ascii"]:
            try:
                text = file_bytes.decode(encoding)
                break
            except Exception:
                text = ""

        clean_text = text.strip() if text else file_bytes.decode("utf-8", errors="ignore").strip()
        elapsed_ms = (time.time() - start_time) * 1000

        return ExtractedDocumentResult(
            clean_text=clean_text,
            photo_base64=None,
            engine_used="TxtParser (UTF-8 Auto-Detect)",
            format_detected="TXT",
            page_count=max(1, len(clean_text.split()) // 350),
            execution_time_ms=elapsed_ms,
            extraction_metadata={"word_count": len(clean_text.split())}
        )


class RtfParser(BaseDocumentParser):
    def parse(self, file_bytes: bytes, filename: str = "document.rtf") -> ExtractedDocumentResult:
        start_time = time.time()
        raw = file_bytes.decode("utf-8", errors="ignore")
        # Strip RTF control words and groups
        clean_text = re.sub(r"{\\[^{}]*}", "", raw)
        clean_text = re.sub(r"\\[a-z0-9]+\b", "", clean_text, flags=re.I)
        clean_text = re.sub(r"[\{\}]", "", clean_text)
        clean_text = re.sub(r"[\r\n]+", "\n", clean_text).strip()

        elapsed_ms = (time.time() - start_time) * 1000

        return ExtractedDocumentResult(
            clean_text=clean_text,
            photo_base64=None,
            engine_used="RtfParser",
            format_detected="RTF",
            page_count=max(1, len(clean_text.split()) // 350),
            execution_time_ms=elapsed_ms,
            extraction_metadata={"word_count": len(clean_text.split())}
        )


class MarkdownParser(BaseDocumentParser):
    def parse(self, file_bytes: bytes, filename: str = "document.md") -> ExtractedDocumentResult:
        start_time = time.time()
        raw = file_bytes.decode("utf-8", errors="ignore")
        # Strip Markdown syntax symbols while keeping text structure
        clean_text = re.sub(r"^\s*#+\s*", "", raw, flags=re.M)
        clean_text = re.sub(r"[*_~`]", "", clean_text)
        clean_text = clean_text.strip()

        elapsed_ms = (time.time() - start_time) * 1000

        return ExtractedDocumentResult(
            clean_text=clean_text,
            photo_base64=None,
            engine_used="MarkdownParser",
            format_detected="MARKDOWN",
            page_count=max(1, len(clean_text.split()) // 350),
            execution_time_ms=elapsed_ms,
            extraction_metadata={"word_count": len(clean_text.split())}
        )


class HtmlParser(BaseDocumentParser):
    def parse(self, file_bytes: bytes, filename: str = "document.html") -> ExtractedDocumentResult:
        start_time = time.time()
        raw = file_bytes.decode("utf-8", errors="ignore")
        photo_base64: Optional[str] = None

        try:
            soup = BeautifulSoup(raw, "html.parser")
            # Extract image src if available
            img_tag = soup.find("img")
            if img_tag and img_tag.get("src"):
                photo_base64 = img_tag["src"]

            # Remove scripts and styles
            for script in soup(["script", "style", "head", "meta"]):
                script.extract()

            clean_text = soup.get_text(separator="\n").strip()
        except Exception:
            clean_text = re.sub(r"<[^>]+>", " ", raw).strip()

        elapsed_ms = (time.time() - start_time) * 1000

        return ExtractedDocumentResult(
            clean_text=clean_text,
            photo_base64=photo_base64,
            engine_used="HtmlParser (BeautifulSoup4)",
            format_detected="HTML",
            page_count=max(1, len(clean_text.split()) // 350),
            execution_time_ms=elapsed_ms,
            extraction_metadata={"word_count": len(clean_text.split())}
        )
