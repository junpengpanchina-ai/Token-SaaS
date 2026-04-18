import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSupabaseSession(request);
}

export const config = {
  matcher: [
    /*
     * 排除静态资源 / 图片 / favicon，其他全量走 session 刷新。
     * 不要把 auth/callback 排除 —— OAuth 回调必须经过这里才能落 cookie。
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
