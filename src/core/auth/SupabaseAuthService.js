import { createClient } from "@supabase/supabase-js";

export class SupabaseAuthService {
  constructor() {
    const url = import.meta.env.VITE_SUPABASE_URL || "https://demo.supabase.co";
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "demo-anon-key";
    this.client = createClient(url, key);
  }

  async getAccessToken() {
    const { data } = await this.client.auth.getSession();
    return data.session?.access_token || null;
  }

  async signIn(email, password) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return this.client.auth.signOut();
  }
}
