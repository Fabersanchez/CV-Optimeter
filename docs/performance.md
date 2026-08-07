# Performance Optimization Guidelines

This document details performance standards and caching strategies across **CV Optimeter AI**.

---

## ⚡ Backend Performance Controls

- **Async IO:** All file upload handlers and API routes run asynchronously (`async def`) to prevent thread blocking under high concurrent loads.
- **In-Memory Streaming:** Text extractions run in-memory via `io.BytesIO` rather than disk reads.
- **Redis Caching:** Frequently parsed job descriptions and ATS keyword dictionaries are cached in Redis with a 24-hour TTL.

---

## 🚀 Frontend Performance Controls

- **Route Pre-rendering:** Next.js static pages are pre-rendered at build time.
- **Dynamic Imports:** Heavy charts (`Recharts`) and animation components (`Framer Motion`) are loaded dynamically to keep initial JS bundle size under 200 kB.
