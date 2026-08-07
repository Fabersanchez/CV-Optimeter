# Code & Architecture Style Guide

This document defines style conventions for backend and frontend code in **CV Optimeter AI**.

---

## Python Conventions
- **Module Names:** `snake_case.py`
- **Class Names:** `PascalCaseService`
- **Function/Method Names:** `snake_case_function()`
- **Type Annotations:** Required on all public function parameters and return values.

## TypeScript / React Conventions
- **Component Names:** `PascalCase.tsx`
- **Interface/Type Names:** `PascalCaseProps`
- **File Structure:**
  - `src/components/ui/` for primitive atomic UI elements.
  - `src/components/tabs/` for feature dashboard views.
  - `src/lib/` for API client functions and helpers.
