import csv

from django.http import HttpResponse


class ExportCsvMixin:
    export_fields = ()

    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        field_names = self.export_fields or [field.name for field in meta.fields]
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="{meta.model_name}.csv"'
        writer = csv.writer(response)
        writer.writerow(field_names)
        for obj in queryset:
            writer.writerow([getattr(obj, field) for field in field_names])
        return response

    export_as_csv.short_description = "Export selected rows as CSV"


class AuditAdminMixin:
    readonly_fields = ("created_at", "updated_at", "created_by", "updated_by")

    def save_model(self, request, obj, form, change):
        if hasattr(obj, "created_by") and not obj.created_by_id:
            obj.created_by = request.user
        if hasattr(obj, "updated_by"):
            obj.updated_by = request.user
        super().save_model(request, obj, form, change)

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for obj in instances:
            if hasattr(obj, "created_by") and not obj.created_by_id:
                obj.created_by = request.user
            if hasattr(obj, "updated_by"):
                obj.updated_by = request.user
            obj.save()
        for obj in formset.deleted_objects:
            obj.delete()
        formset.save_m2m()


def activate_items(modeladmin, request, queryset):
    queryset.update(is_active=True)


activate_items.short_description = "Mark selected rows as active"


def deactivate_items(modeladmin, request, queryset):
    queryset.update(is_active=False)


deactivate_items.short_description = "Mark selected rows as inactive"
