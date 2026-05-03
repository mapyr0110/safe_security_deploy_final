from django.db import models
from django.utils import timezone

from config.model_utils import AuditFields, generate_unique_slug


class Category(AuditFields):
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    name_en = models.CharField(max_length=160)
    name_ru = models.CharField(max_length=160)
    name_kk = models.CharField(max_length=160)
    description_en = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_kk = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "name_en"]
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        return self.name_en

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.name_en, max_length=120)
        super().save(*args, **kwargs)


class Brand(AuditFields):
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    name = models.CharField(max_length=160, unique=True)
    website = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "name"]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.name, max_length=120)
        super().save(*args, **kwargs)


class Product(AuditFields):
    class PriceType(models.TextChoices):
        ON_REQUEST = "on_request", "On request"
        FIXED = "fixed", "Fixed price"

    class StockStatus(models.TextChoices):
        IN_STOCK = "in_stock", "In stock"
        PREORDER = "preorder", "Preorder"
        OUT_OF_STOCK = "out_of_stock", "Out of stock"
        ON_REQUEST = "on_request", "On request"

    name_en = models.CharField(max_length=255)
    name_ru = models.CharField(max_length=255)
    name_kk = models.CharField(max_length=255)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    article = models.CharField(max_length=120, unique=True)
    category = models.ForeignKey(Category, related_name="products", on_delete=models.PROTECT)
    brand = models.ForeignKey(Brand, related_name="products", on_delete=models.PROTECT)
    short_description_en = models.TextField(blank=True)
    short_description_ru = models.TextField(blank=True)
    short_description_kk = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    description_ru = models.TextField(blank=True)
    description_kk = models.TextField(blank=True)
    documentation_en = models.TextField(blank=True)
    documentation_ru = models.TextField(blank=True)
    documentation_kk = models.TextField(blank=True)
    price_type = models.CharField(max_length=20, choices=PriceType.choices, default=PriceType.ON_REQUEST)
    price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    resolution = models.CharField(max_length=80, blank=True)
    camera_type = models.CharField(max_length=80, blank=True)
    recorder_channels = models.PositiveIntegerField(blank=True, null=True)
    has_poe = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    stock_status = models.CharField(max_length=20, choices=StockStatus.choices, default=StockStatus.ON_REQUEST)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name_en"]
        indexes = [
            models.Index(fields=["slug"], name="catalog_product_slug_idx"),
            models.Index(fields=["article"], name="catalog_product_article_idx"),
            models.Index(fields=["is_active", "is_featured"], name="cat_prod_active_feat_idx"),
            models.Index(fields=["stock_status"], name="catalog_product_stock_idx"),
            models.Index(fields=["price"], name="catalog_product_price_idx"),
            models.Index(fields=["resolution"], name="catalog_product_res_idx"),
            models.Index(fields=["camera_type"], name="catalog_product_cam_type_idx"),
            models.Index(fields=["recorder_channels"], name="catalog_product_channels_idx"),
            models.Index(fields=["has_poe"], name="catalog_product_poe_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.article} - {self.name_en}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.name_en, max_length=160)
        super().save(*args, **kwargs)


class ProductImage(AuditFields):
    product = models.ForeignKey(Product, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="products/")
    alt_en = models.CharField(max_length=255, blank=True)
    alt_ru = models.CharField(max_length=255, blank=True)
    alt_kk = models.CharField(max_length=255, blank=True)
    is_main = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return self.alt_en or self.product.name_en


class ProductSpecification(AuditFields):
    product = models.ForeignKey(Product, related_name="specifications", on_delete=models.CASCADE)
    name_en = models.CharField(max_length=160)
    name_ru = models.CharField(max_length=160)
    name_kk = models.CharField(max_length=160)
    value_en = models.CharField(max_length=255)
    value_ru = models.CharField(max_length=255)
    value_kk = models.CharField(max_length=255)
    sort_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "id"]

    def __str__(self) -> str:
        return f"{self.name_en}: {self.value_en}"
