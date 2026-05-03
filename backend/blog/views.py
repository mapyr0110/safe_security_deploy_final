from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import BlogPost
from .serializers import BlogPostDetailSerializer, BlogPostListSerializer


class BlogPostPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 24


class BlogPostViewSet(ReadOnlyModelViewSet):
    lookup_field = "slug"
    permission_classes = [AllowAny]
    pagination_class = BlogPostPagination

    def get_queryset(self):
        return BlogPost.objects.filter(is_published=True).order_by("-published_at", "-id")

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BlogPostDetailSerializer
        return BlogPostListSerializer
