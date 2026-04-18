import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * OAuth 回调：Google 登录成功后 Supabase 把用户回跳到这里，
 * 附带 ?code=xxx，我们用 code 换 session 并写入 cookie，再跳回目标页。
 *
 * Supabase 未配 / 交换失败都静默回首页，不白屏。
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/dashboard";
  const code = url.searchParams.get("code");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/", url.origin));
  }

  if (code) {
    try {
      const supabase = createSupabaseServerClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin)
        );
      }
    } catch {
      return NextResponse.redirect(new URL("/login?error=auth_unavailable", url.origin));
    }
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
