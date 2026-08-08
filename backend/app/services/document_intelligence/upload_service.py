"""
CV OPTIMETER AI — INSTITUTIONAL UPLOAD SERVICE (PHASE 1)
Validates file size, extension, MIME type, payload integrity, and corrupt structures.
"""

from typing import Dict, Any, Tuple

SUPPORTED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".rtf", ".md", ".markdown", ".html", ".htm"}
MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB

class UploadService:
    @staticmethod
    def validate_upload(file_bytes: bytes, filename: str, mime_type: str = "") -> Tuple[bool, str, Dict[str, Any]]:
        """
        Validates an uploaded file payload.
        Returns: (is_valid, error_message, metadata_dict)
        """
        if not file_bytes or len(file_bytes) == 0:
            return False, "Uploaded file payload is empty (0 bytes).", {}

        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            size_mb = round(len(file_bytes) / (1024 * 1024), 2)
            return False, f"File size ({size_mb} MB) exceeds maximum allowed limit of 15 MB.", {}

        ext = f".{filename.lower().split('.')[-1]}" if "." in filename else ".txt"
        if ext not in SUPPORTED_EXTENSIONS:
            return False, f"Unsupported file extension '{ext}'. Supported formats: PDF, DOCX, DOC, TXT, RTF, MD, HTML.", {}

        # Magic Bytes & Structural Corruption Checks
        if ext == ".pdf":
            if not file_bytes.startswith(b"%PDF"):
                return False, "Corrupted PDF file header. File does not start with valid %PDF magic bytes.", {}

        elif ext == ".docx":
            if not file_bytes.startswith(b"PK\x03\x04"):
                return False, "Corrupted DOCX document structure. File is not a valid OpenXML package.", {}

        metadata = {
            "filename": filename,
            "extension": ext,
            "sizeBytes": len(file_bytes),
            "sizeMB": round(len(file_bytes) / (1024 * 1024), 3),
            "mimeType": mime_type or "application/octet-stream"
        }

        return True, "", metadata
