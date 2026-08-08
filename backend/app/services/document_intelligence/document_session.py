"""
CV OPTIMETER IMPORT PIPELINE V3 - DOCUMENT SESSION & STATE MACHINE
Manages DocumentSession lifecycle, granular state transitions, timeouts, progress tracking, and session store.
"""

import time
import uuid
import base64
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class OriginalFileModel(BaseModel):
    filename: str
    mime_type: str = "application/pdf"
    extension: str = ".pdf"
    size: int = 0
    file_hash: Optional[str] = None
    page_count: int = 1
    content_b64: Optional[str] = None


class ProcessingStatus:
    READY = "READY"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CREATED = "CREATED"


class DocumentSessionState(BaseModel):
    session_id: str = ""
    status: str = "CREATED"  # CREATED | UPLOADING | PARSING | EXTRACTING | NORMALIZING | VALIDATING | BUILDING_RENDER_MODEL | RENDERING | COMPLETED | FAILED | TIMEOUT | CANCELLED
    progress: int = 0  # 0 to 100
    current_step: str = "created"
    stage_description: str = "Iniciando sesión de procesamiento..."
    started_at: float = Field(default_factory=time.time)
    updated_at: float = Field(default_factory=time.time)
    completed_at: Optional[float] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None


class DocumentSession(BaseModel):
    session_id: str
    document_id: str
    original_file: OriginalFileModel
    raw_content: str = ""
    normalized_content: str = ""
    candidate_cv: Dict[str, Any] = Field(default_factory=dict)
    source_map: Dict[str, Any] = Field(default_factory=dict)
    assets: List[Dict[str, Any]] = Field(default_factory=list)
    template: str = "ats-professional"
    render_config: Dict[str, Any] = Field(default_factory=dict)
    state: DocumentSessionState
    version: int = 1
    confidence: float = 1.0

    @property
    def processing_status(self) -> str:
        return "READY" if self.state.status == "COMPLETED" else self.state.status


class DocumentSessionStore:
    def __init__(self):
        self._sessions: Dict[str, DocumentSession] = {}

    def create_session(self, filename: str, contents: bytes, mime_type: str = "application/pdf") -> DocumentSession:
        session_id = f"session-{uuid.uuid4().hex[:12]}"
        doc_id = f"doc-{uuid.uuid4().hex[:8]}"

        ext = f".{filename.split('.')[-1].lower()}" if "." in filename else ".pdf"
        orig_file = OriginalFileModel(
            filename=filename,
            mime_type=mime_type,
            extension=ext,
            size=len(contents),
            content_b64=base64.b64encode(contents).decode("utf-8")
        )

        init_state = DocumentSessionState(
            session_id=session_id,
            status="CREATED",
            progress=5,
            current_step="created",
            stage_description="Archivo recibido y sesión creada"
        )

        session = DocumentSession(
            session_id=session_id,
            document_id=doc_id,
            original_file=orig_file,
            state=init_state
        )

        self._sessions[session_id] = session
        return session

    def get_session(self, session_id: str) -> Optional[DocumentSession]:
        return self._sessions.get(session_id)

    def update_state(
        self,
        session_id: str,
        status: str,
        progress: int,
        step: str,
        description: str,
        error_code: Optional[str] = None,
        error_message: Optional[str] = None
    ):
        session = self.get_session(session_id)
        if not session:
            return

        session.state.status = status
        session.state.progress = progress
        session.state.current_step = step
        session.state.stage_description = description
        session.state.updated_at = time.time()

        if error_code:
            session.state.error_code = error_code
        if error_message:
            session.state.error_message = error_message

        if status in ["COMPLETED", "FAILED", "TIMEOUT", "CANCELLED"]:
            session.state.completed_at = time.time()

    def set_candidate_cv(self, session_id: str, candidate_cv: Dict[str, Any]):
        session = self.get_session(session_id)
        if session:
            session.candidate_cv = candidate_cv
            session.version += 1

    def update_candidate_cv(self, session_id: str, candidate_cv: Dict[str, Any]):
        self.set_candidate_cv(session_id, candidate_cv)

    def set_template(self, session_id: str, template_id: str):
        session = self.get_session(session_id)
        if session:
            session.template = template_id


# Global Singleton Session Store
document_session_store = DocumentSessionStore()
