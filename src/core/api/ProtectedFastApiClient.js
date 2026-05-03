export class ProtectedFastApiClient {
  constructor({ baseUrl, authService }) {
    this.baseUrl = baseUrl;
    this.authService = authService;
  }

  async request(path, options = {}) {
    const token = await this.authService.getAccessToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      throw new Error(`FastAPI request failed: ${response.status}`);
    }

    return response.json();
  }

  get(path) {
    return this.request(path, { method: "GET" });
  }

  post(path, body) {
    return this.request(path, { method: "POST", body: JSON.stringify(body) });
  }

  put(path, body) {
    return this.request(path, { method: "PUT", body: JSON.stringify(body) });
  }

  delete(path) {
    return this.request(path, { method: "DELETE" });
  }
}
