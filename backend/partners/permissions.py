from rest_framework.permissions import BasePermission

from .models import PartnerProfile


class IsApprovedPartner(BasePermission):
    message = "Only approved partners can access this B2B resource."

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return getattr(request.user, "partner_profile", None) is not None and request.user.partner_profile.approval_status == PartnerProfile.ApprovalStatus.APPROVED
