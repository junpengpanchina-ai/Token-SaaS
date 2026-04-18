import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * 在 middleware 里刷新 / 延长 Supabase session。
 * 没有它，Server Component 读到的 session 会过期后拿不到。
 *
 * Supabase 没配置时直接放行（demo 模式）—— 前台照样可用，销售可演示。
 */
export async function updateSupabaseSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

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

  try {
    // 触发 session 刷新（必须 await，否则 cookie 不会被写入 response）
    await supabase.auth.getUser();
  } catch {
    // 任何异常都不阻塞请求，前台继续展示
  }

  return response;
}
