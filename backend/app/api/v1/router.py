from fastapi import APIRouter

from .endpoints import cv, ats, ai, cover_letter, linkedin, metrics, export
from ..document_intelligence_router import router as document_intelligence_router
from ..ats_x_router import router as ats_x_router
from ..ai_optimization_router import router as ai_optimization_router
from ..job_intelligence_router import router as job_intelligence_router
from ..career_intelligence_router import router as career_intelligence_router
from ..intelligence_platform_router import router as intelligence_platform_router
from ..enterprise_router import router as enterprise_router

api_router = APIRouter()

api_router.include_router(document_intelligence_router)
api_router.include_router(ats_x_router)
api_router.include_router(ai_optimization_router)
api_router.include_router(job_intelligence_router)
api_router.include_router(career_intelligence_router)
api_router.include_router(intelligence_platform_router)
api_router.include_router(enterprise_router)
api_router.include_router(cv.router, prefix="/cv", tags=["CV Management"])
api_router.include_router(ats.router, prefix="/ats", tags=["ATS Engine"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Rewriter & Optimizer"])
api_router.include_router(cover_letter.router, prefix="/cover-letter", tags=["Cover Letter"])
api_router.include_router(linkedin.router, prefix="/linkedin", tags=["LinkedIn Optimizer"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["Dashboard Metrics"])
api_router.include_router(export.router, prefix="/export", tags=["Export Studio"])
