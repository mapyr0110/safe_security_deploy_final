import shutil
import tempfile

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib import admin
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from blog.models import BlogPost
from leads.models import Lead
from partners.models import PartnerProfile
from .models import Brand, Category, Product, ProductImage, ProductSpecification


class CatalogApiTests(APITestCase):
    def setUp(self):
        self.media_root = tempfile.mkdtemp()
        self.media_override = override_settings(MEDIA_ROOT=self.media_root)
        self.media_override.enable()
        self.addCleanup(self.media_override.disable)
        self.addCleanup(shutil.rmtree, self.media_root, ignore_errors=True)

        self.category = Category.objects.create(
            slug="ip-cameras",
            name_en="IP cameras",
            name_ru="IP видеокамеры",
            name_kk="IP бейнекамералар",
            description_en="Network security cameras",
            description_ru="Сетевые камеры безопасности",
            description_kk="Желілік қауіпсіздік камералары",
        )
        self.other_category = Category.objects.create(
            slug="recorders",
            name_en="Recorders",
            name_ru="Регистраторы",
            name_kk="Тіркеушілер",
        )
        self.brand = Brand.objects.create(slug="hikvision", name="Hikvision")
        self.product = Product.objects.create(
            slug="ds-2cd1041g2-liu",
            article="DS-2CD1041G2-LIU",
            category=self.category,
            brand=self.brand,
            name_en="Bullet IP camera",
            name_ru="Цилиндрическая IP камера",
            name_kk="Цилиндрлік IP камера",
            short_description_en="4MP camera",
            short_description_ru="Камера 4MP",
            short_description_kk="4MP камера",
            description_en="Professional IP camera for outdoor security.",
            description_ru="Профессиональная IP камера для улицы.",
            description_kk="Сыртқы қауіпсіздікке арналған кәсіби IP камера.",
            price_type=Product.PriceType.FIXED,
            price="52000.00",
            resolution="4MP",
            camera_type="bullet",
            has_poe=True,
            is_featured=True,
            stock_status=Product.StockStatus.IN_STOCK,
        )
        ProductSpecification.objects.create(
            product=self.product,
            name_en="Resolution",
            name_ru="Разрешение",
            name_kk="Ажыратымдылық",
            value_en="4MP",
            value_ru="4MP",
            value_kk="4MP",
        )
        ProductImage.objects.create(
            product=self.product,
            image=SimpleUploadedFile("camera.jpg", b"image-bytes", content_type="image/jpeg"),
            alt_en="Camera front",
            alt_ru="Камера спереди",
            alt_kk="Камера алдынан",
            is_main=True,
        )
        Product.objects.create(
            slug="inactive-camera",
            article="INACTIVE-1",
            category=self.category,
            brand=self.brand,
            name_en="Inactive camera",
            name_ru="Неактивная камера",
            name_kk="Белсенді емес камера",
            is_active=False,
        )
        self.recorder = Product.objects.create(
            slug="recorder",
            article="REC-1",
            category=self.other_category,
            brand=self.brand,
            name_en="Recorder",
            name_ru="Регистратор",
            name_kk="Тіркеуші",
            price_type=Product.PriceType.FIXED,
            price="180000.00",
            recorder_channels=16,
            stock_status=Product.StockStatus.PREORDER,
        )

    def test_product_listing_excludes_inactive_products(self):
        response = self.client.get("/api/products/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = {item["slug"] for item in response.data}
        self.assertIn(self.product.slug, slugs)
        self.assertIn("recorder", slugs)
        self.assertNotIn("inactive-camera", slugs)

    def test_product_detail_returns_optimized_detail_payload(self):
        response = self.client.get(f"/api/products/{self.product.slug}/?language=ru")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Цилиндрическая IP камера")
        self.assertEqual(response.data["category"]["slug"], self.category.slug)
        self.assertEqual(response.data["brand"]["name"], self.brand.name)
        self.assertEqual(response.data["specifications"][0]["name"], "Разрешение")
        self.assertEqual(response.data["images"][0]["alt"], "Камера спереди")

    def test_category_filtering(self):
        response = self.client.get(f"/api/products/?category={self.category.slug}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["slug"] for item in response.data], [self.product.slug])

    def test_category_list_and_detail_are_public(self):
        list_response = self.client.get("/api/categories/?language=kk")
        detail_response = self.client.get(f"/api/categories/{self.category.slug}/?language=kk")

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data[0]["name"], "IP бейнекамералар")
        self.assertEqual(detail_response.data["slug"], self.category.slug)

    def test_filters_by_brand_stock_and_featured(self):
        response = self.client.get("/api/products/?brand=hikvision&stock_status=in_stock&is_featured=true")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["slug"] for item in response.data], [self.product.slug])

    def test_advanced_combined_filters_are_composable(self):
        Product.objects.create(
            slug="dome-camera",
            article="DOME-1",
            category=self.category,
            brand=self.brand,
            name_en="Dome IP camera",
            name_ru="Купольная IP камера",
            name_kk="Күмбезді IP камера",
            price_type=Product.PriceType.FIXED,
            price="75000.00",
            resolution="8MP",
            camera_type="dome",
            has_poe=True,
            is_featured=True,
            stock_status=Product.StockStatus.IN_STOCK,
        )

        response = self.client.get(
            "/api/products/"
            "?category=ip-cameras"
            "&brand=hikvision"
            "&stock_status=in_stock"
            "&price_min=50000"
            "&price_max=60000"
            "&resolution=4MP"
            "&camera_type=bullet"
            "&has_poe=true"
            "&is_featured=true"
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["slug"] for item in response.data], [self.product.slug])

    def test_recorder_channels_filter(self):
        response = self.client.get("/api/products/?category=recorders&recorder_channels=16")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["slug"] for item in response.data], [self.recorder.slug])

    def test_product_ordering_options(self):
        cheap_camera = Product.objects.create(
            slug="cheap-camera",
            article="CHEAP-1",
            category=self.category,
            brand=self.brand,
            name_en="Cheap camera",
            name_ru="Дешевая камера",
            name_kk="Арзан камера",
            price_type=Product.PriceType.FIXED,
            price="10000.00",
        )

        price_asc = self.client.get("/api/products/?ordering=price_asc")
        price_desc = self.client.get("/api/products/?ordering=price_desc")
        name_order = self.client.get("/api/products/?ordering=name")

        self.assertEqual(price_asc.status_code, status.HTTP_200_OK)
        self.assertEqual(price_desc.status_code, status.HTTP_200_OK)
        self.assertEqual(name_order.status_code, status.HTTP_200_OK)
        self.assertEqual(price_asc.data[0]["slug"], cheap_camera.slug)
        self.assertEqual(price_desc.data[0]["slug"], self.recorder.slug)
        self.assertEqual(name_order.data[0]["slug"], self.product.slug)

    def test_filter_options_response_uses_active_products(self):
        Product.objects.create(
            slug="inactive-filter-source",
            article="INACTIVE-FILTER",
            category=self.category,
            brand=self.brand,
            name_en="Inactive filter source",
            name_ru="Неактивный источник фильтров",
            name_kk="Белсенді емес сүзгі көзі",
            resolution="12MP",
            camera_type="hidden",
            recorder_channels=64,
            is_active=False,
        )

        response = self.client.get("/api/catalog/filter-options/?language=en")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual({item["slug"] for item in response.data["categories"]}, {"ip-cameras", "recorders"})
        self.assertEqual([item["slug"] for item in response.data["brands"]], ["hikvision"])
        self.assertIn("4MP", response.data["resolutions"])
        self.assertNotIn("12MP", response.data["resolutions"])
        self.assertEqual(response.data["camera_types"], ["bullet"])
        self.assertEqual(response.data["recorder_channels"], [16])
        self.assertEqual(response.data["price"]["price_min"], "52000")
        self.assertEqual(response.data["price"]["price_max"], "180000")

    def test_slug_generation_for_catalog_models(self):
        category = Category.objects.create(
            name_en="Security Cameras",
            name_ru="Security Cameras",
            name_kk="Security Cameras",
        )
        duplicate_category = Category.objects.create(
            name_en="Security Cameras",
            name_ru="Security Cameras",
            name_kk="Security Cameras",
        )
        brand = Brand.objects.create(name="Axis Communications")
        product = Product.objects.create(
            article="AUTO-SLUG-1",
            category=category,
            brand=brand,
            name_en="Auto Slug Camera",
            name_ru="Auto Slug Camera",
            name_kk="Auto Slug Camera",
        )

        self.assertEqual(category.slug, "security-cameras")
        self.assertEqual(duplicate_category.slug, "security-cameras-2")
        self.assertEqual(brand.slug, "axis-communications")
        self.assertEqual(product.slug, "auto-slug-camera")

    def test_product_image_upload_path(self):
        image = ProductImage.objects.create(
            product=self.product,
            image=SimpleUploadedFile("admin-camera.jpg", b"image-bytes", content_type="image/jpeg"),
            alt_en="Admin camera",
        )

        self.assertTrue(image.image.name.startswith("products/"))
        self.assertTrue(image.image.name.endswith(".jpg"))

    def test_admin_models_are_registered(self):
        for model in [Category, Brand, Product, ProductImage, ProductSpecification, Lead, PartnerProfile, BlogPost]:
            self.assertIn(model, admin.site._registry)

    def test_search_ranks_exact_article_above_partial_article_matches(self):
        partial_match = Product.objects.create(
            slug="ds-2cd1041g2-liu-pro",
            article="DS-2CD1041G2-LIU-PRO",
            category=self.category,
            brand=self.brand,
            name_en="Bullet IP camera pro",
            name_ru="Р¦РёР»РёРЅРґСЂРёС‡РµСЃРєР°СЏ IP РєР°РјРµСЂР° pro",
            name_kk="Р¦РёР»РёРЅРґСЂР»С–Рє IP РєР°РјРµСЂР° pro",
        )

        response = self.client.get(f"/api/search/?q={self.product.article}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [item["slug"] for item in response.data["results"]]
        self.assertEqual(slugs[:2], [self.product.slug, partial_match.slug])

    def test_search_supports_localized_text_and_response_language(self):
        query = self.product.name_ru.split()[0]

        response = self.client.get(f"/api/search/?q={query}&language=ru")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        result = response.data["results"][0]
        self.assertEqual(result["slug"], self.product.slug)
        self.assertEqual(result["name"], self.product.name_ru)
        self.assertEqual(result["category"]["name"], self.category.name_ru)

    def test_search_category_filtering_limits_results(self):
        Product.objects.create(
            slug="camera-recorder",
            article="CAM-REC-1",
            category=self.other_category,
            brand=self.brand,
            name_en="Camera recorder",
            name_ru="Р РµРіРёСЃС‚СЂР°С‚РѕСЂ РґР»СЏ РєР°РјРµСЂ",
            name_kk="РљР°РјРµСЂР°Р»Р°СЂТ“Р° Р°СЂРЅР°Р»Т“Р°РЅ С‚С–СЂРєРµСѓС€",
        )

        response = self.client.get(f"/api/search/?q=camera&category={self.category.slug}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([item["slug"] for item in response.data["results"]], [self.product.slug])

    def test_search_handles_empty_query_and_empty_results(self):
        empty_query_response = self.client.get("/api/search/?q=")
        no_match_response = self.client.get("/api/search/?q=does-not-exist")

        self.assertEqual(empty_query_response.status_code, status.HTTP_200_OK)
        self.assertEqual(empty_query_response.data["count"], 0)
        self.assertEqual(empty_query_response.data["results"], [])
        self.assertEqual(no_match_response.status_code, status.HTTP_200_OK)
        self.assertEqual(no_match_response.data["count"], 0)
