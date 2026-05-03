const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

export class BackendApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message);
    this.name = "BackendApiError";
    this.status = status;
    this.data = data;
  }
}

function withLanguage(path, language) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}language=${encodeURIComponent(language)}`;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new BackendApiError("Backend server is unavailable.", { data: error });
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw new BackendApiError("Backend request failed.", {
      status: response.status,
      data: payload
    });
  }

  return payload;
}

export async function fetchCatalogBundle(language, signal) {
  const [categories, brands, products, blog] = await Promise.all([
    apiRequest(withLanguage("/categories/", language), { signal }),
    apiRequest("/brands/", { signal }),
    apiRequest(withLanguage("/products/?page_size=100", language), { signal }),
    apiRequest(withLanguage("/blog/?page_size=24", language), { signal })
  ]);

  return {
    categories: Array.isArray(categories) ? categories : categories.results || [],
    brands: Array.isArray(brands) ? brands : brands.results || [],
    products: Array.isArray(products) ? products : products.results || [],
    blogPosts: Array.isArray(blog) ? blog : blog.results || []
  };
}

export function fetchProduct(slug, language, signal) {
  return apiRequest(withLanguage(`/products/${encodeURIComponent(slug)}/`, language), { signal });
}

export function fetchBlogPost(slug, language, signal) {
  return apiRequest(withLanguage(`/blog/${encodeURIComponent(slug)}/`, language), { signal });
}

export function submitPartnerApplication(payload) {
  return apiRequest("/partners/apply/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function submitClient(payload) {
  return apiRequest("/clients/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function searchProducts(query, language, signal) {
  const params = new URLSearchParams({
    q: query,
    language
  });
  return apiRequest(`/search/?${params.toString()}`, { signal });
}

export function submitLead(payload) {
  return apiRequest("/leads/", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
