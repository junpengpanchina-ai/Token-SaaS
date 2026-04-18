import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * 运行模式：
 * - authed: Supabase 已配 + 用户已登录（真实会话）
 * - anon:   Supabase 已配 + 用户未登录（需要引导登录）
 * - demo:   Supabase 未配 / 调用失败（演示模式 —— 前台继续可用，不跳转登录）
 */
export type AuthMode = "authed" | "anon" | "demo";

export type SessionResult = {
  user: User | null;
  mode: AuthMode;
};

/**
 * 永不 throw 的会话读取器。
 * 所有 server component / route handler 都应该走这个，不要直接用 createSupabaseServerClient。
 */
export async function getSession(): Promise<SessionResult> {
  if (!isSupabaseConfigured()) {
    return { user: null, mode: "demo" };
  }
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { user, mode: user ? "authed" : "anon" };
  } catch {
    // Supabase 配了但调用失败（网络 / 密钥错误 / cookie 坏）都降级为 demo
    return { user: null, mode: "demo" };
  }
}

/**
 * 仅判断是否处于可用的 auth 环境。
 * 用于 API 鉴权：demo 模式下直接放行 mock 数据。
 */
export function isAuthAvailable(): boolean {
  return isSupabaseConfigured();
}
