import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertSupabasePublicEnv, env } from "@/lib/env";

/**
 * Server Component / Route Handler / Server Action 里用的 Supabase client。
 * 会自动读写 cookie 里的 session。
 *
 * 注意：在纯 Server Component 里调用 set/remove 会抛错（Next 不允许 RSC 改 cookie），
 * 我们用 try/catch 吞掉 —— session 刷新交给 middleware 做。
 */
export function createSupabaseServerClient() {
  assertSupabasePublicEnv();
  const cookieStore = cookies();

  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Server Component 里不能 set cookie；middleware 会负责刷新
        }
      },
      remove(name: string, options) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch {
          // 同上
        }
      },
    },
  });
}
