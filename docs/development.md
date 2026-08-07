# Developer Guidelines & Workflow

This document provides guidelines for developers contributing code to **CV Optimeter AI**.

---

## Workspace Setup

1. Clone the repository and initialize local virtual environments:
   ```bash
   make setup
   ```
2. Enable pre-commit git hooks:
   ```bash
   pre-commit install
   ```

---

## Coding Standards

### Python (Backend)
- Adhere to PEP 8 standards enforced via **Ruff** and **Black**.
- Maximum line length is set to `100` characters.
- Use explicit Pydantic response models for all API endpoints.

### TypeScript / Next.js (Frontend)
- Use functional components with strict TypeScript type annotations.
- Components must be structured within `src/components/` and utility functions in `src/lib/`.
- Styling must use Tailwind CSS utility classes and glassmorphic design system tokens.
