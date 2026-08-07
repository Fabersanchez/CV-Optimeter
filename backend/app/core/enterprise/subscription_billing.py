from typing import Dict, Any, List

class SubscriptionBillingGateway:
    PLANS = {
        "Free": {"priceMonthly": 0, "cvLimit": 1, "atsSimulations": False},
        "Pro": {"priceMonthly": 12, "cvLimit": 5, "atsSimulations": True},
        "Premium": {"priceMonthly": 29, "cvLimit": 25, "atsSimulations": True},
        "Business": {"priceMonthly": 79, "cvLimit": 100, "atsSimulations": True},
        "Enterprise": {"priceMonthly": 249, "cvLimit": 9999, "atsSimulations": True}
    }

    @classmethod
    def get_subscription_status(cls, user_id: str = "usr-01") -> Dict[str, Any]:
        return {
            "userId": user_id,
            "plan": "Enterprise",
            "status": "ACTIVE",
            "billingCycle": "ANNUAL",
            "nextRenewalDate": "2027-08-01",
            "invoicesCount": 12,
            "planDetails": cls.PLANS["Enterprise"]
        }
