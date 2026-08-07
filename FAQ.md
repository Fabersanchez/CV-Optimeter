# Frequently Asked Questions (FAQ)

### 1. What is CV Optimeter AI?
CV Optimeter AI is an enterprise-grade SaaS platform designed to optimize resumes using Artificial Intelligence and Applicant Tracking System (ATS) parsing algorithms.

### 2. Do I need a paid OpenAI API Key to run the project?
No! CV Optimeter AI features a **Dual Engine Architecture**. If an OpenAI API Key is provided in `.env`, it will leverage GPT-4o. Otherwise, it automatically falls back to an offline rule-based NLP engine so all features work seamlessly out of the box.

### 3. What file formats can I upload?
The document parser supports PDF (`.pdf`), Microsoft Word (`.docx`, `.doc`), and Plain Text (`.txt`).

### 4. How does the ATS Score work?
The ATS score (0 to 100) is calculated across 5 weighted categories:
1. **Action Verbs & Impact:** Evaluates high-power verbs vs weak phrasing.
2. **Measurable Metrics:** Scans for quantified results (percentages, numbers, financial impact).
3. **Hard Skills Density:** Matches extracted skills against industry catalogs.
4. **Formatting & Structure:** Audits section headers and header contact details.
5. **Brevity & Word Count:** Ensures optimal length (typically 300 to 1000 words).

### 5. How do I deploy CV Optimeter AI in production?
You can deploy using Docker Compose (`docker-compose up -d --build`), or host the FastAPI backend on AWS EC2/DigitalOcean and the Next.js frontend on Vercel/Netlify.
