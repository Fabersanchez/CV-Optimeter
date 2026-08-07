# UI & Design System Guidelines

CV Optimeter AI follows a **Modern Dark Glassmorphic Design System** engineered for visual excellence.

---

## 🎨 Color Palette & Design Tokens

- **Background Base:** Slate 950 (`#0b0f19` / `#0f172a`)
- **Brand Accent:** Sky Blue & Electric Cyan (`#0ea5e9` / `#38bdf8`)
- **Success Metrics:** Emerald 400 (`#34d399`)
- **Warning Diagnostics:** Amber 400 (`#fbbf24`)
- **Critical Diagnostics:** Rose 400 (`#f43f5e`)

---

## 📐 Glassmorphism System

Panels utilize multi-layered backdrop blur:
```css
.glass-panel {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

## 🔤 Typography

- **Primary Font:** `Inter` (sans-serif)
- **Monospace Font:** `JetBrains Mono` (for ATS scores, metrics, and code tags)
