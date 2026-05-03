from rest_framework import serializers

from config.validators import validate_email_symbols, validate_kazakhstan_phone

from .models import Client, Lead


class LeadSerializer(serializers.ModelSerializer):
    honeypot = serializers.CharField(required=False, allow_blank=True, write_only=True)
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Lead
        fields = (
            "id",
            "name",
            "company",
            "phone",
            "email",
            "message",
            "source_page",
            "language",
            "created_at",
            "status",
            "honeypot",
            "website",
        )
        read_only_fields = ("id", "created_at", "status")

    def validate_name(self, value: str) -> str:
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return value

    def validate_phone(self, value: str) -> str:
        return validate_kazakhstan_phone(value)

    def validate_email(self, value: str) -> str:
        return validate_email_symbols(value)

    def validate_message(self, value: str) -> str:
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Message must be at least 3 characters long.")
        if len(value) > 1000:
            raise serializers.ValidationError("Message must be no more than 1000 characters long.")
        return value

    def validate(self, attrs: dict) -> dict:
        if attrs.pop("honeypot", "") or attrs.pop("website", ""):
            raise serializers.ValidationError({"non_field_errors": ["Spam protection rejected this request."]})
        return attrs


class LeadAdminSerializer(LeadSerializer):
    class Meta(LeadSerializer.Meta):
        read_only_fields = ("id", "created_at")


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ("id", "email", "created_at")
        read_only_fields = ("id", "created_at")
        extra_kwargs = {"email": {"validators": []}}

    def validate_email(self, value: str) -> str:
        return validate_email_symbols(value)
