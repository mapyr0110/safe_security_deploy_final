from django.contrib import admin
from django.utils.html import format_html

from config.admin_utils import AuditAdminMixin, ExportCsvMixin, activate_items, deactivate_items
from .models import Brand, Category, Product, ProductImage, ProductSpecification


@admin.register(Category)
class CategoryAdmin(AuditAdminMixin, ExportCsvMixin, admin.ModelAdmin):
    list_display = ("name_en", "slug", "is_active", "sort_order", "updated_at", "updated_by")
    list_filter = ("is_active",)
    search_fields = ("name_en", "name_ru", "name_kk", "slug")
    prepopulated_fields = {"slug": ("name_en",)}
    readonly_fields = AuditAdminMixin.readonly_fields
    ordering = ("sort_order", "name_en")
    list_per_page = 50
    actions = (activate_items, deactivate_items, "export_as_csv")
    export_fields = ("id", "slug", "name_en", "name_ru", "name_kk", "is_active", "sort_order")


@admin.register(Brand)
class BrandAdmin(AuditAdminMixin, ExportCsvMixin, admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "sort_order", "updated_at", "updated_by")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = AuditAdminMixin.readonly_fields
    ordering = ("sort_order", "name")
    list_per_page = 50
    actions = (activate_items, deactivate_items, "export_as_csv")
    export_fields = ("id", "slug", "name", "website", "is_active", "sort_order")


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "alt_en", "alt_ru", "alt_kk", "is_main", "sort_order", "created_by", "updated_by")
    readonly_fields = ("created_by", "updated_by")


class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1
    fields = ("name_en", "name_ru", "name_kk", "value_en", "value_ru", "value_kk", "sort_order", "created_by", "updated_by")
    readonly_fields = ("created_by", "updated_by")


@admin.register(Product)
class ProductAdmin(AuditAdminMixin, ExportCsvMixin, admin.ModelAdmin):
    list_display = ("article", "name_en", "category", "brand", "price_type", "price", "stock_status", "is_active", "is_featured", "updated_at", "updated_by")
    list_filter = ("is_active", "is_featured", "stock_status", "price_type", "category", "brand", "resolution", "camera_type", "recorder_channels", "has_poe")
    search_fields = (
        "article",
        "name_en",
        "name_ru",
        "name_kk",
        "short_description_en",
        "short_description_ru",
        "short_description_kk",
        "description_en",
        "description_ru",
        "description_kk",
        "documentation_en",
        "documentation_ru",
        "documentation_kk",
    )
    prepopulated_fields = {"slug": ("name_en",)}
    readonly_fields = AuditAdminMixin.readonly_fields
    autocomplete_fields = ("category", "brand")
    inlines = (ProductImageInline, ProductSpecificationInline)
    ordering = ("name_en",)
    list_select_related = ("category", "brand", "updated_by")
    list_per_page = 50
    date_hierarchy = "created_at"
    actions = (activate_items, deactivate_items, "export_as_csv")
    export_fields = ("id", "slug", "article", "name_en", "category_id", "brand_id", "price_type", "price", "stock_status", "is_active", "is_featured", "documentation_en", "documentation_ru", "documentation_kk")


@admin.register(ProductImage)
class ProductImageAdmin(AuditAdminMixin, ExportCsvMixin, admin.ModelAdmin):
    list_display = ("product", "image_preview", "is_main", "sort_order", "updated_at", "updated_by")
    list_filter = ("is_main", "created_at")
    search_fields = ("product__article", "product__name_en", "alt_en", "alt_ru", "alt_kk")
    autocomplete_fields = ("product",)
    readonly_fields = AuditAdminMixin.readonly_fields + ("image_preview",)
    list_select_related = ("product", "updated_by")
    list_per_page = 50
    actions = ("export_as_csv",)
    export_fields = ("id", "product_id", "image", "alt_en", "alt_ru", "alt_kk", "is_main", "sort_order")

    def image_preview(self, obj):
        if not obj.image:
            return "-"
        return format_html('<img src="{}" style="height: 56px; width: auto;" />', obj.image.url)


@admin.register(ProductSpecification)
class ProductSpecificationAdmin(AuditAdminMixin, ExportCsvMixin, admin.ModelAdmin):
    list_display = ("product", "name_en", "value_en", "sort_order", "updated_at", "updated_by")
    list_filter = ("created_at",)
    search_fields = ("product__article", "product__name_en", "name_en", "name_ru", "name_kk", "value_en", "value_ru", "value_kk")
    autocomplete_fields = ("product",)
    readonly_fields = AuditAdminMixin.readonly_fields
    list_select_related = ("product", "updated_by")
    list_per_page = 50
    actions = ("export_as_csv",)
    export_fields = ("id", "product_id", "name_en", "name_ru", "name_kk", "value_en", "value_ru", "value_kk", "sort_order")
