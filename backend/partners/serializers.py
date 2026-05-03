from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from config.validators import validate_email_symbols, validate_kazakhstan_phone

from .models import PartnerProfile


User = get_user_model()


class PartnerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = PartnerProfile
        fields = (
            "id",
            "email",
            "contact_name",
            "company_name",
            "bin_or_iin",
            "city",
            "phone",
            "website",
            "message",
            "approval_status",
            "manager_comment",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "email", "approval_status", "manager_comment", "created_at", "updated_at")


class PartnerApplicationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True, min_length=8, max_length=128)
    username = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=150)

    class Meta:
        model = PartnerProfile
        fields = (
            "id",
            "username",
            "email",
            "password",
            "contact_name",
            "company_name",
            "bin_or_iin",
            "city",
            "phone",
            "website",
            "message",
            "approval_status",
            "created_at",
        )
        read_only_fields = ("id", "approval_status", "created_at")

    def validate(self, attrs):
        email = validate_email_symbols(attrs["email"])
        username = (attrs.get("username") or email).strip()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": ["A user with this email already exists."]})
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username": ["A user with this username already exists."]})
        attrs["email"] = email
        attrs["username"] = username
        return attrs

    def validate_phone(self, value):
        return validate_kazakhstan_phone(value)

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data.pop("email")
        password = validated_data.pop("password", "")
        username = validated_data.pop("username")
        user = User.objects.create_user(username=username, email=email, password=password or None)
        if not password:
            user.set_unusable_password()
            user.save(update_fields=["password"])
        return PartnerProfile.objects.create(user=user, **validated_data)
