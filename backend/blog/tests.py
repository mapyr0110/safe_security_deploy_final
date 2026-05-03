import shutil
import tempfile
from datetime import timedelta

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib import admin
from django.test import override_settings
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import BlogPost


class BlogApiTests(APITestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        self.media_override = override_settings(MEDIA_ROOT=self.media_root)
        self.media_override.enable()
        self.addCleanup(self.media_override.disable)
        self.addCleanup(shutil.rmtree, self.media_root, ignore_errors=True)

        self.post = BlogPost.objects.create(
            slug="warehouse-camera-guide",
            title_en="Warehouse camera guide",
            title_ru="Р“РёРґ РїРѕ РєР°РјРµСЂР°Рј РґР»СЏ СЃРєР»Р°РґР°",
            title_kk="ТљРѕР№РјР° РєР°РјРµСЂР°Р»Р°СЂС‹ Р±РѕР№С‹РЅС€Р° РЅТ±СЃТ›Р°СѓР»С‹Т›",
            excerpt_en="How to choose cameras for warehouses.",
            excerpt_ru="РљР°Рє РІС‹Р±СЂР°С‚СЊ РєР°РјРµСЂС‹ РґР»СЏ СЃРєР»Р°РґРѕРІ.",
            excerpt_kk="ТљРѕР№РјР° ТЇС€С–РЅ РєР°РјРµСЂР°Р»Р°СЂРґС‹ С‚Р°ТЈРґР°Сѓ.",
            body_en="Full English body.",
            body_ru="РџРѕР»РЅС‹Р№ СЂСѓСЃСЃРєРёР№ С‚РµРєСЃС‚.",
            body_kk="ТљР°Р·Р°Т›С€Р° С‚РѕР»С‹Т› РјУ™С‚С–РЅ.",
            cover_image=SimpleUploadedFile("cover.jpg", b"image-bytes", content_type="image/jpeg"),
            is_published=True,
            published_at=timezone.now(),
            seo_title="Warehouse camera SEO",
            seo_description="SEO description",
        )
        BlogPost.objects.create(
            slug="draft-post",
            title_en="Draft post",
            title_ru="Р§РµСЂРЅРѕРІРёРє",
            title_kk="Р–РѕР±Р°",
            is_published=False,
            published_at=timezone.now() - timedelta(days=1),
        )

    def test_blog_list_only_returns_published_posts(self):
        response = self.client.get("/api/blog/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["slug"], self.post.slug)

    def test_blog_supports_localized_response(self):
        response = self.client.get("/api/blog/?language=ru")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["results"][0]["title"], self.post.title_ru)
        self.assertEqual(response.data["results"][0]["excerpt"], self.post.excerpt_ru)

    def test_blog_detail_by_slug_includes_body(self):
        response = self.client.get(f"/api/blog/{self.post.slug}/?language=kk")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["slug"], self.post.slug)
        self.assertEqual(response.data["body"], self.post.body_kk)

    def test_blog_list_is_paginated(self):
        for index in range(7):
            BlogPost.objects.create(
                slug=f"published-post-{index}",
                title_en=f"Published post {index}",
                title_ru=f"РџСѓР±Р»РёРєР°С†РёСЏ {index}",
                title_kk=f"РњР°Т›Р°Р»Р° {index}",
                is_published=True,
                published_at=timezone.now() - timedelta(minutes=index + 1),
            )

        response = self.client.get("/api/blog/?page_size=3")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 8)
        self.assertEqual(len(response.data["results"]), 3)
        self.assertIsNotNone(response.data["next"])

    def test_blog_slug_generation(self):
        post = BlogPost.objects.create(
            title_en="Automatic Blog Slug",
            title_ru="Automatic Blog Slug",
            title_kk="Automatic Blog Slug",
        )
        duplicate = BlogPost.objects.create(
            title_en="Automatic Blog Slug",
            title_ru="Automatic Blog Slug",
            title_kk="Automatic Blog Slug",
        )

        self.assertEqual(post.slug, "automatic-blog-slug")
        self.assertEqual(duplicate.slug, "automatic-blog-slug-2")
        self.assertIn(BlogPost, admin.site._registry)
