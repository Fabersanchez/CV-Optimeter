from fastapi import APIRouter
from app.api.v1.endpoints import cv, ats, ai, cover_letter, linkedin, metrics, export

api_router = APIRouter()

api_router.include_router(cv.router, prefix="/cv", tags=["CV Management"])
api_router.include_router(ats.router, prefix="/ats", tags=["ATS Engine"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Rewriter & Optimizer"])
api_router.include_router(cover_letter.router, prefix="/cover-letter", tags=["Cover Letter"])
api_router.include_router(linkedin.router, prefix="/linkedin", tags=["LinkedIn Optimizer"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["Dashboard Metrics"])
api_router.include_router(export.router, prefix="/export", tags=["Export Studio"])
