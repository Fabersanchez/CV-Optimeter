"""
CV OPTIMETER SEMANTIC ENGINE V3.0 - RAW DOCUMENT LAYER
Intermediate representation conserving page coordinates, raw text, blocks, lines, words, and image locations.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class RawWord(BaseModel):
    text: str
    x: float = 0.0
    y: float = 0.0
    width: float = 0.0
    height: float = 0.0
    font_size: float = 10.0
    font_family: str = "Inter"


class RawLine(BaseModel):
    text: str
    page: int = 1
    x: float = 0.0
    y: float = 0.0
    width: float = 0.0
    height: float = 0.0
    font_size: float = 10.0
    is_bold: bool = False
    words: List[RawWord] = Field(default_factory=list)


class RawBlock(BaseModel):
    id: str
    type: str = "text"  # text | image | separator | table
    page: int = 1
    x: float = 0.0
    y: float = 0.0
    width: float = 0.0
    height: float = 0.0
    lines: List[RawLine] = Field(default_factory=list)

    @property
    def text(self) -> str:
        return "\n".join(l.text for l in self.lines).strip()


class RawPage(BaseModel):
    page_number: int
    width: float = 595.27
    height: float = 841.89
    blocks: List[RawBlock] = Field(default_factory=list)
    raw_text: str = ""


class RawDocument(BaseModel):
    document_id: str
    filename: str
    mime_type: str = "application/pdf"
    page_count: int = 1
    pages: List[RawPage] = Field(default_factory=list)
    extracted_photo_b64: Optional[str] = None

    @property
    def full_text(self) -> str:
        return "\n\n".join(p.raw_text for p in self.pages).strip()
