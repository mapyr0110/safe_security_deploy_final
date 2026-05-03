from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Client, Lead


class LeadApiTests(APITestCase):
    endpoint = "/api/leads/"

    def setUp(self):
        cache.clear()
        self.payload = {
            "name": "Aidar",
            "company": "Safe Integrator",
            "phone": "+77011234567",
            "email": "aidar@example.com",
            "message": "Please prepare a camera specification.",
            "source_page": "/contact",
            "language": "en",
        }

    def test_public_user_can_submit_lead(self):
        response = self.client.post(self.endpoint, self.payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Lead.objects.count(), 1)
        lead = Lead.objects.get()
        self.assertEqual(lead.status, Lead.Status.NEW)
        self.assertEqual(lead.name, self.payload["name"])
        self.assertEqual(response.data["status"], Lead.Status.NEW)

    def test_validation_errors_are_clean_json(self):
        response = self.client.post(
            self.endpoint,
            {
                **self.payload,
                "name": "A",
                "phone": "123",
                "message": "Hi",
                "email": "not-an-email",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)
        self.assertIn("phone", response.data)
        self.assertIn("message", response.data)
        self.assertIn("email", response.data)

    def test_honeypot_blocks_spam(self):
        response = self.client.post(self.endpoint, {**self.payload, "website": "https://spam.example"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Lead.objects.count(), 0)
        self.assertIn("non_field_errors", response.data)

    @override_settings(LEAD_RATE_LIMIT_COUNT=2, LEAD_RATE_LIMIT_WINDOW_SECONDS=60)
    def test_rate_limit_blocks_repeated_submissions_by_ip(self):
        first = self.client.post(self.endpoint, self.payload, format="json", REMOTE_ADDR="10.0.0.1")
        second = self.client.post(self.endpoint, {**self.payload, "phone": "77010000002"}, format="json", REMOTE_ADDR="10.0.0.1")
        third = self.client.post(self.endpoint, {**self.payload, "phone": "87010000003"}, format="json", REMOTE_ADDR="10.0.0.1")

        self.assertEqual(first.status_code, status.HTTP_201_CREATED)
        self.assertEqual(second.status_code, status.HTTP_201_CREATED)
        self.assertEqual(third.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_anonymous_user_cannot_list_leads(self):
        Lead.objects.create(name="Aidar", phone="+77011234567", email="a@example.com", message="Need cameras")

        response = self.client.get(self.endpoint)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_list_and_update_leads(self):
        user = get_user_model().objects.create_superuser("admin", "admin@example.com", "password")
        lead = Lead.objects.create(name="Aidar", phone="+77011234567", email="a@example.com", message="Need cameras")
        self.client.force_authenticate(user=user)

        list_response = self.client.get(self.endpoint)
        update_response = self.client.patch(f"{self.endpoint}{lead.id}/", {"status": Lead.Status.CONTACTED}, format="json")

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        lead.refresh_from_db()
        self.assertEqual(lead.status, Lead.Status.CONTACTED)

    def test_phone_accepts_optional_plus_spaces_and_77_or_87_prefix(self):
        for phone in ["+77011234567", "77011234567", "87011234567", "+7 701 123 45 67"]:
            response = self.client.post(self.endpoint, {**self.payload, "phone": phone}, format="json")

            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_phone_rejects_wrong_prefix_length_and_symbols(self):
        for phone in ["+76011234567", "7701123456", "770112345678", "77A11234567", "770-112-34567"]:
            response = self.client.post(self.endpoint, {**self.payload, "phone": phone}, format="json")

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn("phone", response.data)

    def test_email_rejects_invalid_symbols(self):
        for email in ["bad email@example.com", "bad,mail@example.com", "client@example"]:
            response = self.client.post(self.endpoint, {**self.payload, "email": email}, format="json")

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn("email", response.data)

    def test_public_user_can_subscribe_client_email(self):
        response = self.client.post("/api/clients/", {"email": "NEWS@example.com"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Client.objects.count(), 1)
        self.assertEqual(Client.objects.get().email, "news@example.com")

    def test_duplicate_client_email_is_idempotent(self):
        Client.objects.create(email="news@example.com")

        response = self.client.post("/api/clients/", {"email": "news@example.com"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Client.objects.count(), 1)

    def test_client_email_rejects_invalid_symbols(self):
        for email in ["bad email@example.com", "bad,mail@example.com", "client@example"]:
            response = self.client.post("/api/clients/", {"email": email}, format="json")

            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
            self.assertIn("email", response.data)

    def test_anonymous_user_cannot_list_clients(self):
        Client.objects.create(email="news@example.com")

        response = self.client.get("/api/clients/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
