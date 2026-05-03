from django.db.models import Case, IntegerField, Max, Min, Q, Value, When
from rest_framework.generics import GenericAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import Brand, Category, Product
from .serializers import BrandSerializer, CategoryDetailSerializer, CategoryListSerializer, ProductCardSerializer, ProductDetailSerializer, ProductListSerializer


TRUE_VALUES = {"true", "1", "yes"}
FALSE_VALUES = {"false", "0", "no"}


def active_products():
    return Product.objects.filter(is_active=True, category__is_active=True, brand__is_active=True)


def apply_product_filters(queryset, params):
    if category := params.get("category"):
        queryset = queryset.filter(category__slug=category)
    if brand := params.get("brand"):
        queryset = queryset.filter(brand__slug=brand)
    if stock_status := params.get("stock_status"):
        queryset = queryset.filter(stock_status=stock_status)
    if price_min := params.get("price_min"):
        queryset = queryset.filter(price__gte=price_min)
    if price_max := params.get("price_max"):
        queryset = queryset.filter(price__lte=price_max)
    if resolution := params.get("resolution"):
        queryset = queryset.filter(resolution__iexact=resolution)
    if camera_type := params.get("camera_type"):
        queryset = queryset.filter(camera_type__iexact=camera_type)
    if recorder_channels := params.get("recorder_channels"):
        queryset = queryset.filter(recorder_channels=recorder_channels)
    if (has_poe := params.get("has_poe")) is not None:
        if has_poe.lower() in TRUE_VALUES:
            queryset = queryset.filter(has_poe=True)
        elif has_poe.lower() in FALSE_VALUES:
            queryset = queryset.filter(has_poe=False)
    if (is_featured := params.get("is_featured")) is not None:
        if is_featured.lower() in TRUE_VALUES:
            queryset = queryset.filter(is_featured=True)
        elif is_featured.lower() in FALSE_VALUES:
            queryset = queryset.filter(is_featured=False)
    return queryset


def apply_product_ordering(queryset, ordering):
    ordering_map = {
        "newest": ("-created_at", "-id"),
        "price_asc": ("price", "name_en", "id"),
        "price_desc": ("-price", "name_en", "id"),
        "name": ("name_en", "id"),
    }
    return queryset.order_by(*ordering_map.get(ordering, ordering_map["name"]))


class CategoryViewSet(ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Category.objects.filter(is_active=True).order_by("sort_order", "name_en")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return CategoryDetailSerializer
        return CategoryListSerializer


class BrandViewSet(ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [AllowAny]
    serializer_class = BrandSerializer

    def get_queryset(self):
        return Brand.objects.filter(is_active=True).order_by("sort_order", "name")


class ProductViewSet(ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = (
            active_products()
            .select_related("category", "brand")
            .prefetch_related("images", "specifications")
        )
        params = self.request.query_params
        return apply_product_ordering(apply_product_filters(queryset, params), params.get("ordering"))

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer


class ProductSearchPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


class ProductSearchView(GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = ProductCardSerializer
    pagination_class = ProductSearchPagination

    def get(self, request):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def get_queryset(self):
        query = self.request.query_params.get("q", "").strip()
        queryset = (
            active_products()
            .select_related("category", "brand")
            .prefetch_related("images")
        )

        queryset = apply_product_filters(queryset, self.request.query_params)

        if not query:
            return Product.objects.none()

        search_filter = (
            Q(article__icontains=query)
            | Q(name_en__icontains=query)
            | Q(name_ru__icontains=query)
            | Q(name_kk__icontains=query)
            | Q(short_description_en__icontains=query)
            | Q(short_description_ru__icontains=query)
            | Q(short_description_kk__icontains=query)
            | Q(category__name_en__icontains=query)
            | Q(category__name_ru__icontains=query)
            | Q(category__name_kk__icontains=query)
            | Q(brand__name__icontains=query)
        )

        return (
            queryset.filter(search_filter)
            .annotate(
                article_rank=Case(
                    When(article__iexact=query, then=Value(0)),
                    When(article__icontains=query, then=Value(1)),
                    default=Value(2),
                    output_field=IntegerField(),
                )
            )
            .order_by("article_rank", "name_en", "id")
        )


class CatalogFilterOptionsView(GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request):
        queryset = active_products().select_related("category", "brand")
        category_ids = queryset.values_list("category_id", flat=True).distinct()
        brand_ids = queryset.values_list("brand_id", flat=True).distinct()
        price_range = queryset.aggregate(price_min=Min("price"), price_max=Max("price"))

        return Response(
            {
                "categories": CategoryListSerializer(
                    Category.objects.filter(id__in=category_ids).order_by("sort_order", "name_en"),
                    many=True,
                    context={"request": request},
                ).data,
                "brands": BrandSerializer(
                    Brand.objects.filter(id__in=brand_ids).order_by("sort_order", "name"),
                    many=True,
                    context={"request": request},
                ).data,
                "stock_statuses": self._distinct_values(queryset, "stock_status"),
                "resolutions": self._distinct_values(queryset, "resolution"),
                "camera_types": self._distinct_values(queryset, "camera_type"),
                "recorder_channels": self._distinct_values(queryset, "recorder_channels"),
                "has_poe": sorted(set(queryset.values_list("has_poe", flat=True))),
                "price": {
                    "price_min": self._decimal_to_string(price_range["price_min"]),
                    "price_max": self._decimal_to_string(price_range["price_max"]),
                },
            }
        )

    @staticmethod
    def _distinct_values(queryset, field):
        values = queryset.exclude(**{f"{field}__isnull": True})
        if field in {"stock_status", "resolution", "camera_type"}:
            values = values.exclude(**{field: ""})
        return list(values.values_list(field, flat=True).distinct().order_by(field))

    @staticmethod
    def _decimal_to_string(value):
        if value is None:
            return None
        return format(value.normalize(), "f")
