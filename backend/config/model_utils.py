from django.conf import settings
from django.db import models
from django.utils.text import slugify


class AuditFields(models.Model):
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="%(app_label)s_%(class)s_created",
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
        related_name="%(app_label)s_%(class)s_updated",
    )

    class Meta:
        abstract = True


def generate_unique_slug(instance, source_value, slug_field="slug", max_length=160):
    base_slug = slugify(source_value or "")[:max_length].strip("-") or "item"
    slug = base_slug
    counter = 2
    model = instance.__class__
    queryset = model.objects.all()
    if instance.pk:
        queryset = queryset.exclude(pk=instance.pk)

    while queryset.filter(**{slug_field: slug}).exists():
        suffix = f"-{counter}"
        slug = f"{base_slug[: max_length - len(suffix)]}{suffix}"
        counter += 1
    return slug
