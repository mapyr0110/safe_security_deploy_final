import re

from rest_framework import serializers


EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$")
PHONE_RE = re.compile(r"^(77|87)\d{9}$")


def validate_email_symbols(value: str) -> str:
    email = value.strip().lower()
    if email and not EMAIL_RE.fullmatch(email):
        raise serializers.ValidationError("Enter a valid email address.")
    return email


def validate_kazakhstan_phone(value: str) -> str:
    phone = value.strip()
    compact = phone.replace(" ", "")
    normalized = compact[1:] if compact.startswith("+") else compact
    if not normalized.isdigit():
        raise serializers.ValidationError("Phone must contain only digits and spaces, with an optional leading plus.")
    if len(normalized) != 11:
        raise serializers.ValidationError("Phone must contain exactly 11 digits.")
    if not PHONE_RE.fullmatch(normalized):
        raise serializers.ValidationError("Phone must start with 77 or 87.")
    return phone
