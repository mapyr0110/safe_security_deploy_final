from django.conf import settings
from django.db import models


class PartnerProfile(models.Model):
    class ApprovalStatus(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, related_name="partner_profile", on_delete=models.CASCADE)
    contact_name = models.CharField(max_length=120, blank=True)
    company_name = models.CharField(max_length=180)
    bin_or_iin = models.CharField(max_length=32, blank=True)
    city = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=32)
    website = models.URLField(blank=True)
    message = models.TextField(blank=True)
    approval_status = models.CharField(max_length=16, choices=ApprovalStatus.choices, default=ApprovalStatus.PENDING)
    manager_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["approval_status"], name="partner_profile_status_idx"),
            models.Index(fields=["bin_or_iin"], name="partner_profile_bin_idx"),
        ]

    def __str__(self) -> str:
        return f"{self.company_name} ({self.get_approval_status_display()})"
