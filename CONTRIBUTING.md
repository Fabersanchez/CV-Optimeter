# Contributing to CV Optimeter AI

Thank you for your interest in contributing to **CV Optimeter AI**! We welcome contributions from developers, UX designers, data scientists, and technical writers worldwide.

---

## Code of Conduct

All contributors are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to ensure a respectful and inclusive environment.

---

## How to Get Started

1. **Fork the Repository:** Create your own fork on GitHub.
2. **Clone locally:**
   ```bash
   git clone https://github.com/your-username/cv-optimeter-ai.git
   cd cv-optimeter-ai
   ```
3. **Set up Environment:**
   - **Backend:** `pip install -r backend/requirements.txt`
   - **Frontend:** `cd frontend && npm install`
4. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

---

## Development Standards

### Backend (Python / FastAPI)
- Code formatting follows [Black](https://github.com/psf/black) and linting with [Ruff](https://github.com/astral-sh/ruff).
- All new API endpoints must include Pydantic schemas and unit tests in `backend/tests`.

### Frontend (Next.js / TypeScript)
- Use TypeScript strict mode.
- Components must follow the glassmorphic dark-mode design system.
- Code formatting follows Prettier.

---

## Submitting a Pull Request

1. Ensure all tests pass: `make test`
2. Ensure linters pass: `make lint`
3. Commit changes using Conventional Commits format:
   - `feat: add job keyword frequency chart`
   - `fix: resolve PDF contact parser edge case`
4. Open a Pull Request against the `main` branch.
