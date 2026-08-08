"""
DOCUMENT INTELLIGENCE ENGINE V2 - BASE PARSER INTERFACE
Polymorphic Contract for Multi-Format Document Ingestion
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List

@dataclass
class ExtractedDocumentResult:
    clean_text: str
    photo_base64: Optional[str] = None
    engine_used: str = "Unknown"
    format_detected: str = "TXT"
    page_count: int = 1
    execution_time_ms: float = 0.0
    extraction_metadata: Dict[str, Any] = field(default_factory=dict)


class BaseDocumentParser(ABC):
    @abstractmethod
    def parse(self, file_bytes: bytes, filename: str) -> ExtractedDocumentResult:
        """
        Parses raw bytes into clean human-readable text and optional photo Base64.
        Must NEVER leak raw PDF stream tokens (%PDF-, obj, endobj, %EOF).
        """
        pass
