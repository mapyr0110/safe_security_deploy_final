from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from blog.views import BlogPostViewSet
from catalog.views import BrandViewSet, CatalogFilterOptionsView, CategoryViewSet, ProductSearchView, ProductViewSet
from leads.views import ClientViewSet, LeadViewSet
from partners.views import B2BDocumentsView, B2BPricesView, B2BProfileView, PartnerApplicationView


router = DefaultRouter()
router.register("blog", BlogPostViewSet, basename="blog")
router.register("categories", CategoryViewSet, basename="category")
router.register("brands", BrandViewSet, basename="brand")
router.register("products", ProductViewSet, basename="product")
router.register("leads", LeadViewSet, basename="lead")
router.register("clients", ClientViewSet, basename="client")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/search/", ProductSearchView.as_view(), name="product-search"),
    path("api/catalog/filter-options/", CatalogFilterOptionsView.as_view(), name="catalog-filter-options"),
    path("api/partners/apply/", PartnerApplicationView.as_view(), name="partner-apply"),
    path("api/b2b/profile/", B2BProfileView.as_view(), name="b2b-profile"),
    path("api/b2b/prices/", B2BPricesView.as_view(), name="b2b-prices"),
    path("api/b2b/documents/", B2BDocumentsView.as_view(), name="b2b-documents"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
