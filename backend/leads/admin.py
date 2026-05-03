from django.contrib import admin

from config.admin_utils import ExportCsvMixin
from .models import Client, Lead


@admin.register(Lead)
class LeadAdmin(ExportCsvMixin, admin.ModelAdmin):
    list_display = ("name", "company", "phone", "email", "language", "status", "created_at")
    list_filter = ("status", "language", "created_at")
    search_fields = ("name", "company", "phone", "email", "message", "source_page")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    list_per_page = 50
    actions = ("export_as_csv",)
    export_fields = ("id", "name", "company", "phone", "email", "language", "status", "source_page", "created_at")


@admin.register(Client)
class ClientAdmin(ExportCsvMixin, admin.ModelAdmin):
    list_display = ("email", "created_at")
    search_fields = ("email",)
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)
    date_hierarchy = "created_at"
    list_per_page = 50
    actions = ("export_as_csv",)
    export_fields = ("id", "email", "created_at")
