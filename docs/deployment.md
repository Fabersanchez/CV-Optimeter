# Production Deployment Guide

This guide covers deploying **CV Optimeter AI** in production environments using Docker Compose, Kubernetes, or Cloud Managed Hosting (Vercel + AWS/DigitalOcean).

---

## 🐋 Option 1: Docker Compose Deployment

The simplest production setup uses `docker-compose.yml`:

```bash
# Clone production branch
git clone https://github.com/your-username/cv-optimeter-ai.git
cd cv-optimeter-ai

# Configure production env
cp .env.example .env
nano .env

# Launch background containers
docker-compose up -d --build
```

---

## ☁️ Option 2: Decoupled Cloud Deployment

### Frontend (Vercel / Netlify)
1. Import `frontend/` directory into Vercel.
2. Set Environment Variable: `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1`
3. Deploy!

### Backend (AWS EC2 / DigitalOcean Droplet / Render)
1. Deploy `backend/` via Docker or Systemd service.
2. Configure NGINX reverse proxy for SSL terminating on port 443 -> localhost:8000.
3. Configure PostgreSQL managed instance (AWS RDS / DigitalOcean Database).
