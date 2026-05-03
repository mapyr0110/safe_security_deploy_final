# Deployment

Frontend deploys to GitHub Pages. Backend deploys to Render.

## Frontend: GitHub Pages

1. In the GitHub repository, enable Pages with **GitHub Actions** as the source.
2. Add a repository variable or secret:
   - `VITE_API_BASE_URL=https://your-render-service.onrender.com/api`
3. Optional: add `VITE_BASE_PATH=/repo-name/` if the automatic GitHub Pages base path is not right. Use `/` for a custom domain or a `username.github.io` root site.
4. Push to `main` or run the `Deploy frontend to GitHub Pages` workflow manually.

The workflow runs `npm ci`, builds the Vite app, and copies `dist/index.html` to `dist/404.html` so direct page reloads work on GitHub Pages.

Product photos are served statically from `public/images` and resolved in the frontend. The backend is still the source for catalog data, blog text, leads, clients, partner requests, B2B endpoints, and Django admin.

## Backend: Render

Create the Render service from `render.yaml` and provide these environment values:

- `SECRET_KEY`
- `ALLOWED_HOSTS`, for example `your-render-service.onrender.com`
- `CSRF_TRUSTED_ORIGINS`, for example `https://your-render-service.onrender.com,https://your-github-user.github.io`
- `CORS_ALLOWED_ORIGINS`, for example `https://your-github-user.github.io`
- `DATABASE_URL`

Render also injects its external hostname; settings add it to `ALLOWED_HOSTS` and CSRF origins automatically when present.

The backend build runs:

```bash
pip install -r requirements.txt
python backend/manage.py collectstatic --noinput
python backend/manage.py migrate
```

Seed initial catalog/blog data when needed from an environment that has Node.js available:

```bash
python backend/manage.py import_frontend_catalog
```

That importer reads `src/shared/data/catalog.js` and does not copy product photos into backend media.
