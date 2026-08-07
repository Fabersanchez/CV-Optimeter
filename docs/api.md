# REST API Reference Manual - CV Optimeter AI

All API endpoints are prefixed with `/api/v1`.

---

## Endpoints Summary

### 1. Document Upload & Parse
- **Endpoint:** `POST /api/v1/cv/upload`
- **Content-Type:** `multipart/form-data`
- **Body:** `file` (PDF/DOCX)
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "filename": "resume.pdf",
      "word_count": 350,
      "contact_info": { "name": "Alex Morgan", "email": "alex@dev.io", "phone": "+1 555-0199", "linkedin": "..." },
      "extracted_skills": ["Python", "TypeScript", "React"]
    }
  }
  ```

### 2. ATS Audit & Scoring
- **Endpoint:** `POST /api/v1/ats/analyze`
- **Body:** `{ "parsed_cv": { ... }, "target_job_description": "..." }`
- **Response:** Returns 0-100 score, breakdown, diagnostics, and actionable recommendations.

### 3. AI STAR Rewriter
- **Endpoint:** `POST /api/v1/ai/rewrite-bullet`
- **Body:** `{ "bullet_text": "...", "tone": "executive", "target_role": "Senior Engineer" }`

### 4. Job Matcher
- **Endpoint:** `POST /api/v1/ats/match-job`
- **Body:** `{ "cv_text": "...", "job_description": "..." }`

### 5. Cover Letter Generator
- **Endpoint:** `POST /api/v1/cover-letter/generate`
- **Body:** `{ "company_name": "Stripe", "target_role": "Staff Engineer" }`

### 6. LinkedIn Optimizer
- **Endpoint:** `POST /api/v1/linkedin/optimize`
- **Body:** `{ "target_role": "Senior Software Engineer" }`
