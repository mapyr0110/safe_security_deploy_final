from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from catalog.models import Product
from catalog.serializers import ProductCardSerializer

from .models import PartnerProfile
from .permissions import IsApprovedPartner
from .serializers import PartnerApplicationSerializer, PartnerProfileSerializer


class PartnerApplicationView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = PartnerApplicationSerializer


class B2BProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PartnerProfileSerializer

    def get_object(self):
        profile = getattr(self.request.user, "partner_profile", None)
        if profile is None:
            raise NotFound("Partner profile not found.")
        return profile


class B2BPricesView(APIView):
    permission_classes = [IsApprovedPartner]

    def get(self, request):
        products = (
            Product.objects.filter(is_active=True, category__is_active=True, brand__is_active=True)
            .select_related("category", "brand")
            .prefetch_related("images")
            .order_by("name_en")
        )
        serializer = ProductCardSerializer(products, many=True, context={"request": request})
        return Response({"results": serializer.data})


class B2BDocumentsView(APIView):
    permission_classes = [IsApprovedPartner]

    def get(self, request):
        return Response({"results": []})
