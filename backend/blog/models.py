from django.db import models
from django.utils import timezone

from config.model_utils import AuditFields, generate_unique_slug


class BlogPost(AuditFields):
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    title_en = models.CharField(max_length=255)
    title_ru = models.CharField(max_length=255)
    title_kk = models.CharField(max_length=255)
    excerpt_en = models.TextField(blank=True)
    excerpt_ru = models.TextField(blank=True)
    excerpt_kk = models.TextField(blank=True)
    body_en = models.TextField(blank=True)
    body_ru = models.TextField(blank=True)
    body_kk = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="blog/", blank=True)
    published_at = models.DateTimeField(default=timezone.now)
    is_published = models.BooleanField(default=False)
    seo_title = models.CharField(max_length=255, blank=True)
    seo_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-id"]
        indexes = [
            models.Index(fields=["slug"], name="blog_post_slug_idx"),
            models.Index(fields=["is_published", "published_at"], name="blog_post_published_idx"),
        ]

    def __str__(self) -> str:
        return self.title_en

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self, self.title_en, max_length=160)
        super().save(*args, **kwargs)
