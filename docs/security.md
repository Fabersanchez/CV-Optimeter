# Security Architecture & Data Protection

This document outlines the security controls and data privacy standards implemented in **CV Optimeter AI**.

---

## Key Security Controls

### 1. Document Parsing Sandboxing & Upload Protection
- File uploads are validated by MIME extension (`.pdf`, `.docx`, `.doc`, `.txt`) and magic byte inspection.
- Upload file sizes are strictly capped at **10 MB** to prevent Denial of Service (DoS) memory exhaustion.
- File contents are parsed in memory buffers (`io.BytesIO`) and immediately cleared after parsing; no permanent raw file persistence on web servers.

### 2. Secrets Management & API Protection
- All sensitive credentials (DB passwords, secret keys, OpenAI API keys) are loaded exclusively via environment variables (`.env`).
- API requests use CORS domain origin whitelisting (`BACKEND_CORS_ORIGINS`).

### 3. Data Protection & Privacy
- Candidate personal identifiable information (PII) extracted from resumes is encrypted at rest using AES-256 in production databases.
- Communications between frontend and backend are enforced via TLS 1.3 (HTTPS).
