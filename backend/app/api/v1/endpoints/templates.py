"""
CV OPTIMETER TEMPLATE REGISTRY API CONTRACT
RESTful endpoints for discovery, search, filtering, AI recommendations, comparison, validation, importing, and session application.
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, status, Query

from app.services.template_engine.template_registry import template_registry
from app.services.template_engine.template_definition import TemplateDefinition
from app.services.template_engine.recommendation_engine import TemplateRecommendationEngine, TemplateRecommendationResult
from app.services.template_engine.comparison_engine import TemplateComparisonEngine, TemplateComparisonResult
from app.services.template_engine.template_importer import TemplateImporter
from app.services.template_engine.template_validator import TemplateValidator
from app.services.document_intelligence.document_session import document_session_store

router = APIRouter(prefix="/templates", tags=["CV Optimeter Template Registry Engine"])


@router.get("", response_model=Dict[str, Any])
async def list_templates(
    category: Optional[str] = Query(None, description="Filter by category (e.g. ATS, Executive, Technology, Creative)"),
    search: Optional[str] = Query(None, description="Search term for template name or role")
):
    """Lists all templates with optional category filter and keyword search."""
    items = template_registry.list_all(category=category, search=search)
    return {
        "status": "success",
        "count": len(items),
        "templates": [t.model_dump() for t in items]
    }


@router.get("/categories", response_model=Dict[str, Any])
async def list_template_categories():
    """Returns list of all active template categories."""
    cats = template_registry.get_categories()
    return {
        "status": "success",
        "categories": cats
    }


@router.get("/{template_id}", response_model=Dict[str, Any])
async def get_template_detail(template_id: str):
    """Retrieves full TemplateDefinition specification by ID."""
    t = template_registry.get(template_id)
    if not t:
        raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found in registry.")
    return {
        "status": "success",
        "template": t.model_dump()
    }


@router.post("/recommended", response_model=Dict[str, Any])
async def get_recommended_templates(payload: Dict[str, Any]):
    """
    AI Template Recommendation Engine.
    Analyzes CandidateCVSchema and optional Job Description to recommend the top 3 compatible templates with explanations.
    """
    candidate_cv = payload.get("candidateCv", payload.get("candidate_cv", {}))
    job_description = payload.get("jobDescription", payload.get("job_description"))

    recommendation: TemplateRecommendationResult = TemplateRecommendationEngine.recommend_templates(
        candidate_cv=candidate_cv,
        job_description=job_description
    )

    return {
        "status": "success",
        "recommendations": recommendation.model_dump()
    }


@router.post("/compare", response_model=Dict[str, Any])
async def compare_templates_endpoint(payload: Dict[str, Any]):
    """Compares 2 to 3 templates side-by-side on ATS, visual impact, readability, density, and page balance."""
    template_ids: List[str] = payload.get("templateIds", payload.get("template_ids", []))
    result: TemplateComparisonResult = TemplateComparisonEngine.compare_templates(template_ids)
    return {
        "status": "success",
        "comparison": result.model_dump()
    }


@router.post("/validate", response_model=Dict[str, Any])
async def validate_template_payload(payload: Dict[str, Any]):
    """Audits a TemplateDefinition JSON payload against layout rules, ATS thresholds, and license manifests."""
    try:
        definition = TemplateDefinition(**payload)
        is_valid, errors = TemplateValidator.validate_template(definition)
        return {
            "status": "success" if is_valid else "error",
            "is_valid": is_valid,
            "errors": errors
        }
    except Exception as e:
        return {
            "status": "error",
            "is_valid": False,
            "errors": [f"Schema parse error: {str(e)}"]
        }


@router.post("/import", response_model=Dict[str, Any])
async def import_external_template_endpoint(payload: Dict[str, Any]):
    """Imports an external template definition with automated license auditing."""
    definition, message = TemplateImporter.import_external_template(payload)
    template_registry.register(definition)
    return {
        "status": "success" if definition.state.value != "LICENSE_REVIEW_REQUIRED" else "warning",
        "message": message,
        "template": definition.model_dump()
    }


@router.post("/{template_id}/favorite", response_model=Dict[str, Any])
async def add_favorite_template(template_id: str, user_id: str = Query("user-001")):
    """Adds template to user favorites."""
    favs = template_registry.add_favorite(user_id, template_id)
    return {"status": "success", "user_id": user_id, "favorite_template_ids": favs}


@router.delete("/{template_id}/favorite", response_model=Dict[str, Any])
async def remove_favorite_template(template_id: str, user_id: str = Query("user-001")):
    """Removes template from user favorites."""
    favs = template_registry.remove_favorite(user_id, template_id)
    return {"status": "success", "user_id": user_id, "favorite_template_ids": favs}


@router.post("/{template_id}/apply", response_model=Dict[str, Any])
async def apply_template_to_session(template_id: str, payload: Dict[str, Any]):
    """
    Applies template to an active DocumentSession.
    Guarantees Zero Data Loss: CandidateCVSchema remains 100% intact while template styling updates.
    """
    session_id = payload.get("sessionId", payload.get("session_id"))
    if not session_id:
        raise HTTPException(status_code=400, detail="sessionId is required to apply template.")

    session = document_session_store.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail=f"DocumentSession '{session_id}' not found.")

    template_def = template_registry.get(template_id)
    if not template_def:
        raise HTTPException(status_code=404, detail=f"Template '{template_id}' not found.")

    document_session_store.set_template(session_id, template_id)

    return {
        "status": "success",
        "message": f"Template '{template_def.name}' applied to DocumentSession '{session_id}'.",
        "session": session.model_dump(),
        "applied_template": template_def.model_dump()
    }
