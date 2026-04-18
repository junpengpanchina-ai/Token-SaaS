/**
 * 集中读取环境变量。
 * - NEXT_PUBLIC_* 可以被浏览器读
 * - 没有 NEXT_PUBLIC_ 前缀的只在 server / route handler / server action 里用
 *
 * 不在这里 throw，避免构建期 crash；在真正用到的地方（如 admin client）再断言。
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

export function assertSupabasePublicEnv() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. 请先在 .env.local 里填好。"
    );
  }
}

export function assertSupabaseServiceRoleEnv() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Service role 只能在服务端使用。"
    );
  }
}
