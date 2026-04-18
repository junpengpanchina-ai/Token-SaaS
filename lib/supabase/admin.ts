import "server-only";
import { createClient } from "@supabase/supabase-js";
import { assertSupabaseServiceRoleEnv, env } from "@/lib/env";

/**
 * Service-role client —— 绕过 RLS，只能在服务端（Route Handler / Server Action）用。
 * 典型场景：
 *   - 写 leads 表（不想给匿名用户 INSERT 权限）
 *   - 后台 job
 *
 * 严禁在 Client Component 导入；顶部 "server-only" 会在构建时把这个文件锁死。
 */
export function createSupabaseAdminClient() {
  assertSupabaseServiceRoleEnv();
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
