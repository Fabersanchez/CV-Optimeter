# Installation & Environment Setup Guide

This guide walks you through setting up **CV Optimeter AI** on local development machines and staging environments.

---

## System Requirements

- **Python:** 3.11 or higher
- **Node.js:** 18.x or 20.x LTS
- **Package Managers:** `pip` and `npm`
- **Containerization (Optional):** Docker 24+ and Docker Compose v2+

---

## Step-by-Step Local Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/cv-optimeter-ai.git
cd cv-optimeter-ai
```

### 2. Configure Environment Variables
Copy `.env.example` to create `.env`:
```bash
cp .env.example .env
```

### 3. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv

# On Linux/macOS:
source venv/bin/activate
# On Windows PowerShell:
venv\Scripts\activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Verify backend at `http://localhost:8000/health`.

### 4. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Open browser at `http://localhost:3000`.
