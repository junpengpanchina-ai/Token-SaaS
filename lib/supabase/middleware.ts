import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { assertSupabasePublicEnv, env } from "@/lib/env";

/**
 * 在 middleware 里刷新 / 延长 Supabase session。
 * 没有它，Server Component 读到的 session 会过期后拿不到。
 *
 * 这里只做 session 刷新，不做鉴权重定向 —— 鉴权放在具体页面的 Server Component
 * 里手动 redirect，避免 middleware 变成一个大 if-else 屎山。
 */
export async function updateSupabaseSession(request: NextRequest) {
  assertSupabasePublicEnv();

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  // 触发 session 刷新（必须 await，否则 cookie 不会被写入 response）
  await supabase.auth.getUser();

  return response;
}
