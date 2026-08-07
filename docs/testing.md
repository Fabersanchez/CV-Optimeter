# Testing & Quality Assurance Guide

This document outlines automated testing practices for **CV Optimeter AI**.

---

## 🧪 Backend Testing (Pytest)

Backend unit and integration tests are located in `backend/tests/`.

### Run All Backend Tests:
```bash
python -m pytest backend/
```

### Run Tests with Coverage:
```bash
python -m pytest backend/ --cov=app --cov-report=html
```

---

## 💻 Frontend Testing & Verification

- **Linting & Type Checking:**
  ```bash
  cd frontend
  npm run lint
  ```
- **Production Build Compilation Verification:**
  ```bash
  cd frontend
  npm run build
  ```
