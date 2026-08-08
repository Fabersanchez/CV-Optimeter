from app.core.enterprise.auth_engine import AuthenticationEngine
from app.core.enterprise.rbac_engine import RBACEngine
from app.core.enterprise.organization_engine import OrganizationEngine
from app.core.enterprise.subscription_billing import SubscriptionBillingGateway
from app.core.enterprise.security_center import SecurityCenterEngine
from app.core.enterprise.audit_system import AuditSystemEngine
from app.core.enterprise.feature_flags import FeatureFlagEngine
from app.core.enterprise.plugin_architecture import PluginArchitectureManager
from app.core.enterprise.admin_console import AdminConsoleEngine

def test_enterprise_infrastructure_suite():
    print("--- 1. Testing Authentication & JWT Engine ---")
    tokens = AuthenticationEngine.generate_jwt_tokens("usr-01", "alex.morgan@devmail.io", role="Enterprise")
    assert "accessToken" in tokens
    assert AuthenticationEngine.verify_mfa_code("usr-01", "123456") is True
    print("[OK] JWT Tokens & MFA Verified")

    print("\n--- 2. Testing RBAC Engine ---")
    assert RBACEngine.check_permission("Enterprise", "use:ats_x_simulations") is True
    assert RBACEngine.check_permission("Guest", "manage:users") is False
    print("[OK] RBAC Permission Matrix Validated")

    print("\n--- 3. Testing Multi-Tenant Organization Engine ---")
    org_svc = OrganizationEngine()
    org_details = org_svc.get_organization_details("org-01")
    assert org_details["name"] == "TechPulse Innovations Corp"
    print(f"[OK] Multi-Tenant Organization Active: {org_details['name']} ({len(org_details['workspaces'])} Workspaces)")

    print("\n--- 4. Testing Subscriptions & Billing Gateway ---")
    sub = SubscriptionBillingGateway.get_subscription_status("usr-01")
    assert sub["status"] == "ACTIVE"
    print(f"[OK] Subscription Plan: {sub['plan']}, Status: {sub['status']}")

    print("\n--- 5. Testing Security Center & Audit System ---")
    sec = SecurityCenterEngine.get_security_config()
    audit_svc = AuditSystemEngine()
    audit_svc.log_event("usr-01", "alex.morgan@devmail.io", "SYSTEM_AUDIT_TEST", "Audit Center")
    logs = audit_svc.get_logs()
    assert sec["securityGrade"] == "A+ / Enterprise Certified"
    assert len(logs) >= 3
    print(f"[OK] Security Center Grade: {sec['securityGrade']}, Audit Logs Recorded: {len(logs)}")

    print("\n--- 6. Testing Feature Flags & Plugin Architecture ---")
    flags = FeatureFlagEngine.get_all_flags()
    plugins = PluginArchitectureManager.get_plugins()
    assert flags["ats_x_v2"] is True
    assert len(plugins) >= 4
    print(f"[OK] Active Feature Flags: {len(flags)}, Installed ATS Plugins: {len(plugins)}")

    print("\n--- 7. Testing Admin Console System Health ---")
    health = AdminConsoleEngine.get_system_health()
    assert health["systemStatus"] == "HEALTHY"
    print(f"[OK] System Health: {health['systemStatus']} (Uptime: {health['uptimePercentage']})")

    print("\n[OK] ALL ENTERPRISE SAAS INFRASTRUCTURE TESTS PASSED 100%!")

if __name__ == "__main__":
    test_enterprise_infrastructure_suite()
