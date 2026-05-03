from django.contrib import admin
from django.utils.html import format_html

from config.admin_utils import AuditAdminMixin, ExportCsvMixin
from .models import BlogPost


@admin.action(description="Publish selected posts")
def publish_posts(modeladmin, request, queryset):
    queryset.update(is_published=True)


@admin.action(description="Unpublish selected posts")
def unpublish_posts(modeladmin, request, queryset):
    queryset.update(is_published=False)


@admin.register(BlogPost)
class BlogPostAdmin(AuditAdminMixin, ExportCsvMixin, admin.ModelAdmin):
    list_display = ("title_en", "slug", "is_published", "published_at", "cover_preview", "updated_by")
    list_filter = ("is_published", "published_at")
    search_fields = ("title_en", "title_ru", "title_kk", "excerpt_en", "excerpt_ru", "excerpt_kk", "body_en", "body_ru", "body_kk", "seo_title")
    prepopulated_fields = {"slug": ("title_en",)}
    readonly_fields = AuditAdminMixin.readonly_fields + ("cover_preview",)
    actions = (publish_posts, unpublish_posts, "export_as_csv")
    date_hierarchy = "published_at"
    list_per_page = 50
    export_fields = ("id", "slug", "title_en", "title_ru", "title_kk", "is_published", "published_at", "seo_title")
    fieldsets = (
        ("Publication", {"fields": ("slug", "is_published", "published_at", "cover_image", "cover_preview")}),
        ("English", {"fields": ("title_en", "excerpt_en", "body_en")}),
        ("Russian", {"fields": ("title_ru", "excerpt_ru", "body_ru")}),
        ("Kazakh", {"fields": ("title_kk", "excerpt_kk", "body_kk")}),
        ("SEO", {"fields": ("seo_title", "seo_description")}),
        ("System", {"fields": ("created_at", "updated_at", "created_by", "updated_by")}),
    )

    def cover_preview(self, obj):
        if not obj.cover_image:
            return "-"
        return format_html('<img src="{}" style="height: 72px; width: auto;" />', obj.cover_image.url)
