from rest_framework import serializers

from .models import Brand, Category, Product, ProductImage, ProductSpecification


SUPPORTED_LANGUAGES = {"en", "ru", "kk"}


def request_language(context: dict) -> str:
    request = context.get("request")
    language = request.query_params.get("language", "en") if request else "en"
    return language if language in SUPPORTED_LANGUAGES else "en"


def localized_value(instance, field: str, language: str) -> str:
    return getattr(instance, f"{field}_{language}") or getattr(instance, f"{field}_en")


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id", "slug", "name", "website")


class CategoryListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ("id", "slug", "name", "description")

    def get_name(self, obj: Category) -> str:
        return localized_value(obj, "name", request_language(self.context))

    def get_description(self, obj: Category) -> str:
        return localized_value(obj, "description", request_language(self.context))


class CategoryDetailSerializer(CategoryListSerializer):
    class Meta(CategoryListSerializer.Meta):
        fields = CategoryListSerializer.Meta.fields + ("created_at", "updated_at")


class ProductImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    alt = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ("id", "url", "alt", "is_main", "sort_order")

    def get_url(self, obj: ProductImage) -> str:
        if not obj.image:
            return ""
        request = self.context.get("request")
        url = obj.image.url
        return request.build_absolute_uri(url) if request else url

    def get_alt(self, obj: ProductImage) -> str:
        return localized_value(obj, "alt", request_language(self.context)) or obj.product.name_en


class ProductSpecificationSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()

    class Meta:
        model = ProductSpecification
        fields = ("id", "name", "value", "sort_order")

    def get_name(self, obj: ProductSpecification) -> str:
        return localized_value(obj, "name", request_language(self.context))

    def get_value(self, obj: ProductSpecification) -> str:
        return localized_value(obj, "value", request_language(self.context))


class ProductListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    category = CategoryListSerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "article",
            "category",
            "brand",
            "short_description",
            "price_type",
            "price",
            "resolution",
            "camera_type",
            "recorder_channels",
            "has_poe",
            "is_featured",
            "stock_status",
            "main_image",
            "created_at",
            "updated_at",
        )

    def get_name(self, obj: Product) -> str:
        return localized_value(obj, "name", request_language(self.context))

    def get_short_description(self, obj: Product) -> str:
        return localized_value(obj, "short_description", request_language(self.context))

    def get_main_image(self, obj: Product) -> dict | None:
        image = next((item for item in obj.images.all() if item.is_main), None)
        image = image or next(iter(obj.images.all()), None)
        if image is None:
            return None
        return ProductImageSerializer(image, context=self.context).data


class ProductCardSerializer(ProductListSerializer):
    class Meta(ProductListSerializer.Meta):
        fields = (
            "id",
            "name",
            "slug",
            "article",
            "category",
            "brand",
            "price_type",
            "price",
            "main_image",
        )


class ProductDetailSerializer(ProductListSerializer):
    description = serializers.SerializerMethodField()
    documentation = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ("description", "documentation", "images", "specifications")

    def get_description(self, obj: Product) -> str:
        language = request_language(self.context)
        return (
            localized_value(obj, "description", language)
            or localized_value(obj, "short_description", language)
            or localized_value(obj.category, "description", language)
        )

    def get_documentation(self, obj: Product) -> str:
        return localized_value(obj, "documentation", request_language(self.context))
