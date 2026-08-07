# Extended Technical FAQ - CV Optimeter AI

### Q: Why build a Dual Engine Architecture for AI?
A: Cloud LLM services (like OpenAI) can experience network latency, quota limits, or API key exhaustion. The local NLP rule fallback guarantees that users can parse documents, receive accurate ATS score audits, and get rewritten bullet points 100% offline with zero external dependencies.

### Q: Can CV Optimeter AI handle multi-page resumes?
A: Yes! The document parser automatically extracts text across all pages in PDF and DOCX files.

### Q: Is there support for custom ATS scoring weights?
A: Yes. The scoring parameters in `backend/app/services/ats_engine.py` can be adjusted to favor specific categories (e.g., increasing hard skill weight for technical engineering positions vs. action verb weight for executive roles).
