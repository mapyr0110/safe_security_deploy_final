import json
import subprocess
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from blog.models import BlogPost
from catalog.models import Brand, Category, Product, ProductSpecification


LANGUAGES = ("en", "ru", "kk")

BRAND_RULES = (
    ("Dahua", ("dahua", "dh-")),
    ("Ubiquiti", ("ubiquiti", "uvc-", "unifi")),
    ("HiWatch", ("hiwatch", "ds-n")),
    ("Hikvision", ("hikvision", "ds-", "ids-")),
)

PRODUCT_DEFAULTS = {
    "ip-cameras": {"camera_type": "bullet", "has_poe": True, "resolution": "4MP"},
    "hd-cameras": {"camera_type": "bullet", "has_poe": False, "resolution": "2MP"},
    "ip-recorders": {"has_poe": False},
    "hd-recorders": {"has_poe": False},
    "network": {"has_poe": True},
    "intercom": {"camera_type": "door-station", "has_poe": True},
    "accessories": {"has_poe": False},
}

DETAIL_TEXT = {
    "en": "Professional security equipment for commercial sites, warehouses, offices, and distributed surveillance systems.",
    "ru": "Профессиональное оборудование безопасности для коммерческих объектов, складов, офисов и распределённых систем видеонаблюдения.",
    "kk": "Коммерциялық нысандарға, қоймаларға, кеңселерге және таралған бейнебақылау жүйелеріне арналған кәсіби қауіпсіздік жабдығы.",
}

BLOG_BODY = {
    "en": "This article is imported from the current frontend content. Add the full editorial text in Django admin.",
    "ru": "Эта статья импортирована из текущего frontend-контента. Полный редакционный текст добавьте в Django admin.",
    "kk": "Бұл мақала ағымдағы frontend контентінен импортталды. Толық мәтінді Django admin ішінде қосыңыз.",
}


class Command(BaseCommand):
    help = "Import current React catalog/blog data into Django admin-managed models."

    def handle(self, *args, **options):
        root = settings.BASE_DIR.parent
        source_path = root / "src" / "shared" / "data" / "catalog.js"

        if not source_path.exists():
            raise CommandError(f"Frontend catalog file not found: {source_path}")

        data = self._load_frontend_data(source_path)
        brands = self._import_brands(data)
        categories = self._import_categories(data)
        product_count = self._import_products(data, categories, brands)
        blog_count = self._import_blog_posts(data)

        self.stdout.write(self.style.SUCCESS(f"Imported {len(categories)} categories, {len(brands)} brands, {product_count} products, and {blog_count} blog posts."))

    def _load_frontend_data(self, source_path):
        script = f"""
          import {{ getLocalizedCategories, getLocalizedProducts, getLocalizedBlogPosts }} from {json.dumps(source_path.as_uri())};
          const languages = ["en", "ru", "kk"];
          const data = {{ categories: {{}}, products: {{}}, blogPosts: {{}} }};
          for (const language of languages) {{
            data.categories[language] = getLocalizedCategories(language);
            data.products[language] = getLocalizedProducts(language);
            data.blogPosts[language] = getLocalizedBlogPosts(language);
          }}
          console.log(JSON.stringify(data));
        """
        try:
            result = subprocess.run(
                ["node", "--input-type=module", "-e", script],
                check=True,
                capture_output=True,
                text=True,
                encoding="utf-8",
            )
        except FileNotFoundError as exc:
            raise CommandError("Node.js is required to import the current frontend catalog data.") from exc
        except subprocess.CalledProcessError as exc:
            raise CommandError(f"Failed to read frontend catalog data: {exc.stderr}") from exc
        return json.loads(result.stdout)

    def _import_brands(self, data):
        brand_names = sorted({self._guess_brand(product) for product in data["products"]["en"]})
        brands = {}
        for index, name in enumerate(brand_names):
            brand, _ = Brand.objects.update_or_create(
                name=name,
                defaults={
                    "slug": self._slug_for_brand(name),
                    "is_active": True,
                    "sort_order": index,
                },
            )
            brands[name] = brand
        return brands

    def _import_categories(self, data):
        categories = {}
        for index, category_en in enumerate(data["categories"]["en"]):
            slug = category_en["slug"]
            localized = self._localized_by_slug(data["categories"], slug)
            category, _ = Category.objects.update_or_create(
                slug=slug,
                defaults={
                    "name_en": localized["en"]["title"],
                    "name_ru": localized["ru"]["title"],
                    "name_kk": localized["kk"]["title"],
                    "description_en": localized["en"]["description"],
                    "description_ru": localized["ru"]["description"],
                    "description_kk": localized["kk"]["description"],
                    "is_active": True,
                    "sort_order": index,
                },
            )
            categories[slug] = category
        return categories

    def _import_products(self, data, categories, brands):
        imported = 0
        for index, product_en in enumerate(data["products"]["en"]):
            product_id = product_en["id"]
            localized = self._localized_by_id(data["products"], product_id)
            brand_name = self._guess_brand(product_en)
            category_slug = product_en["category"]
            filter_defaults = PRODUCT_DEFAULTS.get(category_slug, {})
            recorder_channels = self._channels_from_text(product_en["name"])
            resolution = self._resolution_from_text(product_en["name"], filter_defaults.get("resolution", ""))

            product, _ = Product.objects.update_or_create(
                article=product_en["article"],
                defaults={
                    "slug": product_id,
                    "category": categories[category_slug],
                    "brand": brands[brand_name],
                    "name_en": localized["en"]["name"],
                    "name_ru": localized["ru"]["name"],
                    "name_kk": localized["kk"]["name"],
                    "short_description_en": categories[category_slug].description_en,
                    "short_description_ru": categories[category_slug].description_ru,
                    "short_description_kk": categories[category_slug].description_kk,
                    "description_en": DETAIL_TEXT["en"],
                    "description_ru": DETAIL_TEXT["ru"],
                    "description_kk": DETAIL_TEXT["kk"],
                    "price_type": Product.PriceType.ON_REQUEST,
                    "price": None,
                    "resolution": resolution,
                    "camera_type": filter_defaults.get("camera_type", ""),
                    "recorder_channels": recorder_channels,
                    "has_poe": filter_defaults.get("has_poe", False),
                    "is_active": True,
                    "is_featured": index < 8,
                    "stock_status": Product.StockStatus.ON_REQUEST,
                },
            )
            self._sync_specs(product, categories[category_slug], brands[brand_name])
            imported += 1
        return imported

    def _import_blog_posts(self, data):
        imported = 0
        for post_en in data["blogPosts"]["en"]:
            localized = self._localized_by_title(data["blogPosts"], post_en["title"])
            published_at = timezone.make_aware(datetime.strptime(post_en["date"], "%d.%m.%Y"))
            BlogPost.objects.update_or_create(
                slug=self._slugify(post_en["title"]),
                defaults={
                    "title_en": localized["en"]["title"],
                    "title_ru": localized["ru"]["title"],
                    "title_kk": localized["kk"]["title"],
                    "excerpt_en": localized["en"]["excerpt"],
                    "excerpt_ru": localized["ru"]["excerpt"],
                    "excerpt_kk": localized["kk"]["excerpt"],
                    "body_en": BLOG_BODY["en"],
                    "body_ru": BLOG_BODY["ru"],
                    "body_kk": BLOG_BODY["kk"],
                    "published_at": published_at,
                    "is_published": True,
                    "seo_title": localized["en"]["title"],
                    "seo_description": localized["en"]["excerpt"],
                },
            )
            imported += 1
        return imported

    def _sync_specs(self, product, category, brand):
        specs = [
            ("Article", "Артикул", "Артикул", product.article, product.article, product.article),
            ("Brand", "Бренд", "Бренд", brand.name, brand.name, brand.name),
            ("Category", "Категория", "Санат", category.name_en, category.name_ru, category.name_kk),
            ("Stock status", "Статус наличия", "Қойма статусы", product.get_stock_status_display(), product.get_stock_status_display(), product.get_stock_status_display()),
        ]
        if product.resolution:
            specs.append(("Resolution", "Разрешение", "Ажыратымдылық", product.resolution, product.resolution, product.resolution))
        if product.camera_type:
            specs.append(("Camera type", "Тип камеры", "Камера түрі", product.camera_type, product.camera_type, product.camera_type))
        if product.recorder_channels:
            channels = str(product.recorder_channels)
            specs.append(("Channels", "Каналы", "Арналар", channels, channels, channels))
        if product.has_poe:
            specs.append(("PoE", "PoE", "PoE", "Yes", "Да", "Иә"))

        for index, spec in enumerate(specs):
            obj, _ = ProductSpecification.objects.get_or_create(product=product, name_en=spec[0])
            obj.name_ru = spec[1]
            obj.name_kk = spec[2]
            obj.value_en = spec[3]
            obj.value_ru = spec[4]
            obj.value_kk = spec[5]
            obj.sort_order = index
            obj.save()

    def _localized_by_slug(self, items_by_language, slug):
        return {language: next(item for item in items_by_language[language] if item["slug"] == slug) for language in LANGUAGES}

    def _localized_by_id(self, items_by_language, item_id):
        return {language: next(item for item in items_by_language[language] if item["id"] == item_id) for language in LANGUAGES}

    def _localized_by_title(self, posts_by_language, english_title):
        english_posts = posts_by_language["en"]
        index = next(index for index, item in enumerate(english_posts) if item["title"] == english_title)
        return {language: posts_by_language[language][index] for language in LANGUAGES}

    def _guess_brand(self, product):
        haystack = f"{product['name']} {product['article']}".lower()
        for brand, needles in BRAND_RULES:
            if any(needle in haystack for needle in needles):
                return brand
        return "Hikvision"

    def _slug_for_brand(self, name):
        return self._slugify(name)

    def _slugify(self, value):
        from django.utils.text import slugify

        return slugify(value) or value.lower().replace(" ", "-")

    def _channels_from_text(self, text):
        lowered = text.lower()
        for value in (256, 128, 16, 8, 4):
            if f"{value}-channel" in lowered or f"{value} channel" in lowered:
                return value
        return None

    def _resolution_from_text(self, text, fallback):
        lowered = text.lower()
        if "4k" in lowered:
            return "4K"
        for value in ("8mp", "5mp", "4mp", "2mp"):
            if value in lowered:
                return value.upper()
        return fallback
