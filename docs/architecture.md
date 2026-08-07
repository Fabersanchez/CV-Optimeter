# System Architecture - CV Optimeter AI

This document details the architectural layout, component interactions, and data flow of **CV Optimeter AI**.

---

## 🏛️ High-Level System Architecture

```mermaid
graph TD
    Client[Web Browser / User] -->|HTTPS REST API| NextFrontend[Next.js 14 Frontend\nApp Router + TypeScript]
    
    subgraph Frontend Tier
        NextFrontend --> UIComp[Glassmorphic UI Components]
        NextFrontend --> State[Local State & Recharts Analytics]
    end

    subgraph Backend Core Tier (FastAPI)
        NextFrontend -->|JSON Requests| FastAPIServer[FastAPI Application Server]
        FastAPIServer --> DocParser[Document Parser Service\nPDF & DOCX Extractor]
        FastAPIServer --> ATSEngine[ATS Audit Engine\n5 Pillar Matrix Calculator]
        FastAPIServer --> AIOptimizer[AI Optimizer Engine\nDual Engine Architecture]
        FastAPIServer --> CoverLetter[Cover Letter Generator]
        FastAPIServer --> LinkedIn[LinkedIn Profile Tuner]
        FastAPIServer --> ExportStudio[Export Studio Service]
    end

    subgraph Data & Storage Tier
        FastAPIServer --> Database[(PostgreSQL Database\nUser Data & Revision History)]
        FastAPIServer --> RedisCache[(Redis Cache & Task Queue)]
    end

    subgraph External Services (Optional)
        AIOptimizer -->|Fallback if Key Present| OpenAI[OpenAI API\nGPT-4o]
    end
```

---

## 🔧 Core Technical Modules

### 1. Document Parsing Pipeline (`DocumentParserService`)
Extracts text content and metadata from `.pdf` and `.docx` files using regex patterns and structural parsers:
- **Contact Detector:** Extracts email addresses, phone numbers, LinkedIn URLs, and candidate names.
- **Section Segmentation:** Splits document text into `summary`, `experience`, `education`, `skills`, `projects`, and `certifications`.

### 2. ATS Audit Engine (`ATSEngineService`)
Calculates an aggregate 0 to 100 readiness score based on 5 weighted metrics:
1. **Action Verbs (20 pts):** Matches active verbs against low-impact phrasing.
2. **Measurable Metrics (20 pts):** Quantifies presence of numbers, percentages, and financial impact.
3. **Hard Skills Match (25 pts):** Scans for technical and domain skills.
4. **Formatting & Parsing Integrity (20 pts):** Audits contact header presence and structural section validity.
5. **Brevity & Word Count (15 pts):** Validates overall word count range.

### 3. Dual AI Engine Architecture (`AIOptimizerService`)
- **Primary Engine:** Direct integration with OpenAI GPT-4o API when `OPENAI_API_KEY` is configured.
- **Local Fallback Engine:** Algorithmic NLP transformer that restructures bullet points using the STAR methodology (Situation, Task, Action, Result) with simulated metrics offline, ensuring zero single-point-of-failure.
