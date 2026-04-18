"use client";

import { createBrowserClient } from "@supabase/ssr";
import { assertSupabasePublicEnv, env } from "@/lib/env";

/**
 * 浏览器端 Supabase client。
 * 只在 Client Component 里用（需要 "use client"）。
 * Session 存在 cookie 里，被 middleware 和 server client 共用。
 */
export function createSupabaseBrowserClient() {
  assertSupabasePublicEnv();
  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}
