from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Lead",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("company", models.CharField(blank=True, max_length=180)),
                ("phone", models.CharField(max_length=32)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("message", models.TextField(max_length=1000)),
                ("source_page", models.CharField(blank=True, max_length=255)),
                ("language", models.CharField(choices=[("en", "English"), ("ru", "Russian"), ("kk", "Kazakh")], default="ru", max_length=2)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("status", models.CharField(choices=[("new", "New"), ("contacted", "Contacted"), ("qualified", "Qualified"), ("rejected", "Rejected")], default="new", max_length=16)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="lead",
            index=models.Index(fields=["status", "created_at"], name="leads_lead_status_created_idx"),
        ),
        migrations.AddIndex(
            model_name="lead",
            index=models.Index(fields=["phone"], name="leads_lead_phone_idx"),
        ),
        migrations.AddIndex(
            model_name="lead",
            index=models.Index(fields=["email"], name="leads_lead_email_idx"),
        ),
    ]
