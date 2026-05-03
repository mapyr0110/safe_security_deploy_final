from django.contrib import admin

from config.admin_utils import ExportCsvMixin
from .models import PartnerProfile


@admin.action(description="Approve selected partner profiles")
def approve_partners(modeladmin, request, queryset):
    queryset.update(approval_status=PartnerProfile.ApprovalStatus.APPROVED)


@admin.action(description="Reject selected partner profiles")
def reject_partners(modeladmin, request, queryset):
    queryset.update(approval_status=PartnerProfile.ApprovalStatus.REJECTED)


@admin.register(PartnerProfile)
class PartnerProfileAdmin(ExportCsvMixin, admin.ModelAdmin):
    list_display = ("company_name", "contact_name", "email", "bin_or_iin", "city", "phone", "approval_status", "created_at")
    list_filter = ("approval_status", "city", "created_at")
    list_editable = ("approval_status",)
    search_fields = ("company_name", "contact_name", "bin_or_iin", "city", "phone", "message", "user__username", "user__email")
    readonly_fields = ("created_at", "updated_at")
    list_select_related = ("user",)
    date_hierarchy = "created_at"
    list_per_page = 50
    actions = (approve_partners, reject_partners, "export_as_csv")
    export_fields = ("id", "user_id", "contact_name", "company_name", "bin_or_iin", "city", "phone", "website", "message", "approval_status", "created_at")

    @admin.display(ordering="user__email")
    def email(self, obj):
        return obj.user.email
