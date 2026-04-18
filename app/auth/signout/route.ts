import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const url = new URL(request.url);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch {
      // 签出失败也没关系，cookie 会在下次刷新 session 时过期
    }
  }

  return NextResponse.redirect(new URL("/", url.origin), { status: 303 });
}
