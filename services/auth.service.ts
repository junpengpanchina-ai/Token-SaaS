"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { env } from "@/lib/env";

/**
 * 业务侧的 auth 封装：
 * - UI 只调这里的函数，不直接 import supabase client
 * - 方便未来换成自己 gateway 的 /auth/login
 */

export async function signInWithGoogle(next: string = "/dashboard") {
  const supabase = createSupabaseBrowserClient();
  const redirectTo = `${env.siteUrl}/auth/callback?next=${encodeURIComponent(
    next
  )}`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        // 强制每次都显示选择账号，开发期比较友好
        prompt: "select_account",
      },
    },
  });

  if (error) throw error;
}
