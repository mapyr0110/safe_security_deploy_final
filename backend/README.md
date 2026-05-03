# Django Catalog Backend

This backend exposes Django REST Framework APIs for a security equipment catalog and public lead submissions.

## Install

```bash
pip install -r requirements.txt
```

## Run

```bash
python backend/manage.py migrate
python backend/manage.py runserver
```

## API

Catalog:

- `GET /api/categories/`
- `GET /api/categories/{slug}/`
- `GET /api/brands/`
- `GET /api/brands/{slug}/`
- `GET /api/products/`
- `GET /api/products/{slug}/`
- `GET /api/search/?q=&language=&category=&brand=`

Blog:

- `GET /api/blog/`
- `GET /api/blog/{slug}/`
- Only published posts are returned.
- Add `?language=en`, `?language=ru`, or `?language=kk` for localized title, excerpt, and body.
- List endpoint is paginated. Use `?page=` and `?page_size=`.

B2B partners:

- `POST /api/partners/apply/` public partner application. Creates a Django user and a pending partner profile.
- `GET /api/b2b/profile/` authenticated partner profile.
- `PATCH /api/b2b/profile/` authenticated partner profile update.
- `GET /api/b2b/prices/` approved partners only.
- `GET /api/b2b/documents/` approved partners only.

Partner approval statuses:

- `pending`
- `approved`
- `rejected`

Admins can approve/reject partner profiles in Django admin.

## Admin Content Management

Django admin is configured for catalog, leads, partners, and blog content.

Admin foundations:

- Products, categories, brands, product images, specifications, leads, partners, and blog posts have searchable list views.
- Catalog content uses `is_active` flags for safe removal from public APIs.
- Categories, brands, products, and blog posts auto-generate unique slugs when the slug is left blank.
- Catalog and blog content include audit fields: `created_by` and `updated_by`.
- Product photos used by the public frontend live statically in `public/images`; the API provides product data and the frontend maps known products to those static assets.
- Admin media uploads can still use `MEDIA_URL` / `MEDIA_ROOT` when enabled for backend-only content.
- Admin list pages include CSV export actions for import/export workflows.

## Import Current Frontend Data

Use this command to copy the current React catalog/blog data into Django admin-managed tables:

```bash
python backend/manage.py import_frontend_catalog
```

It imports or updates categories, brands, products, product specifications, and blog post cards.
Product photos stay in `public/images` and are not copied into `backend/media`.

Product filters:

- `GET /api/products/?category=ip-cameras`
- `GET /api/products/?brand=hikvision`
- `GET /api/products/?stock_status=in_stock`
- `GET /api/products/?is_featured=true`
- `GET /api/products/?price_min=10000&price_max=80000`
- `GET /api/products/?resolution=4MP`
- `GET /api/products/?camera_type=bullet`
- `GET /api/products/?recorder_channels=16`
- `GET /api/products/?has_poe=true`
- `GET /api/products/?ordering=newest`
- `GET /api/products/?ordering=price_asc`
- `GET /api/products/?ordering=price_desc`
- `GET /api/products/?ordering=name`

Filter options:

- `GET /api/catalog/filter-options/`
- Returns available categories, brands, stock statuses, resolutions, camera types, recorder channel counts, PoE options, and price range based on active products.

Search:

- `GET /api/search/?q=DS-2CD1041G2-LIU`
- `GET /api/search/?q=camera&category=ip-cameras`
- `GET /api/search/?q=Hikvision&brand=hikvision`
- Exact article matches are ranked before partial matches.
- Empty `q` returns an empty paginated result set.

Localization:

- Add `?language=en`, `?language=ru`, or `?language=kk`.

Leads:

- `POST /api/leads/` public lead submission
- `GET /api/leads/` admin-only list
- `GET /api/leads/{id}/` admin-only detail
- `PATCH /api/leads/{id}/` admin-only status/update

Public submissions support a hidden `website` or `honeypot` field. If either is filled, the request is rejected as spam.

## Tests

```bash
python backend/manage.py test catalog leads
```
