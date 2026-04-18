import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { LeadPayload } from "@/types/lead";

/**
 * 留资接口：前台 LeadForm POST 过来，写进 Supabase `leads` 表。
 * 用 service-role 绕过 RLS —— 匿名用户不该有 INSERT 权限。
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<LeadPayload>;

    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from("leads").insert({
      name: body.name ?? null,
      email: body.email,
      telegram: body.telegram ?? null,
      company: body.company ?? null,
      message: body.message ?? null,
      source: body.source ?? "website",
    });

    if (error) {
      console.error("lead insert error:", error);
      return NextResponse.json(
        { success: false, message: "Failed to submit lead." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Lead received." });
  } catch (error) {
    console.error("lead route error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit lead." },
      { status: 500 }
    );
  }
}
