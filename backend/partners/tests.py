from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import PartnerProfile


User = get_user_model()


class PartnerPortalTests(APITestCase):
    apply_endpoint = "/api/partners/apply/"

    def application_payload(self, email="partner@example.com"):
        return {
            "email": email,
            "contact_name": "Aidar Partner",
            "company_name": "Secure Partner LLP",
            "bin_or_iin": "123456789012",
            "city": "Almaty",
            "phone": "+77011234567",
            "website": "https://partner.example.com",
            "message": "We want partner pricing.",
        }

    def make_partner(self, status_value):
        user = User.objects.create_user(username=f"{status_value}@example.com", email=f"{status_value}@example.com", password="password")
        profile = PartnerProfile.objects.create(
            user=user,
            company_name=f"{status_value.title()} Partner",
            bin_or_iin=f"BIN-{status_value}",
            city="Almaty",
            phone="+77010000000",
            approval_status=status_value,
        )
        return user, profile

    def test_public_partner_application_creates_pending_profile(self):
        response = self.client.post(self.apply_endpoint, self.application_payload(), format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PartnerProfile.objects.count(), 1)
        profile = PartnerProfile.objects.get()
        self.assertEqual(profile.approval_status, PartnerProfile.ApprovalStatus.PENDING)
        self.assertEqual(profile.user.email, "partner@example.com")
        self.assertEqual(profile.contact_name, "Aidar Partner")
        self.assertEqual(profile.message, "We want partner pricing.")

    def test_public_partner_application_accepts_frontend_minimal_payload(self):
        response = self.client.post(
            self.apply_endpoint,
            {
                "email": "frontend-partner@example.com",
                "contact_name": "Frontend Partner",
                "company_name": "Frontend LLP",
                "phone": "77010000000",
                "message": "Please contact us.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        profile = PartnerProfile.objects.get(user__email="frontend-partner@example.com")
        self.assertEqual(profile.company_name, "Frontend LLP")
        self.assertEqual(profile.bin_or_iin, "")
        self.assertEqual(profile.city, "")
        self.assertFalse(profile.user.has_usable_password())

    def test_partner_phone_accepts_optional_plus_spaces_and_77_or_87_prefix(self):
        for index, phone in enumerate(["+77011234567", "77011234567", "87011234567", "+7 701 123 45 67"]):
            response = self.client.post(self.apply_endpoint, self.application_payload(email=f"phone-ok-{index}@example.com") | {"phone": phone}, format="json")

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_partner_phone_rejects_invalid_numbers(self):
        for phone in ["+76011234567", "7701123456", "770112345678", "77A11234567", "770-112-34567"]:
            response = self.client.post(self.apply_endpoint, self.application_payload(email=f"bad-{phone.replace('+', '').replace('A', 'a')}@example.com") | {"phone": phone}, format="json")

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn("phone", response.data)

    def test_partner_email_rejects_invalid_symbols(self):
        response = self.client.post(self.apply_endpoint, self.application_payload(email="bad email@example.com"), format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_authenticated_partner_can_get_and_patch_profile(self):
        user, profile = self.make_partner(PartnerProfile.ApprovalStatus.PENDING)
        self.client.force_authenticate(user=user)

        get_response = self.client.get("/api/b2b/profile/")
        patch_response = self.client.patch("/api/b2b/profile/", {"city": "Astana"}, format="json")

        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        profile.refresh_from_db()
        self.assertEqual(profile.city, "Astana")

    def test_anonymous_user_cannot_access_b2b_resources(self):
        self.assertEqual(self.client.get("/api/b2b/profile/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get("/api/b2b/prices/").status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get("/api/b2b/documents/").status_code, status.HTTP_403_FORBIDDEN)

    def test_pending_and_rejected_partners_cannot_access_prices_or_documents(self):
        for status_value in [PartnerProfile.ApprovalStatus.PENDING, PartnerProfile.ApprovalStatus.REJECTED]:
            user, _ = self.make_partner(status_value)
            self.client.force_authenticate(user=user)
            self.assertEqual(self.client.get("/api/b2b/prices/").status_code, status.HTTP_403_FORBIDDEN)
            self.assertEqual(self.client.get("/api/b2b/documents/").status_code, status.HTTP_403_FORBIDDEN)
            self.client.force_authenticate(user=None)

    def test_approved_partner_can_access_prices_and_documents(self):
        user, _ = self.make_partner(PartnerProfile.ApprovalStatus.APPROVED)
        self.client.force_authenticate(user=user)

        prices_response = self.client.get("/api/b2b/prices/")
        documents_response = self.client.get("/api/b2b/documents/")

        self.assertEqual(prices_response.status_code, status.HTTP_200_OK)
        self.assertEqual(documents_response.status_code, status.HTTP_200_OK)
        self.assertIn("results", prices_response.data)
        self.assertIn("results", documents_response.data)
