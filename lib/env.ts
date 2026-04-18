/**
 * 集中读取环境变量。
 * - NEXT_PUBLIC_* 可以被浏览器读
 * - 没有 NEXT_PUBLIC_ 前缀的只在 server / route handler / server action 里用
 *
 * 原则：不在这里 throw。缺 key 时前端要优雅降级（demo 模式），
 * 而不是整站白屏。真正需要断言的地方用下面的 is* / assert* helper。
 */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000",
};

/** 前端 Supabase（anon）是否配齐 —— 影响登录、Dashboard、Navbar 状态 */
export function isSupabaseConfigured(): boolean {
  return !!(env.supabaseUrl && env.supabaseAnonKey);
}

/** 后端 Supabase（service role）是否配齐 —— 影响 /api/leads 写入 */
export function isSupabaseAdminConfigured(): boolean {
  return !!(env.supabaseUrl && env.supabaseServiceRoleKey);
}

export function assertSupabasePublicEnv() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. 请先在 .env.local 里填好。"
    );
  }
}

export function assertSupabaseServiceRoleEnv() {
  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Service role 只能在服务端使用。"
    );
  }
}
