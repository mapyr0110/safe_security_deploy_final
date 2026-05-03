from django.conf import settings
from django.core.cache import cache
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response

from .models import Client, Lead
from .serializers import ClientSerializer, LeadAdminSerializer, LeadSerializer


class LeadViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Lead.objects.all()

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]

    def get_serializer_class(self):
        if self.action in {"list", "retrieve", "update", "partial_update"}:
            return LeadAdminSerializer
        return LeadSerializer

    def create(self, request, *args, **kwargs):
        rate_response = self._check_rate_limit(request)
        if rate_response is not None:
            return rate_response
        return super().create(request, *args, **kwargs)

    def _check_rate_limit(self, request):
        ip_address = self._client_ip(request)
        limit = getattr(settings, "LEAD_RATE_LIMIT_COUNT", 5)
        window = getattr(settings, "LEAD_RATE_LIMIT_WINDOW_SECONDS", 60)
        cache_key = f"lead-submissions:{ip_address}"
        attempts = cache.get(cache_key, 0)

        if attempts >= limit:
            return Response(
                {"detail": "Too many lead submissions. Please try again later."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        cache.set(cache_key, attempts + 1, timeout=window)
        return None

    @staticmethod
    def _client_ip(request) -> str:
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "unknown")


class ClientViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAdminUser()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        client, created = Client.objects.get_or_create(email=serializer.validated_data["email"])
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(self.get_serializer(client).data, status=status_code)
