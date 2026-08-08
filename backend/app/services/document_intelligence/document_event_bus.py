"""
DOCUMENT INTELLIGENCE ENGINE V2 - DOCUMENT EVENT BUS
Provides event emission and subscription for real-time document processing lifecycle.
"""

import time
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class DocumentEventType(str, Enum):
    DOCUMENT_UPLOAD_STARTED = "DOCUMENT_UPLOAD_STARTED"
    DOCUMENT_UPLOADED = "DOCUMENT_UPLOADED"
    DOCUMENT_PARSING_STARTED = "DOCUMENT_PARSING_STARTED"
    DOCUMENT_PARSED = "DOCUMENT_PARSED"
    DOCUMENT_NORMALIZED = "DOCUMENT_NORMALIZED"
    DOCUMENT_STRUCTURED = "DOCUMENT_STRUCTURED"
    DOCUMENT_VALIDATED = "DOCUMENT_VALIDATED"
    DOCUMENT_SESSION_READY = "DOCUMENT_SESSION_READY"
    DOCUMENT_RENDER_STARTED = "DOCUMENT_RENDER_STARTED"
    DOCUMENT_RENDERED = "DOCUMENT_RENDERED"
    ATS_ANALYSIS_STARTED = "ATS_ANALYSIS_STARTED"
    ATS_ANALYSIS_COMPLETED = "ATS_ANALYSIS_COMPLETED"
    DOCUMENT_EXPORT_STARTED = "DOCUMENT_EXPORT_STARTED"
    DOCUMENT_EXPORT_COMPLETED = "DOCUMENT_EXPORT_COMPLETED"
    DOCUMENT_ERROR = "DOCUMENT_ERROR"


class DocumentEvent(BaseModel):
    session_id: str
    event_type: DocumentEventType
    timestamp: float = Field(default_factory=time.time)
    message: str = ""
    details: Dict[str, Any] = Field(default_factory=dict)


class DocumentEventBus:
    def __init__(self):
        self._history: Dict[str, List[DocumentEvent]] = {}

    def emit(self, session_id: str, event_type: DocumentEventType, message: str = "", details: Optional[Dict[str, Any]] = None) -> DocumentEvent:
        event = DocumentEvent(
            session_id=session_id,
            event_type=event_type,
            timestamp=time.time(),
            message=message,
            details=details or {}
        )
        if session_id not in self._history:
            self._history[session_id] = []
        self._history[session_id].append(event)
        return event

    def get_events(self, session_id: str) -> List[DocumentEvent]:
        return self._history.get(session_id, [])

    def clear(self, session_id: str):
        if session_id in self._history:
            del self._history[session_id]


# Global Singleton Instance
document_event_bus = DocumentEventBus()
