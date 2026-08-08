from fastapi import APIRouter
from typing import Dict, Any
from app.core.enterprise.auth_engine import AuthenticationEngine
from app.core.enterprise.rbac_engine import RBACEngine
from app.core.enterprise.organization_engine import OrganizationEngine
from app.core.enterprise.subscription_billing import SubscriptionBillingGateway
from app.core.enterprise.security_center import SecurityCenterEngine
from app.core.enterprise.audit_system import AuditSystemEngine
from app.core.enterprise.feature_flags import FeatureFlagEngine
from app.core.enterprise.plugin_architecture import PluginArchitectureManager
from app.core.enterprise.admin_console import AdminConsoleEngine

router = APIRouter(prefix="/api/v1/enterprise", tags=["Enterprise Infrastructure"])
audit_service = AuditSystemEngine()
org_service = OrganizationEngine()

@router.post("/auth/token")
async def generate_token(user_id: str = "usr-01", email: str = "alex.morgan@devmail.io", role: str = "Enterprise"):
    """Generates JWT Access & Refresh Tokens."""
    audit_service.log_event(user_id, email, "USER_LOGIN", "Authentication Endpoint")
    return AuthenticationEngine.generate_jwt_tokens(user_id, email, role=role)

@router.post("/rbac/check")
async def check_rbac_permission(role: str = "Enterprise", permission: str = "use:ats_x_simulations"):
    """Checks RBAC permission authorization."""
    has_perm = RBACEngine.check_permission(role, permission)
    return {"role": role, "permission": permission, "authorized": has_perm}

@router.get("/organization")
async def get_organization():
    """Retrieves Multi-Tenant Organization & Workspace details."""
    return org_service.get_organization_details()

@router.get("/subscription")
async def get_subscription():
    """Retrieves Subscription Plan & Billing Gateway details."""
    return SubscriptionBillingGateway.get_subscription_status("usr-01")

@router.get("/security")
async def get_security_center():
    """Retrieves Security Center configuration & security headers status."""
    return SecurityCenterEngine.get_security_config()

@router.get("/audit-logs")
async def get_audit_logs():
    """Retrieves system audit log traceability entries."""
    return audit_service.get_logs()

@router.get("/feature-flags")
async def get_feature_flags():
    """Retrieves active feature flags."""
    return FeatureFlagEngine.get_all_flags()

@router.get("/plugins")
async def get_plugins():
    """Lists installed & available third-party ATS plugins."""
    return PluginArchitectureManager.get_plugins()

@router.get("/admin/health")
async def get_admin_health():
    """Retrieves Admin Console system health and monitoring metrics."""
    return AdminConsoleEngine.get_system_health()
