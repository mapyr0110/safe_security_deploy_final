from rest_framework import serializers

from catalog.serializers import localized_value, request_language

from .models import BlogPost


class BlogPostListSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    excerpt = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ("id", "slug", "title", "excerpt", "cover_image_url", "published_at", "seo_title", "seo_description")

    def get_title(self, obj):
        return localized_value(obj, "title", request_language(self.context))

    def get_excerpt(self, obj):
        return localized_value(obj, "excerpt", request_language(self.context))

    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return ""
        request = self.context.get("request")
        url = obj.cover_image.url
        return request.build_absolute_uri(url) if request else url


class BlogPostDetailSerializer(BlogPostListSerializer):
    body = serializers.SerializerMethodField()

    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ("body",)

    def get_body(self, obj):
        return localized_value(obj, "body", request_language(self.context))
