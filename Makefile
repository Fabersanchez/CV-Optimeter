.PHONY: help setup install dev-backend dev-frontend dev test lint format docker-up docker-down clean

help:
	@echo "CV Optimeter AI - Developer Commands"
	@echo "  make setup         - Install backend and frontend dependencies"
	@echo "  make dev-backend   - Start FastAPI backend server"
	@echo "  make dev-frontend  - Start Next.js frontend dev server"
	@echo "  make test          - Run backend pytest suite"
	@echo "  make lint          - Run linters for backend and frontend"
	@echo "  make format        - Format code using Black & Prettier"
	@echo "  make docker-up     - Start full stack using Docker Compose"
	@echo "  make docker-down   - Stop Docker Compose services"

setup:
	pip install -r backend/requirements.txt
	cd frontend && npm install

dev-backend:
	cd backend && python -m uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

test:
	python -m pytest backend/tests

lint:
	cd backend && python -m ruff check .
	cd frontend && npm run lint

format:
	cd backend && python -m black .
	cd frontend && npm run format

docker-up:
	docker-compose up -d --build

docker-down:
	docker-compose down

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	rm -rf frontend/.next frontend/node_modules
