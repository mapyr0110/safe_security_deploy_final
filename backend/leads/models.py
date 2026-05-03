from django.db import models


class Lead(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        QUALIFIED = "qualified", "Qualified"
        REJECTED = "rejected", "Rejected"

    class Language(models.TextChoices):
        ENGLISH = "en", "English"
        RUSSIAN = "ru", "Russian"
        KAZAKH = "kk", "Kazakh"

    name = models.CharField(max_length=120)
    company = models.CharField(max_length=180, blank=True)
    phone = models.CharField(max_length=32)
    email = models.EmailField(blank=True)
    message = models.TextField(max_length=1000)
    source_page = models.CharField(max_length=255, blank=True)
    language = models.CharField(max_length=2, choices=Language.choices, default=Language.RUSSIAN)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"], name="leads_lead_status_created_idx"),
            models.Index(fields=["phone"], name="leads_lead_phone_idx"),
            models.Index(fields=["email"], name="leads_lead_email_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.phone})"


class Client(models.Model):
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "client"
        verbose_name_plural = "clients"
        indexes = [
            models.Index(fields=["email"], name="leads_client_email_idx"),
        ]

    def __str__(self) -> str:
        return self.email
